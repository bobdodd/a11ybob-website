import Link from "next/link";
import type { CSSProperties } from "react";

const decisions = [
  {
    id: "0001",
    file: "0001-stack.md",
    title: "Initial stack",
    summary:
      "Next.js 16 (App Router) on Node 20, TypeScript, npm. MongoDB for content, OpenSearch (Apache Lucene) for search. Vanilla CSS in @layer groups — no preprocessor, no Tailwind, no CSS Modules.",
  },
  {
    id: "0002",
    file: "0002-opensearch-mappings.md",
    title: "OpenSearch index design",
    summary:
      "Three indexes (reviews, glossary, articles) with a custom English analyzer, multi-field text/keyword mappings, drop-and-recreate semantics. Glossary-derived synonym expansion deferred until the search UI exists.",
  },
  {
    id: "0003",
    file: "0003-articles-schema-and-versioning.md",
    title: "Articles schema and versioning",
    summary:
      "Two collections: articles (with a status field for draft/published) and article_versions linked by articleId. Title and summary snapshotted on both for cheap rendering. Domains as an array — accessibility crosses ontologies.",
  },
  {
    id: "0004",
    file: "0004-design-system-principles.md",
    title: "Design system principles",
    summary:
      "Seven principles: AAA contrast as the floor, typography as the primary UI, all prefers-* honoured, focus appearance meeting WCAG 2.4.11, native HTML first, rich JS done accessibly with progressive enhancement, reading mode for long-form articles. Layout foundation: Every Layout by Heydon Pickering and Andy Bell.",
  },
  {
    id: "0005",
    file: "0005-zonal-tinting.md",
    title: "Zonal surface tinting",
    summary:
      "Subtle BridgePoint-style tinting by content category. Four zones (self, writing, knowledge, tools) implemented as Next.js route groups, each rendering a SiteShell wrapper that paints the zone's tint across header, main, and footer.",
  },
  {
    id: "0006",
    file: "0006-type-scale-3to1.md",
    title: "Type scale capped at 3:1",
    summary:
      "Modular scale with ratio 1.2 (minor third) chosen so that the largest and smallest text on any page differ by no more than 3:1 — ensuring screen-magnifier users do not have to adjust zoom when moving between headings and body text.",
  },
];

