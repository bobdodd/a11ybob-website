/* GET /api/map-nearby?lat=<n>&lng=<n>&limit=<n>&off=<csv>&on=<csv>
 *
 * Nearest WORTH-MENTIONING named map features to a point — the orientation lookup
 * behind the demo's spoken location descriptions (Quick describe, the Auto-describe
 * running commentary, and the Detailed surroundings read-out). Same-origin proxy in
 * front of the `map-features` index.
 *
 * Distance + direction are to the NEAREST POINT of the feature, not its centroid —
 * critical for a blind user judging their position (you can stand 20 m from a long
 * road whose middle is 600 m away). Selection uses the index's multi-point
 * geo_distance (recall); the exact distance and the returned lat/lng are then
 * computed in JS from the stored raw geometry (`geom`).
 *
 * Results are NOT just nearest-first. Each feature carries a SIGNIFICANCE tier (0-3,
 * how much it's worth telling the user unprompted), and ranking blends significance
 * with distance — a town 400 m away outranks a driveway 40 m away. A higher tier also
 * "reaches" further (REACH). Significance respects the user's active filters, passed
 * as `off` (base categories they've HIDDEN -> demoted, mentioned only as background)
 * and `on` (accessibility/POI overlays they've turned ON -> boosted, because opting in
 * is them saying "this matters to me"). Tokens are "category" or "category:subtype".
 *
 * Only NAMED features; repeated segments of one named way collapse to the nearest.
 *
 * Returns { results: [{ id, display, category?, subtype?, significance, lat, lng,
 * distance_m }] }, lat/lng = the nearest point, ranked best-first. */

import { NextRequest, NextResponse } from "next/server";
import { opensearch } from "@/lib/opensearch";
import { nearestAddress } from "@/lib/mapAddress";

export const dynamic = "force-dynamic";

const INDEX = "map-features";
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 12;

type Result = {
  id: string;
  display: string;
  category?: string;
  subtype?: string;
  significance: number;
  lat: number;
  lng: number;
  distance_m: number;
};

// AREA-CHARACTER summary (?summary=1): raw counts of EVERY feature within a small
// radius — named and unnamed — by category, by subtype, and by accessibility tag.
// Drives the Detailed read-out's "feel of the space" lead-in. The API only counts;
// the client turns the counts into phrasing (so wording is tuned without a rebuild).
type AreaSummary = {
  radius_m: number;
  total: number;
  categories: Record<string, number>;
  subtypes: Record<string, number>;
  access: { kerb_lowered: number; tactile_paving: number; wheelchair: number };
  // The zone(s) you're standing IN (point-in-polygon): a landuse area ("a residential
  // area"), a park, a named region. Smallest/most-specific first.
  within: Array<{ display: string; category: string; subtype: string }>;
  // Nearest named settlement ("near Buckhorn"), or null if none within reach.
  settlement: { display: string; subtype: string; distance_m: number; lat: number; lng: number } | null;
};

// Raw geometry stored on the doc: t:'L' = lines/rings, c = arrays of [lon,lat].
type Geom = { t: string; c: number[][][] };
type Near = { dist: number; lat: number; lng: number };

// Equirectangular metres — plenty accurate at the metres-to-km scale here.
function metresBetween(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad;
  const dLng = (bLng - aLng) * rad * Math.cos(((aLat + bLat) / 2) * rad);
  return R * Math.sqrt(dLat * dLat + dLng * dLng);
}

// Nearest point on segment A->B to P (lat/lng), with its distance in metres.
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
  return {
    dist: Math.sqrt(cx * cx + cy * cy),
    lat: aLat + t * (bLat - aLat),
    lng: aLng + t * (bLng - aLng),
  };
}

// Nearest point on a (multi)line / polygon-ring geometry to P.
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

// When the nearest road is within this, treat the user as ON it — so a crossing road
// is reported by its INTERSECTION, not its perpendicular nearest point. Generous for
// driving / jostled-pedestrian GPS noise.
const ON_ROAD_M = 30;

