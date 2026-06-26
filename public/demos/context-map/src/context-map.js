// Context Map — a screen-reader-first, NO-GRAPHICS reading of your surroundings.
// Three controls (Quick describe / Describe as I move / Detailed surroundings) over
// the same orientation backend as the visual maps (/api/map-nearby), but with no map:
// the spoken output IS the interface. Gated behind a liability disclaimer the user
// must accept first.
//
// Reuses LocationTracker (GPS) and HeadingProvider (compass + GPS course-over-ground,
// so a miscalibrated phone compass doesn't mislead while you're moving). The describe
// logic mirrors the tiled map; the only differences here are: no filters are passed
// (the API ranks by significance + proximity by default), and the Detailed read-out
// renders as navigable headings/lists instead of a modal.
import { LocationTracker } from './LocationTracker.js';
import { HeadingProvider } from './HeadingProvider.js';

class ContextMap {
    constructor() {
        this.locationTracker = new LocationTracker();
        this.heading = new HeadingProvider();
        this.started = false;
        this.autoDescribe = false;

        // Pick ONE speech channel up front and never mix them. Where the Web Speech API
        // is usable we speak through it (cancel-before-speak, so a newer message INTERRUPTS
        // the current one instead of queuing). Where it is NOT — a de-Googled phone like
        // GrapheneOS, which omits it or exposes no voice — we use the assertive live region
        // instead, and the user's own screen reader speaks every message. The live region
        // MUST NOT run while Web Speech is in use, or a screen-reader user hears it twice;
        // _probeSpeech() makes that single decision and speak()/speakSequence() honour it.
        this.synth = ('speechSynthesis' in window) ? window.speechSynthesis : null;
        this._speechOk = false;       // API present AND has a usable voice? (set by _probeSpeech)
        this._probeSpeech();

        // proximity / turn state
        this.lastProximityPos = null;
        this.lastProximityTime = 0;
        this._lastRoadId = null;
        this._lastSpokenId = null;
        this._lastNearby = [];
        this._lastNearbyPos = null;
        this._autoTO = null;
        this._lastFacing = null;
        this._hHist = [];        // recent {t, h} headings — turn "settled" is judged from their spread
        this._wakeLock = null;   // screen wake lock held while Describe-as-I-move is on

        this.locationTracker.onUpdate((p) => this.handleLocationUpdate(p));
        this.locationTracker.onError((e) => {
            // A geolocation TIMEOUT is transient — the watch keeps trying and will deliver
            // a fix once the GPS locks (cold start / rural). Don't alarm the user; the
            // describe buttons already say "Waiting for GPS" when there's no fix yet. Only
            // surface a real problem (permission denied, position genuinely unavailable).
            if (e.code === 3) return;   // 3 = TIMEOUT
            this.announceStatus('Location problem: ' + (e.message || 'unavailable') + '.');
        });

        this.setupGate();
        this.setupControls();

        // A screen wake lock is auto-released whenever the page is hidden; re-acquire it
        // on return to the foreground while the map is open.
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && this.started) this._acquireWakeLock();
        });
    }

    // ── Disclaimer gate ───────────────────────────────────────────────────────
    // The Start button is disabled until the checkbox is ticked; Start is also the
    // user gesture iOS/Android need to grant location + compass permission.
    setupGate() {
        const accept = document.getElementById('cm-accept');
        const start = document.getElementById('cm-start');
        if (accept && start) {
            accept.addEventListener('change', () => { start.disabled = !accept.checked; });
            start.addEventListener('click', () => this.start());
        }
    }

    async start() {
        const gate = document.getElementById('cm-gate');
        const app = document.getElementById('cm-app');
        if (gate) gate.hidden = true;
        if (app) {
            app.hidden = false;
            const h = document.getElementById('cm-app-title');
            if (h) h.focus();
        }
        this.started = true;
        this.locationTracker.startTracking();
        this.heading.start();   // inside the Start gesture, so the permission prompt is allowed
        // Keep the screen awake for the whole session (Start is the user gesture the API
        // needs). The start message reports whether the lock actually engaged, so a user
        // can tell at once — absence of the phrase means the browser refused/can't do it.
        const awake = await this._acquireWakeLock();
        this.announceStatus('Context Map started. Finding your location — give it a moment, then use the buttons.'
            + (awake ? ' Note: to keep the running description working, the screen will stay on until you change apps or close the page.' : ''));
    }

    setupControls() {
        const q = document.getElementById('cm-quick');
        if (q) q.addEventListener('click', () => this.quickDescribe());
        const a = document.getElementById('cm-auto');
        if (a) a.addEventListener('click', (e) => this.toggleAutoDescribe(e.currentTarget));
        const d = document.getElementById('cm-detailed');
        if (d) d.addEventListener('click', () => this.detailedDescribe());
    }

    handleLocationUpdate(position) {
        this.heading.setGpsCourse(position.heading, position.speed);
        this.maybeAnnounceProximity(position);
    }

    // ── QUICK describe ────────────────────────────────────────────────────────
    async quickDescribe() {
        const pos = this.locationTracker.getCurrentPosition();
        if (!pos) { this.announceStatus('Waiting for GPS — try again in a moment.'); return; }
        const near = await this.fetchNearby(pos.lat, pos.lng, 4);
        this._lastNearby = near;
        this._lastNearbyPos = { lat: pos.lat, lng: pos.lng };
        if (!near.length) { this.announceStatus('Nothing notable nearby.'); return; }
        const onRoad = this._onRoad(near, pos);
        const heading = this.heading.getHeading();
        const parts = [];
        if (heading !== null) parts.push(`Facing ${this.cardinal(heading)}`);
        if (onRoad) parts.push(`on ${onRoad.display}`);
        const f = near.find((x) => x !== onRoad);
        if (f) parts.push(`${f.display} ${this._where(pos, f)}, ${this.phraseDistance(f.distance_m)}`);
        const msg = (parts.join(', ') || 'Location found') + '.';
        this.announceStatus(msg);
    }

    // ── DETAILED surroundings (rendered as navigable text, plus spoken) ─────────
    async detailedDescribe() {
        const pos = this.locationTracker.getCurrentPosition();
        if (!pos) { this.announceStatus('Waiting for GPS — try again in a moment.'); return; }
        const { results, summary } = await this._fetchArea(pos.lat, pos.lng, 10);
        const near = results.filter((f) => f.distance_m <= 3000);
        this._lastNearby = near;
        this._lastNearbyPos = { lat: pos.lat, lng: pos.lng };
        const area = this._areaCharacter(summary);   // "feel of the space" lead-in (may be null)
        if (!near.length && !area) { this.announceStatus('Nothing notable nearby.'); return; }
        const { parts, html } = this._describeSurround(pos, near, area);
        this.speakSequence(parts);                // queued short utterances — full read-out, not cut off
        this.renderDetail(html);                  // structured, re-readable block
    }

    // ── AUTO describe (running commentary, incl. rotation) ──────────────────────
    async maybeAnnounceProximity(position) {
        if (!this.autoDescribe) return;
        const now = Date.now();
        if (now - this.lastProximityTime < 8000) return;
        if (this.lastProximityPos) {
            const moved = this.locationTracker.calculateDistance(
                this.lastProximityPos.lat, this.lastProximityPos.lng, position.lat, position.lng);
            if (moved < 12) return;
        }
        const near = await this.fetchNearby(position.lat, position.lng, 5);
        if (!near.length) return;
        this._lastNearby = near;
        this._lastNearbyPos = { lat: position.lat, lng: position.lng };
        const onRoad = this._onRoad(near, position);
        let msg = null, id = null;
        if (onRoad && ('road:' + onRoad.id) !== this._lastRoadId) {
            msg = `On ${onRoad.display}.`; id = 'road:' + onRoad.id; this._lastRoadId = id;
        } else {
            const f = near.find((x) => x.significance >= 2 && x.id !== this._lastSpokenId
                && !(onRoad && x.id === onRoad.id) && x.distance_m <= 120);
            if (f) { msg = `${f.display} ${this._where(position, f)}, ${this.phraseDistance(f.distance_m)}.`; id = f.id; }
        }
        if (!msg) return;
        this._lastSpokenId = id;
        this.lastProximityPos = { lat: position.lat, lng: position.lng };
        this.lastProximityTime = now;
        this.announceStatus(msg);
    }

    toggleAutoDescribe(button) {
        this.autoDescribe = !this.autoDescribe;
        button.setAttribute('aria-pressed', this.autoDescribe);
        if (this.autoDescribe) {
            this.heading.start();
            this._lastFacing = null; this._hHist = [];
            this._lastRoadId = null; this._lastSpokenId = null;
            this.lastProximityTime = 0; this.lastProximityPos = null;
            this._startAutoHeadingWatch();
            this.announceStatus('Describing as you move. I will call out where you are, and tell you when you turn.');
        } else {
            this._stopAutoHeadingWatch();
            this.announceStatus('Stopped the running description.');
        }
    }

    _startAutoHeadingWatch() { this._stopAutoHeadingWatch(); this._autoTick(); }
    _stopAutoHeadingWatch() { if (this._autoTO) { clearTimeout(this._autoTO); this._autoTO = null; } }

    // Screen Wake Lock — keep the screen (and so this page) awake while the Context Map
    // is open, so Describe-as-I-move doesn't die on the screen idle-timeout. Only helps
    // while the Context Map is the FOREGROUND, on-screen app: the lock is auto-released
    // when the page is hidden (we re-acquire on return), and continuous background
    // operation (another app foreground, or screen off in a pocket) is NOT possible for a
    // web page. Returns whether the lock is now held (so callers can tell the user).
    async _acquireWakeLock() {
        if (this._wakeLock) return true;
        if (!('wakeLock' in navigator)) return false;
        try {
            this._wakeLock = await navigator.wakeLock.request('screen');
            this._wakeLock.addEventListener('release', () => { this._wakeLock = null; });
            return true;
        } catch (_) {
            this._wakeLock = null;   // refused (e.g. low battery) — not fatal
            return false;
        }
    }

    // Rotation IS movement: announce a turn once the compass has SETTLED, so being spun
    // in a crowd re-orients you to your new facing without re-querying.
    _autoTick() {
        if (!this.autoDescribe) return;
        // Decide "have I turned, and stopped?" from the NET displacement of the heading
        // across a short window — the mean of its OLDER half vs the mean of its NEWER
        // half. Means are the whole point: standing-still jitter AND hand/body sway both
        // oscillate around a centre (they come back), so the two halves average to nearly
        // the same value -> net ~0 -> settled; a real turn moves the centre, so the halves
        // disagree -> still turning. (The earlier spread test mistook that sway for
        // perpetual motion and so almost never announced.)
        //   SETTLE_BAND — net shift between the half-means under which rotation is "stopped"
        //   TURN_MIN    — net turn since the last call-out before it's worth announcing
        const SETTLE_MS = 700, SETTLE_BAND = 20, TURN_MIN = 45;
        const h = this.heading.getHeading();
        if (h !== null && h !== undefined) {
            const now = Date.now();
            this._hHist.push({ t: now, h });
            while (this._hHist.length && now - this._hHist[0].t > SETTLE_MS) this._hHist.shift();
            if (this._hHist.length >= 4 && now - this._hHist[0].t >= SETTLE_MS * 0.7) {
                const mid = now - SETTLE_MS / 2;
                const older = this._hHist.filter((e) => e.t < mid);
                const newer = this._hHist.filter((e) => e.t >= mid);
                if (older.length && newer.length) {
                    const mO = this._circMean(older), mN = this._circMean(newer);
                    if (Math.abs(this._angDiff(mN, mO)) <= SETTLE_BAND) {       // settled: centre held
                        if (this._lastFacing === null) {
                            this._lastFacing = mN;                              // baseline; no call-out yet
                        } else if (Math.abs(this._angDiff(mN, this._lastFacing)) >= TURN_MIN) {
                            this._announceTurn(mN, this._angDiff(mN, this._lastFacing));
                            this._lastFacing = mN;
                        }
                    }
                }
            }
        }
        this._autoTO = setTimeout(() => this._autoTick(), 175);
    }

    // Circular mean heading (degrees) of a set of {h} samples — averaged in sin/cos space
    // so the 360->0 wrap doesn't poison it (mean of 350 and 10 is 0, not 180).
    _circMean(samples) {
        let sx = 0, sy = 0;
        for (const e of samples) { const r = e.h * Math.PI / 180; sx += Math.cos(r); sy += Math.sin(r); }
        return (Math.atan2(sy, sx) * 180 / Math.PI + 360) % 360;
    }

    _announceTurn(facing, signed) {
        const dir = signed > 0 ? 'right' : 'left';
        const a = Math.abs(signed);
        let mag;
        if (a >= 150) mag = 'turned right around';
        else if (a >= 110) mag = `a big turn to your ${dir}`;
        else if (a >= 65) mag = `a quarter-turn to your ${dir}`;
        else mag = `a small turn to your ${dir}`;
        let msg = `Now facing ${this.cardinal(facing)} — ${mag}.`;
        const pos = this.locationTracker.getCurrentPosition() || this._lastNearbyPos;
        if (pos && this._lastNearby.length) {
            const re = this._lastNearby.slice(0, 2).map((f) => `${f.display} ${this._where(pos, f)}`);
            if (re.length) msg += ' ' + re.join('; ') + '.';
        }
        this.announceStatus(msg);
    }

    _angDiff(a, b) { return ((((a - b) % 360) + 540) % 360) - 180; }

    _where(pos, f) {
        const d = this._relClock(pos, f);
        return d.hour ? `at ${d.hour} o'clock` : `to the ${d.cardinal}`;
    }

    _relClock(pos, f) {
        const bearing = this.locationTracker.calculateBearing(pos.lat, pos.lng, f.lat, f.lng);
        const heading = this.heading.getHeading();
        if (heading !== null) {
            const rel = (((bearing - heading) % 360) + 360) % 360;
            const hour = Math.round(rel / 30) || 12;
            let bucket;
            if (rel < 60 || rel >= 300) bucket = 'ahead';
            else if (rel < 120) bucket = 'right';
            else if (rel < 240) bucket = 'behind';
            else bucket = 'left';
            return { hour, cardinal: null, bucket };
        }
        const card = this.cardinal(bearing);
        return { hour: null, cardinal: card, bucket: card };
    }

    // The nearest road we're confidently ON — within ON_ROAD_M, and ONLY when the GPS
    // fix is accurate enough to mean it. A coarse first fix (poor accuracy, common right
    // after Start before the GPS locks) near a rural road would otherwise keep claiming
    // you're "on" it until you move; if we can't locate ourselves to within ON_ROAD_M we
    // can't claim to be on a road that close, so report nothing.
    _onRoad(near, pos) {
        const ON_ROAD_M = 30;
        if (pos && typeof pos.accuracy === 'number' && pos.accuracy > ON_ROAD_M) return null;
        return near.find((f) => f.category === 'road' && f.distance_m <= ON_ROAD_M) || null;
    }

    _describeSurround(pos, near, area) {
        const onRoad = this._onRoad(near, pos);
        const heading = this.heading.getHeading();
        const lead = [];
        if (heading !== null) lead.push(`Facing ${this.cardinal(heading)}`);
        if (onRoad) lead.push(`on ${onRoad.display}`);
        const leadLine = lead.length ? lead.join(', ') + '.' : 'Location found.';

        const order = heading !== null
            ? ['ahead', 'right', 'behind', 'left']
            : ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
        const labels = { ahead: 'Ahead', right: 'To your right', behind: 'Behind you', left: 'To your left' };

        const groups = {};
        for (const f of near) {
            if (f === onRoad) continue;
            const d = this._relClock(pos, f);
            (groups[d.bucket] ||= []).push({ f, d });
        }

        const speechParts = [leadLine];
        const htmlParts = [`<p>${this._esc(leadLine)}</p>`];
        if (area) {                               // area-character "feel of the space" lead-in
            speechParts.push(area);
            htmlParts.push(`<p class="cm-area">${this._esc(area)}</p>`);
        }
        for (const key of order) {
            const items = groups[key];
            if (!items || !items.length) continue;
            const label = labels[key] || ('To the ' + key);
            const phrases = items.map(({ f, d }) => {
                const dist = this.phraseDistance(f.distance_m);
                const clock = d.hour ? `, ${d.hour} o'clock` : '';
                // ONE string for both ear and eye — what you hear is what you see.
                const text = `${f.display}, ${dist}${clock}`;
                return { speech: text, html: `<li>${this._esc(text)}</li>` };
            });
            speechParts.push(`${label}: ${phrases.map((p) => p.speech).join('; ')}`);
            htmlParts.push(`<h3>${this._esc(label)}</h3><ul>${phrases.map((p) => p.html).join('')}</ul>`);
        }
        return { parts: speechParts, html: htmlParts.join('') };
    }

    // ── AREA CHARACTER (Detailed lead-in) ───────────────────────────────────────
    // Turn the API's area-character counts into a one-line "feel of the space". PRESENCE
    // ONLY — never claim absence, since OSM tagging is uneven (kerbs especially are
    // sparsely mapped, so silence ≠ none). Phase 1: urban density from already-indexed
    // categories; rural water/landuse richness is Phase 2 (needs index changes).
    // Thresholds + wording are a first cut, meant to be tuned on real output.
    _areaCharacter(s) {
        if (!s) return null;
        const cat = s.categories || {}, sub = s.subtypes || {}, acc = s.access || {};
        const sum = (m, keys) => keys.reduce((a, k) => a + (m[k] || 0), 0);
        const shops = cat.shop || 0;
        const food = sum(sub, ['cafe', 'restaurant', 'fast_food', 'food_court', 'bar', 'pub', 'ice_cream', 'biergarten']);
        const crossings = sum(sub, ['signalized_crossing', 'uncontrolled_crossing', 'marked_crossing', 'zebra_crossing', 'crossing']);
        const transit = (cat.transit || 0) + (cat.transport || 0);
        const parks = cat.park || 0;
        const benches = sub.bench || 0;
        const tactile = acc.tactile_paving || 0;
        const kerbs = acc.kerb_lowered || 0;
        const stepfree = acc.wheelchair || 0;

        const clauses = [];

        const retail = [];
        if (shops >= 25) retail.push('a major shopping area, dozens of shops');
        else if (shops >= 10) retail.push('a busy retail area, lots of shops');
        else if (shops >= 4) retail.push('several shops');
        else if (shops >= 1) retail.push('a shop or two');
        if (food >= 10) retail.push('plenty of places to eat');
        else if (food >= 4) retail.push('several places to eat');
        else if (food >= 1) retail.push('somewhere to eat');
        if (retail.length) clauses.push(retail.join(', '));

        const a11y = [];
        if (crossings >= 1) {
            let c = crossings >= 15 ? 'lots of pedestrian crossings'
                : crossings >= 5 ? 'several pedestrian crossings'
                    : `${crossings} pedestrian crossing${crossings === 1 ? '' : 's'}`;
            if (tactile >= Math.max(3, crossings * 0.3)) c += ', many with tactile paving';
            else if (tactile >= 1) c += ', some with tactile paving';
            a11y.push(c);
        }
        if (kerbs >= 3) a11y.push('dropped kerbs mapped nearby');
        if (stepfree >= 20) a11y.push('many step-free places');
        else if (stepfree >= 5) a11y.push('several step-free places');
        if (a11y.length) clauses.push(a11y.join(', '));

        if (transit >= 8) clauses.push('lots of transit stops nearby');
        else if (transit >= 3) clauses.push(`${transit} transit stops nearby`);
        else if (transit >= 1) clauses.push('a transit stop nearby');

        const rest = [];
        if (parks >= 3) rest.push('several green spaces');
        else if (parks >= 1) rest.push('green space nearby');
        if (benches >= 8) rest.push('plenty of seating');
        else if (benches >= 3) rest.push('some seating');
        if (rest.length) clauses.push(rest.join(', '));

        if (!clauses.length) return null;   // sparse — Phase 2 adds water / landuse richness here

        let lead;
        if (shops >= 10 || food >= 8) lead = 'A busy, built-up area';
        else if (shops + food + crossings >= 6) lead = 'A mixed, walkable area';
        else if ((s.total || 0) <= 15) lead = 'A quiet spot';
        else lead = 'A mostly residential area';
        return `${lead}: ${clauses.join('; ')}.`;
    }

    // ── Output ─────────────────────────────────────────────────────────────────
    // speak(): the screen-reader channel (a polite live region). announceStatus():
    // speak + log a visible line. renderDetail(): a navigable structured block.
    // Decide the speech channel ONCE: Web Speech is "usable" when the API exists AND
    // offers at least one voice. A de-Googled build reports none, which routes us to the
    // live region. Voices can populate asynchronously, so re-decide if 'voiceschanged'
    // fires. This is the only place the choice is made — there is no per-utterance
    // fallback, so the live region can never run alongside a working Web Speech engine.
    _probeSpeech() {
        if (!this.synth) return;
        const decide = () => { this._speechOk = this.synth.getVoices().length > 0; };
        decide();
        if (typeof this.synth.addEventListener === 'function') this.synth.addEventListener('voiceschanged', decide);
    }

    speak(message) {
        if (this.synth && this._speechOk) {
            // Latest-wins: drop whatever is queued or mid-sentence, then speak the new
            // message. This is the whole point — when you turn fast, you hear where you
            // are NOW, not a backlog of where you were.
            this.synth.cancel();
            this.synth.speak(new SpeechSynthesisUtterance(message));
            return;
        }
        this._announceLive(message);
    }

    // The screen-reader channel: an assertive, atomic live region, so the user's own AT
    // speaks the message in their own voice and a newer message interrupts the current
    // one (latest-wins — the same intent as speechSynthesis.cancel()).
    _announceLive(message) {
        const live = document.getElementById('cm-live');
        if (live) { live.textContent = ''; live.textContent = message; }
    }

    // Speak a multi-part read-out (the Detailed surroundings): cancel prior speech ONCE,
    // then queue each part as its own short utterance. Splitting avoids the browser
    // silently cutting off a single long utterance (the "last bullet missed" bug); a
    // newer message still interrupts the whole sequence (its cancel() clears the queue).
    speakSequence(parts) {
        if (this.synth && this._speechOk) {
            this.synth.cancel();
            for (const p of parts) this.synth.speak(new SpeechSynthesisUtterance(p));
            return;
        }
        this._announceLive(parts.join('. ') + '.');
    }

    announceStatus(message) {
        this.speak(message);
        const log = document.getElementById('cm-log');
        if (log) {
            const p = document.createElement('p');
            p.className = 'cm-line';
            p.textContent = message;
            log.insertBefore(p, log.firstChild);
            while (log.children.length > 12) log.removeChild(log.lastChild);
        }
    }

    renderDetail(html) {
        const out = document.getElementById('cm-detail');
        if (!out) return;
        out.innerHTML = html;
    }

    async fetchNearby(lat, lng, limit) {
        try {
            const qs = new URLSearchParams({ lat: String(lat), lng: String(lng), limit: String(limit) });
            if (this.heading.isMoving()) qs.set('moving', '1');
            const res = await fetch(`/api/map-nearby?${qs.toString()}`);
            if (!res.ok) return [];
            const data = await res.json();
            return data.results || [];
        } catch (_) {
            return [];
        }
    }

    // Like fetchNearby but also asks for the area-character summary (Detailed read-out).
    async _fetchArea(lat, lng, limit) {
        try {
            const qs = new URLSearchParams({ lat: String(lat), lng: String(lng), limit: String(limit), summary: '1' });
            if (this.heading.isMoving()) qs.set('moving', '1');
            const res = await fetch(`/api/map-nearby?${qs.toString()}`);
            if (!res.ok) return { results: [], summary: null };
            const data = await res.json();
            return { results: data.results || [], summary: data.summary || null };
        } catch (_) {
            return { results: [], summary: null };
        }
    }

    cardinal(bearing) {
        const dirs = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
        return dirs[Math.round(((bearing % 360) + 360) % 360 / 45) % 8];
    }

    phraseDistance(metres) {
        if (metres < 8) return 'right here';
        if (metres < 1000) return `${Math.round(metres / 5) * 5} metres`;
        return `${(metres / 1000).toFixed(1)} kilometres`;
    }

    _esc(s) {
        return String(s).replace(/[&<>"']/g, (c) =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }
}

new ContextMap();
