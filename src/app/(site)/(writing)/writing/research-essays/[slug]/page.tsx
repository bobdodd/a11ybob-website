import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  getArticleBySlug,
  getArticleHighlights,
  injectHighlightMarks,
} from "@/lib/articles";
import { NewTabLink } from "@/components/NewTabLink";
import { WritingSubNav } from "@/components/WritingSubNav";

export const dynamic = "force-dynamic";

const BASE = "https://a11ybob.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  // Self-canonical (good SEO; for reposts it declares a11ybob the primary
  // over the LinkedIn copy).
  return {
    title: article.title,
    alternates: { canonical: `${BASE}/writing/research-essays/${slug}` },
  };
}

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
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <WritingSubNav />
          <article className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <p>
            <small>
              <Link href={q ? `/writing/research-essays?q=${encodeURIComponent(q)}` : "/writing/research-essays"}>
                ← {q ? "Back to results" : "All research essays"}
              </Link>
            </small>
          </p>

          {q && (
            <p className="muted">
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

          {article.originUrl && (
            <p className="muted">
              <small>
                Originally shared on{" "}
                <NewTabLink href={article.originUrl}>
                  {article.originLabel ?? "LinkedIn"}
                </NewTabLink>
                {article.publishedAt
                  ? `, ${new Date(article.publishedAt).toISOString().slice(0, 10)}`
                  : ""}
                .
              </small>
            </p>
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
                <p className="flush">
                  <strong>Domains:</strong> {article.domains.join(" · ")}
                </p>
              )}
              {article.tags.length > 0 && (
                <p className="flush">
                  <strong>Tags:</strong> {article.tags.join(" · ")}
                </p>
              )}
            </footer>
          )}
          </article>
        </div>
      </div>
    </main>
  );
}
