/*
 * Generate the "page visits" spreadsheet for the private stats dashboard.
 *
 * Source: a GoAccess JSON export (the `requests` panel — non-static, so page
 * requests not assets), which holds cumulative per-URL hit counts from the
 * persisted GoAccess DB (since the 2026-06-08 analytics baseline, surviving
 * Caddy log rotation). Bots are already excluded at log time + by GoAccess.
 *
 * This script aggregates by path (stripping query strings, incl. Next's
 * ?_rsc= in-app navigation fetches), resolves CMS URLs to their titles from
 * Mongo, and writes an XLSX workbook with a tab per content type.
 *
 * Usage:  node scripts/gen-page-visits.mjs <goaccess.json> <out.xlsx>
 * Aggregate counts only — no IPs, no individuals.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import ExcelJS from "exceljs";

const REPORT = process.argv[2] || "/tmp/a11y-page-report.json";
const OUT = process.argv[3] || "/srv/stats/page-visits.xlsx";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// tsx/node don't auto-load .env.local — read the cred'd MONGODB_URI from it.
function envLocal(key) {
  try {
    const txt = fs.readFileSync(path.join(PROJECT_ROOT, ".env.local"), "utf8");
    const m = txt.match(new RegExp("^" + key + "=(.*)$", "m"));
    return m ? m[1].trim() : undefined;
  } catch {
    return undefined;
  }
}
const MONGODB_URI =
  process.env.MONGODB_URI || envLocal("MONGODB_URI") || "mongodb://localhost:27017";
const MONGODB_DB = process.env.MONGODB_DB || envLocal("MONGODB_DB") || "a11y_paradise";

// --- aggregate per-path visit counts from the GoAccess requests panel ---
const ga = JSON.parse(fs.readFileSync(REPORT, "utf8"));
const reqPanel = Array.isArray(ga.requests) ? ga.requests : (ga.requests?.data ?? []);

const counts = new Map(); // path -> { visits, uniq }
for (const row of reqPanel) {
  const raw = typeof row?.data === "string" ? row.data : null;
  if (!raw) continue;
  const p = raw.split("?")[0].split("#")[0];
  const hits = typeof row.hits === "object" ? row.hits?.count : row.hits;
  const vis = typeof row.visitors === "object" ? row.visitors?.count : row.visitors;
  const cur = counts.get(p) || { visits: 0, uniq: 0 };
  cur.visits += Number(hits || 0);
  cur.uniq += Number(vis || 0);
  counts.set(p, cur);
}

// --- load CMS title maps from Mongo ---
const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db(MONGODB_DB);
const reviewTitle = new Map(); // _id string -> title
const essayTitle = new Map(); // slug -> title
const glossaryTitle = new Map(); // _id string -> term
const expTitle = new Map(); // slug -> title
for (const r of await db.collection("reviews").find({}, { projection: { title: 1 } }).toArray())
  reviewTitle.set(String(r._id), r.title || "");
for (const a of await db.collection("articles").find({}, { projection: { slug: 1, title: 1 } }).toArray())
  essayTitle.set(a.slug, a.title || "");
for (const g of await db.collection("glossary").find({}, { projection: { term: 1 } }).toArray())
  glossaryTitle.set(String(g._id), g.term || "");
for (const e of await db.collection("experiences").find({}, { projection: { slug: 1, title: 1 } }).toArray())
  expTitle.set(e.slug, e.title || "");
await client.close();

// --- classify each path + resolve its title ---
function classify(p) {
  let m;
  if ((m = p.match(/^\/writing\/reviews\/(.+)$/)))
    return { type: "Review", title: reviewTitle.get(m[1]) ?? "(unknown / removed)" };
  if ((m = p.match(/^\/writing\/research-essays\/(.+)$/)))
    return { type: "Research essay", title: essayTitle.get(m[1]) ?? "(unknown / removed)" };
  if ((m = p.match(/^\/writing\/glossary\/(.+)$/)))
    return { type: "Glossary", title: glossaryTitle.get(m[1]) ?? "(unknown / removed)" };
  if ((m = p.match(/^\/writing\/experience\/(.+)$/)))
    return { type: "Experience", title: expTitle.get(m[1]) ?? "(unknown / removed)" };
  if (p === "/") return { type: "Page", title: "Home" };
  return { type: "Page", title: "" };
}

const rows = [...counts.entries()]
  .map(([p, c0]) => {
    const c = classify(p);
    return { path: p, type: c.type, title: c.title, visits: c0.visits, uniq: c0.uniq };
  })
  .sort((a, b) => b.visits - a.visits);

// --- build the workbook ---
const wb = new ExcelJS.Workbook();
wb.creator = "a11ybob.com analytics";
const stamp = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";

const about = wb.addWorksheet("About");
about.columns = [{ width: 104 }];
about.addRows([
  ["a11ybob.com — page visits"],
  [`Generated ${stamp}`],
  ["Engaged human visitors only: counts visitors who loaded page assets (CSS/JS/images). HTML-only traffic — bots with browser-like user-agents — is excluded."],
  ["Rolling window of the retained access logs (about 7 days)."],
  ["Aggregate page counts only — no IP addresses, no individuals."],
  ["Counts include full page loads and in-app navigations; query strings are merged into the page path."],
  ["CMS pages (reviews, research essays, glossary, experience) are resolved to their titles."],
  ['"Visits" = total requests to the page. "Unique visitors" = distinct visitors for that page (summed across URL variants, so a slight over-count where a page has query-string variants).'],
  ["Site-wide unique visitors are fewer than the sum of the per-page column, since one visitor counts toward every page they view."],
]);
about.getRow(1).font = { bold: true, size: 14 };

function sheet(name, items, withType) {
  const ws = wb.addWorksheet(name);
  ws.columns = withType
    ? [
        { header: "Path", key: "path", width: 50 },
        { header: "Type", key: "type", width: 15 },
        { header: "Title", key: "title", width: 58 },
        { header: "Visits", key: "visits", width: 9 },
        { header: "Unique visitors", key: "uniq", width: 16 },
      ]
    : [
        { header: "Title", key: "title", width: 58 },
        { header: "Path", key: "path", width: 50 },
        { header: "Visits", key: "visits", width: 9 },
        { header: "Unique visitors", key: "uniq", width: 16 },
      ];
  ws.getRow(1).font = { bold: true };
  ws.views = [{ state: "frozen", ySplit: 1 }];
  for (const r of items) ws.addRow(r);
}

sheet("All pages", rows, true);
sheet("Reviews", rows.filter((r) => r.type === "Review"), false);
sheet("Research essays", rows.filter((r) => r.type === "Research essay"), false);
sheet("Glossary", rows.filter((r) => r.type === "Glossary"), false);
sheet("Experience", rows.filter((r) => r.type === "Experience"), false);

await wb.xlsx.writeFile(OUT);
console.log(
  `wrote ${OUT}: ${rows.length} paths | maps: reviews=${reviewTitle.size} essays=${essayTitle.size} glossary=${glossaryTitle.size} experiences=${expTitle.size}`,
);
