import { getDb } from "./mongo";

/* Place knowledge — the v2 "map that learns the places you visit".
 *
 * Given a point, return short, CITED blurbs about the place and what's notable around it, from
 * open MediaWiki sources — currently WIKIPEDIA (facts about places, landmarks and features) and
 * WIKIVOYAGE (the travel-guide CHARACTER of a district/area: what it's like, what it's known for).
 * Grounded, attributable knowledge, never the model's own invention: the caller narrates the
 * stored `extract` and always states the source + freshness ("From Wikipedia, cached last week: …").
 *
 * A traffic-warmed, aging cache sits in front of each source (Mongo `knowledge`, keyed by
 * `<source>:<coarse geocell>`): the first visitor — in person OR armchair — warms a cell for
 * everyone after; entries are re-fetched only when someone touches a STALE one (no reaper). Busy
 * places self-warm and stay warm; quiet ones cost nothing until visited. Encyclopedic/travel facts
 * change slowly, so the TTL is long. */

const UA = "a11ybob.com place-knowledge (bob@a11ybob.com)";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days — encyclopedic/travel, slow-changing
const EMPTY_TTL_MS = 24 * 60 * 60 * 1000; // re-check "nothing here yet" cells daily, cheaply
const CELL_DP = 2;   // ~1 km geocells: coarse enough to reuse across nearby visitors
const FETCH_TIMEOUT_MS = 6000;

// Each source is a MediaWiki wiki with GeoData (geosearch) + TextExtracts (intro extracts). radius:
// rural notable features / the nearest travel guide are km out, and geosearch is nearest-first, so
// cities still get their local cluster first. gsradius max is 20 km on these wikis.
const SOURCES = {
  wikipedia: { label: "Wikipedia", api: "https://en.wikipedia.org/w/api.php", host: "en.wikipedia.org", radius: 10000, limit: 8 },
  wikivoyage: { label: "Wikivoyage", api: "https://en.wikivoyage.org/w/api.php", host: "en.wikivoyage.org", radius: 20000, limit: 4 },
} as const;
export type SourceKey = keyof typeof SOURCES;

export type WikidataFacts = {
  type?: string;       // what it is (instance of)
  heritage?: string;   // heritage designation
  built?: string;      // inception year
  opened?: string;     // official opening year
  architect?: string;
  style?: string;      // architectural style
  operator?: string;
  website?: string;
  height?: string;     // e.g. "553 metre"
  population?: string;
};
export type KnowledgeArticle = {
  title: string;
  extract: string;
  url: string;
  distance_m: number;
  wikidata?: string;
  facts?: WikidataFacts;   // curated Wikidata claims — OFFER these, don't auto-recite
};
export type SourceKnowledge = {
  source: SourceKey;
  label: string;
  fetchedAt: string;
  cached: boolean;
  articles: KnowledgeArticle[];
};
export type PlaceKnowledge = {
  cell: { lat: number; lng: number };
  sources: SourceKnowledge[];
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
  if (!res.ok) throw new Error(`mediawiki ${res.status}`);
  return res.json();
}

/* ── Wikidata structured facts ───────────────────────────────────────────────────────────
 * Each MediaWiki article carries a Wikidata id (pageprops wikibase_item). For notable places we
 * pull a CURATED set of claims — what it is, when built/opened, architect, style, heritage status,
 * operator, website, height, population — so the caller can OFFER them ("this is a historic
 * building — want more?") rather than reciting. Two batched calls: claims, then a label pass for
 * entity-valued claims. Cached with the article, so the cost is amortised. */
const WD_API = "https://www.wikidata.org/w/api.php";
const WD_ENTITY_PROPS: Record<string, keyof WikidataFacts> = {
  P31: "type", P1435: "heritage", P84: "architect", P149: "style", P137: "operator",
};
const WD_TIME_PROPS: Record<string, keyof WikidataFacts> = { P571: "built", P1619: "opened" };

type WdSnak = { snaktype?: string; datavalue?: { value?: unknown; type?: string } };
type WdClaim = { mainsnak?: WdSnak; rank?: string };
type WdEntity = { claims?: Record<string, WdClaim[]>; labels?: { en?: { value?: string } } };

