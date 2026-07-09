/* Tool implementations for the Conversational Map (/api/context-chat).
 *
 * Four tools the LLM (Haiku) calls against the `map-features` OpenSearch index. The
 * governing principle: every tool returns geometry ALREADY COMPUTED — distance in
 * metres, a compass bearing, and (when a heading is supplied) a clock-face relative
 * direction — so the model never estimates distances or directions itself. Its job is
 * choosing what to ask for and how to phrase it; the geo math lives here.
 *
 * These are deliberately self-contained (they don't import the existing map-nearby /
 * map-search route code) so the live orientation routes stay untouched. The query
 * shapes mirror those routes. */

import { opensearch } from "@/lib/opensearch";
import { nearestAddress, interpolatedAddress } from "@/lib/mapAddress";
import { phoneticKeys } from "@/lib/phonetic";

const INDEX = "map-features";

// ── geo helpers ──────────────────────────────────────────────────────────────
// Raw geometry stored on each doc: c = arrays of rings, each ring a list of [lon,lat].
type Geom = { t: string; c: number[][][] };
type Near = { dist: number; lat: number; lng: number };

// Equirectangular metres — plenty accurate at the metres-to-km scale here.
export function metresBetween(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad;
  const dLng = (bLng - aLng) * rad * Math.cos(((aLat + bLat) / 2) * rad);
  return R * Math.sqrt(dLat * dLat + dLng * dLng);
}

