import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { AfdsSubNav } from "@/components/AfdsSubNav";

export const metadata: Metadata = {
  title: "Supporting the APG",
};

export default function ApgSupport() {
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
            <h1>Supporting the APG</h1>
            <p className="lede">
              The ARIA Authoring Practices Guide already describes how the
              common widgets should behave, and that work is worth
              adopting rather than restating. But it is guidance, not a
              standard, and the difference decides what a design system is
              allowed to claim. This page sets out how I adopt the APG by
              reference, and where the design system has to go further
              because guidance cannot carry evidence about shipped code.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Informative guidance treated as law</h2>
            <p>
              The APG is developed by the Authoring Practices Task Force
              of the ARIA Working Group and published as a Web
              Accessibility Initiative resource. It is not published on
              the Recommendation track where WCAG 2.2 and WAI-ARIA 1.2
              sit, and it defines no conformance requirements of its own.
              I state that as an observation about where the documents
              live rather than as a quotation, because the APG does not
              carry a status section declaring itself informative.
            </p>
            <p>
              The consequence is sharp. A sentence of the form &ldquo;this
              component conforms to the APG&rdquo; is not an accessibility
              claim, because there is no conformance model for it to be
              measured against. A component can follow every keystroke
              recommendation in a pattern and still fail WCAG, and a
              component can depart from an APG key map and still conform.
              The claims that can honestly be published are the WCAG
              criteria met, the ARIA semantics used, and the recorded
              assistive-technology results.
            </p>
            <p>
              That leaves a policy with five clauses, each of which does
              work.
            </p>
            <blockquote>
              <p>
                <em>
                  WCAG establishes the required outcome. Native HTML is
                  preferred. ARIA fills genuine semantic gaps. The APG
                  supplies the interaction model for recognised custom
                  patterns. The design system specifies, tests, versions
                  and evidences the implementation that actually ships.
                </em>
              </p>
            </blockquote>
            <p>
              The first clause fixes acceptance criteria in a normative
              standard, so arguments about behaviour resolve against an
              outcome rather than a preference. The second sets the
              default engineering answer, because native elements arrive
              with focus behaviour, activation semantics, disabled-state
              handling and forced-colours treatment already implemented
              and already tested by browser vendors. The third constrains
              ARIA to the repair role it was designed for. The fourth
              admits that some interactions have no native equivalent, and
              that a custom one should behave the way users already
              expect. The fifth locates responsibility: no external
              document can carry evidence about the code this project
              ships.
            </p>
            <p>
              None of this is a complaint about the APG. It offers thirty
              patterns, from buttons and disclosure controls through to
              tree grids, and each describes the interaction, the expected
              keyboard behaviour, the roles, states and properties
              involved, and one or more functional examples. The keyboard
              conventions in particular encode decades of accumulated
              desktop-platform behaviour that users already know.
              Reinventing them per product is both wasteful and hostile to
              the people who have already learned them.
            </p>
            <p>
              The value is in the interaction model, not in the example
              code. The examples are pedagogical reference
              implementations, written to be readable and to demonstrate a
              pattern clearly, which is a different goal from being
              maintainable, framework-appropriate, performant and covered
              by a regression suite. So the system should be explicit
              about what it takes and what it owns.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="What is borrowed and what the system owns"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Borrowed from the APG</th>
                    <th scope="col">Owned and tested by the system</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      Interaction intent and user-facing behaviour
                    </th>
                    <td>Platform architecture and code style</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Semantic model: roles, states, properties,
                      relationships
                    </th>
                    <td>The exact version that ships, and its tests</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Keyboard model and conventional key bindings
                    </th>
                    <td>
                      Assistive-technology evidence by engine, version and
                      date
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Naming and relationship expectations
                    </th>
                    <td>
                      Product decisions such as dismissibility and
                      destructive confirmation
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Awareness of the support caveats a pattern notes
                    </th>
                    <td>
                      Recorded deviations, non-guarantees and uncertainty
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Adoption by reference keeps the valuable part, which is the
              interaction and keyboard model users already know, and
              places responsibility for semantics, testing and support
              evidence in the layer that actually ships. It costs a great
              deal more specification work than a link to a pattern page,
              and it forgoes the reassurance of saying the system follows
              the APG. The compensation is that every claim it does make
              can be checked.
            </p>
            <p>
              One practice needs a trigger attached. A settled component
              contract goes wrong mainly when browser or
              assistive-technology support changes, so a support change
              should reopen the specification rather than being noticed by
              accident. What counts as a large enough change, and which
              sources are monitored, is not yet settled.
            </p>
            <p>
              This page describes the patterns only as far as the policy
              needs. What each pattern requires in roles, states,
              properties and keyboard interaction is catalogued separately
              in the{" "}
              <Link href="/paradise/widget-patterns">
                widget patterns reference
              </Link>
              , which is also what the pattern analyser checks against.
              The adoption decision itself is written in the shape a
              colophon entry takes, but it is proposed and not yet
              adopted, so no component specification should cite it as
              settled.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Native HTML first, APG second</h2>
            <p>
              The most likely failure mode for a system that admires the
              APG is to turn every familiar interaction into an APG
              widget. So the primary rule is stated as a restriction
              rather than as an endorsement.
            </p>
            <blockquote>
              <p>
                <em>
                  Use native HTML when it provides the needed semantics
                  and interaction. Adopt an APG pattern only when a
                  genuinely custom composite widget is required.
                </em>
              </p>
            </blockquote>
            <p>
              Here is how that resolves for the needs an audit and
              remediation platform actually has. The rows run roughly from
              cheapest to most expensive, and the first four should
              account for the large majority of interactive surface.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="Preferred response for common product needs"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Product need</th>
                    <th scope="col">Preferred response</th>
                    <th scope="col">Why</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Reveal supplementary content</th>
                    <td>
                      Native <code>details</code>, or a button with
                      controlled content
                    </td>
                    <td>
                      Often avoids a full custom disclosure
                      implementation
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Action</th>
                    <td>
                      Native <code>button</code>
                    </td>
                    <td>
                      Activation, focus, disabled state and keyboard
                      behaviour are already provided
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Choice between options</th>
                    <td>Native radio or checkbox inputs</td>
                    <td>
                      Avoids recreating form semantics from scratch
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Navigation</th>
                    <td>Links inside landmarks</td>
                    <td>
                      Do not convert site navigation into a menu widget
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Modal confirmation</th>
                    <td>A dialog following the APG dialog model</td>
                    <td>
                      A genuine composite interaction with
                      focus-management needs
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Rich autocomplete</th>
                    <td>
                      Combobox, only when native controls cannot satisfy
                      the task
                    </td>
                    <td>
                      High complexity; semantics and keyboard interaction
                      must be complete
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Large interactive results table</th>
                    <td>
                      Native table first; ARIA grid only where
                      directional cell navigation is genuinely needed
                    </td>
                    <td>
                      A visual CSS grid is not a semantic grid and does
                      not justify the Reflow exception
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The last row is the one this project must get right, because
              the product is a reporting and remediation tool full of
              tabular results. Three different things share the word
              grid, and keeping them apart matters more here than
              anywhere else.
            </p>
            <ul>
              <li>
                An ARIA grid is a container that lets users move through
                its contents with directional keys such as the arrows,
                Home and End, and only one element in the whole grid sits
                in the tab sequence. The APG puts its scope as wide as
                grouping a collection of checkboxes at one end and a
                full-featured spreadsheet application at the other, and
                sorts its uses into data grids and layout grids. What the
                role is not is a presentational choice: the guide is
                explicit that using it does not imply a tabular visual
                presentation. It changes how a thing is operated.
              </li>
              <li>
                A semantic table is content structure, where meaning
                comes from header-to-cell relationships rather than from
                keyboard navigation.
              </li>
              <li>
                CSS Grid is a layout technique, and{" "}
                <code>display: grid</code> creates no accessibility
                semantics at all.
              </li>
            </ul>
            <p>
              The APG permits data grids explicitly, so the restriction I
              want here is mine rather than the guide&rsquo;s. It is that a
              tabular audit report should not automatically become an ARIA
              grid. A native table is usually better where users need to
              read relationships rather than operate a spreadsheet-like
              interface, and adopting a grid widget adds a substantial
              keyboard and assistive-technology contract that ought to be
              paid for by a demonstrated need. A grid widget is worth it
              for directional cell navigation, not for a table looking
              crowded. If the real problem is that a wide table is hard to
              use at high zoom, the answer is a scoped scroll container
              and a correctly justified two-dimensional exception, which I
              argue at length in{" "}
              <Link href="/adaptation/afds/what-a-component-declares">
                what a component declares
              </Link>
              . Choosing an ARIA grid role in order to unlock that
              exception would abuse both the role and the criterion.
            </p>
            <p>
              A second caution belongs beside it, and it needs the same
              honesty. The APG menu and menubar pattern takes its model
              from native operating system menus, the sort that pull down
              from the top of a desktop application window, and because a
              menubar is a composite widget Tab does not move focus among
              its items at all. Adopting it for a navigation bar imports
              that whole contract and changes what a screen reader tells
              the user the thing is. The APG does publish a navigation
              menubar example, so ruling the pattern out for ordinary
              navigation is my position and not the guide&rsquo;s. I hold
              it because a list of links is usually just navigation and
              belongs in a landmark, a list of buttons is usually just an
              action group, and neither needs a menu contract in order to
              be understood.
            </p>
            <p>
              Native-first also implies that the system should not start
              by implementing every pattern. The smallest catalogue that
              supports the product, in priority order, is native button,
              link, checkbox, radio, text input and select, which cover
              most actions, filters and configuration controls; then
              disclosure, for showing and hiding issue details, advanced
              filters and evidence panels; then dialog, for confirmation,
              configuration and remediation guidance; then alert and
              status messaging, for scan progress, completed checks and
              error summaries; then a native table with a scoped scroll
              container for audit results. Tabs come next but only where
              persistent peer views genuinely improve a task rather than
              compress a page, then combobox only where searching a large
              controlled vocabulary is necessary, and last tree, treegrid
              or ARIA grid only after user research demonstrates the need.
              The first five consist almost entirely of native elements
              plus one simple composite. The last three are gated, and
              each gate should be recorded when it is passed.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Five statuses, one recorded decision</h2>
            <p>
              A policy that lives only in prose becomes decorative. The
              mechanism that keeps this one honest is a registry mapping
              every component to exactly one of five statuses.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="The five pattern registry statuses"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Status</th>
                    <th scope="col">Meaning</th>
                    <th scope="col">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Native-first</th>
                    <td>
                      A native element fully supplies the interaction
                    </td>
                    <td>
                      <code>button</code>, <code>details</code>, a
                      checkbox input
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">APG-derived</th>
                    <td>
                      A custom component implements a recognised APG
                      pattern
                    </td>
                    <td>Dialog, tabs, menu button, combobox</td>
                  </tr>
                  <tr>
                    <th scope="row">APG-adjacent</th>
                    <td>
                      Similar interaction, but intentionally differs from
                      the pattern
                    </td>
                    <td>A product-specific filter panel</td>
                  </tr>
                  <tr>
                    <th scope="row">Custom</th>
                    <td>No mature APG pattern applies</td>
                    <td>A complex audit visualisation</td>
                  </tr>
                  <tr>
                    <th scope="row">Prohibited</th>
                    <td>
                      The pattern creates more accessibility cost than
                      value
                    </td>
                    <td>
                      Site navigation implemented as an ARIA menu
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              These are not a quality ranking. Native-first is the
              cheapest and safest status and most of the system should sit
              there, but a dialog is not defective for being APG-derived.
              The point of the registry is that the status is a recorded
              decision with a rationale, rather than an accident of
              whoever wrote the component first.
            </p>
            <p>
              Two of the statuses exist for reasons worth stating.
              APG-adjacent is the honest label for a component that
              borrows an interaction feel without claiming the pattern,
              and it must say which pattern it resembles and exactly where
              and why it departs. It was added because an earlier framing
              of this work treated the APG as the component layer of the
              design system, which was wrong in kind: the APG describes
              patterns, whereas a design system ships versioned artefacts
              with tests and evidence, and only the second sort of thing
              can be held to account. That framing left no honest label
              for a component that resembles a pattern without
              implementing it, so authors would have called it an APG
              combobox and misled both implementers and testers.
            </p>
            <p>
              Prohibited exists so the system can say no once, in writing,
              rather than re-litigating the same bad idea in every review.
              A prohibition has to state the cost that motivated it, and
              has to be revisitable if the underlying support picture
              changes.
            </p>
            <p>
              An APG-derived entry is incomplete without a fixed set of
              recorded fields, and a specification missing one of them
              should fail review. Those fields are the APG pattern name
              and source URL, so a reader can check the reference rather
              than trust the summary; the native alternative considered
              and why it was insufficient, which is the field that
              actually enforces the native-first rule; the semantic model,
              meaning native elements, ARIA roles, states, properties and
              the relationships between them; the keyboard contract; the
              focus lifecycle, including behaviour on error; pointer,
              touch and speech-input equivalence; visible focus and
              forced-colours requirements; Reflow behaviour; the WCAG
              criteria the component is responsible for, by number; the
              test matrix and observed assistive-technology behaviour with
              engine, version, browser and date; recorded deviations from
              the pattern, with reasoning; and explicit non-guarantees
              alongside known uncertainty. An entry that cannot answer the
              second of those should probably have been native-first.
            </p>
            <p>
              The design-to-engineering handoff needs a parallel set,
              because a visual mock-up cannot convey any of it. The field
              most often lost is the relationship model. A designer who
              has decided that a control expands a panel has implicitly
              decided that expanded-state and controls relationships
              apply, and recording that is far cheaper than discovering it
              in an audit. The annotation economy rule still governs:
              annotate the selected component and the product-level
              choices or deviations, and do not restate behaviour the
              coded component already guarantees. Restating it makes
              annotations long, lets them drift from the code, and trains
              reviewers to skim.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The keyboard contract is eight questions</h2>
            <p>
              The APG convention for composite widgets is that only one
              item in the composite is normally in the Tab sequence. Once
              focus enters, other keys move focus internally, and the
              guide advises key bindings familiar from common graphical
              user-interface systems. That is usually implemented with a
              roving <code>tabindex</code> or with{" "}
              <code>aria-activedescendant</code>. The system makes it a
              formal recorded decision per component rather than an
              implicit implementation detail, by answering eight
              questions.
            </p>
            <ol>
              <li>
                <strong>Entry.</strong> What receives focus when a user
                Tabs in? For a composite this is a single element, and
                the specification names it. It also says what happens on
                re-entry, after focus has moved internally and then left.
              </li>
              <li>
                <strong>Internal movement.</strong> Which keys move focus
                inside the component: arrows, Home, End, Page Up, Page
                Down, a type-ahead behaviour? The specification states
                whether movement wraps at the ends, and which of the two
                implementation techniques is used.
              </li>
              <li>
                <strong>Activation.</strong> Which keys act on the
                focused item? The specification distinguishes keys that
                change selection from keys that commit an action, because
                conflating the two causes accidental destructive
                operations.
              </li>
              <li>
                <strong>Exit.</strong> Does Tab leave the component? Does
                Escape dismiss it? Where does focus go in each case? An
                exit path that depends on the user guessing is not a
                contract.
              </li>
              <li>
                <strong>State change.</strong> What does a screen reader
                announce after expansion, selection, validation failure,
                loading or deletion? This is where most real composite
                widgets fail, because the visual state change is obvious
                and the programmatic one was never implemented. The
                specification names the mechanism and the expected
                announcement.
              </li>
              <li>
                <strong>Restoration.</strong> When a popup or dialog
                closes, where does focus return? And what happens if the
                invoking control no longer exists, because the action
                deleted the row that contained it? The specification
                names a documented logical successor for that case.
              </li>
              <li>
                <strong>Pointer and touch parity.</strong> Can all
                functionality be reached without hover, without drag and
                without a path-dependent pointer movement? Touch targets
                and pointer alternatives are part of the component
                contract, not a separate mobile concern.
              </li>
              <li>
                <strong>Speech-recognition operation.</strong> Does every
                visible interactive control have a stable visible label
                that a speech-input user can say? Where the accessible
                name differs from the visible label, the visible text
                must be contained in the accessible name.
              </li>
            </ol>
            <p>
              The third question is the one that bites hardest in this
              product. In a dialog, Enter activates the focused control
              and is not globally mapped to confirm. Mapping Enter to the
              dialog primary action regardless of which control has focus
              produces accidental confirmations, and that is especially
              dangerous in a remediation tool where a confirmation may
              apply a bulk change. Enter acts on the focused control, and
              nothing else.
            </p>
            <p>
              Specifying these eight parts is what turns APG guidance into
              a system contract instead of a link in documentation.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why keyboard means more than a keyboard</h2>
            <p>
              I want to be exact about this, because a page arguing
              against confusing guidance with requirement should not
              itself misattribute anything. The normative definition in
              WCAG 2.2 is terse. A keyboard interface is an interface used
              by software to obtain keystroke input, with a note that it
              lets users provide keystroke input even where the native
              technology contains no keyboard, and a second note excluding
              keyboard-operated mouse emulators such as MouseKeys, because
              operation then runs through the pointing-device interface
              instead.
            </p>
            <p>
              The broad reading everyone quotes is not in that definition.
              It is in the supporting document explaining success
              criterion 2.1.1, which says that keyboard emulators include
              speech input software, sip-and-puff software, on-screen
              keyboards, scanning software and a variety of assistive
              technologies and alternate keyboards. That document is
              informative, and its status is exactly the status this page
              has been careful about elsewhere.
            </p>
            <p>
              It is not weaker for that. It is the reading the working
              group published in order to explain the criterion, and it is
              the reading under which the requirement makes any sense at
              all. A keyboard interface is an input pathway, not a
              physical device. That is why keyboard operability is so
              load-bearing a requirement: it is the shared abstraction
              that many different assistive technologies drive.
            </p>
            <p>
              Four consequences follow, and each belongs in review as a
              check rather than as a hope.
            </p>
            <ul>
              <li>
                <strong>Avoid fine pointer paths.</strong> An interaction
                requiring precise or continuous pointer movement excludes
                users of switch and scanning input, and often fails 2.5.1
                Pointer Gestures, which requires multipoint and
                path-based gestures to be operable with a single pointer
                without a path, unless the gesture is essential.
              </li>
              <li>
                <strong>Avoid hover-only discovery.</strong> Content or
                controls revealed only on hover are unreachable to
                keyboard-interface users and unstable for magnifier
                users.
              </li>
              <li>
                <strong>Avoid drag-only movement.</strong> Any reordering
                or moving operation needs a single-pointer and
                keyboard-interface alternative, which is also the
                substance of 2.5.7 Dragging Movements.
              </li>
              <li>
                <strong>Avoid inaccessible custom shortcuts.</strong>{" "}
                Single-character shortcuts collide with
                speech-recognition and screen-reader command sets. Under
                2.1.4 Character Key Shortcuts there are three ways out:
                the shortcut can be turned off, it can be remapped to
                include a non-printable key, or it can be active only
                while its component has focus.
              </li>
            </ul>
            <p>
              The design-system implication is that a keyboard contract is
              simultaneously a switch-access contract, a scanning contract
              and a large part of a speech-input contract. Testing with a
              physical keyboard is necessary and is not sufficient, which
              is why the sample package reserves evidence rows for
              voice-driven operation and records them as not yet tested
              rather than quietly assuming they pass.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Five kinds of requirement</h2>
            <p>
              Because APG guidance is not a conformance target, the
              documentation must not present it as conformance law.
              Following a particular APG key binding is generally good
              interoperability practice, but WCAG usually evaluates
              outcomes such as keyboard operability rather than requiring
              a particular key map.
            </p>
            <p>
              A tabs widget may remain conformant with a different
              keyboard interaction model, provided it is fully keyboard
              operable and its state is correctly conveyed. That is a real
              fact about conformance, and it is not permission to deviate
              freely. Departing from an established convention adds
              discoverability risk for users who already know the
              convention, and support risk for whoever must then document
              and defend the difference. The correct handling is to allow
              the deviation, label it, and state its cost. So every
              requirement in a component specification carries one of five
              tags.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="The five requirement categories"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Category</th>
                    <th scope="col">What it means</th>
                    <th scope="col">If it is not met</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Required by WCAG or ARIA</th>
                    <td>
                      A normative requirement from a W3C standard
                    </td>
                    <td>A conformance failure</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Strongly recommended by the APG
                    </th>
                    <td>
                      An interoperable convention users are likely to
                      expect
                    </td>
                    <td>
                      A usability and discoverability risk, not a
                      conformance failure
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Project convention</th>
                    <td>
                      A choice made for internal consistency
                    </td>
                    <td>
                      An inconsistency to be reconciled or documented
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Product-specific deviation</th>
                    <td>
                      A deliberate, recorded departure for a product
                      reason
                    </td>
                    <td>
                      Nothing, provided the record and its reasoning
                      exist
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Known support limitation</th>
                    <td>
                      A gap in browser or assistive-technology behaviour
                    </td>
                    <td>
                      Uncertainty to be disclosed, not a claim to be
                      made
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Tagging prevents two opposite failures. It stops
              documentation from presenting all APG guidance as mandatory
              conformance law, which erodes trust the moment somebody
              checks. And it stops teams from dismissing APG conventions
              as merely optional, which is how widgets end up technically
              conformant and practically unusable.
            </p>
            <p>
              Several things here are unsettled and I would rather say so
              than imply a finished policy. What evidence passes the gate
              for tabs, combobox and tree is undecided, and so is who
              decides. Whether four screen-reader and browser pairs is the
              standing minimum for an APG-derived component, whether
              speech recognition and switch access are separate rows, and
              how often results expire, are all open. Where deviations
              live and whether they need sign-off has no process attached
              yet. And the largest question is still whether the system
              ships tested implementations or specifications that
              adopters implement.
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
                <em>ARIA Authoring Practices Guide</em>.{" "}
                <a href="https://www.w3.org/WAI/ARIA/apg/">
                  WAI/ARIA/apg
                </a>
                . The thirty patterns are indexed at{" "}
                <a href="https://www.w3.org/WAI/ARIA/apg/patterns/">
                  apg/patterns
                </a>
                , and the grid, dialog and menubar patterns discussed
                here are{" "}
                <a href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/">
                  patterns/grid
                </a>
                ,{" "}
                <a
                  href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
                >
                  patterns/dialog-modal
                </a>{" "}
                and{" "}
                <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/">
                  patterns/menubar
                </a>
                .
              </li>
              <li>
                W3C ARIA Working Group.{" "}
                <em>
                  ARIA Authoring Practices Guide source repository
                </em>
                . The attribution to the Authoring Practices Task Force
                is stated there.{" "}
                <a href="https://github.com/w3c/aria-practices">
                  w3c/aria-practices
                </a>
              </li>
              <li>
                W3C.{" "}
                <em>
                  Web Content Accessibility Guidelines (WCAG) 2.2
                </em>
                . The definition of a keyboard interface, and success
                criteria 2.1.4 Character Key Shortcuts, 2.5.1 Pointer
                Gestures and 2.5.7 Dragging Movements.{" "}
                <a href="https://www.w3.org/TR/WCAG22/#dfn-keyboard-interface">
                  TR/WCAG22
                </a>
              </li>
              <li>
                W3C Web Accessibility Initiative.{" "}
                <em>
                  Understanding Success Criterion 2.1.1: Keyboard
                </em>
                . The source of the keyboard-emulator list quoted above.{" "}
                <a href="https://www.w3.org/WAI/WCAG22/Understanding/keyboard">
                  Understanding/keyboard
                </a>
              </li>
              <li>
                W3C. <em>Accessible Rich Internet Applications 1.2</em>.{" "}
                <a href="https://www.w3.org/TR/wai-aria-1.2/">
                  TR/wai-aria-1.2
                </a>
              </li>
              <li>
                The research note behind this page, including the worked
                dialog specification, the design-tool annotation preset
                and the five-level testing model, is{" "}
                <code>docs/APG-SUPPORT.md</code> in{" "}
                <a href="https://github.com/bobdodd/accessible-by-design">
                  accessible-by-design
                </a>
                .
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
