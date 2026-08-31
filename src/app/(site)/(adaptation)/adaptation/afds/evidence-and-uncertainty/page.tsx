import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { AfdsSubNav } from "@/components/AfdsSubNav";

export const metadata: Metadata = {
  title: "Evidence and uncertainty",
};

export default function EvidenceAndUncertainty() {
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
            <h1>Evidence and uncertainty</h1>
            <p className="lede">
              A claim that a component works with screen readers, with
              no screen reader named, no engine, no version and no date,
              cannot be checked and cannot be wrong. What assistive
              technology actually does with a component is a matter of
              record. What is not yet known about it is a record of the
              same standing.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Evidence is a record, not a reassurance</h2>
            <p>
              The package format gives evidence standing rather than
              leaving it to a README. It is one of six artefact roles,
              defined as a record of observation: what was tested, on
              which engine and assistive technology, on what date, with
              what result. The accompanying ownership rule states that
              an observation of assistive-technology behaviour is owned
              by an evidence record.
            </p>
            <p>
              Ownership is the part that bites. A fact that lives only in
              a generated stylesheet, a design-tool library or a
              paragraph of prose has left the portable bundle, and the
              format treats that as non-conformance rather than as
              untidiness. So a sentence in a README claiming screen
              reader support is not a weaker form of evidence. Under the
              ownership rule it is not evidence at all, because prose
              carries the <code>documentation</code> role and a{" "}
              <code>documentation</code> artefact must not introduce a
              normative fact of its own.
            </p>
            <p>
              The specification is unusually direct about why it has to
              say so. Where prose and contract disagree, the contract
              wins and the prose is a defect to be corrected, and the
              reason given is that a reader naturally trusts the
              readable file over the machine-readable one, and in this
              format that instinct is wrong. That is worth stating
              plainly because it inverts a normal instinct about
              documentation.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What a record has to say</h2>
            <p>
              Each record in the sample matrix carries fifteen fields,
              and they fall into four groups. Identity is{" "}
              <code>id</code>, <code>componentId</code> and{" "}
              <code>claim</code>, so a record states which component and
              which specific behaviour it concerns rather than a general
              impression. The environment is <code>engine</code>,{" "}
              <code>engineVersion</code>, <code>browser</code>,{" "}
              <code>browserVersion</code>, <code>at</code>,{" "}
              <code>atVersion</code> and <code>platform</code>. The
              observation is <code>date</code>, <code>result</code>,{" "}
              <code>observation</code> and <code>tester</code>. The last
              field, <code>uncertaintyRef</code>, points back at the
              question the record was made to settle.
            </p>
            <p>
              Seven fields for the environment looks excessive until the
              records are read against each other. Two of the five
              describe NVDA and JAWS on identical ground: Blink, Chrome,
              Windows. They differ in one field, and that field can
              change the result. So a claim qualified only by browser
              says nothing about which screen reader was present, and a
              claim qualified only by screen reader says nothing about
              which engine built the tree it read. The two are
              independent axes, which is why neither can stand alone.
            </p>
            <p>
              The other records vary those axes together, because that
              is how the combinations occur in use. VoiceOver appears on
              WebKit, Safari and macOS. Orca appears on Gecko, Firefox
              and Linux. The fifth record has no assistive technology at
              all, carrying <code>none</code> in the <code>at</code>{" "}
              field, because its claim is that rem-anchored gaps grow
              with operating-system font scaling inside an Electron
              shell. That is a rendering question rather than an
              announcement question, and the record shape holds for
              both.
            </p>
            <p>
              The <code>tester</code> field deserves its place. An
              observation has an observer, and a result with no one
              attached to it is an assertion wearing the costume of a
              measurement.
            </p>
            <p>
              A result is one of five values, not a pass or a fail.
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="The five result values and what each one means"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Value</th>
                    <th scope="col">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <code>not-yet-tested</code>
                    </th>
                    <td>
                      No observation has been made. The claim it would
                      support is uncertainty, not a guarantee.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>supported</code>
                    </th>
                    <td>
                      The expected behaviour was observed on the stated
                      engine, browser and assistive-technology versions
                      on the stated date.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>partial</code>
                    </th>
                    <td>
                      The behaviour was observed but differs materially
                      from the expectation. The difference must be
                      described.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>unsupported</code>
                    </th>
                    <td>The expected behaviour was not observed.</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>not-applicable</code>
                    </th>
                    <td>
                      The combination cannot exhibit the behaviour, for
                      example because the platform has no such feature.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Two of those five carry most of the value.{" "}
              <code>partial</code> is the commonest real outcome of
              assistive-technology testing and the one a boolean has
              nowhere to put, which is why the vocabulary requires the
              difference to be described rather than merely flagged. And{" "}
              <code>not-applicable</code> is a different fact from{" "}
              <code>unsupported</code>. A behaviour that cannot occur on
              a platform is not a failure of that platform, and
              collapsing the two would manufacture defects and then
              invite somebody to fix them.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Absent evidence beats invented evidence</h2>
            <p>
              Every result in the sample package is{" "}
              <code>not-yet-tested</code>, as is every date, every
              observation and every tester. The version fields carry the
              same placeholder, with one exception that shows the
              vocabulary working as intended: the record with no
              assistive technology carries <code>not-applicable</code>{" "}
              for the assistive-technology version, because there is no
              version to state. No record in that file describes an
              observation that took place. The sample ships a fully
              formed matrix containing no findings whatsoever, and it
              says so in its own text.
            </p>
            <p>
              That is a deliberate choice rather than an unfinished
              corner, and the reasoning is the load-bearing idea on this
              page.
            </p>
            <blockquote>
              <p>
                <em>
                  Fabricated evidence is worse than absent evidence,
                  because absent evidence is visible as a gap while
                  fabricated evidence looks like a guarantee.
                </em>
              </p>
            </blockquote>
            <p>
              The same file states the principle behind publishing
              limitations at all, which is that a package showing only
              its guarantees is advocacy rather than documentation. Two
              prohibitions follow. A consumer must not treat a
              placeholder value as a test result. And a consumer must
              not infer support for a combination merely because the
              combination appears in the matrix.
            </p>
            <p>
              The second one is easy to miss and matters more. Listing
              NVDA, JAWS, VoiceOver and Orca could be read as a support
              claim by anyone skimming, when the list is a statement
              about which combinations were judged worth investigating.
              The matrix is a set of questions. Only the{" "}
              <code>result</code> field turns any of them into an
              answer.
            </p>
            <p>
              The package format backs this up at the point where it
              would be easiest to compromise. The full profile requires
              evidence records but does not require that they contain
              results, and a record whose result is{" "}
              <code>not-yet-tested</code> conforms. The specification
              gives the reason: recording an untested combination is the
              mechanism by which uncertainty becomes visible, and a
              profile that demanded results would create pressure to
              invent them.
            </p>
            <p>
              The cost of this is worth naming. The sample is useless as
              a support reference, and it will stay useless until
              somebody sits down with four screen readers on three
              operating systems. What it does instead is demonstrate the
              shape of the record and the discipline of the placeholder,
              and I would rather ship a package that is honestly empty
              than one that is plausibly furnished.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Uncertainty is a record type too</h2>
            <p>
              A caveats paragraph in a README has no status, no
              identifier and nothing that would resolve it. It is a
              gesture at humility. In the component contract, an
              uncertainty is a structured entry with an{" "}
              <code>id</code>, a <code>subject</code>, a{" "}
              <code>statement</code>, a <code>status</code> and an{" "}
              <code>evidenceRef</code>.
            </p>
            <p>
              The layout primitive in the sample carries two. The first
              records that whether any shipping screen reader announces
              or otherwise exposes the container element itself has not
              been tested. The second records that the behaviour of
              rem-anchored gaps under operating-system font scaling
              inside an Electron shell has not been tested. Both sit at
              status <code>not-yet-tested</code>, and both point at the
              matrix through <code>evidenceRef</code>.
            </p>
            <p>
              That pointer is the mechanism, and it is what separates an
              uncertainty record from an admission of ignorance. Each
              one names the observation that would settle it, and the
              matrix names the exact combinations under which the
              observation would be made. An uncertainty is therefore a
              work item with an address rather than a shrug, and the
              pairing runs both ways, since every record in the matrix
              carries <code>uncertaintyRef</code> back to the question
              it belongs to.
            </p>
            <p>
              The division of ownership is precise. Uncertainty is owned
              by the canonical component contract, alongside the
              semantic model, the keyboard contract, the Reflow
              behaviour, the WCAG mapping, the assertions and the
              non-guarantees. The observation is owned by the evidence
              record. The reference joins them without either one
              restating the other, which matters because a fact stated
              in two places is a fact that can disagree with itself.
            </p>
            <p>
              One rule gives all of this teeth. Under the project&rsquo;s
              rule, a claim whose supporting observation has not been
              made is uncertainty rather than a guarantee, and the
              vocabulary carries the rule inside the definition of{" "}
              <code>not-yet-tested</code> itself. The status of the
              evidence propagates to the status of the claim. That is a
              real constraint on what a package may say, because
              untested support cannot be described as a guarantee
              anywhere in the bundle while the matrix still reads{" "}
              <code>not-yet-tested</code>.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What is not settled about evidence itself</h2>
            <p>
              The section above argues that unknowns belong in the
              record. Applying that to the method itself, the evidence
              design has four gaps, and none of them is cosmetic.
            </p>
            <p>
              Ageing is visible, and partly governed, but staleness is
              not. Because a record states engine, browser and
              assistive-technology versions alongside a date, a reader
              can always see how old a result is and what it was scoped
              to, and a result observed on one screen reader version
              makes no claim about the next. The versioning rules do
              cover evidence changing: adding a record that turns
              uncertainty into a guarantee is a minor payload change,
              because nothing relied upon has been taken away, while
              withdrawing an assistive-technology guarantee is a major
              change even when nothing else moves. What the format does
              not say is when a result stops counting. Re-test cadence
              and stale-result marking are open questions, named in the
              research agenda item on the assistive-technology matrix
              and again in the item on a minimum matrix per component.
              So a five-year-old <code>supported</code> record and one
              from last week are formally indistinguishable, and only
              the date tells the reader anything.
            </p>
            <p>
              Coverage is undefined. Which engine, browser and screen
              reader pairs are mandatory has not been fixed, nor have
              the pass criteria. Set beside the profile rule above, the
              consequence is blunt. A package can declare the full
              profile, carry a matrix in which every single result is{" "}
              <code>not-yet-tested</code>, and conform. That is the
              right trade against invented results, and it also means
              the declared profile says nothing whatsoever about how
              well tested a package is.
            </p>
            <p>
              The propagation rule is not enforced. The verification
              algorithm checks digests and schema validation, and
              requires a consumer to distinguish &ldquo;checked and
              passed&rdquo; from &ldquo;not checked&rdquo;, but it does
              not compare a stated guarantee against the evidence behind
              it. Both values are machine-readable, so the check is
              available to be written. It is simply not yet part of what
              conformance means, which makes the rule a discipline on
              the author rather than a property of the format.
            </p>
            <p>
              The sample also falls short of what the research agenda
              already asks for. That item requires the matrix to include
              speech recognition, and Reflow environment details covering
              device, browser, starting viewport and zoom. The sample
              matrix has neither. Its five records cover four screen
              readers and one font-scaling question, with no speech
              recognition record and no viewport or zoom fields on the
              record shape at all. So the fifteen fields described above
              are not the finished shape, and a matrix meeting the
              agenda item in full would be wider than the one shipped.
            </p>
            <p>
              None of this is comfortable to publish on the page that
              argues for recorded uncertainty. It is also the only
              version of the page that practises what it describes.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>References</h2>
            <ul>
              <li>
                In the AFDS package format document, the artefact role
                definitions, the ownership rule and the status of
                documentation are clauses 6.1 to 6.3, the verification
                algorithm is clause 9, the profile rule on evidence
                without results is clause 12, and the payload-change
                rules for gaining and withdrawing evidence are clause
                13. The evidence and uncertainty records quoted here are{" "}
                <code>evidence/at-matrix.json</code>,{" "}
                <code>evidence/known-limitations.md</code> and the{" "}
                <code>uncertainty</code> block of{" "}
                <code>stack.spec.json</code> in the sample package. The
                result vocabulary is also tabulated in the AFDS user
                guide, which states the propagation rule as the
                project&rsquo;s rule. The open items are E1 and G3 in the
                research agenda. All are in{" "}
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
