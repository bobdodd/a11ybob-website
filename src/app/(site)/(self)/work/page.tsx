import type { CSSProperties } from "react";

export default function Work() {
  return (
    <main id="main" className="site-main" data-zone="self">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header>
            <h1>Work</h1>
          </header>

          <section>
            <h2>What I&rsquo;m available for</h2>
            <p>
              Audit and remediation engagements. Accessibility strategy and
              review. Expert testimony and procurement support. Training and
              workshops. Advisory and board roles.
            </p>
          </section>

          <section>
            <h2>Who I&rsquo;ve worked with</h2>
            <p>
              George Brown College. Centennial College. The Co-operators.
              Brookfield Properties. CNIB. CELA. Practice, not portfolio.
            </p>
          </section>

          <section>
            <h2>How to engage</h2>
            <p>
              Email me. Tell me what you&rsquo;re working on and what
              you&rsquo;ve already tried. <a href="/contact">Contact</a>.
            </p>
          </section>

          <p style={{ color: "var(--ink-muted)" }}>
            <small>
              Available for select advisory work alongside my CNIB role;
              broader independent practice opens in 2029.
            </small>
          </p>
        </div>
      </div>
    </main>
  );
}
