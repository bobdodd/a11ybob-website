import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";

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
              the PhD. Defined formally; executed by a Java reference
              implementation; soon to ship here as a TypeScript port
              that runs in your browser, with four worked examples.
              Demonstrates the Shlaer-Mellor lens in code, not just
              in description.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it is</h2>
            <p>
              Canonical Shlaer-Mellor expressed state-action decision
              logic as Action Data Flow Diagrams &mdash; which proved
              unmanageable in commercial practice. The PhD methodology
              kept the SM execution model but replaced ADFDs with a
              compact XML-based action notation, with a Java
              compiler/decompiler and a bidirectional execution
              engine.
            </p>
            <p>
              From the <em>Action Model Execution Engine</em>{" "}
              appendix:{" "}
              <em>
                &ldquo;The execution engine was designed to operate
                on the action language model directly without further
                compilation. The action language model was treated as
                if it were the stored program of a Threaded
                Interpreted Language (TIL) such as Forth.&rdquo;
              </em>
            </p>
            <p>
              That detail is worth keeping vivid: the first commercial
              language was Forth at Metal Box (1984&ndash;89). Twenty-
              five years later, the PhD&rsquo;s executable-
              specification runtime treats the Action Language model
              as a Forth-style threaded interpreter. The
              ActionLanguage IR in{" "}
              <Link href="/paradise/action-language">Paradise</Link>{" "}
              (current) is the same shape again. <em>Same execution
              model, four problem domains, four decades.</em>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Coming soon: four worked examples, in-browser</h2>
            <p>
              The plan is to ship four worked examples here, each
              with a four-pane layout: XML source, abstract syntax
              tree (the <code>walkDOM</code> output), execution trace
              (stack contents per step), and final output. The
              execution engine is being reimplemented in TypeScript
              and will run client-side; the Java reference
              implementation in the thesis remains the canonical
              behavioural specification.
            </p>
            <ol>
              <li>
                <strong>Fibonacci</strong> &mdash; the simplest. The
                same example used in the AMEE appendix to validate
                the language. Demonstrates basic block-structured
                programming, function call, recursion, and the
                round-trip between XML source and execution trace.
              </li>
              <li>
                <strong>Conditional content selection.</strong> An
                accessibility-shaped if-then-else: <em>if user-
                capability includes vision, present visual metaphor;
                else, present sonic metaphor.</em>
              </li>
              <li>
                <strong>SM-style OOP with state migration.</strong>{" "}
                The notification lifecycle (Announcing &rarr;
                Dwelling &rarr; Expiring) implemented in Action
                Language with disjoint-complete subtypes.
              </li>
              <li>
                <strong>An adaptation example.</strong> A button
                rollover from the CISNA Adaptation Model notes &mdash;{" "}
                <em>USER ENTERS PROXIMITY OF NODE</em> triggering a
                bridge modification that changes the inventory-to-
                semantics mapping, with the same code adapting
                differently for visual vs sonic user profiles.
              </li>
            </ol>
            <p className="muted">
              <small>
                Track 4 of the site update plan. The TypeScript port
                of the execution engine is the engineering work
                gating the worked-example pages. Java reference
                tarball will be downloadable from this page for
                anyone who wants to run AL in a JVM.
              </small>
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
                  The Measure of Accessibility &mdash; the
                  Shlaer-Mellor lens
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
                — the modern descendant in active use for source-level
                JavaScript accessibility analysis.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
