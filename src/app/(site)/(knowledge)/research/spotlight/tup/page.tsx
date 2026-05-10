import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";

export default function SpotlightTUP() {
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
                <Link href="/research/spotlight">
                  &larr; Spotlight projects
                </Link>
              </small>
            </p>
            <h1>TUP &mdash; adaptive thumbwheel text input</h1>
            <p className="lede">
              An iPodLinux reimplementation of Transparent
              User-guided Prediction with two pieces of original
              engineering on top: a finite-state machine handling the
              &ldquo;woodpecker effect&rdquo; of hand tremor and the
              sliding-touch problem of reduced cutaneous sensitivity,
              and an adaptive wheel display that puts the predicted
              letter <em>under the user&rsquo;s finger</em> rather
              than asking them to reach for it.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <p className="muted">
              Substantive draft pending (Track 3). Source material
              exists in <em>The Story of Bob</em>: the design problem
              (cousin Paul, with progressing MS, and the input
              failures of tremor and sliding touch); the
              counterintuitive insight (don&rsquo;t make the user
              reach for the predicted character &mdash; adapt the
              wheel so the predicted character is already under the
              finger); the engineering (FSM modelling
              woodpecker-and-sliding, adaptive wheel display, large
              on-screen letter for low vision); and the long-arc
              connection &mdash; TUP&rsquo;s ad-hoc engineering
              became the formal haptic capability template years
              before the framework existed.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
