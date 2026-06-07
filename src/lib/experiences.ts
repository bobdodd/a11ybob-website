import { getDb } from "./mongo";
import { opensearch } from "./opensearch";
import { HL_CLOSE, HL_OPEN } from "./searchHighlight";
import { tieredShould } from "./searchTier";

/* Experience pieces — a separate Writing corpus from the long-form synthesis
 * "articles". Shorter, first-person / reposted pieces (e.g. a LinkedIn article
 * brought over). Flat documents (no article-style versioning); markdown body.
 * Collection: `experiences`; OpenSearch index: `experiences`. */

export type Experience = {
  _id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  tags: string[];
  content: string; // markdown
  publishedAt: Date;
  updatedAt?: Date;
  /** Canonical-origin credit: the piece was first published elsewhere
   *  (e.g. LinkedIn). a11ybob.com remains the canonical home. */
  originUrl?: string;
  originLabel?: string;
  /** Set on search hits only — OpenSearch highlight fragments. */
  highlights?: {
    title?: string[];
    content?: string[];
  };
};

function serialise(doc: Record<string, unknown>): Experience {
  return {
    _id: String(doc._id),
    slug: doc.slug as string,
    title: doc.title as string,
    status: (doc.status as Experience["status"]) ?? "published",
    tags: (doc.tags as string[]) ?? [],
    content: (doc.content as string) ?? "",
    publishedAt: (doc.publishedAt as Date) ?? (doc.createdAt as Date),
    updatedAt: doc.updatedAt as Date | undefined,
    originUrl: doc.originUrl as string | undefined,
    originLabel: doc.originLabel as string | undefined,
  };
}

export async function listPublishedExperiences(): Promise<Experience[]> {
  const db = await getDb();
  const docs = await db
    .collection("experiences")
    .find({ status: "published" })
    .sort({ publishedAt: -1 })
    .toArray();
  return docs.map(serialise);
}

export async function getExperienceBySlug(
  slug: string,
): Promise<Experience | null> {
  const db = await getDb();
  const doc = await db
    .collection("experiences")
    .findOne({ slug, status: "published" });
  return doc ? serialise(doc) : null;
}

/** Slugs (+ last-modified) of published experiences, for the sitemap. */
export async function listExperiencesForSitemap(): Promise<
  { slug: string; updated?: Date }[]
> {
  const db = await getDb();
  const docs = await db
    .collection("experiences")
    .find(
      { status: "published" },
      { projection: { slug: 1, publishedAt: 1, updatedAt: 1 } },
    )
    .toArray();
  return docs.map((d) => ({
    slug: String(d.slug),
    updated: (d.updatedAt as Date) ?? (d.publishedAt as Date) ?? undefined,
  }));
}

/* ───── Search ──────────────────────────────────────────────────── */

export type ExperienceSearchParams = {
  q?: string;
  tag?: string;
  page?: number;
  perPage?: number;
};

export type ExperienceSearchResult = {
  hits: Experience[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  facets: { tags: { value: string; count: number }[] };
};

const DEFAULT_PER_PAGE = 25;

export async function searchExperiences(
  params: ExperienceSearchParams,
): Promise<ExperienceSearchResult> {
  const page = Math.max(1, params.page ?? 1);
  const perPage = params.perPage ?? DEFAULT_PER_PAGE;
  const from = (page - 1) * perPage;

  const filter = params.tag
    ? [{ term: { tags: params.tag.toLowerCase() } }]
    : [];

  const fields = ["title^3", "content", "tags"];

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
    sort: params.q ? ["_score"] : [{ publishedAt: "desc" as const }, "_score"],
    ...(params.q && {
      highlight: {
        pre_tags: [HL_OPEN],
        post_tags: [HL_CLOSE],
        fields: {
          title: { number_of_fragments: 0 },
          content: {
            fragment_size: 220,
            number_of_fragments: 2,
            no_match_size: 0,
          },
        },
        require_field_match: false,
      },
    }),
    aggs: {
      tags: { terms: { field: "tags", size: 30 } },
    },
  };

  const res = await opensearch.search({ index: "experiences", body });
  const total =
    typeof res.body.hits.total === "number"
      ? res.body.hits.total
      : (res.body.hits.total?.value ?? 0);

  const rawHits = res.body.hits.hits as unknown as Array<{
    _id: string;
    _source: Record<string, unknown>;
    highlight?: Record<string, string[]>;
  }>;
  const hits = rawHits.map((h) => ({
    ...serialise({ _id: h._id, ...h._source }),
    highlights: h.highlight,
  }));

  const aggs = res.body.aggregations as
    | Record<
        string,
        { buckets: Array<{ key: string | number; doc_count: number }> } | undefined
      >
    | undefined;

  return {
    hits,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
    facets: {
      tags: (aggs?.tags?.buckets ?? []).map((b) => ({
        value: b.key as string,
        count: b.doc_count,
      })),
    },
  };
}
