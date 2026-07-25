import type { MetadataRoute } from "next";
import { listPublishedArticles } from "@/lib/articles";
import { listReviewsForSitemap } from "@/lib/reviews";
import { listExperiencesForSitemap } from "@/lib/experiences";
import { listGlossaryForSitemap } from "@/lib/glossary";

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
 * and so the production build never depends on a live database connection. */
export const dynamic = "force-dynamic";

function toDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: path === "" ? BASE : `${BASE}/${path}`,
  }));

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
