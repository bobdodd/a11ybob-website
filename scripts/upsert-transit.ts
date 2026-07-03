/* Append / UPSERT transit stops into the `transit-stops` OpenSearch index (creating it,
 * with mapping, on first run). Companion to gtfs-ingest.py: reads its NDJSON (one stop
 * doc per line, keyed by `stop_id`) from a file or stdin, so the deploy can stream a
 * compressed feed straight in without it ever landing decompressed on the server disk:
 *   tsx scripts/upsert-transit.ts /path/to/transit-stops.ndjson
 *   zstd -dc transit.ndjson.zst | tsx scripts/upsert-transit.ts -
 *
 * Idempotent — re-running replaces a stop's own doc in place (keyed by stop_id =
 * "<mdb_feed_id>:<gtfs_stop_id>", unique across agencies), never duplicates. Knowledge,
 * not live times: each stop carries the routes that serve it (static GTFS schedule).
 */

import fs from "node:fs";
import readline from "node:readline";
import { Client } from "@opensearch-project/opensearch";

const OPENSEARCH_URL = process.env.OPENSEARCH_URL ?? "http://localhost:9200";
const INDEX = "transit-stops";
const BATCH = 2000;

const os = new Client({ node: OPENSEARCH_URL });

const MAPPING = {
  mappings: {
    properties: {
      stop_id: { type: "keyword" },
      agency: { type: "keyword", fields: { text: { type: "text" } } },
      name: { type: "text", fields: { keyword: { type: "keyword" } } },
      lat: { type: "float" },
      lng: { type: "float" },
      location: { type: "geo_point" },
      routes: { type: "object", enabled: false }, // returned verbatim, not queried
      route_labels: { type: "text" },
      modes: { type: "keyword" },
      service: { type: "keyword" },
      feed_date: { type: "keyword" },
    },
  },
};

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: tsx scripts/upsert-transit.ts <transit-stops.ndjson | ->");
    process.exit(1);
  }
  const useStdin = file === "-" || file === "/dev/stdin";
  if (!useStdin && !fs.existsSync(file)) {
    console.error(`no such file: ${file}`);
    process.exit(1);
  }

  if (!(await os.indices.exists({ index: INDEX })).body) {
    console.log(`creating index "${INDEX}"...`);
    await os.indices.create({ index: INDEX, body: MAPPING as unknown as Record<string, unknown> });
  }

  console.log(`OpenSearch: ${OPENSEARCH_URL}`);
  console.log(`Source:     ${useStdin ? "<stdin>" : file}`);
  const before = (await os.count({ index: INDEX })).body.count;
  console.log(`Index "${INDEX}" holds ${before} docs — appending (no drop).`);

  const rl = readline.createInterface({
    input: useStdin ? process.stdin : fs.createReadStream(file),
    crlfDelay: Infinity,
  });

  let body: unknown[] = [];
  let read = 0;
  let errors = 0;

  const flush = async () => {
    if (body.length === 0) return;
    const res = await os.bulk({ body, refresh: false });
    if (res.body.errors) {
      const failed = res.body.items.filter((i: { index?: { error?: unknown } }) => i.index?.error);
      errors += failed.length;
      if (failed[0]) console.error(JSON.stringify(failed[0], null, 2));
    }
    body = [];
  };

  for await (const line of rl) {
    if (!line.trim()) continue;
    let doc: { stop_id?: string };
    try {
      doc = JSON.parse(line) as { stop_id?: string };
    } catch {
      continue;
    }
    if (!doc.stop_id) continue;
    body.push({ index: { _index: INDEX, _id: doc.stop_id } });
    body.push(doc);
    read += 1;
    if (body.length >= BATCH * 2) await flush();
  }
  await flush();

  await os.indices.refresh({ index: INDEX });
  const after = (await os.count({ index: INDEX })).body.count;
  console.log(`transit-stops: read ${read} docs, ${errors} bulk errors. Index ${before} -> ${after}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
