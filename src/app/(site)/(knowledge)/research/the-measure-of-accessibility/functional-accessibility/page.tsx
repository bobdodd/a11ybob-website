import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { MeasureSubNav } from "@/components/MeasureSubNav";

export default function FunctionalAccessibility() {
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
            <h1>2. Functional Accessibility</h1>
            <p className="lede">
              The result of at least one successful negotiation
              between a user and a provider, within the context of
              all communications mediums available at that time and
              place.
            </p>
          </header>

          <MeasureSubNav />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The definition</h2>
            <p>
              An interface is <strong>functionally accessible</strong>{" "}
              to a particular user, in a particular context, if at
              least one combination of communication medium and
              protocol exists through which that user can complete
              the interaction the interface is for. The definition
              is deliberately weak: it does not require the user to
              have the same experience as anyone else, only that{" "}
              <em>some path through</em>{" "}exists.
            </p>
            <p>
              Three things in that sentence carry weight.
            </p>
            <p>
              First, <em>negotiation</em>. Functional accessibility
              is not a property the interface has on its own; it is
              the outcome of an interaction between user and
              provider. The same interface can be functionally
              accessible to one user and not to another. The same
              user can have functional access through one
              combination of medium and protocol and not through a
              different combination. The accessibility status is
              relational, not intrinsic.
            </p>
            <p>
              Second, <em>at least one</em>. The condition is
              existential, not universal. If a single
              medium-and-protocol path succeeds, the interface
              meets the definition for that user-and-context. The
              other paths can fail; the alternative mediums can be
              unusable; only one needs to work.
            </p>
            <p>
              Third, <em>at that time and place</em>. Functional
              accessibility is dated. A tool that worked on
              yesterday&rsquo;s assistive-technology stack may not
              work on today&rsquo;s. A tool that works in a quiet
              room may not work on a factory floor. The definition
              is bound to its conditions; it does not promise
              anything about portability across contexts.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Multi-medium robustness</h2>
            <p>
              The &ldquo;at least one&rdquo; condition is what makes
              the definition non-trivially testable. Most interfaces
              admit several possible medium-and-protocol paths: a
              web form can be filled in by sighted typing, by
              screen-reader navigation with keyboard, by voice
              control invoking text input, by switch-access scanning
              with auto-complete, by a screen magnifier with mouse,
              by a refreshable braille display with chord input.
              Each path is a candidate for the &ldquo;at least
              one.&rdquo; The interface is functionally accessible
              if any of them complete the task; it fails the
              definition only if all of them do.
            </p>
            <p>
              That is a strong test in two directions and a weak
              test in one. It is strong against the failure mode
              where a single path is assumed and the others are not
              considered &mdash; the &ldquo;works in Chrome with a
              mouse&rdquo; baseline that pretends no other path
              exists. It is strong against the failure mode where
              accessibility is treated as a single accommodation
              for a single user category &mdash; the &ldquo;we
              added a screen-reader mode&rdquo; line that ignores
              switch users, low-vision users, motor-impaired users,
              and any combination thereof. The definition forces
              the question <em>which paths actually work, and for
              whom?</em>
            </p>
            <p>
              The weak direction is that the definition is
              indifferent to <em>which</em>{" "}path succeeded. A user
              who can complete the task only via an assistive
              technology that costs them more time, more attention,
              and a more degraded experience than other users still
              counts as functionally accessible under the
              definition. Equivalent experience is a different
              question and is treated on{" "}
              <Link href="/research/the-measure-of-accessibility/equivalent-experience">
                page 4
              </Link>
              ; the definition here gives a floor, not a target.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The capacity-requirement match</h2>
            <p>
              The formal core of the definition is a match between
              two structures. The user, in their context, has a{" "}
              <strong>capacity</strong>{" "}&mdash; what they can
              actually do in this body, on this device, at this
              moment, with these inputs and outputs. The interface,
              for each medium-and-protocol path it offers, has a{" "}
              <strong>requirement</strong>{" "}&mdash; what the user
              would need to bring to the interaction for that path
              to succeed. A path is available to the user when the
              user&rsquo;s capacity meets or exceeds the path&rsquo;s
              requirement; the interface is functionally accessible
              when at least one of its paths is available.
            </p>
            <p>
              Both sides of the match are runtime properties.
              Capacity changes &mdash; with fatigue, with the time
              of day, with the device the user picks up, with whether
              their other hand is occupied, with how much battery
              the hearing aid has left. Requirement changes too
              &mdash; with which features of the interface the user
              has reached, with what content is loaded, with what
              external services are reachable. The match is
              evaluated against a snapshot, not a static
              specification. The same user with the same interface
              can pass the test in the morning and fail it in the
              evening; the definition admits that and does not try
              to wave it away.
            </p>
            <p>
              The capacity-and-requirement structures are formalised
              in detail on{" "}
              <Link href="/research/the-measure-of-accessibility/intrinsic-accessibility">
                page 3
              </Link>
              , where the same machinery generalises across
              user-populations rather than just naming a single user.
              On the functional side, the structure has one fixed
              user and one fixed context; on the intrinsic side, it
              quantifies over all of them.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where bolt-on assistive technology lives</h2>
            <p>
              Most assistive technology achieves functional
              accessibility, narrowly scoped, at high cost.
            </p>
            <p>
              The PacMate is the canonical illustration. Freedom
              Scientific&rsquo;s PDA, sold to blind users in the
              early 2000s, replaced the original device&rsquo;s
              keyboard with a braille input keyboard and forced its
              output through text-to-speech. To its target users it
              was functionally accessible &mdash; the
              capacity-and-requirement match succeeded; the
              tasks could be completed. But the interface was{" "}
              <em>no longer the original device</em>. Sighted
              colleagues couldn&rsquo;t pick it up to help. The
              braille input kept the user inside a parallel
              workflow. Software updates from the original platform
              didn&rsquo;t apply. The price of functional
              accessibility was that the device was specialist; the
              user&rsquo;s relationship to the wider ecosystem was
              mediated through hardware nobody else used.
            </p>
            <p>
              That is the structural shape of bolt-on assistive
              technology in general. A specific user-population is
              named; a specialist medium-and-protocol path is built
              for them; the path satisfies the &ldquo;at least
              one&rdquo; condition; the cost is paid in narrowing,
              specialisation, and the loss of the ordinary user
              experience the rest of the population takes for
              granted. Functional accessibility holds; the deeper
              question of whether the underlying interface is the
              right shape goes unaddressed.
            </p>
            <p>
              That deeper question is the territory of intrinsic
              accessibility. The two definitions are not in
              conflict; intrinsic accessibility is what you ask for
              when functional accessibility is no longer enough.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Legal scoping, and its limits</h2>
            <p>
              The legal vocabulary of accessibility maps onto
              functional accessibility almost exactly. The ADA, the
              AODA, the European Accessibility Act, the Accessible
              Canada Act &mdash; all of them, in different
              jurisdictions, name accessibility as a property a
              service owes to a class of disabled users, and
              evaluate compliance against the question{" "}
              <em>can the user complete the task?</em>{" "}If yes,
              compliant. If no, not compliant. That is the
              functional condition.
            </p>
            <p>
              The legal scoping is useful for what it is. It gives
              users a remedy when functional accessibility fails.
              It gives providers a baseline to clear. It gives
              procurement officers a checklist that can be enforced
              contractually. The threshold-style framing &mdash;
              accessible / not accessible &mdash; matches what
              regulation can do.
            </p>
            <p>
              But the legal vocabulary cannot ask the deeper
              question. A web service that meets every WCAG
              criterion and complies with every applicable
              accessibility law can still ship interfaces that are
              functionally accessible only via heroically
              specialist paths &mdash; assistive layers grafted on,
              the underlying design unchanged, the cost of the
              accommodation paid by the user. Compliance is
              satisfied; the structural question is not. The legal
              floor is a floor, not a ceiling.
            </p>
            <p>
              The rest of this collection is about what the ceiling
              looks like.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Continue</h2>
            <p>
              <Link href="/research/the-measure-of-accessibility/the-question">
                &larr; Previous: 1. The Question
              </Link>
              {" · "}
              <Link href="/research/the-measure-of-accessibility/intrinsic-accessibility">
                Next: 3. Intrinsic Accessibility &rarr;
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
