import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { MeasureSubNav } from "@/components/MeasureSubNav";

export default function CommunitiesOfPractice() {
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
            <h1>6. Communities of Practice</h1>
            <p className="lede">
              <em>
                If a User Interface can be described as a Community
                of Practice, then I&rsquo;d define an inaccessible
                user interface as a dysfunctional community.
              </em>
            </p>
          </header>

          <MeasureSubNav />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <p className="muted">
              Substantive draft pending. The page will treat the
              user interface as a community of practice at two levels
              — the UI itself (nine entities playing roles in a
              shared enterprise) and user populations (memetic
              evolution of profiles in disability-related peer
              groups) — and reframe inaccessibility as community
              dysfunction. It will also open onto the multi-agent
              and 2029 territory and surface the critique of
              competition-only agentic-AI framings.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Continue</h2>
            <p>
              <Link href="/research/the-measure-of-accessibility/the-shlaer-mellor-lens">
                &larr; Previous: 5. The Shlaer-Mellor lens
              </Link>
              {" · "}
              <Link href="/research/2029-framework">
                See also: The 2029 framework &rarr;
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