function wdFirstSnak(claims?: WdClaim[]): WdSnak | undefined {
  if (!claims?.length) return undefined;
  return (claims.find((c) => c.rank === "preferred") ?? claims[0]).mainsnak;
}
function wdEntityValue(claims?: WdClaim[]): string | undefined {
  const s = wdFirstSnak(claims);
  if (s?.snaktype === "value" && s.datavalue?.type === "wikibase-entityid") return (s.datavalue.value as { id?: string }).id;
  return undefined;
}
function wdYear(claims?: WdClaim[]): string | undefined {
  const s = wdFirstSnak(claims);
  if (s?.snaktype !== "value" || s.datavalue?.type !== "time") return undefined;
  const m = /^([+-])(\d+)-/.exec((s.datavalue.value as { time?: string }).time ?? "");
  if (!m) return undefined;
  const y = parseInt(m[2], 10);
  return m[1] === "-" ? `${y} BCE` : String(y);
}
function wdString(claims?: WdClaim[]): string | undefined {
  const s = wdFirstSnak(claims);
  return s?.snaktype === "value" && typeof s.datavalue?.value === "string" ? (s.datavalue.value as string) : undefined;
}
function wdQuantity(claims?: WdClaim[]): { amount: string; unit?: string } | undefined {
  const s = wdFirstSnak(claims);
  if (s?.snaktype !== "value" || s.datavalue?.type !== "quantity") return undefined;
  const q = s.datavalue.value as { amount?: string; unit?: string };
  const amount = (q.amount ?? "").replace(/^\+/, "");
  if (!amount) return undefined;
  return { amount, unit: /Q\d+$/.exec(q.unit ?? "")?.[0] };
}
async function wbEntities(ids: string[], props: string): Promise<Record<string, WdEntity>> {
  const r = (await getJson(
    `${WD_API}?action=wbgetentities&format=json&ids=${ids.join("%7C")}&props=${props}&languages=en`,
  )) as { entities?: Record<string, WdEntity> };
  return r.entities ?? {};
}

export async function fetchWikidataFacts(qids: string[]): Promise<Record<string, WikidataFacts>> {
  const ids = [...new Set(qids)].slice(0, 50);
  if (!ids.length) return {};
  const ents = await wbEntities(ids, "claims");

  const facts: Record<string, WikidataFacts> = {};
  const need = new Set<string>();
  const entityFields: Array<[string, keyof WikidataFacts, string]> = [];
  const heightUnits: Array<[string, string]> = [];

  for (const [qid, ent] of Object.entries(ents)) {
    const c = ent.claims ?? {};
    const f: WikidataFacts = {};
    for (const [prop, field] of Object.entries(WD_ENTITY_PROPS)) {
      const v = wdEntityValue(c[prop]);
      if (v) { need.add(v); entityFields.push([qid, field, v]); }
    }
    for (const [prop, field] of Object.entries(WD_TIME_PROPS)) {
      const y = wdYear(c[prop]);
      if (y) f[field] = y;
    }
    const web = wdString(c.P856);
    if (web) f.website = web;
    const h = wdQuantity(c.P2048);
    if (h) { f.height = h.amount; if (h.unit) { need.add(h.unit); heightUnits.push([qid, h.unit]); } }
    const pop = wdQuantity(c.P1082);
    if (pop) f.population = Number(pop.amount).toLocaleString("en");
    facts[qid] = f;
  }

  if (need.size) {
    const lents = await wbEntities([...need].slice(0, 50), "labels");
    const label = (vid: string) => lents[vid]?.labels?.en?.value || "";
    for (const [qid, field, vid] of entityFields) {
      const l = label(vid);
      if (l) (facts[qid] as Record<string, string>)[field] = l;
    }
    for (const [qid, unit] of heightUnits) {
      const l = label(unit);
      if (l && facts[qid].height) facts[qid].height = `${facts[qid].height} ${l}`;
    }
  }
  return facts;
}

/* Pure connector: nearby articles with short intro extracts + Wikidata id, from any MediaWiki wiki
 * (Wikipedia, Wikivoyage). No cache — the read-through wrapper below owns the caching. */
