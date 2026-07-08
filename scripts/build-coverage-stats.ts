/* Render the aggregate map-coverage stats to a small static page on the stats site.
 *
 * Reads the `query_geostats` collection (see src/lib/geostats.ts) — per ~5 km cell, recorded
 * ONLY during Follow Me, no identity — and writes a plain page:
 *   • OUT-OF-REGION DEMAND — cells whose location has no map coverage, reverse-geocoded to a
 *     rough place name. This is the "which places to map next" signal, ranked by active days.
 *   • IN-REGION ACTIVITY — how much each covered region is used.
 *
 * Reverse geocoding uses Nominatim, rate-limited to 1 request/sec, and the resolved name is
 * cached back onto the cell so each is looked up once. Aggregate-only; nothing here identifies
 * anyone.
 *
 * Run on the VPS (needs the app's MONGODB_URI in the environment):
 *   cd ~/a11ybob-website && set -a && . ./.env.local && set +a \
 *     && node_modules/.bin/tsx scripts/build-coverage-stats.ts
 */

import fs from "node:fs";
import { getDb } from "../src/lib/mongo";

const OUT_PATH = process.env.COVERAGE_OUT ?? "/srv/stats/coverage.html";
const UA = "a11ybob.com coverage-stats (bob@a11ybob.com)";

type Cell = {
  _id: string;
  region: string | null;
  out: boolean;
  clat: number;
  clon: number;
  count: number;
  activeDays: number;
  firstDay?: string;
  lastDay?: string;
  place?: string;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10&accept-language=en`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return "";
    const j = (await res.json()) as { display_name?: string; address?: Record<string, string> };
    const a = j.address ?? {};
    // Prefer a town/city + region + country; fall back to the full display name.
    const place = a.city || a.town || a.village || a.municipality || a.county || a.state || "";
    const region = a.state || a.province || "";
    const country = a.country || "";
    const parts = [place, region && region !== place ? region : "", country].filter(Boolean);
    return parts.length ? parts.join(", ") : (j.display_name ?? "");
  } catch {
    return "";
  }
}

function esc(s: string): string {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

function page(outCells: Cell[], inByRegion: Array<{ region: string; cells: number; activeDays: number; count: number }>, generated: string): string {
  const outRows = outCells.length
    ? outCells.map((c) => `<tr><td>${esc(c.place || `${c.clat}, ${c.clon}`)}</td><td class="n">${c.activeDays}</td><td class="n">${c.count}</td><td>${esc(c.firstDay ?? "")}</td><td>${esc(c.lastDay ?? "")}</td><td class="c">${c.clat}, ${c.clon}</td></tr>`).join("\n")
    : `<tr><td colspan="6" class="empty">No out-of-region activity recorded yet.</td></tr>`;
  const inRows = inByRegion.length
    ? inByRegion.map((r) => `<tr><td>${esc(r.region)}</td><td class="n">${r.cells}</td><td class="n">${r.activeDays}</td><td class="n">${r.count}</td></tr>`).join("\n")
    : `<tr><td colspan="4" class="empty">No in-region activity recorded yet.</td></tr>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Map coverage — a11ybob stats</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 16px/1.5 system-ui, sans-serif; max-width: 60rem; margin: 2rem auto; padding: 0 1rem; }
  h1 { font-size: 1.5rem; } h2 { font-size: 1.2rem; margin-top: 2rem; }
  p.note { color: GrayText; }
  table { border-collapse: collapse; width: 100%; margin-top: .5rem; }
  th, td { text-align: left; padding: .4rem .6rem; border-bottom: 1px solid; }
  td.n, th.n { text-align: right; font-variant-numeric: tabular-nums; }
  td.c { color: GrayText; font-size: .85em; font-variant-numeric: tabular-nums; }
  td.empty { color: GrayText; font-style: italic; }
  a { color: LinkText; }
</style>
</head>
<body>
<h1>Map coverage</h1>
<p class="note">Aggregate only — where the accessible maps get queried, recorded solely while Follow&nbsp;Me is active, rounded to ~5&nbsp;km cells. No identity, no individual records. <a href="/">Back to the site stats</a>. Generated ${esc(generated)}.</p>

<h2>Out-of-region demand — where to map next</h2>
<p class="note">Follow&nbsp;Me was used at these locations, which have no map coverage. Ranked by the number of distinct days with activity (sustained interest), then total requests.</p>
<table>
<thead><tr><th>Place (approx.)</th><th class="n">Active days</th><th class="n">Requests</th><th>First</th><th>Last</th><th>Cell centre</th></tr></thead>
<tbody>
${outRows}
</tbody>
</table>

<h2>In-region activity — which regions get used</h2>
<table>
<thead><tr><th>Region</th><th class="n">Areas (cells)</th><th class="n">Active days</th><th class="n">Requests</th></tr></thead>
<tbody>
${inRows}
</tbody>
</table>
</body>
</html>`;
}

async function main() {
  const db = await getDb();
  const col = db.collection<Cell>("query_geostats");
  const cells = await col.find({}).toArray();

  // Reverse-geocode any OUT cell that hasn't been named yet (1/sec, cached back onto the doc).
  let geocoded = 0;
  for (const c of cells) {
    if (c.out && !c.place) {
      const name = await reverseGeocode(c.clat, c.clon);
      if (name) {
        c.place = name;
        await col.updateOne({ _id: c._id }, { $set: { place: name } });
        geocoded++;
      }
      await sleep(1100);
    }
  }

  const out = cells.filter((c) => c.out).sort((a, b) => b.activeDays - a.activeDays || b.count - a.count);
  const byRegion = new Map<string, { region: string; cells: number; activeDays: number; count: number }>();
  for (const c of cells) {
    if (c.out || !c.region) continue;
    const r = byRegion.get(c.region) ?? { region: c.region, cells: 0, activeDays: 0, count: 0 };
    r.cells += 1; r.activeDays += c.activeDays; r.count += c.count;
    byRegion.set(c.region, r);
  }
  const inRows = [...byRegion.values()].sort((a, b) => b.count - a.count);

  const generated = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
  fs.writeFileSync(OUT_PATH, page(out, inRows, generated));
  console.log(`coverage: ${cells.length} cells (${out.length} out-of-region, ${inRows.length} regions), geocoded ${geocoded} new → ${OUT_PATH}`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
