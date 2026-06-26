/* Append / UPSERT map features into the EXISTING `map-features` OpenSearch index,
 * without dropping it. Use this to add a new region (e.g. Calgary) to a live index
 * that already holds other regions: index-map.ts deletes-and-rebuilds, which is only
 * correct for a from-scratch full reindex and would wipe every other region.
 *
 * Documents are keyed by osm_id (OSM ids are globally unique across regions), so this
 * is idempotent — re-running replaces a region's own docs in place, never duplicates,
 * and never touches another region's docs. The index mapping is left as-is (the
 * dynamic templates already map access.* / address.* on the live index).
 *
 * Run where OpenSearch lives (OPENSEARCH_URL), pointing at the NDJSON:
 *   tsx scripts/upsert-map.ts /path/to/map-features.ndjson
 */

import fs from "node:fs";
import readline from "node:readline";
import { Client } from "@opensearch-project/opensearch";

const OPENSEARCH_URL = process.env.OPENSEARCH_URL ?? "http://localhost:9200";
const INDEX = "map-features";
const BATCH = 2000; // docs per bulk request (2 lines each)

const os = new Client({ node: OPENSEARCH_URL });

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: tsx scripts/upsert-map.ts <map-features.ndjson>");
    process.exit(1);
  }
  if (!fs.existsSync(file)) {
    console.error(`no such file: ${file}`);
    process.exit(1);
  }

  // Guard: this tool only ADDS to an existing index. A from-scratch build is
  // index-map.ts's job — refuse rather than silently create an unmapped index.
  if (!(await os.indices.exists({ index: INDEX })).body) {
    console.error(
      `index "${INDEX}" does not exist — use index-map.ts for a from-scratch build.`,
    );
    process.exit(1);
  }

  console.log(`OpenSearch: ${OPENSEARCH_URL}`);
  console.log(`Source:     ${file}`);
  const before = (await os.count({ index: INDEX })).body.count;
  console.log(`Index "${INDEX}" holds ${before} docs — appending (no drop).`);

  const rl = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity,
  });

  let body: unknown[] = [];
  let read = 0;
  let errors = 0;

  const flush = async () => {
    if (body.length === 0) return;
    const res = await os.bulk({ body, refresh: false });
    if (res.body.errors) {
      const failed = res.body.items.filter(
        (i: { index?: { error?: unknown } }) => i.index?.error,
      );
      errors += failed.length;
      if (failed[0]) console.error(JSON.stringify(failed[0], null, 2));
    }
    body = [];
  };

  for await (const line of rl) {
    if (!line.trim()) continue;
    let doc: { osm_id?: number };
    try {
      doc = JSON.parse(line);
    } catch {
      continue;
    }
    body.push({ index: { _index: INDEX, _id: String(doc.osm_id) } });
    body.push(doc);
    read += 1;
    if (body.length >= BATCH * 2) await flush();
  }
  await flush();

  await os.indices.refresh({ index: INDEX });
  const after = (await os.count({ index: INDEX })).body.count;
  console.log(
    `map-features: read ${read} docs, ${errors} bulk errors. Index ${before} -> ${after}.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