export default function Colophon() {
  return (
    <main id="main" className="site-main" data-zone="self">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s3)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Colophon</h1>
            <p style={{ fontSize: "var(--s1)" }}>
              How this site was built and why. The site itself is a
              portfolio piece; every meaningful decision is documented in
              writing so that it can be examined.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Stack</h2>
            <ul>
              <li>
                <strong>Framework:</strong>{" "}
                <a href="https://nextjs.org">Next.js 16</a> (App Router) on
                Node 20.
              </li>
              <li>
                <strong>Language:</strong> TypeScript.
              </li>
              <li>
                <strong>Database:</strong> MongoDB. Locally via Homebrew;
                production on{" "}
                <a href="https://www.ovhcloud.com">OVHcloud&rsquo;s</a>{" "}
                managed MongoDB at Gravelines.
              </li>
              <li>
                <strong>Search:</strong>{" "}
                <a href="https://opensearch.org">OpenSearch</a> (Apache
                Lucene 9.x). Self-hosted, no SaaS dependency.
              </li>
              <li>
                <strong>Styling:</strong> Vanilla CSS organised in{" "}
                <code>@layer</code> groups (tokens, axioms, base, layouts,
                components, utilities). No preprocessor, no Tailwind, no
                CSS Modules. Design tokens as CSS custom properties.
              </li>
              <li>
                <strong>Hosting:</strong> OVHcloud VPS at the Gravelines
                data centre (planned). All data resident in EU
                jurisdiction.
              </li>
              <li>
                <strong>Local services:</strong> Homebrew (
                <code>brew services</code>). No Docker.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Layout</h2>
            <p>
              The layout system is{" "}
              <a href="https://every-layout.dev">Every Layout</a> by Heydon
              Pickering and Andy Bell. Twelve composable primitives —
              Stack, Box, Center, Cluster, Sidebar, Switcher, Cover, Grid,
              Frame, Reel, Imposter, Icon, Container — implemented as
              class-based CSS in{" "}
              <a href="https://github.com/bobdodd/a11ybob-website/tree/main/src/styles/layouts">
                <code>src/styles/layouts/</code>
              </a>
              .
            </p>
            <p>
              Heydon&rsquo;s and Andy&rsquo;s thinking is the foundation
              for the &ldquo;intrinsic&rdquo; properties of the site:
              responsiveness without breakpoints, content-derived sizing,
              logical properties throughout.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Typography</h2>
            <ul>
              <li>
                <strong>Body:</strong>{" "}
                <a href="https://www.brailleinstitute.org/freefont/">
                  Atkinson Hyperlegible
                </a>{" "}
                — designed by the Braille Institute specifically for
                legibility under low-vision conditions. The on-brand
                choice for an accessibility-positioned site.
              </li>
              <li>
                <strong>Headings:</strong>{" "}
                <a href="https://fonts.google.com/specimen/Source+Serif+4">
                  Source Serif 4
                </a>{" "}
                — designed by Frank Grießhammer at Adobe, variable weight,
                SIL Open Font Licence. The serif/sans contrast is itself a
                non-chromatic signal that &ldquo;this is structure, not
                body.&rdquo;
              </li>
              <li>
                <strong>Code:</strong> system monospace stack (
                <code>ui-monospace</code>, <code>SFMono-Regular</code>,{" "}
                <code>Menlo</code>, <code>Consolas</code>). Zero payload;
                every operating system already has a good monospace face.
              </li>
            </ul>
            <p>
              The type scale uses a ratio of 1.2 (minor third), chosen so
              that the largest and smallest text on any page differ by no
              more than 3:1. Screen-magnifier users do not have to adjust
              zoom level when moving between headings and body text.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Colour</h2>
            <p>
              All colour values are expressed in{" "}
              <a href="https://oklch.com">OKLCH</a> — a perceptually
              uniform colour space. Surface tints across the four content
              zones sit at perceptually identical lightness, so body-text
              contrast (AAA, 7:1 minimum) is preserved across every zone
              regardless of hue. The zonal tinting pattern is borrowed
              from BridgePoint, the Shlaer-Mellor xtUML modelling tool
              that tinted different diagram types so the user&rsquo;s
              &ldquo;where am I&rdquo; question was answered without
              chrome.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Decision log</h2>
            <p>
              Each load-bearing decision has its own document under{" "}
              <code>docs/decisions/</code> in the repository. Summaries
              follow; click through for the full rationale.
            </p>
            <ul
              className="stack"
              style={{
                "--space": "var(--s1)",
                listStyle: "none",
                paddingInlineStart: 0,
              } as CSSProperties}
            >
              {decisions.map((d) => (
                <li key={d.id}>
                  <a
                    href={`https://github.com/bobdodd/a11ybob-website/blob/main/docs/decisions/${d.file}`}
                  >
                    <strong>
                      {d.id} — {d.title}
                    </strong>
                  </a>
                  <p style={{ marginBlockStart: "var(--s-1)" }}>{d.summary}</p>
                </li>
              ))}
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Source and licence</h2>
            <p>
              The full source is at{" "}
              <a href="https://github.com/bobdodd/a11ybob-website">
                github.com/bobdodd/a11ybob-website
              </a>
              , released under the{" "}
              <a href="https://www.gnu.org/licenses/gpl-3.0.html">
                GNU GPL v3
              </a>
              . Issues and pull requests welcome.
            </p>
            <p>
              The writing on this site is licensed under{" "}
              <a href="https://creativecommons.org/licenses/by-sa/4.0/">
                Creative Commons BY-SA 4.0
              </a>
              . Citation and reuse are welcome; please credit and link
              back.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Acknowledgements</h2>
            <p>
              Heydon Pickering and Andy Bell, for{" "}
              <a href="https://every-layout.dev">Every Layout</a>, which
              made the layout decisions of this site mostly settled before
              they had to be made. The Braille Institute, for releasing
              Atkinson Hyperlegible. Adobe and Frank Grießhammer, for
              releasing Source Serif 4. The W3C Accessibility Guidelines
              Working Group and the WAI for the standards the site is
              built against.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
