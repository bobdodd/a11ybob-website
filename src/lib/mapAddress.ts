import { opensearch } from "./opensearch";

/* Nearest REAL indexed street address to a point.
 *
 * OSM carries house numbers SPARSELY — often only a scattering of buildings on a block,
 * or none at all. So this returns a nearby number as a LANDMARK to anchor yourself by
 * ("you're near number 120"), never an exact "you are AT 120". The number is a real
 * OSM `addr:housenumber` that exists on the ground — it is not interpolated (interpolated
 * estimates are a separate feature and are always spoken as "about number N").
 *
 * If `street` is given, an address ON that street is preferred, so the number matches the
 * road the caller has already named; otherwise the nearest addressed feature of any street
 * is returned (with its street, so the caller can name it). Returns null when nothing
 * addressed is close — in which case the caller simply says nothing (silence = not mapped). */

const INDEX = "map-features";

function metresBetween(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad;
  const dLng = (bLng - aLng) * rad * Math.cos(((aLat + bLat) / 2) * rad);
  return R * Math.sqrt(dLat * dLat + dLng * dLng);
}

export type NearAddress = { housenumber: string; street: string; distance_m: number };

export async function nearestAddress(
  lat: number, lng: number, street?: string, radiusM = 90,
): Promise<NearAddress | null> {
  const res = await opensearch.search({
    index: INDEX,
    body: {
      size: 30,
      query: {
        bool: {
          must: [{ exists: { field: "address.housenumber" } }],
          filter: [{ geo_distance: { distance: `${radiusM}m`, location: { lat, lon: lng } } }],
        },
      },
      sort: [{ _geo_distance: { location: { lat, lon: lng }, order: "asc", unit: "m", distance_type: "plane", mode: "min" } }],
      _source: ["address", "lat", "lng"],
    },
  });
  const hits = (res.body.hits?.hits as unknown as Array<{ _source: Record<string, unknown> }>) ?? [];
  const norm = (s?: string) => (s ?? "").trim().toLowerCase();
  const want = norm(street);
  const rows = hits
    .map((h) => {
      const a = (h._source.address ?? {}) as { housenumber?: string; street?: string };
      return {
        housenumber: String(a.housenumber ?? "").trim(),
        street: String(a.street ?? "").trim(),
        d: metresBetween(lat, lng, h._source.lat as number, h._source.lng as number),
      };
    })
    .filter((r) => r.housenumber);
  if (!rows.length) return null;
  // Prefer an address on the named street; fall back to the nearest of any street.
  const onStreet = want ? rows.filter((r) => norm(r.street) === want) : [];
  const pool = onStreet.length ? onStreet : rows;
  const best = pool.sort((a, b) => a.d - b.d)[0];
  return { housenumber: best.housenumber, street: best.street, distance_m: Math.round(best.d) };
}

/* ── Interpolated ("about number N") estimate ──────────────────────────────────
 *
 * Where OSM numbers a block only at its ENDS with an addr:interpolation way ("500…560
 * run along here, odd side"), we can estimate the number at any point by projecting the
 * point onto that line. This is an ESTIMATE, not a real on-the-ground number, so the
 * caller must ALWAYS speak it as "about number N" — never "at" or "near". It's a fallback
 * used only where nearestAddress finds no real number, to give a positional anchor on
 * blocks that were never explicitly numbered. */

export type ApproxAddress = { number: string; street: string; distance_m: number };

// Pull the [lng,lat] vertex list out of the compact geom the tiler stores ({t,c:[ring,...]}).
function lineCoords(geom: unknown): number[][] | null {
  const g = geom as { c?: number[][][] } | undefined;
  if (!g || !Array.isArray(g.c) || !g.c.length) return null;
  const ring = g.c[0];
  return Array.isArray(ring) && ring.length >= 2 ? ring : null;
}

