import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { MeasureSubNav } from "@/components/MeasureSubNav";

export default function ShlaerMellorLensInDepth() {
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
            <p>
              <small>
                <Link href="/research/the-measure-of-accessibility">
                  &larr; The Measure of Accessibility
                </Link>
              </small>
            </p>
            <h1>5. The Shlaer-Mellor lens</h1>
            <p className="lede">
              Recursive design as accessibility. Bridged semantic
              information domains rendered concrete by a model
              compiler for given user-and-environment constraints.
              The methodological substrate that lets the formal
              definitions on the previous pages be built, rather
              than just stated.
            </p>
          </header>

          <MeasureSubNav />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The structural claim</h2>
            <p>
              Pages 2 through 4 give the formal account of what
              functional, intrinsic, and equivalent-experience
              accessibility are. They give definitions and a
              measurement vocabulary. They do not give a method for
              <em> building</em> interfaces that satisfy those
              definitions. The gap between definition and
              construction is the gap this page is for.
            </p>
            <p>
              The structural claim is that{" "}
              <em>accessibility is a recursive-design problem</em>.
              That is: it has the same shape as the problem
              Shlaer-Mellor Object-Oriented Analysis and Design was
              built to solve &mdash; bridged semantic information
              domains rendered concrete by a model compiler for
              given platform constraints. The accessibility
              vocabulary is different; the structure is the same.
              The methodological apparatus that has been used in
              real-time embedded systems, telecoms switching, and
              defence comms since the late 1980s is therefore
              available to be used for the construction of
              accessible interfaces too.
            </p>
            <p>
              The claim is not analogical. It is structural: the
              two problems have isomorphic shape, and the same
              modelling constructs solve them. What follows lays
              out the isomorphism.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The Shlaer-Mellor frame, briefly</h2>
            <p>
              Shlaer-Mellor analyses a system as a collection of
              independent-but-related <em>problem domains</em>,
              each with its own subject matter (its own
              vocabulary, its own information model, its own
              assumptions), joined by formal{" "}
              <em>bridges</em>. The abstract analysis is then{" "}
              <em>translated</em> &mdash; not elaborated &mdash; into
              a concrete realisation for a specific platform via a
              <em> model compiler</em>. The same domain analysis
              produces different concrete realisations for
              different targets. That last property is what
              <em> recursive design</em> names: design abstractions
              that are reused across multiple targets, not
              re-elaborated for each.
            </p>
            <p>
              The Shlaer-Mellor frame distinguishes itself from
              other object-oriented methods by being{" "}
              <em>information-modelling-focused</em> rather than
              program-structure-focused. The information model
              describes the entities of the domain and their
              relationships; the state model describes how the
              entities behave over time; the action specification
              describes what happens at each state transition. The
              compiler maps these three together onto the target
              platform&rsquo;s execution model. The method has
              specific machinery for resource competition, for
              role-changing entities, and for cross-domain
              dependencies that does not exist in the more common
              UML-centric methodologies.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The accessibility mapping</h2>
            <p>
              Accessibility, treated as a recursive-design problem,
              consists of the following domains: content-semantics,
              navigation, modality (visual / sonic / haptic /
              gestural), user capability, device capacity,
              environment, and custom-and-practice. Each is a
              well-defined subject matter with its own information
              model. The bridges between them are the same shape
              as Shlaer-Mellor bridges &mdash; typed relationships
              that the model compiler operates on.
            </p>
            <p>
              The &ldquo;platform&rdquo; the system is targeting is
              <em> the user-plus-environment</em>. A screen-reader
              user on a phone in a quiet room is one platform; a
              sighted user on a laptop in a noisy office is another;
              a switch-access user on a tablet using a shared
              screen-magnifier in a clinical context is a third.
              The same domain analysis &mdash; the same content,
              the same semantics, the same navigation structure
              &mdash; is rendered concrete differently for each
              platform by the adaptation system. The adaptation
              system is the model compiler.
            </p>
            <p>
              The functional-and-intrinsic distinction from{" "}
              <Link href="/research/the-measure-of-accessibility/functional-accessibility">
                pages 2
              </Link>{" "}
              and{" "}
              <Link href="/research/the-measure-of-accessibility/intrinsic-accessibility">
                3
              </Link>{" "}
              maps directly onto the recursive-design frame.
              Functional accessibility is the property that{" "}
              <em>at least one</em> traversal of the bridges yields
              a usable concrete realisation for the user-and-
              environment platform. Intrinsic accessibility is the
              property of the underlying domain analysis that it
              admits <em>many</em> such traversals across many
              user-platforms. The compiler does the actual work;
              the analysis is what the compiler operates on.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The specific construct mappings</h2>
            <p>
              Each of the Shlaer-Mellor modelling constructs has a
              direct accessibility-domain counterpart. The
              construction is not contrived; the constructs were
              chosen because the accessibility problem actually
              needs them.
            </p>
            <dl
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <div>
                <dt>
                  <strong>Domain charts</strong> &rarr; the{" "}
                  <Link href="/research/carnforth-model">
                    Carnforth five-layer model
                  </Link>
                </dt>
                <dd>
                  The five layers &mdash; Adaptation, Navigation,
                  Semantics, Inventory, External Content &mdash;
                  are a domain chart for the accessible-hypermedia
                  problem. They differ from canonical Shlaer-
                  Mellor domain charts in that the relationships
                  between layers are <em>peer</em> rather than
                  client-server: each layer admits queries from
                  any other layer above it, rather than being
                  consulted only through a fixed hierarchy. That
                  deviation is itself a methodological
                  contribution; the peer relationship is what
                  lets the adaptation system reason laterally
                  across layers when rendering for a specific
                  user-platform.
                </dd>
              </div>
              <div>
                <dt>
                  <strong>Bridges between domains</strong>
                </dt>
                <dd>
                  Inventory&#x2194;Semantics and
                  Semantics&#x2194;Navigation are the named bridges
                  in the Carnforth analysis. The bridges express
                  how meaning composes upward from raw content
                  (the leaf inventory items) to adapted
                  presentation (what the user actually receives).
                  They are formal: typed relationships that the
                  compiler operates on, not metadata annotations
                  on the side.
                </dd>
              </div>
              <div>
                <dt>
                  <strong>Assigner state models</strong> for
                  resource competition
                </dt>
                <dd>
                  Mobile devices have audio channels that are
                  competed for at runtime &mdash; an incoming call
                  earcon, a new message earcon, a voice-note
                  recording session, an accessibility prompt all
                  want the channel and cannot all have it
                  simultaneously. Shlaer-Mellor handles
                  competition for a finite resource via the{" "}
                  <em>assigner state model</em>: a state machine
                  that owns the resource and arbitrates between
                  contenders. No other OO method reviewed during
                  the original development handled this so
                  cleanly. The audio-channel competition for
                  accessibility prompts is exactly an assigner
                  problem; it is a category of problem the method
                  has machinery for and most others do not.
                </dd>
              </div>
              <div>
                <dt>
                  <strong>Subtyping with role migration</strong>{" "}
                  (disjoint-complete)
                </dt>
                <dd>
                  An accessibility notification migrates through a
                  lifecycle: Announcing &rarr; Dwelling &rarr;
                  Expiring &rarr; (gone). It remains the{" "}
                  <em>same</em> notification through the
                  transitions; what changes is the role it plays
                  in the rendering. Shlaer-Mellor supports this
                  via disjoint-complete subtyping with role
                  migration &mdash; an instance of a supertype is
                  in exactly one subtype at a time and migrates
                  between subtypes as its role changes. The
                  modality-aware rendering of each phase
                  (audible-and-visible during Announcing,
                  reduced-presence during Dwelling, suppressed
                  during Expiring) is the model compiler picking
                  the right concrete realisation for each phase
                  for each user-platform.
                </dd>
              </div>
              <div>
                <dt>
                  <strong>State Transition Tables</strong> with
                  &ldquo;Can&rsquo;t Happen&rdquo; and{" "}
                  &ldquo;Ignore&rdquo; cells
                </dt>
                <dd>
                  Shlaer-Mellor expresses state behaviour as
                  exhaustive tables in which every combination of
                  state and incoming event has an entry &mdash;
                  even if the entry is &ldquo;cannot happen
                  here&rdquo; or &ldquo;ignore this event in this
                  state.&rdquo; The accessibility analogue is
                  user-capability-specific exception handling: an
                  event sequence that makes sense for a sighted
                  pointer user can be a Can&rsquo;t-Happen for a
                  screen-reader keyboard user; an event sequence
                  that requires acknowledgement from a hearing
                  user can be Ignore for a deaf user, with a
                  different equivalent prompt issued separately.
                  The exhaustive-table form forces the analysis
                  to be explicit per user-platform rather than
                  implicit.
                </dd>
              </div>
              <div>
                <dt>
                  <strong>Action Specification Language</strong>{" "}
                  &rarr;{" "}
                  <Link href="/research/action-language">
                    Action Language
                  </Link>
                </dt>
                <dd>
                  Shlaer-Mellor specifies state actions in an{" "}
                  <em>Action Specification Language</em>, abstract
                  enough to be platform-independent and concrete
                  enough to be executable. The accessibility
                  realisation is the Action Language XML notation,
                  with a Forth-style threaded-interpreter execution
                  model. The execution model itself dates back to
                  the threaded-interpreted Forth runtimes of the
                  mid-1980s; the Action Language carries that
                  shape forward into accessibility-relevant
                  execution. Same execution model, four problem
                  domains, four decades.
                </dd>
              </div>
            </dl>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The lineage that makes the claim non-rhetorical</h2>
            <p>
              Recursive design as accessibility is not a
              retrospective rationalisation. The lens has been the
              central engineering vocabulary across four decades and
              four problem domains. The continuity matters because
              it is what makes the structural claim non-rhetorical
              &mdash; the same constructs really do work in each
              domain, and the working is documented.
            </p>
            <ul>
              <li>
                <strong>Forth at Metal Box (1984&ndash;89).</strong>{" "}
                The threaded-interpreter execution model that, twenty-
                five years later, became the runtime for the
                Action Language.
              </li>
              <li>
                <strong>Shlaer-Mellor from 1989 onward.</strong>{" "}
                OOA/D as practised industrially &mdash; domain
                charts, bridges, assigner state models, subtyping
                with role migration, action specification languages,
                model compilation. Twenty-five years of professional
                practice across telecoms switching, embedded
                systems, defence comms.
              </li>
              <li>
                <strong>Ascom AG (1994&ndash;96).</strong>{" "}
                Shlaer-Mellor in production with Tcl simulation,
                including the bridge-composition extension that
                describes inter-domain dependencies as sequences of
                interactions traversing domain boundaries. The
                extension was carried into the accessibility
                methodology a decade later.
              </li>
              <li>
                <strong>Nokia Mobile (1997&ndash;2001).</strong>{" "}
                Adaptive UIs as recursive design: self-adapting
                interfaces moving across devices of varying
                capability, with a single underlying analysis.
              </li>
              <li>
                <strong>The Carnforth/CISNA work (2004&ndash;13).</strong>{" "}
                Shlaer-Mellor applied explicitly to accessibility,
                with the bridge-composition extension and the
                Forth-style threaded-interpreter Action Language
                execution engine.
              </li>
              <li>
                <strong>
                  <Link href="/paradise">Paradise</Link> (current).
                </strong>{" "}
                The ActionLanguage IR for source-level accessibility
                analysis. The same shape again, this time applied
                to JavaScript runtime behaviour rather than to
                interface adaptation.
              </li>
            </ul>
            <p>
              <em>
                One continuous engineering project, applied to four
                problem domains, across four decades.
              </em>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                The standalone summary of the Shlaer-Mellor lens,
                shorter and less formal, lives at{" "}
                <Link href="/research/shlaer-mellor-lens">
                  /research/shlaer-mellor-lens
                </Link>
                .
              </li>
              <li>
                The running code &mdash; the original PhD-era Action
                Language XML notation, with four worked examples
                that execute in the browser via a TypeScript port of
                the Java reference engine &mdash; lives at{" "}
                <Link href="/research/action-language">
                  /research/action-language
                </Link>
                .
              </li>
              <li>
                The Carnforth five-layer model, which is the
                accessibility domain chart this page assumes, has
                its own page at{" "}
                <Link href="/research/carnforth-model">
                  /research/carnforth-model
                </Link>
                .
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Continue</h2>
            <p>
              <Link href="/research/the-measure-of-accessibility/equivalent-experience">
                &larr; Previous: 4. Equivalent Experience
              </Link>
              {" · "}
              <Link href="/research/the-measure-of-accessibility/communities-of-practice">
                Next: 6. Communities of Practice &rarr;
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
