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
              Interfaces are built from components, and how a component
              is designed decides most of what a person can do with the
              interface it appears in. Components stand on their own as
              a subject: what they are, what designing one involves,
              what each one can honestly promise, and what happens when
              they are put together. Design systems come after that, as
              the answer to the last of those questions.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What a component is</h2>
            <p>
              A component is a bounded piece of interface that can be
              used more than once: a button, a field with its label, a
              tab set, a card, a navigation bar, a whole search results
              region. It bundles four things behind a single name —
              markup and the semantics that markup carries, presentation,
              behaviour, and whatever state it keeps — and it exposes a
              small interface through which the rest of the application
              configures it, usually some combination of properties,
              slots for content, and events it emits back.
            </p>
            <p>
              The idea is older than the frameworks that made it
              fashionable. An HTML <code>select</code> element is a
              component: it has semantics, presentation, keyboard
              behaviour, an open and closed state, and a small
              configuration surface, and it was written once and reused
              by everybody. What frameworks added was the ability for
              anybody to define new ones, which is both the reason
              component libraries exist and the reason accessibility
              became something each team has to re-establish rather than
              inherit.
            </p>
            <p>
              Components nest, and that is the point of them. A field is
              a label and an input and a message; a form is fields and a
              submit button; a page is regions of forms and lists and
              navigation. So a component is always simultaneously a
              whole, from the inside, and a part, from the outside, and
              the two views disagree about what it is responsible for.
              Almost everything in this section follows from that
              disagreement, and the levels at which it plays out are set
              out in{" "}
              <Link href={`${BASE}/the-assembly-hierarchy`}>
                the assembly hierarchy
              </Link>
              .
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What component design is</h2>
            <p>
              Component design is the practice of deciding those
              boundaries and behaviours. Not drawing the button:
              deciding what the button is, what it does when operated by
              a keyboard, a pointer, a screen reader, a voice, or a
              switch, what it does when its label is four words long in
              English and eleven in German, what it does when it has no
              room, what it does while it waits, and what it does when
              the thing it triggers fails.
            </p>
            <p>
              Put concretely, designing a component means settling at
              least the following, and settling them as decisions rather
              than as whatever the implementation happened to do.
            </p>
            <ul>
              <li>
                <strong>Its boundary.</strong> What is inside it, what is
                passed into it, and what is deliberately left outside.
              </li>
              <li>
                <strong>Its semantics.</strong> What it is, in terms a
                machine can read: which element or role, what name, what
                relationships to the things around it.
              </li>
              <li>
                <strong>Its states.</strong> Every state it can be in —
                empty, loading, partial, invalid, disabled, stale,
                selected, expanded — and how each state is expressed to
                a person who cannot see it.
              </li>
              <li>
                <strong>Its interaction.</strong> Which keys do what,
                where focus goes on each transition, what is announced
                and when, and what the touch and pointer behaviour is.
              </li>
              <li>
                <strong>Its adaptation.</strong> How it behaves as space,
                text size, spacing, language, colour scheme and motion
                preference change, since those are user decisions and not
                device categories.
              </li>
              <li>
                <strong>Its variants.</strong> Which alternative forms of
                the same thing exist, and what selects between them.
              </li>
              <li>
                <strong>Its obligations.</strong> What the component
                guarantees, what it explicitly does not, and what it
                requires the author or the surrounding page to supply.
              </li>
            </ul>
            <p>
              That last item is the one most often left implicit, and it
              is the one that makes the rest usable by somebody else. A
              component that guarantees the association between a label
              and a field, and states plainly that it cannot guarantee
              the label says anything meaningful, has told the truth. A
              component described only as accessible has not: it has
              omitted the conditions under which the description holds.
              What a well-made declaration contains is worked through in{" "}
              <Link href={`${BASE}/the-landscape`}>
                the framework landscape
              </Link>
              , which is also where the survey of what current libraries
              do and do not publish sits.
            </p>
            <p>
              Component design is also where accessibility is cheapest.
              A decision taken once inside a component is inherited by
              every place it is used, and a decision not taken becomes a
              defect repeated at the same rate. This is why remediating
              pages is such poor value: the page is the symptom and the
              component is the cause.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Good components are not enough</h2>
            <p>
              Here is the finding that motivates the rest of these
              pages, and it is a negative one. Accessibility is not a
              property that survives being added together. A combobox
              that is correct on its own and a modal dialog that is
              correct on its own do not produce a correct
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
              again at each boundary. The failures themselves are
              enumerated in{" "}
              <Link href={`${BASE}/failure-modes`}>
                how composition fails
              </Link>{" "}
              and shown at work in{" "}
              <Link href={`${BASE}/worked-examples`}>worked examples</Link>
              .
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Managing rendering and interaction between components</h2>
            <p>
              If the gap is between components rather than inside them,
              it cannot be closed by better components. It needs
              somewhere to record the rules that govern how a set of
              components render and interact together: which of them may
              be used at all, which may contain which, which variant is
              selected for whom, which one owns focus in a given state,
              how the keyboard grammar resolves when two of them want
              the same key, which one is allowed to speak when several
              have something to announce, and how they reflow when there
              is not enough room for all of them.
            </p>
            <p>
              That record is a design system. It is worth being precise
              about the distinction, because the two words are used
              interchangeably and they are not the same thing. A
              component library is a set of parts. A design system is
              the set of decisions about which parts are used here, in
              what form, in what combinations, with which
              responsibilities assigned where — and, if it is honest,
              with the evidence for each decision and the record of what
              is still unknown attached to it.
            </p>
            <p>
              So the dependency runs in one direction only. Component
              design does not require a design system: teams design
              components, and assemble them, whether or not anybody has
              written the rules down. A design system does require
              components, because components are what it is making
              decisions about. That is why this section sits before the
              design system pages rather than inside them, and why those
              pages refer back here instead of restating the argument.
            </p>
            <p>
              I have kept them apart for a second reason. If the
              assembly problem only appeared inside a discussion of my
              own design system it would read as an argument for that
              design system, which invites the reader to discount it.
              The failures are observable without reference to any
              particular system, and that is how they are set out here.
              What follows from them for a design system, including the
              rule that guarantees do not union, is in{" "}
              <Link href={`${BASE}/what-this-means`}>
                what this means for a design system
              </Link>
              .
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
              The design system I am building on top of all of this is{" "}
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
