import Link from "next/link";
import type { CSSProperties } from "react";

export default function Playground() {
  return (
    <main id="main" className="site-main" data-zone="tools">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Playground</h1>
            <p style={{ fontSize: "var(--s1)" }}>
              An in-browser code editor that runs{" "}
              <Link href="/paradise">Paradise</Link>&rsquo;s analysers on
              your HTML, JavaScript, and CSS as you type.
            </p>
          </header>

          <div
            className="frame"
            style={
              {
                "--frame-n": "16",
                "--frame-d": "9",
                background: "var(--surface-2)",
                border: "var(--border-thin) solid var(--rule)",
              } as CSSProperties
            }
          >
            <p style={{ color: "var(--ink-muted)" }}>
              Editor will mount here.
            </p>
          </div>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it&rsquo;s for</h2>
            <p>
              Three things, in roughly this order. First, a way to feel the
              difference between source-level analysis and the
              rendered-DOM checking most accessibility tools do — paste a
              component, watch the analyser annotate the lines whose
              behaviour matters, follow each annotation back to the rule
              and the literature behind it. Second, a teaching surface for
              the patterns the Paradise analysers know about. Third, a
              demonstration that source-level analysis is fast enough to
              run on every keystroke, in a browser tab, with no server
              round-trip.
            </p>
          </section>

          <p style={{ color: "var(--ink-muted)" }}>
            <small>
              The Playground is the public face of the Paradise analysers.
              Its construction is its own piece of work and lands after
              the writing surface; this page is currently a placeholder.
            </small>
          </p>
        </div>
      </div>
    </main>
  );
}
