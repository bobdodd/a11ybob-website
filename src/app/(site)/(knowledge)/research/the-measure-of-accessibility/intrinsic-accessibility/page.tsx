import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { MeasureSubNav } from "@/components/MeasureSubNav";

export default function IntrinsicAccessibility() {
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
            <h1>3. Intrinsic Accessibility</h1>
            <p className="lede">
              The capacity for successful negotiation through a
              single transmission medium adapted to user capability.
              The interface itself adapts; nothing is bolted on.
            </p>
          </header>

          <MeasureSubNav />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <p className="muted">
              Substantive draft pending. The page will give the
              formal definition with the pseudo-user formalism
              (S<sub>PU</sub>, N<sub>PU</sub>, N<sub>IB</sub>), the
              proof of an optimal pseudo-user set independent of
              provider, and the explanation for why intrinsic
              accessibility generalises where functional doesn&rsquo;t
              — and why bolt-on assistive tech is structurally a
              functional-accessibility solution to a problem that
              wants intrinsic-accessibility.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Continue</h2>
            <p>
              <Link href="/research/the-measure-of-accessibility/functional-accessibility">
                &larr; Previous: 2. Functional Accessibility
              </Link>
              {" · "}
              <Link href="/research/the-measure-of-accessibility/equivalent-experience">
                Next: 4. Equivalent Experience &rarr;
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
