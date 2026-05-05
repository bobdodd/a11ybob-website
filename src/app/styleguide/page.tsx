import type { CSSProperties } from "react";

const scale = [
  ["--s-2", "0.694rem", "small UI / meta"],
  ["--s-1", "0.833rem", "captions, footnotes"],
  ["--s0", "1rem", "body"],
  ["--s1", "1.2rem", "h4–h6, lede"],
  ["--s2", "1.44rem", "h3"],
  ["--s3", "1.728rem", "h2"],
  ["--s4", "2.074rem", "h1"],
  ["--s5", "2.488rem", "layout spacing only"],
  ["--s6", "2.986rem", "layout spacing only"],
] as const;

const zones = [
  ["self", "warm cream — home, about, now, contact"],
  ["writing", "warm rose — articles, talks"],
  ["knowledge", "cool blue — reading database, glossary, research"],
  ["tools", "technical neutral — paradise, playground"],
] as const;

function ZonePreview({ zone, label }: { zone: string; label: string }) {
  return (
    <section data-zone={zone} className="box" style={{ padding: "var(--s1)" }}>
      <div className="stack" style={{ "--space": "var(--s-1)" } as CSSProperties}>
        <h3 style={{ marginBlock: 0 }}>Zone: {zone}</h3>
        <p style={{ marginBlock: 0 }}>{label}</p>
        <p style={{ marginBlock: 0, color: "var(--ink-muted)" }}>
          Muted secondary text on this zone&rsquo;s surface.
        </p>
        <p style={{ marginBlock: 0 }}>
          A <a href="#">link in this zone</a> sits on the same surface.
        </p>
      </div>
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <main id="main" className="center" style={{ padding: "var(--s2)", maxInlineSize: "min(80ch, 100%)" }}>
      <div className="stack" style={{ "--space": "var(--s3)" } as CSSProperties}>
        <header className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
          <h1>Styleguide</h1>
          <p>
            Every token, primitive, and state used by the site. This page is
            the working artifact the design is checked against; not a
            destination route in the production sense.
          </p>
        </header>

        {/* ===== Type scale ===== */}
        <section className="stack">
          <h2>Type scale (ratio 1.2)</h2>
          <p>
            Six sizes used for type (<code>--s-1</code> through{" "}
            <code>--s4</code>). Largest-to-smallest ratio: 2.49, comfortably
            under the 3:1 cap chosen for screen-magnifier accessibility.
          </p>
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Computed</th>
                <th>Used for</th>
                <th>Sample</th>
              </tr>
            </thead>
            <tbody>
              {scale.map(([token, value, use]) => (
                <tr key={token}>
                  <td>
                    <code>{token}</code>
                  </td>
                  <td>
                    <code>{value}</code>
                  </td>
                  <td>{use}</td>
                  <td style={{ fontSize: `var(${token})` }}>The quick brown fox</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ===== Heading hierarchy ===== */}
        <section className="stack">
          <h2>Heading hierarchy</h2>
          <h1>Heading level 1 — page title</h1>
          <h2>Heading level 2 — major section</h2>
          <h3>Heading level 3 — subsection</h3>
          <h4>Heading level 4 — sub-subsection</h4>
          <h5>Heading level 5 — same size, lighter weight</h5>
          <h6>Heading level 6 — same size, italic</h6>
          <p>
            <small>
              Caption / footnote text uses <code>--s-1</code>.
            </small>
          </p>
        </section>

        {/* ===== Body prose ===== */}
        <section className="stack">
          <h2>Body prose</h2>
          <p>
            Standard paragraph text in Atkinson Hyperlegible at the body size.
            The line length is capped at the measure (60ch) by the universal
            axiom in <code>axioms.css</code>, so paragraphs never exceed a
            comfortable scanning distance regardless of the container they sit
            in. <em>Italic emphasis</em> and <strong>bold emphasis</strong>{" "}
            are typographic, not chromatic.
          </p>
          <p>
            A second paragraph follows with normal{" "}
            <a href="#">link affordance</a> &mdash; underlined, distinct
            colour, thickening on hover and focus &mdash; so colour is never
            the only signal. <code>Inline code</code> uses the system
            monospace stack.
          </p>
          <blockquote>
            &ldquo;None of this is unique to music. It is just easier to see
            in a place where the wanting is obvious.&rdquo;
          </blockquote>
        </section>

        {/* ===== Zonal surfaces ===== */}
        <section className="stack">
          <h2>Zonal tinting</h2>
          <p>
            Each content zone has a subtly tinted surface. All four sit at
            perceptually identical OKLCH lightness so body-text contrast is
            preserved across every zone (AAA, 7:1 minimum).
          </p>
          <div
            className="grid"
            style={{ "--minimum": "16rem", "--space": "var(--s0)" } as CSSProperties}
          >
            {zones.map(([zone, label]) => (
              <ZonePreview key={zone} zone={zone} label={label} />
            ))}
          </div>
        </section>

        {/* ===== Focus indicator ===== */}
        <section className="stack">
          <h2>Focus indicator</h2>
          <p>
            Solid outline at the focus colour, offset 3px from the element
            edge with a halo box-shadow underneath. Tab into the controls
            below to see the ring &mdash; it stays distinct against any
            adjacent colour or image.
          </p>
          <div className="cluster" style={{ "--space": "var(--s1)" } as CSSProperties}>
            <button type="button">Focus me</button>
            <a href="#">…or me</a>
            <input type="text" placeholder="…or me" aria-label="Sample text input" />
          </div>
          <p>
            <small>
              The ring uses <code>:focus-visible</code>, so mouse clicks on
              buttons don&rsquo;t draw it &mdash; only keyboard focus does.
            </small>
          </p>
        </section>

        {/* ===== Layout primitives ===== */}
        <section className="stack">
          <h2>Layout primitives (Every Layout)</h2>
          <p>
            Class-based implementations of the twelve primitives from{" "}
            <a href="https://every-layout.dev">Every Layout</a> by Heydon
            Pickering and Andy Bell. Compose, do not invent.
          </p>

          <h3>Stack</h3>
          <div className="box">
            <div className="stack">
              <div>One</div>
              <div>Two</div>
              <div>Three</div>
            </div>
          </div>

          <h3>Cluster</h3>
          <div className="box">
            <div className="cluster">
              <span className="box" style={{ padding: "var(--s-1) var(--s0)" }}>
                tag
              </span>
              <span className="box" style={{ padding: "var(--s-1) var(--s0)" }}>
                another tag
              </span>
              <span className="box" style={{ padding: "var(--s-1) var(--s0)" }}>
                a longer tag
              </span>
              <span className="box" style={{ padding: "var(--s-1) var(--s0)" }}>
                short
              </span>
            </div>
          </div>

          <h3>Sidebar</h3>
          <div
            className="with-sidebar"
            style={{ "--side-width": "12rem" } as CSSProperties}
          >
            <div className="sidebar box">Sidebar (12rem)</div>
            <div className="not-sidebar box">
              Main content. The two stack vertically when the container falls
              below ~24rem.
            </div>
          </div>

          <h3>Switcher</h3>
          <div
            className="switcher"
            style={{ "--threshold": "30rem" } as CSSProperties}
          >
            <div className="box">A</div>
            <div className="box">B</div>
            <div className="box">C</div>
          </div>

          <h3>Grid</h3>
          <div
            className="grid"
            style={{ "--minimum": "10rem", "--space": "var(--s0)" } as CSSProperties}
          >
            <div className="box">Cell 1</div>
            <div className="box">Cell 2</div>
            <div className="box">Cell 3</div>
            <div className="box">Cell 4</div>
            <div className="box">Cell 5</div>
            <div className="box">Cell 6</div>
          </div>

          <h3>Frame (16:9)</h3>
          <div
            className="frame"
            style={{
              border: "var(--border-thin) solid var(--rule)",
              background: "var(--surface-2)",
            }}
          >
            <span style={{ color: "var(--ink-muted)" }}>16:9 aspect ratio</span>
          </div>
        </section>

        {/* ===== Preferences honoured ===== */}
        <section className="stack">
          <h2>User preferences honoured</h2>
          <ul>
            <li>
              <code>prefers-color-scheme: dark</code> — surface and ink
              tokens swap; AAA contrast preserved.
            </li>
            <li>
              <code>prefers-contrast: more</code> — palette collapses to
              pure black and white.
            </li>
            <li>
              <code>prefers-reduced-motion: reduce</code> — all animations
              and transitions clamped to 0.01ms; smooth scroll disabled.
            </li>
            <li>
              <code>prefers-reduced-data: reduce</code> — currently a hook
              only; richer assets will defer to it as they're added.
            </li>
          </ul>
          <p>
            Toggle each preference in your OS or browser to see the effect
            live.
          </p>
        </section>
      </div>
    </main>
  );
}