function nearestOnSeg(
  pLat: number, pLng: number,
  aLat: number, aLng: number, bLat: number, bLng: number,
): Near {
  const R = 6371000, rad = Math.PI / 180, coslat = Math.cos(pLat * rad);
  const ax = (aLng - pLng) * rad * coslat * R, ay = (aLat - pLat) * rad * R;
  const bx = (bLng - pLng) * rad * coslat * R, by = (bLat - pLat) * rad * R;
  const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
  let t = len2 > 0 ? -(ax * dx + ay * dy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  return { dist: Math.sqrt(cx * cx + cy * cy), lat: aLat + t * (bLat - aLat), lng: aLng + t * (bLng - aLng) };
}

// Nearest point on a (multi)line / polygon-ring geometry to P — so distance is to the
// EDGE of a feature, not its centroid (you can stand 20 m from a long road whose middle
// is 600 m away).
function nearestOnGeom(pLat: number, pLng: number, geom: Geom): Near {
  let best: Near = { dist: Infinity, lat: pLat, lng: pLng };
  for (const ring of geom.c) {
    if (ring.length === 1) {
      const d = metresBetween(pLat, pLng, ring[0][1], ring[0][0]);
      if (d < best.dist) best = { dist: d, lat: ring[0][1], lng: ring[0][0] };
      continue;
    }
    for (let i = 0; i + 1 < ring.length; i++) {
      const a = ring[i], b = ring[i + 1];
      const r = nearestOnSeg(pLat, pLng, a[1], a[0], b[1], b[0]);
      if (r.dist < best.dist) best = r;
    }
  }
  return best;
}

const COMPASS = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"];

// Compass bearing (degrees + word) from A to B.
function bearing(aLat: number, aLng: number, bLat: number, bLng: number): { deg: number; compass: string } {
  const rad = Math.PI / 180;
  const y = Math.sin((bLng - aLng) * rad) * Math.cos(bLat * rad);
  const x = Math.cos(aLat * rad) * Math.sin(bLat * rad) -
    Math.sin(aLat * rad) * Math.cos(bLat * rad) * Math.cos((bLng - aLng) * rad);
  const deg = (Math.atan2(y, x) / rad + 360) % 360;
  return { deg: Math.round(deg), compass: COMPASS[Math.round(deg / 45) % 8] };
}

// Clock-face direction RELATIVE to the way the user is facing — the demo's existing idiom
// ("2 o'clock"). Only meaningful when a heading is known.
function clockFromHeading(bearingDeg: number, headingDeg: number): string {
  const rel = ((bearingDeg - headingDeg) % 360 + 360) % 360;
  const h = Math.round(rel / 30) % 12;
  return `${h === 0 ? 12 : h} o'clock`;
}

// Direction fields a result carries: always compass; clock too when a heading is given.
export function direction(
  fromLat: number, fromLng: number, toLat: number, toLng: number, heading?: number,
): { bearing?: string; clock?: string } {
  const b = bearing(fromLat, fromLng, toLat, toLng);
  // When the user's facing is known, give the CLOCK direction ONLY (relative to the way they
  // face — what a walker needs) and NEVER the compass name, so the model can't fall back to
  // "north / south-west". A compass bearing is returned only when there's no heading.
  return heading != null ? { clock: clockFromHeading(b.deg, heading) } : { bearing: b.compass };
}

// Drop explicit negatives so an access filter means "IS accessible by that measure",
// not merely "the tag exists".
function accessFilter(tag: string): Record<string, unknown> {
  return {
    bool: {
      must: [{ exists: { field: `access.${tag}` } }],
      must_not: [{ term: { [`access.${tag}`]: "no" } }, { term: { [`access.${tag}`]: "none" } }],
    },
  };
}
// The friendly accessibility keywords the tools accept → the index tag(s) that satisfy them.
const ACCESS_KEYS: Record<string, string> = {
  wheelchair: "wheelchair",
  tactile_paving: "tactile_paving",
  step_free: "ramp",
};

// Faceting: a requested type → the OSM subtype/category VALUES that satisfy it. OSM splits food
// shops finely (supermarket vs grocery vs convenience vs greengrocer), so "supermarket"/"grocery"
// in everyday speech must reach the whole family — a small-town Foodland is a `supermarket`, a
// corner shop a `convenience`. A term not listed here is used as-is (matched on subtype OR
// category), so any OSM value still works directly.
const TYPE_FACETS: Record<string, string[]> = {
  supermarket: ["supermarket", "grocery", "convenience", "greengrocer", "general"],
  grocery: ["supermarket", "grocery", "convenience", "greengrocer", "general"],
  groceries: ["supermarket", "grocery", "convenience", "greengrocer", "general"],
  food: ["supermarket", "grocery", "convenience", "greengrocer", "general", "bakery", "deli", "butcher"],
  pharmacy: ["pharmacy", "chemist"],
  chemist: ["pharmacy", "chemist"],
  drugstore: ["pharmacy", "chemist"],
  cafe: ["cafe", "coffee_shop"],
  coffee: ["cafe", "coffee_shop"],
  restaurant: ["restaurant", "fast_food", "food_court"],
  bank: ["bank"],
  atm: ["atm", "bank"],
  fuel: ["fuel"],
  gas: ["fuel"],
  petrol: ["fuel"],
  doctor: ["doctors", "clinic"],
  hospital: ["hospital"],
};
function expandTypes(types: string[]): string[] {
  const out = new Set<string>();
  for (const t of types) {
    const k = (t ?? "").toLowerCase().trim();
    if (!k) continue;
    for (const v of TYPE_FACETS[k] ?? [k]) out.add(v);
  }
  return [...out];
}

type Hit = { _id: string; _score?: number; _source: Record<string, unknown> };
const hitsOf = (res: { body: { hits?: { hits?: unknown } } }): Hit[] =>
  (res.body.hits?.hits as unknown as Hit[]) ?? [];

// Anonymous map features (kind 'building' / 'path') — nameless buildings + paths the national
// reindex added for description richness. They're kept OUT of the NAMED result lists (find_place,
// the "what's around" named list) via this guard, and surfaced DELIBERATELY as separate, typed,
// secondary context instead: whats_nearby returns the nearest anon building/path, area_summary
// counts them for building density. So the named answers stay clean while the richness gets used.
const EXCLUDE_ANON = { bool: { must_not: { terms: { kind: ["building", "path"] } } } };

// The nearest anonymous feature of a kind to a point — a nameless building (with its size_class)
// or an unnamed path (with its subtype: track / footway / …). Nearest-point-on-geom for linear
// paths. Returned as secondary context, never mixed into the named result list.
async function nearestAnon(
  kind: "building" | "path" | "obstacle", lat: number, lon: number, radiusM: number, heading?: number,
): Promise<Record<string, unknown> | null> {
  const res = await opensearch.search({
    index: INDEX,
    body: {
      size: 1,
      query: { bool: { filter: [{ term: { kind } }, { geo_distance: { distance: `${radiusM}m`, location: { lat, lon } } }] } },
      sort: [{ _geo_distance: { location: { lat, lon }, order: "asc", unit: "m", distance_type: "plane", mode: "min" } }],
      _source: ["display", "subtype", "size_class", "lat", "lng", "geom"],
    },
  });
  const h = hitsOf(res)[0];
  if (!h) return null;
  const s = h._source;
  const geom = s.geom as Geom | undefined;
  const near: Near = geom ? nearestOnGeom(lat, lon, geom)
    : { dist: metresBetween(lat, lon, s.lat as number, s.lng as number), lat: s.lat as number, lng: s.lng as number };
  return {
    kind,
    ...(s.display ? { display: String(s.display) } : {}),
    ...(s.size_class ? { size_class: String(s.size_class) } : {}),
    ...(s.subtype ? { subtype: String(s.subtype) } : {}),
    distance_m: Math.round(near.dist),
    ...direction(lat, lon, near.lat, near.lng, heading),
  };
}

// Closeness folded into relevance: final = textScore × (1 + GEO_BOOST × proximity), where
// proximity is a gauss 1→0 with distance. Two things matter about the floor (the constant 1):
//   • A far-off match keeps its FULL text score (×1), so a distinctive distant place still
//     surfaces — "where is the CN Tower" works from another city. (The old code multiplied
//     by the bare gauss, which ZEROED anything past ~15 km — that was the real bug.)
//   • A nearby match is multiplied UP, so among many same-name matches across the country
//     (every "Tim Hortons", every "Hannaford"/"Handford" street) the closest one rises to the
//     top — and into the candidate pool in the first place. It's a relative multiplier, so it
//     doesn't depend on the absolute scale of BM25 scores.
// GEO_BOOST is kept below ~2 so a clearly-better distant match (much higher text score) still
// beats a weak nearby one.
const GEO_BOOST = 1.5;
function withGeoBoost(
  query: Record<string, unknown>,
  near?: { lat: number; lon: number },
): Record<string, unknown> {
  if (!near) return query;
  return {
    function_score: {
      query,
      functions: [
        { weight: 1 }, // floor: every match keeps its full text score even when far away
        { gauss: { location: { origin: { lat: near.lat, lon: near.lon }, scale: "3km", offset: "100m", decay: 0.5 } }, weight: GEO_BOOST },
      ],
      score_mode: "sum", // 1 + GEO_BOOST·proximity
      boost_mode: "multiply", // × textScore
    },
  };
}

// ── Address lookup ("121 King West", "121 King Street West") ─────────────────
//
// addr:housenumber and addr:street are KEYWORD fields — they match only a query string equal to
// the WHOLE field value, so a multi-word query never touches them. That leaves the number to the
// unboosted `text` field while the street type trips the road-boost below, and the ROAD outranks
// the address every time: "121 King Street West" returned nothing but King Street West segments,
// and whatever was asked next got measured from an arbitrary point on a 5 km road.
//
// So resolve an address STRUCTURALLY. Take the leading number off, put the rest through the
// ordinary road search — which already handles abbreviations, typos and phonetic spellings
// ("King West" and "Kings Street West" both reach "King Street West") — and use the road's
// canonical name as the exact addr:street key. Returns null when the query isn't an address or
// the number isn't mapped, so find_place falls through to its normal behaviour.
//
// Known gap: a street the user abbreviates to a name that IS a distinct road ("King St W"
// resolves to a road actually named "King Street W") keys an addr:street nobody wrote, finds
// nothing, and falls through to the road. Rephrasing works; an alias table would be the fix.
const ADDRESS_RE = /^\s*(\d+[a-zA-Z]?)\s+(.{2,})$/;

// The canonical name(s) of the road(s) the caller means — the spelling OSM's addr:street uses.
async function resolveStreetNames(street: string, near?: { lat: number; lon: number }): Promise<string[]> {
  const roadQuery = {
    bool: {
      filter: [{ term: { category: "road" } }],
      must: [{
        multi_match: {
          query: street, type: "best_fields", fields: ["display^3", "name^3"],
          fuzziness: "AUTO", max_expansions: 10, minimum_should_match: "2<-1",
        },
      }],
    },
  };
  const res = await opensearch.search({
    index: INDEX,
    body: { size: 8, timeout: "5s", query: withGeoBoost(roadQuery, near), _source: ["name", "display"] },
  });
  const names: string[] = [];
  for (const h of hitsOf(res)) {
    const n = String((h._source.name ?? h._source.display ?? "") as string).trim();
    if (n && !names.includes(n)) names.push(n);
    if (names.length >= 3) break;
  }
  return names;
}

async function addressLookup(
  q: string, filter: unknown[], limit: number,
  near?: { lat: number; lon: number }, heading?: number,
) {
  const m = ADDRESS_RE.exec(q);
  if (!m) return null;
  const [, rawNumber, rawStreet] = m;

  const streets = await resolveStreetNames(rawStreet, near);
  if (!streets.length) return null;

  const numbers = [...new Set([rawNumber, rawNumber.toUpperCase()])];
  const addrQuery = {
    bool: {
      must: [
        { terms: { "address.housenumber": numbers } },
        { terms: { "address.street": streets } },
      ],
      filter,
    },
  };
  const res = await opensearch.search({
    index: INDEX,
    // 40, not `limit`: every tenant of an office tower carries the same address, and they're
    // folded into ONE result below — fetching only `limit` would truncate the occupant list.
    body: {
      size: 40, timeout: "10s", query: withGeoBoost(addrQuery, near),
      _source: ["name", "display", "category", "subtype", "types", "parent", "address", "access", "info", "lat", "lng"],
    },
  });
  const hits = hitsOf(res);
  if (!hits.length) return null;

  // One result per distinct address — the same number+street exists in more than one city, and
  // the geo boost has already put the caller's city first.
  const groups = new Map<string, Hit[]>();
  for (const h of hits) {
    const a = (h._source.address ?? {}) as Record<string, string>;
    const where = a.city ?? `${(h._source.lat as number).toFixed(3)},${(h._source.lng as number).toFixed(3)}`;
    const key = `${where}|${a.street ?? ""}|${a.housenumber ?? ""}`;
    const bucket = groups.get(key);
    if (bucket) bucket.push(h);
    else groups.set(key, [h]);
  }

  const results = [];
  for (const group of groups.values()) {
    if (results.length >= limit) break;
    const src = group.map((h) => h._source);
    const a0 = (src.find((s) => s.address)?.address ?? {}) as { housenumber?: string; street?: string; city?: string };

    // The building is the name every occupant points at (`parent`); failing that, a named feature
    // typed as a building. People give the street number precisely because they don't recall the
    // name — "121 King West" should come back saying Roserock Place.
    const tally = new Map<string, number>();
    for (const s of src) {
      const p = (s.parent as string) ?? "";
      if (p) tally.set(p, (tally.get(p) ?? 0) + 1);
    }
    const building =
      [...tally.entries()].sort((x, y) => y[1] - x[1])[0]?.[0] ??
      (src.find((s) => s.name && ((s.types as string[]) ?? []).some((t) => /building/i.test(t)))?.name as string | undefined) ??
      "";

    const at = [...new Set(src.map((s) => (s.name as string) ?? "").filter((n) => n && n !== building))];

    // The bare address node sits exactly on the number; a tenant's node is metres off it.
    const anchor = src.find((s) => !s.name && s.subtype === "address") ?? src[0];
    const lat = anchor.lat as number, lng = anchor.lng as number;

    results.push({
      display: `${a0.housenumber} ${a0.street}`.trim() + (building ? ` — ${building}` : ""),
      category: anchor.category as string | undefined,
      subtype: (anchor.subtype as string) || undefined,
      lat, lng,
      ...(near ? { distance_m: Math.round(metresBetween(near.lat, near.lon, lat, lng)), ...direction(near.lat, near.lon, lat, lng, heading) } : {}),
      // The same number+street repeats in other cities; name the settlement so they can be told apart.
      ...(a0.city ? { in: a0.city } : {}),
      ...(building ? { building } : {}),
      ...(at.length ? { at_address: at } : {}),
      ...(anchor.access ? { access: anchor.access } : {}),
      ...(anchor.info ? { info: anchor.info } : {}),
    });
  }
  return { results };
}

// ── Tool 1: find_place (geocode + finder) ────────────────────────────────────
export async function findPlace(args: {
  query: string;
  near?: { lat: number; lon: number };
  accessibility?: string;
  heading?: number;
  limit?: number;
}) {
  const q = (args.query ?? "").trim();
  if (q.length < 2) return { results: [] };
  const limit = Math.min(10, Math.max(1, args.limit ?? 5));

  const filter: unknown[] = [EXCLUDE_ANON];
  const accTag = args.accessibility ? ACCESS_KEYS[args.accessibility] : undefined;
  if (accTag) filter.push(accessFilter(accTag));

  // A house number can't be matched by the text search below (keyword fields), so try the
  // structural address path first. Null → not an address, or the number isn't mapped: fall through.
  const addr = await addressLookup(q, filter, limit, args.near, args.heading);
  if (addr) return addr;

  // Fuzzy text relevance so speech-to-text misspellings still match: a dropped or added letter
  // ("Hanaford" for "Hannaford") is one edit, well inside AUTO's tolerance.
  // Street-aware search. A street type in the query (St/Street, Ave, Rd, Dr, Blvd, Lane…) means the
  // user wants a ROAD, so boost roads matching the BASE name (the query minus the street-type and
  // direction words) ABOVE similarly-spelled POIs — that's what buried "Gerrard Street East" under
  // the "Gerrard"/"Girard" POIs. Stripping the direction also lets "Gerrard Street" match both
  // "Gerrard Street East" and "…West" (the general name covers its directional halves).
  const STREET_TYPES = /\b(st|street|ave|avenue|rd|road|dr|drive|blvd|boulevard|ln|lane|cres|crescent|crt|court|ct|way|trail|terrace|terr|pl|place|cir|circle|hwy|highway|pkwy|parkway|sq|square|gardens|gdns|close|walk|row|line|sideroad|concession)\b/i;
  const isStreet = STREET_TYPES.test(q);
  const baseName = isStreet
    ? q.replace(new RegExp(STREET_TYPES.source, "gi"), " ")
       .replace(/\b(e|east|w|west|n|north|s|south|ne|nw|se|sw)\b/gi, " ")
       .replace(/\s+/g, " ").trim()
    : "";
  const shoulds: unknown[] = [];
  if (isStreet && baseName.length >= 2) {
    // Road-boost: float the actual road above similarly-spelled POIs.
    shoulds.push({ bool: {
      filter: [{ term: { category: "road" } }],
      must: [{ multi_match: { query: baseName, type: "best_fields", fields: ["display^3", "name^3"], fuzziness: "AUTO", max_expansions: 10 } }],
      boost: 8,
    } });
  }
  // Phonetic candidate source (accent / Deaf-voice). ADDITIVE and modest — it surfaces
  // same-sounding names (Girard↔Gerrard↔Gerard); the geo function-score then scopes them to the
  // anchor (GPS for "here", or the resolved AREA for a place elsewhere), which is what picks the
  // right one. Never a filter, so it can't flood the results.
  const phon = phoneticKeys(isStreet && baseName ? baseName : q);
  if (phon.length) {
    shoulds.push({ terms: { name_phonetic: phon, boost: 4 } });
    if (isStreet) shoulds.push({ bool: { filter: [{ term: { category: "road" } }], must: [{ terms: { name_phonetic: phon } }], boost: 6 } });
  }

  const textQuery: Record<string, unknown> = {
    bool: {
      must: {
        dis_max: {
          queries: [
            {
              multi_match: {
                query: q, type: "best_fields",
                fields: ["display^4", "name^3", "address.street^2", "address.housenumber^2", "types", "text"],
                fuzziness: "AUTO",
                // Cap fuzzy expansion (default 50/term/field). A long conversational phrase
                // ("south end of Hannaford St on Kingston Road") otherwise fans out to
                // thousands of term queries and minutes of scoring — seen live 2026-07-05.
                max_expansions: 10,
                // Require (nearly) all terms. Without this, "Gerrard Street" is an OR: the
                // low-IDF "street" alone matches MILLIONS of docs, every one then geo-scored —
                // 10–16 s per query, and past the timeout it returned partial junk (nearby
                // address nodes instead of the road). With it: ~200 ms, right answer. ≤2 terms
                // → all required; longer queries may drop one. A sloppy whole-sentence query
                // now returns empty fast — the model then retries with just the name, which
                // the find_place schema tells it to do.
                minimum_should_match: "2<-1",
              },
            },
            { match_phrase_prefix: { display: { query: q, boost: 2, max_expansions: 10 } } },
          ],
          tie_breaker: 0.3,
        },
      },
      ...(shoulds.length ? { should: shoulds } : {}),
      filter,
    },
  };

  // When we have an anchor (the user's location — the route injects it even if the model
  // forgets), fold CLOSENESS into the relevance score so the LOCAL match wins.
  const query = withGeoBoost(textQuery, args.near);

  const res = await opensearch.search({
    index: INDEX,
    // timeout: stop scoring and return the best partials rather than grinding on — a capped
    // answer beats a hung one for a user standing on a street corner. 15s, NOT lower: street
    // queries (any query containing "street"/"road" matches millions of docs through the text
    // field, each geo-scored) legitimately run 10–12s, and cutting one off mid-scoring returns
    // partial junk — seen live: "Gerrard Street" answered with nearby address nodes at 10s.
    body: { size: Math.min(60, Math.max(40, limit * 6)), timeout: "15s", query, _source: ["osm_id", "name", "display", "category", "subtype", "lat", "lng", "address", "access", "parent", "info"] },
  });

  // Returned best-first (closeness already folded in above). Drop near-duplicate copies of the
  // same named feature (OSM splits long roads into segments), keeping the best-ranked instance.
  const kept: { name: string; lat: number; lng: number }[] = [];
  const results = [];
  for (const h of hitsOf(res)) {
    const s = h._source;
    const lat = s.lat as number, lng = s.lng as number;
    const name = ((s.name as string) ?? "").trim().toLowerCase();
    if (name && kept.some((k) => k.name === name && metresBetween(k.lat, k.lng, lat, lng) < 60)) continue;
    if (name) kept.push({ name, lat, lng });
    const dir = args.near ? direction(args.near.lat, args.near.lon, lat, lng, args.heading) : {};
    results.push({
      display: (s.display as string) ?? "",
      category: s.category as string | undefined,
      subtype: (s.subtype as string) || undefined,
      lat, lng,
      ...(args.near ? { distance_m: Math.round(metresBetween(args.near.lat, args.near.lon, lat, lng)), ...dir } : {}),
      ...(s.parent ? { in: s.parent as string } : {}),
      ...(s.access ? { access: s.access } : {}),
      ...(s.info ? { info: s.info } : {}),   // heritage / hours / phone / website / wikipedia link
    });
    if (results.length >= limit) break;
  }
  return { results };
}

// The nearest named road to a point — the street a POI sits on/beside ("Foodland on Buckhorn Road").
async function nearestNamedRoad(lat: number, lon: number, radiusM = 250): Promise<string | null> {
  const r = await opensearch.search({
    index: INDEX,
    body: {
      size: 1,
      query: { bool: { must: [{ term: { category: "road" } }, { exists: { field: "name" } }], filter: [{ geo_distance: { distance: `${radiusM}m`, location: { lat, lon } } }] } },
      sort: [{ _geo_distance: { location: { lat, lon }, order: "asc", unit: "m", distance_type: "plane", mode: "min" } }],
      _source: ["display"],
    },
  });
  const s = hitsOf(r)[0]?._source;
  return s ? (String(s.display ?? "") || null) : null;
}

// The nearest settlement to a point — the place a POI is in ("in Buckhorn").
const SETTLEMENT_RANKS = ["city", "town", "village", "hamlet", "suburb", "neighbourhood", "quarter", "locality", "isolated_dwelling"];
async function nearestSettlement(lat: number, lon: number, radiusM = 20000): Promise<string | null> {
  const r = await opensearch.search({
    index: INDEX,
    body: {
      size: 1,
      query: { bool: { must: [{ term: { category: "place" } }, { terms: { subtype: SETTLEMENT_RANKS } }, { exists: { field: "name" } }], filter: [{ geo_distance: { distance: `${radiusM}m`, location: { lat, lon } } }] } },
      sort: [{ _geo_distance: { location: { lat, lon }, order: "asc", unit: "m", distance_type: "plane", mode: "min" } }],
      _source: ["display"],
    },
  });
  const s = hitsOf(r)[0]?._source;
  return s ? (String(s.display ?? "") || null) : null;
}

// ── Tool 2: whats_nearby (the describe core) ─────────────────────────────────
export async function whatsNearby(args: {
  lat: number; lon: number; radius_m?: number;
  types?: string[]; categories?: string[]; accessibility?: string; heading?: number;
}) {
  // FACETED filter. When the user asks for a specific kind ("nearest supermarket"), hard-filter
  // the index to that kind instead of returning the nearest things of every kind — otherwise a
  // sparse target (a supermarket 900 m off) is drowned out by closer roads/shops and never seen.
  // A type-filtered search also hunts a sparser thing, so it searches much WIDER and isn't capped
  // per category. A plain "what's around me" (no type) keeps the local, diversified behaviour.
  const typeFacets = expandTypes([...(args.types ?? []), ...(args.categories ?? [])]);
  const filtered = typeFacets.length > 0;
  // A type search hunts a specific, often sparse thing, so it searches VERY WIDE (up to 100 km) and
  // reports the nearest even when it is far — it never gives up at a short radius. `nearbyM` is only
  // the threshold for WORDING ("nothing within 4 km; the nearest is 13 km away"). A plain "what's
  // around me" (no type) stays local.
  const nearbyM = Math.min(20000, Math.max(20, args.radius_m ?? 4000));
  const searchRadius = filtered ? 100000 : Math.min(2000, Math.max(20, args.radius_m ?? 150));
  const accTag = args.accessibility ? ACCESS_KEYS[args.accessibility] : undefined;

  const filter: unknown[] = [{ geo_distance: { distance: `${searchRadius}m`, location: { lat: args.lat, lon: args.lon } } }, EXCLUDE_ANON];
  if (accTag) filter.push(accessFilter(accTag));
  // Typed loosely (Record<string, unknown>) so the SDK's search overload accepts the dynamic query.
  let query: Record<string, unknown>;
  if (filtered) {
    // Hard facet: the feature's subtype OR category is one of the requested values.
    filter.push({ bool: { should: [{ terms: { subtype: typeFacets } }, { terms: { category: typeFacets } }], minimum_should_match: 1 } });
    query = { bool: { filter } };
  } else {
    query = { bool: { should: [{ exists: { field: "name" } }], minimum_should_match: 1, filter } };
  }

  const res = await opensearch.search({
    index: INDEX,
    body: {
      size: 120,
      query,
      sort: [{ _geo_distance: { location: { lat: args.lat, lon: args.lon }, order: "asc", unit: "m", distance_type: "plane", mode: "min" } }],
      _source: ["name", "display", "category", "subtype", "lat", "lng", "geom", "access", "types", "info"],
    },
  });

  type Row = { display: string; category: string; subtype: string; near: Near; access?: unknown; types?: unknown; info?: unknown; lat: number; lng: number };
  const byKey = new Map<string, Row>();
  for (const h of hitsOf(res)) {
    const s = h._source;
    const geom = s.geom as Geom | undefined;
    const near: Near = geom ? nearestOnGeom(args.lat, args.lon, geom)
      : { dist: metresBetween(args.lat, args.lon, s.lat as number, s.lng as number), lat: s.lat as number, lng: s.lng as number };
    const key = (((s.name as string) ?? "").trim().toLowerCase()) || h._id;
    const prev = byKey.get(key);
    if (!prev || near.dist < prev.near.dist) {
      byKey.set(key, { display: (s.display as string) ?? "", category: String(s.category ?? ""), subtype: String(s.subtype ?? ""), near, access: s.access, types: s.types, info: s.info, lat: s.lat as number, lng: s.lng as number });
    }
  }

  const cap = new Map<string, number>();
  const results: Record<string, unknown>[] = [];
  for (const r of [...byKey.values()].sort((a, b) => a.near.dist - b.near.dist)) {
    if (!filtered) {
      // Only the general "what's around" list caps a category; a type-filtered search shows them all.
      const n = cap.get(r.category) ?? 0;
      if (n >= 4) continue; // keep one category from drowning the list
      cap.set(r.category, n + 1);
    }
    results.push({
      display: r.display, category: r.category || undefined, subtype: r.subtype || undefined,
      distance_m: Math.round(r.near.dist),
      ...direction(args.lat, args.lon, r.near.lat, r.near.lng, args.heading),
      lat: r.lat, lng: r.lng,
      ...(r.access ? { access: r.access } : {}),
      ...(r.types ? { types: r.types } : {}),   // descriptive labels: audible signals, surface quality, etc.
      ...(r.info ? { info: r.info } : {}),       // heritage designation, hours/phone/website, wikipedia/wikidata
    });
    if (results.length >= 15) break;
  }

  // For a specific-thing search ("nearest supermarket"), enrich the top few with WHERE each is —
  // the street it sits on and the settlement it's in — so the answer can be "Foodland on Buckhorn
  // Road in Buckhorn, 23 km", not a bare bearing. (Skipped for a general "what's around" list, where
  // the user is already there and it would just repeat.)
  if (filtered) {
    await Promise.all(results.slice(0, 6).map(async (r) => {
      const [road, place] = await Promise.all([
        nearestNamedRoad(r.lat as number, r.lng as number),
        nearestSettlement(r.lat as number, r.lng as number),
      ]);
      if (road) r.on_street = road;
      if (place) r.in = place;
    }));
  }
  // Anonymous features — nameless buildings + paths the reindex added — surfaced as secondary,
  // typed context for a general "what's around", especially where named features are sparse.
  const extra: Record<string, unknown> = {};
  if (!filtered) {
    const anonR = Math.min(1000, Math.max(searchRadius, 500));
    const [b, p, o] = await Promise.all([
      nearestAnon("building", args.lat, args.lon, anonR, args.heading),
      nearestAnon("path", args.lat, args.lon, anonR, args.heading),
      nearestAnon("obstacle", args.lat, args.lon, Math.min(anonR, 150), args.heading),  // obstacles are underfoot — keep it close
    ]);
    if (b) extra.nearest_building = b;
    if (p) extra.nearest_unnamed_path = p;
    if (o) extra.nearest_obstacle = o;
  }
  return { radius_m: searchRadius, ...(filtered ? { nearby_m: nearbyM } : {}), results, ...extra };
}

// ── Tool 3: area_summary (character, not a feature list) ──────────────────────
export async function areaSummary(args: { lat: number; lon: number; radius_m?: number; heading?: number }) {
  const radius = Math.min(1500, Math.max(50, args.radius_m ?? 250));
  const agg = await opensearch.search({
    index: INDEX,
    body: {
      size: 0, track_total_hits: true,
      query: { bool: { filter: [{ geo_distance: { distance: `${radius}m`, location: { lat: args.lat, lon: args.lon } } }], must_not: [{ terms: { kind: ["building", "path"] } }] } },
      aggs: {
        by_category: { terms: { field: "category", size: 25 } },
        crossings: { filter: { term: { category: "crossing" } } },
        tactile: { filter: { term: { "access.tactile_paving": "yes" } } },
        wheelchair: { filter: { term: { "access.wheelchair": "yes" } } },
        kerb_lowered: { filter: { term: { "access.kerb": "lowered" } } },
      },
    },
  });
  const ab = agg.body.aggregations as unknown as Record<string, { buckets?: Array<{ key: string; doc_count: number }>; doc_count?: number }>;
  const counts = Object.fromEntries((ab.by_category.buckets ?? []).map((x) => [x.key, x.doc_count]));
  const total = (agg.body.hits?.total as unknown as { value: number })?.value ?? 0;

  // Which named landuse / park / region polygon contains the point (smallest = most specific).
  const zoneRes = await opensearch.search({
    index: INDEX,
    body: {
      size: 60,
      query: { bool: { must: [{ terms: { category: ["landuse", "park", "boundary", "natural", "water"] } }], filter: [{ geo_distance: { distance: "1500m", location: { lat: args.lat, lon: args.lon } } }] } },
      _source: ["display", "name", "category", "geom"],
    },
  });
  const contained_by = hitsOf(zoneRes)
    .map((h) => ({ s: h._source, geom: h._source.geom as Geom | undefined }))
    .filter((z) => z.geom && pointInGeom(args.lat, args.lon, z.geom))
    .sort((a, b) => geomAreaM2(a.geom as Geom) - geomAreaM2(b.geom as Geom))
    .slice(0, 3)
    .map((z) => String(z.s.display ?? z.s.name ?? "")).filter(Boolean);

  // Settlement ladder, RANK-AWARE. OSM ranks places city > town > village > hamlet > locality,
  // and people orient by the right tier: "where am I" wants the immediate named spot (often just
  // a hamlet or locality), but "nearest town" wants an ACTUAL town — not whichever hamlet happens
  // to be closest. So return the nearest named place of any rank, the nearest town-or-city, and
  // the nearest city, each tagged with its rank, searching wider for the rarer (bigger) ranks.
  // Each carries a clock direction relative to the way the user is facing when a heading is known
  // (the demo's idiom), falling back to a compass bearing otherwise.
  const nearestPlace = async (ranks: string[], radiusM: number) => {
    const r = await opensearch.search({
      index: INDEX,
      body: {
        size: 1,
        query: { bool: { must: [{ term: { category: "place" } }, { terms: { subtype: ranks } }, { exists: { field: "name" } }], filter: [{ geo_distance: { distance: `${radiusM}m`, location: { lat: args.lat, lon: args.lon } } }] } },
        sort: [{ _geo_distance: { location: { lat: args.lat, lon: args.lon }, order: "asc", unit: "m", distance_type: "plane", mode: "min" } }],
        _source: ["display", "subtype", "lat", "lng"],
      },
    });
    const s = hitsOf(r)[0]?._source;
    if (!s) return null;
    return {
      display: String(s.display ?? ""), rank: String(s.subtype ?? ""),
      distance_m: Math.round(metresBetween(args.lat, args.lon, s.lat as number, s.lng as number)),
      ...direction(args.lat, args.lon, s.lat as number, s.lng as number, args.heading),
    };
  };
  const ANY_SETTLEMENT = ["city", "town", "village", "hamlet", "suburb", "neighbourhood", "quarter", "locality", "isolated_dwelling"];
  const [immediate, nearestTown, nearestCity] = await Promise.all([
    nearestPlace(ANY_SETTLEMENT, 20000), // the local spot, any rank (incl. urban subdivisions)
    nearestPlace(["town", "city"], 80000), // a real town to orient by — towns are sparse, search wide
    nearestPlace(["city"], 200000), // the nearest city, if reasonably near
  ]);
  const sameName = (a: { display: string } | null, b: { display: string } | null) =>
    !!a && !!b && a.display.toLowerCase() === b.display.toLowerCase();
  // Don't repeat a place across tiers (the immediate place may already BE the nearest town/city).
  const settlements = {
    immediate,
    nearest_town: sameName(immediate, nearestTown) ? null : nearestTown,
    nearest_city: sameName(immediate, nearestCity) || sameName(nearestTown, nearestCity) ? null : nearestCity,
  };

  // Building density + unnamed-path network — the anonymous features the reindex added, so
  // "how built up is this area" is now real: total building footprints and nameless paths nearby.
  const dens = await opensearch.search({
    index: INDEX,
    body: {
      size: 0,
      query: { bool: { filter: [{ geo_distance: { distance: `${radius}m`, location: { lat: args.lat, lon: args.lon } } }] } },
      aggs: {
        buildings: { filter: { term: { category: "building" } } },
        unnamed_paths: { filter: { bool: { must: [{ term: { category: "path" } }], must_not: [{ exists: { field: "name" } }] } } },
      },
    },
  });
  const dbb = dens.body.aggregations as unknown as Record<string, { doc_count?: number }>;

  // Nearby NAMED landmarks — notable POIs (museums, attractions, historic sites, major civic
  // buildings, parks) within a WIDER radius than whats_nearby's local snapshot, so "where am I"
  // can orient by a landmark across the road ("near the Canadian Canoe Museum") even when its
  // point is a few hundred metres off and thus not in the immediate list.
  const LANDMARK_CATS = ["tourism", "historic", "religious", "park"];
  const LANDMARK_SUBS = ["university", "college", "hospital", "library", "theatre", "arts_centre",
    "community_centre", "townhall", "courthouse", "stadium", "sports_centre", "museum", "gallery",
    "tower", "lighthouse", "marina", "attraction", "nature_reserve"];
  const landRes = await opensearch.search({
    index: INDEX,
    body: {
      size: 6,
      query: { bool: {
        must: [{ exists: { field: "name" } }],
        should: [{ terms: { category: LANDMARK_CATS } }, { terms: { subtype: LANDMARK_SUBS } }],
        minimum_should_match: 1,
        filter: [{ geo_distance: { distance: "600m", location: { lat: args.lat, lon: args.lon } } }],
      } },
      sort: [{ _geo_distance: { location: { lat: args.lat, lon: args.lon }, order: "asc", unit: "m", distance_type: "plane", mode: "min" } }],
      _source: ["display", "name", "category", "subtype", "lat", "lng", "geom"],
    },
  });
  const seenLm = new Set<string>();
  const landmarks = hitsOf(landRes).map((h) => {
    const s = h._source;
    const geom = s.geom as Geom | undefined;
    const near: Near = geom ? nearestOnGeom(args.lat, args.lon, geom)
      : { dist: metresBetween(args.lat, args.lon, s.lat as number, s.lng as number), lat: s.lat as number, lng: s.lng as number };
    return {
      display: String(s.display ?? s.name ?? ""), subtype: String(s.subtype ?? "") || undefined,
      distance_m: Math.round(near.dist),
      ...direction(args.lat, args.lon, near.lat, near.lng, args.heading),
    };
  }).filter((l) => l.display && !seenLm.has(l.display.toLowerCase()) && !!seenLm.add(l.display.toLowerCase()));

  return {
    radius_m: radius,
    contained_by,
    settlements,
    total_features: total,
    counts,
    landmarks,
    built_up: { buildings: dbb.buildings.doc_count ?? 0, unnamed_paths: dbb.unnamed_paths.doc_count ?? 0 },
    accessibility: {
      crossings: ab.crossings.doc_count ?? 0,
      crossings_with_tactile: ab.tactile.doc_count ?? 0,
      wheelchair_yes: ab.wheelchair.doc_count ?? 0,
      kerbs_lowered: ab.kerb_lowered.doc_count ?? 0,
    },
  };
}

function pointInGeom(pLat: number, pLng: number, geom: Geom): boolean {
  let inside = false;
  for (const ring of geom.c) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
      if (((yi > pLat) !== (yj > pLat)) && pLng < ((xj - xi) * (pLat - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
}
function geomAreaM2(geom: Geom): number {
  const rad = Math.PI / 180, R = 6371000;
  let max = 0;
  for (const ring of geom.c) {
    if (ring.length < 3) continue;
    const coslat = Math.cos(ring[0][1] * rad);
    let a = 0;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0] * rad * coslat * R, yi = ring[i][1] * rad * R;
      const xj = ring[j][0] * rad * coslat * R, yj = ring[j][1] * rad * R;
      a += xj * yi - xi * yj;
    }
    max = Math.max(max, Math.abs(a) / 2);
  }
  return max;
}

// ── Tool 4: path_between (orientation, not a route) ──────────────────────────
export function pathBetween(args: { from: { lat: number; lon: number }; to: { lat: number; lon: number }; heading?: number }) {
  const d = Math.round(metresBetween(args.from.lat, args.from.lon, args.to.lat, args.to.lon));
  return { distance_m: d, ...direction(args.from.lat, args.from.lon, args.to.lat, args.to.lon, args.heading) };
}

// ── Tool 5: nearest_intersections (the actual corner, not a guess) ───────────
// Intersection point of two segments (each [lon,lat]), or null if they don't cross.
function segCross(p1: number[], p2: number[], p3: number[], p4: number[]): number[] | null {
  const d = (p2[0] - p1[0]) * (p4[1] - p3[1]) - (p2[1] - p1[1]) * (p4[0] - p3[0]);
  if (Math.abs(d) < 1e-12) return null;
  const t = ((p3[0] - p1[0]) * (p4[1] - p3[1]) - (p3[1] - p1[1]) * (p4[0] - p3[0])) / d;
  const u = ((p3[0] - p1[0]) * (p2[1] - p1[1]) - (p3[1] - p1[1]) * (p2[0] - p1[0])) / d;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])];
}
function geomCrossings(a: Geom, b: Geom): number[][] {
  const out: number[][] = [];
  for (const ra of a.c) for (let i = 0; i + 1 < ra.length; i++)
    for (const rb of b.c) for (let j = 0; j + 1 < rb.length; j++) {
      const p = segCross(ra[i], ra[i + 1], rb[j], rb[j + 1]);
      if (p) out.push(p);
    }
  return out;
}

