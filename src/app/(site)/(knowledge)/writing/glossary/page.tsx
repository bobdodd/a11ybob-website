import Link from "next/link";
import type { CSSProperties } from "react";
import { searchGlossary } from "@/lib/glossary";
import { searchArticles } from "@/lib/articles";
import { searchReviews } from "@/lib/reviews";
import { buildSearchStatus } from "@/lib/searchStatus";
import { Pagination } from "@/components/Pagination";
import { SearchForm } from "@/components/SearchForm";
import { FilterBar } from "@/components/FilterBar";
import { PrimarySection } from "@/components/PrimarySection";
import {
  ArticleResultCard,
  ReviewResultCard,
  GlossaryResultCard,
} from "@/components/ResultCards";

export const dynamic = "force-dynamic";

const EXTRA_PREVIEW = 5;
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type Search = {
  q?: string;
  letter?: string;
  category?: string;
  page?: string;
  articles?: string;
  reviews?: string;
};

export default async function Glossary({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const letter = params.letter?.trim().toUpperCase() || undefined;
  const category = params.category?.trim() || undefined;
  const page = params.page ? parseInt(params.page, 10) || 1 : 1;
  const includeArticles = params.articles === "1";
  const includeReviews = params.reviews === "1";

  const [result, articlesExtra, reviewsExtra] = await Promise.all([
    searchGlossary({ q, letter, category, page }),
    q && includeArticles
      ? searchArticles({ q, perPage: EXTRA_PREVIEW })
      : null,
    q && includeReviews
      ? searchReviews({ q, perPage: EXTRA_PREVIEW })
      : null,
  ]);

  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (letter) sp.set("letter", letter);
  if (category) sp.set("category", category);
  if (includeArticles) sp.set("articles", "1");
  if (includeReviews) sp.set("reviews", "1");
  const baseUrl = `/writing/glossary${sp.toString() ? `?${sp}` : ""}`;

  return (
    <main id="main" className="site-main">
      <div className="center" style={{ "--max": "min(80rem, 100%)" } as CSSProperties}>
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <p>
              <small>
                <Link href="/writing">← Writing</Link>
                {" · "}
                <Link href="/writing/reviews">Reviews →</Link>
              </small>
            </p>
            <h1>Glossary</h1>
            <p className="lede">
              Terms used in accessibility research and practice. Each entry
              has a definition, common aliases, and category tags.
            </p>
          </header>

          <SearchForm
            q={q}
            action="/writing/glossary"
            preserve={{ category, letter }}
            hint="Searches glossary terms, their aliases, and definitions."
            label="Search the glossary"
            includes={[
              {
                name: "articles",
                label: "+ Articles",
                checked: includeArticles,
                href: q ? toggleHref(baseUrl, "articles") : undefined,
              },
              {
                name: "reviews",
                label: "+ Reviews",
                checked: includeReviews,
                href: q ? toggleHref(baseUrl, "reviews") : undefined,
              },
            ]}
          />

          {!q && (
            <nav aria-label="Browse alphabetically">
              <ul
                className="cluster nav-list"
                style={{ "--space": "var(--s-1)" } as CSSProperties}
              >
                {ALPHA.map((l) => (
                  <li key={l}>
                    <Link
                      href={`/writing/glossary?letter=${l}`}
                      aria-current={letter === l ? "page" : undefined}
                    >
                      {l}
                    </Link>
                  </li>
                ))}
                {letter && (
                  <li>
                    <Link href="/writing/glossary">
                      <small>Clear</small>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          )}

          <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
              <p role="status" className={q ? "flush" : "visually-hidden flush"}>
                {q
                  ? buildSearchStatus({
                      q,
                      primary: { total: result.total, noun: "glossary term" },
                      extras: [
                        articlesExtra && {
                          total: articlesExtra.total,
                          noun: "article",
                        },
                        reviewsExtra && {
                          total: reviewsExtra.total,
                          noun: "review",
                        },
                      ],
                    })
                  : ""}
              </p>

              <PrimarySection
                wrap={Boolean(articlesExtra || reviewsExtra)}
                heading={`Glossary · ${result.total === 0 ? "no matches" : `${result.total} match${result.total === 1 ? "" : "es"}`}`}
              >
                <FilterBar
                  baseUrl={baseUrl}
                  axes={[
                    {
                      name: "category",
                      label: "Category",
                      active: category,
                      options: result.facets.categories.slice(0, 25),
                    },
                  ]}
                />

                {!(articlesExtra || reviewsExtra) && (
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
                  <p>No glossary entries match the current filters.</p>
                ) : (
                  <dl
                    className="list-flat stack"
                    style={{ "--space": "var(--s1)" } as CSSProperties}
                  >
                    {result.hits.map((entry) => (
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
                      Articles · {articlesExtra.total === 0 ? "no matches" : `${articlesExtra.total} match${articlesExtra.total === 1 ? "" : "es"}`}
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
                      <Link href={`/writing?q=${encodeURIComponent(q!)}`}>
                        See all {articlesExtra.total} matching articles →
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

