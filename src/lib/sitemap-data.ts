/* Sitemap data, grouped.
 *
 * The site's URL count is dominated by two corpora: roughly 6,700 glossary
 * terms and 2,700 literature reviews, against about 140 pages of everything
 * else. A single flat sitemap therefore spends a crawler's attention almost
 * entirely on definitions and paper summaries, which is the opposite of the
 * priority: at the time of writing Search Console reported 10.3K pages indexed
 * and 6.63K discovered but waiting, and the waiting set is overwhelmingly
 * corpus pages.
 *
 * Splitting into an index plus named child sitemaps lets a crawler fetch the
 * small, high-value `core` and `writing` sets often and cheaply, and treat the
 * two large corpora on their own schedule. Each child also carries its own
 * lastmod in the index, so an unchanged corpus can be skipped outright.
 *
 * Built here rather than in app/sitemap.ts because Next's `generateSitemaps`
 * emits children but no <sitemapindex>, and robots.txt advertises /sitemap.xml
 * as the entry point. */
import { listPublishedArticles } from "@/lib/articles";
import { listReviewsForSitemap } from "@/lib/reviews";
import { listExperiencesForSitemap } from "@/lib/experiences";
import { listGlossaryForSitemap } from "@/lib/glossary";
import { ANALYSERS } from "@/lib/analysers";
import { WIDGET_PATTERNS } from "@/lib/widget-patterns";

export const BASE = "https://a11ybob.com";

export type SitemapEntry = { url: string; lastModified?: Date };
export type SitemapGroup = { name: string; entries: SitemapEntry[] };

/* Static content pages. Keep this list in sync when adding a top-level page.
 * Paradise analyser and widget-pattern pages are NOT listed here: they are
 * derived below from the same modules that prerender them, so the two cannot
 * drift. They did drift once, and 38 pages went missing. */
const STATIC_PATHS = [
  "", // home
  "about",
  "accessibility",
  "adaptation",
  "adaptation/describing-people-to-computers",
  "adaptation/describing-what-people-want",
  "adaptation/personas",
  "adaptation/afds",
  "adaptation/afds/why-a-design-system",
  "adaptation/afds/what-a-component-declares",
  "adaptation/afds/evidence-and-uncertainty",
  "adaptation/afds/apg-support",
  "adaptation/afds/portable-representations",
  "adaptation/afds/the-package-format",
  "adaptation/afds/adapters",
  "adaptation/afds/open-questions",
  "adaptation/afds/user-guide",
  "adaptation/afds/specification",
  "adaptation/accessible-tetris",
  "adaptation/accessible-tetris/the-game",
  "adaptation/accessible-tetris/why-assistive-technology-fails",
  "adaptation/accessible-tetris/the-sonic-design-space",
  "adaptation/accessible-tetris/the-rhetoric-of-sound",
  "adaptation/accessible-tetris/an-architecture-for-adaptation",
  "adaptation/accessible-tetris/what-the-browser-makes-possible",
  "adaptation/accessible-tetris/the-record",
  "adaptation/accessible-tetris/from-case-study-to-demonstrator",
  "automated-testing",
  "carnforth",
  "colophon",
  "contact",
  "lived-user-testing",
  "maps",
  "maps/context-map",
  "maps/conversational-map",
  "maps/knowledge-map",
  "maps/east-toronto-streetmap",
  "maps/east-toronto-streetmap/speaking-and-finding-your-place",
  "maps/how-its-built",
  "maps/search-and-map-pins",
  "maps/terminal-map",
  "maps/terminal-map/switch-and-magnifier-support",
  "maps/tiled-toronto-map",
  "now",
  "paradise",
  "paradise/action-language",
  "paradise/analysers",
  "paradise/architecture",
  "paradise/cite",
  "paradise/evidence",
  "paradise/lineage",
  "paradise/vscode-extension",
  "paradise/widget-patterns",
  "playgrounds",
  "playgrounds/action-language",
  "playgrounds/paradise",
  "privacy",
  "research",
  "research/2029-framework",
  "research/accessibility-of-dialogue",
  "research/cisna-model",
  "research/polymorphic-task-decomposition",
  "research/shlaer-mellor-lens",
  "research/spotlight",
  "research/spotlight/sign16",
  "research/spotlight/tetris-audio",
  "research/spotlight/tup",
  "research/tetris-testbed",
  "research/the-measure-of-accessibility",
  "research/the-measure-of-accessibility/communities-of-practice",
  "research/the-measure-of-accessibility/equivalent-experience",
  "research/the-measure-of-accessibility/functional-accessibility",
  "research/the-measure-of-accessibility/intrinsic-accessibility",
  "research/the-measure-of-accessibility/the-question",
  "research/the-measure-of-accessibility/the-shlaer-mellor-lens",
  "tools",
  "work",
  "writing",
  "writing/research-essays",
  "writing/experience",
  "writing/glossary",
  "writing/reviews",
];

