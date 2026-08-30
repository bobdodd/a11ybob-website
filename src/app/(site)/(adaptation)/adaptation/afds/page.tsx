import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AfdsSubNav } from "@/components/AfdsSubNav";
import { NewTabLink } from "@/components/NewTabLink";

export const metadata: Metadata = {
  title: "Describing interfaces and modalities",
};

export default function Afds() {
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
            <h1>Describing interfaces and modalities</h1>
            <p className="lede">
              A capability model says what a person can do. A preference
              model says what they would rather. Those two, with the
              needs of the application itself, are what interface design
              decisions are actually made from, and a design system is
              where the outcome of those decisions gets written down.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What an AFDS is</h2>
            <p>
              A capability model says what a person can do and a
              preference model says what they would rather, and those,
              together with the needs of the application, drive design
              decisions for the user interface. The outcomes of those
              decisions are described by a design system that sets
              rendering and interaction rules, often building a
              hierarchy of components and layout strategies. Those
              design systems are Accessibility Focused Design Systems,
              or AFDS, and they cover multiple forms of user
              interaction.
            </p>
            <p>
              The order in that sentence matters, and it is the part
              most often got backwards. A design system is not the
              starting point, and it is not a standard handed down from
              outside to be complied with. It is an artefact of a
              selection process. Something was chosen, for a particular
              set of capabilities, a particular set of preferences, and
              a particular job the application has to do, and the design
              system is the record of what was chosen together with the
              rules that follow from it. Change the people, or the
              preferences, or the job, and a different design system is
              the right answer.
            </p>
            <p>
              That is also why accessibility focused is not a label
              stuck onto a design system that already existed. It
              describes where the pressure came from at the moment the
              choices were made. A system whose rules were settled on
              other grounds and then checked for accessibility
              afterwards is a different kind of object, however
              respectable its contrast ratios turn out to be.
            </p>
            <p>
              The word rules is doing real work too. A design system
              that only shows what things look like has not said enough
              to be useful. Rendering rules say how a component is drawn
              across the whole range of conditions it has to survive,
              which includes zoom, reflow, forced colours, reduced
              motion, and whatever the person has already told the
              platform they need. Interaction rules say what happens
              when someone operates it, and operating it covers
              keyboard, pointer, touch, speech, and switch. That is what
              multiple forms of user interaction means once it stops
              being a phrase and starts being a specification.
            </p>
            <p>
              Written down so it can be carried, an AFDS is a portable
              bundle. The components in it declare what they guarantee,
              what they do not guarantee, what the
              assistive-technology record actually says about them, and
              what remains uncertain. The non-guarantees and the
              uncertainty are not there for modesty. A component that
              advertises only its promises cannot be assessed at all,
              because a reader has no way to separate a claim that was
              tested from a claim nobody has examined yet.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why this is a design system problem</h2>
            <p>
              Almost all accessibility work happens after the fact and
              one page at a time. A page is audited, the findings are
              written up, a developer fixes what the report lists, the
              page passes, and the next page is audited. It is orderly,
              it is billable, and it is close to the least effective
              arrangement anyone could have arrived at.
            </p>
            <p>
              The difficulty is that the page is usually not where the
              problem lives. A finding on a page is a symptom of a
              component, and that component is used in a hundred other
              places, most of which were never in the audit. Fixing the
              instance leaves the rule untouched, so the same finding
              returns in the next release, and the one after that, and
              the cost of the work never falls. Anyone who has run a
              remediation programme for more than a year has seen the
              same finding paid for several times.
            </p>
            <p>
              The decisions that produced that finding were made much
              earlier, by somebody settling how a control would be drawn
              and how it would behave when operated. That is a design
              system, whether or not anyone wrote one down. If the rule
              is where the problem lives then the rule is where the fix
              belongs, and remediating a page is at best a way of buying
              time until the rule changes.
            </p>
            <p>
              There is a second reason, less obvious than the first. A
              remediated page carries no reasoning. It records that
              something was changed, not why the change was correct,
              what was tested, on which assistive technology, at which
              version, or what is still unknown. A design system can
              carry all of that, attached to the component the claim is
              about, which means the next person to touch it inherits
              the evidence instead of starting the investigation again.
              This is the difference between a system that has been
              tested and a system that can show its testing.
            </p>
            <p>
              None of which fixes content. A design system can
              guarantee that a heading is marked up as a heading and
              that its contrast holds at every zoom level it claims to
              support. It cannot make the heading say anything useful,
              it cannot write the alternative text for an image it has
              never seen, and it cannot rescue a page whose reading
              order makes no sense. Those stay editorial problems, and a
              system claiming otherwise would be overselling itself.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The parts</h2>
            <ol>
              <li>
                <Link href="/adaptation/afds/why-a-design-system">
                  Why a design system
                </Link>
                : the case for the design system as the place where
                accessibility decisions are made and recorded.
              </li>
              <li>
                <Link href="/adaptation/afds/what-a-component-declares">
                  What a component declares
                </Link>
                : contracts, guarantees, and the non-guarantees a
                component must state as plainly as its promises.
              </li>
              <li>
                <Link href="/adaptation/afds/evidence-and-uncertainty">
                  Evidence and uncertainty
                </Link>
                : the assistive-technology record as structured data,
                and what is not yet known kept as a record in its own
                right.
              </li>
              <li>
                <Link href="/adaptation/afds/apg-support">
                  Supporting the APG
                </Link>
                : adopting the authoring practices by reference rather
                than restating them, and reaching for native HTML
                before reaching for ARIA.
              </li>
              <li>
                <Link href="/adaptation/afds/portable-representations">
                  Portable representations
                </Link>
                : what the industry has already built to carry a design
                system between tools, and the things none of it can yet
                express.
              </li>
              <li>
                <Link href="/adaptation/afds/the-package-format">
                  The package format
                </Link>
                : one file, a manifest, and an inventory of digests, so
                a design system can be carried and checked.
              </li>
              <li>
                <Link href="/adaptation/afds/adapters">Adapters</Link>
                : how a package meets a real toolchain, and why no
                adapter is canonical.
              </li>
              <li>
                <Link href="/adaptation/afds/open-questions">
                  Open questions
                </Link>
                : what is unresolved, kept in the open, because a
                system that records uncertainty owes the same of
                itself.
              </li>
              <li>
                <Link href="/adaptation/afds/user-guide">User guide</Link>
                : how to read, author, package, and validate an AFDS.
              </li>
              <li>
                <Link href="/adaptation/afds/specification">
                  Specification
                </Link>
                : the formal text, version 1.0.0, which specifies the
                package today and is intended to grow into a full
                definition.
              </li>
            </ol>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Materials</h2>
            <p>
              The research notes, the drafts, the tooling, and a
              complete worked sample package live in the project
              repository:{" "}
              <NewTabLink href="https://github.com/bobdodd/accessible-by-design">
                accessible-by-design on GitHub
              </NewTabLink>
              . Documentation there is licensed CC BY-SA 4.0 and code is
              GPL-3.0-only.
            </p>
            <p>
              The two models this design system acts on are described
              in{" "}
              <Link href="/adaptation/describing-people-to-computers">
                the capability model
              </Link>{" "}
              and{" "}
              <Link href="/adaptation/describing-what-people-want">
                the preference model
              </Link>
              .
            </p>
            <p>
              AFDS 1.0.0 is a project draft. It is not a W3C standard,
              not a published industry specification, and not on any
              standards track. Every field name and identifier in it
              should be read as stable within this project and unstable
              outside it.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
