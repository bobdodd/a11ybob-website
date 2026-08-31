import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { AfdsSubNav } from "@/components/AfdsSubNav";

export const metadata: Metadata = {
  title: "Portable representations",
};

const URL_CEM =
  "https://custom-elements-manifest.open-wc.org/analyzer/" +
  "getting-started/";
const URL_DSD_LIST =
  "https://lists.w3.org/Archives/Public/public-designsystemdocs/";
const URL_FIGMA_VARS =
  "https://help.figma.com/hc/en-us/articles/" +
  "14506821864087-Overview-of-variables-collections-and-modes";
const URL_CODE_CONNECT =
  "https://help.figma.com/hc/en-us/articles/" +
  "23920389749655-Code-Connect";
const URL_TOKENS_STUDIO =
  "https://docs.tokens.studio/manage-settings/token-format";
const URL_PENPOT =
  "https://help.penpot.app/user-guide/design-systems/design-tokens/";
const URL_SKETCH_EXPORTER =
  "https://github.com/icona79/sketch-design-tokens-exporter";
const URL_SLDS =
  "https://developer.salesforce.com/docs/platform/lwc/guide/" +
  "create-components-css-design-tokens.html";
const URL_ZEROHEIGHT =
  "https://help.zeroheight.com/hc/en-us/articles/" +
  "35887016596123-Exporting-and-integrating-design-tokens-into" +
  "-developer-pipelines";
const URL_SUPERNOVA =
  "https://learn.supernova-docs.io/latest/code-integration/" +
  "guide-to-code-integration-n7UChYuk";

const LAYOUT = `design-system.manifest.json   Canonical artefact index
tokens/                       DTCG sources (.tokens.json), themes, aliases
components/                   Markdown specs, contracts, stories, tests
manifests/                    Generated Custom Elements Manifest output
patterns/                     Multi-component and page-level specifications
evidence/                     AT matrix, Reflow results, known limitations
adapters/                     CSS, Electron, Figma, Penpot, native targets
docs/                         Colophon, decisions, research`;

const CONTRACT = `{
  "id": "afds.component.dialog",
  "version": "0.1.0",
  "status": "draft",
  "semanticModel": {
    "role": "dialog",
    "modal": true,
    "accessibleName": {
      "source": "aria-labelledby",
      "target": "the visible dialog heading",
      "fallback": null
    },
    "requiredRelationships": [
      "aria-labelledby references the heading inside the dialog",
      "aria-describedby references the primary body text"
    ],
    "states": ["closed", "opening", "open", "closing"]
  },
  "keyboardContract": [
    {
      "key": "Escape",
      "when": "open",
      "behaviour": "Closes and returns focus to the invoking control"
    },
    {
      "key": "Tab",
      "when": "open",
      "behaviour": "Moves focus within the dialog only"
    }
  ],
  "focusLifecycle": {
    "onOpen": "First focusable element, or the container if none",
    "whileOpen": "Focus is confined to the dialog subtree",
    "onClose": "Focus returns to the element that invoked the dialog",
    "onInvokerRemoved": "A documented fallback container, announced"
  },
  "wcagMapping": [
    { "criterion": "2.1.2", "responsibility": "component" },
    { "criterion": "2.4.3", "responsibility": "component" },
    {
      "criterion": "1.4.10",
      "responsibility": "shared",
      "sharedWith": "layout primitives"
    }
  ],
  "assertions": [
    {
      "id": "dialog.role.exposed",
      "type": "static",
      "assert": "Computed role is dialog with aria-modal=true"
    },
    {
      "id": "dialog.reflow.320",
      "type": "layout",
      "assert": "Usable at 320 CSS pixels without 2D scrolling"
    }
  ],
  "nonGuarantees": [
    "Does not provide heading structure for its own content",
    "Does not guarantee that content inside it meets contrast"
  ],
  "uncertainty": [
    {
      "id": "dialog.name.announcement.variance",
      "description": "Name announcement on open varies by reader",
      "status": "open",
      "nextAction": "Extend the matrix to a third engine first"
    }
  ],
  "evidence": [
    {
      "assertion": "dialog.escape.closes",
      "engine": "screen reader X",
      "engineVersion": "0.0.0",
      "browser": "browser Y",
      "browserVersion": "0.0.0",
      "date": "2026-08-29",
      "fixture": "components/dialog/dialog.stories.ts#Modal",
      "observed": "Closed, focus returned to the invoking button",
      "result": "pass"
    }
  ]
}`;

