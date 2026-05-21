import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";

export default function AccessibilityOfDialogue() {
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
            <h1>
              Accessibility as a property of the dialogue, not the
              device
            </h1>
            <p className="lede">
              A formal-and-political reframing from a 2006 paper,
              complementary to the Functional / Intrinsic
              distinction. Three structural moves in one
              definition; the cleanest correction of one of the
              field&rsquo;s most stubborn category errors.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The definition</h2>
            <blockquote>
              <p>
                <em>
                  Goods and services are accessible if the
                  provider of the goods or services offers a means
                  by which a broad range of users may enter into a
                  dialogue with the provider to gain access to
                  them at any given place and time.
                </em>
              </p>
            </blockquote>
            <p>
              From an ATNAC 2006 submission. The paper was not
              published &mdash; venue mismatch with ATNAC&rsquo;s
              networks-and-telecoms-engineering focus &mdash; so
              what follows is a dated written artefact, not a
              citation. The structural moves carried through into
              the later doctoral work and stand independent of
              whether the original paper found its venue.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Move one: the unit of accessibility is the dialogue</h2>
            <p>
              A device alone is not accessible or inaccessible
              &mdash; it either supports a particular user&rsquo;s
              dialogue with a particular provider, or it does not.
            </p>
            <blockquote>
              <p>
                <em>
                  If a device only provides a means for some users
                  to hold a dialogue with a provider, then it is
                  not meaningful to describe the device as
                  &lsquo;accessible&rsquo;, nor can one describe
                  one device as more accessible than another; it
                  either works for a particular user, or it
                  doesn&rsquo;t.
                </em>
              </p>
            </blockquote>
            <p>
              This is the cleanest correction of one of the
              field&rsquo;s most stubborn category errors:
              talking about <em>an accessible iPhone</em> or{" "}
              <em>an accessible website</em> as if the artefact
              carried the property in itself. It does not.
              Accessibility is a property of the relation between
              a specific user (with a specific capacity profile
              in a specific context) and a specific provider
              (with a specific catalogue of devices and channels
              through which to engage). Move the user, the
              context, or the catalogue, and the accessibility
              status moves with them.
            </p>
            <p>
              The closely related observation in the doctoral
              framework is that{" "}
              <Link href="/research/the-measure-of-accessibility/functional-accessibility">
                functional accessibility
              </Link>{" "}
              is also relational rather than intrinsic to the
              device &mdash; achievable through at least one
              successful negotiation between a user and a
              provider, in a specific context, via at least one
              available medium-and-protocol path. The dialogue
              reframing is more general still: it generalises
              from <em>one specific user / one specific
              interface</em> to <em>a population of users / a
              catalogue of provider channels</em>.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Move two: measurement is coverage across an offered range</h2>
            <blockquote>
              <p>
                <em>
                  Measurement of accessibility then becomes a
                  question of coverage: taken together, does the
                  offered range of devices provide a means for
                  all users, disabled and non-disabled, to access
                  the goods and services?
                </em>
              </p>
            </blockquote>
            <p>
              A coverage-set formulation. A provider is accessible
              if their range of devices and channels collectively
              supports every user in the target population. The
              property attaches to the <em>catalogue</em>, not to
              any single artefact within it.
            </p>
            <p>
              This is distinct from intrinsic accessibility as
              formalised in{" "}
              <Link href="/research/the-measure-of-accessibility/intrinsic-accessibility">
                the Measure of Accessibility collection
              </Link>
              . Intrinsic accessibility names how many 
              pseudo-users a <em>single</em> underlying interface
              admits; coverage names how many real-population
              users a <em>provider&rsquo;s collection</em> of
              interfaces admits. The two measures complement
              each other: an intrinsically accessible single
              channel is better than a functionally accessible
              specialist channel; a coverage-set of intrinsically
              accessible channels is better than either.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Move three: the commercial-and-legal version</h2>
            <p>
              The same conclusion arrived at from a different
              angle, useful for audiences who do not engage with
              the equality framing.
            </p>
            <blockquote>
              <p>
                <em>
                  In supplying phones, manufacturers are in
                  competition, and one element, to support legal
                  accessibility requirements, will increasingly
                  be breadth of user-base. In such an environment
                  there is a commercial advantage in demonstrably
                  maximizing the breadth of user-base;
                  &lsquo;demonstrably&rsquo;, because it may be
                  necessary to convince courts and lawyers that
                  best efforts have been made to provide access
                  to goods and services.
                </em>
              </p>
            </blockquote>
            <p>
              For commercial buyers framing accessibility as risk
              management rather than as rights, the conclusion
              still holds: maximise breadth of user-base across
              your channel catalogue, demonstrably, because the
              alternative is litigable. Same destination as the
              equality argument; different vehicle. The
              destination is the accessibility status of the
              provider&rsquo;s offering, not the accessibility
              status of any single artefact.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The strategic observation embedded in the same paper</h2>
            <blockquote>
              <p>
                <em>Multiple impairments are a common feature of ageing.</em>
              </p>
            </blockquote>
            <p>
              The 2006 paper states explicitly that the typical
              accessibility case is not a single textbook
              disability but combinations that compound and that
              change over time &mdash; and that the demographic
              engine for this is ageing, not 
              disability-from-birth. Today&rsquo;s accessibility-and-ageing pivot
              is a 2006 claim, written up twenty years ago, that
              no venue picked up at the time. The paper&rsquo;s
              rejection means it is not a citation; the dated
              artefact in the archive remains.
            </p>
            <p>
              The same observation surfaces formally in the
              doctoral framework via the <em>spiky profile</em>{" "}
              construct &mdash; the Capability / Capacity /
              Preference / Requirement four-model architecture
              handles multi-axis variability trivially because
              the templates compose along multiple ontologies
              (visual, sonic, haptic, cognitive, colour-vision,
              language). The bucket model the field defaults to
              &mdash; <em>blind / deaf / motor-impaired /
              cognitive-impaired</em> &mdash; handles it by
              failing. See{" "}
              <Link href="/research/the-measure-of-accessibility/intrinsic-accessibility">
                Intrinsic Accessibility
              </Link>{" "}
              for the formal treatment of the four-model
              architecture, and the worked Mike Smith / David
              Furness personas in the thesis Personas appendix
              for the operational granularity.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/research/the-measure-of-accessibility/functional-accessibility">
                  The Measure of Accessibility &mdash; Functional
                  Accessibility
                </Link>{" "}
                &mdash; the relational property at the level of a
                single interface-user-context triple.
              </li>
              <li>
                <Link href="/research/the-measure-of-accessibility/intrinsic-accessibility">
                  The Measure of Accessibility &mdash; Intrinsic
                  Accessibility
                </Link>{" "}
                &mdash; the property of an underlying interface
                that admits many such relations.
              </li>
              <li>
                <Link href="/research/the-measure-of-accessibility/equivalent-experience">
                  The Measure of Accessibility &mdash; Equivalent
                  Experience
                </Link>{" "}
                &mdash; the cost-aware analysis that holds the
                formal definitions honest.
              </li>
              <li>
                <Link href="/work">/work</Link> &mdash; where the
                commercial-and-legal version of the dialogue
                framing is most directly useful to clients.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
