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

export type GlossaryEntry = {
  _id: string;
  term: string;
  aka: string[];
  definition: string;
  category: string[];
  related_terms: string[];
  sources: string[];
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
    term?: string[];
    aka?: string[];
    definition?: string[];
  };
};

export type GlossarySearchParams = {
  q?: string;
  letter?: string;
  category?: string;
  page?: number;
  perPage?: number;
};

export type GlossarySearchResult = {
  hits: GlossaryEntry[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  facets: {
    categories: { value: string; count: number }[];
  };
};

const DEFAULT_PER_PAGE = 50;

export async function searchGlossary(
  params: GlossarySearchParams,
): Promise<GlossarySearchResult> {
  const page = Math.max(1, params.page ?? 1);
  const perPage = params.perPage ?? DEFAULT_PER_PAGE;
  const from = (page - 1) * perPage;

  const filter = params.category
    ? [{ term: { category: params.category } }]
    : [];

  const fields = ["term^4", "aka^3", "definition^2"];

  const queryClause = params.q
    ? {
        bool: {
          should: tieredShould(params.q, fields),
          filter,
          minimum_should_match: 1,
        },
      }
    : params.letter
      ? {
          bool: {
            must: [{ prefix: { "term.keyword": params.letter.toUpperCase() } }],
            filter,
          },
        }
      : { bool: { must: [{ match_all: {} }], filter } };

  const body = {
    from,
    size: perPage,
    query: queryClause,
    sort: params.q
      ? ["_score"]
      : [{ "term.keyword": "asc" as const }],
    ...(params.q && {
      highlight: {
        pre_tags: [HL_OPEN],
        post_tags: [HL_CLOSE],
        fields: {
          term: { number_of_fragments: 0 },
          aka: { number_of_fragments: 0 },
          definition: { fragment_size: 220, number_of_fragments: 2, no_match_size: 0 },
        },
        require_field_match: false,
      },
    }),
    aggs: {
      categories: { terms: { field: "category", size: 30 } },
    },
  };

  const res = await opensearch.search({ index: "glossary", body });
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
      categories: (res.body.aggregations?.categories?.buckets ?? []).map(
        (b: { key: string; doc_count: number }) => ({
          value: b.key,
          count: b.doc_count,
        }),
      ),
    },
  };
}

export async function getGlossaryById(
  id: string,
): Promise<GlossaryEntry | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  const doc = await db.collection("glossary").findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return serialiseHit(String(doc._id), doc);
}

export async function getGlossaryByTerm(
  term: string,
): Promise<GlossaryEntry | null> {
  const db = await getDb();
  const doc = await db
    .collection("glossary")
    .findOne({ term: { $regex: `^${escapeRegex(term)}$`, $options: "i" } });
  if (!doc) return null;
  return serialiseHit(String(doc._id), doc);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function serialiseHit(id: string, src: Record<string, unknown>): GlossaryEntry {
  return {
    _id: id,
    term: (src.term as string) ?? "(unnamed)",
    aka: (src.aka as string[])?.filter((x) => typeof x === "string") ?? [],
    definition: (src.definition as string) ?? "",
    category: (src.category as string[]) ?? [],
    related_terms: (src.related_terms as string[]) ?? [],
    sources: (src.sources as string[]) ?? [],
    created: src.created as string | undefined,
    updated: src.updated as string | undefined,
  };
}
