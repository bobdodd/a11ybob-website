/* Content files -> Mongo. The one script that publishes long-form writing,
 * replacing sixteen gitignored `scripts/tmp-insert-*.ts` copies.
 *
 *   npx tsx scripts/publish-content.ts content/experience/how-steep-is-this-path.md
 *   npx tsx scripts/publish-content.ts --all
 *   npx tsx scripts/publish-content.ts --all --check      # validate only, write nothing
 *
 * Idempotent, so --all is safe to run at any time and is what makes "rebuild
 * the site from the repo" true for content as well as code.
 *
 * VALIDATION RUNS FIRST, ACROSS EVERY FILE, AND A SINGLE ERROR STOPS THE RUN
 * before anything is written. A half-applied corpus is worse than a refused
 * one: the failures are things like a missing image or a table that will not
 * render, which are invisible on the server and obvious to a reader.
 *
 * Versioning (articles only). Decision 0003 makes every content change a new
 * `article_versions` document with `articles.currentVersionId` moved to point
 * at it. This honours that: a new version is created ONLY when the body
 * actually differs from the current one, so re-running --all does not
 * manufacture history. Metadata-only edits update the article document alone.
 * Experiences are flat documents and are simply upserted by slug. */
import { readdirSync, existsSync } from "fs";
import path from "path";
import { MongoClient, ObjectId, type Db } from "mongodb";
import { parse, check, type ContentFile } from "./content-file.js";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const MONGODB_DB = process.env.MONGODB_DB ?? "a11y_paradise";
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const CONTENT_DIR = path.join(ROOT, "content");

function collect(): string[] {
  const out: string[] = [];
  for (const kind of ["experience", "article"]) {
    const dir = path.join(CONTENT_DIR, kind);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir).sort()) {
      if (f.endsWith(".md")) out.push(path.join(dir, f));
    }
  }
  return out;
}

/** Fields to clear when the front matter no longer claims them. Returned as a
 * spreadable fragment because Mongo REJECTS an empty `$unset: {}` — which
 * would fire on every file that sets both originUrl and allowMojibake. */
function unsetFragment(cf: ContentFile): Record<string, unknown> {
  const gone: Record<string, string> = {};
  if (!cf.front.originUrl) { gone.originUrl = ""; gone.originLabel = ""; }
  if (!cf.front.allowMojibake) gone.allowMojibake = "";
  return Object.keys(gone).length ? { $unset: gone } : {};
}

async function upsertExperience(db: Db, cf: ContentFile): Promise<string> {
  const now = new Date();
  const res = await db.collection("experiences").updateOne(
    { slug: cf.slug },
    {
      $set: {
        title: cf.front.title,
        status: "published",
        tags: cf.front.tags,
        content: cf.body,
        publishedAt: cf.front.publishedAt,
        updatedAt: now,
        ...(cf.front.originUrl ? { originUrl: cf.front.originUrl } : {}),
        ...(cf.front.originLabel ? { originLabel: cf.front.originLabel } : {}),
        ...(cf.front.allowMojibake ? { allowMojibake: cf.front.allowMojibake } : {}),
      },
      // Anything the front matter drops is removed rather than left lingering:
      // an origin link the file no longer claims, or a mojibake exemption the
      // author has withdrawn. Persisting allowMojibake also keeps export
      // lossless — it is authored metadata, so it has to survive the round trip.
      ...unsetFragment(cf),
      $setOnInsert: { slug: cf.slug, createdAt: now },
    },
    { upsert: true },
  );
  return res.upsertedCount ? "inserted" : "updated";
}

