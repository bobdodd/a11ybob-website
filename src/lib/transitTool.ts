import { opensearch } from "./opensearch";

/* transit_nearby — the Knowledge Map's GTFS-static transit tool.
 *
 * "Which routes serve stops near here" — macronavigation, from agencies' published STATIC
 * schedules (GTFS-static, open data, ingested into the `transit-stops` index by
 * gtfs-ingest.py). KNOWLEDGE, not live times: routes + mode + a coarse service pattern,
 * never departure times. Lives here (not map-tools.ts) so it's added only to the Knowledge
 * Map's chat route, leaving the Conversational Map unchanged. */

const INDEX = "transit-stops";

export const TRANSIT_NEARBY_SCHEMA = {
  name: "transit_nearby",
  description:
    "Public-transit routes serving stops near a point, from static GTFS schedules (agency open data). Use it for 'what transit / buses / trains / streetcars serve here', 'how do I get around', 'nearest stop', or when a place's transit is relevant. Returns nearby stops, each with the ROUTES that serve it (name + mode: bus/streetcar/subway/train/ferry), the agency, distance, and a coarse service pattern (daily / weekdays only / weekends only). This is KNOWLEDGE, not live info — NEVER give departure times, 'next bus', or 'how long until'. Give the user's current coordinates for 'here', or a find_place result's coordinates for a place they name.",
  input_schema: {
    type: "object",
    properties: {
      lat: { type: "number", description: "Latitude of the point." },
      lon: { type: "number", description: "Longitude of the point." },
      radius_m: { type: "integer", description: "Search radius in metres (default 400, max 1500)." },
    },
    required: ["lat", "lon"],
  },
};

type Stop = { name?: string; agency?: string; routes?: unknown; modes?: unknown; service?: string; feed_date?: string };

export async function runTransitNearby(
  input: { lat?: number; lon?: number; radius_m?: number },
  userLoc?: { lat: number; lon: number },
): Promise<unknown> {
  const lat = typeof input.lat === "number" ? input.lat : userLoc?.lat;
  const lon = typeof input.lon === "number" ? input.lon : userLoc?.lon;
  if (typeof lat !== "number" || typeof lon !== "number") {
    return { error: "No coordinates. Use the user's location for 'here', or find_place first." };
  }
  const radius = Math.min(1500, Math.max(50, input.radius_m ?? 400));

  try {
    const res = await opensearch.search({
      index: INDEX,
      body: {
        size: 8,
        query: { bool: { filter: [{ geo_distance: { distance: `${radius}m`, location: { lat, lon } } }] } },
        sort: [{ _geo_distance: { location: { lat, lon }, order: "asc", unit: "m", distance_type: "plane" } }],
        _source: ["name", "agency", "routes", "modes", "service", "feed_date"],
      },
    });
    const hits = (res.body.hits?.hits as unknown as Array<{ _source: Stop; sort?: number[] }>) ?? [];
    const stops = hits.map((h) => ({
      name: h._source.name || "an unnamed stop",
      agency: h._source.agency || "",
      distance_m: Math.round(h.sort?.[0] ?? 0),
      routes: h._source.routes ?? [],
      modes: h._source.modes ?? [],
      service: h._source.service || "",
      feed_date: h._source.feed_date || "",
    }));
    return { count: stops.length, radius_m: radius, stops };
  } catch (e) {
    // Index not built yet, or unreachable — degrade to "no transit data" rather than erroring the turn.
    if ((e as { meta?: { statusCode?: number } })?.meta?.statusCode === 404) {
      return { count: 0, radius_m: radius, stops: [], note: "no transit data for this area yet" };
    }
    throw e;
  }
}
