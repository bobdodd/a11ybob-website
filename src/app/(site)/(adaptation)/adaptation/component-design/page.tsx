import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ComponentDesignSubNav } from "@/components/ComponentDesignSubNav";

export const metadata: Metadata = {
  title: "Components and component design",
};

const BASE = "/adaptation/component-design";

export default function ComponentDesign() {
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
            <h1>Components and component design</h1>
            <p className="lede">
              A component framework supplies reusable possibilities. It
              does not supply an accessible page. Accessibility is not
              closed under composition: two accessible components need
              not compose into an accessible compound, and a page
              assembled entirely from accessible components need not be
              an accessible page.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why this is its own section</h2>
            <p>
              Component design does not require a design system. Teams
              build components, and assemble them, whether or not
              anybody has written down the rules they are working to.
              The problems on these pages are therefore not problems
              with design systems. They are problems with assembly, and
              they arrive the moment two components sit inside one
              page.
            </p>
            <p>
              A design system is one answer to them, and the one I am
              building; my design system uses components, so the AFDS
              pages refer back here rather than restating the argument.
              But the argument stands on its own, and anybody working
              with a component library and no design system at all still
              has every failure described here to contend with.
            </p>
            <p>
              I have kept the two apart for a second reason. If the
              assembly problem only appeared inside a discussion of my
              own design system it would read as an argument for the
              design system, which invites the reader to discount it.
              The failures are observable without reference to any
              particular system, and that is how they are set out.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The claim</h2>
            <p>
              The central finding of this work is a negative one, and it
              is worth stating plainly before the detail. Accessibility
              is not a property that survives being added together. A
              combobox that is correct on its own and a modal dialog
              that is correct on its own do not produce a correct
              dialog-with-a-combobox, because both of them want the
              Escape key and neither of them knows the other exists.
              Nothing in either component is broken. The composition is
              broken, and it is broken in a way that no test of either
              component can see.
            </p>
            <p>
              This is not a fringe observation. The GOV.UK Design System
              states the limitation directly: using its styles,
              components and patterns does not remove the need for
              further research, design, development and testing at
              service level, and its contribution criteria require
              components to be tested inside realistic pages, with
              representative content, against real assistive technology
              combinations, with newly discovered problems written up as
              accessibility acceptance criteria.
            </p>
            <p>
              WCAG makes the same point from the other end of the scale.
              Where several pages are needed to complete an activity,
              the complete process is the unit of conformance, and every
              page in that process must conform. The conformance
              boundary is therefore neither the component nor even the
              single page.
            </p>
            <p>
              Between those two facts sits everything a component
              library does not tell you: what may be assembled with
              what, who owns which accessibility responsibility, which
              guarantees survive assembly, and what has to be evidenced
              again at each boundary.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What this section holds</h2>
            <ul>
              <li>
                <Link href={`${BASE}/the-landscape`}>
                  The framework landscape
                </Link>
                : the three-layer shape most frameworks share, the split
                between styled and headless libraries, and the one thing
                almost none of them publish.
              </li>
              <li>
                <Link href={`${BASE}/the-assembly-hierarchy`}>
                  The assembly hierarchy
                </Link>
                : six levels from primitive to complete process, and why
                accessibility responsibility changes character at each
                one.
              </li>
              <li>
                <Link href={`${BASE}/failure-modes`}>
                  How composition fails
                </Link>
                : eight classes of failure that are invisible in
                isolation and appear only on assembly.
              </li>
              <li>
                <Link href={`${BASE}/worked-examples`}>Worked examples</Link>
                : six ordinary compositions, taken apart. A combobox in
                a dialog, a clickable card, a filter panel, a grid in a
                tabpanel, a multi-step form, and responsive navigation.
              </li>
              <li>
                <Link href={`${BASE}/what-this-means`}>
                  What this means for a design system
                </Link>
                : composition as a contract, the rule that guarantees do
                not union, and what the relationship does to component
                use in the other direction.
              </li>
              <li>
                <Link href={`${BASE}/state-propagation`}>
                  State and its propagation
                </Link>
                : five classes of state, eight propagation rules, a
                worked contract, and the predicates a validator could
                enforce.
              </li>
              <li>
                <Link href={`${BASE}/testing`}>
                  Testing across the hierarchy
                </Link>
                : evidence matched to the level of the claim, a method
                for testing flows, and the hard limit of automation.
              </li>
              <li>
                <Link href={`${BASE}/what-is-open`}>What is still open</Link>
                : the questions this work has not answered, and what I
                am carrying into the specification.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where this connects</h2>
            <p>
              The design system that acts on all of this is{" "}
              <Link href="/adaptation/afds">
                described in the next section
              </Link>
              . Its component contracts are the mechanism by which a
              guarantee carries its preconditions, its{" "}
              <Link href="/adaptation/afds/evidence-and-uncertainty">
                evidence and uncertainty records
              </Link>{" "}
              are how a claim states the configuration it was tested
              in, and its{" "}
              <Link href="/adaptation/afds/open-questions">
                open questions
              </Link>{" "}
              include the ones this section leaves unresolved.
            </p>
            <p>
              The research note behind these pages is{" "}
              <a href="https://github.com/bobdodd/accessible-by-design/blob/main/research/COMPONENT-FRAMEWORKS.md">research/COMPONENT-FRAMEWORKS.md</a>{" "}
              in the project repository, which carries the full source
              list.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
