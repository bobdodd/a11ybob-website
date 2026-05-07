import Link from "next/link";
import type { CSSProperties } from "react";
import { searchReviews } from "@/lib/reviews";
import { searchArticles } from "@/lib/articles";
import { searchGlossary } from "@/lib/glossary";
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

type Search = {
  q?: string;
  page?: string;
  year?: string;
  tag?: string;
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
  const includeArticles = params.articles === "1";
  const includeGlossary = params.glossary === "1";

  const [result, articlesExtra, glossaryExtra] = await Promise.all([
    searchReviews({ q, year, tag, page }),
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
  if (includeArticles) sp.set("articles", "1");
  if (includeGlossary) sp.set("glossary", "1");
  const baseUrl = `/writing/reviews${sp.toString() ? `?${sp}` : ""}`;

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
                <Link href="/writing/glossary">Glossary →</Link>
              </small>
            </p>
            <h1>Reviews</h1>
            <p style={{ fontSize: "var(--s1)" }}>
              The literature-review database. Every paper Bob has read with
              accessibility-relevant findings, with a short reviewed summary,
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
                name: "articles",
                label: "+ Articles",
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
              <p
                role="status"
                style={
                  q
                    ? { marginBlock: 0 }
                    : {
                        position: "absolute",
                        width: "1px",
                        height: "1px",
                        overflow: "hidden",
                        clip: "rect(0 0 0 0)",
                        margin: 0,
                      }
                }
              >
                {q
                  ? buildSearchStatus({
                      q,
                      primary: { total: result.total, noun: "review" },
                      extras: [
                        articlesExtra && {
                          total: articlesExtra.total,
                          noun: "article",
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
                wrap={Boolean(articlesExtra || glossaryExtra)}
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
                      options: result.facets.tags.slice(0, 25),
                    },
                  ]}
                />

                {!(articlesExtra || glossaryExtra) && (
                  <h2 style={{ fontSize: "var(--s2)", marginBlock: 0 }}>
                    Search results
                  </h2>
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
                    className="stack"
                    style={{
                      "--space": "var(--s2)",
                      listStyle: "none",
                      paddingInlineStart: 0,
                    } as CSSProperties}
                  >
                    {result.hits.map((r) => (
                      <ReviewResultCard
                        key={r._id}
                        hit={r}
                        headingLevel={
                          articlesExtra || glossaryExtra ? "h3" : "h2"
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

              {glossaryExtra && (
                <details className="extra-section" open>
                  <summary>
                    <h2 style={{ display: "inline", fontSize: "var(--s1)", marginBlock: 0 }}>
                      Glossary · {glossaryExtra.total === 0 ? "no matches" : `${glossaryExtra.total} match${glossaryExtra.total === 1 ? "" : "es"}`}
                    </h2>
                  </summary>
                  {glossaryExtra.hits.length > 0 && (
                    <dl
                      className="stack"
                      style={{
                        "--space": "var(--s1)",
                        marginBlockStart: "var(--s1)",
                      } as CSSProperties}
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
                    <p style={{ marginBlockStart: "var(--s0)" }}>
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

