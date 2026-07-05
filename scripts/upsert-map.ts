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
 * Run where OpenSearch lives (OPENSEARCH_URL), pointing at the NDJSON — or pipe it in
 * with "-" so a huge region (Ontario, BC…) never lands decompressed on the server disk:
 *   tsx scripts/upsert-map.ts /path/to/map-features.ndjson
 *   zstd -dc region.ndjson.zst | tsx scripts/upsert-map.ts -
 * It streams (readline + 2000-doc bulk batches), so memory stays bounded either way.
 */

import fs from "node:fs";
import readline from "node:readline";
import { Client } from "@opensearch-project/opensearch";
import { phoneticKeys } from "../src/lib/phonetic";

const OPENSEARCH_URL = process.env.OPENSEARCH_URL ?? "http://localhost:9200";
const INDEX = "map-features";
const BATCH = 2000; // docs per bulk request (2 lines each)

const os = new Client({ node: OPENSEARCH_URL });

// OpenSearch rejects a field whose name is the empty string ("field name cannot be an
// empty string"), which fails the whole doc. A few OSM features produce one — e.g. a
// malformed `addr:` tag becomes address[""] — so drop empty-name keys recursively and
// let the doc index with its valid fields. (Seen once in Ontario: osm_id 1473121340.)
let strippedKeys = 0;
function stripEmptyKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(stripEmptyKeys);
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (k === "") {
        strippedKeys += 1;
        continue;
      }
      out[k] = stripEmptyKeys(val);
    }
    return out;
  }
  return v;
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: tsx scripts/upsert-map.ts <map-features.ndjson | ->");
    process.exit(1);
  }
  const useStdin = file === "-" || file === "/dev/stdin";
  if (!useStdin && !fs.existsSync(file)) {
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
      doc = stripEmptyKeys(JSON.parse(line)) as { osm_id?: number };
    } catch {
      continue;
    }
    // Phonetic key for the accent / Deaf-voice search layer — computed here so it's present on
    // EVERY upsert (including the enrich-reindex re-upserts, which would otherwise strip it).
    const nd = doc as { name?: string; display?: string; name_phonetic?: string[] };
    const keys = phoneticKeys(nd.name || nd.display);
    if (keys.length) nd.name_phonetic = keys;
    body.push({ index: { _index: INDEX, _id: String(doc.osm_id) } });
    body.push(doc);
    read += 1;
    if (body.length >= BATCH * 2) await flush();
  }
  await flush();

  await os.indices.refresh({ index: INDEX });
  const after = (await os.count({ index: INDEX })).body.count;
  console.log(
    `map-features: read ${read} docs, ${errors} bulk errors${
      strippedKeys ? `, ${strippedKeys} empty-name keys dropped` : ""
    }. Index ${before} -> ${after}.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
