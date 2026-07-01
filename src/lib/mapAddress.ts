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
