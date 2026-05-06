import Link from "next/link";
import type { CSSProperties } from "react";
import { listPublishedArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function WritingIndex() {
  const articles = await listPublishedArticles();

  return (
    <main id="main" className="site-main" data-zone="writing">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s3)" } as CSSProperties}>
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
          </header>

          <nav
            aria-label="Writing archive"
            className="grid"
            style={
              {
                "--minimum": "16rem",
                "--space": "var(--s1)",
              } as CSSProperties
            }
          >
            <Link href="/writing/reviews" className="door">
              <h2 style={{ marginBlock: 0, fontSize: "var(--s1)" }}>
                Reviews database →
              </h2>
              <p>
                The 2,661 reviewed accessibility papers behind the writing.
                Searchable, filterable by year and tag.
              </p>
            </Link>
            <Link href="/writing/glossary" className="door">
              <h2 style={{ marginBlock: 0, fontSize: "var(--s1)" }}>
                Glossary →
              </h2>
              <p>
                Terms used in accessibility research and practice. Browse
                alphabetically or search by term, alias, or definition.
              </p>
            </Link>
          </nav>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>Articles</h2>

            {articles.length === 0 ? (
              <p style={{ color: "var(--ink-muted)" }}>
                No articles are currently published. Drafts are being prepared;
                this surface will populate as pieces move from draft to
                published in the editorial workspace.
              </p>
            ) : (
              <div
                className="grid"
                style={
                  {
                    "--minimum": "20rem",
                    "--space": "var(--s1)",
                  } as CSSProperties
                }
              >
                {articles.map((a) => (
                  <Link key={a._id} href={`/writing/${a.slug}`} className="door">
                    <h3 style={{ marginBlock: 0, fontSize: "var(--s1)" }}>
                      {a.title}
                    </h3>
                    {a.summary && <p>{a.summary}</p>}
                    {a.domains.length > 0 && (
                      <p style={{ color: "var(--ink-muted)" }}>
                        <small>{a.domains.join(" · ")}</small>
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
