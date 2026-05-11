import Link from "next/link";
import type { CSSProperties } from "react";

export default function Tools() {
  return (
    <main id="main" className="site-main" data-zone="tools">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Tools</h1>
            <p className="lede">
              A small family of accessibility-testing tools, all
              Bob-owned and open-source, that approach the same
              problem space from three angles: AI-driven, runtime
              DOM-based, and described-not-demoed. Each has its own
              scope and limits, and each is honest about both.
              Paradise &mdash; the source-level multi-model
              analyser &mdash; is intellectually the deepest work
              of this kind and lives at its own top-level entry.
              The three tools here are its companions.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
            aria-labelledby="tools-cards-heading"
          >
            <h2 id="tools-cards-heading" className="visually-hidden">
              The three companion tools
            </h2>

            <article
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <h2>
                <Link href="/carnforth">Carnforth GPL</Link>
              </h2>
              <p>
                A GPL-3.0 Chrome DevTools extension that tests
                pages for accessible-name conformance against WCAG
                4.1.2. Runtime testing against the rendered DOM,
                focused on one criterion in depth rather than a
                broad sweep. Demonstrated at a11yTO Accessibility
                Camp 2024.
              </p>
              <p>
                <small className="muted">
                  Bob-owned. Open source. The runtime counterpart
                  to Paradise&rsquo;s source-level analysis.
                </small>
              </p>
            </article>

            <article
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <h2>
                <Link href="/a11yauto">a11yAuto</Link>
              </h2>
              <p>
                Five proof-of-concept demonstrations of AI-driven
                accessibility testing applied to specific classes
                of issue commercial scanners cannot reach. Each
                demo lands with the verbatim Claude prompt, the
                captured response, and an honest discussion of
                what worked and what didn&rsquo;t. Language
                detection, headings, positioning, interactivity,
                modal dialogs.
              </p>
              <p>
                <small className="muted">
                  Bob-owned. Open source. Research-in-progress,
                  not a tool catalogue &mdash; the framing matters.
                </small>
              </p>
            </article>

            <article
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <h2>
                <Link href="/lived-testing">Lived-experience testing</Link>
              </h2>
              <p>
                Audio-and-video AI analysis of lived-experience
                tester recordings: a five-stage pipeline (FFmpeg
                splits / Deepgram transcription / pyannote speaker
                identification / Claude analysis with extended
                context) producing structured, WCAG-mapped reports
                with time-indexed callouts. The CNIB-owned
                production tool is described here; the home-version
                research line uses the open-weights Qwen 3.5 model
                as a values-significant alternative.
              </p>
              <p>
                <small className="muted">
                  CNIB-owned production tool; Bob-owned research
                  line in development. Described, not demoed.
                </small>
              </p>
            </article>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/paradise">Paradise</Link> &mdash;
                source-level multi-model accessibility analysis;
                intellectually the deepest of the testing work
                and its own top-level entry.
              </li>
              <li>
                <Link href="/playgrounds">Playgrounds</Link>{" "}
                &mdash; the interactive surfaces the tools
                feed into.
              </li>
              <li>
                <Link href="/paradise/lineage">
                  Paradise &mdash; lineage
                </Link>{" "}
                &mdash; the end-to-end tools lineage from the
                Carnforth Model (2010) through to today.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
