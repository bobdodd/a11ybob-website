import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AfdsSubNav } from "@/components/AfdsSubNav";

export const metadata: Metadata = {
  title: "What a component declares",
};

export default function WhatAComponentDeclares() {
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
            <h1>What a component declares</h1>
            <p className="lede">
              A component in this design system carries a contract. It
              states what it guarantees, what it deliberately does not
              guarantee, what the consumer is obliged to supply, and how
              each claim can be checked. Anything it has not tested, it
              says so.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A contract, not documentation</h2>
            <p>
              Component documentation describes. A contract commits.
              That sounds like a distinction without a difference until
              something goes wrong, at which point it is the only thing
              that matters. Documentation that says a component is
              accessible cannot be violated, because it does not say
              what would count as a violation. A contract that says no
              content clips at 320 CSS pixels of available inline size,
              and none at 400% zoom, can be violated, and a test can
              catch it. A horizontal scrollbar either appears or it does
              not.
            </p>
            <p>
              So each claim in the contract is written as a statement
              plus the procedure that would confirm or refute it. The
              layout primitive in the sample package carries six of
              these. Three are automated: the resolved gap matches the
              named token after alias resolution, the primitive
              introduces no fixed height or author-fixed dimension other
              than a hairline border, and the rendered element carries
              no role, no{" "}
              <code>aria-*</code> attribute and no{" "}
              <code>tabindex</code>. Three are manual, because no tool
              can settle them: nothing clips at 320 CSS pixels of
              available inline size or at 400% zoom, spacing grows
              proportionally with a doubled root font size and user
              text-spacing overrides applied, and the same holds in a
              realistic page rather than an isolated demo.
            </p>
            <p>
              Splitting the assertions by type is not bookkeeping. It
              records honestly which parts of a claim a build server can
              defend and which parts need a person, which means the
              manual set is also the list of what silently rots if
              nobody is doing that work.
            </p>
            <p>
              The contract is machine-readable because it has to survive
              being handed to somebody who was not in the room. A
              paragraph of prose about focus behaviour degrades into
              opinion within a release or two. A structured field
              stating that the component never moves, traps or restores
              focus either matches the code or does not.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Guarantees</h2>
            <p>
              A guarantee is a promise the component keeps regardless of
              what surrounds it. The contract groups them so that a
              reviewer can find the one they need without reading the
              whole file.
            </p>
            <p>
              The semantic model states the role, the implicit element,
              the accessible name, whether DOM order is reading order,
              and the reasoning behind each. For the layout primitive
              every one of those is deliberately empty, and the
              reasoning field says why: a primitive cannot know whether
              its children form a list, a group, a set of landmarks or
              unrelated blocks, so it adds nothing and the consumer
              supplies the truth.
            </p>
            <p>
              The keyboard contract states whether the component is
              focusable, how many tab stops it introduces, what each key
              binding does, and the focus lifecycle: whether focus is
              received, moved, trapped or restored. Those four questions
              are separated because they fail separately. A dialog that
              traps focus correctly and never restores it on close is a
              common defect, and a contract with a single field for
              &ldquo;focus management&rdquo; cannot express the
              difference.
            </p>
            <p>
              The reflow behaviour states whether sizing is intrinsic,
              whether layout media queries are used, whether the author
              fixes any dimension, whether any height is fixed, which
              tokens govern gap and measure, whether the component works
              with JavaScript disabled, and the mechanism in plain
              words. It also states whether the component claims the
              WCAG two-dimensional exception, which for a
              single-axis primitive is a firm no.
            </p>
            <p>
              Finally the contract maps itself onto WCAG, criterion by
              criterion, with a level, a relationship, and a note. The
              relationship field is the useful part: a criterion may be
              marked as supported or as explicitly not addressed. The
              layout primitive supports Meaningful Sequence, Reflow,
              Resize Text and Text Spacing, and records that it does not
              address Info and Relationships at all, because it conveys
              no relationships and the consumer owns that criterion
              entirely. Each mapping also carries the branch it belongs
              to, either user technology support or user layout support,
              so the two kinds of work stay visible as different work.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Non-guarantees</h2>
            <p>
              Every component states what it does not do, as a list, in
              the same file as the guarantees. For the layout primitive
              the list runs to seven entries: no list semantics, no
              grouping role or accessible name, no heading structure or
              landmark, no enforcement of the measure, no management of
              focus or focus order or focus trapping or focus return, no
              guarantee of contrast between any pair of colour tokens,
              and no basis for claiming the WCAG two-dimensional
              exception.
            </p>
            <p>
              Read as a group across the primitives, the non-guarantees
              are more informative than the guarantees, because they are
              where the consumer&rsquo;s remaining work is written down.
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="Layout primitives with their guarantees and what they do not provide"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Primitive</th>
                    <th scope="col">Guarantees</th>
                    <th scope="col">Does not provide</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Stack</th>
                    <td>
                      Scale-based rhythm, no redundant final margin, DOM
                      order preserved
                    </td>
                    <td>List semantics</td>
                  </tr>
                  <tr>
                    <th scope="row">Box</th>
                    <td>
                      Forced-colours boundary through a transparent
                      outline
                    </td>
                    <td>Semantic role</td>
                  </tr>
                  <tr>
                    <th scope="row">Center</th>
                    <td>Measure enforcement</td>
                    <td>Universal zoom-visibility guarantee</td>
                  </tr>
                  <tr>
                    <th scope="row">Sidebar and Switcher</th>
                    <td>Container-driven reflow</td>
                    <td>Semantics</td>
                  </tr>
                  <tr>
                    <th scope="row">Grid</th>
                    <td>Wrapping of self-contained items</td>
                    <td>
                      Semantics, or any basis for the Reflow exception
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Reel</th>
                    <td>
                      Honest overflow, a reachable container, each item
                      readable at 320 CSS pixels
                    </td>
                    <td>Hidden-content reachability guarantee</td>
                  </tr>
                  <tr>
                    <th scope="row">Imposter</th>
                    <td>Overlay geometry and safe overflow</td>
                    <td>
                      Focus trap, modal semantics, focus return
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              The Grid row is the one I expect to be argued with. A
              visual grid is not a semantic grid, and a region arranged
              with the Grid primitive may not claim the two-dimensional
              exception to Reflow on the strength of its CSS. The
              exception turns on whether a two-dimensional relationship
              carries meaning that is needed to understand the content,
              which is a question about the content, not about the
              layout mechanism that happens to be arranging it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why a stated non-guarantee is load-bearing</h2>
            <p>
              Silence in a specification is ambiguous, and the ambiguity
              always resolves in the reader&rsquo;s favour. If a
              component says nothing about keyboard behaviour, there are
              at least three possible reasons: the component genuinely
              has no keyboard behaviour, it has some and nobody
              documented it, or it should have some and nobody noticed.
              Those three call for completely different responses, and
              the reader has no way to tell them apart.
            </p>
            <p>
              So the layout primitive does not omit the keyboard
              section. It carries one, with the field set to false, and
              a sentence explaining that it is stated explicitly rather
              than omitted so that a reviewer cannot mistake absence for
              oversight. Writing nothing would have been shorter and
              would have destroyed the information.
            </p>
            <p>
              The same reasoning makes uncertainty a first-class part of
              the contract rather than a footnote. The sample primitive
              records two open items: whether any shipping screen reader
              announces or otherwise exposes the bare container element
              has not been tested, and the behaviour of rem-anchored
              gaps under operating-system font scaling inside an
              Electron shell has not been tested. Both carry a status of
              not-yet-tested and both point at the evidence file.
            </p>
            <p>
              I want to be precise about what that buys, because it is
              easy to oversell. Recording an untested case fixes
              nothing. What it does is stop the gap from being invisible,
              which is the state in which it gets inherited. An
              untested case that is written down can be picked up by
              somebody with the right screen reader and the right
              platform. An untested case that is merely absent looks
              exactly like a tested one.
            </p>
            <p>
              There is a discipline that follows from this. A
              non-guarantee is a commitment too, and it can be wrong. If
              a component states that it does not manage focus and a
              later version starts managing focus, the contract has to
              change and the version has to move. That is the intended
              behaviour rather than an inconvenience, because it makes a
              change in accessibility posture visible in the same place
              as a change in API.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Rendering and interaction rules</h2>
            <p>
              Some of what a component declares is neither a guarantee
              about semantics nor a promise about behaviour, but a
              constraint on how it may be used. These are the rules that
              keep the guarantees true.
            </p>
            <p>
              Sizing is intrinsic. The primitive responds to the space
              actually available rather than to a breakpoint guess about
              which device is present, which is why the contract records
              that no layout media queries are used and no dimension is
              author-fixed. A breakpoint is a claim about the world. An
              intrinsic rule is a claim about the content, and it stays
              true at a zoom level nobody anticipated.
            </p>
            <p>
              No heights are fixed. This single rule does most of the
              work behind the Text Spacing and Resize Text claims, since
              user overrides that increase line height and letter
              spacing only cause damage when something has been told how
              tall it is allowed to be.
            </p>
            <p>
              Spacing is anchored in rem and named by token. The gap
              resolves through a token rather than a literal, so
              spacing grows with the user&rsquo;s text size, and the
              automated assertion can compare the computed value against
              the token after aliases resolve. A literal would have
              passed a visual review and failed a user.
            </p>
            <p>
              The mechanism is stated in words as well as fields. The
              primitive is a flex column with a gap, so the block
              direction grows with content and the arrangement reflows
              at any viewport size, zoom level or root font size without
              a breakpoint. That is a recognised approach rather than an
              invention: the WCAG techniques list using CSS Flexbox to
              reflow content as a sufficient technique for Reflow.
            </p>
            <p>
              And the component works without JavaScript. The contract
              says so as a field, not as an aspiration, which means a
              test can turn JavaScript off and check.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Composition and the component hierarchy</h2>
            <p>
              A contract that only described a component in isolation
              would reproduce the problem it is meant to solve, because
              components do not ship in isolation. So the contract also
              records what it hands over.
            </p>
            <p>
              Consumer obligations are written as requirements in their
              own field. The layout primitive states three: if the
              children form a list the consumer must supply list
              semantics on its own markup, if they form a labelled group
              the consumer must supply the grouping role and the
              accessible name, and the consumer must not rely on the
              primitive to convey any relationship between children.
              These are the mirror image of the non-guarantees. The
              non-guarantee says what the component will not do, and the
              obligation says who must do it instead, which is the half
              that usually goes missing.
            </p>
            <p>
              Separating geometry from semantics this strictly is a
              deliberate choice and it does have a cost. It means a
              consumer must always do something, and a consumer who does
              nothing gets a container with no meaning rather than a
              helpful default. I accept that cost because the
              alternative is worse. A primitive that guessed at list
              semantics would be right sometimes and would produce
              confidently wrong announcements the rest of the time, and
              a wrong guarantee is more damaging than an absent one.
            </p>
            <p>
              Above the level of the individual contract sits the
              question of whether an assembly of components is
              accessible, which does not follow from each part passing.
              Heading order is a property of a page. Landmark uniqueness
              is a property of a page. Focus order across several
              components is a property of a page. A design system that
              certifies only parts is certifying the least interesting
              thing about the result, which is why the primitives carry
              an assertion about behaviour in a realistic page fixture
              rather than only in a demo.
            </p>
            <p>
              Here I should be straight about the state of the work. The
              draft package format specifies the container, the
              manifest, the inventory and the verification algorithm,
              and it requires that a machine-readable component
              specification exists. It does not yet specify the internal
              schema of that specification. Everything described on this
              page is implemented in the sample package and is coherent,
              but it is a worked example rather than a settled schema,
              and the open questions record it as such. Composition
              conformance is in the same position: I am confident about
              what it needs to cover and I have not fixed how it is
              declared.
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
                  Understanding Success Criterion 1.4.10: Reflow
                </em>
                .{" "}
                <a href="https://www.w3.org/WAI/WCAG22/Understanding/reflow">
                  Understanding/reflow
                </a>
              </li>
              <li>
                W3C Web Accessibility Initiative.{" "}
                <em>
                  Technique C31: Using CSS Flexbox to reflow content
                </em>
                .{" "}
                <a href="https://www.w3.org/WAI/WCAG22/Techniques/css/C31">
                  Techniques/css/C31
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
