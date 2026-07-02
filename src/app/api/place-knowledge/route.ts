/* GET /api/place-knowledge?lat=<n>&lng=<n>   — cited place knowledge for a point
 * GET /api/place-knowledge?q=<place name>     — geocode the name, then the same
 *
 * The backend for the (unlisted, testing) Knowledge Map demo. Returns short, CITED
 * Wikipedia blurbs about the area around a point, from the traffic-warmed cache in
 * front of Wikipedia (see @/lib/placeKnowledge). Read-only proxy; the client narrates.
 *
 * `q` is a convenience for armchair testing (look up Buckhorn without being there): a
 * light geocode against the map-features index — nearest good name match, settlements
 * preferred — then the same knowledge lookup at its coordinates. */

import { NextRequest, NextResponse } from "next/server";
import { opensearch } from "@/lib/opensearch";
import { placeKnowledge } from "@/lib/placeKnowledge";

export const dynamic = "force-dynamic";

type Geo = { display: string; lat: number; lng: number } | null;

async function geocode(q: string): Promise<Geo> {
  const res = await opensearch.search({
    index: "map-features",
    body: {
      size: 1,
      query: {
        bool: {
          must: [{ exists: { field: "name" } }],
          should: [
            { match_phrase: { name: { query: q, boost: 4 } } },
            { match: { name: { query: q } } },
            { term: { category: { value: "place", boost: 3 } } }, // prefer settlements
          ],
          minimum_should_match: 1,
        },
      },
      _source: ["display", "name", "lat", "lng"],
    },
  });
  const hit = (res.body.hits?.hits as unknown as Array<{ _source: Record<string, unknown> }>)?.[0]?._source;
  if (!hit || typeof hit.lat !== "number" || typeof hit.lng !== "number") return null;
  return { display: String(hit.display ?? hit.name ?? q), lat: hit.lat as number, lng: hit.lng as number };
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const q = (sp.get("q") ?? "").trim();
  // Missing params must read as NaN, not 0 — Number(null) is 0, which would silently
  // query Null Island (0,0) when only `q` is given.
  const latP = sp.get("lat"), lngP = sp.get("lng");
  let lat = latP !== null && latP !== "" ? Number(latP) : NaN;
  let lng = lngP !== null && lngP !== "" ? Number(lngP) : NaN;
  let resolved: Geo = null;

  if (q && (!Number.isFinite(lat) || !Number.isFinite(lng))) {
    resolved = await geocode(q);
    if (!resolved) {
      return NextResponse.json({ error: `Couldn't find a place called "${q}".`, articles: [] }, { status: 404 });
    }
    lat = resolved.lat;
    lng = resolved.lng;
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Give a location (lat & lng) or a place name (q).", articles: [] }, { status: 400 });
  }

  try {
    const knowledge = await placeKnowledge(lat, lng);
    return NextResponse.json({ ...knowledge, resolved, lat, lng });
  } catch (e) {
    return NextResponse.json({ error: `Couldn't reach the knowledge source: ${(e as Error).message}`, articles: [] }, { status: 502 });
  }
}
