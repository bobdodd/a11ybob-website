import Link from "next/link";
import type { CSSProperties } from "react";
import { searchGlossary } from "@/lib/glossary";
import { searchArticles } from "@/lib/articles";
import { searchReviews } from "@/lib/reviews";
import { buildSearchStatus } from "@/lib/searchStatus";
import { Pagination } from "@/components/Pagination";
import { SearchForm } from "@/components/SearchForm";
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
    <main id="main" className="site-main" data-zone="knowledge">
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
            <p style={{ fontSize: "var(--s1)" }}>
              Terms used in accessibility research and practice. Each entry
              has a definition, common aliases, and category tags.
            </p>
          </header>

          <SearchForm
            q={q}
            action="/writing/glossary"
            preserve={{ category, letter }}
            placeholder="Search terms, aliases, definitions…"
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
                      style={letter === l ? { fontWeight: 600 } : undefined}
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

          {(category || q || letter) && (
            <p>
              <small>
                Filtering by:{" "}
                {q && <code>q={q}</code>}{" "}
                {letter && <code>letter={letter}</code>}{" "}
                {category && <code>category={category}</code>}{" "}
                <Link href="/writing/glossary">Clear all filters</Link>
              </small>
            </p>
          )}

          <div
            className="with-sidebar"
            style={
              {
                "--side-width": "16rem",
                "--gutter": "var(--s2)",
              } as CSSProperties
            }
          >
            <aside className="sidebar stack" style={{ "--space": "var(--s1)" } as CSSProperties}>
              <h2 style={{ fontSize: "var(--s1)" }}>Filter</h2>

              {result.facets.categories.length > 0 && (
                <section>
                  <h3 style={{ fontSize: "var(--s0)" }}>Category</h3>
                  <ul
                    className="stack"
                    style={{
                      "--space": "var(--s-2)",
                      listStyle: "none",
                      paddingInlineStart: 0,
                      fontSize: "var(--s-1)",
                    } as CSSProperties}
                  >
                    {result.facets.categories.slice(0, 25).map((f) => (
                      <li key={f.value}>
                        <Link
                          href={facetHref(baseUrl, "category", f.value, category)}
                          style={
                            category === f.value ? { fontWeight: 600 } : undefined
                          }
                        >
                          {f.value}{" "}
                          <small style={{ color: "var(--ink-muted)" }}>
                            ({f.count})
                          </small>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </aside>

            <div className="not-sidebar stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
              <p role="status" style={{ marginBlock: 0 }}>
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
                  className="stack"
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

              {articlesExtra && (
                <details className="extra-section" open>
                  <summary>
                    <h2 style={{ display: "inline", fontSize: "var(--s1)", marginBlock: 0 }}>
                      Articles · {articlesExtra.total === 0 ? "no matches" : `${articlesExtra.total} match${articlesExtra.total === 1 ? "" : "es"}`}
                    </h2>
                  </summary>
                  {articlesExtra.hits.length > 0 && (
                    <ul
                      className="stack"
                      style={{
                        "--space": "var(--s2)",
                        listStyle: "none",
                        paddingInlineStart: 0,
                        marginBlockStart: "var(--s1)",
                      } as CSSProperties}
                    >
                      {articlesExtra.hits.map((hit) => (
                        <ArticleResultCard key={hit._id} hit={hit} q={q} headingLevel="h3" />
                      ))}
                    </ul>
                  )}
                  {articlesExtra.total > articlesExtra.hits.length && (
                    <p style={{ marginBlockStart: "var(--s0)" }}>
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
                    <h2 style={{ display: "inline", fontSize: "var(--s1)", marginBlock: 0 }}>
                      Reviews · {reviewsExtra.total === 0 ? "no matches" : `${reviewsExtra.total} match${reviewsExtra.total === 1 ? "" : "es"}`}
                    </h2>
                  </summary>
                  {reviewsExtra.hits.length > 0 && (
                    <ul
                      className="stack"
                      style={{
                        "--space": "var(--s2)",
                        listStyle: "none",
                        paddingInlineStart: 0,
                        marginBlockStart: "var(--s1)",
                      } as CSSProperties}
                    >
                      {reviewsExtra.hits.map((hit) => (
                        <ReviewResultCard key={hit._id} hit={hit} headingLevel="h3" />
                      ))}
                    </ul>
                  )}
                  {reviewsExtra.total > reviewsExtra.hits.length && (
                    <p style={{ marginBlockStart: "var(--s0)" }}>
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

function facetHref(
  baseUrl: string,
  key: string,
  value: string,
  current: string | undefined,
): string {
  const url = new URL(baseUrl, "https://placeholder.example");
  if (current === value) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  url.searchParams.delete("page");
  return url.pathname + (url.search || "");
}
