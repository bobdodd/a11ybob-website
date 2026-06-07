import { getDb } from "./mongo";
import { opensearch } from "./opensearch";
import { HL_CLOSE, HL_OPEN, renderSnippet } from "./searchHighlight";
import {
  pickTier,
  tieredShould,
  tierMeaningful,
  type SearchTier,
} from "./searchTier";

// Re-exported for existing imports from this module.
export { HL_OPEN, HL_CLOSE, renderSnippet };

export type Article = {
  _id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  tags: string[];
  domains: string[];
  currentVersionId?: string;
  createdAt: Date;
  updatedAt: Date;
  /** If the piece was first published elsewhere (e.g. LinkedIn). a11ybob.com
   *  stays the canonical home; the reader shows a visible origin credit. */
  originUrl?: string;
  originLabel?: string;
};

export type ArticleVersion = {
  _id: string;
  articleId: string;
  version: number;
  title: string;
  content: string;
  sourceFile?: string;
  createdAt: Date;
  notes?: string;
};

export type PublishedArticle = Article & {
  publishedAt: Date;
  content: string; // joined from current version
};

export async function listPublishedArticles(): Promise<Article[]> {
  const db = await getDb();
  const docs = await db
    .collection("articles")
    .find({ status: "published" })
    .sort({ updatedAt: -1 })
    .toArray();
  return docs.map(serialiseArticle);
}

export async function getArticleBySlug(
  slug: string,
): Promise<PublishedArticle | null> {
  const db = await getDb();
  const article = await db.collection("articles").findOne({
    slug,
    status: "published",
  });
  if (!article || !article.currentVersionId) return null;

  const version = await db.collection("article_versions").findOne({
    _id: article.currentVersionId,
  });
  if (!version) return null;

  return {
    ...serialiseArticle(article),
    publishedAt: article.publishedAt ?? article.createdAt,
    content: version.content,
  };
}

/* ===== Full-text search via OpenSearch ===== */

export type ArticleHit = {
  _id: string;
  slug: string;
  title: string;
  domains: string[];
  tags: string[];
  publishedAt?: string;
  /** Which scoring tier matched this hit. Undefined for single-term
   *  queries (where all three tiers are equivalent) and for browse
   *  mode (no query). See docs/decisions/0007-tiered-article-search.md */
  tier?: SearchTier;
  /** Highlight fragments returned by OpenSearch. Strings contain
   *  the raw source text with <HL>...</HL> placeholder markers around
   *  matched terms (we use placeholders instead of <mark> so the
   *  rendering layer can HTML-escape the rest of the snippet
   *  safely). Use renderSnippet() in this file to convert. */
  highlights: {
    title?: string[];
    content?: string[];
  };
};

export type ArticleSearchParams = {
  q?: string;
  domain?: string;
  tag?: string;
  page?: number;
  perPage?: number;
};

