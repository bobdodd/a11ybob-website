import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ComponentDesignSubNav } from "@/components/ComponentDesignSubNav";

export const metadata: Metadata = {
  title: "What this means for a design system",
};

const NON_UNION = `G(P) = V( R(P), C1..Cn, X, E )

G(P)      the guarantees of the parent composition P
R(P)      the parent's own composition rules
C1..Cn    the children, with their declared guarantees
X         the context: content, viewport, language, platform, profile
E         the applicable evidence
V         validation against the design system`;

export default function WhatThisMeans() {
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
            <h1>What this means for a design system</h1>
            <p className="lede">
              If accessibility does not survive composition, a design
              system cannot be a catalogue of accessible parts. It has
              to be a composition contract: a record of what may be
              assembled with what, who owns which responsibility, and
              what has to be evidenced again at each boundary.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A composition contract</h2>
            <p>
              A design system is the artefact describing the rendering
              and interaction rules selected for a particular interface,
              driven by user capability, user preference and application
              need. In the assembly context that makes it a composition
              contract and a decision record, and it must be able to
              answer twelve questions.
            </p>
            <ol>
              <li>Which components may be used at all in this instance.</li>
              <li>
                Which variant of each has been selected, and why.
              </li>
              <li>
                Which components may contain which others, and which
                containments are prohibited.
              </li>
              <li>
                What semantics each component owns, and what it
                delegates upward or to the author.
              </li>
              <li>
                Which component owns focus in each interaction state.
              </li>
              <li>
                How the keyboard grammar resolves when components nest.
              </li>
              <li>
                Which region owns status announcements, at what
                priority, and which child announcements are suppressed.
              </li>
              <li>
                How the components reflow together, not just
                individually.
              </li>
              <li>
                What obligations remain with the author and with the
                integrator.
              </li>
              <li>
                Which assembled configurations have evidence, and of
                what kind.
              </li>
              <li>
                Which combinations are prohibited, which are
                unsupported, and which are merely uncertain.
              </li>
              <li>
                What must be retested at region, page and process
                level.
              </li>
            </ol>
            <p>
              I want to be careful about what this buys, because the
              ambition can easily be overstated. A design system does
              not make arbitrary assembly safe. It constrains assembly
              to the combinations for which the selected rules and the
              available evidence are sufficient, and it makes the
              remainder visible instead of silent. That is a smaller
              claim than &ldquo;the system is accessible&rdquo;, and it
              is one that can actually be defended.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Guarantees do not union</h2>
            <p>
              This is the single most important formal point, and the
              one I am carrying into the specification. The guarantees
              of a parent composition are not the union of the
              guarantees of its children.
            </p>
            <div className="scroll-region" tabIndex={0}>
              <pre>
                <code>{NON_UNION}</code>
              </pre>
            </div>
            <p>
              A child guarantee propagates upward only if all of the
              following hold:
            </p>
            <ul>
              <li>
                its declared preconditions are still true after
                assembly;
              </li>
              <li>
                the parent has not overridden the relevant semantics,
                markup or behaviour;
              </li>
              <li>
                no sibling conflicts with it, whether over focus, keys,
                announcements or layout;
              </li>
              <li>
                the author obligations it depends on have been
                satisfied;
              </li>
              <li>
                the evidence for it covers the resulting configuration
                and environment.
              </li>
            </ul>
            <p>
              Otherwise the guarantee is suspended, and must be
              re-established by evidence at the parent level.
              Guarantees are conditional and compositional. They are not
              labels permanently attached to component names, and a
              component that was accessible in one assembly has said
              nothing about the next one.
            </p>
            <p>
              The practical effect is that a design system needs a
              notion of a suspended guarantee at all. Most systems have
              two states, pass and fail, which forces a false choice
              when a guarantee is neither confirmed nor refuted but
              simply out of scope of its evidence. That third state is
              the common case in real assemblies.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it means for component use</h2>
            <p>
              The relationship runs both ways, and the second direction
              is the one usually missed. If a design system is a
              composition contract, then using components changes
              character too.
            </p>
            <ul>
              <li>
                <strong>Components become selections, not defaults.</strong>{" "}
                A component is admissible only if the system admits it
                for this profile and this application need.
              </li>
              <li>
                <strong>Variants become profile-bound.</strong> The same
                requirement may resolve to a menubar for one profile and
                a linear list of links for another. Both are correct
                outputs of the same system.
              </li>
              <li>
                <strong>Escape hatches become declarations.</strong> Any
                override is recorded, with the guarantees it invalidates
                and the retest it triggers.
              </li>
              <li>
                <strong>Slots become typed.</strong> &ldquo;Accepts
                children&rdquo; is not sufficient. A slot declares which
                roles it accepts and which it forbids.
              </li>
              <li>
                <strong>
                  Component documentation gains a context clause.
                </strong>{" "}
                &ldquo;Accessible&rdquo; is replaced by &ldquo;guarantees
                X given preconditions Y, with evidence Z&rdquo;.
              </li>
              <li>
                <strong>Uncertainty is first class.</strong> A component
                may honestly declare that its behaviour with a
                particular screen reader is unverified, and that
                declaration propagates upward.
              </li>
              <li>
                <strong>Third-party components are quarantined.</strong>{" "}
                A component with no contract enters as an unknown and
                forces evidence at the boundary.
              </li>
            </ul>
            <p>
              The design system I am building implements the first four
              of those in{" "}
              <Link href="/adaptation/afds/what-a-component-declares">
                its component contracts
              </Link>{" "}
              and the last three in{" "}
              <Link href="/adaptation/afds/evidence-and-uncertainty">
                its treatment of evidence and uncertainty
              </Link>
              .
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The process change</h2>
            <p>
              Read as a working method rather than as a theory, the
              shift is from certifying components to evidencing
              configurations.
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="Assembly process without and with a composition contract"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Without a composition contract</th>
                    <th scope="col">With one</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Developer picks components</td>
                    <td>
                      Capability, preference and application need select
                      components and variants
                    </td>
                  </tr>
                  <tr>
                    <td>Assemble</td>
                    <td>
                      Assemble within declared composition rules
                    </td>
                  </tr>
                  <tr>
                    <td>Run automated checks</td>
                    <td>Validate the assembly against the contract</td>
                  </tr>
                  <tr>
                    <td>Find problems manually</td>
                    <td>
                      Propagate surviving guarantees and open
                      obligations upward
                    </td>
                  </tr>
                  <tr>
                    <td>Remediate after the fact</td>
                    <td>
                      Test the assembled configuration against its
                      declared acceptance criteria
                    </td>
                  </tr>
                  <tr>
                    <td>Claim &ldquo;accessible&rdquo;</td>
                    <td>
                      Attach scoped evidence to the configuration, not
                      to the component name
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The formulation</h2>
            <p>
              Everything above compresses into four sentences, and these
              are the ones I am carrying into the specification.
            </p>
            <blockquote>
              <p>
                A component framework supplies reusable possibilities. A
                design system records the components, variants,
                composition rules, ownership assignments and
                accessibility obligations selected for a particular
                interface. Component guarantees apply only while their
                declared preconditions survive assembly. Accessibility
                must be evidenced again at each higher composition
                boundary, and the complete process is the final
                boundary.
              </p>
            </blockquote>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>References</h2>
            <ul>
              <li>
                W3C Web Accessibility Initiative.{" "}
                <em>Understanding Conformance</em>.{" "}
                <a href="https://www.w3.org/WAI/WCAG22/Understanding/conformance">Understanding/conformance</a>
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
