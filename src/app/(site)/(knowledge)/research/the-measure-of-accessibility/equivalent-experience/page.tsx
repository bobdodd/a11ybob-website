import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { MeasureSubNav } from "@/components/MeasureSubNav";

export default function EquivalentExperience() {
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
            <h1>4. Equivalent Experience</h1>
            <p className="lede">
              <em>
                We are all equal members of society with the same
                right to access goods and services, and we should
                expect to have functional access to goods and
                services independent of our physical capability.
                That, in the end, is what accessibility means.
              </em>
            </p>
          </header>

          <MeasureSubNav />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What functional and intrinsic do not say</h2>
            <p>
              Functional accessibility &mdash;{" "}
              <Link href="/research/the-measure-of-accessibility/functional-accessibility">
                page 2
              </Link>{" "}
              &mdash; gives a floor: at least one path through must
              succeed. Intrinsic accessibility &mdash;{" "}
              <Link href="/research/the-measure-of-accessibility/intrinsic-accessibility">
                page 3
              </Link>{" "}
              &mdash; gives a breadth: the underlying interface must
              admit many such paths for many user-and-context
              profiles. Both definitions count successful task
              completion. Neither says anything about what the
              successful completion <em>cost</em>{" "}the user who
              completed it.
            </p>
            <p>
              That silence is deliberate: cost-of-experience is a
              different question from existence-of-path, and
              conflating them produces an analytical mess. But the
              question of cost cannot be left out of a serious
              account of accessibility, because the entire field
              has a long-running pattern of declaring the question
              answered the moment a path exists, with no further
              attention to what using that path is actually like.
              That declaration is wrong, and naming why it is wrong
              is the work of this page.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The timing dimension</h2>
            <p>
              The most measurable cost is time. A sighted user
              completes a checkout flow in forty seconds; a
              screen-reader user completes the same flow in eight
              minutes; both interfaces are functionally accessible
              by the floor definition. The difference is twelve
              times the effort spent on the same business
              transaction. The screen-reader user pays that
              difference every time they buy something online, and
              the sighted user does not.
            </p>
            <p>
              The temporal asymmetry is rarely accidental. The
              ordinary path through an interface is the one the
              designer optimised for; the assistive path inherits
              whatever the designer left over. Tab-order issues,
              redundant ARIA-region announcements, dynamic content
              that pulls focus away, modals that trap keyboard
              users, focus-loss after AJAX updates &mdash; each
              adds a few seconds. The cumulative effect, measured
              honestly, is a hidden tax on the user whose only
              accessible path is the assistive one. The interface
              can be functionally accessible <em>and</em>{" "}tax its
              minority users at a rate that no commercial product
              would tolerate if it were a minority of revenue.
            </p>
            <p>
              Equivalent-experience analysis names that asymmetry
              and asks the explicit question: <em>are users on
              different paths paying comparable amounts of effort
              for comparable outcomes?</em>{" "}The asymmetry is
              measurable. The ratio is not subtle. A definition of
              accessibility that cannot ask this question is a
              definition that cannot tell you what is wrong with an
              interface where the screen-reader path takes ten
              times longer than the visual one.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The equality argument</h2>
            <p>
              The lede of this page is the political claim
              underneath the temporal one. The claim is not that
              every user must have the same experience &mdash;
              experiences differ, and the differences are not
              themselves the problem. The claim is that every user
              has the same right to the goods and services on
              offer, and that the cost of the difference in
              experience should not be paid systematically by the
              users whose bodies fall outside the designer&rsquo;s
              default assumptions.
            </p>
            <p>
              Two readings of that claim are common, and one of them
              is wrong.
            </p>
            <p>
              The wrong reading treats the claim as a demand for
              identical experience. <em>Identical</em>{" "}is not what
              the claim asks for. A blind user cannot have the same
              perceptual experience as a sighted user; the
              difference is not the accessibility problem.
              Equivalent-experience analysis is about whether the{" "}
              <em>functional outcome</em>{" "}&mdash; the goods, the
              services, the participation in society &mdash; is
              available to both at comparable cost in effort,
              attention, and time. The shape of the journey can
              differ; the accessibility of the destination is the
              question.
            </p>
            <p>
              The right reading treats the claim as a demand for
              equality of access. The user who is blind, the user
              with a tremor, the user navigating in a noisy
              environment, the user with low literacy in the
              interface&rsquo;s language &mdash; all of them are
              members of the society the interface serves, and all
              of them are entitled to participate at comparable
              cost. The equality is in the entitlement, not in the
              perceptual or motor sequence by which the entitlement
              is exercised.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why utilitarianism is the wrong frame</h2>
            <p>
              The argument deserves to be made explicitly, because
              utilitarian framings are widespread in accessibility
              practice and largely unexamined. The shorthand
              version: <em>we are doing the greatest good for the
              greatest number, so we are right to optimise for the
              majority case and treat the minority as a residual
              accommodation.</em>
            </p>
            <p>
              The framing is appealing because it reads as
              hard-headed and as resource-aware. It is also wrong,
              for two reasons.
            </p>
            <p>
              The first reason is structural. Utilitarian logic
              evaluates an action by summing utility across a
              population. To compute the sum, you have to be able
              to add the utility you give one user to the utility
              you give another. Inter-personal utility comparisons
              are notoriously contested even in the philosophical
              literature that takes utilitarianism seriously; in
              accessibility practice, they are typically not
              attempted at all. What replaces them is a simple
              numerical headcount &mdash; the majority outvotes the
              minority &mdash; which has nothing to do with utility
              maximisation and everything to do with the
              convenience of the designer.
            </p>
            <p>
              The second reason is categorial. Accessibility is not
              a question about how to allocate utility; it is a
              question about who is recognised as a member of the
              society the interface serves. A user who is excluded
              from a banking app because the screen-reader path
              never worked is not someone whose utility is too low
              to bother optimising for; they are someone the
              designer treated as not-a-member. The harm is not
              that they got less utility; the harm is that they
              were not in the population the designer counted in
              the first place. Utilitarian framings cannot
              represent that harm because their operative
              vocabulary is summing across members, and the harm is
              precisely the failure to recognise membership.
            </p>
            <p>
              The right vocabulary is rights, not utility. Rights
              attach to membership; membership is not earned by
              being in the majority; the failure to provide
              accessible access to a recognised member is a
              violation, not an unfortunate trade-off. That framing
              is what the lede captures. It is also why the legal
              vocabulary (which is rights-shaped) and the
              utilitarian vocabulary (which is sum-shaped) cannot
              be reconciled into a single hybrid: they are
              answering different questions about different objects.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What &ldquo;equivalent&rdquo; permits</h2>
            <p>
              Equivalent-experience analysis is not a demand for
              perceptual sameness, and recognising this matters in
              practice. Some examples:
            </p>
            <ul>
              <li>
                <strong>Different sequencing.</strong>{" "}A 
                screen-reader user often navigates a page non-linearly via
                heading or landmark navigation, while a sighted
                user scans visually. The two routes are different;
                neither is wrong. Equivalent-experience analysis
                accepts both as long as both arrive at the same
                outcome at comparable cost.
              </li>
              <li>
                <strong>Different modality.</strong>{" "}A
                deaf user reads transcripts while a hearing user
                listens. The modalities are different; the content
                can be equivalent. The analysis does not insist
                that everyone listen, only that the content be
                conveyed.
              </li>
              <li>
                <strong>Different affordances.</strong>{" "}A 
                motor-impaired user may invoke an action via a single
                switch press rather than a click-drag-release; the
                action sequence is different; the action is the
                same. Whether the affordances are <em>equivalent</em>{" "}
                depends on whether the cost of using the
                alternative path is comparable to the cost of using
                the default.
              </li>
            </ul>
            <p>
              What the analysis does not permit is{" "}
              <em>asymmetric cost</em>. A screen-reader path that
              works but takes ten times as long is not equivalent;
              it is a tax. A switch-access path that requires
              twenty stops to invoke an action a mouse user
              completes in one click is not equivalent; it is a
              tax. The analysis is comfortable with 
              shape-difference; it is not comfortable with 
              cost-difference at scales that fall systematically on the
              minority user.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What this leaves to the next two pages</h2>
            <p>
              Pages 1 through 4 establish the position: the question
              is political; functional and intrinsic accessibility
              are the formal measures of two distinct properties;
              equivalent experience is the cost-aware analysis that
              holds them honest.
            </p>
            <p>
              Pages 5 and 6 turn from definition to construction.{" "}
              <Link href="/research/the-measure-of-accessibility/the-shlaer-mellor-lens">
                Page 5
              </Link>{" "}
              treats the methodological substrate &mdash; the
              recursive-design framing that makes the formal
              definitions buildable rather than just stated.{" "}
              <Link href="/research/the-measure-of-accessibility/communities-of-practice">
                Page 6
              </Link>{" "}
              reframes inaccessibility itself as a kind of
              community dysfunction, and opens onto the multi-agent
              and game-theoretic territory the{" "}
              <Link href="/research/2029-framework">
                2029 framework
              </Link>{" "}
              resumes.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Continue</h2>
            <p>
              <Link href="/research/the-measure-of-accessibility/intrinsic-accessibility">
                &larr; Previous: 3. Intrinsic Accessibility
              </Link>
              {" · "}
              <Link href="/research/the-measure-of-accessibility/the-shlaer-mellor-lens">
                Next: 5. The Shlaer-Mellor lens &rarr;
              </Link>
            </p>
            <p>
              See also{" "}
              <Link href="/research/accessibility-of-dialogue">
                Accessibility as a property of the dialogue, not
                the device
              </Link>{" "}
              &mdash; a complementary 2006 reframing, with the
              coverage-set formulation and the 
              commercial-and-legal version of the equality argument.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
