/* One-off (and re-runnable) populate of `name_phonetic` on existing map-features docs.
 *
 * upsert-map.ts now computes name_phonetic on every upsert, so NEW / re-upserted docs already
 * carry it. This backfills the docs that were indexed before that change. Safe to re-run — it's
 * a partial update (adds/overwrites just name_phonetic), keyed by _id, idempotent. Uses the SAME
 * phoneticKeys() as the query side so the keys line up.
 *
 * Run on the VPS:  OPENSEARCH_URL=http://localhost:9200 node_modules/.bin/tsx scripts/populate-phonetics.ts
 */
import { Client } from "@opensearch-project/opensearch";
import { phoneticKeys } from "../src/lib/phonetic";

const OPENSEARCH_URL = process.env.OPENSEARCH_URL ?? "http://localhost:9200";
const INDEX = "map-features";
const os = new Client({ node: OPENSEARCH_URL });

async function main() {
  let res = await os.search({
    index: INDEX,
    scroll: "10m",
    body: { size: 3000, _source: ["name", "display"], query: { exists: { field: "name" } } },
  });
  let scanned = 0, updated = 0;
  while (true) {
    const hits = (res.body.hits?.hits ?? []) as Array<{ _id: string; _source: { name?: string; display?: string } }>;
    if (!hits.length) break;
    const body: unknown[] = [];
    for (const h of hits) {
      scanned++;
      const keys = phoneticKeys(h._source.name || h._source.display);
      if (!keys.length) continue;
      body.push({ update: { _index: INDEX, _id: h._id } });
      body.push({ doc: { name_phonetic: keys } });
      updated++;
    }
    if (body.length) {
      const r = await os.bulk({ body, refresh: false });
      if ((r.body as { errors?: boolean }).errors) {
        const bad = (r.body.items as Array<{ update?: { error?: unknown } }>).find((i) => i.update?.error);
        console.error("bulk error sample:", JSON.stringify(bad?.update?.error));
      }
    }
    if (scanned % 60000 < 3000) console.log(`  ${scanned} scanned, ${updated} keyed`);
    const sid = res.body._scroll_id as string;
    res = await os.scroll({ scroll_id: sid, scroll: "10m" });
  }
  await os.indices.refresh({ index: INDEX });
  console.log(`DONE — scanned ${scanned}, wrote name_phonetic on ${updated}.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
