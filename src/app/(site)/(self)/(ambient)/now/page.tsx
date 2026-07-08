import Link from "next/link";
import type { CSSProperties } from "react";

export default function Now() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header>
            <h1>Now</h1>
            <p className="muted">
              <small>
                A <a href="https://nownownow.com/about">/now page</a>: what
                I&rsquo;m working on at this moment, updated quarterly.
                Last updated 2026-05-11.
              </small>
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What I&rsquo;m working on</h2>
            <p>
              Building this site. The current pass brought the
              full tooling portfolio onto the site: the{" "}
              <Link href="/playgrounds/paradise">analyser Playground</Link>{" "}
              with the simulator suite (virtual screen reader,
              switch-access scanner, session recorder/replayer),
              the in-browser{" "}
              <Link href="/playgrounds/action-language">
                Action Language playground
              </Link>{" "}
              with four worked examples, the{" "}
              <Link href="/maps">accessible maps</Link>{" "}
              four-page section with the seven-year body of work
              and the polar-coordinate finding, the{" "}
              <Link href="/automated-testing">automated-testing</Link>{" "}
              AI-PoC demonstrations, the{" "}
              <Link href="/carnforth">Carnforth</Link>{" "}
              Chrome extension page, and the{" "}
              <Link href="/lived-user-testing">
                lived-user-testing
              </Link>{" "}
              page describing both the production Dictaphone tool
              and the Bob-owned vision-AI companion line. The{" "}
              <Link href="/research/the-measure-of-accessibility">
                Measure of Accessibility
              </Link>{" "}
              six-page collection landed earlier in the quarter
              and reads end-to-end now. At CNIB Access Labs,
              autoA11y development for the Revenue Quebec RFI
              continues; the next-version work integrates pdfMax
              into the audit pipeline.
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
              Two things layered. First, the 2029 framework:
              accessibility as an equilibrium between agents in a
              community of practice &mdash; competition for
              resources <em>and</em>{" "}shared enterprise, not
              competition alone. The agentic-AI substrate now
              exists; the open question is what testable
              predictions the framework makes that practical work
              could falsify. Less &ldquo;build the theory&rdquo;
              than &ldquo;design the experiments.&rdquo;
            </p>
            <p>
              Second, writing up the polar-coordinate finding from
              the maps work. Spatial cognition under modality
              conversion: the maps work has been demonstrating
              the claim verbally for seven years and has never
              been written up as a paper. Working title:{" "}
              <em>
                Maps need CISNA: applying capability modelling
                and multi-agent communities of practice to
                accessible cartography
              </em>
              . Same intellectual lineage as the 2029 framework;
              concrete worked-example shape. The runway through
              2029 should include this.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where I&rsquo;ve been recently</h2>
            <p>
              Buckhorn, Ontario. The site rebuild has been a
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
