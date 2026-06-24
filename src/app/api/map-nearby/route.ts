/* GET /api/map-nearby?lat=<n>&lng=<n>&limit=<n>
 *
 * Nearest NAMED map features to a point — the orientation lookup behind the demo's
 * live location tracking ("Where am I?" and the throttled "near <place>"
 * announcements). Same-origin proxy in front of the `map-features` index.
 *
 * Distance + direction are to the NEAREST POINT of the feature, not its centroid —
 * critical for a blind user navigating to it (you can stand 20 m from a long road
 * whose middle is 600 m away). Selection uses the index's multi-point geo_distance
 * (recall); the exact distance and the returned lat/lng are then computed in JS from
 * the stored raw geometry (`geom`), so a road reports "20 m, at 3 o'clock" toward
 * the point you'd actually walk to.
 *
 * Only NAMED features (streets, rivers, parks, named places); repeated segments of
 * one named way are collapsed to the single nearest instance.
 *
 * Returns { results: [{ id, display, category?, subtype?, lat, lng, distance_m }] }
 * where lat/lng is the nearest point, sorted nearest-first. */

import { NextRequest, NextResponse } from "next/server";
import { opensearch } from "@/lib/opensearch";

export const dynamic = "force-dynamic";

const INDEX = "map-features";
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 10;

type Result = {
  id: string;
  display: string;
  category?: string;
  subtype?: string;
  lat: number;
  lng: number;
  distance_m: number;
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

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const lat = Number(sp.get("lat"));
  const lng = Number(sp.get("lng"));
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(sp.get("limit")) || DEFAULT_LIMIT));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ results: [] satisfies Result[] });
  }

  const res = await opensearch.search({
    index: INDEX,
    body: {
      // Oversample generously: the index multi-point geo_distance is for RECALL,
      // then we re-rank by exact nearest-point distance below — so the true-nearest
      // must be somewhere in this candidate set, not necessarily at the top yet.
      size: Math.min(120, limit * 12),
      query: { bool: { filter: [{ exists: { field: "name" } }] } },
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

  // Exact distance + nearest point per hit; collapse name-duplicate ways to the
  // nearest, then sort by the true distance.
  const byName = new Map<string, Result>();
  for (const h of hits) {
    const s = h._source;
    const geom = s.geom as Geom | undefined;
    const near: Near = geom
      ? nearestOnGeom(lat, lng, geom)
      : { dist: metresBetween(lat, lng, s.lat as number, s.lng as number), lat: s.lat as number, lng: s.lng as number };

    const r: Result = {
      id: h._id,
      display: (s.display as string) ?? (s.name as string) ?? "",
      category: s.category as string | undefined,
      subtype: s.subtype as string | undefined,
      lat: Number(near.lat.toFixed(6)),
      lng: Number(near.lng.toFixed(6)),
      distance_m: Math.round(near.dist),
    };

    const key = String(s.name ?? h._id).trim().toLowerCase();
    const prev = byName.get(key);
    if (!prev || r.distance_m < prev.distance_m) byName.set(key, r);
  }

  const results = [...byName.values()]
    .sort((a, b) => a.distance_m - b.distance_m)
    .slice(0, limit);

  return NextResponse.json({ results });
}
