import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ComponentDesignSubNav } from "@/components/ComponentDesignSubNav";

export const metadata: Metadata = {
  title: "State and its propagation",
};

const CONTRACT = `component: search-results
kind: compound
afdsVersion: 0.x-draft

contains:
  required: [search-form, results-heading, result-list]
  optional: [filters, pagination, status-message]

composition:
  allowedParents: [main, search-page]
  prohibitedDescendants: [main, nested-search-results]
  slots:
    resultItem:
      acceptsRoles: [listitem]
      forbidsRoles: [main, navigation, dialog]

  semanticOwnership:
    heading:       { suppliedBy: consuming-page, requiredLevel: contextual }
    landmark:      { ownedBy: consuming-page }
    resultsStatus: { ownedBy: search-results }

  focus:
    owner: search-results
    initial: search-input
    afterSubmit: results-heading
    onError: first-invalid-field
    onPaginate: results-heading
    restorePolicy: preserve-user-context

  keyboard:
    resolver: search-results
    escape: close-open-filter-popover-then-defer-to-parent
    enter: submit-search
    arrowKeys: defer-to-child

  announcements:
    owner: results-status
    priority: polite
    coalesceWindow: 500ms
    suppressChildAnnouncements: [pagination-status, filter-applied]

  layout:
    method: intrinsic
    minInlineSize: 20rem
    reflow:
      - filters-before-results
      - filters-as-disclosure-below-threshold
    minimumTargetSize: token(target.min)

state:
  intrinsic: [busy, empty, error]
  delegated: [currentPage, appliedFilters]
  ambient:   [locale, reducedMotion, forcedColors, reflowBand]
  mapping:
    busy:  { aria: "aria-busy", announce: polite, coalesce: true }
    empty: { aria: none, announce: polite }
    error: { aria: "aria-invalid on field", announce: assertive,
             focus: first-invalid-field }

obligations:
  author:
    - Provide a unique, descriptive page heading
    - Provide meaningful result titles distinguishable out of context
    - Provide an empty-state message
  integrator:
    - Preserve declared DOM order
    - Do not introduce an independent results live region
    - Do not portal the filter popover outside this subtree

evidence:
  isolated:        pass        # axe plus keyboard, in isolation
  realisticPage:   required
  completeProcess: required
  assistiveTech:
    - { combo: "NVDA/Firefox",     status: pass, date: 2026-08 }
    - { combo: "JAWS/Chrome",      status: pass, date: 2026-08 }
    - { combo: "VoiceOver/Safari", status: unverified }

uncertainties:
  - Announcement timing under rapid filter changes on VoiceOver/iOS
  - Behaviour when result titles are author-supplied HTML`;

