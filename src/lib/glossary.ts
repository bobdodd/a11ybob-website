import { ObjectId } from "mongodb";
import { getDb } from "./mongo";
import { opensearch } from "./opensearch";

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

  const must: Record<string, unknown>[] = [];
  if (params.q) {
    must.push({
      multi_match: {
        query: params.q,
        fields: ["term^4", "aka^3", "definition^2"],
      },
    });
  } else if (params.letter) {
    must.push({
      prefix: { "term.keyword": params.letter.toUpperCase() },
    });
  } else {
    must.push({ match_all: {} });
  }

  const filter = params.category
    ? [{ term: { category: params.category } }]
    : [];

  const body = {
    from,
    size: perPage,
    query: { bool: { must, filter } },
    sort: params.q
      ? ["_score"]
      : [{ "term.keyword": "asc" as const }],
    aggs: {
      categories: { terms: { field: "category", size: 30 } },
    },
  };

  const res = await opensearch.search({ index: "glossary", body });
  const total = typeof res.body.hits.total === "number"
    ? res.body.hits.total
    : res.body.hits.total.value;

  const hits = res.body.hits.hits.map(
    (h: { _id: string; _source: Record<string, unknown> }) =>
      serialiseHit(h._id, h._source),
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
