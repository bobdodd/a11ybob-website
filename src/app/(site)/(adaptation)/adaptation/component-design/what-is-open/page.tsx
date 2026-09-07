import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ComponentDesignSubNav } from "@/components/ComponentDesignSubNav";

export const metadata: Metadata = {
  title: "What is still open",
};

export default function WhatIsOpen() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <ComponentDesignSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>What is still open</h1>
            <p className="lede">
              Six questions I cannot answer yet, and the thirteen
              concepts this work puts into the specification. The
              questions are recorded here rather than resolved quietly,
              because a design system that hides its own uncertainty is
              the failure this whole section is about.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where composition predicates live</h2>
            <p>
              Should the predicates sit in each component contract, in a
              separate composition clause of the package, or in both?
              Duplication risks drift between the two records.
              Separation risks a contract that cannot be validated on
              its own, which undermines the case for portability. I
              currently lean towards the component contract holding its
              own local rules and the package holding the cross-cutting
              ownership assignments, but I have not tested that against
              a real assembly.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Two design systems on one page</h2>
            <p>
              How is ownership expressed when a page assembles
              components from two design systems? There has to be
              either a merge rule for the single-owner properties
              (focus, keyboard grammar, live-region priority, landmark
              identity) or an honest statement that dual-system use is
              simply out of conformance. The second is cleaner and much
              less useful, since acquisitions, migrations and embedded
              third-party widgets make dual-system pages ordinary.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The minimum evidence set at page level</h2>
            <p>
              What is the minimum evidence for a page-level claim, and
              can any of it be inherited from component level? The
              argument in this section suggests inheritance is unsound
              in general, but a rule that inherits nothing makes
              page-level evidence prohibitively expensive and therefore
              unlikely to be produced at all. There may be a class of
              guarantee (contrast of a token, say) that genuinely does
              survive, and identifying that class is worth doing.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Whether uncertainty has a severity scale</h2>
            <p>
              Is uncertainty binary, or graded? &ldquo;Unverified on
              VoiceOver&rdquo; and &ldquo;unverified on a browser
              nobody uses&rdquo; are not the same risk, but a scale
              invites false precision and becomes a negotiating
              surface: the point at which a team argues its way down a
              level rather than running the test.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Profile-selected variants and server rendering</h2>
            <p>
              If capability and preference select the variant, and the
              profile is not known at render time, what does the server
              send? Sending a default and re-rendering on the client
              risks losing focus at exactly the moment the interface
              changes shape: the responsive navigation failure, moved
              to the network boundary.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A canonical accessibility-tree serialisation</h2>
            <p>
              Evidence at region and page level needs a stable
              representation of the accessibility tree to compare
              against. If no canonical serialisation exists that this
              work can cite, the project has to define one, which is a
              considerably larger undertaking than it first appears and
              one that would be better done by somebody else.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What this puts into the specification</h2>
            <p>
              Thirteen concepts follow from the argument, and they are
              the working list for the next revision of the{" "}
              <Link href="/adaptation/afds">design system</Link>.
            </p>
            <ol>
              <li>
                The composition hierarchy as a normative structure, with
                obligations defined per level.
              </li>
              <li>
                Composition contracts: allowed parents, required
                context, prohibited descendants, typed slots.
              </li>
              <li>
                Accessibility ownership: a single declared owner per
                subtree for semantics, focus, keyboard grammar,
                announcements and layout adaptation.
              </li>
              <li>
                Conditional guarantees, each carrying preconditions and
                invalidation conditions. Nothing is unconditional.
              </li>
              <li>Non-union propagation, stated normatively.</li>
              <li>
                Conflict resolution: parent-level arbitration policies
                with a defined default.
              </li>
              <li>
                The state model, with its mapping to accessible
                expression and to focus and announcement consequences.
              </li>
              <li>
                Evidence scope: every record states its level and its
                environment.
              </li>
              <li>
                Uncertainty propagation: unresolved child uncertainty
                rises unless bounded.
              </li>
              <li>
                Override accounting: overrides name the guarantees they
                suspend.
              </li>
              <li>
                Content contracts: author obligations are testable, not
                advisory.
              </li>
              <li>
                Profile-selected variants: one requirement may
                legitimately resolve to different assemblies.
              </li>
              <li>
                Whole-result validation: the rendered page and the
                completed task remain the final units of accessibility,
                regardless of component provenance.
              </li>
            </ol>
            <p>
              Several of these are already present in the specification
              in weaker form. What this section changes is their
              status: they stop being desirable properties of a good
              component and become obligations that attach to the
              assembly.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>References</h2>
            <ul>
              <li>
                Design Tokens Community Group.{" "}
                <em>Design Tokens Format Module</em>.{" "}
                <a href="https://www.designtokens.org/tr/2025.10/format/">tr/2025.10/format</a>
              </li>
              <li>
                Open UI. <em>Open UI</em>.{" "}
                <a href="https://open-ui.org">open-ui.org</a>
              </li>
              <li>
                Bob Dodd.{" "}
                <em>
                  Component design frameworks and the assembly problem
                </em>
                .{" "}
                <a href="https://github.com/bobdodd/accessible-by-design/blob/main/research/COMPONENT-FRAMEWORKS.md">research/COMPONENT-FRAMEWORKS.md</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
