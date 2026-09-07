import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ComponentDesignSubNav } from "@/components/ComponentDesignSubNav";

export const metadata: Metadata = {
  title: "Worked examples",
};

export default function WorkedExamples() {
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
            <h1>Worked examples</h1>
            <p className="lede">
              Six compositions that any team would recognise, taken
              apart. None of them requires an unusual component or a
              careless developer. Each one breaks because two correct
              things were put together.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A combobox inside a modal dialog</h2>
            <p>
              Both patterns are individually well specified by the APG,
              and both are implemented carefully by most serious
              libraries. Composed, four things go wrong.
            </p>
            <ul>
              <li>
                Escape is claimed by both. The correct behaviour is that
                the first Escape closes the open listbox and only a
                second Escape closes the dialog. Neither component knows
                the other exists, so nothing implements this unless the
                parent arbitrates.
              </li>
              <li>
                The dialog traps Tab. The listbox popover, if portalled
                to <code>body</code>, may sit outside the trap and
                become unreachable, or may break the trap.
              </li>
              <li>
                Focus restoration on dialog close may target the
                combobox input, which is correct, or the trigger, which
                may no longer exist.
              </li>
              <li>
                <code>aria-activedescendant</code> on the input must
                reference an option inside the dialog&rsquo;s
                accessibility subtree, which portalling can break.
              </li>
            </ul>
            <p>
              This is the canonical case, and it is worth dwelling on
              why it is so stubborn. The bug is not in either component.
              It is in the absence of a third thing: an owner for the
              Escape key in that subtree. No component library ships
              that owner, because it does not belong to any component.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A clickable card containing a link and a menu button</h2>
            <ul>
              <li>
                Nested interactive controls: the card is a link or is
                wrapped in an anchor, and it contains an anchor and a
                button. The accessibility tree is ambiguous and the
                click targets overlap.
              </li>
              <li>
                Screen reader users hear the card name, then the same
                destination again as a link inside it.
              </li>
              <li>
                The correct composition is usually the pseudo-content
                link pattern, where only the title is the link and the
                card surface is a visual affordance. But the component
                library typically ships both variants and does not
                prohibit the bad one.
              </li>
            </ul>
            <p>
              That last point is the general shape of the problem. The
              library is not wrong to offer a clickable card. It is
              missing a statement that an interactive card excludes
              interactive descendants — a statement about composition,
              which no field in a conventional component API can hold.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A filter panel, a result list and a result count</h2>
            <ul>
              <li>
                Three components, three plausible live regions.
                Filtering announces &ldquo;Filters applied&rdquo;,
                &ldquo;Loading&rdquo; and &ldquo;42 results&rdquo; in
                unpredictable order.
              </li>
              <li>
                Focus after filtering: staying in the filter is right
                for a checkbox filter, and moving to the results heading
                is right for a submitted search. The components cannot
                decide between those. The page must.
              </li>
              <li>
                If filtering is debounced per keystroke, announcements
                queue and the user hears stale counts.
              </li>
            </ul>
            <p>
              Note that the right answer here depends on interaction
              design, not on correctness. Two teams could reasonably
              choose differently, and both choices are implementable.
              What is not acceptable is the third outcome, where nobody
              chooses and the behaviour is emergent.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A data grid inside a tabpanel</h2>
            <ul>
              <li>
                Arrow keys mean move cell inside the grid and change tab
                on the tablist. If focus handling bubbles, arrowing
                inside the grid changes the tab and destroys the grid
                the user was working in.
              </li>
              <li>
                The grid&rsquo;s column headers are correct, and the
                tabpanel&rsquo;s accessible name and the grid&rsquo;s
                caption may duplicate one another.
              </li>
              <li>
                Virtualisation removes rows outside the viewport from
                the accessibility tree, so <code>aria-rowcount</code>{" "}
                must be set explicitly or the grid misreports its own
                size.
              </li>
            </ul>
            <p>
              The virtualisation case deserves particular attention
              because it is a performance optimisation with an
              accessibility consequence, applied by a layer that is
              usually unaware of either. The grid is correct. The
              windowing library is correct. The composition lies about
              how many rows exist.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A multi-step form</h2>
            <p>
              This is a level 5 case, and it is where the argument stops
              being about widgets.
            </p>
            <ul>
              <li>
                Step three validates and returns errors. Focus must move
                to the error summary, and the summary must link to the
                fields — a relationship spanning two components.
              </li>
              <li>
                Back-navigation must retain entered data.
                WCAG&rsquo;s expectations about redundant entry and its
                rule for complete processes both bite here, and neither
                is a component property.
              </li>
              <li>
                Progress indication, page titles and browser history
                must stay coherent across steps.
              </li>
              <li>
                A session timeout mid-process is an accessibility
                failure for slower users even though every individual
                page passes every check.
              </li>
            </ul>
            <p>
              The last item is the clearest demonstration that
              component certification cannot reach the whole problem. No
              component is implicated. The failure is a property of the
              flow and of the time a person is given to complete it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Responsive navigation</h2>
            <ul>
              <li>
                The same navigation is a horizontal menubar at wide
                widths and a disclosure-driven drawer at narrow widths.
                Those are different ARIA patterns with different
                keyboard grammars.
              </li>
              <li>
                If the DOM is shared and only CSS changes, the semantics
                are wrong at one of the two widths. If the DOM is
                swapped, focus is lost at the breakpoint.
              </li>
              <li>
                A user at 400% zoom gets the narrow pattern on a desktop
                screen, so the system must state that zoom, not device,
                selects the pattern.
              </li>
            </ul>
            <p>
              I find this the most instructive of the six, because the
              usual framing hides the problem. &ldquo;Responsive
              navigation&rdquo; sounds like one component with two
              appearances. It is two components with two interaction
              models, selected by available space, and the selection is
              itself a design decision that has to be recorded — which
              is exactly the kind of decision a{" "}
              <Link href="/adaptation/afds">design system</Link> exists
              to hold.
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
                <em>APG: combobox pattern</em>.{" "}
                <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/">patterns/combobox</a>
              </li>
              <li>
                W3C Web Accessibility Initiative.{" "}
                <em>APG: modal dialog pattern</em>.{" "}
                <a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/">patterns/dialog-modal</a>
              </li>
              <li>
                W3C Web Accessibility Initiative.{" "}
                <em>APG: tabs pattern</em>.{" "}
                <a href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/">patterns/tabs</a>
              </li>
              <li>
                W3C Web Accessibility Initiative.{" "}
                <em>APG: grid pattern</em>.{" "}
                <a href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/">patterns/grid</a>
              </li>
              <li>
                W3C Web Accessibility Initiative.{" "}
                <em>
                  Understanding Success Criterion 3.3.7: Redundant Entry
                </em>
                .{" "}
                <a href="https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry">Understanding/redundant-entry</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
