import Link from "next/link";
import type { CSSProperties } from "react";
import { searchExperiences } from "@/lib/experiences";
import { searchArticles } from "@/lib/articles";
import { searchReviews } from "@/lib/reviews";
import { searchGlossary } from "@/lib/glossary";
import { buildSearchStatus } from "@/lib/searchStatus";
import { Pagination } from "@/components/Pagination";
import { SearchForm } from "@/components/SearchForm";
import { FilterBar } from "@/components/FilterBar";
import { PrimarySection } from "@/components/PrimarySection";
import {
  ExperienceResultCard,
  ArticleResultCard,
  ReviewResultCard,
  GlossaryResultCard,
} from "@/components/ResultCards";
import { WritingSubNav } from "@/components/WritingSubNav";

export const dynamic = "force-dynamic";

const EXTRA_PREVIEW = 5;

type Search = {
  q?: string;
  page?: string;
  tag?: string;
  articles?: string;
  reviews?: string;
  glossary?: string;
};

export default async function Experience({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const page = params.page ? parseInt(params.page, 10) || 1 : 1;
  const tag = params.tag?.trim() || undefined;
  const includeArticles = params.articles === "1";
  const includeReviews = params.reviews === "1";
  const includeGlossary = params.glossary === "1";

  const [result, articlesExtra, reviewsExtra, glossaryExtra] = await Promise.all([
    searchExperiences({ q, tag, page }),
    q && includeArticles ? searchArticles({ q, perPage: EXTRA_PREVIEW }) : null,
    q && includeReviews ? searchReviews({ q, perPage: EXTRA_PREVIEW }) : null,
    q && includeGlossary ? searchGlossary({ q, perPage: EXTRA_PREVIEW }) : null,
  ]);

  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (tag) sp.set("tag", tag);
  if (includeArticles) sp.set("articles", "1");
  if (includeReviews) sp.set("reviews", "1");
  if (includeGlossary) sp.set("glossary", "1");
  const baseUrl = `/writing/experience${sp.toString() ? `?${sp}` : ""}`;

  const hasExtras = Boolean(articlesExtra || reviewsExtra || glossaryExtra);

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
            <h1>Experience</h1>
            <p className="lede">
              Shorter, first-person pieces — field notes and experience
              reports, including writing first shared elsewhere and brought
              home here. The long-form essays live under{" "}
              <Link href="/writing/research-essays">Research essays</Link>.
            </p>
          </header>

          <SearchForm
            q={q}
            action="/writing/experience"
            preserve={{ tag }}
            hint="Searches experience-piece titles, body text, and tags."
            label="Search experience pieces"
            includes={[
              {
                name: "articles",
                label: "+ Research essays",
                checked: includeArticles,
                href: q ? toggleHref(baseUrl, "articles") : undefined,
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

          <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
            <p role="status" className={q ? "flush" : "visually-hidden flush"}>
              {q
                ? buildSearchStatus({
                    q,
                    primary: { total: result.total, noun: "experience piece" },
                    extras: [
                      articlesExtra && {
                        total: articlesExtra.total,
                        noun: "research essay",
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
              wrap={hasExtras}
              heading={`Experience · ${result.total === 0 ? "no matches" : `${result.total} match${result.total === 1 ? "" : "es"}`}`}
            >
              {result.facets.tags.length > 0 && (
                <FilterBar
                  baseUrl={baseUrl}
                  axes={[
                    {
                      name: "tag",
                      label: "Tag",
                      active: tag,
                      options: result.facets.tags
                        .slice(0, 25)
                        .toSorted((a, b) => a.value.localeCompare(b.value)),
                    },
                  ]}
                />
              )}

              {!hasExtras && (
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
                <p>No experience pieces match the current filters.</p>
              ) : (
                <ul
                  className="list-flat stack"
                  style={{ "--space": "var(--s2)" } as CSSProperties}
                >
                  {result.hits.map((e) => (
                    <ExperienceResultCard
                      key={e._id}
                      hit={e}
                      q={q}
                      headingLevel={hasExtras ? "h3" : "h2"}
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

            {reviewsExtra && (
              <details className="extra-section" open>
                <summary>
                  <h2>
                    Reviews · {reviewsExtra.total === 0 ? "no matches" : `${reviewsExtra.total} match${reviewsExtra.total === 1 ? "" : "es"}`}
                  </h2>
                </summary>
                {reviewsExtra.hits.length > 0 && (
                  <ul
                    className="list-flat stack"
                    style={{ "--space": "var(--s2)" } as CSSProperties}
                  >
                    {reviewsExtra.hits.map((hit) => (
                      <ReviewResultCard key={hit._id} hit={hit} headingLevel="h3" />
                    ))}
                  </ul>
                )}
                {reviewsExtra.total > reviewsExtra.hits.length && (
                  <p>
                    <Link href={`/writing/reviews?q=${encodeURIComponent(q!)}`}>
                      See all {reviewsExtra.total} matching reviews →
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
