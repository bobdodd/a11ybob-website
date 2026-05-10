import Link from "next/link";
import type { CSSProperties } from "react";

export default function Now() {
  return (
    <main id="main" className="site-main" data-zone="self">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header>
            <h1>Now</h1>
            <p className="muted">
              <small>
                A <a href="https://nownownow.com/about">/now page</a>: what
                I&rsquo;m working on at this moment, updated quarterly.
                Last updated 2026-05-10.
              </small>
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What I&rsquo;m working on</h2>
            <p>
              Building this site. The architecture, design system,
              and tooling are in place. The most recent additions:
              the in-browser{" "}
              <Link href="/playground">Playground</Link> with the
              Paradise analyser engine plus a virtual screen reader,
              switch-access simulator, and session
              recorder/replayer; the in-browser{" "}
              <Link href="/research/action-language">
                Action Language playground
              </Link>{" "}
              with four worked examples running on a TypeScript port
              of the Carnforth engine; and a substantial new{" "}
              <Link href="/research/the-measure-of-accessibility">
                Measure of Accessibility
              </Link>{" "}
              collection bringing the formal-and-political theory
              from the doctoral framework into one coherent
              six-page surface. At CNIB, autoA11y development for
              the Revenue Quebec RFI continues in parallel.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What I&rsquo;m reading</h2>
            <p>
              Recent CHI proceedings on AI as cognitive scaffold for
              neurodivergent users. The 2025 W4A papers. Material on
              screen-magnifier ergonomics — the constraint that
              shaped the type-scale decision on this very site.
              Re-reading Wenger on communities of practice with the
              2029 framework in mind.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What I&rsquo;m thinking about</h2>
            <p>
              The 2029 framework. Accessibility as an equilibrium
              between agents in a community of practice — competition
              for resources <em>and</em> shared enterprise, not
              competition alone. The agentic-AI substrate now exists;
              the open question is what testable predictions the
              framework makes that practical work could falsify. Less
              &ldquo;build the theory&rdquo; than &ldquo;design the
              experiments.&rdquo; The community-of-practice page in
              the new collection is where the current thinking on
              this lives.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where I&rsquo;ve been recently</h2>
            <p>
              Plantagenet, Ontario. The site rebuild has been a
              working quarter at home, not a travelling one. I
              expect to return to conference circuits later in the
              year.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
