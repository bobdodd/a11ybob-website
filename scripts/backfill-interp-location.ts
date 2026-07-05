/* Backfill `location` (geo_point) on interpolation docs indexed without it.
 *
 * The tiler's interpolation branch built its doc but skipped the `location` field every other
 * kind gets, so geo_distance — which interpolatedAddress() relies on — could never match an
 * interpolation line, and "about number N" was silently inert. The tiler is now fixed for
 * future parses; this backfills the already-deployed docs from their stored `geom` (multi-point
 * along the line, matching what the tiler now writes), falling back to the centroid lat/lng.
 * Re-runnable and idempotent: it targets only interpolation docs still MISSING `location`, so it
 * can be run again as later regions land.
 *
 * Run on the VPS:  OPENSEARCH_URL=http://localhost:9200 node_modules/.bin/tsx scripts/backfill-interp-location.ts
 */
import { Client } from "@opensearch-project/opensearch";

const OPENSEARCH_URL = process.env.OPENSEARCH_URL ?? "http://localhost:9200";
const INDEX = "map-features";
const os = new Client({ node: OPENSEARCH_URL });

type Geom = { c?: number[][][] };

// Build a geo_point value (array of {lat,lon}) from the stored line geometry — vertices are
// [lng, lat]. Fall back to the centroid when there is no usable geom.
function locFromGeom(geom: Geom | undefined, lat?: number, lng?: number): Array<{ lat: number; lon: number }> | null {
  const ring = geom?.c?.[0];
  if (Array.isArray(ring) && ring.length) {
    const pts = ring
      .filter((p) => Array.isArray(p) && p.length >= 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]))
      .map(([lo, la]) => ({ lat: la, lon: lo }));
    if (pts.length) return pts;
  }
  if (typeof lat === "number" && typeof lng === "number") return [{ lat, lon: lng }];
  return null;
}

async function main() {
  let res = await os.search({
    index: INDEX,
    scroll: "10m",
    body: {
      size: 2000,
      _source: ["geom", "lat", "lng"],
      query: { bool: { filter: [{ term: { kind: "interpolation" } }], must_not: [{ exists: { field: "location" } }] } },
    },
  });
  let scanned = 0, updated = 0, skipped = 0;
  while (true) {
    const hits = (res.body.hits?.hits ?? []) as Array<{ _id: string; _source: { geom?: Geom; lat?: number; lng?: number } }>;
    if (!hits.length) break;
    const body: unknown[] = [];
    for (const h of hits) {
      scanned++;
      const loc = locFromGeom(h._source.geom, h._source.lat, h._source.lng);
      if (!loc) { skipped++; continue; }
      body.push({ update: { _index: INDEX, _id: h._id } });
      body.push({ doc: { location: loc } });
      updated++;
    }
    if (body.length) {
      const r = await os.bulk({ body, refresh: false });
      if ((r.body as { errors?: boolean }).errors) {
        const bad = (r.body.items as Array<{ update?: { error?: unknown } }>).find((i) => i.update?.error);
        console.error("bulk error sample:", JSON.stringify(bad?.update?.error));
      }
    }
    if (scanned % 50000 < 2000) console.log(`  ${scanned} scanned, ${updated} updated, ${skipped} skipped`);
    res = await os.scroll({ scroll_id: res.body._scroll_id as string, scroll: "10m" });
  }
  await os.indices.refresh({ index: INDEX });
  console.log(`DONE — scanned ${scanned}, set location on ${updated}, skipped ${skipped} (no geom/coords).`);
}
main().catch((e) => { console.error(e); process.exit(1); });
