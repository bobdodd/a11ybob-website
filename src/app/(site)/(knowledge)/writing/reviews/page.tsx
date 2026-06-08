import Link from "next/link";
import type { CSSProperties } from "react";
import { searchReviews } from "@/lib/reviews";
import { searchArticles } from "@/lib/articles";
import { searchExperiences } from "@/lib/experiences";
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
  page?: string;
  year?: string;
  tag?: string;
  experiences?: string;
  articles?: string;
  glossary?: string;
};

export default async function Reading({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const page = params.page ? parseInt(params.page, 10) || 1 : 1;
  const year = params.year ? parseInt(params.year, 10) || undefined : undefined;
  const tag = params.tag?.trim() || undefined;
  const includeExperiences = params.experiences === "1";
  const includeArticles = params.articles === "1";
  const includeGlossary = params.glossary === "1";

  const [result, experiencesExtra, articlesExtra, glossaryExtra] =
    await Promise.all([
      searchReviews({ q, year, tag, page }),
      q && includeExperiences
        ? searchExperiences({ q, perPage: EXTRA_PREVIEW })
        : null,
      q && includeArticles
        ? searchArticles({ q, perPage: EXTRA_PREVIEW })
        : null,
      q && includeGlossary
        ? searchGlossary({ q, perPage: EXTRA_PREVIEW })
        : null,
    ]);

  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (year) sp.set("year", String(year));
  if (tag) sp.set("tag", tag);
  if (includeExperiences) sp.set("experiences", "1");
  if (includeArticles) sp.set("articles", "1");
  if (includeGlossary) sp.set("glossary", "1");
  const baseUrl = `/writing/reviews${sp.toString() ? `?${sp}` : ""}`;

  return (
    <main id="main" className="site-main">
      <div className="center" style={{ "--max": "min(80rem, 100%)" } as CSSProperties}>
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <WritingSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Reviews</h1>
            <p className="lede">
              The literature-review database. Every paper Bob has
              reviewed (he has read many more), with a short summary,
              key findings, and tags. Browse, filter, search.
            </p>
          </header>

          <SearchForm
            q={q}
            action="/writing/reviews"
            preserve={{ year: year ? String(year) : undefined, tag }}
            hint="Searches review titles, summaries, key findings, authors, and tags."
            label="Search reviews"
            includes={[
              {
                name: "experiences",
                label: "+ Experience",
                checked: includeExperiences,
                href: q ? toggleHref(baseUrl, "experiences") : undefined,
              },
              {
                name: "articles",
                label: "+ Research essays",
                checked: includeArticles,
                href: q ? toggleHref(baseUrl, "articles") : undefined,
              },
              {
                name: "glossary",
                label: "+ Glossary",
                checked: includeGlossary,
                href: q ? toggleHref(baseUrl, "glossary") : undefined,
              },
            ]}
          />

          <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
              <p role="status" className={q ? "flush" : "visually-hidden flush"}>
                {q
                  ? buildSearchStatus({
                      q,
                      primary: { total: result.total, noun: "review" },
                      extras: [
                        experiencesExtra && {
                          total: experiencesExtra.total,
                          noun: "experience piece",
                        },
                        articlesExtra && {
                          total: articlesExtra.total,
                          noun: "research essay",
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
                wrap={Boolean(experiencesExtra || articlesExtra || glossaryExtra)}
                heading={`Reviews · ${result.total === 0 ? "no matches" : `${result.total} match${result.total === 1 ? "" : "es"}`}`}
              >
                <FilterBar
                  baseUrl={baseUrl}
                  axes={[
                    {
                      name: "year",
                      label: "Year",
                      active: year ? String(year) : undefined,
                      options: result.facets.years.slice(0, 15).map((f) => ({
                        value: String(f.value),
                        count: f.count,
                      })),
                    },
                    {
                      name: "tag",
                      label: "Tag",
                      active: tag,
                      // Take top-25 by count, then alpha-sort for display.
                      options: result.facets.tags
                        .slice(0, 25)
                        .toSorted((a, b) => a.value.localeCompare(b.value)),
                    },
                  ]}
                />

                {!(experiencesExtra || articlesExtra || glossaryExtra) && (
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
                  <p>No reviews match the current filters.</p>
                ) : (
                  <ul
                    className="list-flat stack"
                    style={{ "--space": "var(--s2)" } as CSSProperties}
                  >
                    {result.hits.map((r) => (
                      <ReviewResultCard
                        key={r._id}
                        hit={r}
                        headingLevel={
                          experiencesExtra || articlesExtra || glossaryExtra
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
                <details className="extra-section" open>
                  <summary>
                    <h2>
                      Experience · {experiencesExtra.total === 0 ? "no matches" : `${experiencesExtra.total} match${experiencesExtra.total === 1 ? "" : "es"}`}
                    </h2>
                  </summary>
                  {experiencesExtra.hits.length > 0 && (
                    <ul
                      className="list-flat stack"
                      style={{ "--space": "var(--s2)" } as CSSProperties}
                    >
                      {experiencesExtra.hits.map((hit) => (
                        <ExperienceResultCard key={hit._id} hit={hit} q={q} headingLevel="h3" />
                      ))}
                    </ul>
                  )}
                  {experiencesExtra.total > experiencesExtra.hits.length && (
                    <p>
                      <Link href={`/writing/experience?q=${encodeURIComponent(q!)}`}>
                        See all {experiencesExtra.total} matching experience pieces →
                      </Link>
                    </p>
                  )}
                </details>
              )}

              {articlesExtra && (
                <details className="extra-section" open>
                  <summary>
                    <h2>
                      Research essays · {articlesExtra.total === 0 ? "no matches" : `${articlesExtra.total} match${articlesExtra.total === 1 ? "" : "es"}`}
                    </h2>
                  </summary>
                  {articlesExtra.hits.length > 0 && (
                    <ul
                      className="list-flat stack"
                      style={{ "--space": "var(--s2)" } as CSSProperties}
                    >
                      {articlesExtra.hits.map((hit) => (
                        <ArticleResultCard key={hit._id} hit={hit} q={q} headingLevel="h3" />
                      ))}
                    </ul>
                  )}
                  {articlesExtra.total > articlesExtra.hits.length && (
                    <p>
                      <Link href={`/writing/research-essays?q=${encodeURIComponent(q!)}`}>
                        See all {articlesExtra.total} matching research essays →
                      </Link>
                    </p>
                  )}
                </details>
              )}

              {glossaryExtra && (
                <details className="extra-section" open>
                  <summary>
                    <h2>
                      Glossary · {glossaryExtra.total === 0 ? "no matches" : `${glossaryExtra.total} match${glossaryExtra.total === 1 ? "" : "es"}`}
                    </h2>
                  </summary>
                  {glossaryExtra.hits.length > 0 && (
                    <dl
                      className="list-flat stack"
                      style={{ "--space": "var(--s1)" } as CSSProperties}
                    >
                      {glossaryExtra.hits.map((entry) => (
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
                  {glossaryExtra.total > glossaryExtra.hits.length && (
                    <p>
                      <Link href={`/writing/glossary?q=${encodeURIComponent(q!)}`}>
                        See all {glossaryExtra.total} matching terms →
                      </Link>
                    </p>
                  )}
                </details>
              )}
          </div>
        </div>
      </div>
    </main>
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

