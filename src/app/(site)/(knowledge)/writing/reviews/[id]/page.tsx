import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { getReviewById } from "@/lib/reviews";
import { WritingSubNav } from "@/components/WritingSubNav";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const review = await getReviewById(id);
  return { title: review ? review.title : "Reviews" };
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await getReviewById(id);
  if (!review) notFound();

  return (
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <WritingSubNav />
          <p>
            <small>
              <Link href="/writing/reviews">← All reviews</Link>
            </small>
          </p>

          <header className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h1>{review.title}</h1>
            <p className="muted">
              <small>
                {review.authors.length > 0 && <>{review.authors.join(", ")} · </>}
                {review.year}
                {review.publication && <> · {review.publication}</>}
                {review.doi && (
                  <>
                    {" · "}
                    <a href={`https://doi.org/${review.doi}`}>doi:{review.doi}</a>
                  </>
                )}
              </small>
            </p>
          </header>

          {review.summary && (
            <section>
              <h2 className="search-results-heading">Summary</h2>
              <p className="preserve-whitespace">{review.summary}</p>
            </section>
          )}

          {review.key_findings && (
            <section>
              <h2 className="search-results-heading">Key findings</h2>
              <p className="preserve-whitespace">{review.key_findings}</p>
            </section>
          )}

          {review.relevance && (
            <section>
              <h2 className="search-results-heading">Relevance</h2>
              <p className="preserve-whitespace">{review.relevance}</p>
            </section>
          )}

          {(review.tags.length > 0 || review.standards_referenced.length > 0) && (
            <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
              {review.tags.length > 0 && (
                <p className="flush">
                  <strong>Tags:</strong>{" "}
                  {review.tags.map((t, i) => (
                    <span key={t}>
                      {i > 0 && " · "}
                      <Link href={`/writing/reviews?tag=${encodeURIComponent(t)}`}>
                        {t}
                      </Link>
                    </span>
                  ))}
                </p>
              )}
              {review.standards_referenced.length > 0 && (
                <p className="flush">
                  <strong>Standards referenced:</strong>{" "}
                  {review.standards_referenced.join(" · ")}
                </p>
              )}
            </section>
          )}

          {review.rating !== null && (
            <p>
              <small className="muted">
                Rating: {review.rating} / 5
              </small>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
