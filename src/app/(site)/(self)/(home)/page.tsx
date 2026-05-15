import Link from "next/link";
import type { CSSProperties } from "react";

export default function Home() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s4)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h1>
              Systems that respond intelligently to context, and the humans
              within them.
            </h1>
            <p className="lede muted">
              Forty years building them. Twenty in digital accessibility.
            </p>
            <p>
              Bob Dodd. Currently Head of Accessibility at CNIB Access Labs in
              Toronto. Author of long-form synthesis articles drawing on{" "}
              <Link href="/writing">2,661 reviewed accessibility papers</Link>.
              Author of the{" "}
              <Link href="/research/cisna-model">
                CISNA Model of Accessible Adaptive Hypermedia
              </Link>
              . Designer of <Link href="/paradise">Paradise</Link>, a
              multi-model accessibility analyser that reasons about
              JavaScript runtime behaviour at the source level.
            </p>
          </header>

          <nav
            aria-label="Four doors"
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
              <p>
                Long-form essays grounded in the published research, with
                citations back to the underlying evidence.
              </p>
            </Link>
            <Link href="/research" className="door">
              <h2>Read the research</h2>
              <p>
                Formal frameworks, the CISNA Model, and the Measure of
                Accessibility — the theory beneath the writing.
              </p>
            </Link>
            <Link href="/paradise" className="door">
              <h2>See the tools</h2>
              <p>
                Paradise — a multi-model accessibility analyser, in working
                code on GitHub.
              </p>
            </Link>
            <Link href="/about" className="door">
              <h2>Understand the arc</h2>
              <p>
                Forty years of systems thinking, told through the artefacts
                that anchored each era.
              </p>
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
