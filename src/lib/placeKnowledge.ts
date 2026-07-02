import { getDb } from "./mongo";

/* Place knowledge — the v2 "map that learns the places you visit".
 *
 * Given a point, return short, CITED encyclopedic blurbs about the place and what's
 * notable around it, from Wikipedia (via geosearch) — grounded, attributable knowledge,
 * never the model's own invention. The caller narrates the stored `extract` verbatim-ish
 * and always states the source + freshness ("From Wikipedia, cached last week: …").
 *
 * A traffic-warmed, aging cache sits in front of Wikipedia (Mongo `knowledge`, keyed by a
 * coarse geocell): the first visitor — in person OR armchair — warms a cell for everyone
 * after; entries are re-fetched only when someone touches a STALE one (no reaper). Busy
 * places (Church St during Pride) self-warm and stay warm; quiet ones cost nothing until
 * visited. Encyclopedic facts change slowly, so the TTL is long. */

const UA = "a11ybob.com place-knowledge (bob@a11ybob.com)";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days — encyclopedic, slow-changing
const EMPTY_TTL_MS = 24 * 60 * 60 * 1000; // re-check "nothing here yet" cells daily, cheaply
const CELL_DP = 2;   // ~1 km geocells: coarse enough to reuse across nearby visitors
const RADIUS_M = 10000; // 10 km — rural notable features are km out; geosearch is nearest-first, so cities still get their local cluster first
const LIMIT = 8;
const FETCH_TIMEOUT_MS = 6000;

export type KnowledgeArticle = {
  title: string;
  extract: string;
  url: string;
  distance_m: number;
  wikidata?: string;
};
export type PlaceKnowledge = {
  source: "wikipedia";
  fetchedAt: string;
  cached: boolean;
  articles: KnowledgeArticle[];
};

const cellKey = (lat: number, lng: number) => `${lat.toFixed(CELL_DP)},${lng.toFixed(CELL_DP)}`;
const cellCenter = (lat: number, lng: number) => ({
  lat: Number(lat.toFixed(CELL_DP)),
  lng: Number(lng.toFixed(CELL_DP)),
});

async function getJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`wikipedia ${res.status}`);
  return res.json();
}

/* Pure connector: nearby Wikipedia articles with short intro extracts + Wikidata id.
 * No cache — the read-through wrapper below owns the caching. */
export async function fetchWikipediaNear(lat: number, lng: number): Promise<KnowledgeArticle[]> {
  const base = "https://en.wikipedia.org/w/api.php";
  // 1) pages near the point
  const geo = (await getJson(
    `${base}?action=query&format=json&list=geosearch&gscoord=${lat}%7C${lng}&gsradius=${RADIUS_M}&gslimit=${LIMIT}`,
  )) as { query?: { geosearch?: Array<{ pageid: number; title: string; dist: number }> } };
  const pages = geo.query?.geosearch ?? [];
  if (!pages.length) return [];
  // 2) short intro extract + Wikidata id for all of them, in one batched call
  const ids = pages.map((p) => p.pageid).join("|");
  const ex = (await getJson(
    `${base}?action=query&format=json&prop=extracts%7Cpageprops&exintro=1&explaintext=1&exsentences=3&ppprop=wikibase_item&pageids=${encodeURIComponent(ids)}`,
  )) as { query?: { pages?: Record<string, { extract?: string; pageprops?: { wikibase_item?: string } }> } };
  const detail = ex.query?.pages ?? {};
  const out: KnowledgeArticle[] = [];
  for (const p of pages) {
    const d = detail[String(p.pageid)];
    const extract = (d?.extract ?? "").trim();
    if (!extract) continue;
    out.push({
      title: p.title,
      extract,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(p.title.replace(/ /g, "_"))}`,
      distance_m: Math.round(p.dist),
      wikidata: d?.pageprops?.wikibase_item,
    });
  }
  return out.sort((a, b) => a.distance_m - b.distance_m);
}

/* Read-through cache wrapper. Fresh hit → serve; miss/stale → fetch, store, serve; on a
 * fetch failure, serve stale (better than silence) if we have it. */
export async function placeKnowledge(lat: number, lng: number): Promise<PlaceKnowledge> {
  const key = cellKey(lat, lng);
  const db = await getDb();
  const col = db.collection("knowledge");
  const now = Date.now();

  const doc = await col.findOne({ _id: key } as Record<string, unknown>);
  const age = doc?.fetchedAt ? now - new Date(doc.fetchedAt as string).getTime() : Infinity;
  // Populated cells keep for TTL_MS; empty ones ("nothing mapped here") re-check daily.
  const ttl = ((doc?.articles as unknown[])?.length ?? 0) > 0 ? TTL_MS : EMPTY_TTL_MS;
  if (doc && age < ttl) {
    return { source: "wikipedia", fetchedAt: doc.fetchedAt as string, cached: true, articles: (doc.articles ?? []) as KnowledgeArticle[] };
  }

  const c = cellCenter(lat, lng);
  let articles: KnowledgeArticle[];
  try {
    articles = await fetchWikipediaNear(c.lat, c.lng);
  } catch (err) {
    if (doc?.articles) {
      // Wikipedia unreachable — serve what we last knew rather than nothing.
      return { source: "wikipedia", fetchedAt: doc.fetchedAt as string, cached: true, articles: doc.articles as KnowledgeArticle[] };
    }
    throw err;
  }

  const fetchedAt = new Date(now).toISOString();
  await col.updateOne(
    { _id: key } as Record<string, unknown>,
    { $set: { source: "wikipedia", fetchedAt, cell: c, articles }, $setOnInsert: { createdAt: fetchedAt } },
    { upsert: true },
  );
  return { source: "wikipedia", fetchedAt, cached: false, articles };
}
