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
      "Subtle BridgePoint-style tinting per main-nav landing page. Ten zones, each at perceptually-identical OKLCH lightness so body-text contrast holds across every hue. Sub-pages inherit their landing's zone via a section layout. Initial four-zone version (2026-05-05) collapsed multiple landings into one colour; amended to eleven (2026-05-15) so each main-nav surface reads as its own; the Talks zone was temporarily withdrawn 2026-05-16 alongside its page.",
  },
  {
    id: "0006",
    file: "0006-type-scale-3to1.md",
    title: "Type scale capped at 3:1",
    summary:
      "Modular scale with ratio 1.2 (minor third) chosen so that the largest and smallest text on any page differ by no more than 3:1 — ensuring screen-magnifier users do not have to adjust zoom when moving between headings and body text.",
  },
  {
    id: "0007",
    file: "0007-tiered-article-search.md",
    title: "Tiered relevance scoring for full-text search",
    summary:
      "Three should-clauses with descending boosts (phrase 10×, all-terms 4×, any-term 1×) so that exact phrase matches outrank partial matches by score, not by filtering. The match-strength badge surfaces the tier verbatim so assistive technology can convey it.",
  },
  {
    id: "0008",
    file: "0008-trial-deployment.md",
    title: "Trial deployment to OVH VPS",
    summary:
      "First end-to-end deploy: a single OVHcloud VPS at Gravelines running self-hosted MongoDB, OpenSearch, Next.js under pm2, and Caddy as the reverse proxy. IP-only trial — DNS, TLS, and managed-Mongo cutover deferred. Three things that broke and how they resolved are recorded for next time.",
  },
];

