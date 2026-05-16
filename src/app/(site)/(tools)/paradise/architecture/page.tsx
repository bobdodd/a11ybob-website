import Link from "next/link";
import type { CSSProperties } from "react";
import { ParadiseSubNav } from "@/components/ParadiseSubNav";

export default function ParadiseArchitecture() {
  return (
    <main id="main" className="site-main">
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
            <h1>Architecture</h1>
            <p className="lede">
              Paradise parses HTML, JavaScript, and CSS into three
              specialised semantic models, merges the three through CSS
              selectors into a single integrated DocumentModel, and runs
              its analysers over that. The architecture is what makes
              cross-file accessibility analysis tractable: a handler in
              <code> handlers.js</code>, an element in{" "}
              <code>index.html</code>, and a class in{" "}
              <code>styles.css</code> become one element with one set of
              behaviours that the analysers can reason about together.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Three semantic models, merged</h2>
            <p>
              The three model types are independent of each other: the
              DOMModel captures HTML structure and ARIA attributes, the
              ActionLanguage tree captures JavaScript behaviours, and
              the CSSModel captures style declarations and selector
              specificity. Each is built by a parser that knows only
              its own source language. The integration happens in the
              DocumentModel, which uses CSS selectors as the joining
              key — the same selectors that the browser would use to
              decide which styles apply to which element.
            </p>
            <figure
              className="stack"
              style={{ "--space": "var(--s-2)" } as CSSProperties}
            >
              <pre aria-hidden="true">
                <code>{ARCHITECTURE_DIAGRAM}</code>
              </pre>
              <figcaption className="muted">
                <small>
                  DOMModel and CSSModel feed the integrated DocumentModel
                  directly; the ActionLanguage tree feeds it through the
                  selectors its handlers target. The diagram is decorative
                  for sighted readers; the prose above conveys the same
                  structure for screen readers.
                </small>
              </figcaption>
            </figure>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>DOMModel</h2>
            <p>
              The DOMModel captures the static structure of the HTML —
              elements, their attributes, their parent-child
              relationships, their ARIA roles, properties, and states.
              It is parsed from the source HTML, not from a rendered
              browser DOM. That distinction matters: the source DOM is
              what an author wrote, before JavaScript has had a chance
              to mutate it. Source-level analysis catches issues the
              author can fix at the source level, where they belong.
            </p>
            <p>
              The DOMModel also tracks the <em>accessibility tree</em>{" "}
              implications of each element — the role each element
              would expose to assistive technology, the accessible name
              and description it would carry, the keyboard
              interactions it would respond to by default. That
              computed view is what the analysers reason about when
              they ask &ldquo;does this element behave the way an
              assistive-tech user would expect?&rdquo;.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>ActionLanguage</h2>
            <p>
              The ActionLanguage tree captures the{" "}
              <em>semantic behaviour</em> of the JavaScript — what each
              statement does, not just how it&rsquo;s spelled. A loop
              becomes an iteration node. A closure becomes a binding
              node. A call to <code>addEventListener</code> becomes a
              registration node tied to the selector it targets. Two
              JavaScript fragments that have the same effect collapse
              to the same ActionLanguage tree, even when their syntax
              differs.
            </p>
            <p>
              The shape of the intermediate representation (IR) descends
              directly from work I did on adaptive user interfaces in 2010; the form is treated in
              detail on{" "}
              <Link href="/paradise/action-language">
                ActionLanguage IR
              </Link>{" "}
              (in progress) and the research lineage on{" "}
              <Link href="/paradise/lineage">Lineage</Link>.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>CSSModel</h2>
            <p>
              The CSSModel captures the cascade — every selector, every
              declaration block, every media query, with specificity and
              source order preserved. It can answer questions of the
              form &ldquo;under condition X, what styles apply to
              element Y?&rdquo; without rendering the page. That
              matters for accessibility because behaviours like
              <code> display: none</code>, <code>visibility: hidden</code>
              , and <code>pointer-events: none</code> change whether an
              element is reachable to keyboard and screen-reader users
              — and those declarations can sit in a different file from
              the element they affect.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The merge step: DocumentModel</h2>
            <p>
              The three models are integrated into a single
              DocumentModel by walking the DOMModel and resolving each
              element against the other two. For an element, the merge
              produces:
            </p>
            <ul>
              <li>
                The element&rsquo;s computed style at default viewport
                / media-query state, from the CSSModel.
              </li>
              <li>
                The handlers attached to it — directly via
                <code> on*</code> attributes, via JavaScript in the
                ActionLanguage tree, or indirectly via event delegation
                on an ancestor — from selector resolution.
              </li>
              <li>
                The ARIA relationships into and out of it: which
                elements name it via <code>aria-labelledby</code>, which
                it controls via <code>aria-controls</code>, which its
                <code> aria-describedby</code> targets, all matched
                against the actual elements in the DOMModel.
              </li>
              <li>
                The focus path it sits on — its{" "}
                <code>tabindex</code>, its visible/focusable state under
                CSS, its position in source order.
              </li>
            </ul>
            <p>
              Once an element carries all of that information, the
              analysers can ask cross-cutting questions in plain terms.
              <em> Is this <code>onclick</code> handler also reachable
              by keyboard?</em> — yes if the same selector also has a
              <code>keydown</code> handler in the ActionLanguage tree.{" "}
              <em>Does this <code>aria-labelledby</code> point at an
              element that exists?</em> — yes if the target id resolves
              against the DOMModel.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Worked example: a handler split across files</h2>
            <p>
              The single example that motivates the multi-model
              architecture more than any other. Three files:
            </p>
            <pre>
              <code>{HTML_EXAMPLE}</code>
            </pre>
            <pre>
              <code>{JS_EXAMPLE}</code>
            </pre>
            <pre>
              <code>{CSS_EXAMPLE}</code>
            </pre>
            <p>
              An AST-pattern linter sees three files independently. The
              HTML linter flags the <code>&lt;div onclick&gt;</code> as a
              non-button click target. The JavaScript linter sees a
              file of event-handler code with no associated HTML. The
              CSS linter sees a class definition with no consumer. Each
              warning fires; the user weighs three independent
              complaints; no warning has the context to decide whether
              the situation is actually a problem.
            </p>
            <p>
              A rendered-DOM scanner does better — it sees the click
              handler attached, the keydown handler attached, the
              <code> role=&quot;button&quot;</code> applied. But it
              cannot tell whether the keydown handler ran <em>because
              the source had it</em> or because some test harness
              attached it; it cannot tell that the focus state breaks
              under <code>{".save:focus { display: none; }"}</code>{" "}
              because that state is one user-action away from the
              snapshot it captured.
            </p>
            <p>
              Paradise sees all three files at once. The DOMModel
              records the <code>&lt;div&gt;</code> with{" "}
              <code>id=&quot;save&quot;</code> and{" "}
              <code>role=&quot;button&quot;</code>. The ActionLanguage
              tree records two registrations on{" "}
              <code>#save</code>: a click handler and a keydown handler
              that fires on Enter or Space. The CSSModel records that
              <code> .save:focus</code> sets <code>display: none</code>.
              The DocumentModel composes these and the analysers report
              one issue, in plain terms: the keyboard-equivalent
              handler is in place, but the element disappears the
              moment it receives focus, so it is not actually keyboard-
              reachable. That issue cannot be detected in any single
              file.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What the architecture enables</h2>
            <p>
              Categorically, the kinds of analysis Paradise can run that
              single-file or rendered-DOM tools struggle with:
            </p>
            <ul>
              <li>
                <strong>Cross-file event-handler validation.</strong>{" "}
                Click + keyboard equivalents that aren&rsquo;t in the
                same source file.
              </li>
              <li>
                <strong>ARIA relationship validation.</strong>{" "}
                <code>aria-labelledby</code>,{" "}
                <code>aria-describedby</code>, <code>aria-controls</code>,
                <code> aria-owns</code> all checked against the actual
                elements that should exist.
              </li>
              <li>
                <strong>Visibility-focus conflicts.</strong> Elements
                that take focus but are hidden by CSS — by{" "}
                <code>display: none</code>, by <code>visibility: hidden</code>
                , by zero-size dimensions, or by being clipped off-screen.
              </li>
              <li>
                <strong>Focus-order reasoning.</strong>{" "}
                <code>tabindex</code> values across the page, evaluated
                as a global ordering rather than per-element local
                values.
              </li>
              <li>
                <strong>Framework-aware patterns.</strong> React hooks
                and portals, Vue reactivity, Svelte directives, Angular
                bindings — patterns where the same accessibility rule
                needs different evidence to verify.
              </li>
              <li>
                <strong>WAI-ARIA widget patterns.</strong> All
                twenty-one canonical patterns — combobox, dialog, tree,
                grid, etc. — checked end-to-end including the
                JavaScript that actually wires them up.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Confidence is a first-class concept</h2>
            <p>
              Every issue Paradise reports carries a{" "}
              <strong>confidence level</strong> alongside its severity:
              one of <code>HIGH</code>, <code>MEDIUM</code>, or{" "}
              <code>LOW</code>, plus a short human-readable reason
              (&ldquo;all three sources present&rdquo;,
              &ldquo;handler resolution depends on dynamically-bound{" "}
              <code>this</code>&rdquo;, &ldquo;CSS rule applies through
              a selector that may be outscored at runtime&rdquo;).
              Confidence reflects the engine&rsquo;s certainty given
              the source it actually has — not the severity of the
              underlying issue. A HIGH-confidence{" "}
              <em>info</em> finding is often more actionable than a
              LOW-confidence <em>error</em>, because the engine is
              telling you it&rsquo;s sure about the smaller thing and
              guessing about the larger one.
            </p>
            <p>
              The level resolves to a numeric percentage that surfaces
              expose to users: in the{" "}
              <Link href="/playgrounds/paradise">Playground</Link>, every issue
              card shows a confidence percentage; in the VS Code
              plugin, the hover popup carries the same number. The
              percentage is derived from the level <em>and</em> the
              document context the analyser had available — a finding
              that runs over a complete HTML document gets a higher
              percentage than the same finding over a body-only
              fragment, which gets a higher percentage than the same
              finding over a bare fragment with no{" "}
              <code>&lt;body&gt;</code>. A full document at HIGH is
              100%; a fragment at LOW is 40%. The mapping is
              calibrated against the engine&rsquo;s evaluation corpus
              so the numbers carry information rather than reading as
              decoration.
            </p>
            <p>
              Most accessibility tools suppress uncertainty: a finding
              is either reported or it isn&rsquo;t, with no signal of
              how sure the tool was. The hidden cost is that
              everything reported reads as equally weighted, so users
              triage by severity alone — and the noisiest analysers
              (low-precision rules with high recall) drown out the
              signals. By exposing confidence as a first-class field,
              Paradise lets users sort, filter, and judge findings the
              way the engine actually saw them. Filter to
              HIGH-confidence-only on a triage pass; sweep through
              LOW-confidence findings as a separate audit; never see
              the two collapsed into one undifferentiated stream.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Suggested fixes alongside diagnostics</h2>
            <p>
              For many issues, the engine emits a{" "}
              <strong>suggested fix</strong> alongside the diagnostic
              — a short description of the change, a code suggestion,
              and (when known) the file the suggestion belongs in.
              Fixes are engine-emitted, surface-applied: the{" "}
              <Link href="/playgrounds/paradise">Playground</Link> renders them
              in a Fix dialog with Apply-to-editor and Copy buttons;
              the VS Code plugin exposes them as Quick Fixes via the
              standard Code Actions / lightbulb affordance; a CI
              consumer can iterate over <code>issue.fix</code>{" "}
              programmatically and apply in batch.
            </p>
            <p>
              The fix payload is a starting point, not a guaranteed
              correction. Paradise reports what to write but
              doesn&rsquo;t always know <em>where</em> to write it:
              the engine emits the corrective code and the file it
              probably belongs in, but it doesn&rsquo;t indicate
              whether to insert, replace, or append at a specific
              line. Surfaces apply best-effort (the Playground
              currently appends to the named file) and surface that
              limitation in the UI prose so users review before
              committing. Fixes are most reliable for self-contained
              changes — an{" "}
              <code>aria-label</code> to add to a button, a{" "}
              <code>keydown</code> handler to mirror an existing{" "}
              <code>click</code>, a CSS rule to delete. They are less
              reliable when the correction depends on surrounding
              context the engine can&rsquo;t resolve from source
              alone.
            </p>
            <p>
              Honest framing matters here. A &ldquo;one-click
              autofix&rdquo; promise that lands the wrong code in the
              wrong place is worse than no autofix — it amplifies
              user mistakes rather than reducing them. Paradise
              reports the fix it knows, names the limitation in the
              same UI element, and lets the user choose whether to
              accept it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What&rsquo;s hard, what&rsquo;s deferred</h2>
            <p>
              The architecture has limits, and the honest framing is
              important. Source-level analysis cannot see content
              fetched at runtime — third-party widgets injected into
              iframes, dynamic modules whose source isn&rsquo;t present
              at scan time, content streamed in from a server in
              response to user interaction. For those, runtime tools
              like <em>autoA11y</em> are the right answer, not Paradise.
            </p>
            <p>
              Within the source-level scope, the harder problems
              Paradise still works on are: dynamic CSS class assignment
              (a handler that adds <code>.is-open</code> to an element
              changes its visibility, but only conditionally); event
              delegation through complex parent chains (a handler on
              <code> document.body</code> that switches on{" "}
              <code>e.target</code>); template-driven HTML (React JSX,
              Vue templates) where the rendered structure is itself a
              function of state. Each of these has partial coverage in
              the current analysers; each is being tightened over time.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/paradise/action-language">
                  ActionLanguage IR
                </Link>{" "}
                — the form of the tree, with worked example (in
                progress).
              </li>
              <li>
                <Link href="/paradise/lineage">Lineage</Link> — where
                this architecture came from in the PhD-era research.
              </li>
              <li>
                <Link href="/paradise">Back to Paradise</Link>.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

const ARCHITECTURE_DIAGRAM = `┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  DOMModel   │────▶│  DocumentModel   │◀────│  CSSModel   │
│  (HTML)     │     │   (Integration)  │     │  (Styles)   │
└─────────────┘     └──────────────────┘     └─────────────┘
                             ▲
                             │
                    ┌────────┴────────┐
                    │ ActionLanguage  │
                    │  (JavaScript)   │
                    └─────────────────┘`;

const HTML_EXAMPLE = `<!-- index.html -->
<div id="save" class="save" role="button" tabindex="0">
  Save
</div>`;

const JS_EXAMPLE = `// handlers.js
const save = document.getElementById("save");

save.addEventListener("click", () => {
  doSave();
});

save.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    doSave();
  }
});`;

const CSS_EXAMPLE = `/* styles.css */
.save {
  cursor: pointer;
  padding: 0.5rem 1rem;
}

.save:focus {
  /* Bug: hides the button the moment it receives focus. */
  display: none;
}`;
