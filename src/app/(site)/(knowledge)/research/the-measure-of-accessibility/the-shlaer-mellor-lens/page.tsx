import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { MeasureSubNav } from "@/components/MeasureSubNav";

export default function ShlaerMellorLensInDepth() {
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
            <h1>5. The Shlaer-Mellor lens</h1>
            <p className="lede">
              Recursive design as accessibility. Bridged semantic
              information domains rendered concrete by a model
              compiler for given user-and-environment constraints.
              The methodological substrate that makes the formal
              definitions on the previous pages buildable rather than
              just stated.
            </p>
          </header>

          <MeasureSubNav />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <p className="muted">
              Substantive draft pending. The page will give the
              in-depth treatment of recursive design as the structure
              of accessibility — domain charts, bridges, model
              compilation, and the four-decade engineering lineage
              from Forth at Metal Box through Shlaer-Mellor and CISNA
              to Paradise&rsquo;s ActionLanguage IR.
            </p>
            <p>
              The standalone summary lives at{" "}
              <Link href="/research/shlaer-mellor-lens">
                /research/shlaer-mellor-lens
              </Link>
              . The page here expands the same material with the
              formal specifics — domain charts, bridges, assigner
              state models for resource competition, subtyping with
              role migration, action specification languages — and
              grounds them in the running code at{" "}
              <Link href="/research/action-language">
                /research/action-language
              </Link>
              .
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Continue</h2>
            <p>
              <Link href="/research/the-measure-of-accessibility/equivalent-experience">
                &larr; Previous: 4. Equivalent Experience
              </Link>
              {" · "}
              <Link href="/research/the-measure-of-accessibility/communities-of-practice">
                Next: 6. Communities of Practice &rarr;
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
