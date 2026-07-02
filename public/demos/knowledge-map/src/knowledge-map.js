// Knowledge Map (v2, unlisted testing demo) — screen-reader-first.
//
// Ask what's KNOWN about a place — here (GPS), a name you type, or raw coordinates —
// and get short, CITED Wikipedia blurbs from /api/place-knowledge (a traffic-warmed
// cache in front of Wikipedia). We narrate the stored extracts verbatim and always
// state the source + freshness — no model, no invention. Results are built as real
// DOM (textContent), so Wikipedia text can never inject markup.

class KnowledgeMap {
    constructor() {
        this.gate = document.getElementById('km-gate');
        this.app = document.getElementById('km-app');
        this.status = document.getElementById('km-status');
        this.results = document.getElementById('km-results');
        this.live = document.getElementById('km-live');

        const accept = document.getElementById('km-accept');
        const start = document.getElementById('km-start');
        accept.addEventListener('change', () => { start.disabled = !accept.checked; });
        start.addEventListener('click', () => this.start());

        document.getElementById('km-place-go').addEventListener('click', () => this.lookupPlace());
        document.getElementById('km-place').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); this.lookupPlace(); }
        });
        document.getElementById('km-here').addEventListener('click', () => this.lookupHere());
        document.getElementById('km-coords-go').addEventListener('click', () => this.lookupCoords());
    }

    start() {
        this.gate.hidden = true;
        this.app.hidden = false;
        document.getElementById('km-app-title').focus();
        this.setStatus('Ready. Look up a place, use your location, or enter coordinates.');
    }

    // ── Query paths ──────────────────────────────────────────────────────────
    lookupPlace() {
        const q = document.getElementById('km-place').value.trim();
        if (!q) { this.setStatus('Type a place name first.'); return; }
        this.fetchKnowledge({ q }, `“${q}”`);
    }

    lookupCoords() {
        const lat = parseFloat(document.getElementById('km-lat').value);
        const lng = parseFloat(document.getElementById('km-lng').value);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) { this.setStatus('Enter a valid latitude and longitude.'); return; }
        this.fetchKnowledge({ lat, lng }, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }

    lookupHere() {
        if (!('geolocation' in navigator)) { this.setStatus('Location is not available on this device.'); return; }
        this.setStatus('Finding your location…');
        navigator.geolocation.getCurrentPosition(
            (pos) => this.fetchKnowledge({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 'your location'),
            (err) => this.setStatus('Could not get your location: ' + err.message),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
        );
    }

    // ── Fetch + render ───────────────────────────────────────────────────────
    async fetchKnowledge(params, label) {
        this.setStatus('Looking up what’s known about ' + label + '…');
        this.results.replaceChildren();
        const qs = new URLSearchParams();
        for (const [k, v] of Object.entries(params)) qs.set(k, String(v));
        let data;
        try {
            const res = await fetch('/api/place-knowledge?' + qs.toString());
            data = await res.json();
            if (!res.ok) { this.setStatus(data.error || 'Something went wrong.'); return; }
        } catch (e) {
            this.setStatus('Could not reach the server.');
            return;
        }
        this.render(data, label);
    }

    render(data, label) {
        const where = data.resolved ? data.resolved.display : label;
        const articles = data.articles || [];
        if (!articles.length) {
            this.setStatus('Nothing is mapped in Wikipedia near ' + where + ' yet. That doesn’t mean there’s nothing there — just nothing recorded.');
            return;
        }

        // Provenance + freshness line.
        const prov = document.createElement('p');
        prov.className = 'km-provenance';
        prov.textContent = `${articles.length} ${articles.length === 1 ? 'entry' : 'entries'} known near ${where}. From Wikipedia — ${this.freshness(data.fetchedAt)}.`;
        this.results.appendChild(prov);

        // Each cited article.
        for (const a of articles) {
            const art = document.createElement('article');
            art.className = 'km-article';

            const h = document.createElement('h3');
            h.textContent = a.title;
            art.appendChild(h);

            const p = document.createElement('p');
            p.textContent = a.extract;
            art.appendChild(p);

            const meta = document.createElement('p');
            meta.className = 'km-meta';
            if (typeof a.distance_m === 'number') {
                meta.append(document.createTextNode(this.distance(a.distance_m) + ' · '));
            }
            const link = document.createElement('a');
            link.href = a.url;
            link.target = '_blank';
            link.rel = 'noopener';
            link.textContent = 'Read on Wikipedia (opens in a new window)';
            meta.appendChild(link);
            art.appendChild(meta);

            this.results.appendChild(art);
        }

        const lead = articles[0];
        const spoken = `${articles.length} ${articles.length === 1 ? 'entry' : 'entries'} known near ${where}. `
            + `Nearest, ${this.distance(lead.distance_m)}: ${lead.title}. ${lead.extract} `
            + `From Wikipedia, ${this.freshness(data.fetchedAt)}.`;
        this.setStatus(`Found ${articles.length} near ${where}.`);
        this.speak(spoken);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    distance(m) {
        if (typeof m !== 'number') return '';
        return m < 1000 ? `about ${Math.round(m / 10) * 10} metres away` : `about ${(m / 1000).toFixed(1)} km away`;
    }

    freshness(iso) {
        if (!iso) return 'freshness unknown';
        const ms = Date.now() - new Date(iso).getTime();
        const day = 24 * 60 * 60 * 1000;
        if (ms < 5 * 60 * 1000) return 'fetched just now';
        if (ms < day) return 'cached earlier today';
        const days = Math.round(ms / day);
        return `cached ${days} ${days === 1 ? 'day' : 'days'} ago`;
    }

    setStatus(msg) {
        this.status.textContent = msg;
        this.live.textContent = msg;
    }

    speak(text) {
        // The rendered results are the accessible record; this is an extra spoken read
        // for eyes-free use. Latest-wins, like the other demos.
        try {
            if (!('speechSynthesis' in window)) { this.live.textContent = text; return; }
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.rate = 1.0;
            window.speechSynthesis.speak(u);
        } catch (_) {
            this.live.textContent = text;
        }
    }
}

new KnowledgeMap();
