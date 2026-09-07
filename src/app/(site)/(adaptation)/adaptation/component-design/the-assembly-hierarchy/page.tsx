import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ComponentDesignSubNav } from "@/components/ComponentDesignSubNav";

export const metadata: Metadata = {
  title: "The assembly hierarchy",
};

export default function TheAssemblyHierarchy() {
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
            <h1>The assembly hierarchy</h1>
            <p className="lede">
              Accessibility responsibility does not merely accumulate as
              things get bigger. It changes character at each level of
              assembly, and the obligations at one level cannot be
              discharged by work at another.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Six levels</h2>
            <p>
              Naming the levels explicitly is worth doing, because the
              argument that follows depends on which level a claim is
              made at, and most claims in circulation do not say.
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="The six levels of assembly and the accessibility responsibility that dominates each"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Level</th>
                    <th scope="col">Example</th>
                    <th scope="col">Dominant responsibility</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">0. Primitive</th>
                    <td>button, input, heading, link</td>
                    <td>
                      Native semantics, accessible name, state, target
                      size, focus appearance
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">1. Simple component</th>
                    <td>search field, alert, card, field group</td>
                    <td>
                      Relationships among primitives, label
                      association, reading order
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">2. Composite component</th>
                    <td>
                      combobox, tablist, data grid, date picker, menu
                    </td>
                    <td>
                      Internal focus model, keyboard grammar, owned
                      roles, state announcement
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">3. Region</th>
                    <td>
                      header, primary navigation, form, results panel
                    </td>
                    <td>
                      Landmark identity, heading level, region-scoped
                      status
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">4. Page</th>
                    <td>the assembled document</td>
                    <td>
                      Landmark set, heading outline, focus sequence,
                      reflow, duplication, conflict arbitration
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">5. Process</th>
                    <td>
                      registration, checkout, application flow
                    </td>
                    <td>
                      Continuity, state retention, error recovery,
                      consistent navigation, end-to-end conformance
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where the attention goes, and where it does not</h2>
            <p>
              Two observations follow from the table, and they are the
              reason it is worth drawing.
            </p>
            <p>
              The first is a distribution problem. Most component
              libraries stop at level 2, because level 2 is where a
              reusable artefact can honestly be delivered: a combobox
              can be built once and used everywhere. Most automated
              tooling operates at level 4, because a rendered page is
              what a rule engine can be pointed at. Levels 3 and 5 —
              regions and processes — are the least served by either,
              and they are exactly where composition failures
              concentrate. A landmark collision is a level 3 event. A
              lost form state after a session timeout is a level 5
              event. Neither is visible to a component test or to a
              page scan.
            </p>
            <p>
              The second is a conformance point rather than a
              convenience. WCAG&rsquo;s provision for complete
              processes means that where a series of pages is needed to
              complete an activity, all pages in the series must
              conform for any of them to be claimed as conforming. So
              level 5 is not a testing nicety layered on top of the
              real work. It is a level at which conformance is defined,
              and a component-level claim can never discharge a
              level 5 obligation. No amount of green at level 2 adds up
              to a conforming checkout.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why the level of a claim has to be stated</h2>
            <p>
              Once the levels are named, the ordinary sentence &ldquo;the
              component is accessible&rdquo; can be seen for what it is:
              a claim with its scope removed. It might mean that the
              primitive has a correct accessible name, that the
              composite implements its keyboard grammar, or that
              somebody once used it in a page that passed a scan. Those
              are three different assertions supported by three
              different kinds of evidence, and collapsing them is how a
              team ends up surprised.
            </p>
            <p>
              This is the reason the design system I am building{" "}
              <Link href="/adaptation/afds/evidence-and-uncertainty">
                records the level and the environment of every piece of
                evidence
              </Link>
              , rather than a single flag. A claim without a level
              cannot be checked, and cannot be safely inherited by
              whoever assembles the next thing.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>References</h2>
            <ul>
              <li>
                W3C Web Accessibility Initiative.{" "}
                <em>
                  Understanding Conformance: complete processes
                </em>
                .{" "}
                <a href="https://www.w3.org/WAI/WCAG22/Understanding/conformance">Understanding/conformance</a>
              </li>
              <li>
                W3C.{" "}
                <em>
                  Accessible Rich Internet Applications (WAI-ARIA) 1.2:
                  managing focus in composite widgets
                </em>
                .{" "}
                <a href="https://www.w3.org/TR/wai-aria-1.2/#managingfocus">TR/wai-aria-1.2</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
