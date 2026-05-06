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
            <h2>Search-result highlighting carries through to the article</h2>
            <p>
              When you click a result on{" "}
              <a href="/writing">/writing</a>, the matched terms are
              highlighted (using the semantic <code>&lt;mark&gt;</code>{" "}
              element) wherever they appear in the article body. The
              highlights aren&rsquo;t a naive client-side substring match
              against the URL query — they&rsquo;re computed by re-querying
              the search index for the specific article with that query
              and reading back the analyser-faithful matches. So what was
              marked in the result snippet is exactly what&rsquo;s marked
              in the body, including stem matches and other things the
              English analyser handles.
            </p>
            <p>
              This deliberately removes ambiguity between the search
              result and the article body. For readers using screen
              magnifiers — who can only see a small portion of the page
              at any time — and for readers whose attention budget is
              constrained for any other reason, that ambiguity is a real
              cognitive load. The cost (one extra search request per
              article view, only when arriving from search) is trivial in
              comparison.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why every search result carries a match-strength badge</h2>
            <p>
              Each search result on this site shows a small pill labelled
              <em> Exact phrase</em>, <em> All terms</em>, or
              <em> Some terms</em>. Three tiers, in descending strength
              of match.
            </p>
            <p>
              The reason isn&rsquo;t decoration. Highlighted terms in the
              title and snippet are useful to sighted readers, but a blind
              screen-reader user hears the result-card content read aloud
              with no indication that anything is highlighted, and a
              low-vision user using a screen magnifier may only see one
              or two words at a time and never catch sight of the
              highlights at all. Without something more, those users have
              no way to tell <em>why</em> a particular result was returned
              — whether the engine matched the exact phrase they typed,
              or just one word of it.
            </p>
            <p>
              The badge encodes that information as a short label that
              every assistive technology can convey straightforwardly:
              read aloud verbatim by a screen reader, magnified together
              with the title, rendered as plain text by a refreshable
              braille display. It&rsquo;s the same information the
              highlights carry, made independent of vision.
            </p>
            <p>
              The badge is suppressed for single-term queries, where the
              three tiers all match the same documents and the
              distinction would carry no information.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>No placeholder text — hints sit beneath inputs</h2>
            <p>
              You won&rsquo;t see grey placeholder text inside any
              input on this site. Where a field needs guidance, the
              hint is rendered as a visible{" "}
              <code>&lt;small&gt;</code> beneath the input and
              associated via <code>aria-describedby</code> so screen
              readers announce it together with the field.
            </p>
            <p>
              The site targets WCAG 2.2 AAA, which requires 7:1
              contrast for body text. Browser-default placeholder
              colour doesn&rsquo;t reach that — it&rsquo;s
              deliberately muted to signal &ldquo;not real
              content&rdquo;, which is exactly the legibility
              compromise AAA exists to forbid. Placeholder text also
              vanishes the moment the user starts typing, removing
              context they may need to re-read; for screen-magnifier
              users, who navigate by zooming and panning, that
              vanish-on-type behaviour is particularly disorienting.
            </p>
            <p>
              The cost of putting hints below the input is one
              extra line of small text. The benefit is that the
              guidance stays present, stays legible at AAA, and
              doesn&rsquo;t conflict with the field&rsquo;s value.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Type-ahead suggestions across every corpus</h2>
            <p>
              The search box offers type-ahead suggestions after two
              characters, drawn from article and review titles and
              from glossary terms (including aliases — typing
              <em> Music Braille</em> finds the entry whose canonical
              term is <em>Braille Music</em>). Suggestions are
              grouped by corpus and selecting one quick-jumps to the
              resource. Pressing Enter without picking a suggestion
              runs the regular search.
            </p>
            <p>
              The combobox follows the WAI-ARIA 1.2 combobox pattern:
              the input has{" "}
              <code>role=&ldquo;combobox&rdquo;</code>, the dropdown
              has <code>role=&ldquo;listbox&rdquo;</code>, each
              suggestion is a <code>role=&ldquo;option&rdquo;</code>,
              and arrow keys / Enter / Escape work as expected.
              Without JavaScript the form still submits to the
              server-rendered results page exactly as it always has —
              suggestions are a strict progressive enhancement.
            </p>
            <p>
              Backed by OpenSearch&rsquo;s completion suggester, an
              FST-backed prefix matcher; suggestions return in a few
              milliseconds. Browser autofill of previously-submitted
              queries is also on (see below) and complementary —
              browser autofill suggests <em>what you typed last
              time</em>, the completion suggester suggests <em>what
              the corpus contains</em>.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Autocomplete is on for every input</h2>
            <p>
              Every text input on the site has the browser&rsquo;s
              autocomplete behaviour turned on. The only exception is
              passwords (none on the site at the moment, but the rule
              holds): those use the password-specific autocomplete
              tokens so password managers can fill them, but they
              don&rsquo;t accumulate plaintext history.
            </p>
            <p>
              Text entry is one of the highest-cost activities on the
              web for many disabled users. A blind user on an
              explore-by-touch mobile keyboard, a switch-access user
              hunting through an on-screen grid, an eye-gaze user
              dwelling on each letter — for any of them, every
              keystroke saved is a real reduction in fatigue. The
              default for input elements should bias hard towards
              fewer keystrokes; turning autocomplete off should
              require a specific reason that outweighs that cost.
            </p>
            <p>
              The default for HTML inputs is{" "}
              <code>autocomplete=&ldquo;on&rdquo;</code>. We were
              setting <code>autocomplete=&ldquo;off&rdquo;</code> on
              the search box without thinking. That&rsquo;s the
              kind of well-meaning default that quietly punishes the
              users a site like this is built for.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Filters live with the results, not in a sidebar</h2>
            <p>
              Search-result filters appear at the top of the result
              column, not in a left sidebar. The currently-applied
              filters render as removable chips that are always
              visible; the rest of the filter options live behind a
              disclosure widget that&rsquo;s closed by default.
            </p>
            <p>
              The sidebar pattern looks tidy on a wide screen, but it
              fails the users this site is built for. A
              screen-magnifier user zoomed into the result column
              never sees a sidebar to its left — the filters are
              effectively invisible to them. A screen-reader user
              hits the sidebar before the results in DOM order, with
              no way to skip past it. On a narrow viewport the
              sidebar collapses on top of the results, pushing the
              actual content below the fold whether the user is
              filtering or not.
            </p>
            <p>
              Putting filters at the top of the column they affect
              fixes all three: magnifier users see them in the same
              field of view as the results; screen-reader users
              encounter them in a sensible reading order;
              narrow-viewport users see filters and results in their
              actual priority order without a layout shift.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Pagination at top and bottom of every result list</h2>
            <p>
              Result lists carry pagination controls both above and
              below the list, not only below. The two instances are
              identical in function and labelled distinctly
              (<em>Pagination, top of results</em> and{" "}
              <em>Pagination, bottom of results</em>) so a screen
              reader&rsquo;s landmark navigation can target either.
            </p>
            <p>
              Pagination only at the bottom assumes the reader wants
              to read every result before moving on. For a
              screen-reader user, that means tabbing through every
              result&rsquo;s heading and metadata to reach the
              page-2 link. For a screen-magnifier user, it means
              scrolling the visible window through tens of result
              cards to find the same control. Both costs are real
              and avoidable. A duplicate set of controls at the top
              of the list lets either user move between pages from
              the position they&rsquo;re already in.
            </p>
            <p>
              When there&rsquo;s only one page of results the top
              instance is suppressed, since the live region above
              already announces the count and a second &ldquo;N
              results&rdquo; line would be noise.
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
