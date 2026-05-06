import { ObjectId } from "mongodb";
import { getDb } from "./mongo";
import { opensearch } from "./opensearch";
import { HL_CLOSE, HL_OPEN } from "./searchHighlight";
import {
  pickTier,
  tieredShould,
  tierMeaningful,
  type SearchTier,
} from "./searchTier";

export type Review = {
  _id: string;
  title: string;
  authors: string[];
  year: number | null;
  publication?: string;
  doi?: string;
  tags: string[];
  standards_referenced: string[];
  summary?: string;
  key_findings?: string;
  relevance?: string;
  rating: number | null;
  created?: string;
  updated?: string;
  /** Which scoring tier matched this hit. Undefined for single-term
   *  queries and for browse mode. See
   *  docs/decisions/0007-tiered-article-search.md */
  tier?: SearchTier;
  /** Highlight fragments returned by OpenSearch — strings contain the
   *  raw source text with HL_OPEN/HL_CLOSE placeholder markers. Render
   *  via renderSnippet() from searchHighlight.ts. */
  highlights?: {
    title?: string[];
    summary?: string[];
    key_findings?: string[];
  };
};

export type ReviewSearchParams = {
  q?: string;
  year?: number;
  tag?: string;
  page?: number;
  perPage?: number;
};

export type ReviewSearchResult = {
  hits: Review[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  facets: {
    years: { value: number; count: number }[];
    tags: { value: string; count: number }[];
  };
};

const DEFAULT_PER_PAGE = 25;

export async function searchReviews(
  params: ReviewSearchParams,
): Promise<ReviewSearchResult> {
  const page = Math.max(1, params.page ?? 1);
  const perPage = params.perPage ?? DEFAULT_PER_PAGE;
  const from = (page - 1) * perPage;

  const filter = [
    ...(params.year ? [{ term: { year: params.year } }] : []),
    ...(params.tag ? [{ term: { tags: params.tag } }] : []),
  ];

  const fields = [
    "title^3",
    "summary^2",
    "key_findings^2",
    "relevance",
    "tags",
    "authors",
  ];

  const queryClause = params.q
    ? {
        bool: {
          should: tieredShould(params.q, fields),
          filter,
          minimum_should_match: 1,
        },
      }
    : { bool: { must: [{ match_all: {} }], filter } };

  const body = {
    from,
    size: perPage,
    query: queryClause,
    sort: params.q ? ["_score"] : [{ year: "desc" as const }, "_score"],
    ...(params.q && {
      highlight: {
        pre_tags: [HL_OPEN],
        post_tags: [HL_CLOSE],
        fields: {
          title: { number_of_fragments: 0 },
          summary: { fragment_size: 220, number_of_fragments: 2, no_match_size: 0 },
          key_findings: { fragment_size: 220, number_of_fragments: 1, no_match_size: 0 },
        },
        require_field_match: false,
      },
    }),
    aggs: {
      years: { terms: { field: "year", size: 30, order: { _key: "desc" as const } } },
      tags: { terms: { field: "tags", size: 30 } },
    },
  };

  const res = await opensearch.search({ index: "reviews", body });
  const total = typeof res.body.hits.total === "number"
    ? res.body.hits.total
    : res.body.hits.total.value;

  const showTier = tierMeaningful(params.q);
  const hits = res.body.hits.hits.map(
    (h: {
      _id: string;
      _source: Record<string, unknown>;
      matched_queries?: string[];
      highlight?: Record<string, string[]>;
    }) => ({
      ...serialiseHit(h._id, h._source),
      tier: showTier ? pickTier(h.matched_queries) : undefined,
      highlights: h.highlight,
    }),
  );

  return {
    hits,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
    facets: {
      years: (res.body.aggregations?.years?.buckets ?? []).map(
        (b: { key: number; doc_count: number }) => ({
          value: b.key,
          count: b.doc_count,
        }),
      ),
      tags: (res.body.aggregations?.tags?.buckets ?? []).map(
        (b: { key: string; doc_count: number }) => ({
          value: b.key,
          count: b.doc_count,
        }),
      ),
    },
  };
}

export async function getReviewById(id: string): Promise<Review | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection("reviews").findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return serialiseHit(String(doc._id), doc);
}

function serialiseHit(id: string, src: Record<string, unknown>): Review {
  return {
    _id: id,
    title: (src.title as string) ?? "(untitled)",
    authors: (src.authors as string[]) ?? [],
    year: (src.year as number) ?? null,
    publication: src.publication as string | undefined,
    doi: src.doi as string | undefined,
    tags: (src.tags as string[]) ?? [],
    standards_referenced: (src.standards_referenced as string[]) ?? [],
    summary: src.summary as string | undefined,
    key_findings: src.key_findings as string | undefined,
    relevance: src.relevance as string | undefined,
    rating: (src.rating as number) ?? null,
    created: src.created as string | undefined,
    updated: src.updated as string | undefined,
  };
}
