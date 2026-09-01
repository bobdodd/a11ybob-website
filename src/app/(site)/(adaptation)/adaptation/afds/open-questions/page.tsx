import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { AfdsSubNav } from "@/components/AfdsSubNav";
import { NewTabLink } from "@/components/NewTabLink";

export const metadata: Metadata = {
  title: "Open questions",
};

const URL_REPO =
  "https://github.com/bobdodd/" + "accessible-by-design";
const URL_WCAG = "https://www.w3.org/TR/WCAG22/";
const URL_C34 =
  "https://www.w3.org/WAI/WCAG22/Techniques/" + "css/C34";
const URL_G206 =
  "https://www.w3.org/WAI/WCAG22/Techniques/" + "general/G206";
const URL_CSS_COLOR =
  "https://www.w3.org/TR/" + "css-color-4/";
const URL_CONTAIN =
  "https://www.w3.org/TR/" + "css-contain-3/";
const URL_ATKINSON =
  "https://www.brailleinstitute.org/" + "freefont/";
const URL_ATKINSON_NEXT =
  "https://www.brailleinstitute.org/about-us/news/" +
  "braille-institute-launches-enhanced-atkinson-" +
  "hyperlegible-font-to-make-reading-easier/";
const URL_PRIMER =
  "https://primer.style/accessibility/" +
  "tools-and-resources/annotation-toolkit/";
const URL_VA =
  "https://design.va.gov/accessibility/" +
  "accessibility-annotations";
const URL_DSD_CG =
  "https://www.w3.org/community/" + "designsystemdocs/";

