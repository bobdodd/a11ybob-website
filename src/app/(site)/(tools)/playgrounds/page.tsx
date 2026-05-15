import Link from "next/link";
import type { CSSProperties } from "react";

export default function Playgrounds() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Playgrounds</h1>
            <p className="lede">
              Three interactive surfaces, each running real engine
              code in the browser. The Paradise playground analyses
              code as you type; the Action Language playground
              executes the original PhD-era language; the maps
              demo lets you experience the polar-coordinate finding
              first-hand. No screenshots, no &ldquo;watch the
              video&rdquo; placeholders &mdash; the artefact{" "}
              <em>is</em> the page.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
            aria-labelledby="playgrounds-cards-heading"
          >
            <h2 id="playgrounds-cards-heading" className="visually-hidden">
              The three playgrounds
            </h2>

            <article
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <h2>
                <Link href="/playgrounds/paradise">Paradise playground</Link>
              </h2>
              <p>
                Edit HTML, JavaScript, and CSS across multiple
                files; watch the{" "}
                <Link href="/paradise">Paradise</Link> analyser
                re-run on every keystroke and report cross-file
                accessibility issues with severity, confidence,
                WCAG mapping, and suggested fixes. Five curated
                examples covering cross-file demonstrations and a
                deliberate-fail mode showing the analyser&rsquo;s
                reasoning under each.
              </p>
              <p>
                Bundles the simulator suite too: a virtual screen
                reader that walks the page as VoiceOver / NVDA /
                JAWS would, a switch-access scanner with
                configurable speed, and a session recorder/replayer
                for AT walks captured for later review.
              </p>
              <p>
                <small className="muted">
                  The flagship playground. The site&rsquo;s
                  strongest single demonstration of accessibility
                  analysis happening live.
                </small>
              </p>
            </article>

            <article
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <h2>
                <Link href="/playgrounds/action-language">
                  Action Language playground
                </Link>
              </h2>
              <p>
                Four worked examples of the original PhD-era
                Action Language XML notation, executing in your
                browser via a TypeScript port of the Carnforth
                threaded-interpreter engine. Edit the XML and
                re-run; watch the action tree re-parse live; step
                through a structured execution trace.
              </p>
              <p>
                The four examples build through Fibonacci (basic
                recursion), conditional content selection
                (accessibility-shaped if-then-else), Shlaer-Mellor
                state migration (notification lifecycle with
                disjoint-complete subtypes), and an adaptation
                example (button rollover with profile-dependent
                inventory selection).
              </p>
              <p>
                <small className="muted">
                  Demonstrates the methodological substrate{" "}
                  <em>in code</em>, not just in description. Cross-
                  references{" "}
                  <Link href="/research/the-measure-of-accessibility/the-shlaer-mellor-lens">
                    the Shlaer-Mellor lens
                  </Link>
                  .
                </small>
              </p>
            </article>

            <article
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <h2>
                <Link href="/maps/groves">Accessible maps demo</Link>
              </h2>
              <p>
                The simplest of the three accessible-maps demos
                &mdash; The Groves subdivision in Buckhorn,
                Ontario. Residential streets, no interior
                features; the cognitive load is stripped down so
                the dual-mode interaction can be felt directly.
                Cartesian via touch (the finger gives spatial
                reference; each location announces what is under
                it) plus polar on tap (POIs described as{" "}
                <em>name, distance, compass direction</em> from
                the tapped point). Pin-as-datum at viewport
                centre; the map orbits the pin.
              </p>
              <p>
                The simplicity is the point. With residential
                streets and nothing else, the modality-conversion
                problem becomes visible: the sighted observer
                scans the map in two dimensions; the non-sighted
                user, hearing announcements sequentially, has
                nothing like a two-dimensional reference frame to
                hold those announcements in. The visual map is
                Cartesian. The audio experience the user inhabits
                is polar. That is{" "}
                <Link href="/maps#maps-spatial-cognition-heading">
                  the polar-coordinate finding
                </Link>
                .
              </p>
              <p>
                <small className="muted">
                  The two richer demos (YVR terminal interior
                  wayfinding and the Guelph streetmap with the
                  SVG-tile architecture) live at{" "}
                  <Link href="/maps/yvr">/maps/yvr</Link> and{" "}
                  <Link href="/maps/guelph">/maps/guelph</Link>.
                </small>
              </p>
            </article>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why playgrounds, not screenshots</h2>
            <p>
              The site&rsquo;s working principle for the
              demonstrations: where running code would teach better
              than a static description, the running code is what
              ships. Each playground above runs a real engine in
              the browser &mdash; the Paradise analyser, the Action
              Language threaded-interpreter, the accessible-maps
              SVG-rendered viewer with its four-population
              interaction model. The reader does not have to take
              the page&rsquo;s word for what the engine does; they
              can run it and see.
            </p>
            <p>
              The trade is that the bundles are heavier than they
              would be for prose pages, and that interactive
              surfaces carry an accessibility burden that prose
              pages do not. Both costs have been paid; the
              colophon names them.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/tools">Tools</Link> &mdash; the
                companion accessibility-testing tools (Carnforth
                GPL, a11yAuto, lived-experience testing).
              </li>
              <li>
                <Link href="/paradise">Paradise</Link> &mdash;
                the analyser engine the Paradise playground runs.
              </li>
              <li>
                <Link href="/maps">Maps</Link> &mdash; the
                seven-year body of work the maps demo belongs to.
              </li>
              <li>
                <Link href="/colophon">Colophon</Link> &mdash; the
                full set of decisions, including the case for
                running code over screenshots and the choice of
                CodeMirror 6 across both code-editor surfaces.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
