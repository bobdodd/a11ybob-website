import Link from "next/link";
import type { CSSProperties } from "react";

export default function Carnforth() {
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
            <h1>Carnforth</h1>
            <p className="lede">
              A GPL-3.0 Chrome DevTools extension that tests pages
              for accessible-name conformance against WCAG 4.1.2.
              Runtime testing against the rendered DOM &mdash; the
              opposite end of the spectrum from{" "}
              <Link href="/paradise">Paradise</Link>&rsquo;s source-
              level analysis. A working proof-of-concept, presented
              at a11yTO Accessibility Camp 2024, intended as a
              demonstration of an approach rather than a
              productionised tool.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it does</h2>
            <p>
              Installs as a Chrome DevTools panel called{" "}
              <em>Accessible Names</em>. Run the test from the
              panel and the extension walks the rendered DOM
              checking every element that needs an accessible
              name &mdash; images, form controls, buttons, links,
              landmarks, ARIA widgets, iframes, audio and video
              &mdash; against the WCAG accessible-name computation
              algorithm. Results land in the panel as failures,
              warnings, and passes, with detail on each issue.
              Click any issue to highlight the element on the page;
              click <em>Inspect in Elements panel</em> to jump to
              it in the standard DevTools tree.
            </p>
            <p>
              <strong>One WCAG criterion, in depth.</strong> The
              extension focuses on WCAG 4.1.2 Name, Role, Value and
              the accessible-name computation algorithm
              specifically. That focus is deliberate: 4.1.2 is the
              criterion most commonly under-implemented in real
              codebases, and the accessible-name algorithm is
              subtle enough that a tool dedicated to it adds value
              beyond the broader commercial scanners. Carnforth
              is a single-criterion deep test, not a sweep.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where it sits in the tools lineage</h2>
            <p>
              The naming is not coincidence. The lineage runs from
              the original CISNA Model (W4A 2008, with Steve Green
              and Elaine Pearson) through the PhD-era Carnforth-Java
              implementation, into the runtime-testing branch that
              Carnforth inhabits:
            </p>
            <ul>
              <li>
                <strong>CISNA Model</strong> &mdash; theory. The
                five-layer model of accessible adaptive hypermedia.
                See{" "}
                <Link href="/research/cisna-model">
                  /research/cisna-model
                </Link>
                .
              </li>
              <li>
                <strong>Carnforth-Java</strong> &mdash; the doctoral
                Java implementation of CISNA, with Action Language
                XML. See{" "}
                <Link href="/playgrounds/action-language">
                  /playgrounds/action-language
                </Link>{" "}
                for the in-browser worked examples.
              </li>
              <li>
                <strong>Carnforth (this tool)</strong>{" "}
                &mdash; the runtime DOM-testing branch, 2024.
                Bob-owned, GPL-3.0.
              </li>
              <li>
                <Link href="/automated-testing">automated-testing</Link> &mdash;
                AI-driven accessibility testing experiments;
                Bob-owned, GPL-3.0. Five PoCs covering classes of
                issue commercial tools cannot reach.
              </li>
              <li>
                <strong>autoA11y</strong> &mdash; the much more
                complete CNIB rebrand and production
                continuation. CNIB-owned; mentioned on{" "}
                <Link href="/work">/work</Link>.
              </li>
              <li>
                <Link href="/paradise">Paradise</Link> &mdash;
                source-level multi-model static analysis in
                TypeScript; Bob-owned. The complementary branch
                to the runtime line above.
              </li>
            </ul>
            <p>
              <em>
                One name across twenty years. Three Bob-owned
                open-source tools across three different testing
                approaches.
              </em>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Install</h2>
            <p>
              No Chrome Web Store listing. The extension is
              distributed as a checkout of the source repo, loaded
              via Chrome&rsquo;s developer mode. The choice is
              deliberate &mdash; see the{" "}
              <Link href="/colophon">colophon</Link> for the
              rationale.
            </p>
            <ol>
              <li>
                Clone the repository:{" "}
                <code>git clone https://github.com/bobdodd/carnforth.git</code>
              </li>
              <li>
                Open Chrome and navigate to{" "}
                <code>chrome://extensions/</code>
              </li>
              <li>
                Enable <em>Developer mode</em> via the toggle in
                the top-right corner.
              </li>
              <li>
                Click <em>Load unpacked</em> and select the{" "}
                <code>chrome_plugin/</code> directory inside the
                cloned repository.
              </li>
              <li>
                A new <em>Accessible Names</em> panel will appear
                in Chrome DevTools (F12).
              </li>
            </ol>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Use</h2>
            <ol>
              <li>
                Open Chrome DevTools (F12) on any page.
              </li>
              <li>
                Switch to the <em>Accessible Names</em> panel.
              </li>
              <li>
                Click <em>Run Test</em> to analyse the page.
              </li>
              <li>
                View results organised by failures, warnings, and
                all elements; click an issue to see detail and
                highlight the element on the page; use{" "}
                <em>Inspect in Elements Panel</em> to jump to it.
              </li>
            </ol>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Relationship to the other tools</h2>
            <p>
              Three Bob-owned approaches to accessibility testing,
              each with its own scope and limits:
            </p>
            <ul>
              <li>
                <strong>Carnforth (this tool)</strong> &mdash;
                runtime, DOM-based, one criterion in depth.
                Browser-side; no network round-trips; written in
                plain JavaScript so the source is readable
                end-to-end.
              </li>
              <li>
                <Link href="/automated-testing">automated-testing</Link> &mdash;
                AI-driven, applied to specific classes of issue
                commercial tools cannot reach. Five PoCs with
                captured prompts, responses, and discussion.
              </li>
              <li>
                <Link href="/paradise">Paradise</Link> &mdash;
                source-level multi-model static analysis. The
                technically deepest of the three; parses HTML,
                JavaScript, and CSS into separate semantic models
                and reasons over the integrated structure.
              </li>
            </ul>
            <p>
              All three connect to the longer research arc in{" "}
              <Link href="/research">/research</Link> and to the{" "}
              <Link href="/research/2029-framework">
                2029 framework
              </Link>{" "}
              as the theoretical end of the line.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The a11yTO Accessibility Camp 2024 talk</h2>
            <p>
              Carnforth was the demonstration at a11yTO
              Accessibility Camp 2024. The talk framed the tool
              as a worked example of where the runtime accessible-
              name algorithm sits relative to source-level analysis
              and AI-driven testing &mdash; the same three-
              approach framing the tooling page now uses on the
              site.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Contribute</h2>
            <p>
              GPL-3.0; contributions welcome via pull request on{" "}
              <a href="https://github.com/bobdodd/carnforth">
                github.com/bobdodd/carnforth
              </a>
              . Issues against the accessible-name computation
              specifically are the highest-leverage place for
              external help; the test logic in{" "}
              <code>chrome_plugin/js/</code> is where most of the
              substance lives.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
