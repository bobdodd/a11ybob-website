import Link from "next/link";
import dynamic from "next/dynamic";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { FIBONACCI_XML } from "./examples";

/* The four-pane playground is a client component (CodeMirror 6
 * and the engine are browser-only). Loaded with ssr:false so the
 * server-render of the page doesn't try to mount CodeMirror. The
 * fallback is a code block showing the same source so anyone with
 * JS off can still read the canonical example. */
const ALPlayground = dynamic(
  () => import("./ALPlayground").then((m) => m.ALPlayground),
  {
    ssr: false,
    loading: () => (
      <p className="muted">
        <small>Loading the Action Language playground&hellip;</small>
      </p>
    ),
  },
);

export default function ActionLanguageResearch() {
  return (
    <main id="main" className="site-main" data-zone="knowledge">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <ResearchSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Action Language</h1>
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
              runtime treated the Action Language model as a Forth-
              style threaded interpreter. The ActionLanguage IR in{" "}
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
                <strong>XML source</strong> &mdash; the program text.
                Editable; press <strong>Run</strong> to re-execute,{" "}
                <strong>Reset</strong> to restore the canonical
                source.
              </li>
              <li>
                <strong>Action tree</strong> &mdash; the parsed
                action hierarchy. Updates as you type, even before
                you press Run, so structural errors in the XML
                surface immediately.
              </li>
              <li>
                <strong>Execution trace</strong> &mdash; every step
                the engine took, indented by scope. Useful for
                seeing how recursion unwinds, how variables come
                into and leave scope, and where each value comes
                from.
              </li>
              <li>
                <strong>Output</strong> &mdash; what the program
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
            <ALPlayground initialSource={FIBONACCI_XML} />
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The other three examples</h2>
            <p className="muted">
              In progress. The next three worked examples will
              demonstrate conditional content selection (an
              accessibility-shaped if-then-else), Shlaer-Mellor-
              style OOP with state migration (the notification
              lifecycle), and an adaptation example (a button
              rollover from the CISNA Adaptation Model notes that
              changes its inventory-to-semantics mapping for visual
              vs sonic user profiles).
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/research/the-measure-of-accessibility/the-shlaer-mellor-lens">
                  The Measure of Accessibility &mdash; the Shlaer-
                  Mellor lens
                </Link>{" "}
                — the methodological substrate this code makes
                concrete.
              </li>
              <li>
                <Link href="/research/carnforth-model">
                  The Carnforth Model
                </Link>{" "}
                — the five-layer architecture that Action Language
                operates inside.
              </li>
              <li>
                <Link href="/paradise/action-language">
                  Paradise: ActionLanguage IR
                </Link>{" "}
                — the modern descendant in active use for source-
                level JavaScript accessibility analysis.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
