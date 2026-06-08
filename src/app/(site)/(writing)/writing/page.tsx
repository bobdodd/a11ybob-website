import Link from "next/link";
import type { CSSProperties } from "react";
import { WritingSubNav } from "@/components/WritingSubNav";

export default function Writing() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s3)" } as CSSProperties}>
          <WritingSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Writing</h1>
            <p className="lede">
              Four bodies of writing on accessibility: long-form research
              essays, shorter first-person experience reports, a database of
              reviewed papers, and a glossary of terms. The archive is
              licensed CC BY-SA &mdash; citation and reuse are welcome;
              please credit and link back.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
            aria-labelledby="writing-essays-heading"
          >
            <h2 id="writing-essays-heading">Research essays</h2>
            <p>
              Long-form synthesis of published accessibility research. Each
              piece is grounded in named papers; each claim points back to
              the underlying evidence.
            </p>
            <p>
              <Link href="/writing/research-essays">
                Read the research essays &rarr;
              </Link>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
            aria-labelledby="writing-experience-heading"
          >
            <h2 id="writing-experience-heading">Experience</h2>
            <p>
              Shorter, first-person pieces &mdash; field notes and experience
              reports, including writing first shared elsewhere and brought
              home here.
            </p>
            <p>
              <Link href="/writing/experience">
                Read the experience pieces &rarr;
              </Link>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
            aria-labelledby="writing-reviews-heading"
          >
            <h2 id="writing-reviews-heading">Reviews</h2>
            <p>
              A searchable database of reviewed accessibility papers &mdash;
              each with a summary, key findings, and a note on its relevance
              to practice.
            </p>
            <p>
              <Link href="/writing/reviews">
                Browse the reviews database &rarr;
              </Link>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
            aria-labelledby="writing-glossary-heading"
          >
            <h2 id="writing-glossary-heading">Glossary</h2>
            <p>
              Definitions of accessibility terms, cross-linked with the
              reviews and the research essays.
            </p>
            <p>
              <Link href="/writing/glossary">Open the glossary &rarr;</Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