// Nearest point on a polyline (coords are [lng,lat]) to (lat,lng): returns the fractional
// arc-length position (0 = first vertex → 1 = last) and the perpendicular distance in metres.
// Local planar approximation, exact enough at street scale; longitude scaled by cos(lat) so
// X and Y share one ground metric.
function projectOntoLine(lat: number, lng: number, coords: number[][]): { frac: number; dist: number } {
  const rad = Math.PI / 180, cosLat = Math.cos(lat * rad);
  const seg = coords.map(([lo, la]) => [lo * cosLat, la]);
  const px = lng * cosLat, py = lat;
  let total = 0;
  const cum = [0];
  for (let i = 1; i < seg.length; i++) {
    total += Math.hypot(seg[i][0] - seg[i - 1][0], seg[i][1] - seg[i - 1][1]);
    cum.push(total);
  }
  let bestD2 = Infinity, bestArc = 0;
  for (let i = 1; i < seg.length; i++) {
    const ax = seg[i - 1][0], ay = seg[i - 1][1];
    const dx = seg[i][0] - ax, dy = seg[i][1] - ay;
    const len2 = dx * dx + dy * dy || 1e-12;
    let t = ((px - ax) * dx + (py - ay) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const cx = ax + t * dx, cy = ay + t * dy;
    const d2 = (px - cx) * (px - cx) + (py - cy) * (py - cy);
    if (d2 < bestD2) { bestD2 = d2; bestArc = cum[i - 1] + t * Math.hypot(dx, dy); }
  }
  const frac = total > 0 ? bestArc / total : 0;
  const dist = Math.sqrt(bestD2) * rad * 6371000; // scaled degrees → metres
  return { frac, dist };
}

// Round an interpolated value to a number valid for the range: OSM addr:interpolation is
// 'odd' | 'even' | 'all' | an integer step. Result is clamped into [from,to].
function snapToStep(raw: number, from: number, to: number, step?: string): number {
  const lo = Math.min(from, to), hi = Math.max(from, to);
  let n = Math.round(raw);
  const s = (step ?? "all").toLowerCase();
  if (s === "odd" && n % 2 === 0) n += raw >= n ? 1 : -1;
  else if (s === "even" && Math.abs(n % 2) === 1) n += raw >= n ? 1 : -1;
  else if (/^\d+$/.test(s)) { const k = parseInt(s, 10); if (k > 1) n = from + k * Math.round((raw - from) / k); }
  return Math.max(lo, Math.min(hi, n));
}

export async function interpolatedAddress(
  lat: number, lng: number, street?: string, radiusM = 90,
): Promise<ApproxAddress | null> {
  const res = await opensearch.search({
    index: INDEX,
    body: {
      size: 20,
      query: {
        bool: {
          must: [{ term: { kind: "interpolation" } }],
          filter: [{ geo_distance: { distance: `${radiusM}m`, location: { lat, lon: lng } } }],
        },
      },
      sort: [{ _geo_distance: { location: { lat, lon: lng }, order: "asc", unit: "m", distance_type: "plane", mode: "min" } }],
      _source: ["interp", "geom", "lat", "lng"],
    },
  });
  const hits = (res.body.hits?.hits as unknown as Array<{ _source: Record<string, unknown> }>) ?? [];
  if (!hits.length) return null;
  const norm = (s?: string) => (s ?? "").trim().toLowerCase();
  const want = norm(street);

  const rows: ApproxAddress[] = [];
  for (const h of hits) {
    const s = h._source;
    const interp = (s.interp ?? {}) as { from?: string; to?: string; step?: string; street?: string };
    const from = Number(interp.from), to = Number(interp.to);
    if (!Number.isFinite(from) || !Number.isFinite(to)) continue;
    const line = lineCoords(s.geom);
    let frac = 0.5, d: number;
    if (line) { const p = projectOntoLine(lat, lng, line); frac = p.frac; d = p.dist; }
    else d = metresBetween(lat, lng, s.lat as number, s.lng as number);
    const num = snapToStep(from + frac * (to - from), from, to, interp.step);
    rows.push({ number: String(num), street: String(interp.street ?? "").trim(), distance_m: Math.round(d) });
  }
  if (!rows.length) return null;
  const onStreet = want ? rows.filter((r) => norm(r.street) === want) : [];
  const pool = onStreet.length ? onStreet : rows;
  return pool.sort((a, b) => a.distance_m - b.distance_m)[0];
}
