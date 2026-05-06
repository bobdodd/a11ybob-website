import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import { getArticleBySlug } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <main id="main" className="site-main" data-zone="writing">
      <div className="center">
        <article className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <p>
            <small>
              <Link href="/writing">← All writing</Link>
            </small>
          </p>

          <header className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h1>{article.title}</h1>
            <p style={{ color: "var(--ink-muted)" }}>
              <small>
                {article.author}
                {article.publishedAt && (
                  <> · {new Date(article.publishedAt).toISOString().slice(0, 10)}</>
                )}
              </small>
            </p>
          </header>

          {article.summary && (
            <p style={{ fontSize: "var(--s1)", fontStyle: "italic" }}>
              {article.summary}
            </p>
          )}

          <div className="prose">
            <ReactMarkdown>{article.content}</ReactMarkdown>
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
