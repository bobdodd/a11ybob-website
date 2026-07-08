import { getDb } from "@/lib/mongo";
import { opensearch } from "@/lib/opensearch";

export const dynamic = "force-dynamic";

const mongoCollections = [
  "reviews",
  "glossary",
  "articles",
  "article_versions",
] as const;

const osIndexes = ["reviews", "glossary", "articles"] as const;

async function checkMongo() {
  try {
    const db = await getDb();
    const counts: Record<string, number> = {};
    for (const c of mongoCollections) {
      counts[c] = await db.collection(c).countDocuments();
    }
    const articleStatus = await db
      .collection("articles")
      .aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }])
      .toArray();
    return {
      ok: true,
      database: db.databaseName,
      counts,
      article_status: Object.fromEntries(
        articleStatus.map((s) => [s._id ?? "(none)", s.n]),
      ),
    };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

async function checkOpenSearch() {
  try {
    const info = await opensearch.info();
    const counts: Record<string, number> = {};
    for (const idx of osIndexes) {
      const exists = await opensearch.indices.exists({ index: idx });
      counts[idx] = exists.body
        ? (await opensearch.count({ index: idx })).body.count
        : -1;
    }
    return {
      ok: true,
      version: info.body.version.number,
      lucene: info.body.version.lucene_version,
      cluster: info.body.cluster_name,
      counts,
    };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export default async function HealthPage() {
  const [mongo, os] = await Promise.all([checkMongo(), checkOpenSearch()]);

  return (
    <main id="main" className="site-main">
      <div className="center">
        <h1>Backend health</h1>

        <h2>MongoDB</h2>
        <pre>{JSON.stringify(mongo, null, 2)}</pre>

        <h2>OpenSearch</h2>
        <pre>{JSON.stringify(os, null, 2)}</pre>

        <p className="muted">
          <small>
            OpenSearch indexes only the current version of articles whose
            status is <code>published</code>. While every article is a
            draft, the <code>articles</code>{" "}index will be empty by
            design — flip <code>status</code>{" "}to <code>published</code>{" "}
            and re-run <code>npm run index</code>.
          </small>
        </p>
      </div>
    </main>
  );
}