export default function PortableRepresentations() {
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
            <h1>Portable representations</h1>
            <p className="lede">
              Before deciding how to carry a design system from one place
              to another, it is worth asking what the industry has
              already tried, and what none of it can yet say. My answer
              is that there is no single portable file format for a
              complete design system, that there probably should not be
              one, and that the honest alternative is a bundle of
              specialised artefacts joined by a manifest thin enough to
              be trustworthy.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Portability is not one problem</h2>
            <p>
              The phrase &ldquo;export the design system&rdquo; sounds
              like one request. It is at least five, and they are not
              the same kind of request, because they are not about the
              same kind of thing.
            </p>
            <p>
              A token value is a datum. A component contract is an
              assertion. A piece of test evidence is an observation with
              provenance. Those three are different grammatical
              categories before they are different file formats, and
              conflating them is the root of most of the failures in
              this area. A format designed to carry constants will carry
              constants well and will quietly mangle anything that
              claims something.
            </p>
            <p>
              The five kinds of fact also fail differently, and the
              asymmetry matters more than the count.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="Five kinds of fact"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Kind of fact</th>
                    <th scope="col">What kind of thing it is</th>
                    <th scope="col">What breaks when it fails to travel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Token values</th>
                    <td>
                      A datum. A platform-neutral constant with a name.
                    </td>
                    <td>
                      A visual mismatch, noticed in minutes by anyone
                      who looks at the screen.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Component metadata</th>
                    <td>
                      A description of a programmatic surface:
                      attributes, properties, events, slots, styling
                      hooks.
                    </td>
                    <td>
                      Tooling degrades and integrations guess. Noticed
                      in hours, by developers.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Implementation contracts</th>
                    <td>
                      An assertion. Role, accessible name, states,
                      keyboard model, focus lifecycle, response to user
                      preferences.
                    </td>
                    <td>
                      A silent accessibility regression. Noticed by
                      nobody until a disabled person is excluded.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Documentation and rationale</th>
                    <td>
                      An argument. Why this, what was rejected, what it
                      costs, what is still unresolved.
                    </td>
                    <td>
                      The next maintainer repeats a decision that was
                      already made and already paid for.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Test evidence</th>
                    <td>
                      An observation with provenance. What was seen, on
                      which browser and assistive technology, at which
                      versions, on which date.
                    </td>
                    <td>
                      A confident claim with no basis behind it, which
                      is worse than making no claim at all.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Read the third and fifth rows together and the design
              constraint for this project falls out. The facts that
              matter most to disabled users are the ones with the
              longest feedback loop and the least visible failure. A
              format that loses a colour is embarrassing. A format that
              loses a focus-return rule, or that carries an evidence
              record without the screen-reader version that produced it,
              does damage that will not surface for a year.
            </p>
            <p>
              That is why I am unwilling to accept a single format that
              handles tokens beautifully and treats everything else as a
              free-text description field. Each kind of fact needs a
              representation that can be validated on its own terms.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What already exists, and how mature it is</h2>
            <p>
              The landscape is much better than it was, and it is
              routinely described as more settled than it is. Stating
              standing accurately is not pedantry here. Overstated
              standing invites overconfidence about cross-tool fidelity,
              and cross-tool fidelity is exactly what an accessibility
              claim depends on when it moves between a design tool, a
              build pipeline and a test harness.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="Maturity of formats and groups"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Format or group</th>
                    <th scope="col">Standing</th>
                    <th scope="col">Role in this project</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      DTCG Design Tokens Format Module 2025.10
                    </th>
                    <td>
                      A Final Community Group Report whose own status
                      section says it is considered stable and that it
                      is not a W3C Standard nor on the W3C Standards
                      Track.
                    </td>
                    <td>
                      Adopted now as the canonical token format.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Custom Elements Manifest</th>
                    <td>
                      A community format with a maintained analyser and
                      a published schema. No standards-body standing,
                      and none is claimed.
                    </td>
                    <td>
                      Adopted if custom-element primitives ship.
                      Generated, never written by hand.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Storybook Component Story Format</th>
                    <td>
                      A de facto format, described by Storybook as an
                      open standard based on ES6 modules.
                    </td>
                    <td>
                      Executable fixtures only. Never semantic truth.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Open UI</th>
                    <td>
                      An active W3C Community Group producing
                      specifications, research and test suites.
                    </td>
                    <td>
                      Vocabulary source for parts and states. Not
                      depended on as a file format.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      UI Specification Schema Community Group
                    </th>
                    <td>
                      Closed on 21 May 2026, having published nothing
                      beyond its charter.
                    </td>
                    <td>
                      The charter is read as a requirements checklist.
                      Not a dependency.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Design System Documentation Community Group
                    </th>
                    <td>
                      Proposed on 29 July 2026. Chairs are listed. No
                      draft published.
                    </td>
                    <td>
                      The live alignment target. Contribute
                      requirements, do not wait to consume a format.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Style Dictionary</th>
                    <td>
                      A mature transformation layer with first-class
                      DTCG support since version 4, and incomplete
                      support for the newest module.
                    </td>
                    <td>
                      An adapter, never an authority.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Four of those seven are usable today, and none of the
              seven carries an accessibility contract. That gap is the
              whole reason this project has to write anything of its
              own.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Design tokens, and what they cannot say</h2>
            <p>
              The Design Tokens Community Group format module is the
              best-developed piece of this landscape and the easiest to
              adopt. Its scope statement is admirably narrow: it
              describes{" "}
              <em>
                the technical specification for a file format to
                exchange design tokens between different tools
              </em>
              . Token files are JSON. A token is an object with a{" "}
              <code>$value</code>; a group is an object without one.
            </p>
            <p>
              The module defines thirteen types, from{" "}
              <code>color</code> and <code>dimension</code> through{" "}
              <code>cubicBezier</code> and <code>strokeStyle</code> to
              the composite types <code>border</code>,{" "}
              <code>transition</code>, <code>shadow</code>,{" "}
              <code>gradient</code> and <code>typography</code>. Aliases
              use a curly-brace syntax that always resolves to the{" "}
              <code>$value</code> of the target token, and aliases may
              chain, so tools must follow each reference until they
              reach an explicit value. References must not be circular,
              and tools must detect and report circularity as an error.
              For anything finer than a whole token, the module makes
              JSON Pointer normative through a <code>$ref</code>{" "}
              property, which can address any location in the document,
              including a single component of a colour value.
            </p>
            <p>
              Two smaller provisions are worth naming because they are
              the ones a hurried team ignores. Tools{" "}
              <em>should not</em> use groups to infer the type or
              purpose of a token, which rules out the shortcut of
              encoding meaning in folder names. And{" "}
              <code>$deprecated</code> can be <code>true</code>, an
              explanatory string, or <code>false</code> to override a
              group default, with group deprecation extending to
              children. A token system without a documented retirement
              path becomes a system nobody dares change, so I intend to
              use that property from the first release rather than
              discovering it during a migration.
            </p>
            <p>
              On serialisation the module recommends the media type{" "}
              <code>application/design-tokens+json</code>, permits{" "}
              <code>application/json</code>, and requires tools to
              support both. It recommends the extensions{" "}
              <code>.tokens</code> and <code>.tokens.json</code>. I
              prefer <code>.tokens.json</code> for this project, for the
              reason the specification itself gives, that until the
              format is widely adopted the double extension is what
              makes the files open in a preferred JSON editor. I would
              add that it also keeps ordinary JSON validators usable
              without configuration.
            </p>
            <h3>What the format cannot express</h3>
            <p>
              None of the following can be said in a DTCG file, and none
              of them is a defect in the format. They are outside a
              scope that was deliberately drawn narrow.
            </p>
            <ul>
              <li>
                <strong>Semantics.</strong> Roles, accessible names,
                states and the relationships between elements.
              </li>
              <li>
                <strong>Behaviour.</strong> The keyboard model and the
                focus lifecycle.
              </li>
              <li>
                <strong>Adaptation.</strong> How something behaves under
                Reflow or in forced-colours mode.
              </li>
              <li>
                <strong>Obligation.</strong> Which success criteria a
                thing is responsible for, and which assertions settle
                that responsibility.
              </li>
              <li>
                <strong>Observation.</strong> Assistive-technology
                evidence, with its engine, versions and date.
              </li>
              <li>
                <strong>Honesty.</strong> Non-guarantees, and recorded
                uncertainty.
              </li>
            </ul>
            <p>
              Contrast is the sharpest case, because it looks like a
              token concern and is not one. A contrast requirement is a
              predicate over a pair of tokens evaluated against a
              threshold, and the format models tokens and references
              between tokens, not predicates over pairs of them. There
              is no way to write down that one foreground value is valid
              on one background value at seven to one. I made the same
              point from a different direction in{" "}
              <Link href="/adaptation/afds/why-a-design-system">
                why a design system
              </Link>
              , and it is the single most instructive limitation in this
              whole area, because it is the point where a value format
              is asked to hold an assertion and cannot.
            </p>
            <h3>The extensions trap</h3>
            <p>
              The obvious escape is <code>$extensions</code>, and the
              specification explains why it is the wrong one. It defines
              the property as an object where tools{" "}
              <em>
                may add proprietary, user-, team- or vendor-specific
                data to a design token
              </em>
              , requires that{" "}
              <em>
                tools that process design token files must preserve any
                extension data they do not themselves understand
              </em>
              , and then states the governing constraint outright:
            </p>
            <blockquote>
              <p>
                <em>
                  In order to maintain interoperability between tools
                  that support this format, teams and tools SHOULD
                  restrict their usage of extension data to optional
                  meta-data that is not crucial to understanding that
                  token&rsquo;s value.
                </em>
              </p>
            </blockquote>
            <p>
              The preservation rule is precisely what disqualifies
              extensions as a home for accessibility contracts. A
              conforming tool must carry unknown extension data through
              untouched, and is not required to understand it, act on
              it, validate it, or show it to anybody. A contract stored
              only there would round-trip perfectly and mean nothing.
              Silent, lossless, meaningless preservation is the worst
              available outcome for a safety-relevant assertion, because
              it produces a system that looks like it is working.
            </p>
            <p>
              So the rule for this project is that contracts, criterion
              mappings, evidence, non-guarantees and uncertainty are
              never stored only in <code>$extensions</code>. An
              extension may hold a pointer to the canonical record,
              since a pointer really is optional metadata that does not
              change what the token value means.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Manifests and stories</h2>
            <p>
              Two more formats are mature enough to adopt, and each is
              routinely asked to do a job it cannot do.
            </p>
            <h3>Custom Elements Manifest</h3>
            <p>
              The project describes the format as one that{" "}
              <em>describes custom elements</em>, so that{" "}
              <em>tooling and IDEs</em> can give rich information about
              the custom elements in a project. A manifest carries the
              public programmatic surface: attributes with names, types
              and defaults, slots, events, CSS custom properties and CSS
              parts, along with a <code>schemaVersion</code> that makes
              the file self-describing about the format it targets.
            </p>
            <p>
              Manifests are generated, not written. The analyser{" "}
              <em>
                will scan the source files in your project, and run them
                through the TypeScript compiler to gather information
                about your package
              </em>
              . That derivation is the most valuable governance property
              in the format, and it is worth being explicit about why: a
              manifest that disagrees with the code is a build failure
              rather than a documentation debate. Hand-authored API
              documentation drifts because drifting is free. Generated
              API documentation cannot drift without breaking a build.
            </p>
            <p>
              What a manifest does not carry is the behaviour behind the
              surface. It does not say which role the component exposes
              at runtime, how its accessible name is computed, what
              happens on <kbd>Escape</kbd>, where focus goes when it
              closes, which criteria it is responsible for, or what it
              deliberately does not guarantee. The analyser has a plugin
              system, so all of that could be attached, and I think
              attaching it would be a mistake. A project-specific plugin
              field is a private convention wearing the costume of an
              interoperable contract, and the costume is the dangerous
              part.
            </p>
            <h3>Component Story Format</h3>
            <p>
              Storybook calls CSF <em>the recommended way to write
              stories</em> and describes it as{" "}
              <em>
                an open standard based on ES6 modules that is portable
                beyond Storybook
              </em>
              . Named exports are story objects, args parameterise them,
              and play functions run scripted interactions when the
              story renders. For an accessibility project that is close
              to ideal as a source of fixtures: every documented state
              becomes something that can be rendered, driven and
              asserted against automatically.
            </p>
            <p>
              It is also the format I most often see mistaken for a
              specification, and the mistake is worth stating plainly. A
              story is code that produces a rendering. It can
              demonstrate that a state exists. It cannot assert why the
              state exists, which criterion it satisfies, what evidence
              supports the claim, or what is deliberately out of scope.
              Worse, a story renders an inaccessible state exactly as
              convincingly as an accessible one, because rendering
              successfully and being correct are unrelated properties.
            </p>
            <p>
              A design system whose specification is its stories has, in
              practice, no specification. It has a gallery.
            </p>
            <p>
              So CSF is adopted as the executable layer, with authority
              running from the component specification to the story and
              never back. Every state named in a specification should
              have a story, and stories are the natural place to hang
              composition tests that render a component inside a
              realistic page rather than in isolation, since that is
              where most of the failures I find actually live.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where the standards work is going</h2>
            <p>
              Three W3C Community Groups touch this space. One is
              active and useful, one is closed, and one has just
              started. Their combined state is the best argument I have
              for building something provisional now rather than
              waiting.
            </p>
            <h3>Open UI</h3>
            <p>
              Open UI states its purpose as allowing web developers{" "}
              <em>
                to style and extend built-in web UI components and
                controls
              </em>
              , which requires the group to{" "}
              <em>
                fully specify the component parts, states, and behaviors
                of the built-in controls, as well as necessary
                accessibility requirements
              </em>
              , and to provide test suites. It also states its
              expectation about design systems directly: it hopes to
              make reinvention unnecessary, but{" "}
              <em>
                for those who choose to do so, we expect that these
                design systems will benefit from Open UI&rsquo;s
                specifications and test suites
              </em>
              .
            </p>
            <p>
              What it produces is specifications, research and test
              suites about the anatomy of controls. What it does not
              produce is a file format in which a third-party design
              system can serialise its own components. It is a
              vocabulary and a body of analysis, not an interchange
              schema, and treating it as the latter would be a category
              error.
            </p>
            <p>
              I intend to use it as a naming authority. Where Open UI
              has named a part or a state, this project should use that
              name rather than invent a synonym, because shared naming
              is the cheapest interoperability available and costs
              nothing but restraint.
            </p>
            <h3>The group that closed</h3>
            <p>
              The UI Specification Schema Community Group set out to do
              almost exactly what the missing layer requires. Its
              charter says the group{" "}
              <em>
                will define a common, implementation-agnostic meta-model
                for specifying the design, layout, behaviour, and
                constraints of user interface elements
              </em>
              , expressed{" "}
              <em>
                in a precise, machine-readable format that can be
                validated and consumed by tools across web, mobile,
                desktop, and embedded platforms
              </em>
              . Its stated mission includes defining{" "}
              <em>
                the full set of possible specification fields (e.g.,
                geometry rules, responsive behaviours, content
                constraints, accessibility requirements)
              </em>
              , aligning vocabulary with Open UI and the Design Tokens
              Community Group, and producing a formal JSON Schema for
              validating per-instance specifications.
            </p>
            <p>
              That is, almost line for line, the layer that nothing else
              in this landscape provides.
            </p>
            <p>
              The group&rsquo;s own page records that it{" "}
              <em>was closed on 2026-05-21</em>, having been{" "}
              <em>originally proposed on 2025-08-11 by Vasilis Danias</em>.
              The obvious reading of a closure is that work was
              abandoned and left a vocabulary behind. That reading does
              not survive two checks. Its <code>public-uispec</code>{" "}
              mailing list holds zero messages. And searching the W3C
              Community Group reports index for the group returns
              nothing: no report, no draft, no schema.
            </p>
            <p>
              The page also still says{" "}
              <em>the group must now choose a chair</em>, which looks
              like corroboration and is not. The same sentence appears
              on the page of the newer group discussed below, whose
              listing does name chairs, so I cannot treat that sentence
              as evidence about whether a group ever organised itself.
              The empty mailing list and the empty reports index carry
              the argument on their own.
            </p>
            <p>
              The charter is therefore not the residue of abandoned
              work. It is the only thing that ever existed. That makes
              the practical consequence narrower than
              &ldquo;monitor for alignment&rdquo; would suggest: there
              is no schema to validate against, no field names to adopt,
              and no mapping table to produce. What survives is the
              charter&rsquo;s scope claim, that geometry rules,
              responsive behaviour, content constraints and
              accessibility requirements belong together in one
              machine-readable per-element specification. I take that as
              independent evidence that the gap I am filling is real and
              was recognised by somebody else at W3C.
            </p>
            <p>
              No successor has been announced. The closed-groups listing
              records the closure without naming a replacement, unlike
              other entries there which point readers to the group that
              took the work over. The nearest new activity is the
              Generative UI Community Group, proposed in January 2026,
              but its scope is the runtime synthesis of interfaces
              rather than a portable specification format for authored
              components. It is not a successor and I will not record it
              as one.
            </p>
            <h3>The group that has just started</h3>
            <p>
              The Design System Documentation Community Group addresses
              documentation rather than component semantics. Its mission
              is{" "}
              <em>
                to lower the burden of design system management by
                developing an open format for structuring design system
                documentation
              </em>
              , and it names the facets of openness it cares about:{" "}
              <em>
                compatibility with established standards like DTCG and
                CEM, portability, and providing value to both humans and
                agents
              </em>
              .
            </p>
            <p>
              An open documentation format designed from the outset to
              compose with DTCG and CEM is the third leg of the bundle
              this page argues for. The alignment is close enough that I
              would rather contribute requirements than wait.
            </p>
            <p>
              Its maturity is low, and reporting it accurately requires
              noting that two W3C pages currently disagree. The group
              listing names Ben Callahan and Afyia Smith as chairs. The
              community page for the same group still says{" "}
              <em>the group must now choose a chair</em>. I cannot
              reconcile those from outside, so I record both rather than
              choosing the more flattering one. What is not in doubt is
              that the group was proposed on 29 July 2026, that{" "}
              <code>public-designsystemdocs</code> holds a single
              message, and that no draft has been published.
            </p>
            <p>
              What this project has to offer that the charter does not
              yet mention is specific:
              assistive-technology evidence, explicit non-guarantees,
              and recorded uncertainty as first-class documentation
              fields rather than as prose.
            </p>
            <h3>Alignment targets, not dependencies</h3>
            <p>
              Neither of the two closely aligned groups supplies a
              schema this project could validate against today. One is
              closed having published nothing; the other has chairs, or
              possibly not, and no draft.
            </p>
            <p>
              So the posture is to design project-owned formats that are
              deliberately mappable onto those charters&rsquo;
              vocabularies, and to treat the charters as a requirements
              checklist while doing it. That keeps two futures open at
              once. If a standard emerges, I map onto it and retire the
              provisional format. If none emerges, I still have a
              validated, documented, portable format rather than a
              dependency on a group that stalled. The corollary is
              unglamorous and worth obeying: choose field names that
              resemble the charter vocabulary rather than names that are
              clever.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where portability stops in the products</h2>
            <p>
              Standards describe what could be exchanged. Products
              determine what actually is. I surveyed the tools a real
              design system will meet and asked each the same two
              questions: what does it represent portably, and where does
              the portability stop. The answers group into four failure
              modes and a small number of instructive good cases.
            </p>
            <h3>Portability behind a plan or a seat</h3>
            <p>
              Figma&rsquo;s variables are the closest thing that tool
              has to tokens. They are documented as{" "}
              <em>raw values</em> that{" "}
              <em>
                can change in value depending on the context of a design
              </em>
              , they support aliasing, which Figma says{" "}
              <em>
                gives you the ability to implement design tokens
              </em>
              , and they come in six types: colour, number, string,
              boolean, timing and easing.
            </p>
            <p>
              Portability stops in three documented places. The
              variables overview documents no file-based import or
              export format for variables at all. Programmatic access
              exists through the Variables REST API, but Figma states
              that{" "}
              <em>
                to use this API, you must have a Full seat in an
                Enterprise org; guests cannot use the API
              </em>
              . And the six variable types are not the thirteen DTCG
              types, so a Figma-to-DTCG mapping is a genuine
              transformation with judgement in it rather than a rename.
            </p>
            <p>
              Code Connect is the artefact I see over-claimed most
              often, and it deserves naming because the over-claiming
              is specifically dangerous. Figma describes it accurately
              as{" "}
              <em>
                a bridge between your codebase and Figma&rsquo;s Dev
                Mode, connecting components in your repositories
                directly to components in your design files
              </em>
              , so that Dev Mode shows real code from the design system
              instead of autogenerated snippets. Figma also documents
              that it is{" "}
              <em>available on the Organization and Enterprise plans</em>{" "}
              and{" "}
              <em>requires a Full or Dev seat</em>, and that once
              components are mapped,{" "}
              <em>
                this information is shared with the Figma MCP server
              </em>{" "}
              and included in the design context sent to AI agents.
            </p>
            <p>
              That is valuable and it is not a schema. Code Connect
              carries a mapping from a Figma component to a code
              snippet, with property mappings. It defines no
              vendor-neutral semantic model, expresses no keyboard
              contract and assigns no criterion responsibility. Treating
              it as the component contract would make an accessibility
              contract readable only inside a paid seat in one
              vendor&rsquo;s product, which is a governance decision
              disguised as a tooling choice.
            </p>
            <h3>Portability claimed, format unstated</h3>
            <p>
              Sketch records in its changelog that teams can{" "}
              <em>
                export Layer Styles and Text Styles as Design Tokens
              </em>{" "}
              from the web app, and download them or publish an
              always-up-to-date link. The changelog does not say which
              token format the export produces, so a project cannot
              assume conformance without testing the output.
              Third-party exporters for Sketch target other conventions
              entirely, including one that produces a file described as
              compatible with Amazon Style Dictionary.
            </p>
            <p>
              The general lesson is that{" "}
              <em>exports design tokens</em> is a claim about a feature,
              not a claim about a format. I have read the two as the
              same sentence myself, which is why I now test the output
              rather than the changelog.
            </p>
            <h3>Silent omission</h3>
            <p>
              Material Theme Builder documents export{" "}
              <em>
                to multiple formats: Android Views (XML), Jetpack
                Compose (Kotlin) and Design System Package (DSP)
              </em>
              , none of which is DTCG. More instructively, it documents
              an explicit loss: of the surface tonal colours it
              displays,{" "}
              <em>
                these surface tonal colors are not exported in the code
              </em>
              . Zeroheight, whose export{" "}
              <em>uses Style Dictionary</em> and which can{" "}
              <em>export your token set in the W3C format</em>,
              documents that{" "}
              <em>
                composite tokens are currently not supported when
                exporting to platform-specific formats
              </em>
              , which is a real loss for typography and shadow.
            </p>
            <p>
              Style Dictionary itself is where DTCG conformance is
              actually tested, since most of these products route
              through it. It has had{" "}
              <em>first-class support for the DTCG format</em> since
              version 4, and it also carries the caveat any project
              adopting the newest module must plan around:{" "}
              <em>
                the latest format 2025.10 does not have full support yet
                in Style Dictionary
              </em>
              . That single sentence is the practical reason a project
              must validate its own token files against the published
              module rather than treating a build tool&rsquo;s
              acceptance as evidence of conformance.
            </p>
            <h3>Rich import, undocumented export</h3>
            <p>
              Knapsack presents itself as a shared system of record,
              giving a team{" "}
              <em>one place to collaborate on design and code</em> where{" "}
              <em>
                designers, developers, product folks, writers, and
                accessibility specialists all work from the same
                playbook
              </em>
              , with import from Figma, Tokens Studio and Style
              Dictionary. Its documentation describes that import and
              display richly and does not document an export format for
              the aggregated model. Supernova offers to{" "}
              <em>
                export code for any platform that describes design
                system elements
              </em>
              , which is an outbound generation capability rather than a
              neutral re-importable schema, and its code-integration
              page does not enumerate the specific formats.
            </p>
            <p>
              A platform that is excellent at consuming everything and
              quiet about emitting anything is a good consumer and a
              poor canonical store. That is not a criticism of the
              products; it is a statement about which role they can
              safely be given.
            </p>
            <h3>The good cases, and what they show</h3>
            <p>
              Penpot has the strongest explicit standards commitment.
              Its documentation states that{" "}
              <em>
                Penpot Design Tokens adhere to the Design Tokens Format
                Module and its definitions
              </em>
              , that tokens{" "}
              <em>
                can be exported from Penpot or integrated into other
                tools directly, without conversion
              </em>
              , and it makes the portability argument in governance
              terms:{" "}
              <em>
                the knowledge gained from using Design Tokens in Penpot
                remains valuable, regardless of whether you continue
                using Penpot or a different tool or technology
              </em>
              . That is the right argument, made by a vendor about
              itself. Note only that Penpot&rsquo;s page still describes
              the format module as a draft, which was accurate for an
              earlier state and is now behind the published Final
              Community Group Report.
            </p>
            <p>
              Backlight is the most explicitly exit-friendly product in
              the survey. It states that it{" "}
              <em>
                promotes 100% standard web development technologies
              </em>{" "}
              and, unusually, that{" "}
              <em>
                you are free to eject your design system and continue
                outside of Backlight at any time
              </em>
              . Ejectability is a genuine architectural virtue and it is
              achieved in the obvious way, by using portable underlying
              formats rather than a proprietary model. That is the same
              strategy this page recommends, applied at the product
              level instead of the repository level.
            </p>
            <p>
              Three smaller lessons are worth carrying. Tokens Studio
              can emit DTCG, since{" "}
              <em>
                the plugin will convert your token JSON files to the
                format of your choice
              </em>
              , but its documentation states that{" "}
              <em>the default is legacy format</em>, so a project must
              choose DTCG actively rather than assume it. Adobe
              publishes Spectrum Design Data as{" "}
              <em>
                API documentation, design tokens, and registry
              </em>
              , including component API schemas and a registry of
              terminology for sizes, states and variants: it is still
              Adobe&rsquo;s schema for Adobe&rsquo;s system, but the
              registry idea is cheap to copy and prevents naming drift.
              And Salesforce documents a migration in which{" "}
              <em>
                SLDS 2 replaces design tokens with a system of CSS
                custom variables called global styling hooks
              </em>
              , with the older <code>--lwc-</code> reference syntax
              working in SLDS 1 but not SLDS 2, which is a lesson about
              deprecation discipline rather than about formats.
            </p>
            <h3>What follows from the survey</h3>
            <p>
              Every stopping point above is a reasonable product
              decision, and I am not arguing that any of them is a
              mistake on the vendor&rsquo;s own terms. Taken together,
              though, they mean that any fact stored only inside one of
              these products carries an availability risk, a licensing
              risk and a fidelity risk.
            </p>
            <p>
              For most design systems that is commercial inconvenience.
              For an accessibility-focused one it is a safety problem,
              because the facts at risk are the ones that determine
              whether disabled people are excluded. An accessible name
              computation, a focus-return rule, a forced-colours
              behaviour, a stated non-guarantee and an engine-qualified
              screen-reader observation are all assertions somebody will
              need to re-verify, cite or defend years later, quite
              possibly after the vendor relationship has ended.
            </p>
            <p>
              The test I apply to any proposed integration is therefore
              a single question. If the vendor&rsquo;s product were
              unavailable tomorrow, which facts would this project no
              longer be able to state or defend? If the answer includes
              any fact about accessibility, the integration is designed
              wrongly. How that test is enforced, and what every
              transformation is required to report about what it lost,
              is the subject of{" "}
              <Link href="/adaptation/afds/adapters">adapters</Link>.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why a bundle, and not a new standard</h2>
            <p>
              Given five kinds of fact, four usable formats, one missing
              layer and no standards body currently able to supply it,
              the design follows almost mechanically. Carry each kind of
              fact in the artefact best suited to it, and join them with
              a manifest whose only job is to say where authority lives.
            </p>
            <p>
              At repository level that is deliberately boring:
              directories of files under source control, each with one
              clear kind of authority.
            </p>
            <pre>
              <code>{LAYOUT}</code>
            </pre>
            <p>
              The responsibilities do not overlap, and the manifest is
              thin on purpose. It declares the system version, the DTCG
              version the token files target, the stable identifier of
              each approved component, and the path to each canonical
              artefact. It must not restate token values, contract text
              or evidence, because a manifest that duplicates content
              becomes a second source of truth and a second source of
              truth always drifts.
            </p>
            <p>
              The rest divides cleanly. Tokens hold canonical values as
              DTCG files, validated in continuous integration against
              the declared version. Component directories hold a
              human-readable Markdown specification beside a
              machine-readable contract, so that rationale is readable
              by people and obligations are checkable by machines,
              with neither restating the other. Generated manifests are
              build output under review. Patterns hold specifications
              that span components, because most of the accessibility
              failures I find are compositional and belong to no single
              component&rsquo;s file. Evidence holds engine-qualified
              observations, and known limitations and open uncertainty
              live there as records rather than as caveats buried in
              prose. How that directory tree is sealed into one
              verifiable file is the subject of{" "}
              <Link href="/adaptation/afds/the-package-format">
                the package format
              </Link>
              .
            </p>
            <p>
              I want to be clear about why this is not a new standard,
              because inventing a format is usually a confession. Four
              of the six artefact kinds already have maintained formats
              built by people with far more implementations behind them
              than I have. Writing a competing token format would be
              vanity. Exactly one layer is missing, the per-component
              accessibility contract, and that is the only place I write
              anything new. It is written
              to be mapped onto whatever emerges, and it is versioned
              and labelled as provisional so that retiring it is a
              planned event rather than an embarrassment.
            </p>
            <h3>What the missing layer looks like</h3>
            <p>
              The following is a trimmed draft of a component contract.
              It is not a schema proposal. Its only purpose is to test
              whether the required facts can be expressed at all, which
              is the question the rest of this page keeps answering in
              the negative for existing formats.
            </p>
            <pre>
              <code>{CONTRACT}</code>
            </pre>
            <p>
              It is worth reading as a set of deliberate choices rather
              than as a proposed vocabulary.
            </p>
            <ul>
              <li>
                <strong>A stable identifier and its own version.</strong>{" "}
                A contract can then be cited and diffed independently of
                the release that happens to contain it.
              </li>
              <li>
                <strong>Role separated from naming mechanism.</strong>{" "}
                &ldquo;Has an accessible name&rdquo; and &ldquo;gets its
                name from <code>aria-labelledby</code> pointing at the
                visible heading&rdquo; are different claims, and only
                the second one is testable.
              </li>
              <li>
                <strong>Keyboard behaviour as triples.</strong> Key,
                state and behaviour, rather than a paragraph, so that
                each row can generate a test.
              </li>
              <li>
                <strong>Focus lifecycle kept separate.</strong> Focus
                movement on open, during and on close is a different
                concern from key handling, and the awkward case, the
                invoker being removed while the dialog is open, needs
                somewhere to be stated.
              </li>
              <li>
                <strong>Criterion mapping that assigns
                responsibility.</strong> A criterion can be owned by the
                component, shared with tokens, adapters or layout
                primitives, or owned elsewhere. Recording which
                prevents the familiar situation in which every layer
                assumes another layer handled it.
              </li>
              <li>
                <strong>Assertions typed by what settles them.</strong>{" "}
                Static semantics, keyboard, or layout.
              </li>
              <li>
                <strong>Non-guarantees as a required field.</strong> An
                unstated non-guarantee is read as a guarantee by
                everybody downstream, so it cannot be optional.
              </li>
              <li>
                <strong>Uncertainty with a status and a next
                action.</strong> An open question is then tracked rather
                than forgotten.
              </li>
              <li>
                <strong>Evidence qualified and dated.</strong> Engine,
                versions, date, and the exact fixture used. The version
                numbers above are deliberately placeholders, because a
                fabricated version in an evidence record is worse than
                an empty one.
              </li>
            </ul>
            <p>
              An evidence record without an engine, a version and a date
              is not evidence. It is a rumour with formatting.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What was rejected, and why</h2>
            <p>
              Each row below is an arrangement I considered and declined,
              and most of them are arrangements I have seen in use. The
              third column is the reason, stated as a consequence rather
              than as a preference.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="Rejected arrangements"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Arrangement</th>
                    <th scope="col">What it looks like</th>
                    <th scope="col">What breaks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      The design tool as source of truth
                    </th>
                    <td>
                      The Figma library is the definitive statement of
                      the system, and code and docs are described as
                      reflections of it.
                    </td>
                    <td>
                      Semantics, rationale and evidence become
                      unreadable without a paid seat in one
                      vendor&rsquo;s product, and cannot be validated,
                      diffed or defended once the relationship ends.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Contracts in token extensions
                    </th>
                    <td>
                      Roles, keyboard behaviour or contrast assertions
                      stored under <code>$extensions</code> in token
                      files.
                    </td>
                    <td>
                      Conforming tools need only preserve extension
                      data, not understand or act on it, so the
                      contract round-trips perfectly and means nothing
                      to any consumer.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Stories as specifications</th>
                    <td>
                      The Storybook instance is the documentation, and a
                      state exists because a story renders it.
                    </td>
                    <td>
                      Nothing records why the state exists, which
                      criterion it satisfies or what is not guaranteed,
                      and an inaccessible state renders just as
                      convincingly as an accessible one.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">A flattened one-off export</th>
                    <td>
                      One hand-built file bundling resolved token
                      values, component lists and notes.
                    </td>
                    <td>
                      Aliases, deprecation, provenance and the
                      distinction between value, assertion and
                      observation are all lost, and the snapshot begins
                      drifting from its sources immediately.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Transformations that drop meaning quietly
                    </th>
                    <td>
                      A transform runs cleanly, emits no report, and
                      omits what it could not represent.
                    </td>
                    <td>
                      Losses are discovered by users rather than by
                      continuous integration, and the system claims
                      cross-platform parity it does not have.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Evidence in untracked spreadsheets
                    </th>
                    <td>
                      Screen-reader results in a shared sheet with no
                      engine versions, dates or fixture references.
                    </td>
                    <td>
                      Claims cannot be reproduced, regressions cannot
                      be detected, stale results get cited as current,
                      and the strongest evidence becomes the least
                      trustworthy artefact.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">A manifest that holds content</th>
                    <td>
                      The top-level manifest restates token values or
                      contract text for convenience.
                    </td>
                    <td>
                      Two sources of truth exist for one fact, they
                      diverge, and consumers cannot tell which is
                      authoritative.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Describing DTCG as a W3C standard
                    </th>
                    <td>
                      Documentation calls the token format a W3C
                      standard.
                    </td>
                    <td>
                      Overstated standing invites overconfidence in
                      cross-tool fidelity, when the format&rsquo;s own
                      status section says it is not on the W3C
                      Standards Track.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The last row is the one I am most likely to commit myself,
              and it is included for that reason. Every claim on this
              page about the standing of a format is checkable against
              the status section of the document itself, and I would
              rather be held to that than be generous about it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>References</h2>
            <ul>
              <li>
                Design Tokens Community Group.{" "}
                <em>Design Tokens Format Module, 2025.10</em>. The
                status, scope, types, alias and JSON Pointer rules,{" "}
                <code>$deprecated</code>, <code>$extensions</code>,
                media type and file extensions quoted above.{" "}
                <a href="https://www.designtokens.org/tr/2025.10/format/">
                  tr/2025.10/format
                </a>
              </li>
              <li>
                Open Web Components.{" "}
                <em>Custom Elements Manifest analyser</em>.{" "}
                <a href={URL_CEM}>
                  analyzer/getting-started
                </a>
              </li>
              <li>
                Storybook. <em>Component Story Format</em>.{" "}
                <a href="https://storybook.js.org/docs/api/csf/index">
                  docs/api/csf
                </a>
              </li>
              <li>
                Style Dictionary.{" "}
                <em>
                  Style Dictionary and the Design Tokens Community Group
                </em>
                . The source of the note that 2025.10 is not yet fully
                supported.{" "}
                <a href="https://styledictionary.com/info/dtcg/">
                  info/dtcg
                </a>
              </li>
              <li>
                Open UI. <em>Open UI Community Group</em>.{" "}
                <a href="https://open-ui.org/">open-ui.org</a> and{" "}
                <a href="https://www.w3.org/community/open-ui/">
                  community/open-ui
                </a>
              </li>
              <li>
                W3C.{" "}
                <em>UI Specification Schema Community Group</em>. The
                charter, the closure date and the outstanding
                chair sentence.{" "}
                <a href="https://www.w3.org/community/uispec/">
                  community/uispec
                </a>
                . The empty mailing list is at{" "}
                <a href="https://lists.w3.org/Archives/Public/public-uispec/">
                  public-uispec
                </a>
                , the reports index at{" "}
                <a href="https://www.w3.org/community/reports/">
                  community/reports
                </a>
                , and the closed-group listing at{" "}
                <a href="https://www.w3.org/groups/cg/?closed=1">
                  groups/cg
                </a>
                .
              </li>
              <li>
                W3C.{" "}
                <em>
                  Design System Documentation Community Group
                </em>
                . The mission and the proposal date are at{" "}
                <a href="https://www.w3.org/community/designsystemdocs/">
                  community/designsystemdocs
                </a>
                , the chairs are named at{" "}
                <a href="https://www.w3.org/groups/cg/designsystemdocs/">
                  groups/cg/designsystemdocs
                </a>
                , and the single message is at{" "}
                <a href={URL_DSD_LIST}>
                  public-designsystemdocs
                </a>
                .
              </li>
              <li>
                W3C. <em>Generative UI Community Group</em>. Recorded
                here only to note that it is not a successor group.{" "}
                <a href="https://www.w3.org/community/gen-ui/">
                  community/gen-ui
                </a>
              </li>
              <li>
                Figma.{" "}
                <em>
                  Overview of variables, collections, and modes
                </em>
                .{" "}
                <a href={URL_FIGMA_VARS}>
                  articles/14506821864087
                </a>
                . The seat requirement is documented at{" "}
                <a href="https://developers.figma.com/docs/rest-api/variables/">
                  rest-api/variables
                </a>
                .
              </li>
              <li>
                Figma. <em>Code Connect</em>. The bridge description,
                the plan and seat requirements, and the MCP behaviour.{" "}
                <a href={URL_CODE_CONNECT}>
                  articles/23920389749655
                </a>
              </li>
              <li>
                Tokens Studio. <em>Token format</em>. The source of the
                statement that the default is the legacy format.{" "}
                <a href={URL_TOKENS_STUDIO}>
                  manage-settings/token-format
                </a>
              </li>
              <li>
                Penpot. <em>Design tokens</em>.{" "}
                <a href={URL_PENPOT}>
                  design-systems/design-tokens
                </a>
              </li>
              <li>
                Sketch. <em>Design tokens</em>. The changelog entry that
                does not name a format.{" "}
                <a href="https://www.sketch.com/changelog/design-tokens/">
                  changelog/design-tokens
                </a>
                . A third-party exporter targeting Style Dictionary is
                at{" "}
                <a href={URL_SKETCH_EXPORTER}>
                  sketch-design-tokens-exporter
                </a>
                .
              </li>
              <li>
                Google.{" "}
                <em>Introducing Material Theme Builder</em>. The export
                formats and the unexported surface tonal colours.{" "}
                <a href="https://m3.material.io/blog/material-theme-builder">
                  blog/material-theme-builder
                </a>
              </li>
              <li>
                Salesforce. <em>Design tokens in Lightning web
                components</em>. The SLDS 1 to SLDS 2 migration.{" "}
                <a href={URL_SLDS}>
                  create-components-css-design-tokens
                </a>
              </li>
              <li>
                Adobe. <em>Spectrum Design Data</em>.{" "}
                <a href="https://opensource.adobe.com/spectrum-design-data/">
                  spectrum-design-data
                </a>
              </li>
              <li>
                Zeroheight.{" "}
                <em>
                  Exporting and integrating design tokens into developer
                  pipelines
                </em>
                . The composite-token limitation.{" "}
                <a href={URL_ZEROHEIGHT}>
                  articles/35887016596123
                </a>
              </li>
              <li>
                Knapsack. <em>Documentation</em>.{" "}
                <a href="https://docs.knapsack.cloud/">
                  docs.knapsack.cloud
                </a>
              </li>
              <li>
                Supernova. <em>Guide to code integration</em>.{" "}
                <a href={URL_SUPERNOVA}>
                  guide-to-code-integration
                </a>
              </li>
              <li>
                Backlight. <em>Features</em>. The ejectability claim.{" "}
                <a href="https://backlight.dev/features">
                  backlight.dev/features
                </a>
              </li>
              <li>
                The research note behind this page, with the full
                product survey and the untrimmed contract draft, is{" "}
                <code>research/PORTABLE-REPRESENTATIONS.md</code> in the{" "}
                <a href="https://github.com/bobdodd/accessible-by-design">
                  accessible-by-design
                </a>{" "}
                repository. The group statuses were last checked on 31
                August 2026.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