// Intersection point of two segments (each [lon,lat]), or null if they don't cross.
function segCross(p1: number[], p2: number[], p3: number[], p4: number[]): number[] | null {
  const d = (p2[0] - p1[0]) * (p4[1] - p3[1]) - (p2[1] - p1[1]) * (p4[0] - p3[0]);
  if (Math.abs(d) < 1e-12) return null; // parallel / collinear
  const t = ((p3[0] - p1[0]) * (p4[1] - p3[1]) - (p3[1] - p1[1]) * (p4[0] - p3[0])) / d;
  const u = ((p3[0] - p1[0]) * (p2[1] - p1[1]) - (p3[1] - p1[1]) * (p2[0] - p1[0])) / d;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])]; // [lon,lat]
}

// All crossing points between two line geometries (each ring is [lon,lat] vertices).
function geomCrossings(a: Geom, b: Geom): number[][] {
  const out: number[][] = [];
  for (const ra of a.c) {
    for (let i = 0; i + 1 < ra.length; i++) {
      for (const rb of b.c) {
        for (let j = 0; j + 1 < rb.length; j++) {
          const p = segCross(ra[i], ra[i + 1], rb[j], rb[j + 1]);
          if (p) out.push(p);
        }
      }
    }
  }
  return out;
}

// Unit direction [east, north] of a road at the point on it nearest P — the local
// segment's heading. Lets us tell which junctions sit at each END of the block (ahead
// vs behind ALONG the street), so we report one at each end rather than two the same way.
function roadDirAt(pLat: number, pLng: number, geoms: Geom[]): [number, number] | null {
  const rad = Math.PI / 180, R = 6371000, coslat = Math.cos(pLat * rad);
  let bestD = Infinity, dx = 0, dy = 0;
  for (const g of geoms)
    for (const ring of g.c)
      for (let i = 0; i + 1 < ring.length; i++) {
        const a = ring[i], b = ring[i + 1];
        const r = nearestOnSeg(pLat, pLng, a[1], a[0], b[1], b[0]);
        if (r.dist < bestD) {
          bestD = r.dist;
          dx = (b[0] - a[0]) * coslat * R * rad;
          dy = (b[1] - a[1]) * R * rad;
        }
      }
  const len = Math.hypot(dx, dy);
  return len > 0 ? [dx / len, dy / len] : null;
}

// Signed distance (m) of X from P projected onto unit direction dir [east, north].
function projAlong(pLat: number, pLng: number, xLat: number, xLng: number, dir: [number, number]): number {
  const rad = Math.PI / 180, R = 6371000, coslat = Math.cos(pLat * rad);
  return (xLng - pLng) * coslat * R * rad * dir[0] + (xLat - pLat) * R * rad * dir[1];
}

