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

const INDEX = "map-features";

// ── geo helpers ──────────────────────────────────────────────────────────────
// Raw geometry stored on each doc: c = arrays of rings, each ring a list of [lon,lat].
type Geom = { t: string; c: number[][][] };
type Near = { dist: number; lat: number; lng: number };

// Equirectangular metres — plenty accurate at the metres-to-km scale here.
function metresBetween(aLat: number, aLng: number, bLat: number, bLng: number): number {
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
function direction(
  fromLat: number, fromLng: number, toLat: number, toLng: number, heading?: number,
): { bearing: string; clock?: string } {
  const b = bearing(fromLat, fromLng, toLat, toLng);
  return { bearing: b.compass, ...(heading != null ? { clock: clockFromHeading(b.deg, heading) } : {}) };
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

type Hit = { _id: string; _score?: number; _source: Record<string, unknown> };
const hitsOf = (res: { body: { hits?: { hits?: unknown } } }): Hit[] =>
  (res.body.hits?.hits as unknown as Hit[]) ?? [];

// Anonymous map features (kind 'building' / 'path') are indexed for description richness, but
// the describe side isn't wired to aggregate them yet. Exclude them from every tool meanwhile,
// so the national reindex can land them in the live index WITHOUT changing any current answer.
// Remove this guard once whats_nearby/area_summary use them deliberately (building density,
// nearest laneway, etc.). 'area' fills keep their existing handling and are not touched here.
const EXCLUDE_ANON = { bool: { must_not: { terms: { kind: ["building", "path"] } } } };

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

  // Fuzzy text relevance so speech-to-text misspellings still match: a dropped or added letter
  // ("Hanaford" for "Hannaford") is one edit, well inside AUTO's tolerance.
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
              },
            },
            { match_phrase_prefix: { display: { query: q, boost: 2 } } },
          ],
          tie_breaker: 0.3,
        },
      },
      filter,
    },
  };

  // When we have an anchor (the user's location — the route injects it even if the model
  // forgets), fold CLOSENESS into the relevance score so the LOCAL match wins. A FLOORED
  // multiply: final = textScore × (1 + GEO_BOOST × proximity), where proximity is a gauss
  // 1→0 with distance. Two things matter about the floor (the constant 1):
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
  const query: Record<string, unknown> = args.near
    ? {
        function_score: {
          query: textQuery,
          functions: [
            { weight: 1 }, // floor: every match keeps its full text score even when far away
            { gauss: { location: { origin: { lat: args.near.lat, lon: args.near.lon }, scale: "3km", offset: "100m", decay: 0.5 } }, weight: GEO_BOOST },
          ],
          score_mode: "sum", // 1 + GEO_BOOST·proximity
          boost_mode: "multiply", // × textScore
        },
      }
    : textQuery;

  const res = await opensearch.search({
    index: INDEX,
    body: { size: Math.min(60, Math.max(40, limit * 6)), query, _source: ["osm_id", "name", "display", "category", "subtype", "lat", "lng", "address", "access", "parent"] },
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
      lat, lng,
      ...(args.near ? { distance_m: Math.round(metresBetween(args.near.lat, args.near.lon, lat, lng)), ...dir } : {}),
      ...(s.parent ? { in: s.parent as string } : {}),
      ...(s.access ? { access: s.access } : {}),
    });
    if (results.length >= limit) break;
  }
  return { results };
}

// ── Tool 2: whats_nearby (the describe core) ─────────────────────────────────
export async function whatsNearby(args: {
  lat: number; lon: number; radius_m?: number;
  categories?: string[]; accessibility?: string; heading?: number;
}) {
  const radius = Math.min(2000, Math.max(20, args.radius_m ?? 150));
  const cats = (args.categories ?? []).map((c) => c.toLowerCase());
  const accTag = args.accessibility ? ACCESS_KEYS[args.accessibility] : undefined;

  // Return named features and POIs; if specific categories are asked for, those too
  // (named or not, since the user has named the type they want).
  const should: Record<string, unknown>[] = [{ exists: { field: "name" } }];
  if (cats.length) should.push({ terms: { category: cats } });
  const filter: unknown[] = [{ geo_distance: { distance: `${radius}m`, location: { lat: args.lat, lon: args.lon } } }, EXCLUDE_ANON];
  if (accTag) filter.push(accessFilter(accTag));
  // Typed loosely (Record<string, unknown>) so the SDK's search overload accepts the
  // dynamically-built should/filter arrays — same pattern as the map-search route.
  const query: Record<string, unknown> = { bool: { should, minimum_should_match: 1, filter } };

  const res = await opensearch.search({
    index: INDEX,
    body: {
      size: 120,
      query,
      sort: [{ _geo_distance: { location: { lat: args.lat, lon: args.lon }, order: "asc", unit: "m", distance_type: "plane", mode: "min" } }],
      _source: ["name", "display", "category", "subtype", "lat", "lng", "geom", "access"],
    },
  });

  type Row = { display: string; category: string; subtype: string; near: Near; access?: unknown };
  const byKey = new Map<string, Row>();
  for (const h of hitsOf(res)) {
    const s = h._source;
    const geom = s.geom as Geom | undefined;
    const near: Near = geom ? nearestOnGeom(args.lat, args.lon, geom)
      : { dist: metresBetween(args.lat, args.lon, s.lat as number, s.lng as number), lat: s.lat as number, lng: s.lng as number };
    const key = (((s.name as string) ?? "").trim().toLowerCase()) || h._id;
    const prev = byKey.get(key);
    if (!prev || near.dist < prev.near.dist) {
      byKey.set(key, { display: (s.display as string) ?? "", category: String(s.category ?? ""), subtype: String(s.subtype ?? ""), near, access: s.access });
    }
  }

  const cap = new Map<string, number>();
  const results = [];
  for (const r of [...byKey.values()].sort((a, b) => a.near.dist - b.near.dist)) {
    const n = cap.get(r.category) ?? 0;
    if (n >= 4) continue; // keep one category from drowning the list
    cap.set(r.category, n + 1);
    results.push({
      display: r.display, category: r.category || undefined, subtype: r.subtype || undefined,
      distance_m: Math.round(r.near.dist),
      ...direction(args.lat, args.lon, r.near.lat, r.near.lng, args.heading),
      ...(r.access ? { access: r.access } : {}),
    });
    if (results.length >= 15) break;
  }
  return { radius_m: radius, results };
}

