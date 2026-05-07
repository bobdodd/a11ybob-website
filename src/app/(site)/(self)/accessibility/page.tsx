import Link from "next/link";
import type { CSSProperties } from "react";

export default function Accessibility() {
  return (
    <main id="main" className="site-main" data-zone="self">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Accessibility statement</h1>
            <p className="muted">
              <small>Last reviewed: 2026-05-05.</small>
            </p>
          </header>

          <p className="lede">
            This site is itself an accessibility artefact. The standards
            below are the floor, not the ceiling — the goal is for the
            site&rsquo;s own implementation to demonstrate the practices
            the writing argues for.
          </p>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Conformance target</h2>
            <p>
              <strong>WCAG 2.2 Level AAA</strong> wherever achievable;
              Level AA as the minimum for any surface where AAA is
              genuinely impractical. Where a specific surface falls short,
              the limitation is noted below.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What this site does</h2>
            <ul>
              <li>
                <strong>AAA colour contrast.</strong> All body text meets
                7:1 against its background; all large text meets 4.5:1;
                non-text contrast meets 3:1. Verified perceptually via
                OKLCH lightness pairings; values to be re-verified with a
                contrast checker as the design evolves.
              </li>
              <li>
                <strong>Focus appearance meeting WCAG 2.2 SC 2.4.11.</strong>{" "}
                A solid 2px outline at the accent colour, offset 3px from
                the element edge, with a halo box-shadow underneath in the
                surface colour. The dual-tone treatment ensures the focus
                ring is distinguishable against any background — including
                images — and is never confused with a border.
              </li>
              <li>
                <strong>Type scale capped at 3:1.</strong> The largest and
                smallest text on any page differ by no more than 3:1 in
                size, so screen-magnifier users do not have to adjust zoom
                level when moving between headings and body text.
              </li>
              <li>
                <strong>Honours every <code>prefers-*</code> media query.</strong>{" "}
                <code>prefers-color-scheme</code> (light/dark),{" "}
                <code>prefers-contrast</code> (more, less),{" "}
                <code>prefers-reduced-motion</code>, and{" "}
                <code>prefers-reduced-data</code>. No user toggle is
                provided; the site respects what your browser and operating
                system already say.
              </li>
              <li>
                <strong>Native HTML first; ARIA only where native genuinely fails.</strong>{" "}
                Real <code>&lt;button&gt;</code>, real{" "}
                <code>&lt;dialog&gt;</code>, real{" "}
                <code>&lt;details&gt;</code>. Custom interaction patterns
                (combobox, focus management, live regions) appear only on
                the surfaces that demand them.
              </li>
              <li>
                <strong>Skip link on every page.</strong> The first focusable
                element on every page is &ldquo;Skip to main
                content&rdquo;.
              </li>
              <li>
                <strong>Semantic landmarks.</strong>{" "}
                <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>,{" "}
                <code>&lt;main&gt;</code>, <code>&lt;footer&gt;</code> on
                every page; navigation regions labelled with{" "}
                <code>aria-label</code>.
              </li>
              <li>
                <strong>Logical properties throughout.</strong>{" "}
                <code>inline-size</code> and <code>block-size</code>,{" "}
                <code>margin-block</code> and <code>padding-inline</code>,
                throughout the stylesheet. The site is structurally ready
                for languages with right-to-left or vertical writing
                directions.
              </li>
              <li>
                <strong>Reading-optimised typography.</strong> Body text
                set in Atkinson Hyperlegible at 19–20px (responsive to
                viewport) with line-height 1.5 and a measure capped at 60
                characters via the universal CSS axiom.
              </li>
              <li>
                <strong>Progressive enhancement where possible.</strong>{" "}
                Site content renders server-side and works without
                JavaScript; client-side interactivity is layered on top
                only where it provides genuine benefit (search, the
                Playground).
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Compatibility</h2>
            <p>
              The site is tested for compatibility with current versions of
              the major browsers (Safari, Chrome, Firefox, Edge), with
              VoiceOver on macOS and iOS, NVDA and JAWS on Windows, and
              TalkBack on Android. Browser zoom up to 400% has been
              checked; the layout reflows without horizontal scroll.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Known limitations</h2>
            <ul>
              <li>
                The <Link href="/playground">Playground</Link> is not yet
                built. When it ships, the in-browser editor will have its
                own accessibility behaviour to document — keyboard
                interaction, screen-reader announcement of analyser
                findings, focus management between editor and results.
              </li>
              <li>
                The <Link href="/writing">writing archive</Link> currently
                lists 16 articles, but the underlying review database of
                2,661 papers is not yet wired up to a public browsing
                surface. Search across writing/reviews/glossary will be
                added in a subsequent release.
              </li>
              <li>
                A small number of long-form drafts contain inconsistencies
                from being early synthesis attempts on a smaller research
                corpus. These are being revised.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Feedback</h2>
            <p>
              If you encounter an accessibility barrier on this site, or
              an inconsistency between this statement and what the site
              actually does, please get in touch.
            </p>
            <ul>
              <li>
                <Link href="/contact">Email</Link> — fastest for narrative
                feedback or anything that needs a considered reply.
              </li>
              <li>
                <a href="https://github.com/bobdodd/a11ybob-website/issues">
                  GitHub Issues
                </a>{" "}
                — best for specific defects with reproduction steps.
              </li>
            </ul>
            <p>
              Reports are read; most receive a reply.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>How this site is built</h2>
            <p>
              The full set of design and implementation decisions is
              documented on the <Link href="/colophon">colophon page</Link>,
              with each decision-log entry linked to its source on GitHub.
              The site source is{" "}
              <a href="https://github.com/bobdodd/a11ybob-website">
                public on GitHub
              </a>{" "}
              under the GNU GPL v3.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
