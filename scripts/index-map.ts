/* Build the `map-features` OpenSearch index from the NDJSON the tile generator
 * emits — one document per findable map feature (named things, POIs like
 * washrooms / post boxes / benches, and addresses), with the OSM accessibility
 * tags as filterable fields and a geo_point for distance ranking. The index is
 * built in lockstep with the tiles, from the SAME single OSM parse, so search
 * and map can never drift apart.
 *
 * Run where OpenSearch lives (OPENSEARCH_URL), pointing at the NDJSON:
 *   tsx scripts/index-map.ts /path/to/map-features.ndjson
 */

import fs from "node:fs";
import readline from "node:readline";
import { Client } from "@opensearch-project/opensearch";

const OPENSEARCH_URL = process.env.OPENSEARCH_URL ?? "http://localhost:9200";
const INDEX = "map-features";
const BATCH = 2000; // docs per bulk request (2 lines each)

const os = new Client({ node: OPENSEARCH_URL });

// OpenSearch rejects a field whose name is the empty string, failing the whole doc. A few
// OSM features produce one (e.g. a malformed `addr:` tag becomes address[""]), so drop
// empty-name keys recursively and let the doc index with its valid fields.
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

// Same English text analysis the site's other indices use. (Phonetic / sound-alike matching
// was prototyped and rejected — see the Conversational Map colophon: it was clean but inert,
// because geo-anchoring + the model's awareness of where you are already resolve mishears.)
const analysis = {
  filter: {
    english_stop: { type: "stop", stopwords: "_english_" },
    english_stemmer: { type: "stemmer", language: "english" },
  },
  analyzer: {
    a11y_text: {
      type: "custom",
      tokenizer: "standard",
      filter: ["lowercase", "asciifolding", "english_stop", "english_stemmer"],
    },
  },
};

const text = { type: "text", analyzer: "a11y_text" };

const mapping = {
  // Every access.* tag (wheelchair, tactile_paving, ...) becomes a filterable
  // keyword — that's what powers "wheelchair-accessible washrooms near here".
  dynamic_templates: [
    { access_keywords: { path_match: "access.*", mapping: { type: "keyword" } } },
    { address_strings: { path_match: "address.*", mapping: { type: "keyword" } } },
  ],
  properties: {
    osm_id: { type: "long" },
    name: text,
    display: { ...text, fields: { raw: { type: "keyword" } } },
    category: { type: "keyword" },
    subtype: { type: "keyword" },
    // 'area' marks area-character fills (unnamed water / woods / landuse / boundary);
    // 'path' an unnamed laneway/footway (keeps geometry + accessibility); 'building' an
    // anonymous building (lightweight — centroid + size_class, no geometry). All three are
    // counted/aggregated for description + containment but kept OUT of named search (empty
    // `text`). Absent on ordinary findable features.
    kind: { type: "keyword" },
    // Coarse footprint size of an anonymous building (small | medium | large).
    size_class: { type: "keyword" },
    types: text,
    text,
    // Name of the containing place (school / hospital / park) the spatial-
    // containment pass assigned, when there is one. Retrieved for display ("in
    // <place>") and grouping; parent_name is also folded into `text` so a search
    // for the container surfaces its contents.
    parent: { ...text, fields: { raw: { type: "keyword" } } },
    parent_id: { type: "long" },
    // Raw geometry vertices, stored in _source for EXACT nearest-point distance in
    // /api/map-nearby. Not indexed (enabled:false) — we never query it, only read it.
    geom: { type: "object", enabled: false },
    location: { type: "geo_point" },
    lat: { type: "float" },
    lng: { type: "float" },
  },
};

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: tsx scripts/index-map.ts <map-features.ndjson>");
    process.exit(1);
  }
  if (!fs.existsSync(file)) {
    console.error(`no such file: ${file}`);
    process.exit(1);
  }
  console.log(`OpenSearch: ${OPENSEARCH_URL}`);
  console.log(`Source:     ${file}`);

  if ((await os.indices.exists({ index: INDEX })).body) {
    await os.indices.delete({ index: INDEX });
  }
  await os.indices.create({
    index: INDEX,
    body: { settings: { analysis }, mappings: mapping },
  });

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
      doc = stripEmptyKeys(JSON.parse(line)) as { osm_id?: number };
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
  const count = await os.count({ index: INDEX });
  console.log(
    `map-features: read ${read} docs, indexed ${count.body.count} (${errors} bulk errors${
      strippedKeys ? `, ${strippedKeys} empty-name keys dropped` : ""
    })`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