// ── Tool 3: area_summary (character, not a feature list) ──────────────────────
export async function areaSummary(args: { lat: number; lon: number; radius_m?: number }) {
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
  // heading isn't passed to this tool, so the directions here are compass bearings only.
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
      ...direction(args.lat, args.lon, s.lat as number, s.lng as number),
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

  return {
    radius_m: radius,
    contained_by,
    settlements,
    total_features: total,
    counts,
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
  const ON_ROAD_M = 30;
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
  const base = userRoad ? [userRoad] : roads.slice(0, 6);
  const byPair = new Map<string, { streets: string; lat: number; lng: number; dist: number }>();
  for (const a of base) for (const b of roads) {
    if (b.name.toLowerCase() === a.name.toLowerCase()) continue;
    for (const p of geomCrossings(a.geom, b.geom)) {
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

  return { on_street: userRoad ? userRoad.display : null, intersections };
}

// ── Anthropic tool schemas + dispatcher ──────────────────────────────────────
export const TOOL_SCHEMAS = [
  {
    name: "find_place",
    description:
      "Find a named place, business, address, or category anywhere in the indexed map (all of Canada plus a few cities). Use it to answer 'where is X / find me X', AND to get coordinates for any place the user names so you can then describe around it. If 'near' is given, each result also includes distance in metres and a compass bearing (and a clock direction when a heading is provided).",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "A name, business, category, or address — e.g. 'CN Tower', 'pharmacy', '123 King Street'." },
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
      "List map features around a point, nearest first, each with distance in metres and a compass bearing (and a clock direction when a heading is given) — all computed for you; never estimate distances or directions yourself. Use for 'what's around me / around <place>'. Optional category or accessibility filter.",
    input_schema: {
      type: "object",
      properties: {
        lat: { type: "number" }, lon: { type: "number" },
        radius_m: { type: "integer", description: "Search radius in metres (default 150)." },
        categories: { type: "array", items: { type: "string" }, description: "Optional category filter, e.g. ['cafe','bench','crossing','shop']." },
        accessibility: { type: "string", enum: ["wheelchair", "tactile_paving", "step_free"] },
      },
      required: ["lat", "lon"],
    },
  },
  {
    name: "area_summary",
    description:
      "A high-level sense of a place rather than a feature list: the named areas that contain the point (park, campus, neighbourhood, water), how much and what mix is around (counts by kind), a RANKED settlement ladder, and an accessibility snapshot (how many crossings, how many with tactile paving). The settlement ladder gives `immediate` (the nearest named place of any rank — often a hamlet or locality), `nearest_town` (the nearest actual town or city), and `nearest_city`, each with its `rank` and distance. Use it for 'what's this area like / is it built up / describe where I am', AND for 'what's the nearest town/city/village' — for which you MUST use the rank, not just whatever place is closest.",
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
      "The named street the user is on (if any) and the nearest street intersections to a point — each as 'A and B' with distance in metres and direction, computed for you. Use this for 'where am I', 'what corner am I at', and 'what's the nearest intersection'. It gives the ACTUAL junction, so prefer it over guessing cross-streets from a list of roads — and the nearest one IS the corner the user is at.",
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
    case "area_summary": return areaSummary(input as Parameters<typeof areaSummary>[0]);
    case "path_between": return pathBetween({ ...(input as Parameters<typeof pathBetween>[0]), heading });
    case "nearest_intersections": return nearestIntersections({ ...(input as Parameters<typeof nearestIntersections>[0]), heading });
    default: return { error: `unknown tool: ${name}` };
  }
}
