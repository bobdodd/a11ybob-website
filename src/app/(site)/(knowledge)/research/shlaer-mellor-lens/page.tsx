import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";

export default function ShlaerMellorLens() {
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
            <h1>The Shlaer-Mellor lens</h1>
            <p className="lede">
              Recursive design as accessibility. Bridged semantic
              information domains rendered concrete by a model
              compiler for given user-and-environment constraints.
              The methodological substrate beneath everything else
              on this page.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The structural claim</h2>
            <p>
              <em>Accessibility is a recursive-design problem.</em>{" "}
              That is: it has the same shape as the problem
              Shlaer-Mellor Object-Oriented Analysis and Design was
              built to solve — bridged semantic information domains
              rendered concrete by a model compiler for given
              platform constraints.
            </p>
            <p>
              In Shlaer-Mellor, you analyse a system as a collection
              of independent-but-related problem domains, each with
              its own subject matter, joined by formal bridges. The
              abstract analysis is then <em>translated</em> (not
              elaborated) into a concrete realisation for a specific
              platform via a model compiler. Same domains, different
              concrete realisations for different targets — that is
              recursive design.
            </p>
            <p>
              Accessibility has the same structure with different
              vocabulary. The domains are content-semantics,
              navigation, modality (visual / sonic / haptic), user
              capability, device capacity, environment, custom-and-
              practice. The &ldquo;platform&rdquo; you are targeting
              is <em>the user-plus-environment</em>. The model
              compiler is the adaptation system that selects
              appropriate inventory and presentation for that user-
              and-environment context.
            </p>
            <p>
              <em>Functional accessibility</em> is achieving one
              successful traversal of the bridges to land on a usable
              concrete realisation. <em>Intrinsic accessibility</em>{" "}
              is the property of an underlying interface that admits
              many such traversals for many user-platforms.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The forty-year lineage</h2>
            <p>
              This is not retrospective rationalisation. The lens has
              been the central engineering vocabulary across four
              decades and four problem domains:
            </p>
            <ul>
              <li>
                <strong>Forth at Metal Box (1984&ndash;89).</strong>{" "}
                The threaded-interpreter execution model that, twenty-
                five years later, became how the PhD&rsquo;s Action
                Language runtime executed.
              </li>
              <li>
                <strong>Shlaer-Mellor from 1989 onward.</strong>{" "}
                OOA/D, domain charts, bridges, assigner state models,
                subtyping with role migration, action specification
                languages, model compilation.
              </li>
              <li>
                <strong>Ascom AG (1994&ndash;96).</strong> SM in
                production with Tcl simulation. A bridge-extension
                contribution from this period — describing
                inter-domain dependencies as sequences of interactions
                across domain boundaries — was carried into the
                thesis methodology.
              </li>
              <li>
                <strong>Nokia Mobile (1997&ndash;2001).</strong>{" "}
                Adaptive UIs as recursive design. Self-adapting
                interfaces moving across devices of varying
                capability.
              </li>
              <li>
                <strong>PhD (2004&ndash;13).</strong> SM applied
                explicitly to accessibility, with the bridge-
                composition contribution and the Forth-style
                threaded-interpreter Action Language execution engine.
              </li>
              <li>
                <strong>
                  <Link href="/paradise">Paradise</Link> (current).
                </strong>{" "}
                The ActionLanguage IR for source-level accessibility
                analysis. The same shape again.
              </li>
            </ul>
            <p>
              <em>
                One continuous engineering project, applied to four
                problem domains.
              </em>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Specific mappings to accessibility</h2>
            <ul>
              <li>
                <strong>Domain charts</strong> &rarr; the{" "}
                <Link href="/research/carnforth-model">
                  Carnforth five-layer model
                </Link>{" "}
                (Adaptation / Navigation / Semantics / Inventory /
                External Content), with peer relationships between
                domains rather than the canonical SM client-server
                hierarchy.
              </li>
              <li>
                <strong>Bridges between domains</strong> &rarr;
                Inventory&#x2194;Semantics and
                Semantics&#x2194;Navigation in CISNA, expressing how
                meaning composes upward from raw content to adapted
                presentation.
              </li>
              <li>
                <strong>Assigner state models for resource competition</strong>{" "}
                &rarr; modality-channel competition (audio channel:
                incoming-call earcon vs. new-message earcon vs.
                voice-note recording).
              </li>
              <li>
                <strong>
                  Subtyping with role migration (disjoint-complete)
                </strong>{" "}
                &rarr; transcoding sequences. A notification migrates
                Announcing &rarr; Dwelling &rarr; Expiring while
                remaining the same notification, with adapted forms of
                each state for different modalities.
              </li>
              <li>
                <strong>State Transition Tables</strong> with
                &ldquo;Can&rsquo;t Happen&rdquo; and
                &ldquo;Ignore&rdquo; entries &rarr; user-capability-
                specific exception handling expressed per user
                profile.
              </li>
              <li>
                <strong>Action Specification Language</strong> &rarr;
                the{" "}
                <Link href="/playgrounds/action-language">
                  Action Language
                </Link>{" "}
                XML notation, with Forth-style threaded-interpreter
                execution.
              </li>
            </ul>
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
                — substantive in-depth treatment as page 5 of the
                Measure sub-collection.
              </li>
              <li>
                <Link href="/playgrounds/action-language">
                  Action Language
                </Link>{" "}
                — running code, with the in-browser TypeScript port
                and four worked examples that demonstrate the lens in
                code.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
