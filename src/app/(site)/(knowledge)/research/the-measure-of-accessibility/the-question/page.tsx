import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { MeasureSubNav } from "@/components/MeasureSubNav";

export default function TheQuestion() {
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
            <p>
              <small>
                <Link href="/research/the-measure-of-accessibility">
                  &larr; The Measure of Accessibility
                </Link>
              </small>
            </p>
            <h1>1. The Question</h1>
            <p className="lede">
              <em>
                What is accessibility, and how do you measure it?
                The answer is wholly political.
              </em>
            </p>
          </header>

          <MeasureSubNav />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What the question actually asks</h2>
            <p>
              Accessibility is not a technical question with a
              technical answer. It is not legal, although the law
              has things to say about it. It is not ergonomic,
              although ergonomics is part of the picture. It is
              political &mdash; in the sense that the answer depends
              on what kind of society you take yourself to be
              building, and on what relationship that society has
              with the people who use it.
            </p>
            <p>
              Most technical writing on accessibility quietly elides
              the political character of the question. WCAG is a
              checklist of testable criteria; it is extremely good
              at being a checklist. But a checklist does not tell
              you what counts as accessible &mdash; it tells you
              what counts as conformant to a particular set of
              decisions made by a particular working group about
              which technical properties can be tested reproducibly.
              Conformance and accessibility are not the same thing.
              The conflation is convenient and widespread; it is
              also the source of most of the category errors the
              field makes.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The political spectrum</h2>
            <p>
              The answer to <em>what is accessibility</em>{" "}sits
              somewhere on a spectrum. The two ends are starkly
              different positions, and most of the contested ground
              in the field is the territory between them.
            </p>
            <p>
              At one end, accessibility is{" "}
              <strong>
                the capacity to insert a disabled user into existing
                society
              </strong>
              . This is the position implicit in most assistive
              technology built since the 1980s. The society is
              taken as given; the inaccessible interfaces are taken
              as given; the work of accessibility is to graft a
              translation layer onto the user so they can interact
              with what already exists. Screen readers translate
              the visual web into speech. Switch-access scanners
              translate complex interaction into single-button
              affordances. Captioning translates audio into
              synchronous text. Each is, on its own terms, a
              substantial engineering achievement; each is also an
              admission that the underlying interface was not
              designed with the user in mind, and the cost of that
              omission is now being paid by the user&rsquo;s
              assistive layer.
            </p>
            <p>
              At the other end, accessibility is{" "}
              <strong>
                the property of a society that ensures universal
                access to its goods and services
              </strong>
              . On this view, the work of accessibility is the work
              of designing the underlying systems &mdash;
              interfaces, policies, infrastructure &mdash; so that
              they admit many user-platforms from the start. The
              translation layer is not absent; it is built in. The
              user does not arrive at an interface designed for
              someone else and try to make it work; the interface
              already adapts to who they are.
            </p>
            <p>
              These are not technical positions. They are positions
              about what a society owes its members. The first
              treats accessibility as a charitable accommodation
              extended toward people who would otherwise be
              excluded. The second treats it as a baseline
              precondition for membership. Neither is unreasonable
              in isolation; the gap between them is where most of
              the argument lives.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why most assistive tech sits at the insertion end</h2>
            <p>
              <em>
                If you only have a hammer, then everything looks
                like a nail.
              </em>
            </p>
            <p>
              You can write a program to translate text into
              speech. You can write a program to scan through
              menu items at a configurable rate. You can write a
              program to add captions to a video. What you cannot
              write is a program to change the assumption that the
              video should be primarily visual, or that menus
              should be primarily clicked, or that web pages
              should be primarily read with eyes. The first three
              are tractable. The fourth is political.
            </p>
            <p>
              The hammer is software. Software is the 
              assistive-technology field&rsquo;s strongest tool, and as a
              consequence the field has largely framed
              accessibility as a problem software can solve. That
              framing carries a hidden constraint: it pushes the
              answer toward the insertion end of the spectrum,
              because that is the end of the spectrum where
              software-only interventions are sufficient. The
              universal-access end requires changes to interfaces,
              standards, organisations, and procurement practices
              &mdash; categories of change that no individual
              programmer can ship. The temptation, then, is to
              treat accessibility as a software problem, because
              software problems are the ones we know how to
              attack. The cost of that temptation is two decades
              of bolt-on assistive technology that takes the
              underlying interface as a given.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why current vocabularies underdetermine the question</h2>
            <p>
              Three vocabularies are usually offered when the
              question of <em>what is accessibility</em>{" "}is
              raised. None of them resolve it.
            </p>
            <p>
              The <strong>legal</strong>{" "}vocabulary names
              accessibility as a matter of rights and
              obligations. Different jurisdictions name those
              rights differently &mdash; the ADA in the United
              States, AODA in Ontario, the European Accessibility
              Act, Canada&rsquo;s Accessible Canada Act. Each of
              these reads accessibility as something a service
              owes to a class of users by virtue of disability
              status. The vocabulary is precise about who must
              comply and what the penalties are for failing to do
              so. It is silent about which interfaces are
              accessible and which are not, except by reference
              to technical standards that the law itself does not
              author. Legal vocabulary tells you whether the
              consequences for failing have teeth; it does not
              tell you what success looks like.
            </p>
            <p>
              The <strong>ergonomic</strong>{" "}vocabulary names
              accessibility as a property of a fit between user
              and tool &mdash; the right size of grip for the
              hand, the right contrast for the eye, the right
              latency for the motor pathway. Ergonomics is good at
              what it does. It is also scoped to physical
              properties of the interaction surface; it has very
              little to say about what the interface should be
              for, who it should be for, or what should happen if
              the user&rsquo;s body or context falls outside the
              ergonomic envelope. Ergonomic vocabulary tells you
              whether a particular knob is graspable; it does not
              tell you whether the knob should exist.
            </p>
            <p>
              The <strong>usability</strong>{" "}vocabulary names
              accessibility as a special case of usability for
              users with disabilities. This is a friendly framing
              and often a productive one &mdash; ergonomic and
              cognitive accommodations that make an interface
              usable by a disabled user often make it more usable
              for everyone &mdash; but it conceals a category
              error. Usability is a commercial property:{" "}
              <em>does this product satisfy its target users
              well enough to compete?</em>{" "}Accessibility is a
              political property: <em>does this society make its
              goods and services available to its members
              regardless of physical capability?</em>{" "}They are not
              the same question, and the answers do not coincide.
              <em>It is possible to have a wonderfully elegant and
              usable interface that will score low in terms of
              intrinsic accessibility, and an accessible interface
              that is almost unusable.</em>{" "}The usability
              vocabulary cannot capture that distinction.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The categorial difference between usability and accessibility</h2>
            <p>
              The distinction is worth making explicit because so
              much of the field operates as if the two collapse
              into each other.
            </p>
            <p>
              <strong>Usability</strong>{" "}measures how well an
              interface serves a defined target population. The
              target population is decided by the
              business &mdash; who is buying, who is being marketed
              to, who the strategic plan says is in scope. Once
              the target is fixed, usability is measurable: task
              completion rate, time-on-task, error rate,
              satisfaction. The answers can be high or low; the
              question they answer is well-posed only relative to
              the target.
            </p>
            <p>
              <strong>Accessibility</strong>{" "}measures how well an
              interface serves the population that exists
              independent of the business&rsquo;s targeting
              decisions. The relevant population is not who the
              business chose to serve but who the society includes
              as members. A reading-only screen reader user,
              navigating a website built for sighted users, is not
              outside the population the website should serve;
              they are outside the population the website was
              built for. Those are different judgements.
            </p>
            <p>
              Both questions are legitimate. Both are answerable.
              They are not the same question, and an interface
              can do well on one while doing badly on the other.
              The clearest illustration is in the field itself:
              specialist assistive devices &mdash; the PacMate, for
              example, with its replaced keyboard and forced 
              text-to-speech &mdash; are functionally accessible to their
              target users at high cost in usability. They are
              accessible in the sense that the relevant 
              user-population can complete tasks; they are unusable in
              the sense that the experience is profoundly
              different from what a typical user encounters.
              Conversely, a beautifully designed web app with no
              regard for screen readers can score in the high
              nineties on every usability metric and still fail
              to serve a substantial fraction of the people who
              are entitled to it. Both situations exist. Both are
              common. A vocabulary that cannot tell them apart is
              a vocabulary that cannot say what it is for an
              interface to be accessible.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where this collection goes</h2>
            <p>
              The remaining five pages of <em>The Measure of
              Accessibility</em>{" "}develop a position that takes the
              political character of the question seriously and
              answers it formally rather than rhetorically. Briefly:
            </p>
            <ul>
              <li>
                <strong>Functional Accessibility</strong>{" "}
                (<Link href="/research/the-measure-of-accessibility/functional-accessibility">
                  page 2
                </Link>
                ) gives a definition with notation: the property of
                successful negotiation between a specific user and a
                specific provider, achievable via at least one
                medium-and-protocol path among those available.
              </li>
              <li>
                <strong>Intrinsic Accessibility</strong>{" "}
                (<Link href="/research/the-measure-of-accessibility/intrinsic-accessibility">
                  page 3
                </Link>
                ) generalises: the property of an underlying
                interface that admits successful negotiations across
                many user-and-context profiles, formalised through
                the pseudo-user set independent of any specific
                provider.
              </li>
              <li>
                <strong>Equivalent Experience</strong>{" "}
                (<Link href="/research/the-measure-of-accessibility/equivalent-experience">
                  page 4
                </Link>
                ) argues against utilitarianism in accessibility,
                and treats the timing dimension of equivalent
                experience as an equality question.
              </li>
              <li>
                <strong>The Shlaer-Mellor lens</strong>{" "}
                (<Link href="/research/the-measure-of-accessibility/the-shlaer-mellor-lens">
                  page 5
                </Link>
                ) is the methodological substrate that lets the
                formal definitions on the previous pages be built
                rather than just stated.
              </li>
              <li>
                <strong>Communities of Practice</strong>{" "}
                (<Link href="/research/the-measure-of-accessibility/communities-of-practice">
                  page 6
                </Link>
                ) reframes inaccessibility as community
                dysfunction and opens onto the multi-agent territory
                that the{" "}
                <Link href="/research/2029-framework">
                  2029 framework
                </Link>{" "}
                resumes.
              </li>
            </ul>
            <p>
              The order is not arbitrary. Each page rests on the
              one before it. A reader who wants only the political
              framing can stop after page 1; a reader who wants the
              formal definition can stop after page 3; a reader who
              wants the whole position should read all six.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Continue</h2>
            <p>
              <Link href="/research/the-measure-of-accessibility/functional-accessibility">
                Next: 2. Functional Accessibility &rarr;
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
