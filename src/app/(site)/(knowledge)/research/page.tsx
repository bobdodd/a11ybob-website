import type { CSSProperties } from "react";

export default function Research() {
  return (
    <main id="main" className="site-main" data-zone="knowledge">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s3)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Research</h1>
            <p style={{ fontSize: "var(--s1)" }}>
              Frameworks, papers, and the work-in-progress that will resume in
              2029.
            </p>
          </header>

          <section>
            <h2>The Carnforth Model of Accessible Adaptive Hypermedia</h2>
            <p>
              The framework that became the W4A 2010 paper. Developed during
              doctoral research at Teesside, 2004–2013. Two paragraphs of
              context: when, why, with whom, what has been built on it since.
            </p>
          </section>

          <section>
            <h2>Polymorphic Task Deconstruction</h2>
            <p>
              The decomposition pattern that the Paradise analysers operate
              over. What it is, the problem it solves, how it relates to
              shipping tooling.
            </p>
          </section>

          <section>
            <h2>Tetris as accessibility testbed</h2>
            <p>
              The most teachable framework — small, complete, and forces every
              modality into view. Should ideally have a small interactive
              demo here.
            </p>
          </section>

          <section>
            <h2>The 2029 framework</h2>
            <p>
              Accessibility as game-theoretic equilibrium. The framework was
              built in 2006; it needed agentic AI to test, and that arrived
              eighteen months ago. The plan is to take it back up in 2029.
              This page is the public roadmap.
            </p>
          </section>

          <p>
            <small>Placeholder text for layout and zonal-tinting purposes.</small>
          </p>
        </div>
      </div>
    </main>
  );
}
