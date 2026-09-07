import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ComponentDesignSubNav } from "@/components/ComponentDesignSubNav";

export const metadata: Metadata = {
  title: "How composition fails",
};

export default function FailureModes() {
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
            <h1>How composition fails</h1>
            <p className="lede">
              Eight classes of failure, each of them invisible while
              components are inspected one at a time and each appearing
              only on assembly. This is the core of the argument, and
              the list is drawn from observed behaviour rather than from
              theory.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Semantic collision</h2>
            <p>
              The component&rsquo;s semantics are correct alone and
              wrong, invalid or ambiguous in context.
            </p>
            <ul>
              <li>
                A card that owns an <code>h3</code> produces a broken
                outline when placed directly under an <code>h1</code>.
              </li>
              <li>
                A navigation component nested inside another{" "}
                <code>nav</code> yields two indistinguishable landmarks
                unless each is named.
              </li>
              <li>
                A page-shell component and a content component both
                emit <code>main</code>.
              </li>
              <li>
                A button nested inside a clickable card creates nested
                interactive controls, with ambiguous activation and an
                unclear accessibility tree.
              </li>
              <li>
                A list component wrapped in a layout element that
                applies <code>role=&quot;presentation&quot;</code>, or
                in a grid container that breaks the{" "}
                <code>ul</code>/<code>li</code> parent-child
                relationship, silently loses list semantics.
              </li>
              <li>
                A cell component is valid only inside the expected row
                and table ancestry. Used standalone its role is
                meaningless.
              </li>
              <li>
                ARIA composite widgets impose required owned roles and
                ordering, so a slot that accepts arbitrary children can
                break a required parent-child role relationship.
              </li>
            </ul>
            <p>
              The APG&rsquo;s governing rule applies at exactly this
              boundary: no ARIA is better than bad ARIA. A composition
              that produces incorrect ARIA can make the non-visual
              experience worse than the same page with no ARIA at all,
              which means composition is not merely a missed
              opportunity to improve things. It can actively destroy
              what the primitives were giving away for free.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Accessible name collision</h2>
            <p>
              Names are computed from content and from relationships
              that cross the component boundary, so assembly can corrupt
              a name that was correct in the demo.
            </p>
            <ul>
              <li>
                Duplicate landmark or region names that were unique in
                isolation.
              </li>
              <li>
                An <code>aria-label</code> on a wrapper overriding a
                meaningful visible label beneath it.
              </li>
              <li>
                Twenty repetitions of &ldquo;Read more&rdquo; or
                &ldquo;Edit&rdquo; with nothing to distinguish them,
                each one individually passing a name check.
              </li>
              <li>
                <code>aria-labelledby</code> and{" "}
                <code>aria-describedby</code> broken by identifier
                collision when a component is instanced more than once
                on a page, or by identifier regeneration on re-render.
              </li>
              <li>
                A visible label and an accessible name that diverge,
                which breaks speech input users who say what they can
                see, as well as confusing screen reader users who hear
                one thing and read another.
              </li>
            </ul>
            <p>
              The last of those is the one most often treated as
              cosmetic. It is not. If the name and the label disagree, a
              speech input user has no way to address the control at
              all.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Focus competition</h2>
            <p>
              Each component manages focus correctly. Together they
              fight over it.
            </p>
            <ul>
              <li>
                A dialog traps focus while a combobox inside it also
                manages focus and also wants Escape.
              </li>
              <li>
                A route change moves focus to the new <code>h1</code>{" "}
                while a toast simultaneously claims it.
              </li>
              <li>
                A disclosure collapses while focus is inside it,
                dropping focus to <code>body</code>.
              </li>
              <li>
                A sticky header visually covers the element that has
                just received focus, so the focus indicator exists and
                is not visible.
              </li>
              <li>
                Two roving-tabindex groups nested one inside the other
                share arrow-key handling.
              </li>
              <li>
                A virtualised list destroys the focused row on scroll or
                on refetch.
              </li>
              <li>
                An asynchronous update re-renders the subtree containing
                the focused element, and focus is lost.
              </li>
              <li>
                Focus restoration on dialog close targets an element
                that the underlying page has since removed.
              </li>
            </ul>
            <p>
              The conclusion is structural. Focus is not solely a
              component property. It requires arbitration by an owner at
              the containing level, and if no component has been
              appointed to that job then the behaviour is whatever the
              event order happens to produce on the day.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Keyboard grammar conflict</h2>
            <p>
              Keys are contextual, and nesting creates ambiguity that
              neither component can resolve alone.
            </p>
            <ul>
              <li>
                Arrow keys move between tabs, move within a menu, move a
                grid cell, adjust a slider, or scroll the page. Which
                wins when a grid sits in a tabpanel inside a dialog?
              </li>
              <li>
                Escape closes a popover, cancels inline editing, closes
                the dialog, or exits an application mode. A single press
                must resolve to exactly one of those.
              </li>
              <li>
                Enter submits the form, or selects the highlighted
                combobox option.
              </li>
              <li>
                Space activates the button, scrolls the page, or toggles
                the checkbox.
              </li>
              <li>
                Typeahead in a listbox competes with application-level
                or browser-level single-key shortcuts.
              </li>
              <li>
                Tab escapes the composite, or moves within it.
              </li>
            </ul>
            <p>
              A design system cannot merely assert that each child is
              keyboard operable. It has to state how the combined
              grammar resolves and which component is the resolver.
              &ldquo;Both components are keyboard accessible&rdquo; is
              true and useless in the case where they both want the same
              key.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Announcement collision</h2>
            <p>
              Independently reasonable live regions become unusable
              together.
            </p>
            <ul>
              <li>
                Validation errors, autosave status and result counts all
                announce at once.
              </li>
              <li>
                A route-change announcement duplicates the announcement
                of the new page heading.
              </li>
              <li>
                &ldquo;Loading&rdquo; is immediately superseded by
                &ldquo;42 results&rdquo;, producing either a stutter or
                a swallowed message depending on the screen reader.
              </li>
              <li>
                A polite region is starved because an assertive region
                keeps interrupting.
              </li>
              <li>
                Rapid filtering fires an announcement per keystroke.
              </li>
            </ul>
            <p>
              Assistive technology behaviour for live regions has
              historically varied sharply between browser and screen
              reader combinations, which has a direct consequence for
              how this is recorded. A design system must hold evidence
              per combination here, not a single boolean. &ldquo;The live
              region works&rdquo; is not a statement that can be true
              across the matrix.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Layout and reflow interaction</h2>
            <p>
              Components compete for finite space, and the competition
              produces failures that neither component causes alone.
            </p>
            <ul>
              <li>
                Two independently responsive components impose
                incompatible minimum widths, producing horizontal
                scrolling at 320 CSS pixels.
              </li>
              <li>
                Increased text spacing or 200% zoom clips text in a
                component that was sized for its demo string.
              </li>
              <li>
                A sticky region occludes focused content, or occludes
                the target of an in-page link.
              </li>
              <li>
                Touch targets that meet the minimum size individually
                overlap, or fall below spacing requirements, when packed
                at narrow widths.
              </li>
              <li>
                Tooltips and popovers are clipped by an
                ancestor&rsquo;s <code>overflow: hidden</code>,
                introduced by a layout component that knows nothing
                about them.
              </li>
              <li>
                CSS grid or flex <code>order</code> makes visual order
                diverge from DOM order and therefore from focus order.
              </li>
              <li>
                Two nested container queries produce an unusable
                intermediate state that neither component&rsquo;s own
                breakpoints anticipated.
              </li>
            </ul>
            <p>
              This is where the{" "}
              <Link href="/adaptation/afds/portable-representations">
                intrinsic layout method
              </Link>{" "}
              is load-bearing rather than a stylistic preference.
              Components that declare their intrinsic requirements and
              adapt to the space actually available compose far more
              predictably than components that assume a viewport,
              because a viewport assumption is a claim about the world
              and the world includes a user at 400% zoom.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Content-dependent failure</h2>
            <p>
              Component demonstrations use short, curated, well-formed
              content. Real assembly does not.
            </p>
            <ul>
              <li>
                Long strings, long unbroken words, and translations that
                expand by thirty to forty per cent.
              </li>
              <li>Repeated headings and repeated controls.</li>
              <li>
                Missing images, missing alternatives, missing
                descriptions.
              </li>
              <li>
                Error, empty, loading, partial, stale, offline and
                permission-denied states.
              </li>
              <li>
                User-generated content carrying its own headings and
                markup.
              </li>
              <li>Density: five rows against five thousand.</li>
              <li>
                Meaning carried by position or colour that the component
                cannot express semantically.
              </li>
            </ul>
            <p>
              This forces the distinction a component contract most
              needs: structural guarantees against author obligations. A
              card can guarantee the association between its label and
              its control. It cannot guarantee that the author supplied
              a meaningful heading. Both facts belong in the contract,
              and the second is the one usually left out, which is why
              GOV.UK requires components to be tested inside realistic
              pages with representative content rather than in isolated
              demonstrations.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Override and escape-hatch invalidation</h2>
            <p>
              Every styled library provides escape hatches:{" "}
              <code>className</code>, <code>style</code>,{" "}
              <code>as</code> or <code>asChild</code>, slots, render
              props, portals, raw HTML injection. Each one can silently
              invalidate a guarantee.
            </p>
            <ul>
              <li>
                Restyling a focus indicator below the non-text contrast
                threshold.
              </li>
              <li>
                Polymorphic <code>as=&quot;div&quot;</code> on a
                component whose keyboard behaviour assumed a{" "}
                <code>button</code>.
              </li>
              <li>
                A slot accepting a child that breaks a required
                owned-role relationship.
              </li>
              <li>
                A portal moving DOM out of the reading order it was
                tested in.
              </li>
              <li>
                CSS <code>display: contents</code> removing implicit
                semantics from a wrapper in some engines.
              </li>
            </ul>
            <p>
              The consequence for a design system is that overrides have
              to be treated as guarantee-invalidating events which
              trigger retest, not as neutral styling. An escape hatch is
              not a styling API. It is a hole in the contract, and it
              should be recorded as one.
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
                  ARIA Authoring Practices Guide: read me first
                </em>
                .{" "}
                <a href="https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/">practices/read-me-first</a>
              </li>
              <li>
                W3C Web Accessibility Initiative.{" "}
                <em>Understanding Success Criterion 1.4.10: Reflow</em>.{" "}
                <a href="https://www.w3.org/WAI/WCAG22/Understanding/reflow">Understanding/reflow</a>
              </li>
              <li>
                W3C Web Accessibility Initiative.{" "}
                <em>
                  Understanding Success Criterion 1.4.12: Text Spacing
                </em>
                .{" "}
                <a href="https://www.w3.org/WAI/WCAG22/Understanding/text-spacing">Understanding/text-spacing</a>
              </li>
              <li>
                Government Digital Service.{" "}
                <em>
                  GOV.UK Design System: contribution criteria
                </em>
                .{" "}
                <a href="https://design-system.service.gov.uk/community/contribution-criteria/">community/contribution-criteria</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