export async function fetchMediaWikiNear(
  api: string, host: string, lat: number, lng: number, radius: number, limit: number,
): Promise<KnowledgeArticle[]> {
  // 1) pages near the point
  const geo = (await getJson(
    `${api}?action=query&format=json&list=geosearch&gscoord=${lat}%7C${lng}&gsradius=${radius}&gslimit=${limit}`,
  )) as { query?: { geosearch?: Array<{ pageid: number; title: string; dist: number }> } };
  const pages = geo.query?.geosearch ?? [];
  if (!pages.length) return [];
  // 2) short intro extract + Wikidata id for all of them, in one batched call
  const ids = pages.map((p) => p.pageid).join("|");
  const ex = (await getJson(
    `${api}?action=query&format=json&prop=extracts%7Cpageprops&exintro=1&explaintext=1&exsentences=3&ppprop=wikibase_item&pageids=${encodeURIComponent(ids)}`,
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
      url: `https://${host}/wiki/${encodeURIComponent(p.title.replace(/ /g, "_"))}`,
      distance_m: Math.round(p.dist),
      wikidata: d?.pageprops?.wikibase_item,
    });
  }
  // Enrich with curated Wikidata facts (offered, not auto-recited). A Wikidata hiccup must never
  // sink the whole knowledge fetch, so failures are swallowed.
  try {
    const qids = out.map((a) => a.wikidata).filter((q): q is string => !!q);
    if (qids.length) {
      const facts = await fetchWikidataFacts(qids);
      for (const a of out) if (a.wikidata && facts[a.wikidata]) a.facts = facts[a.wikidata];
    }
  } catch { /* facts are a bonus; never fail the fetch over them */ }
  return out.sort((a, b) => a.distance_m - b.distance_m);
}

/* Read-through cache for ONE source. Fresh hit → serve; miss/stale → fetch, store, serve; on a
 * fetch failure, serve stale (better than silence) if we have it. */
async function sourceKnowledge(source: SourceKey, lat: number, lng: number): Promise<SourceKnowledge> {
  const cfg = SOURCES[source];
  const key = `${source}:${cellKey(lat, lng)}`;
  const db = await getDb();
  const col = db.collection("knowledge");
  const now = Date.now();

  const doc = await col.findOne({ _id: key } as Record<string, unknown>);
  const age = doc?.fetchedAt ? now - new Date(doc.fetchedAt as string).getTime() : Infinity;
  // Populated cells keep for TTL_MS; empty ones ("nothing mapped here") re-check daily.
  const ttl = ((doc?.articles as unknown[])?.length ?? 0) > 0 ? TTL_MS : EMPTY_TTL_MS;
  if (doc && age < ttl) {
    return { source, label: cfg.label, fetchedAt: doc.fetchedAt as string, cached: true, articles: (doc.articles ?? []) as KnowledgeArticle[] };
  }

  const c = cellCenter(lat, lng);
  let articles: KnowledgeArticle[];
  try {
    articles = await fetchMediaWikiNear(cfg.api, cfg.host, c.lat, c.lng, cfg.radius, cfg.limit);
  } catch (err) {
    if (doc?.articles) {
      // Source unreachable — serve what we last knew rather than nothing.
      return { source, label: cfg.label, fetchedAt: doc.fetchedAt as string, cached: true, articles: doc.articles as KnowledgeArticle[] };
    }
    throw err;
  }

  const fetchedAt = new Date(now).toISOString();
  await col.updateOne(
    { _id: key } as Record<string, unknown>,
    { $set: { source, fetchedAt, cell: c, articles }, $setOnInsert: { createdAt: fetchedAt } },
    { upsert: true },
  );
  return { source, label: cfg.label, fetchedAt, cached: false, articles };
}

/* All sources for a point, fetched/served in parallel. A source that hard-fails with no cache to
 * fall back on is simply omitted rather than failing the whole lookup. */
export async function placeKnowledge(lat: number, lng: number): Promise<PlaceKnowledge> {
  const keys = Object.keys(SOURCES) as SourceKey[];
  const settled = await Promise.allSettled(keys.map((k) => sourceKnowledge(k, lat, lng)));
  const sources = settled
    .filter((s): s is PromiseFulfilledResult<SourceKnowledge> => s.status === "fulfilled")
    .map((s) => s.value);
  return { cell: cellCenter(lat, lng), sources };
}