export async function nearestIntersections(args: { lat: number; lon: number; heading?: number; limit?: number }) {
  // The "you're on this road" radius. Generous because a rural road's stored geometry is
  // SIMPLIFIED — a curvy road decimated to a few vertices has its nearest stored segment cut
  // the corner, so the computed nearest point can sit tens of metres off the real centre-line
  // and a road you're plainly on reads ~35 m away. The nearest road still wins, so a wider
  // radius rarely misfires in town.
  const ON_ROAD_M = 45;
  const limit = Math.min(8, Math.max(1, args.limit ?? 5));
  const res = await opensearch.search({
    index: INDEX,
    body: {
      size: 80,
      query: { bool: { must: [{ term: { category: "road" } }, { exists: { field: "name" } }], filter: [{ geo_distance: { distance: "500m", location: { lat: args.lat, lon: args.lon } } }] } },
      sort: [{ _geo_distance: { location: { lat: args.lat, lon: args.lon }, order: "asc", unit: "m", distance_type: "plane", mode: "min" } }],
      _source: ["name", "display", "geom"],
    },
  });
  type R = { name: string; display: string; geom: Geom; near: Near };
  const roads: R[] = hitsOf(res)
    .map((h) => {
      const s = h._source, geom = s.geom as Geom | undefined;
      return { name: String(s.name ?? "").trim(), display: String(s.display ?? s.name ?? ""), geom, near: geom ? nearestOnGeom(args.lat, args.lon, geom) : null };
    })
    .filter((r): r is R => !!r.geom && !!r.near);

  // The street the user is ON: the nearest named road within ON_ROAD_M.
  let onRoad: R | null = null;
  for (const r of roads) if (!onRoad || r.near.dist < onRoad.near.dist) onRoad = r;
  const userRoad = onRoad && onRoad.near.dist <= ON_ROAD_M ? onRoad : null;

  // Junctions of the user's road (or, off any road, the few nearest roads) with other named
  // roads — deduped by street pair, nearest first. This is the ACTUAL corner, not a guess.
  // The user's road is ALL of its same-named segment docs, not just the nearest one: a street
  // is stored split, and the junction at the far end of the block belongs to a DIFFERENT doc
  // of the same street (seen live: standing on Hannaford, the Gerrard T-junction lived in the
  // other Hannaford segment, so "between Gerrard and Swanwick" had no Gerrard to say).
  const base = userRoad ? roads.filter((r) => r.name.toLowerCase() === userRoad.name.toLowerCase()) : roads.slice(0, 6);
  // T-junctions rarely show a segment CROSSING: a street that ENDS ON another has its end
  // vertex left a few metres off the other line by rounding + simplification. Treat an
  // endpoint within TOUCH_M of the other road as the junction it is.
  const TOUCH_M = 10;
  const touches = (x: R, y: R): number[][] => {
    const pts: number[][] = [];
    for (const ring of x.geom.c) {
      if (ring.length < 2) continue;
      for (const ep of [ring[0], ring[ring.length - 1]]) {
        const n = nearestOnGeom(ep[1], ep[0], y.geom);
        if (n.dist <= TOUCH_M) pts.push([n.lng, n.lat]);
      }
    }
    return pts;
  };
  const byPair = new Map<string, { streets: string; lat: number; lng: number; dist: number }>();
  for (const a of base) for (const b of roads) {
    if (b.name.toLowerCase() === a.name.toLowerCase()) continue;
    for (const p of [...geomCrossings(a.geom, b.geom), ...touches(a, b), ...touches(b, a)]) {
      const d = metresBetween(args.lat, args.lon, p[1], p[0]);
      const names = [a.display, b.display].sort();
      const key = names.join("|"), prev = byPair.get(key);
      if (!prev || d < prev.dist) byPair.set(key, { streets: `${names[0]} and ${names[1]}`, lat: p[1], lng: p[0], dist: d });
    }
  }
  const intersections = [...byPair.values()]
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit)
    .map((x) => ({ streets: x.streets, distance_m: Math.round(x.dist), ...direction(args.lat, args.lon, x.lat, x.lng, args.heading) }));

  // A nearby REAL house number to anchor by ("near number 120"), preferring one on the
  // street you're on. OSM carries these sparsely, so it's often null — then it's simply
  // omitted (never invented). near_number_street lets the caller name the street if the
  // number happens to sit on a different one from on_street.
  const addr = await nearestAddress(args.lat, args.lon, userRoad ? userRoad.name : undefined);
  // Where no real number is close, estimate one from a nearby addr:interpolation range. This
  // is an ESTIMATE of the position along the block — the caller MUST say "about number N",
  // never "at"/"near" (those are reserved for the real number above). Only one of the two is
  // ever set: a real anchor beats an estimate.
  const approx = addr ? null : await interpolatedAddress(args.lat, args.lon, userRoad ? userRoad.name : undefined);
  return {
    on_street: userRoad ? userRoad.display : null,
    near_number: addr ? addr.housenumber : null,
    near_number_street: addr ? addr.street : null,
    about_number: approx ? approx.number : null,
    about_number_street: approx ? approx.street : null,
    intersections,
  };
}

