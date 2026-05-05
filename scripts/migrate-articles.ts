import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const MONGODB_DB = process.env.MONGODB_DB ?? "a11y_paradise";
const SOURCE_DIR = process.env.ARTICLES_SOURCE_DIR ?? "./articles";

type ArticleImport = {
  slug: string;
  files: string[]; // oldest to newest; last is current
};

// All imports land as `status: 'draft'`. Multi-file entries become multi-version
// drafts. Single-file entries are single-version drafts. Domains are left empty
// — Bob will tag in the CMS.
const imports: ArticleImport[] = [
  { slug: "aac-communication-accessibility", files: ["aac-communication-accessibility-research.md"] },
  { slug: "ai-in-accessibility", files: ["ai-in-accessibility-article.md"] },
  { slug: "ai-safety-accessibility", files: ["ai-safety-accessibility-research.md"] },
  { slug: "autoethnography-accessibility", files: ["autoethnography-accessibility-research.md"] },
  { slug: "data-visualization-accessibility", files: ["data-visualization-accessibility-research.md"] },
  { slug: "deafblind-digital-accessibility", files: ["deafblind-digital-accessibility-research.md"] },
  { slug: "machine-learning-accessibility", files: ["machine-learning-accessibility-research.md"] },
  { slug: "multimedia-accessibility", files: ["multimedia-accessibility-research.md"] },
  { slug: "music-accessibility", files: ["music-accessibility-research.md"] },
  { slug: "navigation-wayfinding-accessibility", files: ["navigation-wayfinding-accessibility-research.md"] },
  { slug: "neurodivergence-accessibility", files: ["neurodivergence-accessibility-research.md"] },
  { slug: "sign-language-accessibility", files: ["sign-language-accessibility-research.md"] },
  { slug: "trends-in-digital-accessibility", files: ["trends-in-digital-accessibility-research.md"] },
  { slug: "xr-accessibility", files: ["xr-accessibility-research.md"] },
  { slug: "wcag-2-to-ai-web-accessibility-evolution", files: ["wcag-2-to-ai-web-accessibility-evolution.md"] },
  {
    slug: "music-and-digital-accessibility",
    files: [
      "music-and-digital-accessibility.md",
      "music-and-digital-accessibility-v2.md",
      "music-and-digital-accessibility-v3.md",
    ],
  },
  {
    slug: "w4a-eras",
    files: ["w4a-22-years.md", "w4a-eras.md"],
  },
];

function extractTitle(md: string): string {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "(untitled)";
}

// First non-heading, non-metadata, non-separator paragraph of >=100 chars.
// Strips boundary markdown emphasis so an italic abstract reads cleanly.
function extractSummary(md: string): string {
  const lines = md.split("\n");
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  if (lines[i]?.match(/^#\s/)) i++;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (
      line === "" ||
      line.startsWith("#") ||
      line.startsWith("---") ||
      /^\*\*[^*]+:\*\*/.test(line) // metadata like **Author:** Bob
    ) {
      i++;
      continue;
    }
    const start = i;
    while (i < lines.length && lines[i].trim() !== "") i++;
    const para = lines
      .slice(start, i)
      .map((l) => l.trim())
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (para.length >= 100) {
      return para.replace(/^\*+|\*+$/g, "").trim();
    }
  }
  return "";
}

async function main() {
  const mongo = new MongoClient(MONGODB_URI);
  await mongo.connect();
  const db = mongo.db(MONGODB_DB);

  const articles = db.collection("articles");
  const versions = db.collection("article_versions");

  console.log(`Mongo:    ${MONGODB_URI} / ${MONGODB_DB}`);
  console.log(`Sources:  ${SOURCE_DIR}`);
  console.log();
  console.log("Wiping articles + article_versions for clean reimport.");

  await articles.deleteMany({});
  await versions.deleteMany({});

  await articles.createIndex({ slug: 1 }, { unique: true });
  await articles.createIndex({ status: 1 });
  await versions.createIndex({ articleId: 1, version: 1 }, { unique: true });

  let articleCount = 0;
  let versionCount = 0;

  for (const imp of imports) {
    const articleId = new ObjectId();
    const versionDocs: Array<{
      _id: ObjectId;
      articleId: ObjectId;
      version: number;
      title: string;
      summary: string;
      content: string;
      sourceFile: string;
      createdAt: Date;
      notes: string;
    }> = [];

    for (let v = 0; v < imp.files.length; v++) {
      const filename = imp.files[v];
      const path = join(SOURCE_DIR, filename);
      const content = await readFile(path, "utf-8");
      const stats = await stat(path);
      const title = extractTitle(content);
      const summary = extractSummary(content);

      versionDocs.push({
        _id: new ObjectId(),
        articleId,
        version: v + 1,
        title,
        summary,
        content,
        sourceFile: filename,
        createdAt: stats.mtime,
        notes:
          imp.files.length > 1
            ? `Imported as v${v + 1} from ${filename}`
            : `Imported from ${filename}`,
      });
    }

    const latest = versionDocs[versionDocs.length - 1];
    const earliest = versionDocs[0];

    await articles.insertOne({
      _id: articleId,
      slug: imp.slug,
      title: latest.title,
      summary: latest.summary,
      status: "draft",
      author: "Bob Dodd",
      tags: [],
      domains: [],
      currentVersionId: latest._id,
      createdAt: earliest.createdAt,
      updatedAt: latest.createdAt,
    });

    await versions.insertMany(versionDocs);

    articleCount++;
    versionCount += versionDocs.length;
    const tag = versionDocs.length === 1 ? "1 version" : `${versionDocs.length} versions`;
    console.log(`  ${imp.slug.padEnd(50)} ${tag}`);
  }

  await mongo.close();
  console.log();
  console.log(`Done. ${articleCount} articles, ${versionCount} versions.`);
  console.log("All status='draft'. Run `npm run index` to refresh OpenSearch (drafts won't be indexed).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
