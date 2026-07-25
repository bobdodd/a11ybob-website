import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ADAPTATION_XML,
  CONDITIONAL_CONTENT_XML,
  FIBONACCI_XML,
  STATE_MIGRATION_XML,
} from "./examples";
import { ALPlaygroundLoader } from "./ALPlaygroundLoader";

export const metadata: Metadata = {
  title: "Action Language playground",
};

export default function ActionLanguagePlayground() {
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
            <h1>Action Language playground</h1>
            <p className="lede">
              The original XML notation and execution engine from
              the doctoral framework, ported to TypeScript and
              running in your browser. Worked examples that you can
              edit and re-execute, with the parsed action tree, the
              live execution trace, and the program output rendered
              alongside the source.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it is</h2>
            <p>
              Canonical Shlaer-Mellor expressed state-action
              decision logic as Action Data Flow Diagrams &mdash;
              which proved unmanageable in commercial practice. The
              doctoral methodology kept the SM execution model but
              replaced the diagrams with a compact XML-based action
              notation, with a Java compiler/decompiler and a
              bidirectional execution engine.
            </p>
            <p>
              The execution engine was designed to operate on the
              action language model directly, without further
              compilation. The action language model was treated as
              if it were the stored program of a Threaded
              Interpreted Language (TIL) such as Forth.
            </p>
            <p>
              That detail is worth keeping vivid: Bob&rsquo;s first
              commercial language was Forth at Metal Box
              (1984&ndash;89). Twenty-five years later, the
              doctoral framework&rsquo;s executable-specification
              runtime treated the Action Language model as a 
              Forth-style threaded interpreter. The ActionLanguage intermediate
              representation (IR) in{" "}
              <Link href="/paradise/action-language">Paradise</Link>{" "}
              today is the same shape again. <em>Same execution
              model, four problem domains, four decades.</em>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>How to read the playground</h2>
            <p>
              Each worked example below has four panes:
            </p>
            <ol>
              <li>
                <strong>XML source</strong>{" "}&mdash; the program text.
                Editable; press <strong>Run</strong>{" "}to re-execute,{" "}
                <strong>Reset</strong>{" "}to restore the canonical
                source.
              </li>
              <li>
                <strong>Action tree</strong>{" "}&mdash; the parsed
                action hierarchy. Updates as you type, even before
                you press Run, so structural errors in the XML
                surface immediately.
              </li>
              <li>
                <strong>Execution trace</strong>{" "}&mdash; every step
                the engine took, indented by scope. Useful for
                seeing how recursion unwinds, how variables come
                into and leave scope, and where each value comes
                from.
              </li>
              <li>
                <strong>Output</strong>{" "}&mdash; what the program
                printed (in order), plus the top-level return value
                if the program is an expression.
              </li>
            </ol>
            <p>
              The engine source is in{" "}
              <code>src/lib/action-language/</code>. No Java is
              loaded; the engine is a TypeScript port of the
              original Java reference, running entirely in your
              browser.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Example 1: Fibonacci</h2>
            <p>
              The simplest of the four worked examples. The same
              example used in the original Action Model Execution
              Engine appendix to validate the language. Demonstrates
              function declaration with late-bound constant
              parameters, conditional expressions, recursion, and
              the round-trip between XML source and execution
              trace.
            </p>
            <p>
              Try increasing the bounds of the print statements (the
              engine has a recursion-budget guard at 10,000 calls,
              so the page won&rsquo;t lock up if you push too far),
              or replacing the recursive definition with an iterative
              one to compare the trace shapes.
            </p>
            <ALPlaygroundLoader initialSource={FIBONACCI_XML} />
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Example 2: Conditional content selection</h2>
            <p>
              The accessibility-shaped if-then-else: pick a
              presentation metaphor based on a user-capability
              variable. The point of the example is not the 
              if-then-else itself (mechanically straightforward) but the way{" "}
              <em>the polymorphism lives in the data, not at the
              call site</em>. The same{" "}
              <code>present(modality)</code>{" "}call runs in both
              cases; the metaphor selection is internal. That is the
              shape of intrinsic accessibility&rsquo;s polymorphic
              task decomposition in microcosm.
            </p>
            <p>
              Try changing one of the modality strings to{" "}
              <code>&quot;haptic&quot;</code> — neither branch
              matches, the fallback fires.
            </p>
            <ALPlaygroundLoader initialSource={CONDITIONAL_CONTENT_XML} />
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Example 3: SM-style state migration</h2>
            <p>
              The notification lifecycle from the doctoral
              framework&rsquo;s Methodology chapter:{" "}
              <em>Announcing</em>{" "}&rarr; <em>Dwelling</em>{" "}&rarr;{" "}
              <em>Expiring</em>{" "}&rarr; <em>Gone</em>. The
              notification is the same instance through the
              transitions; what changes is its subtype, and each
              subtype renders differently.
            </p>
            <p>
              In a real Shlaer-Mellor implementation this would use
              disjoint-complete subtyping with formal role
              migration. The minimal version here models the state
              with a string variable and the per-state rendering
              with an if-cascade — the iteration shape and the
              behavioural sequence are the same; only the
              type-system formalism differs. The execution trace
              shows the migration explicitly: render, advance,
              render, advance, until the role reaches Gone and the
              loop terminates.
            </p>
            <ALPlaygroundLoader initialSource={STATE_MIGRATION_XML} />
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Example 4: Adaptation across user profiles</h2>
            <p>
              A button rollover that adapts its 
              inventory-to-semantics mapping for visual vs sonic user profiles.
              The same event &mdash; <em>USER ENTERS PROXIMITY OF
              NODE</em>{" "}&mdash; triggers different concrete
              realisations through the bridge function{" "}
              <code>on-proximity</code>; the abstract semantic
              outcome (the button is hover-active) is the same in
              both cases.
            </p>
            <p>
              This is the structure the CISNA Adaptation Model is
              for: an event in the underlying interface gets
              bridged through to different inventory selections per
              user-platform, and a single source of truth produces
              different output. The trace makes the shared
              semantics visible — both branches return{" "}
              <code>&quot;hover-active&quot;</code>{" "}as the abstract
              result, regardless of which inventory items were
              selected to produce it.
            </p>
            <ALPlaygroundLoader initialSource={ADAPTATION_XML} />
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/research/the-measure-of-accessibility/the-shlaer-mellor-lens">
                  The Measure of Accessibility &mdash; the 
                  Shlaer-Mellor lens
                </Link>{" "}
                — the methodological substrate this code makes
                concrete.
              </li>
              <li>
                <Link href="/research/cisna-model">
                  The CISNA Model
                </Link>{" "}
                — the five-layer architecture that Action Language
                operates inside.
              </li>
              <li>
                <Link href="/paradise/action-language">
                  Paradise: ActionLanguage IR
                </Link>{" "}
                — the modern descendant in active use for 
                source-level JavaScript accessibility analysis.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