// Is point P inside the (multi-ring) polygon stored in geom? Ray casting per ring, XORed
// — handles a polygon with holes; for a few disjoint outer rings it's a close-enough
// approximation. geom.c rings are [lon, lat] vertices. Used for "you're in <zone>".
function pointInGeom(pLat: number, pLng: number, geom: Geom): boolean {
  let inside = false;
  for (const ring of geom.c) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
      if (((yi > pLat) !== (yj > pLat)) && pLng < ((xj - xi) * (pLat - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
  }
  return inside;
}

// Rough planar area (m²) of a polygon ring set — to prefer the SMALLEST containing zone
// (most specific) when several contain the point. Shoelace on the first ring is enough.
function geomAreaM2(geom: Geom): number {
  const rad = Math.PI / 180, R = 6371000;
  let max = 0;
  for (const ring of geom.c) {
    if (ring.length < 3) continue;
    const lat0 = ring[0][1] * rad, coslat = Math.cos(lat0);
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

/* SIGNIFICANCE — how much a feature is worth telling the user about unprompted, 0-3.
 * Keyed on the real category/subtype values in the map-features index, refined by
 * whether the feature is named. The accessibility categories (facility / mobility /
 * sensory / terrain / transport) are deliberately LOW here: a crossing or a stretch of
 * tactile paving is noise UNLESS the user has asked for it — at which point the `on`
 * boost lifts it. address nodes (a quarter-million of them) are pure background. */
function baseSignificance(cat: string, sub: string, named: boolean): number {
  switch (cat) {
    case "amenity": {
      if (sub === "address") return 0; // addr:* nodes are not places
      const civic = new Set([
        "hospital", "clinic", "doctors", "pharmacy", "school", "college", "university",
        "library", "townhall", "community_centre", "police", "fire_station", "courthouse",
        "place_of_worship", "theatre", "cinema", "bank", "post_office", "fuel", "marketplace",
      ]);
      if (civic.has(sub)) return 3;
      if (["bench", "waste_basket", "drinking_water", "bicycle_parking", "vending_machine"].includes(sub))
        return 1;
      return named ? 2 : 1;
    }
    case "transit":
      if (sub === "station" || sub === "tram_stop") return 3;
      return named ? 2 : 1; // a single stop / platform
    case "railway":
      return 2;
    case "road": {
      if (["motorway", "trunk", "primary", "secondary"].includes(sub)) return 3;
      if (["service", "track", "unclassified", "footway", "path", "cycleway", "steps"].includes(sub))
        return 1;
      return 2; // tertiary / residential / other named road
    }
    case "water":
      if (sub === "stream") return 2;
      return named ? 3 : 2; // named lake / river / canal
    case "religious":
      return 3;
    case "tourism":
      if (["attraction", "museum", "gallery", "hotel", "viewpoint", "theme_park", "zoo"].includes(sub))
        return 3;
      return named ? 2 : 1;
    case "historic":
      return named ? 2 : 1;
    case "park":
      if (["park", "nature_reserve", "garden"].includes(sub)) return named ? 3 : 2;
      return named ? 2 : 1; // pitch / playground / sport
    case "aeroway":
      return sub === "terminal" || sub === "gate" ? 3 : 2;
    case "shop":
      return named ? 2 : 1;
    case "man_made":
      if (["bridge", "tower", "lighthouse", "pier", "obelisk", "windmill"].includes(sub)) return 2;
      return 1; // tunnel / mast / breakwater / silo / storage_tank
    case "building":
      return named ? 2 : 0; // unnamed buildings are background
    case "vegetation":
    case "natural":
      return named ? 1 : 0;
    case "landuse":
    case "barrier":
      return 0;
    case "parking":
      return 1;
    // Accessibility overlays: invisible until the user opts in (then `on` boosts them).
    case "facility":
    case "mobility":
    case "sensory":
    case "terrain":
    case "transport":
      return 0;
    default:
      return named ? 1 : 0;
  }
}

function parseTokens(raw: string | null): Set<string> {
  return new Set((raw ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
}

// "category" matches any subtype of that category; "category:subtype" is exact.
function matchTok(cat: string, sub: string, tokens: Set<string>): boolean {
  if (!tokens.size) return false;
  const c = cat.toLowerCase();
  return tokens.has(c) || tokens.has(`${c}:${sub.toLowerCase()}`);
}

// How far a feature of each significance tier still earns a mention (metres). A town
// reaches across a sparse landscape; a minor local feature only when you're on it.
const REACH = [40, 150, 600, 2500];
// On-the-ground accessibility features are only useful when you're nearly ON them —
// a crossing or curb cut 2 km away is noise even when the user has opted into it. So
// they get a short, fixed reach regardless of the significance boost.
const LOCAL_CATS = new Set(["facility", "mobility", "sensory", "terrain", "transport", "parking", "barrier"]);
const reachFor = (cat: string, sig: number): number =>
  LOCAL_CATS.has(cat) ? 100 : REACH[Math.max(0, Math.min(3, sig))];

// Final ranking is significance BLENDED with proximity — not significance alone. Pure
// "sig desc, dist asc" lets a post office 950 m away outrank the road you're standing
// on (a town is sig 3, a residential road sig 2), so the thing at your feet falls off
// the list. The proximity term adds up to PROX_WEIGHT for a feature underfoot, fading
// to 0 by PROX_RANGE_M: so what you're on/beside leads, then the notable things around.
const PROX_RANGE_M = 50;
const PROX_WEIGHT = 2.5;
const rankScore = (sig: number, dist: number): number =>
  sig + PROX_WEIGHT * Math.max(0, 1 - dist / PROX_RANGE_M);
// Don't return more than this many of one category — keeps a Detailed read-out from
// becoming "bus stop, bus stop, bus stop". Roads get a little more room (the road
// you're on plus a couple of cross-streets is normal and wanted).
const PER_CATEGORY_CAP = 3;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const lat = Number(sp.get("lat"));
  const lng = Number(sp.get("lng"));
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(sp.get("limit")) || DEFAULT_LIMIT));
  const offTokens = parseTokens(sp.get("off")); // base features the user hid -> demote
  const onTokens = parseTokens(sp.get("on")); // overlays the user turned on -> boost
  // Only when TRAVELLING on a road does a cross-street's intersection matter more than
  // its nearest point (you reach it ahead, not off to the side). Standing still, the
  // road that runs 30 m to your left is 30 m to your left — report the nearest point.
  const moving = sp.get("moving") === "1";

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ results: [] satisfies Result[] });
  }

  // Filter-aware significance: opting IN to an overlay makes it significant; hiding a
  // base layer demotes it below the "worth mentioning unprompted" line (but not to
  // nothing — it can still surface as background when little else is around).
  const sigOf = (cat: string, sub: string, named: boolean): number => {
    let s = baseSignificance(cat, sub, named);
    if (matchTok(cat, sub, onTokens)) s = Math.max(s, 3);
    if (matchTok(cat, sub, offTokens)) s = Math.min(s, 1);
    return s;
  };

  // Unnamed features are normally excluded — orientation is about NAMED places. But
  // if the user has opted into an overlay (crossings, curb cuts, tactile paving…),
  // include unnamed features of that category too: surfacing them is the whole point
  // of turning the filter on, and they're identified by TYPE, not by a name.
  const onShould: Record<string, unknown>[] = [{ exists: { field: "name" } }];
  for (const tok of onTokens) {
    const [c, s] = tok.split(":");
    if (s) onShould.push({ bool: { must: [{ term: { category: c } }, { term: { subtype: s } }] } });
    else onShould.push({ term: { category: c } });
  }

  const res = await opensearch.search({
    index: INDEX,
    body: {
      // Oversample generously: the index multi-point geo_distance is for RECALL, then
      // we re-rank by significance + exact nearest-point distance below.
      size: Math.min(200, limit * 20),
      query: { bool: { should: onShould, minimum_should_match: 1 } },
      sort: [
        {
          _geo_distance: {
            location: { lat, lon: lng },
            order: "asc",
            unit: "m",
            distance_type: "plane",
            mode: "min",
          },
        },
      ],
      _source: ["osm_id", "name", "display", "category", "subtype", "lat", "lng", "geom"],
    },
  });

  const hits =
    (res.body.hits?.hits as unknown as Array<{
      _id: string;
      _source: Record<string, unknown>;
    }>) ?? [];

  type Cand = {
    id: string; display: string; category: string; subtype: string;
    name: string; geom?: Geom; near: Near; sig: number;
  };
  const cands: Cand[] = hits.map((h) => {
    const s = h._source;
    const geom = s.geom as Geom | undefined;
    const category = String(s.category ?? "");
    const subtype = String(s.subtype ?? "");
    const name = String(s.name ?? "").trim();
    const near: Near = geom
      ? nearestOnGeom(lat, lng, geom)
      : { dist: metresBetween(lat, lng, s.lat as number, s.lng as number), lat: s.lat as number, lng: s.lng as number };
    return {
      id: h._id,
      display: (s.display as string) ?? name,
      category,
      subtype,
      name,
      geom,
      near,
      sig: sigOf(category, subtype, !!name),
    };
  });

  // Which road are we ON? The nearest road, if close enough. When TRAVELLING on it, a
  // crossing road is reported by its INTERSECTION with our road (so it reads "ahead" at
  // the along-road distance) instead of its perpendicular nearest point. Standing still
  // this is wrong — a road running 30 m to your side is 30 m to your side, not "70 m at
  // the corner" — so the override is gated on `moving`. Off any road, or stationary,
  // everything stays crow-flies nearest-point.
  let onRoad: string | null = null;
  let onRoadDist = Infinity;
  for (const c of cands) {
    if (c.category === "road" && c.near.dist < onRoadDist) {
      onRoadDist = c.near.dist;
      onRoad = c.name.toLowerCase();
    }
  }
  if (onRoadDist > ON_ROAD_M || !moving) onRoad = null;
  const ourRoadGeoms = onRoad
    ? cands.filter((c) => c.category === "road" && c.name.toLowerCase() === onRoad && c.geom)
        .map((c) => c.geom as Geom)
    : [];

  // Collapse repeated segments of one named way to the nearest instance.
  const byName = new Map<string, Cand & { near: Near }>();
  for (const c of cands) {
    let near = c.near;
    if (onRoad && c.category === "road" && c.geom && c.name.toLowerCase() !== onRoad) {
      let best: Near | null = null;
      for (const rg of ourRoadGeoms) {
        for (const p of geomCrossings(c.geom, rg)) {
          const d = metresBetween(lat, lng, p[1], p[0]);
          if (!best || d < best.dist) best = { dist: d, lat: p[1], lng: p[0] };
        }
      }
      if (best) near = best; // crossing road -> distance to the intersection
    }
    const key = (c.name || c.id).toLowerCase();
    const prev = byName.get(key);
    if (!prev || near.dist < prev.near.dist) byName.set(key, { ...c, near });
  }

  // Keep only features within their tier's reach, then rank by significance first,
  // distance second, and cap each category so the read-out stays varied.
  const ranked = [...byName.values()]
    .filter((c) => c.near.dist <= reachFor(c.category, c.sig))
    .sort((a, b) =>
      rankScore(b.sig, b.near.dist) - rankScore(a.sig, a.near.dist) || a.near.dist - b.near.dist);

  const perCat = new Map<string, number>();
  const results: Result[] = [];
  for (const c of ranked) {
    const n = perCat.get(c.category) ?? 0;
    if (n >= PER_CATEGORY_CAP) continue;
    perCat.set(c.category, n + 1);
    results.push({
      id: c.id,
      display: c.display,
      category: c.category || undefined,
      subtype: c.subtype || undefined,
      significance: c.sig,
      lat: Number(c.near.lat.toFixed(6)),
      lng: Number(c.near.lng.toFixed(6)),
      distance_m: Math.round(c.near.dist),
    });
    if (results.length >= limit) break;
  }

  // Optional AREA-CHARACTER summary for the Detailed read-out. A second aggregation
  // query that counts ALL features in a small radius (named AND unnamed), unlike the
  // named-only results above. The client turns these raw counts into "feel of the
  // space" phrasing.
  let summary: AreaSummary | undefined;
  if (sp.get("summary") === "1") {
    const radius = Math.min(1500, Math.max(50, Number(sp.get("radius")) || 250));
    const agg = await opensearch.search({
      index: INDEX,
      body: {
        size: 0,
        track_total_hits: true,
        query: { geo_distance: { distance: `${radius}m`, location: { lat, lon: lng } } },
        aggs: {
          by_category: { terms: { field: "category", size: 30 } },
          by_subtype: { terms: { field: "subtype", size: 80 } },
          kerb_lowered: { filter: { term: { "access.kerb": "lowered" } } },
          tactile_yes: { filter: { term: { "access.tactile_paving": "yes" } } },
          wheelchair_yes: { filter: { term: { "access.wheelchair": "yes" } } },
        },
      },
    });
    const ab = agg.body.aggregations as unknown as Record<
      string,
      { buckets?: Array<{ key: string; doc_count: number }>; doc_count?: number }
    >;
    const toMap = (b?: Array<{ key: string; doc_count: number }>): Record<string, number> =>
      Object.fromEntries((b ?? []).map((x) => [x.key, x.doc_count]));
    const total = (agg.body.hits?.total as unknown as { value: number })?.value ?? 0;

    // Containment — which landuse / park / region polygon you're standing IN. Pull nearby
    // area polygons with geometry, keep those whose ring contains you, smallest (most
    // specific) first.
    const zoneRes = await opensearch.search({
      index: INDEX,
      body: {
        size: 60,
        query: {
          bool: {
            must: [{ terms: { category: ["landuse", "park", "boundary"] } }],
            filter: [{ geo_distance: { distance: "1500m", location: { lat, lon: lng } } }],
          },
        },
        _source: ["display", "category", "subtype", "name", "geom"],
      },
    });
    const within = ((zoneRes.body.hits?.hits as unknown as Array<{ _source: Record<string, unknown> }>) ?? [])
      .map((h) => ({ s: h._source, geom: h._source.geom as Geom | undefined }))
      .filter((z) => z.geom && pointInGeom(lat, lng, z.geom))
      .sort((a, b) => geomAreaM2(a.geom as Geom) - geomAreaM2(b.geom as Geom))
      .slice(0, 3)
      .map((z) => ({
        display: String(z.s.display ?? z.s.name ?? ""),
        category: String(z.s.category ?? ""),
        subtype: String(z.s.subtype ?? ""),
      }));

    // Nearest named settlement ("near Buckhorn").
    const placeRes = await opensearch.search({
      index: INDEX,
      body: {
        size: 1,
        query: {
          bool: {
            must: [{ term: { category: "place" } }, { exists: { field: "name" } }],
            filter: [{ geo_distance: { distance: "12000m", location: { lat, lon: lng } } }],
          },
        },
        sort: [{ _geo_distance: { location: { lat, lon: lng }, order: "asc", unit: "m", distance_type: "plane", mode: "min" } }],
        _source: ["display", "subtype", "lat", "lng"],
      },
    });
    const pl = ((placeRes.body.hits?.hits as unknown as Array<{ _source: Record<string, unknown> }>) ?? [])[0]?._source;
    const settlement = pl
      ? {
          display: String(pl.display ?? ""),
          subtype: String(pl.subtype ?? ""),
          distance_m: Math.round(metresBetween(lat, lng, pl.lat as number, pl.lng as number)),
          lat: pl.lat as number,
          lng: pl.lng as number,
        }
      : null;

    summary = {
      radius_m: radius,
      total,
      categories: toMap(ab.by_category.buckets),
      subtypes: toMap(ab.by_subtype.buckets),
      access: {
        kerb_lowered: ab.kerb_lowered.doc_count ?? 0,
        tactile_paving: ab.tactile_yes.doc_count ?? 0,
        wheelchair: ab.wheelchair_yes.doc_count ?? 0,
      },
      within,
      settlement,
    };
  }

  // Optional INTERSECTIONS (?xings=1): for the street you're on/near, the nearest cross-
  // street junction at EACH END of the block. Quick describe reads these ("on Church
  // Street; nearest intersection Wellesley Street, 45 m, 6 o'clock"). Computed from a
  // dedicated nearby-roads query so the cross streets are never crowded out of the main
  // result set in a dense area.
  let intersections:
    | Array<{ display: string; lat: number; lng: number; distance_m: number }>
    | undefined;
  // A nearby REAL house number to anchor by ("near number 120"), preferring one on the
  // street you're on — sparse in OSM, so often absent (then omitted, never invented).
  let address: { housenumber: string; street: string; distance_m: number } | undefined;
  if (sp.get("xings") === "1") {
    const roadRes = await opensearch.search({
      index: INDEX,
      body: {
        size: 60,
        query: {
          bool: {
            must: [{ term: { category: "road" } }, { exists: { field: "name" } }],
            filter: [{ geo_distance: { distance: "500m", location: { lat, lon: lng } } }],
          },
        },
        sort: [{ _geo_distance: { location: { lat, lon: lng }, order: "asc", unit: "m", distance_type: "plane", mode: "min" } }],
        _source: ["name", "display", "subtype", "geom"],
      },
    });
    const roads = ((roadRes.body.hits?.hits as unknown as Array<{ _source: Record<string, unknown> }>) ?? [])
      .map((h) => {
        const s = h._source;
        const geom = s.geom as Geom | undefined;
        return {
          name: String(s.name ?? "").trim(),
          display: String(s.display ?? s.name ?? ""),
          subtype: String(s.subtype ?? ""),
          geom,
          near: geom ? nearestOnGeom(lat, lng, geom) : null,
        };
      })
      .filter((r) => r.geom && r.near);

    // The street we're on/near: the nearest named road within ON_ROAD_M.
    let userRoad: string | null = null;
    let userDist = Infinity;
    for (const r of roads) if (r.near!.dist < userDist) { userDist = r.near!.dist; userRoad = r.name.toLowerCase(); }
    if (userDist > ON_ROAD_M) userRoad = null;

    address = (await nearestAddress(lat, lng, userRoad ?? undefined)) ?? undefined;

    if (userRoad) {
      const userGeoms = roads.filter((r) => r.name.toLowerCase() === userRoad).map((r) => r.geom as Geom);
      const dir = roadDirAt(lat, lng, userGeoms);
      // "main" cross streets — named through-streets; exclude minor ways that don't define a block.
      const MINOR = new Set(["service", "track", "footway", "path", "cycleway", "steps", "bridleway", "construction", "platform", "corridor"]);
      const xs: Array<{ display: string; lat: number; lng: number; dist: number; proj: number }> = [];
      for (const r of roads) {
        if (!r.geom || r.name.toLowerCase() === userRoad || MINOR.has(r.subtype)) continue;
        let best: { lat: number; lng: number; dist: number } | null = null;
        for (const ug of userGeoms)
          for (const p of geomCrossings(r.geom, ug)) {
            const d = metresBetween(lat, lng, p[1], p[0]);
            if (!best || d < best.dist) best = { lat: p[1], lng: p[0], dist: d };
          }
        if (best) xs.push({ display: r.display, lat: best.lat, lng: best.lng, dist: best.dist, proj: dir ? projAlong(lat, lng, best.lat, best.lng, dir) : 0 });
      }
      // Nearest junction per cross-street name.
      const byName = new Map<string, (typeof xs)[number]>();
      for (const x of xs) { const k = x.display.toLowerCase(); if (!byName.has(k) || x.dist < byName.get(k)!.dist) byName.set(k, x); }
      const all = [...byName.values()];
      // One junction at each END of the block (nearest ahead + nearest behind along the
      // street); if we can't split by direction, just the nearest two.
      const fwd = all.filter((x) => x.proj >= 0).sort((a, b) => a.dist - b.dist)[0];
      const back = all.filter((x) => x.proj < 0).sort((a, b) => a.dist - b.dist)[0];
      let chosen = [fwd, back].filter(Boolean) as typeof all;
      if (chosen.length < 2) chosen = all.sort((a, b) => a.dist - b.dist).slice(0, 2);
      intersections = chosen
        .sort((a, b) => a.dist - b.dist)
        .map((x) => ({ display: x.display, lat: Number(x.lat.toFixed(6)), lng: Number(x.lng.toFixed(6)), distance_m: Math.round(x.dist) }));
    }
  }

  return NextResponse.json({ results, summary, intersections, address });
}
