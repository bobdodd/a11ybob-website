import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  getArticleBySlug,
  getArticleHighlights,
  injectHighlightMarks,
} from "@/lib/articles";

export const dynamic = "force-dynamic";

type Search = { q?: string };

export default async function Article({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Search>;
}) {
  const { slug } = await params;
  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() || undefined;

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  // When a query is present, re-query OpenSearch for this article
  // with full-field highlighting enabled. The highlights returned
  // are analyzer-faithful — they mark exactly what OpenSearch
  // matched, so what the reader sees in the article matches what
  // they saw highlighted in the search result snippet.
  const highlights = q ? await getArticleHighlights(article._id, q) : null;

  // The article body opens with its own H1 → markdown is self-framing,
  // page chrome adds nothing but the back link. Otherwise the page
  // provides an H1 from the article's metadata title.
  const articleHasOwnTitle = /^\s*#\s+/.test(article.content);

  // Pick the rendering source for each piece, preferring highlighted
  // versions when available.
  const titleHtml =
    highlights?.title && injectHighlightMarks(highlights.title);
  const contentToRender =
    highlights?.content
      ? injectHighlightMarks(highlights.content)
      : article.content;

  return (
    <main id="main" className="site-main" data-zone="writing">
      <div className="center">
        <article className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <p>
            <small>
              <Link href={q ? `/writing?q=${encodeURIComponent(q)}` : "/writing"}>
                ← {q ? "Back to results" : "All writing"}
              </Link>
            </small>
          </p>

          {q && (
            <p style={{ color: "var(--ink-muted)" }}>
              <small>
                {!highlights || highlights.matchCount === 0 ? (
                  <>
                    The term <code>{q}</code> wasn’t found in this article.
                  </>
                ) : highlights.matchCount === 1 ? (
                  <>
                    1 match for <code>{q}</code> highlighted in this article.
                  </>
                ) : (
                  <>
                    {highlights.matchCount} matches for <code>{q}</code>{" "}
                    highlighted in this article.
                  </>
                )}
              </small>
            </p>
          )}

          {!articleHasOwnTitle && (
            <header>
              <h1>
                {titleHtml ? (
                  <span dangerouslySetInnerHTML={{ __html: titleHtml }} />
                ) : (
                  article.title
                )}
              </h1>
            </header>
          )}

          <div className="prose">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {contentToRender}
            </ReactMarkdown>
          </div>

          {(article.tags.length > 0 || article.domains.length > 0) && (
            <footer
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              {article.domains.length > 0 && (
                <p style={{ marginBlock: 0 }}>
                  <strong>Domains:</strong> {article.domains.join(" · ")}
                </p>
              )}
              {article.tags.length > 0 && (
                <p style={{ marginBlock: 0 }}>
                  <strong>Tags:</strong> {article.tags.join(" · ")}
                </p>
              )}
            </footer>
          )}
        </article>
      </div>
    </main>
  );
}
