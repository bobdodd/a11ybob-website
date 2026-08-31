import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { AfdsSubNav } from "@/components/AfdsSubNav";

export const metadata: Metadata = {
  title: "Adapters",
};

const URL_CSS_VALUES = "https://www.w3.org/TR/css-values-4/";
const URL_COLOR_ADJUST = "https://www.w3.org/TR/css-color-adjust-1/";
const URL_FORCED_COLORS =
  "https://developer.mozilla.org/en-US/docs/Web/CSS/" +
  "@media/forced-colors";
const URL_WCAG = "https://www.w3.org/TR/WCAG22/";
const URL_REPO = "https://github.com/bobdodd/accessible-by-design";

const TREE = `adapters/
  css-custom-properties/
    adapter.json             declaration, direction export
    report.json              transform report
    out/
      tokens.css             role adapter
  figma/
    adapter-import.json      declaration, direction import
    report-import.json       import report, role adapter`;

const EXPORT_DECL = `{
  "id": "css-custom-properties",
  "direction": "export",
  "target": "css-custom-properties",
  "adapterVersion": "1.0.0",
  "declaration": "adapters/css-custom-properties/adapter.json",
  "report": "adapters/css-custom-properties/report.json",
  "inputs": ["tokens/core.tokens.json"],
  "outputs": ["adapters/css-custom-properties/out/tokens.css"]
}`;

const IMPORT_DECL = `{
  "id": "figma-variables-import",
  "direction": "import",
  "target": "figma",
  "adapterVersion": "0.3.0",
  "declaration": "adapters/figma/adapter-import.json",
  "report": "adapters/figma/report-import.json",
  "inputs": ["figma:file/2fQ8xKq1"],
  "outputs": [],
  "promoted": ["tokens/core.tokens.json"]
}`;

const IMPORT_REPORT = `{
  "adapterId": "figma-variables-import",
  "adapterVersion": "0.3.0",
  "direction": "import",
  "target": "figma",
  "runDate": "2026-08-31",
  "validationStatus": "failed",
  "mappings": [
    {
      "source": "figma:variable/colour.surface.default",
      "sourceKind": "colour",
      "targetName": "colour.surface.default",
      "fidelity": "exact"
    },
    {
      "source": "figma:variable/space.inset.medium",
      "sourceKind": "dimension",
      "targetName": "space.s0",
      "fidelity": "approximate"
    }
  ],
  "warnings": [
    {
      "source": "figma:variable/space.inset.medium",
      "severity": "warning",
      "statement": "A fixed pixel measure mapped to a rem token.",
      "consumerAction": "Check it against the assumed root size."
    }
  ],
  "gaps": [
    {
      "source": "component/stack",
      "severity": "error",
      "statement": "No keyboard contract, focus order or evidence.",
      "consumerAction": "Author the contract. Record uncertainty."
    }
  ],
  "unmapped": [
    {
      "source": "figma:effect/drop-shadow-card",
      "severity": "info",
      "statement": "A drop shadow. No AFDS token type for it yet.",
      "consumerAction": "None. A visual choice this format omits."
    }
  ]
}`;

