import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { MeasureSubNav } from "@/components/MeasureSubNav";

export default function FunctionalAccessibility() {
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
            <h1>2. Functional Accessibility</h1>
            <p className="lede">
              The result of at least one successful negotiation
              between a user and a provider, within the context of
              all communications mediums available at that time and
              place.
            </p>
          </header>

          <MeasureSubNav />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <p className="muted">
              Substantive draft pending. The page will give the
              formal definition of Functional Accessibility with
              notation, the negotiation framing between user and
              provider, the multi-medium robustness condition (an
              interface is functionally accessible if at least one
              medium-and-protocol path succeeds), and the legal-
              rights scoping with its limits.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Continue</h2>
            <p>
              <Link href="/research/the-measure-of-accessibility/the-question">
                &larr; Previous: 1. The Question
              </Link>
              {" · "}
              <Link href="/research/the-measure-of-accessibility/intrinsic-accessibility">
                Next: 3. Intrinsic Accessibility &rarr;
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
