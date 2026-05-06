import Link from "next/link";
import type { CSSProperties } from "react";
import { searchReviews } from "@/lib/reviews";
import { renderSnippet } from "@/lib/searchHighlight";
import { tierLabel } from "@/lib/searchTier";
import { Pagination } from "@/components/Pagination";
import { SearchForm } from "@/components/SearchForm";

export const dynamic = "force-dynamic";

type Search = {
  q?: string;
  page?: string;
  year?: string;
  tag?: string;
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

  const result = await searchReviews({ q, year, tag, page });

  // Build a baseUrl that reflects current filters for pagination links.
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (year) sp.set("year", String(year));
  if (tag) sp.set("tag", tag);
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
            placeholder="Search reviews…"
            label="Search reviews"
          />

          {(year || tag || q) && (
            <p>
              <small>
                Filtering by:{" "}
                {q && <code>q={q}</code>}{" "}
                {year && <code>year={year}</code>}{" "}
                {tag && <code>tag={tag}</code>}{" "}
                <Link href="/writing/reviews">Clear all filters</Link>
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

              {result.facets.years.length > 0 && (
                <section>
                  <h3 style={{ fontSize: "var(--s0)" }}>Year</h3>
                  <ul
                    className="stack"
                    style={{
                      "--space": "var(--s-2)",
                      listStyle: "none",
                      paddingInlineStart: 0,
                      fontSize: "var(--s-1)",
                    } as CSSProperties}
                  >
                    {result.facets.years.slice(0, 15).map((f) => (
                      <li key={f.value}>
                        <Link
                          href={facetHref(baseUrl, "year", String(f.value), year)}
                          style={year === f.value ? { fontWeight: 600 } : undefined}
                        >
                          {f.value} <small style={{ color: "var(--ink-muted)" }}>({f.count})</small>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {result.facets.tags.length > 0 && (
                <section>
                  <h3 style={{ fontSize: "var(--s0)" }}>Tag</h3>
                  <ul
                    className="stack"
                    style={{
                      "--space": "var(--s-2)",
                      listStyle: "none",
                      paddingInlineStart: 0,
                      fontSize: "var(--s-1)",
                    } as CSSProperties}
                  >
                    {result.facets.tags.slice(0, 25).map((f) => (
                      <li key={f.value}>
                        <Link
                          href={facetHref(baseUrl, "tag", f.value, tag)}
                          style={tag === f.value ? { fontWeight: 600 } : undefined}
                        >
                          {f.value} <small style={{ color: "var(--ink-muted)" }}>({f.count})</small>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </aside>

            <div className="not-sidebar stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
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
                  {result.hits.map((r) => {
                    const titleHtml = r.highlights?.title?.[0]
                      ? renderSnippet(r.highlights.title[0])
                      : null;
                    const summaryFrags = r.highlights?.summary ?? [];
                    const findingsFrags = r.highlights?.key_findings ?? [];
                    const snippetHtml =
                      summaryFrags.length > 0
                        ? summaryFrags.map(renderSnippet).join(" … ")
                        : findingsFrags.length > 0
                          ? findingsFrags.map(renderSnippet).join(" … ")
                          : null;
                    return (
                      <li key={r._id}>
                        <article
                          className="stack"
                          style={{ "--space": "var(--s-1)" } as CSSProperties}
                        >
                          <h2 style={{ marginBlock: 0, fontSize: "var(--s1)" }}>
                            <Link href={`/writing/reviews/${r._id}`}>
                              {titleHtml ? (
                                <span dangerouslySetInnerHTML={{ __html: titleHtml }} />
                              ) : (
                                r.title
                              )}
                            </Link>
                          </h2>
                          <p style={{ marginBlock: 0 }}>
                            {r.tier && (
                              <span className="tier-badge">
                                {tierLabel(r.tier)}
                              </span>
                            )}
                            <small
                              style={{
                                color: "var(--ink-muted)",
                                marginInlineStart: r.tier ? "var(--s-1)" : 0,
                              }}
                            >
                              {r.authors.length > 0 && (
                                <>{r.authors.join(", ")} · </>
                              )}
                              {r.year && <>{r.year}</>}
                              {r.publication && <> · {r.publication}</>}
                            </small>
                          </p>
                          {snippetHtml ? (
                            <p
                              style={{ marginBlock: 0 }}
                              dangerouslySetInnerHTML={{ __html: snippetHtml }}
                            />
                          ) : (
                            r.summary && (
                              <p style={{ marginBlock: 0 }}>
                                {truncate(r.summary, 280)}
                              </p>
                            )
                          )}
                          {r.tags.length > 0 && (
                            <p style={{ marginBlock: 0 }}>
                              <small style={{ color: "var(--ink-muted)" }}>
                                {r.tags.slice(0, 5).join(" · ")}
                              </small>
                            </p>
                          )}
                        </article>
                      </li>
                    );
                  })}
                </ul>
              )}

              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                total={result.total}
                perPage={result.perPage}
                baseUrl={baseUrl}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function facetHref(
  baseUrl: string,
  key: string,
  value: string,
  current: string | number | undefined,
): string {
  const url = new URL(baseUrl, "https://placeholder.example");
  // Toggle: clicking the active facet removes it
  if (String(current) === value) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  url.searchParams.delete("page");
  return url.pathname + (url.search || "");
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}
