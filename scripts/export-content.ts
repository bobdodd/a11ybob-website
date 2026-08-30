/* Mongo -> content files. The ONE-OFF that bootstraps content/ from what is
 * already published, and afterwards a way to check the repo still agrees with
 * the database.
 *
 *   npx tsx scripts/export-content.ts [--out content] [--kind experience|article]
 *
 * READ-ONLY. It never writes to Mongo.
 *
 * PUBLISHED ONLY, deliberately. The repo is public, so exporting drafts would
 * put unpublished writing on GitHub. Drafts stay in Mongo, which is where the
 * draft/published toggle in decision 0003 expects them to live.
 *
 * Articles carry their body on the CURRENT VERSION (articles.currentVersionId
 * -> article_versions), so the export joins the two; experiences are flat. */
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { MongoClient, type Db, type ObjectId } from "mongodb";
import { render, asDate, type FrontMatter, type Kind } from "./content-file.js";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const MONGODB_DB = process.env.MONGODB_DB ?? "a11y_paradise";

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

type Row = { slug: string; front: FrontMatter; body: string };

async function experiences(db: Db): Promise<Row[]> {
  const docs = await db.collection("experiences").find({ status: "published" }).toArray();
  return docs.map((d) => ({
    slug: String(d.slug),
    body: String(d.content ?? ""),
    front: {
      title: String(d.title ?? ""),
      publishedAt: asDate(d.publishedAt ?? d.createdAt ?? new Date()),
      tags: (d.tags as string[]) ?? [],
      originUrl: d.originUrl as string | undefined,
      originLabel: d.originLabel as string | undefined,
      allowMojibake: d.allowMojibake as string | undefined,
    },
  }));
}

async function articles(db: Db): Promise<Row[]> {
  const docs = await db.collection("articles").find({ status: "published" }).toArray();
  const ids = docs.map((a) => a.currentVersionId as ObjectId).filter(Boolean);
  const versions = await db.collection("article_versions").find({ _id: { $in: ids } }).toArray();
  const byId = new Map(versions.map((v) => [String(v._id), v]));
  const out: Row[] = [];
  for (const a of docs) {
    const v = byId.get(String(a.currentVersionId));
    if (!v) {
      console.warn(`  ! ${a.slug}: currentVersionId points at no version — skipped`);
      continue;
    }
    out.push({
      slug: String(a.slug),
      body: String(v.content ?? ""),
      front: {
        // The article doc's title is the snapshot the index renders; prefer it.
        title: String(a.title ?? v.title ?? ""),
        publishedAt: asDate(a.publishedAt ?? a.createdAt ?? new Date()),
        tags: (a.tags as string[]) ?? [],
        domains: (a.domains as string[]) ?? [],
        originUrl: a.originUrl as string | undefined,
        originLabel: a.originLabel as string | undefined,
        allowMojibake: a.allowMojibake as string | undefined,
      },
    });
  }
  return out;
}

async function main() {
  const outRoot = arg("out", "content")!;
  const only = arg("kind");
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);

  const kinds: Kind[] = only ? [only as Kind] : ["experience", "article"];
  let total = 0;
  for (const kind of kinds) {
    const rows = kind === "experience" ? await experiences(db) : await articles(db);
    const dir = path.join(outRoot, kind);
    mkdirSync(dir, { recursive: true });
    console.log(`${kind}: ${rows.length} published`);
    for (const r of rows) {
      if (!r.slug) { console.warn("  ! a document has no slug — skipped"); continue; }
      const file = path.join(dir, `${r.slug}.md`);
      writeFileSync(file, render(r.front, r.body), "utf8");
      console.log(`  ${file}  (${r.body.length.toLocaleString()} chars)`);
      total++;
    }
  }
  await client.close();
  console.log(`\n${total} file(s) written under ${outRoot}/`);
}

main().catch((e) => { console.error(e); process.exit(1); });