async function upsertArticle(db: Db, cf: ContentFile): Promise<string> {
  const now = new Date();
  const articles = db.collection("articles");
  const versions = db.collection("article_versions");
  const existing = await articles.findOne({ slug: cf.slug });

  if (!existing) {
    const articleId = new ObjectId();
    const versionId = new ObjectId();
    await versions.insertOne({
      _id: versionId, articleId, version: 1,
      title: cf.front.title, content: cf.body,
      sourceFile: path.relative(ROOT, cf.file),
      createdAt: cf.front.publishedAt,
      notes: "Published from the repo content file",
    });
    await articles.insertOne({
      _id: articleId, slug: cf.slug, title: cf.front.title, status: "published",
      tags: cf.front.tags, domains: cf.front.domains ?? [],
      currentVersionId: versionId,
      ...(cf.front.originUrl ? { originUrl: cf.front.originUrl } : {}),
      ...(cf.front.originLabel ? { originLabel: cf.front.originLabel } : {}),
      ...(cf.front.allowMojibake ? { allowMojibake: cf.front.allowMojibake } : {}),
      publishedAt: cf.front.publishedAt, createdAt: now, updatedAt: now,
    });
    return "inserted (version 1)";
  }

  const current = await versions.findOne({ _id: existing.currentVersionId as ObjectId });
  let versionId = existing.currentVersionId as ObjectId;
  let note = "metadata only";

  // Compare TRIMMED to trimmed. render()/parse() trim the body, so a document
  // stored with stray leading or trailing whitespace would differ on every run
  // and mint a new version each time. The first --all across the corpus did
  // exactly that: 18 articles gained a version 2 whose only change was
  // whitespace. Same-content must mean same-version, or --all is not idempotent
  // and the version history fills with noise.
  if (!current || String(current.content ?? "").trim() !== cf.body) {
    // Content genuinely changed: a NEW version, per decision 0003. The old one
    // stays queryable, which is the whole point of the two-collection shape.
    const next = ((current?.version as number) ?? 0) + 1;
    versionId = new ObjectId();
    await versions.insertOne({
      _id: versionId, articleId: existing._id, version: next,
      title: cf.front.title, content: cf.body,
      sourceFile: path.relative(ROOT, cf.file),
      createdAt: now,
      notes: "Published from the repo content file",
    });
    note = `new version ${next}`;
  } else if (String(current.title ?? "") !== cf.front.title) {
    // Title is snapshotted onto the version too (0003) — keep them in step.
    await versions.updateOne({ _id: versionId }, { $set: { title: cf.front.title } });
  }

  await articles.updateOne(
    { _id: existing._id },
    {
      $set: {
        title: cf.front.title, status: "published",
        tags: cf.front.tags, domains: cf.front.domains ?? [],
        currentVersionId: versionId,
        publishedAt: cf.front.publishedAt, updatedAt: now,
        ...(cf.front.originUrl ? { originUrl: cf.front.originUrl } : {}),
        ...(cf.front.originLabel ? { originLabel: cf.front.originLabel } : {}),
        ...(cf.front.allowMojibake ? { allowMojibake: cf.front.allowMojibake } : {}),
      },
      ...unsetFragment(cf),
    },
  );
  return `updated (${note})`;
}

async function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes("--check");
  const all = args.includes("--all");
  const files = all ? collect() : args.filter((a) => !a.startsWith("--"));
  if (files.length === 0) {
    console.error("usage: publish-content.ts <file.md>... | --all   [--check]");
    process.exit(2);
  }

  // ── validate everything first ──
  const parsed: ContentFile[] = [];
  let errors = 0;
  for (const f of files) {
    let cf: ContentFile;
    try {
      cf = parse(f);
    } catch (e) {
      console.error(`ERROR  ${(e as Error).message}`);
      errors++;
      continue;
    }
    const problems = check(cf, PUBLIC_DIR);
    for (const p of problems) {
      console.error(`${p.level === "error" ? "ERROR " : "warn  "} ${cf.file}: ${p.message}`);
      if (p.level === "error") errors++;
    }
    parsed.push(cf);
  }
  if (errors > 0) {
    console.error(`\n${errors} error(s) — nothing was written.`);
    process.exit(1);
  }
  console.log(`${parsed.length} file(s) valid.`);
  if (checkOnly) return;

  // ── write ──
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);
  for (const cf of parsed) {
    const what = cf.kind === "experience" ? await upsertExperience(db, cf) : await upsertArticle(db, cf);
    console.log(`  ${cf.kind.padEnd(10)} ${cf.slug.padEnd(44)} ${what}`);
  }
  await client.close();
  console.log(`\nDone. Reindex with: npm run index`);
}

main().catch((e) => { console.error(e); process.exit(1); });