export type ArticleSearchResult = {
  hits: ArticleHit[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  facets: {
    domains: { value: string; count: number }[];
    tags: { value: string; count: number }[];
  };
};

const DEFAULT_PER_PAGE = 10;

export async function searchArticles(
  params: ArticleSearchParams,
): Promise<ArticleSearchResult> {
  const page = Math.max(1, params.page ?? 1);
  const perPage = params.perPage ?? DEFAULT_PER_PAGE;
  const from = (page - 1) * perPage;

  // tags and domains are lowercase-normalised keywords in the index;
  // lowercasing the URL parameters here keeps old/mixed-case links
  // working.
  const filter = [
    ...(params.domain ? [{ term: { domains: params.domain.toLowerCase() } }] : []),
    ...(params.tag ? [{ term: { tags: params.tag.toLowerCase() } }] : []),
  ];

  /* Three-tier relevance scoring (Solr/Lucene pattern). For a query
     "braille music", an article scores highest when the exact phrase
     appears, next-highest when both words appear non-adjacently, and
     lowest when only one word appears. A document matching multiple
     tiers compounds — phrase matches contribute to all three clauses.
     See docs/decisions/0007-tiered-article-search.md for rationale. */
  const queryClause = params.q
    ? {
        bool: {
          should: tieredShould(params.q, ["title^3", "content"]),
          filter,
          minimum_should_match: 1,
        },
      }
    : { bool: { must: [{ match_all: {} }], filter } };

  const body = {
    from,
    size: perPage,
    query: queryClause,
    sort: params.q
      ? ["_score"]
      : [{ publishedAt: "desc" as const }, "_score"],
    highlight: {
      pre_tags: [HL_OPEN],
      post_tags: [HL_CLOSE],
      fields: {
        title: { number_of_fragments: 0 },
        content: {
          fragment_size: 220,
          number_of_fragments: 3,
          no_match_size: 0,
        },
      },
      // Without this, highlighter only fires on multi_match's first field
      require_field_match: false,
    },
    aggs: {
      domains: { terms: { field: "domains", size: 30 } },
      tags: { terms: { field: "tags", size: 30 } },
    },
  };

  const res = await opensearch.search({ index: "articles", body });
  const total =
    typeof res.body.hits.total === "number"
      ? res.body.hits.total
      : (res.body.hits.total?.value ?? 0);

  const showTier = tierMeaningful(params.q);

  const rawHits = res.body.hits.hits as unknown as Array<{
    _id: string;
    _source: Record<string, unknown>;
    highlight?: Record<string, string[]>;
    matched_queries?: string[];
  }>;
  const hits = rawHits.map((h) => ({
    _id: h._id,
    slug: h._source.slug as string,
    title: (h._source.title as string) ?? "(untitled)",
    domains: (h._source.domains as string[]) ?? [],
    tags: (h._source.tags as string[]) ?? [],
    publishedAt: h._source.publishedAt as string | undefined,
    tier: showTier ? pickTier(h.matched_queries) : undefined,
    highlights: h.highlight ?? {},
  }));

  const aggs = res.body.aggregations as Record<
    string,
    { buckets: Array<{ key: string; doc_count: number }> } | undefined
  > | undefined;

  return {
    hits,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
    facets: {
      domains: (aggs?.domains?.buckets ?? []).map((b) => ({
        value: b.key,
        count: b.doc_count,
      })),
      tags: (aggs?.tags?.buckets ?? []).map((b) => ({
        value: b.key,
        count: b.doc_count,
      })),
    },
  };
}

/* ===== Per-article re-query for full-document highlighting ===== */

export type ArticleHighlights = {
  /** Title with HL_OPEN/HL_CLOSE markers around matched terms.
   *  Undefined if no match in the title field. */
  title?: string;
  /** Full content with HL_OPEN/HL_CLOSE markers around matched terms.
   *  Undefined if no match in the content field. */
  content?: string;
  /** Number of matched-term occurrences across both fields. */
  matchCount: number;
};

/* Re-query OpenSearch for a specific article with highlight enabled
 * over the entire field (number_of_fragments: 0). Returns the title
 * and content with marker placeholders inserted around matched terms,
 * preserving OpenSearch's analyzer-faithful matching (stems and all).
 *
 * This exists so that the highlights a reader sees in the article
 * match exactly what was highlighted in the search result snippet —
 * removing ambiguity between "what I searched for" and "what's in
 * this article". */
export async function getArticleHighlights(
  articleId: string,
  q: string,
): Promise<ArticleHighlights | null> {
  if (!q.trim()) return null;

  const body = {
    size: 1,
    query: {
      bool: {
        must: [
          {
            multi_match: {
              query: q,
              fields: ["title", "content"],
            },
          },
        ],
        filter: [{ ids: { values: [articleId] } }],
      },
    },
    _source: false, // we don't need the source — only the highlights
    highlight: {
      pre_tags: [HL_OPEN],
      post_tags: [HL_CLOSE],
      fields: {
        title: { number_of_fragments: 0 },
        content: { number_of_fragments: 0 },
      },
      require_field_match: false,
    },
  };

  const res = await opensearch.search({ index: "articles", body });
  const hits = res.body.hits.hits as unknown as Array<{
    _id: string;
    highlight?: { title?: string[]; content?: string[] };
  }>;
  if (hits.length === 0) return null;

  const hl = hits[0].highlight ?? {};
  const title = hl.title?.[0];
  const content = hl.content?.[0];

  const countMarks = (s: string | undefined): number =>
    s ? (s.match(new RegExp(HL_OPEN, "g")) ?? []).length : 0;

  return {
    title,
    content,
    matchCount: countMarks(title) + countMarks(content),
  };
}

/* Replace HL_OPEN/HL_CLOSE markers in a highlighted string with real
 * <mark> tags. Used for content destined for react-markdown with
 * rehype-raw — the inline HTML survives parsing.
 *
 * Unlike renderSnippet() (which is for snippet display in a search
 * result list), this does NOT HTML-escape or strip markdown — the
 * source is markdown that will be parsed downstream, and we want
 * the markdown structure preserved. */
export function injectHighlightMarks(highlighted: string): string {
  return highlighted
    .split(HL_OPEN)
    .join("<mark>")
    .split(HL_CLOSE)
    .join("</mark>");
}

function serialiseArticle(doc: Record<string, unknown>): Article {
  return {
    _id: String(doc._id),
    slug: doc.slug as string,
    title: doc.title as string,
    status: doc.status as "draft" | "published",
    tags: (doc.tags as string[]) ?? [],
    domains: (doc.domains as string[]) ?? [],
    currentVersionId: doc.currentVersionId
      ? String(doc.currentVersionId)
      : undefined,
    createdAt: doc.createdAt as Date,
    updatedAt: doc.updatedAt as Date,
    originUrl: doc.originUrl as string | undefined,
    originLabel: doc.originLabel as string | undefined,
  };
}