// ── Anthropic tool schemas + dispatcher ──────────────────────────────────────
export const TOOL_SCHEMAS = [
  {
    name: "find_place",
    description:
      "Find a named place, business, address, or category anywhere in the indexed map (all of Canada plus a few cities). Use it to answer 'where is X / find me X', AND to get coordinates for any place the user names so you can then describe around it. If 'near' is given, each result also includes distance in metres and a compass bearing (and a clock direction when a heading is provided). A result may carry an `info` block — a heritage listing, opening_hours, phone, website, operator, or wikipedia/wikidata link — offer the relevant detail rather than reciting it all; a wikipedia/wikidata identifier means you can go deeper on that place if asked. A STREET-NUMBER query ('121 King West', '121 King Street West') is resolved as an address, and its single result is the building at that number, not the street: `display` is the full address plus the building name when there is one ('121 King Street West — Roserock Place'), with `building` and `at_address` (the businesses and occupants at that number) alongside. Lead with the building name — someone who gives a street number usually cannot recall it, and that is what they are asking for. Anything you are then asked about that address (transit, what's nearby) must be measured from THIS result's coordinates, never from a road of the same name.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "A name, business, category, or address — e.g. 'CN Tower', 'pharmacy', '123 King Street'. Pass JUST the name or term, never the user's whole sentence: for 'transit at the south end of Hannaford St on Kingston Road' query 'Kingston Road' (or 'Hannaford Street'), not the sentence." },
        near: { type: "object", properties: { lat: { type: "number" }, lon: { type: "number" } }, description: "Optional anchor to bias toward and measure distance from (usually the user's location)." },
        accessibility: { type: "string", enum: ["wheelchair", "tactile_paving", "step_free"], description: "Optional: only return features with this accessibility attribute present." },
        limit: { type: "integer", description: "Max results (default 5)." },
      },
      required: ["query"],
    },
  },
  {
    name: "whats_nearby",
    description:
      "Map features around a point, nearest first, each with distance + direction (computed for you; never estimate them). TWO modes. (1) NO `types`: a general 'what's around me' snapshot of nearby named features. (2) WITH `types`: a FACETED search for a specific kind ('nearest supermarket / pharmacy / café') — it filters the index to that kind and ALWAYS returns the NEAREST one even when it is far (searched up to 100 km) — never returns 'none' when one exists further out — plus `nearby_m`, the radius counted as 'nearby', so you can say when the nearest isn't close. Common words are expanded to the family that satisfies them (e.g. 'supermarket' and 'grocery' both cover supermarket/grocery/convenience/greengrocer, so a small-town Foodland or a corner store is found). Each result carries its `subtype` (name it by its real kind), and for a type search also `on_street` (the road it sits on) and `in` (the settlement it's in), so you can say WHERE it is: 'Foodland, on Buckhorn Road in Buckhorn'. For a general 'what's around me' (no `types`) it also returns `nearest_building` (a nameless building, with its `size_class`) and `nearest_unnamed_path` (an unnamed path, with its `subtype` like track/footway) as SECONDARY context — texture to add after the named things, most useful where named features are sparse. It may also return `nearest_obstacle`: a physical barrier right by the user on the path — a bollard, gate, kissing gate, cattle grid, or a tactile map/model — with a plain `display` label; mention it when close and frame it for the user (awkward to get through with a chair or a guide dog; a tactile map is a helpful landmark to seek out). And any result may carry an `info` block of real-world detail — a heritage designation, opening_hours, phone, website, operator, or wikipedia/wikidata link — surface what's relevant and offer to say more rather than reciting it all.",
    input_schema: {
      type: "object",
      properties: {
        lat: { type: "number" }, lon: { type: "number" },
        radius_m: { type: "integer", description: "Search radius in metres (default 150 general, 4000 when types is set; max 20000 when filtering by type)." },
        types: { type: "array", items: { type: "string" }, description: "Facet filter — the kind(s) of place wanted, e.g. ['supermarket'], ['pharmacy'], ['cafe','restaurant']. Use this for 'nearest/any <kind of place>'; it triggers a wider, type-restricted search. Omit for a general 'what's around me'." },
        categories: { type: "array", items: { type: "string" }, description: "Alias for `types` (kept for compatibility)." },
        accessibility: { type: "string", enum: ["wheelchair", "tactile_paving", "step_free"] },
      },
      required: ["lat", "lon"],
    },
  },
  {
    name: "area_summary",
    description:
      "A high-level sense of a place rather than a feature list: the named areas that contain the point (park, campus, neighbourhood, water), how much and what mix is around (counts by kind), a RANKED settlement ladder, and an accessibility snapshot (how many crossings, how many with tactile paving). The settlement ladder gives `immediate` (the nearest named place of any rank — often a hamlet or locality), `nearest_town` (the nearest actual town or city), and `nearest_city`, each with its `rank` and distance. Use it for 'what's this area like / is it built up / describe where I am', AND for 'what's the nearest town/city/village' — for which you MUST use the rank, not just whatever place is closest. It also returns `built_up`: counts of building footprints and unnamed paths nearby — use these for how developed the area is ('dozens of buildings' = dense; 'a handful' = sparse/rural). And `landmarks`: nearby NAMED notable POIs (museums, historic sites, major civic buildings, parks) within ~600 m, nearest first — use the closest to orient the user even when it's across a road and not in the immediate list.",
    input_schema: { type: "object", properties: { lat: { type: "number" }, lon: { type: "number" }, radius_m: { type: "integer" } }, required: ["lat", "lon"] },
  },
  {
    name: "path_between",
    description:
      "Straight-line distance in metres and compass bearing from one point to another (and a clock direction when a heading is given). Use for 'how far / which way is X', or to relate two places. This is orientation only, NOT a walking route — do not present it as directions to follow.",
    input_schema: {
      type: "object",
      properties: {
        from: { type: "object", properties: { lat: { type: "number" }, lon: { type: "number" } } },
        to: { type: "object", properties: { lat: { type: "number" }, lon: { type: "number" } } },
      },
      required: ["from", "to"],
    },
  },
  {
    name: "nearest_intersections",
    description:
      "The named street the user is on (if any) and the nearest street intersections to a point — each as 'A and B' with distance in metres and direction, computed for you. Use this for 'where am I', 'what corner am I at', and 'what's the nearest intersection'. It gives the ACTUAL junction, so prefer it over guessing cross-streets from a list of roads — and the nearest one IS the corner the user is at. It also returns `near_number` (with `near_number_street`): a real nearby house number to anchor by — say it as 'near number 120'. If OSM never numbered the block, it instead returns `about_number` (with `about_number_street`), an ESTIMATE of your position along the street from an interpolation range — say this as 'about number N', and NEVER as 'at' or 'near', because it is a computed estimate, not a real number on the ground. Only one of the two is ever present.",
    input_schema: { type: "object", properties: { lat: { type: "number" }, lon: { type: "number" } }, required: ["lat", "lon"] },
  },
];

// Run a tool by name. `heading` (the user's facing, when known) and `userLoc` (their current
// position) are threaded in by the route so results can include a clock position AND so
// find_place is always anchored to the user — even when the model forgets to pass `near` —
// which is what makes a nearby match win over a same-spelling one across the country.
export async function runTool(
  name: string, input: Record<string, unknown>, heading?: number, userLoc?: { lat: number; lon: number },
): Promise<unknown> {
  switch (name) {
    case "find_place": {
      const a = input as Parameters<typeof findPlace>[0];
      if (!a.near && userLoc) a.near = userLoc; // anchor to the user unless the model named another point
      return findPlace({ ...a, heading });
    }
    case "whats_nearby": return whatsNearby({ ...(input as Parameters<typeof whatsNearby>[0]), heading });
    case "area_summary": return areaSummary({ ...(input as Parameters<typeof areaSummary>[0]), heading });
    case "path_between": return pathBetween({ ...(input as Parameters<typeof pathBetween>[0]), heading });
    case "nearest_intersections": return nearestIntersections({ ...(input as Parameters<typeof nearestIntersections>[0]), heading });
    default: return { error: `unknown tool: ${name}` };
  }
}
