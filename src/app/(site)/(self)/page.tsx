import Link from "next/link";
import type { CSSProperties } from "react";

export default function Home() {
  return (
    <main id="main" className="site-main" data-zone="self">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s4)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h1>
              Systems that respond intelligently to context and the humans
              within them.
            </h1>
            <p style={{ fontSize: "var(--s1)", color: "var(--ink-muted)" }}>
              Forty years building them, twenty-five focused on accessibility.
            </p>
            <p>
              Currently leading accessibility at CNIB Access Labs. Author of
              long-form synthesis articles drawing on 2,661 reviewed papers.
              Designer of Paradise, a multi-model accessibility analyser.
            </p>
          </header>

          <nav
            aria-label="Three doors"
            className="grid"
            style={
              {
                "--minimum": "16rem",
                "--space": "var(--s1)",
              } as CSSProperties
            }
          >
            <Link href="/writing" className="door">
              <h2>Read the writing</h2>
              <p>Long-form essays grounded in the literature.</p>
            </Link>
            <Link href="/paradise" className="door">
              <h2>See the tools</h2>
              <p>
                Paradise — a multi-model accessibility analyser, in working
                code.
              </p>
            </Link>
            <Link href="/about" className="door">
              <h2>Understand the arc</h2>
              <p>Forty years of systems thinking, told in artefacts.</p>
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
