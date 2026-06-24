/* GET /api/map-nearby?lat=<n>&lng=<n>&limit=<n>
 *
 * Nearest NAMED map features to a point, by geographic distance — the
 * orientation lookup behind the demo's live location tracking ("Where am I?"
 * and the throttled "near <place>" announcements). Same-origin proxy in front
 * of the `map-features` index, like /api/map-search.
 *
 * Only NAMED features are returned (streets, rivers, parks, named places) —
 * those are what orient a blind pedestrian; unnamed generic geometry ("Woods",
 * a bare bench) is noise here. Repeated segments of one named way (a road mapped
 * as many pieces) are collapsed to the single nearest instance.
 *
 * Returns { results: [{ id, display, category?, subtype?, lat, lng, distance_m }] }
 * sorted nearest-first. */

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
      // Oversample: one named way is many segments, so we fetch extra and
      // collapse by name to fill `limit` with DISTINCT named features.
      size: limit * 5,
      query: { bool: { filter: [{ exists: { field: "name" } }] } },
      sort: [
        {
          _geo_distance: {
            location: { lat, lon: lng },
            order: "asc",
            unit: "m",
            distance_type: "plane", // cheap + plenty accurate at street scale
          },
        },
      ],
      _source: ["osm_id", "name", "display", "category", "subtype", "lat", "lng"],
    },
  });

  const hits =
    (res.body.hits?.hits as unknown as Array<{
      _id: string;
      _source: Record<string, unknown>;
      sort?: number[];
    }>) ?? [];

  const seen = new Set<string>();
  const results: Result[] = [];
  for (const h of hits) {
    const s = h._source;
    const name = String(s.name ?? "").trim().toLowerCase();
    if (name && seen.has(name)) continue; // collapse repeated segments of one way
    if (name) seen.add(name);
    results.push({
      id: h._id,
      display: (s.display as string) ?? (s.name as string) ?? "",
      category: s.category as string | undefined,
      subtype: s.subtype as string | undefined,
      lat: s.lat as number,
      lng: s.lng as number,
      distance_m: Math.round(h.sort?.[0] ?? 0),
    });
    if (results.length >= limit) break;
  }

  return NextResponse.json({ results });
}
