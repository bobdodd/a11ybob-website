import Link from "next/link";
import type { CSSProperties } from "react";
import { searchArticles } from "@/lib/articles";
import { searchExperiences } from "@/lib/experiences";
import { searchReviews } from "@/lib/reviews";
import { searchGlossary } from "@/lib/glossary";
import { buildSearchStatus } from "@/lib/searchStatus";
import { Pagination } from "@/components/Pagination";
import { SearchForm } from "@/components/SearchForm";
import { FilterBar } from "@/components/FilterBar";
import { PrimarySection } from "@/components/PrimarySection";
import {
  ArticleResultCard,
  ExperienceResultCard,
  ReviewResultCard,
  GlossaryResultCard,
} from "@/components/ResultCards";
import { WritingSubNav } from "@/components/WritingSubNav";

export const dynamic = "force-dynamic";

const EXTRA_PREVIEW = 5;

type Search = {
  q?: string;
  domain?: string;
  tag?: string;
  page?: string;
  experiences?: string;
  reviews?: string;
  glossary?: string;
};

export default async function WritingIndex({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const domain = params.domain?.trim() || undefined;
  const tag = params.tag?.trim() || undefined;
  const page = params.page ? parseInt(params.page, 10) || 1 : 1;
  const includeExperiences = params.experiences === "1";
  const includeReviews = params.reviews === "1";
  const includeGlossary = params.glossary === "1";

  // Extra-corpus searches only run when the user has opted in AND
  // there's a query — they're keyed by q, no filters.
  const [result, experiencesExtra, reviewsExtra, glossaryExtra] =
    await Promise.all([
      searchArticles({ q, domain, tag, page }),
      q && includeExperiences
        ? searchExperiences({ q, perPage: EXTRA_PREVIEW })
        : null,
      q && includeReviews
        ? searchReviews({ q, perPage: EXTRA_PREVIEW })
        : null,
      q && includeGlossary
        ? searchGlossary({ q, perPage: EXTRA_PREVIEW })
        : null,
    ]);

  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (domain) sp.set("domain", domain);
  if (tag) sp.set("tag", tag);
  if (includeExperiences) sp.set("experiences", "1");
  if (includeReviews) sp.set("reviews", "1");
  if (includeGlossary) sp.set("glossary", "1");
  const baseUrl = `/writing/research-essays${sp.toString() ? `?${sp}` : ""}`;

  const filtering = Boolean(q || domain || tag);

  return (
    <main id="main" className="site-main">
      <div
        className="center"
        style={{ "--max": "min(80rem, 100%)" } as CSSProperties}
      >
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <WritingSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Research essays</h1>
            <p className="lede">
              Long-form synthesis of published accessibility research. Each
              piece is grounded in named papers; each claim points back to
              the underlying evidence.
            </p>
            <p>
              The archive is licensed CC BY-SA. Citation and reuse are
              welcome; please credit and link back.
            </p>
          </header>

          <SearchForm
            q={q}
            action="/writing/research-essays"
            preserve={{ domain, tag }}
            hint="Searches every word of every published article."
            label="Search articles"
            includes={[
              {
                name: "experiences",
                label: "+ Experience",
                checked: includeExperiences,
                href: q ? toggleHref(baseUrl, "experiences") : undefined,
              },
              {
                name: "reviews",
                label: "+ Reviews",
                checked: includeReviews,
                href: q ? toggleHref(baseUrl, "reviews") : undefined,
              },
              {
                name: "glossary",
                label: "+ Glossary",
                checked: includeGlossary,
                href: q ? toggleHref(baseUrl, "glossary") : undefined,
              },
            ]}
          />

          <div
            className="stack"
            style={{ "--space": "var(--s2)" } as CSSProperties}
          >
              <p role="status" className={q ? "flush" : "visually-hidden flush"}>
                {q
                  ? buildSearchStatus({
                      q,
                      primary: { total: result.total, noun: "article" },
                      extras: [
                        experiencesExtra && {
                          total: experiencesExtra.total,
                          noun: "experience piece",
                        },
                        reviewsExtra && {
                          total: reviewsExtra.total,
                          noun: "review",
                        },
                        glossaryExtra && {
                          total: glossaryExtra.total,
                          noun: "glossary term",
                        },
                      ],
                    })
                  : ""}
              </p>

              <PrimarySection
                wrap={Boolean(experiencesExtra || reviewsExtra || glossaryExtra)}
                heading={`Articles · ${result.total === 0 ? "no matches" : `${result.total} match${result.total === 1 ? "" : "es"}`}`}
              >
                <FilterBar
                  baseUrl={baseUrl}
                  axes={[
                    {
                      name: "domain",
                      label: "Domain",
                      active: domain,
                      // Alpha-sort domain facets for display.
                      options: result.facets.domains.toSorted((a, b) =>
                        a.value.localeCompare(b.value),
                      ),
                    },
                    {
                      name: "tag",
                      label: "Tag",
                      active: tag,
                      // Take top-30 by count, then alpha-sort for display.
                      options: result.facets.tags
                        .slice(0, 30)
                        .toSorted((a, b) => a.value.localeCompare(b.value)),
                    },
                  ]}
                />

                {!(experiencesExtra || reviewsExtra || glossaryExtra) && (
                  <h2 className="search-results-heading">Search results</h2>
                )}

                <Pagination
                  page={result.page}
                  totalPages={result.totalPages}
                  total={result.total}
                  perPage={result.perPage}
                  baseUrl={baseUrl}
                  position="top"
                />

                {result.hits.length === 0 ? (
                  <p>
                    {q
                      ? "No articles match this search."
                      : filtering
                        ? "No articles match the current filters."
                        : "No articles are currently published."}
                  </p>
                ) : (
                  <ul
                    className="list-flat stack"
                    style={{ "--space": "var(--s2)" } as CSSProperties}
                  >
                    {result.hits.map((hit) => (
                      <ArticleResultCard
                        key={hit._id}
                        hit={hit}
                        q={q}
                        headingLevel={
                          experiencesExtra || reviewsExtra || glossaryExtra
                            ? "h3"
                            : "h2"
                        }
                      />
                    ))}
                  </ul>
                )}

                <Pagination
                  page={result.page}
                  totalPages={result.totalPages}
                  total={result.total}
                  perPage={result.perPage}
                  baseUrl={baseUrl}
                  position="bottom"
                />
              </PrimarySection>

              {experiencesExtra && (
                <ExperienceSection
                  q={q!}
                  total={experiencesExtra.total}
                  hits={experiencesExtra.hits}
                />
              )}

              {reviewsExtra && (
                <ReviewsSection
                  q={q!}
                  total={reviewsExtra.total}
                  hits={reviewsExtra.hits}
                />
              )}

              {glossaryExtra && (
                <GlossarySection
                  q={q!}
                  total={glossaryExtra.total}
                  hits={glossaryExtra.hits}
                />
              )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ExperienceSection({
  q,
  total,
  hits,
}: {
  q: string;
  total: number;
  hits: Awaited<ReturnType<typeof searchExperiences>>["hits"];
}) {
  return (
    <details className="extra-section" open>
      <summary>
        <h2>
          Experience · {total === 0 ? "no matches" : `${total} match${total === 1 ? "" : "es"}`}
        </h2>
      </summary>
      {hits.length > 0 && (
        <ul
          className="list-flat stack"
          style={{ "--space": "var(--s2)" } as CSSProperties}
        >
          {hits.map((hit) => (
            <ExperienceResultCard key={hit._id} hit={hit} q={q} headingLevel="h3" />
          ))}
        </ul>
      )}
      {total > hits.length && (
        <p>
          <Link href={`/writing/experience?q=${encodeURIComponent(q)}`}>
            See all {total} matching experience pieces →
          </Link>
        </p>
      )}
    </details>
  );
}

function ReviewsSection({
  q,
  total,
  hits,
}: {
  q: string;
  total: number;
  hits: Awaited<ReturnType<typeof searchReviews>>["hits"];
}) {
  return (
    <details className="extra-section" open>
      <summary>
        <h2>
          Reviews · {total === 0 ? "no matches" : `${total} match${total === 1 ? "" : "es"}`}
        </h2>
      </summary>
      {hits.length > 0 && (
        <ul
          className="list-flat stack"
          style={{ "--space": "var(--s2)" } as CSSProperties}
        >
          {hits.map((hit) => (
            <ReviewResultCard key={hit._id} hit={hit} headingLevel="h3" />
          ))}
        </ul>
      )}
      {total > hits.length && (
        <p>
          <Link href={`/writing/reviews?q=${encodeURIComponent(q)}`}>
            See all {total} matching reviews →
          </Link>
        </p>
      )}
    </details>
  );
}

function GlossarySection({
  q,
  total,
  hits,
}: {
  q: string;
  total: number;
  hits: Awaited<ReturnType<typeof searchGlossary>>["hits"];
}) {
  return (
    <details className="extra-section" open>
      <summary>
        <h2>
          Glossary · {total === 0 ? "no matches" : `${total} match${total === 1 ? "" : "es"}`}
        </h2>
      </summary>
      {hits.length > 0 && (
        <dl
          className="list-flat stack"
          style={{ "--space": "var(--s1)" } as CSSProperties}
        >
          {hits.map((entry) => (
            <div
              key={entry._id}
              className="stack"
              style={{ "--space": "var(--s-1)" } as CSSProperties}
            >
              <GlossaryResultCard entry={entry} />
            </div>
          ))}
        </dl>
      )}
      {total > hits.length && (
        <p>
          <Link href={`/writing/glossary?q=${encodeURIComponent(q)}`}>
            See all {total} matching terms →
          </Link>
        </p>
      )}
    </details>
  );
}

function toggleHref(baseUrl: string, key: string): string {
  const url = new URL(baseUrl, "https://placeholder.example");
  if (url.searchParams.get(key) === "1") {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, "1");
  }
  url.searchParams.delete("page");
  return url.pathname + (url.search || "");
}

