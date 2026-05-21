import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { ImageFigure } from "@/components/ImageFigure";
import { PTDTaskTree } from "@/components/PTDTaskTree";

export default function PTD() {
  return (
    <main id="main" className="site-main">
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
            <h1>Polymorphic Task Decomposition</h1>
            <p className="lede">
              A way of describing multiple manipulations of the same
              data so a capability model can choose the most
              appropriate route for the user&rsquo;s circumstances.
              The pre-requisite for intrinsic accessibility: without
              PTD-style task variation, the adaptation system has
              nothing to adapt between.
            </p>
          </header>

          <ImageFigure
            content={<PTDTaskTree />}
            frameN={16}
            frameD={9}
            contain
            triggerLabel="the PTD task tree"
            captionText="The canonical PTD example. The same underlying intention — Delete File — realised as two polymorphs: Direct Manipulation and Modal Dialogue, each with its own task ordering and its own leaf-level modality affordances. The capability model selects between polymorphs at runtime based on user, device, and operating context."
            caption={
              <>
                The canonical PTD example. The same underlying intention
                &mdash; <em>Delete File</em> &mdash; realised as two
                polymorphs: Direct Manipulation and Modal Dialogue, each
                with its own task ordering and its own leaf-level
                modality affordances. The capability model selects
                between polymorphs at runtime based on user, device, and
                operating context.
              </>
            }
          />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it is</h2>
            <p>
              Conventional task analysis names <em>the</em> task and
              its decomposition into steps. PTD names a task as the
              equivalence class of multiple <em>realisations</em> of
              the same underlying intention: direct manipulation
              versus modal dialogue, voice versus gesture,
              full-screen versus assistive overlay, keyboard versus
              pointer. Each realisation is a polymorph of the same
              underlying task.
            </p>
            <p>
              The capability model — see{" "}
              <Link href="/research/the-measure-of-accessibility/intrinsic-accessibility">
                Intrinsic Accessibility
              </Link>{" "}
              for the formal structure — selects from these
              polymorphs at runtime based on the user&rsquo;s
              capacity, the device&rsquo;s capabilities, and the
              operating context. Without PTD, the model has nothing to
              select from; with PTD, the underlying task is the
              invariant and the realisation is the variable.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why it matters</h2>
            <p>
              The bolt-on assistive technology approach assumes a
              single canonical realisation of every task and grafts
              alternative input or output onto it. PTD assumes the
              opposite: that multiple realisations exist{" "}
              <em>by design</em>, and the system chooses among them.
              That choice is what makes the whole framework
              intrinsically accessible rather than functionally
              accessible.
            </p>
            <p>
              Practical consequence:{" "}
              <Link href="/paradise">Paradise</Link>&rsquo;s analysers
              borrow PTD&rsquo;s vocabulary for &ldquo;there are
              several valid ways to express this; pick one and check
              the choice is consistent.&rdquo; The cross-file event-
              handler validation is exactly this — a click handler
              and a keyboard handler are two polymorphs of the same
              activation task, and the analyser checks they
              co-exist when both are needed.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/research/cisna-model">
                  The CISNA Model
                </Link>{" "}
                — the layered architecture inside which PTD-style
                alternatives are managed.
              </li>
              <li>
                <Link href="/research/the-measure-of-accessibility/intrinsic-accessibility">
                  Intrinsic Accessibility
                </Link>{" "}
                — the formal definition that PTD enables.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
