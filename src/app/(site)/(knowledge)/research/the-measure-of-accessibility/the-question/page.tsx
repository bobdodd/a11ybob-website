import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { MeasureSubNav } from "@/components/MeasureSubNav";

export default function TheQuestion() {
  return (
    <main id="main" className="site-main" data-zone="knowledge">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <ResearchSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <p>
              <small>
                <Link href="/research/the-measure-of-accessibility">
                  &larr; The Measure of Accessibility
                </Link>
              </small>
            </p>
            <h1>1. The Question</h1>
            <p className="lede">
              <em>
                What is accessibility and how do you measure it? The
                answer is wholly political.
              </em>
            </p>
          </header>

          <MeasureSubNav />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <p className="muted">
              Substantive draft pending. This page will frame
              accessibility as a political question rather than a
              technical or legal one — the spectrum from
              insertion-into-existing-society to universal-access-
              by-design, the hammer-and-nail critique of why most
              assistive tech sits at the insertion end, and an
              accounting of why the current vocabularies (legal,
              ergonomic, usability) underdetermine the answer.
              Source: <em>Defining Accessibility</em> thesis chapter.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Continue</h2>
            <p>
              <Link href="/research/the-measure-of-accessibility/functional-accessibility">
                Next: 2. Functional Accessibility &rarr;
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
