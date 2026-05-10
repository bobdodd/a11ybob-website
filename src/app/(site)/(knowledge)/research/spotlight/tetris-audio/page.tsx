import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";

export default function SpotlightTetrisAudio() {
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
            <h1>Audio Tetris</h1>
            <p className="lede">
              A Java/JOAL audio rendering of the most visual game,
              built as the PhD&rsquo;s deliberate falsification test
              for the framework. Discovered, by accident, that the
              modality shift turned a third-person observational game
              into a first-person immersive one.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <p className="muted">
              Substantive draft pending. The page will cover the
              seven specific audio metaphors (Aside, Musical sonar,
              Dancing margins, Talking scrollbar, Direction-as-
              direction, Gravity as waterfall, Braided audio), the
              modality-shift observation, and the closure in the
              Personas appendix &mdash; the very game chosen as the
              framework&rsquo;s hardest test fails for the
              colour-blind user, in a way the framework exists to
              handle.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/research/tetris-testbed">
                  Tetris as accessibility testbed
                </Link>{" "}
                &mdash; the methodology framing that this artefact
                tested.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
