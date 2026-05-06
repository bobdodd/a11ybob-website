import Link from "next/link";
import type { CSSProperties } from "react";
import { searchGlossary } from "@/lib/glossary";
import { renderSnippet } from "@/lib/searchHighlight";
import { tierLabel } from "@/lib/searchTier";
import { Pagination } from "@/components/Pagination";
import { SearchForm } from "@/components/SearchForm";

export const dynamic = "force-dynamic";

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type Search = {
  q?: string;
  letter?: string;
  category?: string;
  page?: string;
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

  const result = await searchGlossary({ q, letter, category, page });

  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (letter) sp.set("letter", letter);
  if (category) sp.set("category", category);
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
              {result.hits.length === 0 ? (
                <p>No glossary entries match the current filters.</p>
              ) : (
                <dl
                  className="stack"
                  style={{ "--space": "var(--s1)" } as CSSProperties}
                >
                  {result.hits.map((entry) => {
                    const termHtml = entry.highlights?.term?.[0]
                      ? renderSnippet(entry.highlights.term[0])
                      : null;
                    const akaHtml = entry.highlights?.aka?.length
                      ? entry.highlights.aka.map(renderSnippet).join(", ")
                      : null;
                    const defHtml = entry.highlights?.definition?.length
                      ? entry.highlights.definition.map(renderSnippet).join(" … ")
                      : null;
                    return (
                      <div
                        key={entry._id}
                        className="stack"
                        style={{ "--space": "var(--s-1)" } as CSSProperties}
                      >
                        <dt style={{ fontSize: "var(--s1)", fontWeight: 600 }}>
                          <Link href={`/writing/glossary/${entry._id}`}>
                            {termHtml ? (
                              <span dangerouslySetInnerHTML={{ __html: termHtml }} />
                            ) : (
                              entry.term
                            )}
                          </Link>
                          {entry.aka.length > 0 && (
                            <span
                              style={{
                                marginInlineStart: "var(--s-1)",
                                color: "var(--ink-muted)",
                                fontWeight: 400,
                                fontSize: "var(--s-1)",
                              }}
                            >
                              {akaHtml ? (
                                <>
                                  (also:{" "}
                                  <span dangerouslySetInnerHTML={{ __html: akaHtml }} />
                                  )
                                </>
                              ) : (
                                <>(also: {entry.aka.slice(0, 3).join(", ")})</>
                              )}
                            </span>
                          )}
                        </dt>
                        <dd style={{ marginInlineStart: 0 }}>
                          {entry.tier && (
                            <>
                              <span className="tier-badge">
                                {tierLabel(entry.tier)}
                              </span>{" "}
                            </>
                          )}
                          {defHtml ? (
                            <span dangerouslySetInnerHTML={{ __html: defHtml }} />
                          ) : (
                            truncate(entry.definition, 280)
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
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

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}
