/* GET /api/map-search?q=<text>&access=<tag,tag>&lat=<n>&lng=<n>&limit=<n>
 *
 * Searches the `map-features` index, built region by region from OSM extracts
 * (see regions.json in the tiled-map repo) — named places, POIs (washrooms,
 * post boxes, benches, …), and addresses. This is a thin server-side proxy so
 * the browser never talks to OpenSearch directly (the demo viewer is a static
 * page hosted inside this site; OpenSearch stays on the VPS, unexposed).
 *
 * Query:
 *   q       free text — matched across name / display / type words / address.
 *   access  comma-separated accessibility tags that MUST be present, e.g.
 *           `wheelchair` or `tactile_paving,toilets:wheelchair`. Accessibility
 *           is a first-class filter here, not an afterthought — the whole point
 *           of the demo is finding the accessible thing, not just the thing.
 *   lat,lng optional viewer centre; when given, nearer results rank higher.
 *           Candidates are bounded to GEO_PREFILTER_KM around the centre; when
 *           that yields fewer than `limit`, the search repeats unbounded and
 *           unboosted, so distant exact matches still surface.
 *   limit   max results (default 20, capped 50).
 *
 * Returns { results: [{ id, display, category, subtype, lat, lng, address?,
 * access?, parent? }] } — the shape the viewer's search list consumes directly.
 * `parent` is the name of the containing place (a school, hospital, park) when
 * the generator's spatial-containment pass found one, so a result can say what
 * it sits inside ("Running track — in King Edward Junior and Senior Public
 * School") and a search for the container surfaces its contents. */

import { NextRequest, NextResponse } from "next/server";
import { opensearch } from "@/lib/opensearch";

export const dynamic = "force-dynamic";

const INDEX = "map-features";
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

// Radius of the candidate pre-filter that runs alongside the distance boost.
// The boost's gauss (scale 2km, offset 200m, decay 0.5) has sigma ~1.7km, so a
// feature 25km out is multiplied by ~1e-46 and its Lucene float score underflows
// to exactly 0.0 — beyond this radius a match cannot be ranked, only tie-broken
// arbitrarily. Bounding the candidate set therefore reorders nothing, while
// keeping the decay off the ~22M documents a common token ("Street") matches
// across the corpus. Keep in step with the decay: widening `scale` widens this.
const GEO_PREFILTER_KM = 25;

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
  parent?: string;
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
  let must: Record<string, unknown>;
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
    must = { dis_max: { queries: [should, prefix], tie_breaker: 0.3 } };
  } else {
    must = { match_all: {} };
  }

  const centre = lat !== null && lng !== null ? { lat, lng } : null;

  // Soft distance boost toward the viewer centre, when we have one. `boost` is
  // dropped on the unbounded pass below: outside GEO_PREFILTER_KM every
  // multiplier has already underflowed to zero, so the decay would score the
  // whole corpus and still leave those results in arbitrary order. Ranking them
  // on text alone is both cheaper and better ordered.
  const compose = (
    extraFilter: unknown[],
    boost: boolean,
  ): Record<string, unknown> => {
    const bounded = { bool: { must, filter: [...filter, ...extraFilter] } };
    if (!boost || !centre) return bounded;
    return {
      function_score: {
        query: bounded,
        functions: [
          {
            gauss: {
              location: {
                origin: { lat: centre.lat, lon: centre.lng },
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
  };

  // Oversample so we can drop OSM's node+way duplicates (one real place mapped
  // as two elements, identical name and position) and still fill `limit`.
  const fetchSize = Math.min(100, limit * 3);

  type Hit = { _id: string; _source: Record<string, unknown> };

  const search = async (query: Record<string, unknown>): Promise<Hit[]> => {
    const res = await opensearch.search({
      index: INDEX,
      body: {
        size: fetchSize,
        query,
        _source: [
          "osm_id",
          "name",
          "display",
          "category",
          "subtype",
          "lat",
          "lng",
          "address",
          "access",
          "parent",
        ],
      },
    });

    // OpenSearch SDK v3 mistypes hits.hits (_id/_source); cast through unknown.
    return (res.body.hits?.hits as unknown as Hit[]) ?? [];
  };

  // Collapse OSM node/way duplicates: one real place mapped as both a point and
  // a building outline reaches the index twice, with distinct ids and slightly
  // different representative coordinates (the way's centroid sits metres off the
  // node). Rule: drop a NAMED feature when an already-kept result shares its
  // name within ~60 m. Only named features are collapsed — generic-labelled
  // features ("Tactile paving", "Bench") are legitimately many, each its own
  // real point, so they're always kept. Hits arrive in score order, so the
  // best-ranked instance is the one retained. `seen` carries the collapse across
  // both passes, so the fallback can only ever add features the bounded pass
  // didn't already return.
  const kept: { name: string; lat: number; lng: number }[] = [];
  const results: Result[] = [];
  const seen = new Set<string>();

  const collect = (hits: Hit[]) => {
    for (const h of hits) {
      if (results.length >= limit) return;
      if (seen.has(h._id)) continue;

      const s = h._source;
      const lat = s.lat as number;
      const lng = s.lng as number;
      const name = ((s.name as string) ?? "").trim().toLowerCase();

      if (name) {
        const dupe = kept.some(
          (k) => k.name === name && metresBetween(k.lat, k.lng, lat, lng) < 60,
        );
        if (dupe) continue;
        kept.push({ name, lat, lng });
      }

      seen.add(h._id);
      results.push({
        id: h._id,
        display: (s.display as string) ?? "",
        category: s.category as string | undefined,
        subtype: s.subtype as string | undefined,
        lat,
        lng,
        address: s.address as Record<string, string> | undefined,
        access: s.access as Record<string, string> | undefined,
        parent: s.parent as string | undefined,
      });
    }
  };

  const geoFilter = centre
    ? [
        {
          geo_distance: {
            distance: `${GEO_PREFILTER_KM}km`,
            location: { lat: centre.lat, lon: centre.lng },
          },
        },
      ]
    : [];

  collect(await search(compose(geoFilter, true)));

  // Too few features within the radius — search the whole corpus so a distant
  // exact match still surfaces, ranked behind anything the bounded pass found.
  if (centre && results.length < limit) {
    collect(await search(compose([], false)));
  }

  return NextResponse.json({ results });
}

function num(v: string | null, fallback: number): number {
  // Guard null/empty FIRST — Number(null) and Number("") are both 0 (finite),
  // which would silently swallow the fallback (e.g. an absent ?limit became 0,
  // clamped to size:1, so every search returned a single hit).
  if (v === null || v.trim() === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// Equirectangular approximation — plenty accurate at the tens-of-metres scale
// we test against, and far cheaper than haversine.
function metresBetween(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371000;
  const rad = Math.PI / 180;
  const dLat = (bLat - aLat) * rad;
  const dLng = (bLng - aLng) * rad * Math.cos(((aLat + bLat) / 2) * rad);
  return R * Math.sqrt(dLat * dLat + dLng * dLng);
}

function numOrNull(v: string | null): number | null {
  if (v === null || v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
