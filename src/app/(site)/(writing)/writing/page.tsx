import Link from "next/link";
import type { CSSProperties } from "react";
import { renderSnippet, searchArticles, type ArticleHit } from "@/lib/articles";
import { tierLabel } from "@/lib/searchTier";
import { Pagination } from "@/components/Pagination";
import { SearchForm } from "@/components/SearchForm";

export const dynamic = "force-dynamic";

type Search = {
  q?: string;
  domain?: string;
  tag?: string;
  page?: string;
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

  const result = await searchArticles({ q, domain, tag, page });

  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (domain) sp.set("domain", domain);
  if (tag) sp.set("tag", tag);
  const baseUrl = `/writing${sp.toString() ? `?${sp}` : ""}`;

  const filtering = Boolean(q || domain || tag);

  return (
    <main id="main" className="site-main" data-zone="writing">
      <div
        className="center"
        style={{ "--max": "min(80rem, 100%)" } as CSSProperties}
      >
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Writing</h1>
            <p style={{ fontSize: "var(--s1)" }}>
              Long-form synthesis of published accessibility research. Each
              piece is grounded in named papers; each claim points back to
              the underlying evidence.
            </p>
            <p>
              The archive is licensed CC BY-SA. Citation and reuse are
              welcome; please credit and link back.
            </p>
            <p>
              <small>
                Also browse:{" "}
                <Link href="/writing/reviews">Reviews database</Link> ·{" "}
                <Link href="/writing/glossary">Glossary</Link>
              </small>
            </p>
          </header>

          <SearchForm
            q={q}
            action="/writing"
            preserve={{ domain, tag }}
            placeholder="Search article text…"
            label="Search articles"
          />

          {filtering && (
            <p>
              <small>
                {q && (
                  <>
                    Searching for <code>{q}</code>
                    {(domain || tag) && " · "}
                  </>
                )}
                {domain && (
                  <>
                    domain <code>{domain}</code>
                    {tag && " · "}
                  </>
                )}
                {tag && (
                  <>
                    tag <code>{tag}</code>
                  </>
                )}
                {" — "}
                <Link href="/writing">Clear</Link>
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
            <aside
              className="sidebar stack"
              style={{ "--space": "var(--s1)" } as CSSProperties}
            >
              <h2 style={{ fontSize: "var(--s1)" }}>Filter</h2>

              {result.facets.domains.length > 0 && (
                <section>
                  <h3 style={{ fontSize: "var(--s0)" }}>Domain</h3>
                  <ul
                    className="stack"
                    style={
                      {
                        "--space": "var(--s-2)",
                        listStyle: "none",
                        paddingInlineStart: 0,
                        fontSize: "var(--s-1)",
                      } as CSSProperties
                    }
                  >
                    {result.facets.domains.map((f) => (
                      <li key={f.value}>
                        <Link
                          href={facetHref(baseUrl, "domain", f.value, domain)}
                          style={
                            domain === f.value ? { fontWeight: 600 } : undefined
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

              {result.facets.tags.length > 0 && (
                <section>
                  <h3 style={{ fontSize: "var(--s0)" }}>Tag</h3>
                  <ul
                    className="stack"
                    style={
                      {
                        "--space": "var(--s-2)",
                        listStyle: "none",
                        paddingInlineStart: 0,
                        fontSize: "var(--s-1)",
                      } as CSSProperties
                    }
                  >
                    {result.facets.tags.slice(0, 30).map((f) => (
                      <li key={f.value}>
                        <Link
                          href={facetHref(baseUrl, "tag", f.value, tag)}
                          style={
                            tag === f.value ? { fontWeight: 600 } : undefined
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

              {result.facets.domains.length === 0 &&
                result.facets.tags.length === 0 && (
                  <p style={{ color: "var(--ink-muted)" }}>
                    <small>
                      No tags or domains have been applied to articles yet.
                    </small>
                  </p>
                )}
            </aside>

            <div
              className="not-sidebar stack"
              style={{ "--space": "var(--s2)" } as CSSProperties}
            >
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
                  className="stack"
                  style={
                    {
                      "--space": "var(--s2)",
                      listStyle: "none",
                      paddingInlineStart: 0,
                    } as CSSProperties
                  }
                >
                  {result.hits.map((hit) => (
                    <ArticleResult key={hit._id} hit={hit} searching={Boolean(q)} q={q} />
                  ))}
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

function ArticleResult({
  hit,
  searching,
  q,
}: {
  hit: ArticleHit;
  searching: boolean;
  q?: string;
}) {
  const articleHref = q
    ? `/writing/${hit.slug}?q=${encodeURIComponent(q)}`
    : `/writing/${hit.slug}`;
  // Title: prefer highlighted version when searching.
  const titleHtml = searching && hit.highlights.title?.[0]
    ? renderSnippet(hit.highlights.title[0])
    : null;

  // Body snippet only renders when searching — context fragments
  // around the matched terms. There is no summary field; if no query
  // is active, the result card shows just the title and metadata.
  const contentFragments = hit.highlights.content ?? [];

  return (
    <li>
      <article
        className="stack"
        style={{ "--space": "var(--s-1)" } as CSSProperties}
      >
        <h2 style={{ marginBlock: 0, fontSize: "var(--s1)" }}>
          <Link href={articleHref}>
            {titleHtml ? (
              <span dangerouslySetInnerHTML={{ __html: titleHtml }} />
            ) : (
              hit.title
            )}
          </Link>
        </h2>

        {(hit.publishedAt || hit.domains.length > 0 || hit.tier) && (
          <p style={{ marginBlock: 0 }}>
            {hit.tier && (
              <span className="tier-badge">{tierLabel(hit.tier)}</span>
            )}
            {(hit.publishedAt || hit.domains.length > 0) && (
              <small
                style={{
                  color: "var(--ink-muted)",
                  marginInlineStart: hit.tier ? "var(--s-1)" : 0,
                }}
              >
                {[
                  hit.publishedAt &&
                    new Date(hit.publishedAt).toISOString().slice(0, 10),
                  hit.domains.length > 0 && hit.domains.join(" · "),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </small>
            )}
          </p>
        )}

        {searching && contentFragments.length > 0 && (
          <div
            style={{ marginBlock: 0 }}
            dangerouslySetInnerHTML={{
              __html: contentFragments.map(renderSnippet).join(" … "),
            }}
          />
        )}
      </article>
    </li>
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
