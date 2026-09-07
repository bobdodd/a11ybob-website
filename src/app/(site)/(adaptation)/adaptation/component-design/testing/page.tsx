import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ComponentDesignSubNav } from "@/components/ComponentDesignSubNav";

export const metadata: Metadata = {
  title: "Testing across the hierarchy",
};

export default function Testing() {
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
            <h1>Testing across the hierarchy</h1>
            <p className="lede">
              If guarantees do not survive composition, then neither
              does evidence. Each level of assembly needs its own
              evidence, of its own kind, and the level at which a claim
              was tested has to be stated alongside the claim.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Evidence per claim level</h2>
            <p>
              What can be automated falls away rapidly as the level
              rises, and what remains is exactly the part that decides
              whether the interface is usable.
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="Evidence required at each level of assembly"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Level</th>
                    <th scope="col">Automatable</th>
                    <th scope="col">Requires human or AT evidence</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Primitive</th>
                    <td>
                      Role, name, state, contrast, target size,
                      focusability
                    </td>
                    <td>Little</td>
                  </tr>
                  <tr>
                    <th scope="row">Pattern</th>
                    <td>
                      Required attributes and relationships, tab order
                      within the widget
                    </td>
                    <td>
                      Keyboard grammar, announcement wording, AT
                      variation
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Compound</th>
                    <td>
                      Duplicate identifiers, heading sequence, label
                      association
                    </td>
                    <td>
                      Focus arbitration, announcement ordering,
                      realistic content
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Region</th>
                    <td>Landmark uniqueness, reflow at 320 CSS pixels</td>
                    <td>
                      Reading order coherence, whether the region makes
                      sense heard
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Page</th>
                    <td>
                      Page title, single main landmark, bypass
                      mechanism, no duplicate identifiers
                    </td>
                    <td>
                      Whether the whole page is navigable and
                      comprehensible non-visually
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Process</th>
                    <td>Very little</td>
                    <td>
                      Task completion, state retention, error recovery,
                      timing, cognitive load
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              The gradient is the point. Automation is nearly sufficient
              at the primitive level and nearly worthless at the process
              level, which is the level at which conformance is
              actually claimed.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A ten-step method</h2>
            <p>
              These steps run in order, and each one exists because it
              catches a class of failure the previous step cannot see.
            </p>
            <ol>
              <li>
                <strong>Component in isolation.</strong> Automated
                checks, keyboard walk, name and role verification,
                against the component&rsquo;s declared guarantees.
              </li>
              <li>
                <strong>Component with hostile content.</strong> Long
                strings, empty values, missing alternatives,
                translations, user-generated markup, extreme density.
              </li>
              <li>
                <strong>Component in a realistic page.</strong> Real
                heading context, real landmarks, real siblings.
              </li>
              <li>
                <strong>Pairwise composition.</strong> Test known
                collision pairs deliberately: dialog with combobox, grid
                in tabpanel, form with live-region status, sticky header
                with in-page links.
              </li>
              <li>
                <strong>Region assembly.</strong> Focus arbitration,
                announcement ordering and coalescing, keyboard grammar
                resolution.
              </li>
              <li>
                <strong>Page assembly.</strong> Landmark uniqueness, tab
                order across the page, heading outline, reflow at 320
                CSS pixels, 200% text, 400% zoom, text-spacing
                overrides, forced colours.
              </li>
              <li>
                <strong>Process assembly.</strong> Task completion by
                keyboard alone, by screen reader, and by speech input;
                data retention across steps; error recovery; timing.
              </li>
              <li>
                <strong>Assistive technology matrix.</strong> Per
                browser and screen reader combination, per platform,
                with results recorded per combination rather than
                collapsed to a single verdict.
              </li>
              <li>
                <strong>Override and escape-hatch regression.</strong>{" "}
                Every documented override retested for the guarantees it
                is known to touch.
              </li>
              <li>
                <strong>Profile variation.</strong> Each supported
                capability and preference profile exercised, since a
                variant selected for one profile is untested for
                another.
              </li>
            </ol>
            <p>
              Step 4 is the one most likely to be skipped and the one
              that pays back fastest. The collision pairs are a short,
              enumerable list, and they are where the compositional
              bugs actually live.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What the tools reach</h2>
            <p>
              The tooling is real and useful. It is also almost entirely
              concentrated at the levels where the failures are least
              interesting.
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="Testing tools and the levels they reach"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Tool</th>
                    <th scope="col">Reaches</th>
                    <th scope="col">Does not reach</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">axe-core</th>
                    <td>
                      Rule-based checks on a rendered tree, at any level
                    </td>
                    <td>
                      Focus arbitration, announcement ordering, keyboard
                      grammar, comprehension
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Playwright and axe-core/playwright</th>
                    <td>
                      Real browser, keyboard simulation, viewport and
                      zoom variation, per-state scans
                    </td>
                    <td>
                      Actual assistive technology behaviour
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Storybook test addon</th>
                    <td>
                      Per-component and per-story checks in CI
                    </td>
                    <td>
                      Page and process assembly, by construction
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Accessibility Insights and IBM Equal Access
                    </th>
                    <td>
                      Guided manual assessment, tab-order and
                      landmark visualisation
                    </td>
                    <td>Unattended regression at scale</td>
                  </tr>
                  <tr>
                    <th scope="row">ARIA-AT</th>
                    <td>
                      Standardised expectations for screen reader
                      behaviour on APG patterns
                    </td>
                    <td>
                      Arbitrary compositions and bespoke compounds
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              ARIA-AT is the most significant of these for the argument
              in this section, because it is the only project that
              attempts to make screen reader behaviour testable at all
              rather than merely reportable. It is also scoped to
              patterns, which is precisely the level at which
              composition has not yet happened.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The hard limit</h2>
            <blockquote>
              <p>
                Component-level green is not evidence for the page.
              </p>
            </blockquote>
            <p>
              Every component passing every automated check is
              compatible with a page that is unusable, and this is not a
              hypothetical. It is the predictable consequence of the
              eight failure modes: each of them lives in the
              relationships between components, and automated
              component-level rules examine components.
            </p>
            <p>
              This is why a design system has to hold{" "}
              <Link href="/adaptation/afds/evidence-and-uncertainty">
                evidence scoped to a level and an environment
              </Link>
              , and why the level of the claim has to be recorded next
              to the claim. &ldquo;This component is accessible&rdquo;
              is not a false statement so much as an incomplete one: it
              omits the level at which it was established, the content
              it was established with, and the assistive technology it
              was established on.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>References</h2>
            <ul>
              <li>
                Deque Systems. <em>axe-core API documentation</em>.{" "}
                <a href="https://github.com/dequelabs/axe-core/blob/develop/doc/API.md">doc/API.md</a>
              </li>
              <li>
                Deque Systems.{" "}
                <em>axe-core/playwright integration</em>.{" "}
                <a href="https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright">packages/playwright</a>
              </li>
              <li>
                Playwright. <em>Accessibility testing</em>.{" "}
                <a href="https://playwright.dev/docs/accessibility-testing">docs/accessibility-testing</a>
              </li>
              <li>
                Storybook. <em>Accessibility tests</em>.{" "}
                <a href="https://storybook.js.org/docs/writing-tests/accessibility-testing">writing-tests/accessibility-testing</a>
              </li>
              <li>
                Microsoft. <em>Accessibility Insights</em>.{" "}
                <a href="https://accessibilityinsights.io">
                  accessibilityinsights.io
                </a>
              </li>
              <li>
                IBM. <em>IBM Accessibility: toolkit tools</em>.{" "}
                <a href="https://www.ibm.com/able/toolkit/tools">toolkit/tools</a>
              </li>
              <li>
                W3C. <em>ARIA-AT</em>.{" "}
                <a href="https://aria-at.w3.org">aria-at.w3.org</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
