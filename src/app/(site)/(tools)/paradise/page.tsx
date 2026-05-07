import Link from "next/link";
import type { CSSProperties } from "react";
import { ParadiseSubNav } from "@/components/ParadiseSubNav";

export default function Paradise() {
  return (
    <main id="main" className="site-main" data-zone="tools">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <ParadiseSubNav />
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Paradise</h1>
            <p className="lede">
              A multi-model accessibility analyser for HTML, JavaScript, and
              CSS. It reasons about all three at once, in source, before the
              page renders — so it catches issues that single-file linters
              miss and reports issues that rendered-DOM scanners can&rsquo;t
              tell from intentional behaviour.
            </p>
            <p>
              The intermediate representation it builds,{" "}
              <strong>ActionLanguage</strong>, descends from work I started
              in 2010 on adaptive user interfaces — published in the W4A
              Carnforth Model paper, parked when I left academia for CNIB,
              and finished, fifteen years later, when source-level
              reasoning about JavaScript turned out to be exactly the
              missing piece for honest accessibility analysis.
            </p>
            <p className="muted">
              Paradise is a <em>platform</em> I continue to develop, not a
              finished commercial tool. Fourteen working analysers,
              twenty-one ARIA widget patterns validated, ninety-five
              passing tests, over ninety percent coverage. The VS Code
              plugin is in active development and not yet released on the
              Marketplace; a browser plugin version is planned. A working
              in-browser{" "}
              <Link href="/playground">Playground</Link> demonstrates what
              the analysers detect and serves as a template for anyone
              wanting to build their own analysis surface. MIT-licensed.
              Source on GitHub.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What Paradise is</h2>
            <p>
              Most accessibility tooling sees one slice of a web page.
              Linters like <em>eslint-plugin-jsx-a11y</em> read a JavaScript
              file in isolation and flag patterns that <em>might</em> be
              problems — they never see the HTML the handler actually
              attaches to. Browser-based scanners like axe, WAVE, and
              Lighthouse read the rendered DOM after JavaScript has run —
              they see the result, but they cannot tell whether a missing
              handler was an oversight in the source or an artefact of a
              code path the scanner did not trigger.
            </p>
            <p>
              Paradise reads the source. It parses HTML into a DOMModel,
              JavaScript into an ActionLanguage tree, and CSS into a
              CSSModel; it merges the three into a unified DocumentModel
              using CSS selectors as the joining key; and it runs its
              analysers over the integrated structure. A button defined in{" "}
              <code>index.html</code>, given a click handler in{" "}
              <code>handlers.js</code>, hidden by a CSS class in{" "}
              <code>styles.css</code>, is one element to Paradise. Its
              analysers reason about that single element across all three
              files at once.
            </p>
            <p>
              The current set covers cross-file event-handler validation,
              ARIA relationship validation, focus-management validation,
              all twenty-one WAI-ARIA widget patterns, and
              framework-specific patterns for React, Vue, Svelte, and
              Angular. Most ship as multi-model analysers that require all
              three sources together. A few work on JavaScript alone —
              useful as a fallback when the corresponding HTML
              isn&rsquo;t available.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What&rsquo;s different about it</h2>
            <p>
              Three families of accessibility analysis tools, in the order
              they appear in most projects:
            </p>

            <ComparisonTable />

            <p>
              The cost of seeing only one slice is <em>false positives</em>.
              An AST linter flags a <code>&lt;div onclick&gt;</code> even
              when the handler in another file is keyboard-accessible. A
              rendered-DOM scanner flags a missing{" "}
              <code>aria-labelledby</code> target because the JavaScript
              that injects it runs on a code path the scanner didn&rsquo;t
              trigger. Both tools are noisy enough that practitioners
              learn to ignore their output — which means real issues hide
              in the noise.
            </p>
            <p>
              Paradise&rsquo;s measured false-positive reduction against
              axe and ESLint-jsx-a11y on the test corpus is{" "}
              <strong>88%</strong>. The methodology and the case studies
              live on the evidence page (in progress).
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The ActionLanguage intermediate representation</h2>
            <p>
              The technical contribution. Most JavaScript analysis works
              on the abstract syntax tree — what was <em>written</em>.
              Paradise&rsquo;s ActionLanguage works on a tree of
              actions — what the program <em>does</em>. A loop over an
              array becomes an iteration node; a closure over a variable
              becomes a binding node; an <code>addEventListener</code>{" "}
              becomes a registration node tied to the selector it targets.
            </p>
            <p>
              The form of the tree comes directly from my PhD-era work on
              adaptive user interfaces, where it described the executable
              semantics of small algorithm fragments that could be
              substituted at runtime to suit a particular user. The same
              shape — actions in a tree, sequenced, with attributes —
              turned out to be exactly what was needed to reason about
              runtime accessibility behaviour from source. The IR is
              annotated enough to recover original line numbers for
              diagnostics, but abstract enough that two
              semantically-equivalent JavaScript fragments collapse to
              the same tree.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Status, scope, and what it does not do</h2>
            <ul>
              <li>
                <strong>Working analysers</strong> for the families
                listed above. Detail page in progress.
              </li>
              <li>
                <strong>VS Code plugin</strong> in active development.
                Available as a <code>.vsix</code> from the source repo;
                not yet on the Marketplace.
              </li>
              <li>
                <strong>Browser plugin</strong> planned, not yet built.
              </li>
              <li>
                <strong>CI use</strong> via the analyser engine consumed
                as a Node library.
              </li>
              <li>
                <strong>Honest limitations.</strong> Paradise does not see
                things that only exist at runtime — third-party widgets
                injected into iframes, dynamically loaded modules whose
                source isn&rsquo;t present, content fetched at interaction
                time. For those, runtime tools win.{" "}
                <em>autoA11y</em> is the runtime complement; its history
                (academic origins, multiple lineages including a
                commercial CNIB version) belongs on the research page.
              </li>
              <li>
                <strong>Not a replacement for human review.</strong> Like
                every other tool in this space, Paradise reports what it
                can detect, not everything that matters.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Source, licence, citation</h2>
            <p>
              Paradise is open source on GitHub, currently in the{" "}
              <a href="https://github.com/bobdodd/phd/tree/main/Action%20Language">
                <code>Action Language/</code> subdirectory of bobdodd/phd
              </a>
              . A move to its own top-level repo is planned but not yet
              done.
            </p>
            <p>
              Licence: MIT for the analyser engine and the VS Code plugin.
              The companion documentation pages (this page and the
              <code> /paradise/* </code>
              sub-pages) are CC BY-SA 4.0 alongside the rest of{" "}
              <em>a11ybob.com</em>.
            </p>
            <p>
              The W4A 2010 paper underlying the ActionLanguage tree shape:{" "}
              <a href="https://dl.acm.org/doi/10.1145/1805986.1806008">
                Dodd, Green &amp; Pearson — <em>The Carnforth Model of
                Accessible Adaptive Hypermedia</em>
              </a>
              .
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>More</h2>
            <ul>
              <li>
                <Link href="/paradise/lineage">Lineage</Link> — the
                PhD-era work, the W4A 2010 Carnforth Model paper, where
                ActionLanguage came from, and the relationship with
                autoA11y.
              </li>
              <li>
                <Link href="/paradise/architecture">Architecture</Link>{" "}
                — the multi-model approach in detail, with a worked
                example of cross-file analysis.
              </li>
              <li>
                <Link href="/paradise/action-language">
                  ActionLanguage IR
                </Link>{" "}
                — the form of the tree, the model entities, and a
                worked JS-to-IR translation.
              </li>
              <li>
                <Link href="/paradise/analysers">Analysers</Link> — the
                fourteen accessibility analysers that ship with Paradise,
                grouped by family, each with its own page.
              </li>
              <li>
                <Link href="/paradise/widget-patterns">
                  Widget patterns
                </Link>{" "}
                — the twenty-one canonical WAI-ARIA widget patterns, with
                expected roles, states, and keyboard interactions for each.
              </li>
              <li>
                <Link href="/paradise/evidence">Evidence</Link> — the
                88% number, the corpus and methodology behind it, and
                where Paradise still misses.
              </li>
              <li>
                <Link href="/paradise/vscode-extension">
                  VS Code plugin
                </Link>{" "}
                — install, configure, use; current release status and
                the planned browser plugin.
              </li>
              <li>
                <Link href="/paradise/cite">Cite</Link> — suggested
                citation, BibTeX entries for Paradise and the W4A 2010
                paper.
              </li>
              <li>
                <Link href="/playground">Playground</Link> — the
                in-browser surface running Paradise&rsquo;s analysers.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

/* Comparison of the three families of accessibility analysis tooling.
 * Element-level styling lives in base.css (table/th/td defaults);
 * row-header colour and width live in components/comparison-table.css;
 * the wrapping .scroll-region handles narrow-viewport overflow as a
 * proper accessible region (role + aria-label + tabindex so keyboard
 * users can scroll it and screen readers announce it). */
function ComparisonTable() {
  return (
    <div
      className="scroll-region"
      role="region"
      aria-label="Comparison of accessibility analysis tools"
      tabIndex={0}
    >
      <table className="comparison-table">
        <thead>
          <tr>
            {/* Empty corner. Row-headers below provide the context for
                each row, so this cell is intentionally blank — SRs read
                "Examples · eslint-plugin-jsx-a11y · …" without it. */}
            <th scope="col" aria-hidden="true" />
            <th scope="col">AST-pattern linters</th>
            <th scope="col">Rendered-DOM scanners</th>
            <th scope="col">Paradise</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Examples</th>
            <td>eslint-plugin-jsx-a11y</td>
            <td>axe, WAVE, Lighthouse</td>
            <td>Paradise</td>
          </tr>
          <tr>
            <th scope="row">What it reads</th>
            <td>one file&rsquo;s AST</td>
            <td>the rendered DOM</td>
            <td>source HTML + JS + CSS</td>
          </tr>
          <tr>
            <th scope="row">Sees source intent</th>
            <td>yes</td>
            <td>no</td>
            <td>yes</td>
          </tr>
          <tr>
            <th scope="row">Sees runtime effects</th>
            <td>no</td>
            <td>yes</td>
            <td>yes (via the IR)</td>
          </tr>
          <tr>
            <th scope="row">Cross-file reasoning</th>
            <td>no</td>
            <td>n/a (one DOM only)</td>
            <td>yes</td>
          </tr>
          <tr>
            <th scope="row">Framework-aware</th>
            <td>partially</td>
            <td>no</td>
            <td>yes</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
