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

        // proximity / turn state
        this.lastProximityPos = null;
        this.lastProximityTime = 0;
        this._lastRoadId = null;
        this._lastSpokenId = null;
        this._lastNearby = [];
        this._lastNearbyPos = null;
        this._autoTO = null;
        this._lastFacing = null;
        this._settleH = null;
        this._settleStart = 0;

        this.locationTracker.onUpdate((p) => this.handleLocationUpdate(p));
        this.locationTracker.onError((e) =>
            this.announceStatus('Location problem: ' + (e.message || 'unavailable') + '.'));

        this.setupGate();
        this.setupControls();
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

    start() {
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
        this.announceStatus('Context Map started. Finding your location — give it a moment, then use the buttons.');
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
        const onRoad = near.find((f) => f.category === 'road' && f.distance_m <= 30);
        const heading = this.heading.getHeading();
        const parts = [];
        if (heading !== null) parts.push(`Facing ${this.cardinal(heading)}`);
        if (onRoad) parts.push(`on ${onRoad.display}`);
        const f = near.find((x) => x !== onRoad);
        if (f) parts.push(`${f.display} ${this._where(pos, f)}, ${this.phraseDistance(f.distance_m)}`);
        this.announceStatus((parts.join(', ') || 'Location found') + '.');
    }

    // ── DETAILED surroundings (rendered as navigable text, plus spoken) ─────────
    async detailedDescribe() {
        const pos = this.locationTracker.getCurrentPosition();
        if (!pos) { this.announceStatus('Waiting for GPS — try again in a moment.'); return; }
        const near = (await this.fetchNearby(pos.lat, pos.lng, 10)).filter((f) => f.distance_m <= 3000);
        this._lastNearby = near;
        this._lastNearbyPos = { lat: pos.lat, lng: pos.lng };
        if (!near.length) { this.announceStatus('Nothing notable nearby.'); return; }
        const { speech, html } = this._describeSurround(pos, near);
        this.speak(speech);                       // announce to the screen reader
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
        const onRoad = near.find((f) => f.category === 'road' && f.distance_m <= 30);
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
            this._lastFacing = null; this._settleH = null;
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

    // Rotation IS movement: announce a turn once the compass settles (~1s), so being
    // spun in a crowd re-orients you to your new facing without re-querying.
    _autoTick() {
        if (!this.autoDescribe) return;
        const h = this.heading.getHeading();
        if (h !== null && h !== undefined) {
            if (this._settleH === null || Math.abs(this._angDiff(h, this._settleH)) > 12) {
                this._settleH = h; this._settleStart = Date.now();
            } else if (Date.now() - this._settleStart > 900) {
                if (this._lastFacing === null) {
                    this._lastFacing = h;
                } else if (Math.abs(this._angDiff(h, this._lastFacing)) >= 30) {
                    this._announceTurn(h, this._angDiff(h, this._lastFacing));
                    this._lastFacing = h;
                }
            }
        }
        this._autoTO = setTimeout(() => this._autoTick(), 400);
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

    _describeSurround(pos, near) {
        const onRoad = near.find((f) => f.category === 'road' && f.distance_m <= 30);
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
        for (const key of order) {
            const items = groups[key];
            if (!items || !items.length) continue;
            const label = labels[key] || ('To the ' + key);
            const phrases = items.map(({ f, d }) => {
                const dist = this.phraseDistance(f.distance_m);
                const at = d.hour ? ` (${d.hour} o'clock)` : '';
                return {
                    speech: `${f.display}, ${dist}`,
                    html: `<li>${this._esc(f.display)}, ${dist}${at}</li>`,
                };
            });
            speechParts.push(`${label}: ${phrases.map((p) => p.speech).join('; ')}`);
            htmlParts.push(`<h3>${this._esc(label)}</h3><ul>${phrases.map((p) => p.html).join('')}</ul>`);
        }
        return { speech: speechParts.join('. ') + '.', html: htmlParts.join('') };
    }

    // ── Output ─────────────────────────────────────────────────────────────────
    // speak(): the screen-reader channel (a polite live region). announceStatus():
    // speak + log a visible line. renderDetail(): a navigable structured block.
    speak(message) {
        const live = document.getElementById('cm-live');
        if (live) { live.textContent = ''; live.textContent = message; }
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
