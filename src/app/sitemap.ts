import type { MetadataRoute } from "next";
import { listPublishedArticles } from "@/lib/articles";
import { listReviewsForSitemap } from "@/lib/reviews";
import { listExperiencesForSitemap } from "@/lib/experiences";
import { listGlossaryForSitemap } from "@/lib/glossary";
import { ANALYSERS } from "@/lib/analysers";
import { WIDGET_PATTERNS } from "@/lib/widget-patterns";

const BASE = "https://a11ybob.com";

/* Static content pages. Keep this list in sync when adding a top-level page.
 * Dynamic content (articles, reviews) is appended below from the data layer. */
const STATIC_PATHS = [
  "", // home
  "about",
  "accessibility",
  "adaptation",
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

/* Generated at request time so new articles/reviews appear without a rebuild,
 * and so the production build never depends on a live database connection.
 * Deliberately NOT `revalidate` / ISR, which would prerender at build time and
 * reintroduce that build-time database dependency. */
export const dynamic = "force-dynamic";

/* Cached in process, because building this is cheap locally and expensive in
 * production. The data layer itself takes ~110 ms and the whole route ~60 ms
 * on a dev machine, but ~21 s on the VPS, where OpenSearch holds a 39 GB index
 * on an 8 GB box and a 9,400-document Mongo scan ends up going to disk. A
 * sitemap that slow risks being deprioritised by crawlers, which matters when
 * thousands of URLs are waiting to be indexed.
 *
 * Stale-while-revalidate rather than a plain TTL: once warm, every request is
 * served instantly from cache and an expired entry is refreshed in the
 * background, so no individual request ever pays the rebuild cost. The trade is
 * that newly published content can take up to REFRESH_MS to appear here, which
 * is well inside how often a crawler refetches a sitemap. */
const REFRESH_MS = 60 * 60 * 1000;
let cache: { at: number; entries: MetadataRoute.Sitemap } | null = null;
let refreshing = false;

function toDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (cache) {
    if (Date.now() - cache.at > REFRESH_MS && !refreshing) {
      refreshing = true;
      /* Refresh behind the response. A failed refresh keeps the previous
       * entries rather than serving an empty sitemap. */
      buildSitemap()
        .then((entries) => {
          cache = { at: Date.now(), entries };
        })
        .catch(() => {})
        .finally(() => {
          refreshing = false;
        });
    }
    return cache.entries;
  }
  const entries = await buildSitemap();
  cache = { at: Date.now(), entries };
  return entries;
}

async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: path === "" ? BASE : `${BASE}/${path}`,
  }));

  /* Paradise analysers and widget patterns are prerendered from these same
   * modules by generateStaticParams. Deriving the sitemap entries from the
   * data, rather than restating the slugs in STATIC_PATHS, means the two can
   * never drift apart. They did: 36 of these pages were absent from the
   * sitemap entirely until 2026-07-26. */
  for (const a of ANALYSERS) {
    entries.push({ url: `${BASE}/paradise/analysers/${a.slug}` });
  }
  for (const p of WIDGET_PATTERNS) {
    entries.push({ url: `${BASE}/paradise/widget-patterns/${p.slug}` });
  }

  // Published long-form articles. Degrade gracefully if the data layer is down
  // rather than failing the whole sitemap.
  try {
    for (const article of await listPublishedArticles()) {
      entries.push({
        url: `${BASE}/writing/research-essays/${article.slug}`,
        lastModified: article.updatedAt,
      });
    }
  } catch {
    /* skip articles on error */
  }

  // Literature reviews — the substantial, indexable corpus.
  try {
    for (const review of await listReviewsForSitemap()) {
      const lastModified = toDate(review.updated);
      entries.push({
        url: `${BASE}/writing/reviews/${review.id}`,
        ...(lastModified ? { lastModified } : {}),
      });
    }
  } catch {
    /* skip reviews on error */
  }

  // Experience pieces.
  try {
    for (const exp of await listExperiencesForSitemap()) {
      entries.push({
        url: `${BASE}/writing/experience/${exp.slug}`,
        ...(exp.updated ? { lastModified: exp.updated } : {}),
      });
    }
  } catch {
    /* skip experiences on error */
  }

  // Glossary terms.
  try {
    for (const g of await listGlossaryForSitemap()) {
      const lastModified = toDate(g.updated);
      entries.push({
        url: `${BASE}/writing/glossary/${g.id}`,
        ...(lastModified ? { lastModified } : {}),
      });
    }
  } catch {
    /* skip glossary on error */
  }

  return entries;
}