/* Coerce whatever the data layer actually hands back into a Date.
 *
 * The declared types say `Date`, but the Mongo serialisers stringify dates on
 * the way out, so `article.updatedAt` arrives as a string at runtime. The old
 * sitemap never noticed because Next's MetadataRoute accepts `string | Date`;
 * rendering the XML by hand does not. Trust the value, not the type. */
function asDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

async function buildGroups(): Promise<SitemapGroup[]> {
  const core: SitemapEntry[] = STATIC_PATHS.map((p) => ({
    url: p === "" ? BASE : `${BASE}/${p}`,
  }));
  for (const a of ANALYSERS) {
    core.push({ url: `${BASE}/paradise/analysers/${a.slug}` });
  }
  for (const p of WIDGET_PATTERNS) {
    core.push({ url: `${BASE}/paradise/widget-patterns/${p.slug}` });
  }

  /* Each corpus degrades independently: a database problem costs that child
   * sitemap, not the whole document. */
  const writing: SitemapEntry[] = [];
  try {
    for (const article of await listPublishedArticles()) {
      writing.push({
        url: `${BASE}/writing/research-essays/${article.slug}`,
        ...(asDate(article.updatedAt) ? { lastModified: asDate(article.updatedAt) } : {}),
      });
    }
  } catch {
    /* skip research essays on error */
  }
  try {
    for (const exp of await listExperiencesForSitemap()) {
      writing.push({
        url: `${BASE}/writing/experience/${exp.slug}`,
        ...(asDate(exp.updated) ? { lastModified: asDate(exp.updated) } : {}),
      });
    }
  } catch {
    /* skip experience pieces on error */
  }

  const reviews: SitemapEntry[] = [];
  try {
    for (const r of await listReviewsForSitemap()) {
      const lastModified = asDate(r.updated);
      reviews.push({
        url: `${BASE}/writing/reviews/${r.id}`,
        ...(lastModified ? { lastModified } : {}),
      });
    }
  } catch {
    /* skip reviews on error */
  }

  const glossary: SitemapEntry[] = [];
  try {
    for (const g of await listGlossaryForSitemap()) {
      const lastModified = asDate(g.updated);
      glossary.push({
        url: `${BASE}/writing/glossary/${g.id}`,
        ...(lastModified ? { lastModified } : {}),
      });
    }
  } catch {
    /* skip glossary on error */
  }

  return [
    { name: "core", entries: core },
    { name: "writing", entries: writing },
    { name: "reviews", entries: reviews },
    { name: "glossary", entries: glossary },
  ];
}

/* Cached in process, stale-while-revalidate. Once warm, no request pays the
 * rebuild, and an expired entry refreshes behind the response. A failed refresh
 * keeps the previous groups rather than serving an empty sitemap. Deliberately
 * not ISR, which would prerender at build time and make the production build
 * depend on a live database. */
const REFRESH_MS = 60 * 60 * 1000;
let cache: { at: number; groups: SitemapGroup[] } | null = null;
let refreshing = false;

export async function getSitemapGroups(): Promise<SitemapGroup[]> {
  if (cache) {
    if (Date.now() - cache.at > REFRESH_MS && !refreshing) {
      refreshing = true;
      buildGroups()
        .then((groups) => {
          cache = { at: Date.now(), groups };
        })
        .catch(() => {})
        .finally(() => {
          refreshing = false;
        });
    }
    return cache.groups;
  }
  const groups = await buildGroups();
  cache = { at: Date.now(), groups };
  return groups;
}

export async function getSitemapGroup(
  name: string,
): Promise<SitemapGroup | undefined> {
  return (await getSitemapGroups()).find((g) => g.name === name);
}

/* XML text escaping. Ampersands appear in real Mongo ids and slugs, and an
 * unescaped one makes the whole document unparseable rather than merely wrong. */
function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function renderUrlset(entries: SitemapEntry[]): string {
  const body = entries
    .map((e) => {
      const lm = e.lastModified
        ? `\n    <lastmod>${e.lastModified.toISOString()}</lastmod>`
        : "";
      return `  <url>\n    <loc>${xmlEscape(e.url)}</loc>${lm}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function renderIndex(groups: SitemapGroup[]): string {
  const body = groups
    .map((g) => {
      /* The index carries each child's newest lastmod, so a crawler can skip a
       * corpus that has not changed since it last fetched it. */
      const newest = g.entries.reduce<Date | undefined>((acc, e) => {
        if (!e.lastModified) return acc;
        return !acc || e.lastModified > acc ? e.lastModified : acc;
      }, undefined);
      const lm = newest
        ? `\n    <lastmod>${newest.toISOString()}</lastmod>`
        : "";
      return `  <sitemap>\n    <loc>${BASE}/sitemaps/${g.name}.xml</loc>${lm}\n  </sitemap>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}
