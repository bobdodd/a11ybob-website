import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { getExperienceBySlug } from "@/lib/experiences";
import { NewTabLink } from "@/components/NewTabLink";

export const dynamic = "force-dynamic";

const BASE = "https://a11ybob.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperienceBySlug(slug);
  if (!exp) return {};
  // a11ybob.com is the canonical home even when the piece was first
  // published elsewhere (e.g. LinkedIn).
  return {
    title: exp.title,
    alternates: { canonical: `${BASE}/writing/experience/${slug}` },
  };
}

type Search = { q?: string };

export default async function ExperiencePiece({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Search>;
}) {
  const { slug } = await params;
  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim() || undefined;

  const exp = await getExperienceBySlug(slug);
  if (!exp) notFound();

  // If the body opens with its own H1 the markdown is self-framing;
  // otherwise the page provides the H1 from the title.
  const hasOwnTitle = /^\s*#\s+/.test(exp.content);
  const published = exp.publishedAt
    ? new Date(exp.publishedAt).toISOString().slice(0, 10)
    : null;

  return (
    <main id="main" className="site-main">
      <div className="center">
        <article
          className="stack"
          style={{ "--space": "var(--s2)" } as CSSProperties}
        >
          <p>
            <small>
              <Link
                href={
                  q
                    ? `/writing/experience?q=${encodeURIComponent(q)}`
                    : "/writing/experience"
                }
              >
                ← {q ? "Back to results" : "All experience pieces"}
              </Link>
            </small>
          </p>

          {!hasOwnTitle && (
            <header
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <h1>{exp.title}</h1>
              {(exp.originUrl || published) && (
                <p className="muted">
                  <small>
                    {exp.originUrl ? (
                      <>
                        Originally shared on{" "}
                        <NewTabLink href={exp.originUrl}>
                          {exp.originLabel ?? "LinkedIn"}
                        </NewTabLink>
                        {published ? `, ${published}` : ""}.
                      </>
                    ) : (
                      published
                    )}
                  </small>
                </p>
              )}
            </header>
          )}

          <div className="prose">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {exp.content}
            </ReactMarkdown>
          </div>

          {exp.tags.length > 0 && (
            <footer
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <p className="flush">
                <strong>Tags:</strong> {exp.tags.join(" · ")}
              </p>
            </footer>
          )}
        </article>
      </div>
    </main>
  );
}
