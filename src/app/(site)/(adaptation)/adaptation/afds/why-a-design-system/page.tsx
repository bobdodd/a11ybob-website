import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AfdsSubNav } from "@/components/AfdsSubNav";

export const metadata: Metadata = {
  title: "Why a design system",
};

export default function WhyADesignSystem() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <AfdsSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Why a design system</h1>
            <p className="lede">
              Accessibility work is usually organised around finding
              defects in pages. The decisions that produced those
              defects were taken somewhere else, and that somewhere else
              is a design system, whether or not anyone has written one
              down.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Remediation treats pages, not systems</h2>
            <p>
              A remediation programme has a shape. Pages are sampled,
              the sample is audited, findings are written against
              individual pages, developers fix what the report lists,
              the pages are retested, and the report closes. Every step
              is sensible on its own terms. The whole is still working
              at the wrong level.
            </p>
            <p>
              An audit samples, and it has to, because auditing every
              page of a large estate by hand is not affordable. So a
              finding arrives attached to the page it happened to be
              noticed on, which is a fact about the sampling rather than
              a fact about the defect. The same control, drawn the same
              way and behaving the same way, is very likely sitting on
              pages that were never in the sample.
            </p>
            <p>
              When the fix lands on the page, the rule that produced the
              defect is untouched. The next page built from that rule
              carries the defect again. A later release can reintroduce
              it into pages that were already fixed, because nothing in
              the build stops it. Work organised this way does not
              accumulate, which is the whole problem with it.
            </p>
            <p>
              There is a subtler cost. The report is the only place the
              reasoning lives, and reports are not part of the
              codebase. Six months on, the developer looking at that
              component has the code and no record of why the previous
              change was made, what it was tested against, or what was
              deliberately left alone. Whatever knowledge made the fix
              correct is sitting in a PDF in somebody&rsquo;s mailbox.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where the decisions are actually made</h2>
            <p>
              Ask where a defect came from and the answer is never the
              page. Somebody decided how the control is drawn: its size,
              its contrast, its focus appearance, whether it reflows or
              clips, whether it survives a forced-colours mode. Somebody
              decided how it behaves: what the keyboard does, what gets
              announced, where focus goes when it opens and where focus
              returns when it closes. Those decisions are rules, and
              they were taken before the page existed.
            </p>
            <p>
              That set of rules is a design system. Most organisations
              have one whether they have named it or not, and the
              unnamed version is worse in every respect except that
              nobody has to maintain it. It still governs every page the
              team ships.
            </p>
            <p>
              This is not only my reading of it. In interviews with
              user-experience practitioners, Putnam, Rose and MacDonald
              found that adopting a design system was the most common
              answer to how companies were considering accessibility, at
              48% of 58 interview sessions, described as component or
              pattern libraries with accessibility coded into reusable
              components. Across the phases of their fieldwork the
              figure rose from 2 of 6 sessions in 2017, to 4 of 10 in
              late 2018 and early 2019, to 22 of 42 between November
              2019 and March 2020.
            </p>
            <p>
              That is worth reading carefully, because it does not say
              what it might first appear to say. It is not evidence that
              design systems make services accessible. It is evidence
              that practitioners, asked what they actually do, converge
              on the component as the place to put the work. The same
              study recorded usability testing with people with
              disabilities in 18 of 58 sessions, so this is not a story
              about a library replacing contact with disabled people.
              Both are reported. The library is simply reported more
              often.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What changes when the system carries the rules</h2>
            <p>
              The first change is arithmetic. A rule is fixed once and
              every future use of it inherits the fix, so the effort
              spent stops being proportional to the number of pages and
              starts being proportional to the number of components.
              That is a much smaller number, and unlike the page count
              it does not grow every time somebody publishes.
            </p>
            <p>
              The second change matters more. Once the rule lives
              somewhere durable, the evidence for it can live in the
              same place. A claim about assistive technology is only
              checkable if it records which engine, which browser, which
              versions, what was actually observed, and when. Attached
              to the component, that record is inherited by the next
              person to touch it. Attached to a page, it evaporates.
            </p>
            <p>
              The third change is that a component can be made to state
              what it does not do. A stated non-guarantee is not an
              admission of weakness, it is the thing that makes the
              guarantees legible. A layout primitive that carries
              geometry can say plainly that it carries no semantics, and
              the consumer then knows the work has not been done rather
              than assuming it has.
            </p>
            <p>
              The fourth change is that composition becomes testable.
              Components that pass in isolation can still produce broken
              heading order, duplicate landmarks, or focus behaviour
              that makes no sense once several of them are assembled
              into a real page. If the system holds the rules, it can
              hold rules about assembly too, and conformance can be
              claimed for compositions rather than only for parts.
            </p>
            <p>
              The fifth change is that layout stops being treated as a
              visual matter. Reflow, zoom, text-spacing overrides,
              forced colours, and the relationship between reading order
              and visual order are accessibility concerns that live in
              the arrangement of things rather than inside any one
              component. A system with layout primitives in it can hold
              those rules. A component library without them cannot.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What this does not fix</h2>
            <p>
              The clearest statement of the limit comes from the people
              who run the most rigorous public example. The GOV.UK
              Design System says it directly:
            </p>
            <blockquote>
              <p>
                <em>
                  Using the GOV.UK Design System in a service does not
                  immediately make that service accessible. You&rsquo;ll
                  need additional research, design, development and
                  testing work to make sure your service is accessible,
                  even when using accessible styles, components and
                  patterns.
                </em>
              </p>
            </blockquote>
            <p>
              That is the correct position and it should be quoted more
              often than it is. A design system moves the work to where
              it is cheapest and most durable. It does not remove the
              work, and a system sold as removing it is being sold
              dishonestly.
            </p>
            <p>
              It does not fix content. A system can guarantee that a
              heading is marked up as a heading and that its contrast
              holds at every zoom level it claims to support. It cannot
              make the heading say anything useful, it cannot write the
              alternative text for an image it has never seen, and it
              cannot rescue a page whose reading order makes no sense.
              Those stay editorial problems.
            </p>
            <p>
              It does not replace testing with disabled people.
              Component-level evidence records how a control behaves
              with a named screen reader on a named engine. It says
              nothing about whether the task that control belongs to can
              be completed, which is a different question and needs
              different work.
            </p>
            <p>
              And the current interchange formats cannot yet express
              some of what a system most needs to say. Design tokens
              carry named values well, but there is no standard way to
              state that one foreground value is valid only against a
              particular background at a particular ratio. Contrast is a
              relationship with a threshold, and a format that holds
              only values cannot hold it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>References</h2>
            <ul>
              <li>
                Putnam, C., Rose, E. J. and MacDonald, C. M. (2023).{" "}
                <em>
                  &ldquo;It could be better. It could be much
                  worse&rdquo;: Understanding Accessibility in User
                  Experience Practice with Implications for Industry and
                  Education
                </em>
                . ACM Transactions on Accessible Computing, 16(1),
                1&ndash;25.{" "}
                <a href="https://doi.org/10.1145/3575662">
                  doi:10.1145/3575662
                </a>
              </li>
              <li>
                Government Digital Service.{" "}
                <em>GOV.UK Design System: accessibility</em>.{" "}
                <a href="https://design-system.service.gov.uk/accessibility/">
                  design-system.service.gov.uk
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
