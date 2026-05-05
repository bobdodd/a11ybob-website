import type { CSSProperties } from "react";

export default function Now() {
  return (
    <main id="main" className="site-main" data-zone="self">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header>
            <h1>Now</h1>
            <p style={{ color: "var(--ink-muted)" }}>
              <small>
                A <a href="https://nownownow.com/about">/now page</a> — what
                I&rsquo;m working on at this moment, updated quarterly.
                Last updated 2026-05-05.
              </small>
            </p>
          </header>

          <section>
            <h2>What I&rsquo;m working on</h2>
            <p>
              Building the new a11ybob.com. The site you&rsquo;re reading is
              currently a scaffold; the writing migrates next.
            </p>
          </section>

          <section>
            <h2>What I&rsquo;m reading</h2>
            <p>
              Recent CHI papers on AI as cognitive scaffold. The 2025 W4A
              proceedings. Something on screen-magnifier ergonomics that
              influenced the type-scale decision on this very site.
            </p>
          </section>

          <section>
            <h2>What I&rsquo;m thinking about</h2>
            <p>
              The 2029 framework — accessibility as game-theoretic
              equilibrium. The agentic-AI substrate now exists. The question
              is what testable predictions the framework makes.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