export default function Colophon() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s3)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Colophon</h1>
            <p className="lede">
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
                data centre. All data resident in EU jurisdiction. See
                the <em>Hosting and deployment</em> section below.
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
            <h2>Hosting and deployment</h2>
            <p>
              The site runs on a single OVHcloud VPS at the Gravelines
              data centre. MongoDB, OpenSearch, the Next.js server, and
              Caddy all live on the same 4-core, 8GB box. Each backend
              binds to <code>127.0.0.1</code>, so the firewall only has
              to admit ports 22, 80, and 443. There is no separate
              database tier, no managed search service, no container
              orchestrator.
            </p>
            <p>
              The single-box shape is a deliberate choice. The
              site&rsquo;s traffic doesn&rsquo;t justify a multi-tier
              deployment, and multi-tier deployments add operational
              surfaces &mdash; network policies, secret management,
              inter-tier auth, opaque platform layers &mdash; that are
              themselves accessibility-hostile in the small sense:
              hard to inspect, hard to reason about, hard to fix when
              something fails. A single box keeps everything legible.{" "}
              <code>journalctl -u opensearch</code> and{" "}
              <code>pm2 logs a11ybob</code> are one SSH session apart.
              Data residency is incidental but welcome: Gravelines
              sits under EU jurisdiction, which fits the broader
              &ldquo;minimise US exposure where the choice is
              free&rdquo; position.
            </p>
            <p>
              <a href="https://caddyserver.com">Caddy</a> handles HTTPS
              termination and reverse-proxies to{" "}
              <code>localhost:3000</code>. When the site moves from
              IP-only access to its real hostname, Caddy will provision
              the Let&rsquo;s Encrypt certificate automatically; the
              Caddyfile gains a domain name and nothing else changes.{" "}
              <a href="https://pm2.keymetrics.io">pm2</a> keeps the
              Next.js server running and brings it back across reboots
              through a generated systemd unit. Neither tool was
              chosen for novelty; both were chosen because the
              accessibility-relevant property they share is{" "}
              <em>not lying about what they&rsquo;re doing</em>.
            </p>
            <p>
              Deployment is <code>git pull</code>,{" "}
              <code>npm run build</code>,{" "}
              <code>pm2 restart a11ybob</code> &mdash; done over SSH.
              No preview environment, no platform-as-a-service
              automation. A pre-push hook on the developer machine
              plus a GitHub Actions build job together gate{" "}
              <code>main</code> against broken builds: TypeScript
              errors that don&rsquo;t surface in <code>next dev</code>
              {" "}can still block <code>next build</code>, and that
              gap had let a broken build sit on <code>main</code> once
              before the gate landed. The benefit of the deploy
              mechanism itself is that it&rsquo;s the same three
              commands anyone reading the repository could run on
              their own server. The site is documentation of itself.
            </p>
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
            <p>
              The{" "}
              <Link href="/styleguide">styleguide</Link>{" "}
              is the working artefact this design is checked against
              &mdash; every token, primitive, and state used by the
              site, rendered live. Not a destination route in the
              production sense; a reference surface the design system
              is held accountable to.
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
            <h2>Multi-word link text doesn&rsquo;t wrap across lines</h2>
            <p>
              Every <code>&lt;a&gt;</code> on the site carries{" "}
              <code>white-space: nowrap</code>. A multi-word link like{" "}
              <em>See the Spotlight index</em> or{" "}
              <em>Polymorphic Task Decomposition</em> is a single phrase
              that should be scannable as one unit; splitting it across
              two lines on a column-margin break makes it read as two
              disconnected fragments and obscures where the link starts
              and ends. The white-space rule treats internal spaces as
              non-breaking, so the wrap point moves to{" "}
              <em>before</em> the link rather than into it.
            </p>
            <p>
              The trade-off is that a link longer than the article
              column would overflow horizontally rather than wrap. Site
              link text is short enough throughout that this
              hasn&rsquo;t surfaced; if a future case overflows, the
              preferred fix is to reword the surrounding prose so the
              link is shorter (link text rarely needs to be the entire
              descriptive sentence) rather than override the global
              rule. The global rule stays.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Words never break across lines</h2>
            <p>
              Body paragraphs set <code>hyphens: none</code>, which
              disables automatic word-breaking and ignores authored
              soft hyphens too. A word like{" "}
              <em>polymorphic</em> or <em>capability</em> stays as a
              single token on one line; the line wraps before the
              word rather than through it.
            </p>
            <p>
              The visual cost is a more ragged right margin than the
              browser&rsquo;s default justified-with-hyphens layout
              would produce. The reading benefit is the one that
              matters for the users this site is built for. A
              screen-magnifier user reading at high zoom traverses
              from the end of one line back to the start of the next
              as a slow physical motion: the eye, the head, sometimes
              the whole upper body. When a word is split across that
              gap, the two halves don&rsquo;t reassemble naturally on
              re-reading the way they would for a sighted user
              reading at normal zoom &mdash; the reader sees{" "}
              <em>capa-</em>, scrolls, sees <em>bility</em>, and has
              to consciously stitch the word together. Multiplied
              across a paragraph it becomes substantial cognitive
              friction.
            </p>
            <p>
              Same family of decision as the no-wrap rule for link
              text above: optimise for read-flow at high
              magnification rather than for compact text-fitting at
              default zoom.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Colour</h2>
            <p>
              Three motivations layered. First, body text on pure white
              is harsh for sustained reading &mdash; the low-vision
              recommendation that recurs across AT practice is closer to
              &ldquo;cream surface, dark grey text.&rdquo; The default
              surface on this site sits at 95% OKLCH lightness, not
              100%, and the default ink at 20%, not pure black, so the
              starting point is gentler than the conventional defaults
              before any tint is applied. Visitor preferences via{" "}
              <code>prefers-color-scheme</code> and{" "}
              <code>prefers-contrast</code> override whatever the site
              says.
            </p>
            <p>
              Second, per-zone hue answers the &ldquo;where am I&rdquo;
              question for visitors who can perceive subtle colour
              differences &mdash; borrowed from{" "}
              <strong>BridgePoint</strong>, the Shlaer-Mellor xtUML
              modelling tool that tinted
              Component / Class / State / Action diagrams so engineers
              always knew which kind they were looking at. Nothing on
              the site requires perceiving the tint to use it; the
              colour is a way-finding cue layered on top of structure
              that already works without it. Colour-vision deficiencies,
              high-contrast user stylesheets and{" "}
              <code>prefers-contrast: more</code> all flatten the
              palette without losing information.
            </p>
            <p>
              Third, identical luminance across every zone. Low-vision
              users should not have to re-adjust display brightness or
              screen-magnifier contrast as they navigate between
              sections, so while hue and chroma vary per zone, lightness
              is constant: 95% surface / 20% ink in light mode, 20% /
              96% in dark. Body-text contrast is identical on every
              page; only the hue of the underlying surface shifts. All
              colour values are expressed in{" "}
              <a href="https://oklch.com">OKLCH</a> &mdash; a
              perceptually uniform colour space &mdash; for that reason:
              the constant-lightness constraint is enforceable across
              ten different hues in a way HSL and sRGB do not provide.
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
            <h2>
              Filter facets are alpha-sorted and case-normalised
            </h2>
            <p>
              Two related decisions about how the filter options
              themselves are produced.
            </p>
            <p>
              <strong>Alpha-sorted within the top-N by count.</strong>{" "}
              The default order returned by OpenSearch&rsquo;s{" "}
              <code>terms</code> aggregation is count-desc. That keeps
              the biggest buckets first but makes the list hard to scan
              for a specific value: the reader has to read every label
              before giving up. The page now takes the top-N facets by
              count (so the long tail is still excluded) and then
              alpha-sorts the slice for display. Year facets keep their
              numeric-desc order — most-recent-first is the right
              reading order there.
            </p>
            <p>
              <strong>
                Case-normalised at index time, not at the source.
              </strong>{" "}
              The papers in the reviews corpus carry whatever tags the
              authors wrote: &ldquo;Assistive Technology&rdquo;,
              &ldquo;assistive technology&rdquo;, and the rare
              &ldquo;ASSISTIVE TECHNOLOGY&rdquo; all appear in the
              source. The source data is definitively correct &mdash;
              that&rsquo;s how the papers were tagged &mdash; so the
              fix isn&rsquo;t to rewrite it. Instead the OpenSearch
              keyword fields for{" "}
              <code>category</code> (glossary), <code>tags</code>{" "}
              (reviews, articles), and <code>domains</code> (articles)
              now have a <code>lowercase</code> normaliser. The
              normaliser applies to indexed values <em>and</em> to the
              query input of <code>term</code> filters, so case
              variants collapse into one bucket for aggregation and
              continue to filter correctly. URL parameters are
              defensively lowercased in the lib too, so old
              mixed-case shareable links still match.
            </p>
            <p className="muted">
              <small>
                Diacritics are not yet folded. &ldquo;Caf&eacute;&rdquo;
                and &ldquo;cafe&rdquo; would still be two buckets if
                they appeared. The <code>asciifolding</code> token
                filter that would merge them is applied to the
                full-text analyser but not to the taxonomy keywords,
                because the change is behavioural (it strips
                diacritics from filter values shown to the reader) and
                hasn&rsquo;t been needed by the current corpus. If a
                future ingest brings in tags whose only difference is
                a diacritic, the normaliser gets <code>asciifolding</code>{" "}
                added alongside <code>lowercase</code>.
              </small>
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
            <h2>
              The pagination current-page cue is self-contained, not
              relative
            </h2>
            <p>
              The conventional way to mark the current page in a
              paginated list is to set its number in bold. That works
              fine for a reader who can see the whole row at once and
              compare cells. It fails at high zoom: a screen-magnifier
              user looking at one cell with the surrounding cells off
              screen has no way to know whether <em>this</em> cell is
              the current one, because bold-versus-not-bold is a{" "}
              <em>relative</em> cue. So the current page on this site
              gets an outlined box (a 2px border in the ink colour),
              plus the bold weight as a secondary signal. The border
              padding matches the unstyled cells&rsquo; padding so
              cells don&rsquo;t shift width when state changes. A
              single isolated cell now answers the question on its
              own.
            </p>
            <p>
              The current page is rendered as a real{" "}
              <code>&lt;a&gt;</code> linking to itself, carrying{" "}
              <code>aria-current=&ldquo;page&rdquo;</code> and a
              prefixed accessible name of &ldquo;Current page, page
              N&rdquo;. The W3C Design System recommends this
              pattern: keeping the current page as an actual link
              means AT users navigating the document by links never
              lose track of where they are. The earlier draft used an
              inert <code>&lt;span&gt;</code> which dropped out of the
              link list entirely.
            </p>
            <p>
              The count line (<em>Results 1&ndash;10 of 17</em>) and
              the row of page links sit in one horizontal cluster
              rather than two stacked rows. At 400% zoom the
              difference is meaningful &mdash; vertical traversal
              between the count and the controls reads as one widget,
              not two. Previous and Next carry the destination page
              number in their accessible name
              (&ldquo;Previous, page 2&rdquo; rather than
              &ldquo;Previous&rdquo;) so voice-control users can
              speak the destination as well as the direction, and
              screen-reader users hear where the link will take them
              before they activate it. Gaps between page numbers
              announce the skipped range explicitly via a
              visually-hidden span (&ldquo;skipping pages 4 to
              12&rdquo;) rather than relying on the visible ellipsis
              alone, which screen readers omit in browse mode.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Modals are native <code>&lt;dialog&gt;</code>, not a custom widget</h2>
            <p>
              Every modal on this site — the Playground&rsquo;s Help,
              Fix, and Reset confirmations, and the image-zoom modal
              on the About page — is a native HTML{" "}
              <code>&lt;dialog&gt;</code> opened with{" "}
              <code>showModal()</code>. The browser handles focus
              trapping, Escape-to-close, backdrop rendering, and the
              correct AT role; nothing is reimplemented in JavaScript.
            </p>
            <p>
              The custom-modal route — a <code>div</code> overlay with
              a <code>role=&ldquo;dialog&rdquo;</code> and a manual
              focus-trap loop — is the more common choice in modern
              frameworks. It also goes wrong constantly. Focus traps
              miss edge cases (iframes, shadow DOM, dynamically-added
              focusables); Escape handling collides with other
              keybinds; restoring focus to the trigger on close is
              forgotten; the backdrop click leaks through to the page
              underneath. Each of those failures is a real
              accessibility regression for keyboard and screen-reader
              users, and each is solved for free by the browser&rsquo;s{" "}
              <code>&lt;dialog&gt;</code> element.
            </p>
            <p>
              The cost was small and bounded: the universal
              max-inline-size axiom needed{" "}
              <code>dialog</code> on its exception list, and the
              dialog&rsquo;s sizing rule had to use{" "}
              <code>fit-content</code> capped at 80ch rather than an
              explicit width so short confirm dialogs render compact
              instead of stretching. Two CSS lines, against an entire
              category of accessibility bugs the platform now handles.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>
              Image-zoom triggers carry a visible label, not just an{" "}
              <code>aria-label</code>
            </h2>
            <p>
              The About page carries seven figures spanning a
              four-decade career timeline &mdash; period photographs,
              architecture diagrams and project screenshots. At
              thumbnail width the labelled diagrams in particular are
              too small to read in detail. Tapping or clicking any
              thumbnail opens the image at near-viewport size in a
              native <code>&lt;dialog&gt;</code>, with the same focus
              trap, Escape-to-close and focus-return contract as the
              Playground&rsquo;s dialogs above.
            </p>
            <p>
              The interesting choice is the trigger. Image-only buttons
              routinely fail SC 2.5.3 <em>Label in Name</em>: the
              button carries an <code>aria-label</code> describing the
              action, but voice-control users cannot speak that label
              because there is no visible text matching it. A
              persistent &ldquo;View larger&rdquo; badge sits in the
              bottom-right corner of every thumbnail; the badge text
              matches the start of the trigger&rsquo;s accessible name{" "}
              &mdash; <code>View larger: {"{trigger label}"}</code>{" "}
              &mdash; where the trigger label is a short identifier
              for the figure (e.g. <em>the Ascotel Crystal terminal</em>,{" "}
              <em>the PTD task tree</em>). A voice-control user can say
              &ldquo;View larger&rdquo; to activate, and the
              engine&rsquo;s numbered-overlay disambiguation handles
              the case where multiple triggers match at once. The badge
              is solid ink-on-surface (not semi-transparent) so it
              meets AAA 7:1 contrast against any underlying image.
            </p>
            <p>
              The dialog uses <code>aria-label</code> for the same
              short trigger label and{" "}
              <code>aria-describedby</code> pointing at the in-dialog
              caption for the longer description, so SR users hear
              the figure&rsquo;s caption as the dialog&rsquo;s{" "}
              <em>description</em> rather than its <em>name</em>. An
              earlier draft put the full caption directly into the
              dialog&rsquo;s accessible name (and into the
              trigger&rsquo;s <code>aria-label</code>), which meant a
              60-word string was read on every focus and on every
              dialog open. The short-name / long-description split
              fixes the noise without losing the description.
            </p>
            <p>
              The figure is a composition of the Every Layout
              primitives already documented:{" "}
              <code>Stack</code> for the figure&rsquo;s internal
              spacing, <code>Frame</code> (cover for photographs,
              contain for diagrams) holding the image, and{" "}
              <code>Sidebar</code> or <code>Grid</code> placing the
              figure against the surrounding prose. For raster images
              the trigger button <em>is</em> the Frame &mdash;
              click-anywhere on the image opens the dialog. For inline
              SVG content the Frame is a plain container and the
              trigger is an overlay button positioned absolutely in
              the Frame&rsquo;s bottom-right corner; visually
              identical, structurally a sibling. See the next section
              for why that distinction matters. The dialog is the
              standard native <code>&lt;dialog&gt;</code> &mdash;
              nothing custom, no JavaScript focus-trap, no portal.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>
              Structural diagrams are inline SVG, with the Graphics
              module preserved as a worked example
            </h2>
            <p>
              The PTD task tree on{" "}
              <Link href="/research/polymorphic-task-decomposition">
                /research/polymorphic-task-decomposition
              </Link>{" "}
              is hand-authored inline SVG, not a raster image. Three
              reasons make the choice worth keeping even when the AT
              path is ultimately the same as a raster image with alt
              text: (a) inline SVG inherits the page&rsquo;s CSS custom
              properties &mdash; strokes and text use{" "}
              <code>currentColor</code>; the wrapping CSS sets{" "}
              <code>color</code> on the root SVG element to{" "}
              <code>var(--ink)</code>, so the diagram automatically
              picks up the research zone&rsquo;s ink tint and adapts
              to Windows High Contrast / forced-colors mode through
              CSS system colour resolution; node-box fills use{" "}
              <code>var(--surface-1)</code> with a{" "}
              <code>@media (forced-colors: active)</code> override.
              (b) The diagram scales vector-perfect at any zoom level,
              including the dialog&rsquo;s near-viewport size.
              (c) Text labels are real text &mdash; selectable,
              indexed by find-in-page, copy-paste-able. None of these
              are available to an external SVG referenced through{" "}
              <code>&lt;img src&gt;</code>: the browser renders
              external SVGs in their own document context with no
              access to the parent page&rsquo;s tokens or media
              queries.
            </p>
            <p>
              The SVG also carries a complete example of the{" "}
              <strong>WAI-ARIA Graphics module</strong> structure
              inside it:{" "}
              <code>role=&ldquo;graphics-object&rdquo;</code> on every
              grouped node (root task, polymorphs, sub-tasks, modality
              enclosures) and{" "}
              <code>role=&ldquo;graphics-symbol&rdquo;</code> on every
              leaf modality icon, each labelled with{" "}
              <code>aria-label</code>. The intention of those roles is
              to let AT users navigate the tree structure node by node
              &mdash; hearing &ldquo;Root task: Delete File,&rdquo;{" "}
              &ldquo;First polymorph: Direct Manipulation,&rdquo;
              &ldquo;sub-task: Select File, performed before Select
              Delete,&rdquo; and so on, walking the diagram as a
              navigable structure rather than receiving it as one
              opaque image.
            </p>
            <p>
              That contract turned out to be{" "}
              <em>aspirational</em>. AT support for the Graphics
              module (defined in 2018) is patchier than the spec
              suggests in 2026: VoiceOver on macOS and iOS handles it
              reasonably well; NVDA on Windows is inconsistent across
              browser combinations; JAWS on Windows largely
              doesn&rsquo;t implement it; <strong>TalkBack on
              Android walks SVG elements individually regardless of
              roles</strong>, announcing pixel-coordinate geometry of
              the inner <code>&lt;rect&gt;</code> and{" "}
              <code>&lt;text&gt;</code> elements rather than the
              parent group&rsquo;s <code>aria-label</code>. Tested
              directly on this site. Two of the most-used AT engines
              (JAWS and TalkBack) don&rsquo;t honour the module at
              all, which means the carefully-placed roles inside the
              SVG don&rsquo;t reach the AT users who depend on those
              engines.
            </p>
            <p>
              So the SVG&rsquo;s root currently carries{" "}
              <code>role=&ldquo;img&rdquo;</code> &mdash; atomic-image
              semantics &mdash; with descriptive{" "}
              <code>&lt;title&gt;</code> and <code>&lt;desc&gt;</code>{" "}
              children carrying the accessible name and description.
              Every AT engine announces those.{" "}
              <em>
                The structural Graphics-module roles remain in the
                markup as a worked example of the spec
              </em>{" "}
              &mdash; the diagram <em>would</em> become navigable in a
              more mature ARIA-support landscape by simply removing
              the <code>role=&ldquo;img&rdquo;</code> override; the
              one-line change is left explicit in the source so the
              upgrade path is obvious. The site is honest about
              shipping what AT support can reliably deliver today
              rather than claiming a navigation experience most users
              don&rsquo;t actually receive.
            </p>
            <p>
              Three earlier drafts of this figure overstated the AT
              delivery. The first hid the SVG inside an interactive{" "}
              <code>&lt;button&gt;</code> (the &ldquo;View
              larger&rdquo; trigger), which makes every inner role
              unreachable regardless of engine support &mdash; the
              button is an AT leaf, and SR users stop at its name.
              The second declared{" "}
              <code>role=&ldquo;graphics-document&rdquo;</code> on the
              root with the implication that VoiceOver and NVDA users
              would get rich navigation &mdash; true for some
              configurations, untrue for most. Both got fixed as they
              were caught, but the pattern is worth naming: AT
              contracts you commit to in markup are only as real as
              the AT engines that honour them, and assuming
              &ldquo;the spec exists therefore it works&rdquo; is a
              recurring trap. The trigger-outside-button fix from the
              first round is preserved in{" "}
              <code>ImageFigure</code>&rsquo;s content-mode path;
              when the Graphics module is widely supported, it will
              do its job correctly.
            </p>
            <p>
              The <code>ImageFigure</code> component was extended with
              an optional <code>content</code> prop that accepts a
              ReactNode in place of the <code>&lt;img&gt;</code>{" "}
              element. The trigger and the dialog render the content
              as separate React subtrees, so any <code>useId()</code>{" "}
              inside the content generates distinct IDs in each
              location with no DOM ID collision.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Weight, not colour, marks the destructive action</h2>
            <p>
              The site palette is monochrome — ink, surface, rule, a
              single accent. There is no red. So when a confirm dialog
              needs to distinguish a destructive button (Reset,
              discard, delete) from a safe one (Cancel), the
              conventional red-versus-grey treatment isn&rsquo;t
              available. The destructive button is solid ink fill with
              a heavier border; the safe button is the standard
              outlined pill. The destructive action carries more
              visual mass, which is the same signal red-versus-grey
              encodes — &ldquo;this one has consequences&rdquo; —
              translated into the dimension the palette actually
              offers.
            </p>
            <p>
              This isn&rsquo;t only a stylistic concession. Colour
              alone fails WCAG 1.4.1 (Use of Colour) for users with
              colour-vision deficiencies, who may not see a
              red-versus-grey distinction at all. Forcing the design
              to encode emphasis non-chromatically from the start
              produces the same affordance for everyone, rather than
              a primary signal that fails for some users plus a
              redundant fallback nobody notices.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Destructive confirm dialogs focus Cancel, not Confirm</h2>
            <p>
              When the Playground&rsquo;s Reset confirmation opens,
              the initial keyboard focus lands on Cancel — not on the
              Reset button that would discard the user&rsquo;s edits.
              This is the opposite of what{" "}
              <code>window.confirm()</code> does and the opposite of
              the default for &ldquo;OK / Cancel&rdquo; dialogs in
              most operating systems.
            </p>
            <p>
              The reason is the cost of an accidental Enter for users
              of switch access, eye-gaze input, and other assistive
              input methods. Those interaction modes inherently dwell
              on a key longer than intentional typing does; a
              destructive action one-keystroke-away from focus on
              dialog open is a real risk of lost work. The user has
              already pressed the Reset button to <em>open</em> the
              dialog; requiring a second deliberate motion to confirm
              isn&rsquo;t friction, it&rsquo;s the safety margin.
              Non-destructive confirms still focus the affirmative
              action, where Enter-to-accept matches user expectation
              and the cost of a stray Enter is recoverable.
            </p>
            <p>
              The same reasoning underpins the choice to add{" "}
              <code>tabindex=&ldquo;-1&rdquo;</code> targets and skip
              links inside long tool surfaces: anywhere a keyboard
              user&rsquo;s next intentional action is many tab stops
              away from their current position, that&rsquo;s a
              measurable cost we can erase by giving them a
              shortcut, and dialogs are the case where the cost of
              <em> not</em> doing it is highest.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>
              No marketplace listings &mdash; distribution is the
              repo itself
            </h2>
            <p>
              Bob&rsquo;s tools that ship as browser-or-editor
              extensions &mdash; Paradise&rsquo;s VS Code plugin,
              the Carnforth Chrome DevTools extension &mdash; are
              distributed as a checkout or download from the source
              repo, never via a marketplace listing (the Visual
              Studio Marketplace, the Chrome Web Store). The choice
              is intentional and permanent, not a stopgap awaiting
              a listing that will eventually arrive.
            </p>
            <p>
              The reasoning fits the rest of the site&rsquo;s
              framing. Marketplaces interpose a third party between
              the author and the user: they introduce policy
              surface (content moderation, name-collision rules,
              region-blocking), they introduce a brand
              (&ldquo;available on the Marketplace&rdquo; signals a
              commercial-product posture the work isn&rsquo;t), and
              they introduce a release ceremony that doesn&rsquo;t
              match how Bob actually develops the code &mdash;
              small experimental commits, frequent reframings,
              version numbers that mean something to the author
              rather than to a listings catalogue. Distributing
              from the repo keeps the artefact aligned with the way
              it was made.
            </p>
            <p>
              Practically: install steps live in each tool&rsquo;s
              page (the VS Code plugin via{" "}
              <code>code --install-extension paradise-a11y.vsix</code>;
              Carnforth as a Chrome developer-mode unpacked
              extension). Users who want guaranteed currency clone
              and rebuild from <code>main</code>. Users who
              don&rsquo;t want to do that aren&rsquo;t the target
              audience for the tools.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>All my code as readable source, not as compiled libraries</h2>
            <p>
              The site ships several substantial pieces of working
              code: the{" "}
              <a href="/paradise">Paradise</a> multi-model
              accessibility analyser engine that powers the{" "}
              <a href="/playgrounds/paradise">Playground</a>; a virtual screen
              reader, switch-access simulator, and session
              recorder/replayer also in the Playground; and a
              TypeScript port of the original PhD-era Action Language
              execution engine that runs the worked examples on{" "}
              <a href="/playgrounds/action-language">
                /playgrounds/action-language
              </a>
              . All of that is in the repository as readable
              TypeScript source, not as compiled <code>.js</code>{" "}
              and <code>.d.ts</code> snapshots.
            </p>
            <p>
              The lib-snapshot pattern is convenient. It keeps the
              site repository small; it lets a single canonical
              source be consumed elsewhere; it sidesteps strict-
              compilation drift between projects. It is also opaque.
              A reader who clicks &ldquo;view source&rdquo; on the
              analyser engine, or who pulls the repo to learn from
              what was built, gets a wall of emitted JavaScript that
              is technically correct and humanly unreadable. The
              site is meant to be evidence; opaque evidence is not
              evidence.
            </p>
            <p>
              The cost of carrying source instead of libs is one
              re-port pass per engine when it changes upstream, plus
              the occasional fix when stricter TypeScript settings
              surface an error the upstream tolerated. Both costs
              have been paid; both turn out to be small. The
              benefit is that everything load-bearing on the site is
              code anyone can read, run, modify, and learn from.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The Playground includes simulators, not just diagnostics</h2>
            <p>
              The natural shape for an accessibility tool is{" "}
              <em>finds bugs and lists them</em>. The Playground does
              that &mdash; the Paradise analysers report what they
              detect, with confidence levels, suggested fixes, and
              links into the analyser documentation. But the
              Playground also includes three things that are not
              diagnostic at all: a virtual screen reader that walks
              the rendered page the way NVDA, JAWS, or VoiceOver
              would; a switch-access simulator with single-switch
              auto-scan and dual-switch step-scan modes; and a
              session recorder/replayer that captures a screen-reader
              walk for replay later.
            </p>
            <p>
              Those are present because diagnosing a bug from a list
              entry tells a sighted developer{" "}
              <em>that something is wrong</em>; it does not tell them
              what the experience of using the page is actually like.
              A switch-access user navigating thirty stops to reach
              an action a mouse user takes in one click is paying a
              real cost; the analyser&rsquo;s warning about
              keyboard-trap depth does not convey that cost. The
              simulator does. Sliding the scan-speed slider down to
              match a real user&rsquo;s speed makes the cost
              visible &mdash; visceral, even &mdash; in a way no
              diagnostic message can match.
            </p>
            <p>
              The simulators are deliberately accurate enough to
              teach and not so accurate as to be a substitute for the
              real assistive technology. They are scaffolding for
              empathy and for design judgement, not test
              instrumentation.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Living code, not screenshots</h2>
            <p>
              Everywhere on the site that running code would teach
              better than a static description, the running code is
              what landed.{" "}
              <a href="/playgrounds/action-language">
                /playgrounds/action-language
              </a>{" "}
              has four worked examples that execute in the browser
              against an in-page TypeScript port of the original
              doctoral Action Language execution engine; visitors
              can edit the XML and re-run, watch the action tree
              re-parse live, and step through the structured
              execution trace.{" "}
              <a href="/playgrounds/paradise">/playgrounds/paradise</a> runs the
              Paradise analyser engine in-browser and re-analyses
              the visitor&rsquo;s code on every keystroke. The
              simulators referenced above operate against a
              sandboxed render of the user&rsquo;s own buffers.
            </p>
            <p>
              The cost of running code is real: a heavier JavaScript
              bundle, a need to handle the failure modes that code
              carries, accessibility care over interactive surfaces
              that prose pages do not require. The benefit is that
              the artefacts demonstrate themselves. The reader does
              not have to take the page&rsquo;s word for what the
              engine does; they can run it and see.
            </p>
            <p>
              The boundary is honest. Where the site explains a
              decision or articulates a position, prose does the
              work and code is referenced from text. Where the
              site demonstrates a working artefact, the artefact
              is the thing on the page. Decision pages are not
              dressed up as code playgrounds; code playgrounds are
              not buried under decision prose.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>CodeMirror 6 across both code-editor surfaces</h2>
            <p>
              The site has two code-editor surfaces: the analyser
              Playground at <a href="/playgrounds/paradise">/playgrounds/paradise</a>{" "}
              with HTML, JavaScript, and CSS buffers, and the
              Action Language playground at{" "}
              <a href="/playgrounds/action-language">
                /playgrounds/action-language
              </a>{" "}
              with XML. Both use{" "}
              <a href="https://codemirror.net">CodeMirror 6</a>.
            </p>
            <p>
              The analyser Playground was originally built on
              Monaco, the editor that powers VS Code. Monaco is an
              extraordinary piece of engineering &mdash; multi-
              cursor editing, IntelliSense, deep semantic
              tokenisation, language-server protocol support &mdash;
              and on most accessibility metrics it is fine. On
              several criteria the site targets, it is not. Monaco
              binds <kbd>Tab</kbd> to indent by default, which
              traps keyboard-only users inside the editor; the
              escape is <kbd>Ctrl</kbd>+<kbd>M</kbd>, which the
              user must know in advance. WCAG 2.1.2 (No Keyboard
              Trap) is hard to claim under that condition. Monaco&rsquo;s
              built-in themes cap at AA contrast (4.5:1 for normal
              text) rather than the 7:1 the site targets across
              the board, and the editor controls its own internal
              styling deeply enough that user stylesheet overrides
              for foreground and background &mdash; which AAA
              criterion 1.4.8 requires &mdash; cannot reliably take
              effect.
            </p>
            <p>
              CodeMirror 6 is smaller, more modular, and
              accessibility-friendly by default.{" "}
              <kbd>Tab</kbd> moves focus out of the editor without
              special configuration; the surface is themeable via
              ordinary CSS rather than internal class systems;
              the bundle is small enough to ship without code-
              splitting acrobatics. The trade is loss of Monaco&rsquo;s
              richer language-aware features &mdash; no IntelliSense
              suggestions, no multi-cursor, simpler tokenisation.
              For a Playground whose purpose is to{" "}
              <em>demonstrate</em> accessibility analysis rather
              than to be a production editor, that trade is
              clean.
            </p>
            <p>
              The migration happened in one pass after the second
              editor surface (the Action Language playground)
              shipped on CodeMirror 6 and the asymmetry became
              load-bearing in the colophon. Better to consolidate
              before the next interactive surface lands than after.
              The site now ships one editor library across both
              code-editing surfaces, and both surfaces meet
              AAA across the criteria a code editor can plausibly
              meet.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Syntax highlighting by weight and italic, not by colour</h2>
            <p>
              Both code editors render syntax highlighting in
              monochrome. Keywords, function names, type names,
              numbers, and HTML tag names are bold. Strings,
              attribute values, regular expressions, and comments
              are italic. Comments and operators take the muted ink
              colour; everything else takes the standard ink. No
              rainbow.
            </p>
            <p>
              This follows the same logic as the destructive-button
              variant earlier in the colophon: the site palette is
              monochrome, so weight and italic do what colour does
              in conventional sites &mdash; convey a token&rsquo;s
              syntactic role through a non-chromatic dimension. A
              user with red-green or blue-yellow colour-vision
              deficiency reads the highlighted code at the same
              fidelity as anyone else; a user reading on a high-
              contrast user stylesheet does not lose the structural
              cue when the conventional palette is overridden;
              every token resolves to <code>var(--ink)</code> or{" "}
              <code>var(--ink-muted)</code> over the editor
              surface, both of which sit at AAA contrast.
            </p>
            <p>
              The cost is one specific loss compared to a
              conventional rainbow theme: the eye-catching{" "}
              <em>distinct hue per token category</em> that
              experienced developers learn to scan against. The
              gain is that the highlighting is universal &mdash;
              works for everyone, in every theme override, on every
              user stylesheet, without any further intervention.
              Same trade as everywhere else on the site where
              colour was tempting but weight earned its place
              instead.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Depth split across navigable surfaces</h2>
            <p>
              The single deepest piece of writing on the site is
              <em> The Measure of Accessibility</em>, treating
              what accessibility is, how to measure it, and why
              the answer matters. It runs to roughly nine thousand
              words. It is not a single page.
            </p>
            <p>
              The collection is six pages plus an index. Each page
              stands alone &mdash; The Question, Functional
              Accessibility, Intrinsic Accessibility, Equivalent
              Experience, the Shlaer-Mellor lens, Communities of
              Practice. A reader who wants only the political framing
              can stop after page 1; a reader who wants the formal
              definition can stop after page 3; a reader who wants
              the whole position reads all six. The same approach
              shapes the{" "}
              <a href="/research/spotlight">Spotlight projects</a>:
              three pages with a shared six-part structure (person,
              constraint, insight, artefact, teaching, coda) so each
              project is its own short essay rather than a section
              of a longer one.
            </p>
            <p>
              The single-page alternative is briefly tempting: one
              monolithic chapter that reads end-to-end without
              navigation. The cost is that the reader cannot enter
              the position partway through, cannot share a specific
              argument as a link, and cannot read the formal
              treatment without committing to the whole arc.
              Splitting into navigable surfaces preserves the
              linear read for those who want it and gives every
              other reader a meaningful entry point.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Family privacy: relational nouns by default</h2>
            <p>
              Several of the technical projects on the site were
              built for specific named family members &mdash; cousin,
              mother, father &mdash; whose stories are part of the
              record. On the public surfaces those people are
              referred to with relational nouns only:{" "}
              <em>my cousin</em>, <em>my mother</em>, <em>my
              father</em>. They are not named.
            </p>
            <p>
              The convention is deliberate. The story of who the
              tools were for is part of why the tools exist; that
              is worth telling. Each named person is a separate
              consent question, and consent for being mentioned in
              a private telling is not consent for being on a public
              website indefinitely. Defaulting to relational nouns
              tells the story without making the call on someone
              else&rsquo;s behalf.
            </p>
            <p>
              The husband, Taodi, is named freely because he is
              already public elsewhere. Friends in Singapore appear
              as a community rather than as individuals for the
              same reason: the story is theirs as much as the
              writer&rsquo;s. If a named individual signs off on
              public mention, the relevant page can be updated; the
              default is silence.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Voice: direct, present tense, no provenance scaffolding</h2>
            <p>
              The research-and-position writing on this site is
              written to the reader, in the present tense, without
              the scaffolding that long-arc personal research
              typically accumulates. There is no
              <em>&ldquo;in my doctoral work I argued&hellip;&rdquo;</em>{" "}
              and no <em>&ldquo;the chapter on X says&hellip;&rdquo;</em>
              {" "}weighing down the prose. The position is stated; the
              argument is made; the reader is the audience.
            </p>
            <p>
              The convention emerged during the drafting of{" "}
              <em>The Measure of Accessibility</em>. The early
              drafts referred back constantly &mdash; <em>the
              opening line of the chapter is</em>, <em>this
              page expands the same material as</em>. The reader
              already knows whose research the writing is from; the
              site says so once at the entry points and trusts that
              once is enough. Saying it on every page is noise.
            </p>
            <p>
              The exception is verbatim quotation. Where a passage
              from an original chapter or a published paper carries
              the prose better than a paraphrase would, it is
              quoted as a quote &mdash; without the&nbsp;
              <em>&ldquo;from the chapter:&rdquo;</em> setup line
              that pretends the reader needs to be told it is a
              quotation. The italics and the blockquote markup do
              that work; the prose carries the substance.
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
              className="list-flat stack"
              style={{ "--space": "var(--s1)" } as CSSProperties}
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
                  <p>{d.summary}</p>
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
            <h2>Where AI fits in the build and the work</h2>
            <p>
              This site is built with AI assistance &mdash; as a
              collaborator on implementation, code structure, and the
              mechanics of the design system. The intellectual content
              is mine: the positions, the frameworks, the writing, the
              design choices. The tooling work that gets those ideas
              into running code happens in conversation with an AI
              assistant. That collaboration is disclosed here rather
              than hidden because the colophon&rsquo;s purpose is to
              make the build examinable.
            </p>
            <p>
              Separately, AI also appears in the substantive
              accessibility work this site describes. The Dictaphone
              tool documented at <Link href="/lived-user-testing">
                <code>/lived-user-testing</code>
              </Link>{" "}
              and the proof-of-concept analyses at{" "}
              <Link href="/automated-testing">
                <code>/automated-testing</code>
              </Link>{" "}
              use multimodal LLMs for accessibility analysis on behalf
              of CNIB Access Labs and Bob&rsquo;s own research lines.
              That work is the subject of several pages and is covered
              there in detail.
            </p>
            <p>
              The accessibility industry&rsquo;s relationship with AI
              right now is uneasy. The fair criticism is real &mdash;
              there are companies extracting practitioner expertise
              into models without credit or compensation. The position
              on this site is to use the tools for what they&rsquo;re
              genuinely useful for (translation between idea and code;
              surfacing issues humans don&rsquo;t notice on their first
              pass) while keeping the intellectual work and the
              judgement-of-quality with the human whose name is on the
              work. This colophon is part of that judgement made
              visible.
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