export default function Adapters() {
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
            <h1>Adapters</h1>
            <p className="lede">
              A package that never meets a real toolchain is a
              document rather than a design system. Adapters are
              where the format meets tools that were never built for
              it, and they are the place I watch most closely,
              because a transform is the easiest place in the whole
              system to lose an accessibility fact without anybody
              noticing.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What an adapter does</h2>
            <p>
              An adapter moves information between the canonical
              artefacts of a package and the representation some
              external tool or platform uses. It has a direction. An
              export adapter reads canonical artefacts and writes
              what a target expects. An import adapter reads a
              target&rsquo;s representation and drafts the artefacts
              a package requires.
            </p>
            <p>
              The two directions are not mirror images, and the
              difference between them is the whole reason this page
              needs to be long. An export adapter knows the complete
              set of facts it is allowed to state, because it reads
              the artefacts that own them. Its only problem is what
              the target refuses to accept. An import adapter has
              the opposite problem. The representation it reads was
              never obliged to carry an accessibility contract at
              all, so most of what a component contract needs is
              simply not present to be read.
            </p>
            <p>
              I should record that I argued the wrong way about this.
              When I planned this page I proposed defining export
              only, on the reasoning that an export discards
              information and an import cannot restore it. That
              conclusion does not follow from its premise, because
              restoring the discarded facts is not what an import is
              for. It was also already contradicted by my own
              research note, whose governance rule says the rule
              cuts in both directions and requires an inbound
              adapter reading design-tool variables to write into
              the token directory through a reviewed change. I had
              read that note and still managed to narrow the
              position when I wrote the specification clause.
            </p>
            <p>
              The practical case for import is simpler than the
              theoretical one. No established design system began in
              this format. An adopter arrives holding a design-tool
              library, a token file, a component library and a
              considerable amount of knowledge that was never
              written down, and the question that decides whether
              adoption happens is what it costs to get from there to
              a conforming package. A format that only exports
              answers that question badly, because it can be adopted
              only by a system that started in it.
            </p>
            <p>
              There is a further argument that I find more
              persuasive than either. Refusing to define import does
              not stop anybody importing. It moves the work into
              hand transcription and single-use scripts, whose
              output lands in a package with nothing recording which
              facts were read and which were guessed. Everywhere
              else in this system I argue that declared absence
              beats silence, and an undefined import path is the
              silent case.
            </p>
            <p>
              A real package gives each target its own directory
              under <code>adapters/</code>.
            </p>
            <div className="scroll-region" tabIndex={0}>
              <pre>
                <code>{TREE}</code>
              </pre>
            </div>
            <p>
              An import target has no <code>out/</code> directory,
              because its drafts are not package artefacts. One
              looseness is visible in that tree and I have not
              settled it: the format fixes a directory per target
              but says nothing about filenames, so a target used in
              both directions needs names a producer invents. The
              names above are mine and nothing enforces them. The
              same applies to the way an import names its external
              source later on this page: the format asks for an
              identifier and leaves the form to the producer, so the
              one in that example is a shape I chose rather than a
              scheme anybody publishes.
            </p>
            <p>
              Each adapter is declared in the manifest, so a
              consumer can enumerate what a package contains without
              walking the archive.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="Adapter declaration fields"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Field</th>
                    <th scope="col">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <code>id</code>
                    </th>
                    <td>Unique within the package.</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>direction</code>
                    </th>
                    <td>
                      Either export or import, and exactly one of
                      them.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>target</code>
                    </th>
                    <td>The external tool or platform.</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>adapterVersion</code>
                    </th>
                    <td>
                      Semantic version of the adapter that ran.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>declaration</code>
                    </th>
                    <td>
                      Path to the adapter&rsquo;s own declaration
                      file.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>report</code>
                    </th>
                    <td>Path to the transform report.</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>inputs</code>
                    </th>
                    <td>
                      For export, paths of the canonical artefacts
                      consumed. For import, identifiers of the
                      external sources read, which are not package
                      paths.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>outputs</code>
                    </th>
                    <td>
                      For export, paths of the generated artefacts.
                      For import, an empty array, because import
                      output is not a package artefact.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>promoted</code>
                    </th>
                    <td>
                      Import only. Paths of the canonical artefacts
                      a person promoted from this import.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              A target supported in both directions is declared as
              two adapters sharing a target value, because the two
              carry different obligations and produce different
              reports. One object describing both would leave a
              consumer unable to tell which obligations had been
              met.
            </p>
            <div className="scroll-region" tabIndex={0}>
              <pre>
                <code>{EXPORT_DECL}</code>
              </pre>
            </div>
            <div className="scroll-region" tabIndex={0}>
              <pre>
                <code>{IMPORT_DECL}</code>
              </pre>
            </div>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>No adapter is canonical</h2>
            <p>
              An adapter output must never be the only source of a
              fact owned by a canonical artefact. The rule follows
              from what ownership means rather than from a general
              suspicion of tools.
            </p>
            <p>
              A token value is owned by the token file. A
              component&rsquo;s semantic model, keyboard contract,
              Reflow behaviour, mapping to success criteria, stated
              non-guarantees and recorded uncertainty are owned by
              its{" "}
              <Link href="/adaptation/afds/what-a-component-declares">
                component contract
              </Link>
              . An observation of assistive-technology behaviour is
              owned by an{" "}
              <Link href="/adaptation/afds/evidence-and-uncertainty">
                evidence record
              </Link>
              . If a fact exists only in a design-tool library, a
              generated stylesheet or a platform resource bundle,
              the fact has left the bundle, and at that point the
              package no longer carries the accessibility contract.
            </p>
            <p>
              On the previous page I ended with a test I apply to
              any proposed integration: if the vendor&rsquo;s
              product were unavailable tomorrow, which facts would
              this project no longer be able to state or defend?
              This is where that test stops being rhetorical. Two
              consequences of the rule are mechanically checkable.
            </p>
            <p>
              The first is that any export output must be
              regenerable from the canonical artefacts alone. If
              regeneration loses a fact, the fact was only in the
              generated file, and the package does not conform. The
              second is that a consumer may discard every derived
              and adapter entry and still hold a complete design
              system. A verifier can approximate the second by
              confirming that no canonical artefact names an adapter
              path as its source.
            </p>
            <p>
              There is one exception to the regeneration rule and I
              would rather state it plainly than let a reader
              discover the inconsistency. An import report cannot be
              regenerated from canonical artefacts, because an
              import reads a source that lies outside the package by
              definition. The alternative to the exception is
              discarding the provenance of every imported artefact,
              which is worse than an irregularity in an otherwise
              uniform rule. So the exception is written into both
              the roles clause and the adapters clause, where a
              reader of either will meet it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reporting rather than flattening</h2>
            <p>
              An adapter in either direction must report its
              mappings and warnings, and must report whatever it
              could not carry. It must not silently flatten
              meaning.
            </p>
            <p>
              Silent flattening is more dangerous than outright
              failure, because a flattened output looks complete. A
              transform that fails is a problem somebody fixes that
              afternoon. A transform that quietly substitutes an
              approximation produces a file that passes review, gets
              shipped, and is discovered by a user. Three examples
              carry the argument, and each one is a different kind
              of loss.
            </p>
            <p>
              The first is a measure expressed in <code>ch</code>{" "}
              units. The CSS specification defines the unit as the
              advance measure of a particular glyph, and admits its
              own imprecision in the same breath:
            </p>
            <blockquote>
              <p>
                <em>
                  Represents the typical advance measure of European
                  alphanumeric characters, and measured as the used
                  advance measure of the &ldquo;0&rdquo; (ZERO,
                  U+0030) glyph in the font used to render it.
                </em>
              </p>
            </blockquote>
            <p>
              And where that measure cannot be obtained, the
              specification says it &ldquo;must be assumed to be
              0.5em wide by 1em tall&rdquo;. A unit defined by glyph
              advance in whatever font is actually rendering has no
              native constant to become. An adapter that emits a
              fixed number has not converted the value, it has
              authored a new one, and the design system now contains
              a measurement nobody decided.
            </p>
            <p>
              The second is a boundary that has to survive forced
              colours. The specification describes the mode as one
              where the user agent &ldquo;enforces the
              user&rsquo;s preferred color palette on the page,
              overriding the author&rsquo;s chosen colors for
              specific properties&rdquo;, and both that document and
              the MDN reference list <code>border-color</code> and{" "}
              <code>outline-color</code> among the properties whose
              values are forced.
            </p>
            <p>
              The technique I use follows from that list rather than
              from either document, and I want to be exact about
              whose idea it is: neither source recommends it. If a
              boundary is declared with a transparent border, then a
              forced palette repaints that border in a system
              colour, and a component whose edge was carried by a
              background fill keeps a visible edge in a mode that
              discarded the fill. That matters because Success
              Criterion 1.4.11, at Level AA, requires a contrast
              ratio of at least 3:1 against adjacent colours for
              &ldquo;visual information required to identify user
              interface components and states&rdquo;.
            </p>
            <p>
              Now consider what an adapter can do with that. The
              declaration is not a colour, it is a bet on a
              behaviour that a user setting triggers. No design tool
              I know of models a user-forced palette at all, so
              there is nothing in the target for the declaration to
              map onto. The honest output is a recorded finding
              saying the target has no concept of this. A number is
              not an approximation of it.
            </p>
            <p>
              The third is a keyboard contract, and it is the
              cleanest case of the three. A token pipeline has no
              representation for a keyboard contract whatsoever.
              There is no lossy version, no approximation and no
              degraded form. The report records it as unsupported,
              which is a different statement from a loss, and the
              distinction is worth keeping: a loss says the target
              could not accept something, and unsupported says the
              target has no concept of it.
            </p>
            <p>
              The report is where all of this becomes checkable
              rather than merely encouraged. These fields are
              required in both directions.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="Transform report fields"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Field</th>
                    <th scope="col">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <code>adapterId</code>
                    </th>
                    <td>The adapter that produced the report.</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>adapterVersion</code>
                    </th>
                    <td>Version of that adapter.</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>direction</code>
                    </th>
                    <td>
                      Export or import, matching the declaration.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>target</code>
                    </th>
                    <td>The external tool or platform.</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>runDate</code>
                    </th>
                    <td>Date of the run.</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>validationStatus</code>
                    </th>
                    <td>
                      Passed, passed with warnings, or failed.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>mappings</code>
                    </th>
                    <td>One record per fact carried across.</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>warnings</code>
                    </th>
                    <td>Facts carried across with a caveat.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Each direction then adds two arrays of its own, and
              they face opposite ways.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="Direction-specific report arrays"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Array</th>
                    <th scope="col">Direction</th>
                    <th scope="col">Records</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <code>losses</code>
                    </th>
                    <td>Export</td>
                    <td>
                      Facts the target could not accept.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>unsupported</code>
                    </th>
                    <td>Export</td>
                    <td>
                      Source features the target has no concept of.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>gaps</code>
                    </th>
                    <td>Import</td>
                    <td>
                      Facts an artefact requires and the source
                      could not supply.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>unmapped</code>
                    </th>
                    <td>Import</td>
                    <td>
                      Source content this format has no
                      representation for.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              A mapping record names the source, its kind, the
              target name and a fidelity of exact, approximate or
              partial. A finding record names the source, a severity
              of information, warning or error, a statement, and the
              action a consumer must take about it. That last field
              is the one I would defend hardest, because a finding
              without a required action is a note somebody scrolls
              past.
            </p>
            <p>
              Every array is required even when empty, and the
              reason is precise. An empty losses array is a positive
              claim that nothing was lost, which a reviewer can
              challenge. An omitted losses field is merely silence.
              The same reasoning bites harder on the import side: an
              empty gaps array claims the source supplied every fact
              an artefact requires, which is a very strong claim and
              will rarely be a true one.
            </p>
            <p>
              An export report containing a loss or unsupported
              entry at error severity must report failed. An import
              report containing a gap at error severity must also
              report failed, and this is the part I expect to be
              argued with, so here is the reasoning. A failed import
              is not a malfunction. For most targets it is the
              expected result. What it states is that the source
              cannot yield a conforming artefact without human
              authorship, which is precisely the number an adopter
              needs before deciding what the work will cost. A
              format that reported success there would be
              flattering rather than useful.
            </p>
            <p>
              Here is an import report that fails honestly.
            </p>
            <div className="scroll-region" tabIndex={0}>
              <pre>
                <code>{IMPORT_REPORT}</code>
              </pre>
            </div>
            <p>
              Two things in that report are worth reading closely.
              The dimension mapping is marked approximate rather
              than exact and carries a warning, because a fixed
              pixel measure and a token declared in rem are not the
              same claim. And the shadow effect appears under
              unmapped at information severity with no action
              required, because a decorative effect this format does
              not carry is not a defect in either system. Not every
              finding is a fault.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What an import may not do</h2>
            <p>
              An import produces a draft, and a draft is not a
              contract.
            </p>
            <p>
              A draft becomes canonical only when a person reads it,
              supplies what the source could not, and accepts
              responsibility for the accessibility claims the
              artefact then makes. The format calls that promotion,
              and it deliberately cannot be automated. A canonical
              artefact asserts something that somebody has to be
              willing to defend when a user, an auditor or a
              regulator challenges it, and a transform cannot accept
              that responsibility. Promotion is the point where a
              person does.
            </p>
            <p>
              Three rules follow, and each one closes a way of
              cheating.
            </p>
            <p>
              An unpromoted draft must never ship inside a
              conforming package. Once a draft is in a package it is
              indistinguishable from a contract to whoever relies on
              it, and the moment that matters is always the moment
              somebody relies on it rather than the moment it was
              written.
            </p>
            <p>
              Every gap the import recorded must appear in the
              promoted artefact as an uncertainty record or as a
              declared non-guarantee. An import that could not
              discover a component&rsquo;s keyboard behaviour has
              not thereby excused the package from stating that the
              keyboard behaviour is unknown. The uncertainty record
              exists for exactly this, and an import is the
              situation that generates the most of them.
            </p>
            <p>
              An import must be a discrete run that leaves a dated
              report, and must never be a live read-through
              dependency on an external tool. A read-through
              dependency quietly makes the tool the owner of
              whatever it supplies, which is the one thing the role
              system exists to prevent, and it leaves no report for
              a reviewer to examine. This rule is not mine either;
              it comes from the same governance paragraph in the
              research note that I had already failed to carry into
              the specification.
            </p>
            <p>
              What a package keeps from an import is the report,
              which is the provenance of everything promoted from
              it, and the <code>promoted</code> array in the
              declaration, which names the artefacts a person signed
              off. Together those two make the gap rule checkable: a
              reviewer can read the gaps, read the promoted
              artefacts, and ask whether each gap is accounted for.
            </p>
            <p>
              One thing here is undefined, and it is the weakest
              joint in the design as it stands. The package records
              that a promotion happened, but the promoted artefact
              says nothing about its own origin, so a reader of a
              canonical contract cannot tell which of its statements
              a transform drafted and which a person authored. That
              is now recorded among the{" "}
              <Link href="/adaptation/afds/open-questions">
                open questions
              </Link>
              , including the harder part of it: whether a reviewer
              name and date belong in a package that makes no other
              claim about identity.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Adapters in version 1.0.0</h2>
            <p>
              Version 1.0.0 ships no adapters. Not a partial set,
              and not one direction: none, for any target.
            </p>
            <p>
              What the version defines is the contract an adapter
              has to satisfy. Figma, Penpot, CSS custom properties,
              native platform resources and Electron shells are
              named in the project decisions as intended targets,
              and naming an intention is all that naming them does.
              The sample package makes the same statement in
              machine-readable form: its manifest declares an empty
              adapters array, which is a positive declaration that
              the package ships none, rather than an omitted field
              that would leave a consumer guessing.
            </p>
            <p>
              I think shipping none is the right state for a first
              version, and the reason is the order the work has to
              happen in. The thing that needs settling first is the
              report format, because the report is what makes every
              other rule on this page checkable. The project plan
              settles it by running one real design-tool variable
              import and one CSS custom property export, and
              confirming that every approximation and omission
              appears in the report. An adapter written before that
              exercise would encode whatever the report format
              happened to be that week.
            </p>
            <p>
              The honest cost of that position is that everything
              above is a contract I cannot yet support with a single
              transform run. The rules are argued from what the
              formats can and cannot express, not from a report I
              have read. I would rather say so here than let the
              specification&rsquo;s confident language imply
              otherwise.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Writing a new adapter</h2>
            <p>
              The order below is the order I would work in, and the
              first two steps are the ones most likely to be
              skipped.
            </p>
            <p>
              Verify the package before reading anything out of it.
              An adapter is a consumer, and{" "}
              <Link href="/adaptation/afds/the-package-format">
                verification
              </Link>{" "}
              comes before trust. An adapter that transforms an
              unverified package has published a transform of
              whatever it was handed.
            </p>
            <p>
              Decide the direction, and declare one. If the target
              needs both, that is two adapters with two reports.
            </p>
            <p>
              Write down what the target can actually hold, before
              mapping a single value. This is the step that decides
              whether the adapter is honest, because a mapping table
              built by working through the source artefacts will
              quietly find a home for everything. A list built by
              working through the target&rsquo;s own model will not,
              and the difference between the two lists is the report
              nobody wanted to write.
            </p>
            <p>
              Declare inputs and outputs, and for an import declare
              the promoted array even while it is empty.
            </p>
            <p>
              Emit the report with every array present, including
              the empty ones, and give every finding a consumer
              action that says what a person must do rather than
              what went wrong.
            </p>
            <p>
              Take the adapter or derived role, never canonical.
            </p>
            <p>
              For an export, prove regenerability rather than
              asserting it: delete the output directory, run the
              adapter again, and compare. If anything differs that
              is not a timestamp, something in the output was not
              coming from the canonical artefacts.
            </p>
            <p>
              For an import, stop at the draft. Handing a draft
              onward as though it were finished is the failure this
              whole page is arranged around.
            </p>
            <p>
              The test I would apply at the end is a single
              question. Could a reviewer who disagrees with the
              adapter challenge any specific claim in its report?
              If the report is too vague to argue with, it is not
              yet a report.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Round-tripping, and what is lost</h2>
            <p>
              An export followed by an import is not a round trip in
              any sense that returns what was sent.
            </p>
            <p>
              An export is a projection, and a projection discards.
              Running it backwards does not recover what it dropped,
              because the dropped information is not in the target
              to be read. A design system exported to a token
              pipeline and imported back is a design system with no
              keyboard contracts, no evidence and no non-guarantees,
              because a token pipeline never held any of those. The
              tokens will survive the trip nicely, which is exactly
              what makes the result dangerous: the part that
              survives is the part that is easy to look at.
            </p>
            <p>
              This is why promotion has to be a human act rather
              than a configuration option. A reverse adapter that
              presented its output as canonical would be doing
              something worse than losing information. It would be
              manufacturing an accessibility contract out of a
              stylesheet, and the resulting artefact would claim
              guarantees that nothing ever tested. That is the exact
              failure the format was built to prevent, arriving
              through the back door.
            </p>
            <p>
              So the value of a defined import path is not that it
              makes round-tripping work. It is that the returned
              system arrives saying what it lost, in a dated report,
              instead of arriving looking complete.
            </p>
            <p>
              There is a check I would like to run once two adapters
              for one target exist, and I mention it because it
              seems to me the strongest test available of whether
              either of them is telling the truth. Export a system
              to a target, import it back, and compare the
              export&rsquo;s loss list against the import&rsquo;s
              gap list. The two are describing the same boundary
              from opposite sides, so they ought to agree. Where
              they disagree, one of the two adapters is claiming
              something about the target that the other contradicts,
              and I would want to know which before trusting either
              report.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>References</h2>
            <ul>
              <li>
                W3C. <em>CSS Values and Units Module Level 4</em>.
                Quoted for the definition of the ch unit and for the
                0.5em fallback where the glyph measure cannot be
                obtained.{" "}
                <a href={URL_CSS_VALUES}>w3.org/TR/css-values-4/</a>
              </li>
              <li>
                W3C. <em>CSS Color Adjust Module Level 1</em>.
                Quoted for the description of forced colors mode and
                consulted for the list of properties whose colour
                values are force-adjusted.{" "}
                <a href={URL_COLOR_ADJUST}>
                  w3.org/TR/css-color-adjust-1/
                </a>
              </li>
              <li>
                MDN. <em>forced-colors</em>. Consulted for the list
                of properties treated as having no author-level
                value in forced colors mode, including border-color
                and outline-color.{" "}
                <a href={URL_FORCED_COLORS}>
                  MDN @media/forced-colors
                </a>
              </li>
              <li>
                W3C. <em>Web Content Accessibility Guidelines
                2.2</em>. Quoted for Success Criterion 1.4.11
                Non-text Contrast, at Level AA.{" "}
                <a href={URL_WCAG}>w3.org/TR/WCAG22/</a>
              </li>
              <li>
                Bob Dodd. <em>accessible-by-design</em>. The
                specification clause on adapters, the project
                decision recording both directions, and the research
                note whose governance rule requires the rule to cut
                both ways.{" "}
                <a href={URL_REPO}>accessible-by-design</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
