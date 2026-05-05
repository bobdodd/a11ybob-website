import { MongoClient, ObjectId, type Db } from "mongodb";
import { Client } from "@opensearch-project/opensearch";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const MONGODB_DB = process.env.MONGODB_DB ?? "a11y_paradise";
const OPENSEARCH_URL = process.env.OPENSEARCH_URL ?? "http://localhost:9200";

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

const dateField = {
  type: "date",
  format: "yyyy-MM-dd||strict_date_optional_time",
};

const text = (extra: Record<string, unknown> = {}) => ({
  type: "text",
  analyzer: "a11y_text",
  ...extra,
});

const textWithKeyword = (ignoreAbove: number) => ({
  type: "text",
  analyzer: "a11y_text",
  fields: { keyword: { type: "keyword", ignore_above: ignoreAbove } },
});

const reviewsMapping = {
  properties: {
    title: textWithKeyword(512),
    authors: { type: "keyword" },
    year: { type: "integer" },
    publication: textWithKeyword(256),
    doi: { type: "keyword" },
    tags: { type: "keyword" },
    standards_referenced: { type: "keyword" },
    summary: text(),
    key_findings: text(),
    relevance: text(),
    rating: { type: "integer" },
    created: dateField,
    updated: dateField,
  },
};

const glossaryMapping = {
  properties: {
    term: textWithKeyword(256),
    aka: text(),
    definition: text(),
    category: { type: "keyword" },
    related_terms: { type: "keyword" },
    sources: { type: "keyword" },
    created: dateField,
    updated: dateField,
  },
};

const articlesMapping = {
  properties: {
    title: textWithKeyword(512),
    slug: { type: "keyword" },
    author: { type: "keyword" },
    tags: { type: "keyword" },
    domains: { type: "keyword" },
    summary: text(),
    content: text(),
    publishedAt: dateField,
    updatedAt: dateField,
  },
};

type IndexDoc = { id: string; source: Record<string, unknown> };

async function buildReviews(db: Db): Promise<IndexDoc[]> {
  const docs = await db.collection("reviews").find({}).toArray();
  return docs.map((doc) => {
    const { _id, ...rest } = doc;
    return { id: String(_id), source: rest };
  });
}

async function buildGlossary(db: Db): Promise<IndexDoc[]> {
  const docs = await db.collection("glossary").find({}).toArray();
  return docs.map((doc) => {
    const { _id, ...rest } = doc;
    return { id: String(_id), source: rest };
  });
}

// Articles: published only. Joins the current version's content.
async function buildArticles(db: Db): Promise<IndexDoc[]> {
  const articles = await db
    .collection("articles")
    .find({ status: "published" })
    .toArray();

  if (articles.length === 0) return [];

  const versionIds = articles
    .map((a) => a.currentVersionId)
    .filter((id): id is ObjectId => id instanceof ObjectId);

  const versions = await db
    .collection("article_versions")
    .find({ _id: { $in: versionIds } })
    .toArray();

  const versionMap = new Map(versions.map((v) => [String(v._id), v]));

  return articles
    .filter((a) => a.currentVersionId && versionMap.has(String(a.currentVersionId)))
    .map((a) => {
      const v = versionMap.get(String(a.currentVersionId))!;
      return {
        id: String(a._id),
        source: {
          slug: a.slug,
          title: v.title,
          summary: v.summary,
          content: v.content,
          author: a.author,
          tags: a.tags ?? [],
          domains: a.domains ?? [],
          publishedAt: a.publishedAt ?? a.createdAt,
          updatedAt: a.updatedAt,
        },
      };
    });
}

const corpora = [
  { name: "reviews", mapping: reviewsMapping, build: buildReviews },
  { name: "glossary", mapping: glossaryMapping, build: buildGlossary },
  { name: "articles", mapping: articlesMapping, build: buildArticles },
] as const;

async function main() {
  const mongo = new MongoClient(MONGODB_URI);
  await mongo.connect();
  const db = mongo.db(MONGODB_DB);

  const os = new Client({ node: OPENSEARCH_URL });
  await os.info();

  console.log(`Mongo:      ${MONGODB_URI} / ${MONGODB_DB}`);
  console.log(`OpenSearch: ${OPENSEARCH_URL}`);
  console.log();

  for (const { name, mapping, build } of corpora) {
    process.stdout.write(`→ ${name}: `);

    const exists = await os.indices.exists({ index: name });
    if (exists.body) {
      await os.indices.delete({ index: name });
    }

    await os.indices.create({
      index: name,
      body: { settings: { analysis }, mappings: mapping },
    });

    const docs = await build(db);

    if (docs.length === 0) {
      console.log("index created, no documents to load");
      continue;
    }

    const body = docs.flatMap((d) => [
      { index: { _index: name, _id: d.id } },
      d.source,
    ]);

    const bulk = await os.bulk({ body, refresh: true });

    if (bulk.body.errors) {
      const failed = bulk.body.items.filter(
        (i: { index?: { error?: unknown } }) => i.index?.error,
      );
      console.log(`bulk completed with ${failed.length} errors`);
      if (failed[0]) console.error(JSON.stringify(failed[0], null, 2));
    }

    const count = await os.count({ index: name });
    console.log(`indexed ${count.body.count} documents`);
  }

  await mongo.close();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
