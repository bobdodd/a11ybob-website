import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { MeasureSubNav } from "@/components/MeasureSubNav";

export default function IntrinsicAccessibility() {
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
            <h1>3. Intrinsic Accessibility</h1>
            <p className="lede">
              The capacity of an underlying interface to admit
              successful negotiation across many user-and-context
              profiles. The interface itself adapts; nothing is
              bolted on; the user is never carried through
              someone else&rsquo;s idea of what their accessibility
              should look like.
            </p>
          </header>

          <MeasureSubNav />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>From functional to intrinsic</h2>
            <p>
              Functional accessibility, as set out on{" "}
              <Link href="/research/the-measure-of-accessibility/functional-accessibility">
                page 2
              </Link>
              , is existential: it asks whether <em>at least one</em>{" "}
              medium-and-protocol path succeeds for a particular
              user in a particular context. That is a useful floor.
              It is also a floor that bolt-on assistive technology
              clears at high cost, by building specialist paths for
              specialist user-populations and accepting that the
              underlying interface stays the shape it always was.
            </p>
            <p>
              Intrinsic accessibility asks the next question.
              Instead of requiring at least one successful path for
              a given user, it asks how many distinct 
              user-and-context profiles the underlying interface admits
              successful paths for &mdash; without specialist
              hardware, without parallel workflows, without the
              user being carried through an experience designed
              for someone else.
            </p>
            <p>
              An interface is <strong>intrinsically accessible</strong>{" "}
              to the extent that it admits successful negotiation
              across a wide range of user-and-context profiles
              through its ordinary medium-and-protocol paths. The
              definition is comparative; some interfaces are more
              intrinsically accessible than others; the property is
              measurable on the interface itself, independent of
              any particular user.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The pseudo-user formalism</h2>
            <p>
              The measurement requires a way to talk about the
              range of users an interface might serve without
              committing to a specific user. The construct that
              does this is the <em>pseudo-user</em>.
            </p>
            <p>
              A pseudo-user is a synthetic user-profile constructed
              by combining values across a set of capacity
              dimensions &mdash; visual, sonic, haptic, cognitive,
              language, colour-vision, and so on. Each dimension
              admits a finite number of meaningful values for the
              purposes of accessibility analysis (the visual
              dimension distinguishes full sight, low vision,
              functional blindness; the sonic dimension
              distinguishes hearing, hard-of-hearing, deaf; the
              haptic dimension distinguishes precision, tremor,
              switch-only). The Cartesian product of these
              dimensions yields a finite set of pseudo-user
              profiles, each representing one combination of
              capacity values.
            </p>
            <p>
              Notation:
            </p>
            <ul>
              <li>
                <strong>
                  S<sub>PU</sub>
                </strong>{" "}
                &mdash; the set of all pseudo-users.
              </li>
              <li>
                <strong>
                  N<sub>PU</sub>
                </strong>{" "}
                &mdash; the cardinality of S<sub>PU</sub>; the
                number of pseudo-users in the set.
              </li>
              <li>
                <strong>
                  N<sub>IB</sub>
                </strong>{" "}
                &mdash; the <em>intrinsic-accessibility breadth</em>{" "}
                of an interface; the number of pseudo-users in
                S<sub>PU</sub> for whom the interface admits a
                successful negotiation through its ordinary paths.
              </li>
            </ul>
            <p>
              The intrinsic-accessibility breadth is what the
              definition measures. An interface with high N
              <sub>IB</sub> serves many pseudo-users; an interface
              with low N<sub>IB</sub> serves few. The ratio
              N<sub>IB</sub> / N<sub>PU</sub> gives the share of
              the pseudo-user space the interface admits, and is a
              useful single number for comparing interfaces &mdash;
              with the caveat that no single number is the whole
              story, and that the dimensions of S<sub>PU</sub>
              themselves carry assumptions.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The optimal pseudo-user set</h2>
            <p>
              The construction so far depends on the choice of S
              <sub>PU</sub>. A different set of capacity dimensions,
              or a different granularity of values within each,
              yields a different N<sub>PU</sub> and a different
              N<sub>IB</sub>. That dependency would normally make
              cross-interface comparison meaningless &mdash; if
              every analyst chooses their own pseudo-user set,
              numbers from different analyses are not commensurable.
            </p>
            <p>
              The claim that resolves this is that an{" "}
              <em>optimal</em> pseudo-user set exists, and is
              independent of any specific provider, transaction, or
              interface. The optimal set is the one that admits no
              meaningful refinement &mdash; every additional
              dimension or value either duplicates an existing
              distinction or introduces a distinction the
              accessibility-relevant difference engine cannot
              resolve. Two pseudo-users that differ only on a
              dimension that no interface treats differently are
              the same pseudo-user from the perspective of
              accessibility breadth; the optimal set is the
              quotient under that equivalence.
            </p>
            <p>
              The argument for the existence of the optimal set is
              constructive in principle: start with the maximal
              dimension-set, identify which dimensions the
              accessibility analysers respond to, collapse
              equivalent values, and iterate to a fixed point. In
              practice the procedure terminates because the dimension
              vocabulary used by accessibility tooling is itself
              finite. The claim is open at the edges &mdash; any
              shift in what the field considers an 
              accessibility-relevant capacity changes the optimal set &mdash; but
              within a fixed analytical scope, the set is unique up
              to the equivalence above.
            </p>
            <p>
              That uniqueness is what allows N<sub>IB</sub> to be
              compared across interfaces and across providers. Two
              interfaces evaluated against the same optimal S
              <sub>PU</sub> yield commensurable breadth measures.
              The measure means something about the interface, not
              just about the pseudo-user set the analyst chose.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The four-model architecture</h2>
            <p>
              The pseudo-user formalism gives the measure. To make
              the measure operational, the interface and the user
              need to be modelled in a way that lets the
              capacity-and-requirement match be computed mechanically
              for any pseudo-user. Four related models do this work.
            </p>
            <ol>
              <li>
                <strong>Capability Model.</strong> What{" "}
                <em>properties</em> exist for describing a user,
                organised by subject ontology &mdash; Visual,
                Sonic, Haptic, Cognitive, Language,
                ColourBlindness, TabularContent. Properties are
                typed; they group into Capability Templates;
                templates carry a precedence order so that
                meaningless questions are not asked (it makes no
                sense to ask about minimum readable font size if
                the user has no sight). The Capability Model exists
                independent of any specific user.
              </li>
              <li>
                <strong>Capacity Model.</strong> The{" "}
                <em>settings</em> for a specific user (or 
                pseudo-user, or group of users) in a specific context,
                populating the Capability Model. The crucial move
                here is the support for{" "}
                <em>functionally-dependent settings</em>: a setting
                can be defined as an action triggered by an
                external influence &mdash; a function of fatigue,
                of time of day, of observed user behaviour, of
                ambient light. Static profiles are a special case
                where the function returns a constant; dynamic
                profiles let the capacity recompute itself in
                response to runtime conditions. That is what turns
                static profiles into autonomous agents.
              </li>
              <li>
                <strong>Preference Model.</strong> The user&rsquo;s
                arbitrary personal intervention into how their
                capacities are applied. Capability is what the
                user <em>can</em> do; preference is what they{" "}
                <em>choose</em>. The two are sharply distinguished
                and connected only by explicit bridges: where the
                user is allowed to override capacity, the bridge
                names that override; where capacity overrides
                preference, the bridge names that direction
                instead. The model never collapses the two into
                one because the political question of who decides
                what is decided differently in different
                jurisdictions and different contexts.
              </li>
              <li>
                <strong>Requirement Model.</strong> The
                counterpoint to Capacity. Modalities have
                requirements; users have capacities; the runtime
                selection mechanism is the match between the two.
                Interaction modalities are eliminated from
                consideration when their requirements exceed the
                user-and-context&rsquo;s capacity; the modalities
                that survive are the candidate paths against which
                the at-least-one condition is evaluated.
              </li>
            </ol>
            <p>
              Together the four models constitute a complete
              specification: capability defines the abstract user;
              capacity binds the user to a context; preference
              admits user agency; requirement filters what
              modalities are available. Functional accessibility
              becomes the statement &ldquo;at least one
              capacity-requirement match exists for this 
              user-context-modality.&rdquo; Intrinsic accessibility
              becomes &ldquo;the underlying interface admits many
              such matches across many pseudo-users.&rdquo; The same
              machinery measures both; the only difference is what
              is being quantified over.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why bolt-on assistive tech is the wrong shape</h2>
            <p>
              The PacMate from page 2 is the illustration. It
              achieves functional accessibility for blind users at
              the cost of being no longer the original device. In
              the pseudo-user vocabulary: it adds a single
              specialist medium-and-protocol path that resolves the
              capacity-requirement match for one specific cell of
              S<sub>PU</sub>, while leaving every other cell
              unchanged. N<sub>IB</sub> goes up by one.
            </p>
            <p>
              An intrinsically accessible alternative would not add
              a path; it would change the underlying interface so
              that the existing paths admit the additional cells.
              N<sub>IB</sub> goes up by many. The user-experience
              cost of specialisation does not get paid by anyone,
              because no specialisation happened.
            </p>
            <p>
              Bolt-on assistive technology is therefore structurally
              a functional-accessibility solution to a problem that
              wants intrinsic-accessibility. Each individual
              bolt-on may be a perfectly reasonable response to the
              specific situation it was built for; the cumulative
              effect of treating the whole field that way is to
              keep N<sub>IB</sub> low and the cost of accessibility
              high. The structural alternative is to make the
              underlying interfaces shape-changeable enough that
              the additional paths are intrinsic, not bolted on.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What the breadth measure does not promise</h2>
            <p>
              N<sub>IB</sub> measures how many pseudo-users the
              interface admits. It does not measure whether the
              experiences the admitted pseudo-users have are
              equivalent to one another. A user with full sight and
              a user navigating only by screen reader can both be
              counted in the breadth; that count says nothing
              about whether the second user&rsquo;s task takes ten
              times as long, three times the effort, or fewer
              context-switches. Equivalent experience is a
              different question, treated on{" "}
              <Link href="/research/the-measure-of-accessibility/equivalent-experience">
                page 4
              </Link>
              .
            </p>
            <p>
              The measure also does not name how the interface
              should be built to admit the additional pseudo-users.
              That is a methodological question &mdash; how do you
              design and engineer an interface so that intrinsic
              accessibility is achievable as a property of the
              underlying system rather than an aspiration painted
              on top? The methodological substrate that makes the
              formal definitions on this page <em>buildable</em>{" "}
              rather than just stated is treated on{" "}
              <Link href="/research/the-measure-of-accessibility/the-shlaer-mellor-lens">
                page 5
              </Link>
              .
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Continue</h2>
            <p>
              <Link href="/research/the-measure-of-accessibility/functional-accessibility">
                &larr; Previous: 2. Functional Accessibility
              </Link>
              {" · "}
              <Link href="/research/the-measure-of-accessibility/equivalent-experience">
                Next: 4. Equivalent Experience &rarr;
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