export default function OpenQuestions() {
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
            <h1>Open questions</h1>
            <p className="lede">
              A design system that treats uncertainty as a record type
              owes the same honesty about itself. Every question below
              is unsettled, and each one says what would count as
              settling it, because a list of doubts with no exit is a
              disclaimer rather than a research agenda.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why this list is public</h2>
            <p>
              Elsewhere in this design system I argue that a component
              must declare what it does not guarantee, and that an
              assertion nobody has tested should be recorded as
              uncertainty rather than quietly omitted. Both arguments
              are set out under{" "}
              <Link href="/adaptation/afds/what-a-component-declares">
                what a component declares
              </Link>{" "}
              and{" "}
              <Link href="/adaptation/afds/evidence-and-uncertainty">
                evidence and uncertainty
              </Link>
              . I do not think I can hold a component to that standard
              and exempt the project that defines it.
            </p>
            <p>
              So this is the whole register, not a summary of it. There
              are thirty-one open items across eight subject areas,
              plus four things deferred outright. Two of the
              thirty-one are partly resolved and say so. I have kept
              them numbered, because the numbering is how they are
              referred to in the specification, in the decision
              record, and in my own notes, and a question that cannot
              be cited is hard to argue about.
            </p>
            <p>
              The part I would defend hardest is not the list of
              doubts but the discipline attached to each one. Every
              item ends with what would count as an answer. That
              matters because the failure mode of an honest register
              is that it becomes a place to park a problem: naming a
              difficulty feels like addressing it, and a list of named
              difficulties can grow indefinitely without anything
              being decided. An item that has to state its own exit
              condition is much harder to park. Some of the exits
              below are cheap, some need equipment I do not have, and
              at least one needs people whose time I have no claim
              on. Saying which is which is most of the value here.
            </p>
            <p>
              When an item is settled it does not get deleted. It
              moves into the project decision record with its
              reasoning, its cost, and what was rejected, so the
              register shrinks and the decision record grows. So the
              one thing this page cannot show is its own history:
              questions that used to be here and now have answers are
              recorded as decisions instead. The
              adapters question is the clearest recent example. I
              argued for defining transforms in one direction only,
              was wrong, and the correction is now a decision rather
              than a question. What is left on this page is the part I
              have not earned an answer to yet.
            </p>
            <p>
              A caution about reading it. An open question is not a
              defect, and the density of questions in an area is not a
              measure of how badly that area is thought out. It tends
              to be the opposite. Colour has three questions and
              components have three, but colour is nearly specified
              and components are barely started, so the components
              questions are larger than their count suggests. Layout
              has the most items of any area precisely because it is
              the most worked out: the questions are narrow because
              everything around them is settled.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where the questions are</h2>
            <p>
              Eight subject areas, and where each is discussed in
              depth. The rows are ordered as they are lettered, which
              is roughly the order the questions arose rather than any
              order of importance.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="Subject areas"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Area</th>
                    <th scope="col">Items</th>
                    <th scope="col">What turns on it</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">A. Scope and structure</th>
                    <td>3</td>
                    <td>
                      What the project actually delivers, and how
                      coverage is measured
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">B. Tokens and interchange</th>
                    <td>3</td>
                    <td>
                      Whether design values survive a move between
                      tools without losing their reasons
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">C. Colour and typography</th>
                    <td>3</td>
                    <td>
                      Whether the conformance target I aim at is
                      reachable everywhere I want to aim it
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">D. Layout method</th>
                    <td>8</td>
                    <td>
                      Whether an intrinsic layout method can carry
                      dense data without a breakpoint
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">E. Testing and evidence</th>
                    <td>3</td>
                    <td>
                      Whether a claim of support means anything
                      specific
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">F. Positioning</th>
                    <td>3</td>
                    <td>
                      What this work claims to be, and what it must
                      admit it is not
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">G. Components and patterns</th>
                    <td>3</td>
                    <td>
                      Which interaction patterns are admitted, and on
                      what evidence
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">H. Portability and packaging</th>
                    <td>5</td>
                    <td>
                      Whether a package can be trusted, edited, and
                      understood by tools that did not make it
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              For maintenance the register is also kept as a document
              in the project repository, which is where items are
              edited and where resolved ones move across to the
              decision record:{" "}
              <NewTabLink href={URL_REPO}>accessible-by-design</NewTabLink>
              . That document is the source of truth for maintenance,
              not the place to go for the content. Everything in it is
              stated on this page.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A. Scope and structure</h2>
            <p>
              Five layers are in use: principles, tokens, layout
              primitives, components, and patterns. The current work
              defines the principles, the tokens in concept, and the
              layout primitives. Components and patterns are
              unspecified. That is the honest state of it, and the
              three questions here follow from that gap rather than
              from any difficulty in the layers that are done.
            </p>
            <h3>A1. What exactly does the system contain?</h3>
            <p>
              I have not decided whether this project ships components
              or only component specifications. The difference is not
              a packaging detail. A specification that nobody has
              implemented is a hypothesis about what is buildable,
              and the specifications in this system make testable
              claims about keyboard behaviour and assistive-technology
              support that only an implementation can discharge. Ship
              only specifications and the project is honest but
              unproven. Ship components and the project acquires
              maintenance obligations it may not be able to meet,
              which is its own kind of dishonesty, because an
              abandoned component with an accessibility contract on it
              is worse than no component.
            </p>
            <p>
              There is a related question about whether a reference
              implementation, if there is one, is normative or
              illustrative. If it is normative, the code is the
              standard and the prose is commentary. If it is
              illustrative, two conforming implementations may differ
              and the specification has to be precise enough to make
              that safe. I lean illustrative, because the whole
              argument for a portable format is that the contract
              travels without the code, but I have not tested that
              the specification is actually precise enough to
              survive it.
            </p>
            <p>
              And multi-component patterns need a home. An
              error-summary form, a wizard, a filterable result set:
              each is an arrangement of components whose accessibility
              lives in the arrangement rather than in any part. None
              of the five layers obviously owns them.
            </p>
            <p>
              <strong>To settle:</strong> whether the project ships
              components or only specifications; whether a reference
              implementation is normative or illustrative; and where
              multi-component patterns live.
            </p>
            <h3>A2. Component inventory</h3>
            <p>
              Coverage in this method is measured against a component
              inventory rather than a page count, for reasons set out
              under{" "}
              <Link href="/adaptation/afds/why-a-design-system">
                why a design system
              </Link>
              . That measure assumes an inventory exists. For an
              organisation that already runs a design system it does.
              For one that does not, there is no inventory to measure
              against, and no method here for deriving one.
            </p>
            <p>
              This is the question with the most direct consequence
              for the platform rather than the format, because an
              organisation with no design system is the normal case
              and is exactly the case that most needs the help. Such
              an organisation still has components: it has a search
              box that appears in eleven variants because eleven
              people built one. Those de facto components are what an
              inventory would have to capture, and capturing them
              means deciding when two similar things are one component
              with variants and when they are two components. Get that
              boundary wrong in the permissive direction and the
              inventory collapses into a handful of over-general
              entries that guarantee nothing; get it wrong the other
              way and coverage can never reach a useful number
              because the denominator keeps growing.
            </p>
            <p>
              <strong>To settle:</strong> how to identify de facto
              components in a codebase with no design system, and how
              to define an inventory that is useful rather than merely
              complete.
            </p>
            <h3>A3. Composition conformance</h3>
            <p>
              Components must be tested alone and in realistic pages,
              because a component that behaves in isolation can fail
              in composition. The principle is settled and recorded.
              What does not exist is a fixture design to test it
              with.
            </p>
            <p>
              The hard part is attribution. When a page containing
              nine components fails, something has to decide whether
              the fault belongs to a component, to the composition, or
              to the fixture, and that decision determines who fixes
              it. Without an attribution rule, composition testing
              produces failures that nobody owns, which is a good way
              to make a test suite that everyone ignores.
            </p>
            <p>
              <strong>To settle:</strong> fixture composition, how
              many fixtures are enough, and the rule that attributes
              a failure to a component or to its composition.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>B. Tokens and interchange</h2>
            <p>
              The background to this area is on{" "}
              <Link href="/adaptation/afds/portable-representations">
                portable representations
              </Link>
              , which surveys what the existing interchange formats
              can and cannot carry. Three questions remain.
            </p>
            <h3>B1. Are design tokens the source of truth?</h3>
            <p>
              <strong>Partly settled.</strong> The decision record now
              adopts the Design Tokens Community Group JSON format as
              the canonical portable representation for token values,
              so that format is the source of truth for the values
              themselves. It supports aliases and modern colour
              spaces, both of which this system needs.
            </p>
            <p>
              What is still open is the build direction: whether
              tokens generate the CSS custom properties, or the CSS
              custom properties are the authoring surface and tokens
              are exported from them. CSS custom properties already
              satisfy the immediate need with no build step, and a
              build step is a real cost that has to earn itself. The
              honest position is that adopting a canonical format for
              interchange does not by itself decide where a human
              types a value, and I have been treating those as the
              same question when they are not.
            </p>
            <p>
              This is worth separating from a limitation that is not
              open at all. The token format cannot carry component
              semantics, keyboard behaviour, evidence, non-guarantees,
              or contrast assertions, and that is settled rather than
              unresolved. It is why the format is one artefact in a
              bundle rather than the whole of it.
            </p>
            <p>
              <strong>To settle:</strong> whether tokens generate CSS
              or CSS exports tokens.
            </p>
            <h3>
              B2. The <code>ch</code> problem
            </h3>
            <p>
              The measure axiom in this system is expressed in{" "}
              <code>ch</code> units, which are defined against the
              advance measure of the zero glyph in the font actually
              used, and so track the text rather than the viewport.
              That is the property that makes a line-length limit
              survive a font change. It also makes the axiom
              web-shaped, because there is no direct equivalent on
              iOS or Android.
            </p>
            <p>
              So either the measure axiom is explicitly scoped to web
              and Electron, and the system says so rather than
              implying a portability it does not have, or a native
              analogue is defined in terms of a font metric those
              platforms do expose. The first is honest and narrow. The
              second is more useful and I am not sure it is possible
              to state precisely enough to be testable, which by this
              project&rsquo;s own rules would disqualify it.
            </p>
            <p>
              <strong>To settle:</strong> whether this is an explicit
              web-and-Electron scope limit, or needs a native analogue
              of the measure axiom.
            </p>
            <h3>B3. Contrast as a relationship</h3>
            <p>
              Token formats carry values. They do not carry the
              assertion that one foreground token is valid against one
              background token at a threshold such as 7:1. That
              assertion is a relationship between two tokens and a
              number, and it is the thing an accessibility-focused
              design system most needs to state, because a palette of
              individually documented colours tells a consumer nothing
              about which pairs are safe to use together.
            </p>
            <p>
              A consumer that receives the values without the
              relationships has to rediscover them by computation,
              which is possible for a simple pair and unreliable in
              the cases that matter, since the effective background of
              a foreground token depends on where it is used. The
              relationship is a design decision, not a derivable
              fact, and derivable facts are the only kind a value
              format can transmit.
            </p>
            <p>
              The research note records why such an assertion must
              not live only in the token format&rsquo;s extension
              mechanism: extensions are optional metadata that a
              conforming tool may faithfully preserve without
              understanding, so a contrast guarantee stored there
              survives transmission while losing its force. Preserved
              and honoured are different things, and a safety claim
              needs the second.
            </p>
            <p>
              <strong>To settle:</strong> whether to propose an
              interchange representation for contrast relationships,
              and what interim project convention to use meanwhile.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>C. Colour and typography</h2>
            <p>
              This area is closer to specified than any other
              unfinished one, which is why its three questions are
              about verification and limits rather than about what to
              build.
            </p>
            <h3>C1. Colour system</h3>
            <p>
              The leading candidate is a palette expressed in OKLCH
              with constant-lightness pairings and a surface at
              roughly 95% lightness. OKLCH is available in CSS as{" "}
              <code>oklch()</code>, whose first argument is a
              lightness on a scale where, in the
              specification&rsquo;s words,{" "}
              <em>
                L=0% or 0.0 is deep black (no light at all) while
                L=100% or 1.0 is a diffuse white
              </em>
              . The reason for preferring it over the older
              Lab-derived polar form is stated there too: the
              underlying space{" "}
              <em>
                was produced by numerical optimization of a large
                dataset of visually similar colors, and has improved
                hue linearity, hue uniformity, and chroma uniformity
                compared to CIE LCH
              </em>
              .
            </p>
            <p>
              Constant-lightness pairing is my own technique rather
              than anything the specification recommends, and the
              appeal of it is that holding lightness fixed across a
              hue family makes the contrast behaviour of the family
              predictable instead of per-colour. Whether that
              predictability survives contact with a real palette is
              exactly what is unverified.
            </p>
            <p>
              There is a further problem I cannot resolve by reading.
              A ratio computed from relative luminance and a
              difference judged in a perceptually uniform space do not
              always agree, and where they disagree the numeric
              measure is the one the conformance requirement is
              written in. So a palette can be perceptually
              well-separated and numerically non-conforming, or the
              reverse, and I have to decide which to treat as
              authoritative when they diverge rather than assuming
              they will not.
            </p>
            <p>
              <strong>To settle:</strong> the palette values;
              numeric versus perceptual contrast verification where
              the two disagree; and behaviour under a user preference
              for increased contrast.
            </p>
            <h3>C2. Typeface</h3>
            <p>
              The leading candidate is Atkinson Hyperlegible, which
              its publisher describes as one of{" "}
              <em>
                a family of hyperlegible fonts designed to improve
                legibility and readability for individuals with low
                vision
              </em>
              , named after the Braille Institute&rsquo;s founder and
              focused on{" "}
              <em>letterform distinction</em>. The specific mechanism
              is the part that matters for a data-dense interface:{" "}
              <em>
                for low-vision readers, certain letters and numbers
                can be hard to distinguish from one another
              </em>
              , and the design differentiates those characters
              deliberately. It is free for personal and commercial
              use.
            </p>
            <p>
              Two parts of this question have moved since I wrote it,
              and checking them changed the item more than I expected.
              I recorded a need for a monospace companion. One exists:
              the family now ships in three versions, and the
              monospaced one is described as having{" "}
              <em>
                characters that each occupy the same amount of
                horizontal space, allowing for them to be scanned
                quickly in table-based and coding environments
              </em>
              . The release announcement calls the same face
              Monospace rather than Mono, so the name to use is
              whichever the download page carries at the time of
              adoption.
            </p>
            <p>
              The second change is the one that matters. I had treated
              the variable font as a hypothetical, and it is not. The
              announcement for the newer version says it builds on
              the original typeface{" "}
              <em>that was introduced in 2019</em>, supports{" "}
              <em>over 150 languages (up from 27)</em>, and offers{" "}
              <em>
                seven font weights (up from two), as well as new
                variable and monospace versions
              </em>
              .
            </p>
            <p>
              Seven weights and a continuous axis are a different
              proposition from two weights. The type scale here is
              specified as discrete steps, which was an easy
              commitment when the typeface offered two weights and is
              a real decision when it offers a continuum. A scale that
              admits intermediate weights has to say which weights
              carry meaning, because a weight difference too small to
              perceive is a distinction that exists in the
              specification and not on the screen.
            </p>
            <p>
              Choosing between the original and the newer version is
              therefore a question about which set of letterform
              decisions the scale is built on, rather than a matter of
              taking the newest. And the oldest part of this item is
              untouched by any of it: I still have not tested the
              typeface at the small sizes a dense report actually
              uses, and letterform distinction is a claim about
              character shapes rather than about behaviour at eight or
              nine points.
            </p>
            <p>
              <strong>To settle:</strong> which of the three versions
              is the candidate, its performance at small data-dense
              sizes, and how seven weights and a continuous axis
              affect a scale specified as discrete steps.
            </p>
            <h3>C3. Conformance target</h3>
            <p>
              The floor is the AA level of the accessibility
              guidelines. AAA is aspirational, and on this site it is
              what I actually build to. The question is whether that
              aspiration is a commitment, and if so at what
              granularity.
            </p>
            <p>
              The specific difficulty is enhanced contrast, which at
              AAA requires{" "}
              <em>
                a contrast ratio of at least 7:1
              </em>{" "}
              for text, with large-scale text allowed 4.5:1. Seven to
              one is comfortable for body prose. In a dense report it
              is a constraint on how many things can be
              distinguishable at once, because a table that needs to
              separate a header row, a total row, an emphasised cell
              and a muted footnote has to find several
              distinguishable treatments that each clear 7:1 against
              their own background, and the space of colours that
              does that is much smaller than the space that clears
              4.5:1. Something has to give, and the honest options
              are to give up the ratio in dense views or to give up
              the density.
            </p>
            <p>
              That is why a per-surface commitment is worth
              considering rather than a blanket one. A blanket AAA
              claim that quietly fails in the reporting views is
              worse than a scoped claim that holds, and a design
              system whose whole argument is that guarantees should
              be explicit cannot make its own headline guarantee the
              vague one.
            </p>
            <p>
              <strong>To settle:</strong> whether AAA is a per-surface
              commitment or a blanket one, and whether 7:1 body
              contrast stays usable in data-dense reports.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>D. Layout method</h2>
            <p>
              This area has the most items and the narrowest ones. The
              method itself is settled: layout is intrinsic rather
              than breakpoint-driven, and media queries are not used
              for layout. Every question below is a consequence of
              holding that line in a specific place.
            </p>
            <h3>D1. Container queries versus the Switcher trick</h3>
            <p>
              The technique that switches a two-column arrangement to
              one column without a media query works by giving a flex
              item a basis of{" "}
              <code>calc((var(--threshold) - 100%) * 999)</code>,
              which resolves to a large positive or large negative
              number depending on whether the container is above or
              below the threshold. It predates container queries and
              is unquestionably obscure.
            </p>
            <p>
              Container queries now do the same job legibly. The
              specification frames the distinction the way this method
              would: media queries{" "}
              <em>
                provide a method to query aspects of the user agent
                or device environment
              </em>
              , while container queries{" "}
              <em>
                allow testing aspects of elements within the document
              </em>
              . That is precisely the difference between the thing
              the axioms forbid and the thing they are trying to
              achieve, so a container query is not a media query with
              a different name and adopting one would not weaken the
              method.
            </p>
            <p>
              The reasons for hesitating are support and behaviour
              without JavaScript rather than any objection in
              principle. The calc technique degrades to a single
              column, which is a safe failure. A container query in
              an unsupporting engine applies neither branch, which may
              not be.
            </p>
            <p>
              <strong>To settle:</strong> whether the legibility gain
              justifies replacing the calc technique, given the
              support floor and the requirement that layout works
              without JavaScript.
            </p>
            <h3>D2. Custom elements without a shadow root</h3>
            <p>
              The layout primitives are custom elements, and the
              decision not to use a shadow root means their styles
              cannot be encapsulated with them. Styles therefore have
              to be generated at build time into the document&rsquo;s
              own stylesheet. That generator does not exist, and its
              relationship to Electron packaging is undefined.
            </p>
            <p>
              The reason for avoiding a shadow root is that
              encapsulation cuts both ways: it protects a
              component&rsquo;s styles from the page and also protects
              them from the user, and a user stylesheet or a forced
              palette is a legitimate intervention that a design
              system for accessibility should not obstruct. That trade
              is settled. Its build-time consequence is not.
            </p>
            <p>
              <strong>To settle:</strong> the style generator, and how
              it relates to Electron packaging.
            </p>
            <h3>D3. Reel and Imposter accessibility</h3>
            <p>
              Two of the layout primitives carry requirements that
              exceed what a layout primitive can reasonably own. A
              horizontally scrolling region needs a
              keyboard-reachable scroll container, content that stays
              reachable when it overflows, and items that remain
              readable at 320 CSS pixels. An overlay primitive raises
              focus trapping, modal semantics, and focus return on
              dismissal, all of which belong to a dialog rather than
              to positioning.
            </p>
            <p>
              So the question is whether these become separate
              components that compose with the primitives, or whether
              the primitives grow to absorb them. Growing them is
              tempting and I distrust it, because a primitive that
              manages focus is no longer a primitive and the
              simplicity of the layer is most of its value.
            </p>
            <p>
              <strong>To settle:</strong> whether these requirements
              become separate components or extend the primitives.
            </p>
            <h3>D4. Data-dense layouts</h3>
            <p>
              <strong>Largely resolved.</strong> A data table with
              genuine header-to-cell relationships is excepted from
              the reflow requirement, and the exception is semantic
              rather than presentational: cells are semantic content,
              whereas a grid is a layout technique, so arranging
              boxes in a grid does not earn the exception. Flexbox
              composition is a sufficient technique for reflow. The
              reasoning is set out in the project decision record and
              summarised under{" "}
              <Link href="/adaptation/afds/why-a-design-system">
                why a design system
              </Link>
              . Three narrower questions survive it.
            </p>
            <h4>D4a. Sticky positioning without media queries</h4>
            <p>
              The published advisory technique for sticky regions is
              to un-fix them with media queries when there is not
              enough room, using{" "}
              <em>min-height, max-height, and min-width</em> queries
              that adapt to the available space. The problem it
              addresses is real and the technique&rsquo;s own note
              states it plainly: with a fixed header,{" "}
              <em>
                tabbing backwards to reach interactive elements higher
                up on the page will often mean that the focus becomes
                invisible once it moves behind the sticky header
              </em>
              , and a user{" "}
              <em>
                may not necessarily be aware
              </em>{" "}
              that they need to scroll to see it.
            </p>
            <p>
              The remedy is media queries, which this method forbids
              for layout. So the current position, recorded as a
              decision rather than left implicit, is that sticky and
              fixed positioning are not used at all. That is a
              genuine cost: on a long results view the filters and
              the column headers scroll away, which is a real loss of
              orientation, and I would rather name it than pretend
              the axiom is free.
            </p>
            <p>
              <strong>To settle:</strong> a container-driven
              equivalent, or a narrow and documented exception to the
              axiom.
            </p>
            <h4>D4b. Alternative views for excepted regions</h4>
            <p>
              There is a technique for{" "}
              <em>
                providing options within the content to switch to a
                layout that does not require the user to scroll
                horizontally to read a line of text
              </em>
              . Offering such an option inside a view that already
              claims the two-dimensional exception would go beyond
              what is required, which is a good reason to consider it
              and not a reason to assume it helps.
            </p>
            <p>
              The same technique notes that a spreadsheet needing
              horizontal scrolling is acceptable{" "}
              <em>
                if no horizontal scrolling is necessary for each
                column individually
              </em>
              , which is the shape the excepted views here already
              take. An alternative view would therefore be a
              convenience rather than a remedy, and its cost is that a
              second layout for the same data is a second thing to
              keep correct.
            </p>
            <p>
              <strong>To settle:</strong> whether to offer it, and how
              it affects the density of the primary view.
            </p>
            <h4>D4c. Reflow inside a single cell</h4>
            <p>
              A code excerpt in a table cell has two incompatible
              needs depending on what it is. Indentation-significant
              code must not be re-wrapped, because wrapping changes
              what it means. A long prose-like value must wrap,
              because a cell that scrolls independently is
              unmanageable. No global rule covers both, and I do not
              think one exists.
            </p>
            <p>
              <strong>To settle:</strong> a per-component judgement
              procedure rather than a global rule.
            </p>
            <h3>D5. Measure inside excepted regions</h3>
            <p>
              The measure axiom caps line length to keep prose
              readable. Inside a narrow table cell that cap may waste
              usable width, since the cell is already narrower than
              the limit and the limit does nothing but forbid the cell
              from using space it has. Cells still have to meet
              reflow, so suspending the cap does not suspend the
              requirement.
            </p>
            <p>
              <strong>To settle:</strong> whether the measure applies,
              reduces, or is suspended inside an excepted region.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>E. Testing and evidence</h2>
            <p>
              What a record has to contain is settled and is described
              under{" "}
              <Link href="/adaptation/afds/evidence-and-uncertainty">
                evidence and uncertainty
              </Link>
              . What is not settled is the programme that would
              produce those records.
            </p>
            <h3>E1. The assistive-technology matrix</h3>
            <p>
              A support claim must record engine, version, browser,
              observed behaviour, and date, and for reflow it must
              also record device, browser, starting viewport, and
              zoom, because a reflow result without a starting
              viewport is not reproducible. Speech recognition belongs
              in the matrix as well, and is routinely left out of
              this kind of testing.
            </p>
            <p>
              What does not exist is the matrix itself: which
              combinations are supported, what counts as a pass, how
              often a result is re-tested, and when a result becomes
              stale. Staleness is the part I find hardest. Engines
              update continuously, so every record starts decaying
              the day it is written, and a matrix with no staleness
              rule slowly turns into a set of confident claims about
              software versions nobody runs any more. Marking a
              result stale is easy to specify and expensive to
              honour, because it commits me to retesting on a cadence
              rather than once.
            </p>
            <p>
              <strong>To settle:</strong> supported combinations, pass
              criteria, re-test cadence, and how a stale result is
              marked.
            </p>
            <h3>E2. Machine-checkable criteria</h3>
            <p>
              Some requirements look unusually automatable: reflow,
              scaling with the root font size, text spacing
              overrides, and forced colours are all things a machine
              can exercise directly by changing an environment and
              observing a result, without needing to interpret intent.
              That is rarer than it sounds, and it makes this a
              genuine opportunity rather than a routine one.
            </p>
            <p>
              The risk is the familiar one for automated accessibility
              testing, which is that the automatable subset gets
              mistaken for the whole. A component can pass every
              machine check and still be unusable, so the automated
              suite has to be paired with an explicit statement of
              what it does not cover.
            </p>
            <p>
              <strong>To settle:</strong> which assertions are
              automated, and the manual procedures for the remainder.
            </p>
            <h3>E3. Usability testing with disabled people</h3>
            <p>
              Neither automated nor expert manual testing substitutes
              for testing with disabled people. I am not going to
              argue that point, and I am also not going to pretend
              that stating it constitutes doing it.
            </p>
            <p>
              This is the item I am least able to resolve alone. Every
              other question here needs a decision, a document, or
              equipment. This one needs participants, and
              participation costs people their time and attention.
              Doing it properly means recruitment, fair compensation,
              and consent, none of which a specification can conjure,
              and doing it improperly is worse than not doing it,
              because a token session produces a claim of validation
              that the work has not earned.
            </p>
            <p>
              So the outcome may be an explicit limitation statement
              rather than a testing programme. That is a poor outcome
              and I would rather record it as one than describe an
              aspiration as a plan.
            </p>
            <p>
              <strong>To settle:</strong> a feasible participation
              model, or an explicit statement of the limitation.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>F. Positioning</h2>
            <p>
              Three questions about what this work claims to be. They
              are not implementation questions and they are the ones
              most likely to change how the rest is read.
            </p>
            <h3>F1. The annotation tradition</h3>
            <p>
              There is an established practice of solving the
              designer-to-developer handoff with annotations on
              mockups, and two large public design systems document
              it. The Department of Veterans Affairs describes
              annotations as{" "}
              <em>
                notes we add to our mockups to communicate meaning,
                behaviors, and interactions in the design or
                application
              </em>
              , which{" "}
              <em>
                help to reduce developer decision-making (and
                guesswork) by providing clear guidance for semantic
                HTML and UI interactions
              </em>
              . Their guidance on what to annotate is the revealing
              part: annotations are{" "}
              <em>
                most valuable for anything not visible or explicit in
                the design
              </em>
              , and the examples given are heading levels, accessible
              names, fieldset and legend placement, error messages,
              and focus management.
            </p>
            <p>
              GitHub&rsquo;s toolkit is a Figma asset library for the
              same purpose, described as filling{" "}
              <em>
                a critical gap in the design-to-development workflow
                where important details often get lost
              </em>
              .
            </p>
            <p>
              My interest in this is a suspicion rather than a
              finding. Look at that list of what needs annotating:
              heading levels, accessible names, fieldset placement,
              focus management. Those are structural facts about a
              component, and a component that carried its own
              structural guarantees in code would not need a note
              telling an engineer what to build, because the
              engineer would not be making the decision. So
              primitives that bake structural guarantees into code
              might reduce the annotation burden rather than
              supplement it. That would be a substantive claim about
              where this method fits in an existing practice, and it
              is currently just a hypothesis with a plausible
              mechanism.
            </p>
            <p>
              What would make it more than that is a measure. Without
              one, the claim is unfalsifiable and I should not lean on
              it. And even if the reduction is real it is a reduction
              rather than an elimination: annotations that record
              intent, content order, or the reasoning behind a
              deviation are not structural and would survive.
            </p>
            <p>
              <strong>To settle:</strong> whether the reduction can be
              measured, and which annotations remain useful when
              structural guarantees live in code.
            </p>
            <h3>F2. The layered-equilibrium model</h3>
            <p>
              One way to frame accessibility is as an emergent
              equilibrium between the environment, the technical
              constraints, a person&rsquo;s capabilities, their
              preferences, and the resources and modalities the
              interface offers. On that framing accessibility is not a
              property of an artefact at all, but a relation that
              holds or fails between an artefact and a situation,
              which would explain why a component can be conformant
              and unusable at the same time.
            </p>
            <p>
              I find it a useful way to think and I have not decided
              whether it becomes the explicit theoretical frame for
              this work. The cost of adopting it is that a frame with
              five interacting terms is hard to make testable, and
              this project&rsquo;s central discipline is that every
              specification is testable by construction. A frame that
              cannot be operationalised would sit oddly against
              that.
            </p>
            <p>
              <strong>To settle:</strong> whether this becomes the
              explicit theoretical frame.
            </p>
            <h3>F3. The honest disclaimer</h3>
            <p>
              A design system does not automatically make a service
              accessible. Content can be wrong, flows can be wrong,
              a component with an excellent contract can be used for
              something it was never meant to do, and none of that is
              reachable from the system layer. I make the point at
              greater length on{" "}
              <Link href="/adaptation/afds/why-a-design-system">
                why a design system
              </Link>
              , under the heading on what this does not fix.
            </p>
            <p>
              What is unsettled is not whether to say it but the
              exact wording and where it appears, and I have come to
              think the placement matters more than the phrasing. A
              disclaimer on a page nobody reads is decoration. The
              natural place for it is wherever a conformance claim is
              made, so that a reader encounters the limit at the
              moment they are being told what the system delivers
              rather than in a separate statement they can skip. That
              is also the most uncomfortable place to put it, which
              is some evidence it is the right one.
            </p>
            <p>
              There is a related consideration about tone. The
              disclaimer must not read as pre-emptive
              self-protection, because a limitation stated to reduce
              liability is a different act from a limitation stated to
              inform, and readers can tell the difference.
            </p>
            <p>
              <strong>To settle:</strong> the exact wording, and
              where it appears.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>G. Components and patterns</h2>
            <p>
              I give the detailed treatment of authoring patterns on{" "}
              <Link href="/adaptation/afds/apg-support">
                pattern support
              </Link>
              . The three headline questions are restated here in
              full, so that this register is complete on its own.
            </p>
            <h3>G1. Which patterns enter the approved catalogue?</h3>
            <p>
              A priority order exists. It runs from native primitives,
              through disclosure, dialog and status messaging, with
              tree, treegrid and grid widgets last. That order is
              reasoned rather than evidenced: it reflects how much
              behaviour a pattern has to reimplement and how much
              engine support it depends on, which are good proxies for
              risk and are not the same as evidence that users need
              the pattern.
            </p>
            <p>
              Admission on reasoning alone is how catalogues fill up
              with patterns nobody needed. The harder half is removal,
              because a pattern with implementations depending on it
              is expensive to withdraw, and a catalogue with no
              removal criterion only grows.
            </p>
            <p>
              <strong>To settle:</strong> what user or task evidence
              admits a pattern to the catalogue, and what removes
              one.
            </p>
            <h3>G2. Adopting patterns by reference</h3>
            <p>
              A decision is drafted stating that authoring patterns
              are adopted by reference rather than copied by default,
              so that a pattern&rsquo;s upstream corrections are
              inherited instead of being frozen at the moment
              somebody pasted them. It is written in the shape a
              decision record entry takes, and it has not been
              adopted.
            </p>
            <p>
              I want to be exact about that status, because it is the
              kind of thing that quietly hardens into a position
              nobody chose. It is a proposal. No component
              specification should cite it as settled, and adoption by
              reference has an unresolved consequence of its own:
              inheriting upstream corrections means inheriting
              upstream changes, so something has to monitor the
              referenced source and decide what to do when it moves
              under a component that already claims support.
            </p>
            <p>
              <strong>To settle:</strong> whether the decision moves
              to the record as written, and how a deviation from a
              referenced convention is recorded and reviewed.
            </p>
            <h3>G3. The minimum matrix per component</h3>
            <p>
              A component contract is only as real as the engine
              support behind it, which is a principle this project has
              already adopted. No minimum matrix has been fixed for a
              pattern-derived component, so the principle currently
              has nothing to bite on.
            </p>
            <p>
              This is E1 narrowed to a single component, and it is
              where that abstract question becomes a gate: without a
              mandatory set of pairs, a component can claim support on
              whatever combination happened to be convenient to test.
            </p>
            <p>
              <strong>To settle:</strong> which browser, engine and
              screen-reader pairs are mandatory, and what retest
              cadence applies when versions change.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>H. Portability and packaging</h2>
            <p>
              Two decisions here are adopted: the format is a portable
              bundle rather than a monolithic document, and a bundle
              is distributed as a single package file. The container
              is specified under{" "}
              <Link href="/adaptation/afds/the-package-format">
                the package format
              </Link>
              . Five questions remain.
            </p>
            <h3>H1. The component-contract schema</h3>
            <p>
              A provisional format exists for a component
              specification, pairing human-readable prose with a
              machine-readable structure. Its vocabulary is invented
              by this project and has no external validation, which
              is the real risk: a well-designed private vocabulary is
              indistinguishable from a well-designed shared one right
              up to the moment somebody else has to read it.
            </p>
            <p>
              <strong>To settle:</strong> the schema, the stable
              identifier scheme, and how the vocabulary maps onto
              external work rather than becoming isolated.
            </p>
            <h3>H2. Alignment targets</h3>
            <p>
              The closest external match to this project&rsquo;s needs
              was a W3C community group chartered to define an
              implementation-agnostic meta-model for user interface
              elements. It closed in May 2026 having produced no
              report, no schema and no mailing-list traffic, so its
              charter is the whole of its output and there is no
              vocabulary to map onto. I set out the evidence for that
              reading on{" "}
              <Link href="/adaptation/afds/portable-representations">
                portable representations
              </Link>
              , under the heading on where the standards work is
              going. No successor has been announced.
            </p>
            <p>
              The live target is the Design System Documentation
              Community Group:{" "}
              <NewTabLink href={URL_DSD_CG}>W3C group page</NewTabLink>
              . It has co-chairs, an explicit goal of
              compatibility with the token and manifest formats this
              bundle already uses, and no draft yet. The question is
              therefore no longer which group to watch but what to
              send it, and the timing is unusually favourable:
              contributing a requirement before there is a draft is a
              different proposition from asking for a change
              afterwards.
            </p>
            <p>
              The specific thing worth contributing is the part that
              group&rsquo;s charter does not currently mention.
              Assistive-technology evidence, explicit non-guarantees,
              and recorded uncertainty are the three record types this
              system treats as load-bearing, and a documentation
              format without them can describe a component fully
              while saying nothing about whether its accessibility
              claims have been tested.
            </p>
            <p>
              <strong>To settle:</strong> which requirements are
              worth contributing, in what form, and by when.
            </p>
            <h3>H3. Package identity and signing</h3>
            <p>
              Inventory integrity uses digests, which detect a change
              in transfer. They do not identify a signer or establish
              provenance. Integrity and authenticity are separate
              properties and the package currently has the first
              without the second, as the package format page says at
              more length.
            </p>
            <p>
              <strong>To settle:</strong> the signature mechanism,
              what it signs, and how a consumer expresses trust in a
              publisher.
            </p>
            <h3>H4. Media type and package-aware tooling</h3>
            <p>
              The underlying media type is the generic archive type
              in the interim, with the package identified by its
              extension and root manifest. Whether to pursue a
              dedicated registration is open.
            </p>
            <p>
              The tooling half of this question is the one with
              day-to-day consequences. Editing one artefact currently
              means unpacking the whole package, changing a file, and
              repacking it, which makes every edit a whole-package
              operation. A format that cannot be diffed or updated
              incrementally is workable for distribution and
              unpleasant for authoring, and a format that is
              unpleasant to author gets authored badly.
            </p>
            <p>
              <strong>To settle:</strong> whether to pursue a
              dedicated media-type registration, and what editing,
              diffing and delta-distribution tooling the format
              needs to be workable.
            </p>
            <h3>H5. Recording a promotion</h3>
            <p>
              An import transform drafts artefacts, and a person
              promotes a draft by supplying what the source could not
              and accepting responsibility for the claims it makes.
              I describe the mechanism on{" "}
              <Link href="/adaptation/afds/adapters">
                adapters
              </Link>
              , under the heading on what an import may not do.
              The declaration lists which artefacts were promoted,
              so the package records that a promotion happened.
            </p>
            <p>
              What a promoted artefact says about its own origin is
              undefined, which means a reader of a finished contract
              cannot tell which statements a transform drafted and
              which a person authored. Given that the whole point of
              promotion is that a person took responsibility, not
              recording where that responsibility falls is a
              conspicuous omission.
            </p>
            <p>
              The awkward part is the second half. Recording a
              reviewer and a date would answer it, and it would
              introduce an identity claim into a package that
              currently makes none. Every other field describes an
              artefact; a reviewer name describes a person, and that
              is a different kind of assertion with different
              consequences for anyone who publishes a package.
            </p>
            <p>
              <strong>To settle:</strong> whether a promoted artefact
              carries a provenance field naming the import report,
              whether a promotion records a reviewer and a date, and
              whether a reviewer&rsquo;s identity belongs in a
              package that makes no other identity claim.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Deferred, and why</h2>
            <p>
              Four things are not on the agenda at all. They are
              deferred rather than open, and the distinction is
              deliberate: an open question is one I am trying to
              answer, while a deferred one is a question I have
              decided not to work on yet. Listing them separately
              stops the register from implying more activity than
              there is.
            </p>
            <ul>
              <li>
                The implementation language and framework, beyond a
                current assumption of Electron with plain HTML, CSS
                and JavaScript.
              </li>
              <li>The design of the remediation tooling.</li>
              <li>Hosting, telemetry, and distribution.</li>
              <li>
                Whether the project ultimately publishes a
                specification, tools, or both.
              </li>
            </ul>
            <p>
              The last of those is uncomfortably close to A1, and the
              difference between them is scope. A1 asks what the
              design system contains, which is a question about the
              format and has to be answered for the format to be
              finished. This one asks what the project publishes,
              which depends on things outside the format entirely.
              Keeping them apart stops a decision about deliverables
              from being smuggled in as a decision about
              specification structure.
            </p>
            <p>
              Deferring is a decision with a cost, and the cost is
              legible in the list. Three of the four are the things
              that would turn this work into something usable by
              somebody other than me.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>References</h2>
            <ul>
              <li>
                W3C. <em>CSS Color Module Level 4</em>. Quoted for the
                lightness scale of the OKLCH notation and for the
                comparison of the underlying space with CIE LCH.{" "}
                <a href={URL_CSS_COLOR}>w3.org/TR/css-color-4/</a>
              </li>
              <li>
                W3C. <em>CSS Containment Module Level 3</em>. Quoted
                for the distinction between querying the device
                environment and querying elements within the
                document.{" "}
                <a href={URL_CONTAIN}>w3.org/TR/css-contain-3/</a>
              </li>
              <li>
                W3C. <em>Web Content Accessibility Guidelines
                2.2</em>. Quoted for Success Criterion 1.4.6 Contrast
                (Enhanced) at Level AAA, and its 7:1 ratio.{" "}
                <a href={URL_WCAG}>w3.org/TR/WCAG22/</a>
              </li>
              <li>
                W3C. <em>Technique C34</em>. Quoted for the media
                query approach to un-fixing sticky regions and for
                its note on focus disappearing behind them.{" "}
                <a href={URL_C34}>WCAG22 Technique C34</a>
              </li>
              <li>
                W3C. <em>Technique G206</em>. Quoted for the
                alternative-layout option and for the per-column
                reading condition.{" "}
                <a href={URL_G206}>WCAG22 Technique G206</a>
              </li>
              <li>
                Braille Institute. <em>Atkinson Hyperlegible</em>.
                Quoted for the design purpose, letterform
                distinction, licence terms, and the three versions
                the family now ships in.{" "}
                <a href={URL_ATKINSON}>brailleinstitute.org</a>
              </li>
              <li>
                Braille Institute.{" "}
                <em>
                  Braille Institute launches enhanced Atkinson
                  Hyperlegible font
                </em>
                , 10 February 2025. Quoted for the language and
                weight counts, the variable and monospace versions,
                and the 2019 date of the original.{" "}
                <a href={URL_ATKINSON_NEXT}>Braille Institute news</a>
              </li>
              <li>
                Department of Veterans Affairs.{" "}
                <em>Accessibility annotations</em>. Quoted for the
                definition of an annotation and for the list of
                decisions engineers otherwise make unaided.{" "}
                <a href={URL_VA}>design.va.gov</a>
              </li>
              <li>
                GitHub. <em>Annotation Toolkit</em>. Quoted for the
                description of the gap it addresses in the
                design-to-development workflow.{" "}
                <a href={URL_PRIMER}>primer.style</a>
              </li>
              <li>
                W3C.{" "}
                <em>Design System Documentation Community Group</em>.
                Cited as the live alignment target.{" "}
                <a href={URL_DSD_CG}>W3C community group</a>
              </li>
              <li>
                Bob Dodd. <em>accessible-by-design</em>. The
                maintained register, and the decision record that
                resolved items move into.{" "}
                <a href={URL_REPO}>accessible-by-design</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