export default function StatePropagation() {
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
            <h1>State and its propagation</h1>
            <p className="lede">
              State is the mechanism through which most compositional
              failures actually occur, so it needs an explicit model
              rather than reliance on framework context, a shared store,
              or incidental DOM.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Five classes of state</h2>
            <p>
              The classes are distinguished by who owns the state, not
              by how it is stored, because ownership is what determines
              which component is allowed to express it.
            </p>
            <ul>
              <li>
                <strong>Intrinsic state</strong>{" "}is owned wholly by the
                component: expanded, checked, selected, invalid, busy,
                current. It is expressed in ARIA on the
                component&rsquo;s own element.
              </li>
              <li>
                <strong>Delegated state</strong> is owned by the parent
                and rendered by the child: which tab is current, which
                step of a process is active, whether the page is in an
                error state.
              </li>
              <li>
                <strong>Ambient state</strong> is page or application
                scope: route, locale, theme, reduced motion, forced
                colours, zoom or reflow band, offline. Every component
                may read it and none may own it.
              </li>
              <li>
                <strong>Profile state</strong>{" "}comes from the
                user&rsquo;s capability and preference model. This is
                the input that selects variants in the first place.
              </li>
              <li>
                <strong>Derived state</strong>{" "}is computed from others,
                as in &ldquo;the form is submittable&rdquo;, which no
                single component can determine.
              </li>
            </ul>
            <p>
              Most of the focus and announcement failures in this
              section are, at bottom, a component expressing state it
              does not own, or two components expressing the same state
              independently.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Eight propagation rules</h2>
            <ul>
              <li>
                <strong>Downward selection.</strong> Profile and ambient
                state flow down and may change which component or
                variant renders. This must happen at a declared point,
                not per component, or the page becomes internally
                inconsistent.
              </li>
              <li>
                <strong>Upward obligation.</strong> A child that cannot
                satisfy a guarantee raises an unmet obligation to its
                parent. Unmet obligations aggregate; they do not
                disappear.
              </li>
              <li>
                <strong>Uncertainty propagation.</strong> Child
                uncertainty propagates upward unless the parent bounds
                it with evidence.
              </li>
              <li>
                <strong>The single-owner rule.</strong> For each of
                focus, keyboard grammar, live-region priority and
                landmark identity there is exactly one owner per
                subtree. Ownership is declared, not inferred.
              </li>
              <li>
                <strong>State-to-semantics mapping.</strong> Every state
                declares its accessible expression: an ARIA attribute, a
                live-region message, both, or deliberately neither.
              </li>
              <li>
                <strong>Announcement debouncing.</strong> State changes
                that can fire rapidly declare a coalescing policy, so
                the announcement queue is not flooded.
              </li>
              <li>
                <strong>Transition contracts.</strong> A state change
                declares its focus consequence: focus preserved, moved
                to a named target, or restored to a remembered target.
              </li>
              <li>
                <strong>Invalidation on override.</strong> Overriding
                markup, roles, identifiers or handlers marks the
                dependent guarantees suspended, pending retest.
              </li>
            </ul>
            <p>
              The fourth rule is the one that does the most work. Nearly
              every focus and announcement failure described in{" "}
              <Link href="/adaptation/component-design/failure-modes">
                the failure modes
              </Link>{" "}
              is a case of two owners for something that admits only
              one, and the deliberate part is that ownership is
              declared. Inferring it from the DOM is how the current
              situation arose.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A contract sketch</h2>
            <p>
              This is a sketch rather than a schema proposal. Its
              purpose is to test whether the facts above can be
              expressed at all, in one artefact, for one compound
              component. A search results region is a good test case
              because it collides with almost everything: a form, a
              heading it does not own, a list, optional filters,
              pagination, and a status message.
            </p>
            <div className="scroll-region" tabIndex={0}>
              <pre>
                <code>{CONTRACT}</code>
              </pre>
            </div>
            <p>
              Note what the record does not say. It does not claim that
              this component is accessible, nor that it is universally
              safe to use. It states the conditions under which this
              selected composition is expected to hold, which
              obligations sit with the author and the integrator, what
              has been evidenced and in which environments, and what is
              not yet known. The VoiceOver line says unverified because
              it is unverified.
            </p>
            <p>
              The two uncertainty entries are the part I would defend
              most strongly. A component that cannot say &ldquo;I do not
              know what happens here&rdquo; will have that gap
              inherited silently by everything built on top of it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Composition predicates</h2>
            <p>
              For any of this to be more than documentation, the
              relations have to be machine-checkable. Ten predicates
              cover the cases in this section.
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="Composition predicates and what each one asserts"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Predicate</th>
                    <th scope="col">Example assertion</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">requires</th>
                    <td>
                      A dialog requires a labelled title and a
                      focus-restoration target
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">contains</th>
                    <td>
                      A tablist contains tabs, each associated with a
                      tabpanel
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">excludes</th>
                    <td>
                      An interactive card excludes interactive
                      descendants
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">owns</th>
                    <td>The page shell owns the primary landmarks</td>
                  </tr>
                  <tr>
                    <th scope="row">delegates</th>
                    <td>
                      A field delegates label text to the author and
                      owns the association
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">coordinates</th>
                    <td>
                      A page focus controller coordinates dialogs,
                      routing and validation
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">suppresses</th>
                    <td>
                      A parent status system suppresses redundant child
                      live regions
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">preserves</th>
                    <td>
                      A layout transform preserves semantic and focus
                      order
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">invalidates</th>
                    <td>
                      An override invalidates the guarantees it names
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">requiresRetest</th>
                    <td>
                      Localisation, virtualisation, slot substitution or
                      behavioural override triggers a defined suite
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              These predicates are what turn a design system from
              documentation into an assembly model a validator can
              enforce. Whether they belong in the component contract, in
              a separate composition clause of the package, or in both
              is{" "}
              <Link href="/adaptation/component-design/what-is-open">
                still open
              </Link>
              .
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>References</h2>
            <ul>
              <li>
                W3C.{" "}
                <em>
                  Accessible Rich Internet Applications (WAI-ARIA) 1.2
                </em>
                .{" "}
                <a href="https://www.w3.org/TR/wai-aria-1.2/">TR/wai-aria-1.2</a>
              </li>
              <li>
                W3C Web Accessibility Initiative.{" "}
                <em>
                  Understanding Success Criterion 2.5.8: Target Size
                  (Minimum)
                </em>
                .{" "}
                <a href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum">Understanding/target-size-minimum</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
