/* GET /api/map-search?q=<text>&access=<tag,tag>&lat=<n>&lng=<n>&limit=<n>
 *
 * Searches the `map-features` index built from the tiled-Toronto OSM extract —
 * named places, POIs (washrooms, post boxes, benches, …), and addresses. This
 * is a thin server-side proxy so the browser never talks to OpenSearch directly
 * (the demo viewer is a static page hosted inside this site; OpenSearch stays on
 * the VPS, unexposed).
 *
 * Query:
 *   q       free text — matched across name / display / type words / address.
 *   access  comma-separated accessibility tags that MUST be present, e.g.
 *           `wheelchair` or `tactile_paving,toilets:wheelchair`. Accessibility
 *           is a first-class filter here, not an afterthought — the whole point
 *           of the demo is finding the accessible thing, not just the thing.
 *   lat,lng optional viewer centre; when given, nearer results rank higher
 *           (a soft geo boost, not a hard radius — distant exact matches still
 *           surface).
 *   limit   max results (default 20, capped 50).
 *
 * Returns { results: [{ id, display, category, subtype, lat, lng, address?,
 * access? }] } — the shape the viewer's search list consumes directly. */

import { NextRequest, NextResponse } from "next/server";
import { opensearch } from "@/lib/opensearch";

export const dynamic = "force-dynamic";

const INDEX = "map-features";
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

// access tags we let through as filters — guards against arbitrary field
// injection while covering the tags the generator actually emits.
const ACCESS_TAGS = new Set([
  "wheelchair",
  "wheelchair:description",
  "toilets:wheelchair",
  "tactile_paving",
  "tactile_writing",
  "braille",
  "ramp",
  "ramp:wheelchair",
  "handrail",
  "incline",
  "kerb",
  "step_count",
  "automatic_door",
  "door",
  "entrance",
  "hearing_loop",
  "audio_loop",
  "induction_loop",
  "blind",
  "deaf",
]);

type Result = {
  id: string;
  display: string;
  category?: string;
  subtype?: string;
  lat: number;
  lng: number;
  address?: Record<string, string>;
  access?: Record<string, string>;
};

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const q = sp.get("q")?.trim() ?? "";

  const access = (sp.get("access") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter((t) => ACCESS_TAGS.has(t));

  const lat = numOrNull(sp.get("lat"));
  const lng = numOrNull(sp.get("lng"));
  const limit = Math.min(MAX_LIMIT, Math.max(1, num(sp.get("limit"), DEFAULT_LIMIT)));

  // Nothing to search on (no text AND no access filter) → empty, don't return
  // the whole city.
  if (q.length < 2 && access.length === 0) {
    return NextResponse.json({ results: [] satisfies Result[] });
  }

  // An access filter means "this thing IS accessible by that measure", not
  // merely "the tag is present" — so we require the tag exists AND isn't an
  // explicit negative (wheelchair=no, tactile_paving=no, …). Anything yes /
  // limited / designated / a description passes.
  const filter: unknown[] = access.map((tag) => ({
    bool: {
      must: [{ exists: { field: `access.${tag}` } }],
      must_not: [
        { term: { [`access.${tag}`]: "no" } },
        { term: { [`access.${tag}`]: "none" } },
      ],
    },
  }));

  // The text side. With a query we match it across the searchable fields;
  // without one (access-only browse) we take everything that passes the filter.
  let query: Record<string, unknown>;
  if (q.length >= 2) {
    const should = {
      multi_match: {
        query: q,
        type: "best_fields",
        fields: [
          "display^4",
          "name^3",
          "address.street^2",
          "address.housenumber^2",
          "types",
          "text",
        ],
        fuzziness: "AUTO",
      },
    };
    // Prefix match on the display name powers type-ahead ("post off…" →
    // "Post Office") alongside the analysed full-text match.
    const prefix = {
      match_phrase_prefix: { display: { query: q, boost: 2 } },
    };
    query = {
      bool: {
        must: { dis_max: { queries: [should, prefix], tie_breaker: 0.3 } },
        filter,
      },
    };
  } else {
    query = { bool: { must: { match_all: {} }, filter } };
  }

  // Soft distance boost toward the viewer centre, when we have one.
  if (lat !== null && lng !== null) {
    query = {
      function_score: {
        query,
        functions: [
          {
            gauss: {
              location: {
                origin: { lat, lon: lng },
                scale: "2km",
                offset: "200m",
                decay: 0.5,
              },
            },
          },
        ],
        boost_mode: "multiply",
        score_mode: "sum",
      },
    };
  }

  const res = await opensearch.search({
    index: INDEX,
    body: {
      size: limit,
      query,
      _source: [
        "osm_id",
        "display",
        "category",
        "subtype",
        "lat",
        "lng",
        "address",
        "access",
      ],
    },
  });

  // OpenSearch SDK v3 mistypes hits.hits (_id/_source); cast through unknown.
  const hits =
    (res.body.hits?.hits as unknown as Array<{
      _id: string;
      _source: Record<string, unknown>;
    }>) ?? [];

  const results: Result[] = hits.map((h) => {
    const s = h._source;
    return {
      id: h._id,
      display: (s.display as string) ?? "",
      category: s.category as string | undefined,
      subtype: s.subtype as string | undefined,
      lat: s.lat as number,
      lng: s.lng as number,
      address: s.address as Record<string, string> | undefined,
      access: s.access as Record<string, string> | undefined,
    };
  });

  return NextResponse.json({ results });
}

function num(v: string | null, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function numOrNull(v: string | null): number | null {
  if (v === null || v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
