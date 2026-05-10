import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { MeasureSubNav } from "@/components/MeasureSubNav";

export default function EquivalentExperience() {
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
            <h1>4. Equivalent Experience</h1>
            <p className="lede">
              <em>
                We are all equal members of society with the same
                right to access goods and services, and we should
                expect to have functional access to goods and services
                independent of our physical capability.
              </em>
            </p>
          </header>

          <MeasureSubNav />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <p className="muted">
              Substantive draft pending. This page will treat the
              timing dimension of equivalent experience, the equality
              argument, and the explicit rejection of utilitarianism
              in accessibility — why &ldquo;the greatest good of the
              greatest number&rdquo; is the wrong frame for a domain
              where the question is fundamentally one of rights, not
              utility maximisation. Source:{" "}
              <em>Defining Accessibility</em> thesis chapter.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Continue</h2>
            <p>
              <Link href="/research/the-measure-of-accessibility/intrinsic-accessibility">
                &larr; Previous: 3. Intrinsic Accessibility
              </Link>
              {" · "}
              <Link href="/research/the-measure-of-accessibility/the-shlaer-mellor-lens">
                Next: 5. The Shlaer-Mellor lens &rarr;
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
