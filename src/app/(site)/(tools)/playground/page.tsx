import type { CSSProperties } from "react";

export default function Playground() {
  return (
    <main id="main" className="site-main" data-zone="tools">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header>
            <h1>Playground</h1>
            <p style={{ fontSize: "var(--s1)" }}>
              An in-browser code editor that analyses your HTML and component
              code for accessibility issues as you type.
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
              Editor will mount here. The Paradise analyser bundle is the
              engine; this is its public face.
            </p>
          </div>

          <p>
            <small>
              Building this is its own piece of work — the editor (CodeMirror
              6), the analyser bundle, and the accessible result-rendering
              UI. Coming after the writing surface lands.
            </small>
          </p>
        </div>
      </div>
    </main>
  );
}
