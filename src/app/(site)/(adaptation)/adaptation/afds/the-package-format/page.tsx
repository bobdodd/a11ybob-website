import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { AfdsSubNav } from "@/components/AfdsSubNav";

export const metadata: Metadata = {
  title: "The package format",
};

const URL_ZIP_IANA =
  "https://www.iana.org/assignments/media-types/application/zip";
const URL_FIPS =
  "https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf";
const URL_ECMA_376 =
  "https://ecma-international.org/publications-and-standards/" +
  "standards/ecma-376/";
const URL_ECMA_PAPER =
  "https://ecma-international.org/wp-content/uploads/" +
  "OpenXML-White-Paper.pdf";
const URL_ECMA_388 =
  "https://www.ecma-international.org/wp-content/uploads/" +
  "ECMA-388_1st_edition_june_2009.pdf";
const URL_REPO = "https://github.com/bobdodd/accessible-by-design";

const TREE = `example.afds
  afds-manifest.json    REQUIRED  identifies and describes the package
  afds-inventory.json   REQUIRED  one digest record per other entry
  LICENSES.md           OPTIONAL  the text of both licences
  tokens/                         DTCG canonical token sources
  components/                     contracts and specifications
  patterns/                       multi-component specifications
  manifests/                      Custom Elements Manifest output
  evidence/                       AT records, Reflow, limitations
  adapters/                       declarations, outputs, reports
  docs/                           human-readable documentation
  schemas/                        JSON Schema for the artefacts
  stories/                        Component Story Format stories`;

const MANIFEST = `{
  "afdsFormat": "afds-package",
  "afdsVersion": "1.0.0",
  "packageId": "com.a11ybob.abd.afds-sample",
  "packageVersion": "1.0.0",
  "title": "AFDS Sample",
  "created": "2026-08-29",
  "conformanceProfile": "afds-components",
  "licences": {
    "code": "GPL-3.0-only",
    "documentation": "CC-BY-SA-4.0"
  },
  "publisher": {
    "name": "Bob Dodd",
    "project": "Accessible by Design",
    "uri": "https://a11ybob.com/"
  },
  "tokens": {
    "dtcgVersion": "2025.10",
    "canonicalSources": [
      {
        "id": "core",
        "path": "tokens/core.tokens.json",
        "role": "canonical"
      }
    ]
  },
  "adapters": [],
  "stories": []
}`;

const INVENTORY = `{
  "afdsFormat": "afds-inventory",
  "afdsVersion": "1.0.0",
  "packageId": "com.a11ybob.abd.afds-sample",
  "packageVersion": "1.0.0",
  "digestAlgorithm": "SHA-256",
  "digestEncoding": "lowercase-hex",
  "excludesSelf": true,
  "entryCount": 9,
  "records": [
    {
      "path": "afds-manifest.json",
      "mediaType": "application/json",
      "byteLength": 2767,
      "role": "canonical",
      "sha256": "b480866e44ae0d66 ... 654d38475cf51748"
    },
    {
      "path": "tokens/core.tokens.json",
      "mediaType": "application/json",
      "byteLength": 3055,
      "role": "canonical",
      "sha256": "b45bb732e28f4c3f ... 753b29dc68c7a29b"
    }
  ]
}`;

export default function ThePackageFormat() {
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
            <h1>The package format</h1>
            <p className="lede">
              A design system that cannot be carried from one toolchain
              to another is not portable, and a design system whose
              accessibility claims cannot be checked on arrival is not
              trustworthy. Version 1.0.0 defines a single file that
              answers both: one ZIP container, two known files at its
              root, and a digest for every byte it carries.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The container, and what identifies it</h2>
            <p>
              A package is a ZIP archive with the extension{" "}
              <code>.afds</code>. Nothing about that is clever, and
              that is the point. A ZIP reader is one of the few things
              I can rely on already being present wherever a package
              needs to be opened, so a format built on one adds no
              dependency to the person receiving it.
            </p>
            <p>
              The container rules exist because ZIP syntax permits a
              great deal that a portable interchange format should not.
              The specification therefore constrains it.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="Container rules"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Rule</th>
                    <th scope="col">Requirement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Root files</th>
                    <td>
                      <code>afds-manifest.json</code> and{" "}
                      <code>afds-inventory.json</code> MUST both exist
                      at the archive root.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">No wrapper directory</th>
                    <td>
                      A single enclosing top-level directory MUST NOT
                      wrap the contents, so a consumer knows where the
                      root is without guessing.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Paths</th>
                    <td>
                      Normalised relative paths using{" "}
                      <code>/</code> as the separator. No absolute
                      paths, no <code>..</code> or <code>.</code>{" "}
                      segments, no drive letter, no UNC prefix.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Encoding</th>
                    <td>
                      Text entries are UTF-8 with no byte order mark.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Encryption</th>
                    <td>
                      No entry is encrypted. A portable interchange
                      file that cannot be opened is not interchange.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Directory entries</th>
                    <td>
                      Permitted, because many ZIP writers emit them,
                      but they carry no meaning and MUST NOT appear in
                      the inventory.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Then there is the identification problem. A package has
              the media type <code>application/zip</code>, because that
              is what it is and there is no registered type for AFDS.
              The IANA registration for <code>application/zip</code>{" "}
              is unusually candid about the limitation this creates. It
              says the type &ldquo;is not recommended for normal use,
              since Content-Type information for the files contained
              within the archive are not known.&rdquo;
            </p>
            <p>
              That sentence describes exactly the gap AFDS has to
              close. A ZIP media type tells a consumer that bytes are
              compressed and nothing at all about what they mean. So
              identification does not rest on the media type. A
              consumer identifies a package by finding a parseable{" "}
              <code>afds-manifest.json</code> at the archive root whose{" "}
              <code>afdsFormat</code> field is the exact string{" "}
              <code>afds-package</code>. The extension is a
              convenience for humans and file managers; the manifest is
              the actual test.
            </p>
            <p>
              A consumer MUST NOT rely on{" "}
              <code>application/afds+zip</code>. That type is not
              registered, and treating an unregistered type as though
              it were is how a format acquires an identity it has no
              right to claim. Whether to seek registration is recorded
              as an open question rather than assumed.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What the package holds</h2>
            <p>
              The hierarchy is declared rather than discovered. Nine
              directories are defined, all of them optional except as
              a declared conformance profile requires them, and a
              consumer knows what each one means before opening it.
            </p>
            <div className="scroll-region" tabIndex={0}>
              <pre>
                <code>{TREE}</code>
              </pre>
            </div>
            <p>
              What lives in each directory is described at length
              in{" "}
              <Link href="/adaptation/afds/portable-representations">
                portable representations
              </Link>
              , which is where the choice of DTCG for tokens, Custom
              Elements Manifest for component surfaces and Component
              Story Format for stories is argued. This page is about
              the envelope rather than the letter.
            </p>
            <p>
              One thing does need saying here, because it is easy to
              misread the tree above as a repository layout. It is
              not. The design-system repository is the original
              source, and a package is the finished work built from it.
              That is why the two do not share a root manifest name.
              The repository carries a{" "}
              <code>design-system.manifest.json</code> that indexes
              sources under active edit, and a package carries an{" "}
              <code>afds-manifest.json</code> that describes a built
              artefact sealed against a matching inventory. A file
              whose contents are still moving cannot be the same kind
              of object as one whose digests must hold.
            </p>
            <p>
              The two are deliberately different objects with
              different economics: a repository is good at
              line-by-line collaboration and bad at being handed to
              someone as one verifiable thing, and a package is the
              reverse. Whether the project should build tooling that
              lets a person edit a package directly, rather than
              unpacking it, editing, rebuilding the inventory and
              repacking, is unresolved and appears below among the
              open questions.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Roles, and the rule that keeps a package honest</h2>
            <p>
              Every inventoried entry declares exactly one role. There
              are six: <code>canonical</code>, <code>derived</code>,{" "}
              <code>adapter</code>, <code>evidence</code>,{" "}
              <code>documentation</code> and <code>schema</code>.
            </p>
            <p>
              Roles look like bookkeeping and are not. They exist to
              support one rule, which is the rule I think does more
              work than anything else in the format.
            </p>
            <blockquote>
              <p>
                <em>
                  A derived or adapter artefact MUST NOT be the only
                  source of a fact owned by a canonical artefact.
                </em>
              </p>
            </blockquote>
            <p>
              Two consequences follow. Every derived artefact MUST be
              regenerable from the canonical artefacts in the same
              package alone, with no access to anything outside it. And
              a consumer MAY discard every derived and adapter entry
              and still hold a complete design system.
            </p>
            <p>
              That second consequence is a test a person can actually
              run. Delete the generated CSS, the Figma output and every
              adapter product, then ask whether the remaining files
              still say what the buttons guarantee, which relationships
              are required and which assistive-technology combinations
              have been tested. If the answer is no, a fact has leaked
              into a derived artefact and the package is broken in a
              way no digest will catch.
            </p>
            <p>
              The failure this prevents is one I keep meeting in real
              systems: the only place a behaviour is written down is
              the generated output, or the design-tool file, or a
              comment in the adapter. When the generator changes, the
              fact is gone, and nobody notices because nothing declared
              it in the first place. Adapters, and the reasons no
              adapter is ever canonical, have{" "}
              <Link href="/adaptation/afds/adapters">
                their own page
              </Link>
              .
            </p>
            <p>
              A related rule governs prose. Documentation MUST NOT
              introduce a normative fact, and where documentation and a
              machine-readable contract disagree, the contract wins.
              This is not a slight against prose, which does the
              teaching. It is an answer to the question of what a
              reader should do when the two conflict, and answering it
              in advance is cheaper than arbitrating it later.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The manifest</h2>
            <p>
              The manifest identifies the package and declares what it
              contains. Its required fields cover format and version,{" "}
              <code>packageId</code> and <code>packageVersion</code>,
              title and description, creation date, the declared
              conformance profile, both licences, the publisher, the
              DTCG version and canonical token sources, and the
              adapters.
            </p>
            <div className="scroll-region" tabIndex={0}>
              <pre>
                <code>{MANIFEST}</code>
              </pre>
            </div>
            <p>
              The example is abridged from the sample package that
              ships in the project repository, alongside the full field
              table in the{" "}
              <Link href="/adaptation/afds/specification">
                specification
              </Link>
              . The component, pattern, evidence, schema and
              documentation declarations have the same shape as the
              token block and are omitted here for length.
            </p>
            <p>
              Notice <code>&quot;adapters&quot;: []</code> and{" "}
              <code>&quot;stories&quot;: []</code>. The empty array is
              required rather than optional, and that is a deliberate
              choice with a reason worth stating. An empty array is a
              positive declaration that the package ships no adapters
              and no stories. An omitted field is silence, and silence
              is ambiguous between &ldquo;none&rdquo; and
              &ldquo;forgot&rdquo;. A reviewer can challenge a claim.
              A reviewer cannot challenge an absence.
            </p>
            <p>
              The same reasoning runs through the format wherever a
              collection might be empty, and it is the same reasoning
              behind treating uncertainty as a record type rather than
              a gap, which is argued in{" "}
              <Link href="/adaptation/afds/evidence-and-uncertainty">
                evidence and uncertainty
              </Link>
              .
            </p>
            <p>
              Two licence fields appear rather than one because the
              project licenses code and documentation differently, and
              a single licence field would force one of the two to be
              wrong. Both carry SPDX identifiers so that a consumer can
              resolve them mechanically.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The inventory and its digests</h2>
            <p>
              The inventory holds exactly one record for every entry in
              the archive, except directory entries, which carry no
              meaning, and except itself. Each record gives the path,
              the media type, the exact uncompressed byte length, the
              role, and the SHA-256 digest of the entry&rsquo;s exact
              uncompressed bytes as lowercase hexadecimal.
            </p>
            <div className="scroll-region" tabIndex={0}>
              <pre>
                <code>{INVENTORY}</code>
              </pre>
            </div>
            <p>
              The digests above are elided in the middle for
              readability. In a real inventory a <code>sha256</code>{" "}
              value MUST be the full sixty-four lowercase hexadecimal
              characters, and a consumer MUST reject a truncated,
              uppercase or base-64 digest rather than trying to
              interpret it. Guessing at a digest format defeats the
              purpose of having one.
            </p>
            <p>
              The exclusion of the inventory from its own records is
              not an oversight, and the <code>excludesSelf</code> field
              exists so that a consumer can see it was intended. A
              self-record could never hold a correct digest: writing
              the digest into the file changes the file, which changes
              the digest. There is no fixed point to reach. So the
              inventory covers everything else and says so explicitly,
              rather than leaving a reader to wonder whether a record
              is missing.
            </p>
            <p>
              SHA-256 comes from the Secure Hash Standard, which
              specifies seven algorithms and states plainly what they
              are for: &ldquo;The digests are used to detect whether
              messages have been changed since the digests were
              generated.&rdquo; Detecting change is the whole of what
              the inventory does, and the section on integrity below is
              about the things it therefore cannot do.
            </p>
            <p>
              Records SHOULD be sorted by path in ascending byte order.
              That is purely a review convenience, and an honest one to
              admit as such: sorted records mean a rebuilt inventory
              produces a diff showing only genuine changes, instead of
              a reordering that hides them.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Verifying a package before trusting it</h2>
            <p>
              A conforming consumer verifies the inventory before
              relying on any package content. Before parsing a token
              file. Before reading a component contract. Before
              extracting anything to disk. The procedure has ten steps
              and their order matters.
            </p>
            <ol>
              <li>
                Open the file using ZIP syntax. If it is not a readable
                ZIP archive, report a container failure and stop.
              </li>
              <li>
                Check every entry path: normalised, relative, no{" "}
                <code>..</code> or <code>.</code> segment, no leading{" "}
                <code>/</code>, no drive letter or UNC prefix, and no
                single enclosing top-level directory. Report every
                violation and stop. Do not sanitise.
              </li>
              <li>
                Confirm no entry is encrypted, and apply the
                configured decompression limits. Report every
                violation and stop.
              </li>
              <li>
                Locate <code>afds-manifest.json</code> at the root,
                decode it as UTF-8, parse it, confirm{" "}
                <code>afdsFormat</code>, then read{" "}
                <code>afdsVersion</code> and apply the version rules.
              </li>
              <li>
                Locate <code>afds-inventory.json</code> at the root and
                confirm its format, digest algorithm, digest encoding
                and <code>excludesSelf</code> flag, and that its{" "}
                <code>packageId</code> and <code>packageVersion</code>{" "}
                match the manifest.
              </li>
              <li>
                Confirm completeness in both directions: every archive
                entry other than directories and the inventory itself
                has exactly one record, and every record names an
                entry that exists. Confirm{" "}
                <code>entryCount</code> matches. Report every
                unmatched name on both sides.
              </li>
              <li>Compare every byte length. Report every mismatch.</li>
              <li>
                Recompute every digest and compare it. Report every
                mismatch. If any digest fails, the consumer MUST NOT
                rely on any package content.
              </li>
              <li>
                Validate each canonical token source against the DTCG
                version the manifest declares. A consumer that cannot
                validate against the declared version MUST report that
                it did not validate, rather than passing the step
                silently.
              </li>
              <li>
                Emit one report: a pass or fail verdict, the count of
                entries checked, and every individual problem found.
              </li>
            </ol>
            <p>
              Two properties of that ordering are deliberate rather
              than incidental.
            </p>
            <p>
              Steps two and three run before anything is parsed or
              written, so a hostile archive is rejected before its
              content is touched. Steps six through nine gather every
              problem rather than stopping at the first, because a
              report that stops at the first defect makes a producer
              fix one thing per round trip, and a producer who has to
              rebuild eleven times to find eleven faults has every
              incentive to stop verifying at all.
            </p>
            <p>
              The last step carries a requirement that sounds obvious
              and which I have watched enough tools break to want it
              written down explicitly. A consumer MUST NOT report a
              pass when any step failed, and MUST distinguish
              &ldquo;checked and passed&rdquo; from &ldquo;not
              checked&rdquo;. A validator that reports silence as
              success is worse than no validator, because it
              manufactures confidence.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A package is untrusted input</h2>
            <p>
              A package arrives from somewhere else. That single fact
              determines how a consumer must treat it, and the two
              attacks it has to survive are both long-documented
              weaknesses of ZIP extraction rather than anything novel.
            </p>
            <p>
              The first is path traversal. ZIP syntax stores a path per
              entry and does nothing to stop that path being absolute
              or containing <code>..</code> segments, so an extractor
              that joins the entry path onto an output directory can be
              made to write outside it and overwrite arbitrary files.
              This is catalogued as CWE-22, &ldquo;Improper Limitation
              of a Pathname to a Restricted Directory&rdquo;, whose
              observed examples include a Go archive library that
              &ldquo;allows extraction of files to locations outside of
              the target folder&rdquo; through traversal sequences in
              zip filenames, &ldquo;aka Zip Slip&rdquo;. The IANA
              registration warns of it too, in its own security
              considerations: &ldquo;Extracting a zipfile could
              possible overwrite existing files.&rdquo;
            </p>
            <p>
              So a consumer MUST reject any entry whose path is
              absolute, contains a <code>..</code> or <code>.</code>{" "}
              segment, or is not normalised, and MUST do so before
              extracting anything. It MUST NOT rewrite an offending
              path into a safe one. Silent repair is tempting and
              wrong: it changes what the package says and hides the
              fact that something tried to escape.
            </p>
            <p>
              The second is data amplification. A small archive can
              expand to an enormous volume, and nesting archives
              multiplies it. CWE-409 names this &ldquo;Improper
              Handling of Highly Compressed Data (Data
              Amplification)&rdquo; and gives the canonical
              example: &ldquo;a small ZIP file that can
              produce a large amount of data when it is
              decompressed.&rdquo; A consumer MUST enforce configured
              limits and MUST fail rather than continue when one is
              reached.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="Suggested default limits"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Limit</th>
                    <th scope="col">Purpose</th>
                    <th scope="col">Suggested default</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Entry count</th>
                    <td>Bound records and file handles</td>
                    <td>5000 entries</td>
                  </tr>
                  <tr>
                    <th scope="row">Total compressed size</th>
                    <td>Bound the input read</td>
                    <td>32 MiB</td>
                  </tr>
                  <tr>
                    <th scope="row">Total uncompressed size</th>
                    <td>Bound memory and disk</td>
                    <td>256 MiB</td>
                  </tr>
                  <tr>
                    <th scope="row">Decompression ratio</th>
                    <td>Detect one compressible entry</td>
                    <td>200 to 1</td>
                  </tr>
                  <tr>
                    <th scope="row">Nesting depth</th>
                    <td>Bound recursion and nesting</td>
                    <td>16 path segments</td>
                  </tr>
                  <tr>
                    <th scope="row">Path length</th>
                    <td>Bound filesystem interaction</td>
                    <td>255 characters</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Those numbers are suggestions, not requirements, and the
              requirement attached to them matters more than the values
              do. A consumer MUST make its limits configurable and MUST
              report which limit was exceeded. The reason is practical:
              when a legitimately large package fails, the fix should
              be raising one named limit, not switching the checks off.
              A validator whose only failure message is that something
              was too big leaves a person no route forward except
              disabling it.
            </p>
            <p>
              One further ordering rule. A consumer SHOULD compute the
              uncompressed total from the archive&rsquo;s own metadata
              first and reject an over-large package before
              decompressing anything, then enforce the same limit again
              during decompression, because the declared metadata may
              lie.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Integrity is not authenticity</h2>
            <p>
              Inventory integrity is not a digital signature. I would
              rather state that in a heading than in a footnote,
              because I have watched a file full of SHA-256 digests be
              read as proof of where something came from, and it is
              nothing of the kind.
            </p>
            <p>
              What the digests do is genuinely useful. They detect that
              content changed between the moment the inventory was
              written and the moment it was verified, which catches
              truncated downloads, corrupted media, accidental edits
              and careless repackaging. Those are the failures that
              actually happen to files in transit, and catching them is
              worth the cost of the inventory on its own.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="What the inventory proves"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Property</th>
                    <th scope="col">Provided?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      Detects accidental or in-transit change
                    </th>
                    <td>Yes</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Detects change made after the inventory was
                      written
                    </th>
                    <td>Yes</td>
                  </tr>
                  <tr>
                    <th scope="row">Identifies who produced it</th>
                    <td>No</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Proves it came from the claimed publisher
                    </th>
                    <td>No</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Stops an attacker rewriting content and
                      rebuilding the inventory
                    </th>
                    <td>No</td>
                  </tr>
                  <tr>
                    <th scope="row">Establishes a chain of custody</th>
                    <td>No</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The reason for the four negatives is a single sentence.
              An attacker who can alter the content can also recompute
              the digests and rewrite the inventory. Nothing in the
              package binds it to a key, so nothing in it can be
              attributed to anyone. The <code>publisher</code> object
              in the manifest is a claim, not evidence, and a consumer
              MUST NOT present it as more than that.
            </p>
            <p>
              Until a signature mechanism exists, trust in a package
              MUST come from the channel it arrived on rather than from
              the package itself. What that mechanism should be is an
              open question below, and I would rather carry an
              acknowledged gap than a reassuring claim I cannot
              support.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Profiles are a floor, not a description</h2>
            <p>
              A profile lets a package say how complete it is, so that
              a consumer can reject a package lacking what it needs
              without inspecting the whole hierarchy. The manifest
              carries exactly one profile identifier.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="Conformance profiles"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Profile</th>
                    <th scope="col">Identifier</th>
                    <th scope="col">Requires</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Tokens only</th>
                    <td>
                      <code>afds-tokens</code>
                    </td>
                    <td>
                      Root manifest and inventory, and at least one
                      declared canonical token file.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Components</th>
                    <td>
                      <code>afds-components</code>
                    </td>
                    <td>
                      All of the above, plus at least one component
                      with both a machine-readable contract and a
                      human-readable specification.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Full</th>
                    <td>
                      <code>afds-full</code>
                    </td>
                    <td>
                      All of the above, plus canonical evidence
                      records, a known-limitations artefact, and a
                      declared test fixture for every component.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              A package MUST satisfy every requirement of the profile
              it declares, and MAY exceed it. The consequence of the
              second half is the part I expect to be argued with: a
              consumer MUST treat the declared profile as a floor
              rather than a description, and a consumer needing a
              higher profile MUST refuse the package even when
              inspection shows the extra artefacts are present. An
              undeclared artefact carries no commitment to still be
              there in the next version, so relying on one is relying
              on an accident.
            </p>
            <p>
              The <code>afds-full</code> profile requires evidence
              records but does not require that they contain results. A
              record whose result is <code>not-yet-tested</code>{" "}
              conforms. That is deliberate, and it is the design
              decision in this section I would defend hardest. Writing
              down an untested combination is the mechanism by which
              uncertainty becomes visible at all, and a profile that
              demanded results would create pressure to invent them.
              The choice is between a package that admits it has not
              tested Dragon with Chrome and a package that quietly
              claims it has.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Versioning</h2>
            <p>
              Two versions travel in every package and they move
              independently. <code>afdsVersion</code> is the version of
              the package format. <code>packageVersion</code> is the
              version of the design-system payload. Both use semantic
              versioning.
            </p>
            <p>
              Keeping them separate is what lets a design system
              publish a hundred payload releases against one stable
              format, and lets the format evolve without implying that
              every published system changed.
            </p>
            <p>
              For the format, adding an optional field, an optional
              directory or a new profile is minor. Adding a required
              field, removing a field, changing a type or changing the
              meaning of an existing field is major. Correcting prose
              without altering a requirement is a patch.
            </p>
            <p>
              What a consumer does when the format version is not the
              one it knows is specified rather than left to
              implementers, because that is where quiet
              incompatibilities breed.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="Consumer behaviour by version"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Situation</th>
                    <th scope="col">Required behaviour</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Major matches, minor known</th>
                    <td>Process normally.</td>
                  </tr>
                  <tr>
                    <th scope="row">Major matches, minor higher</th>
                    <td>
                      MUST process, MUST ignore unrecognised fields,
                      SHOULD report reading a newer minor version.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Major matches, minor lower</th>
                    <td>
                      MUST process, and MUST NOT require a field
                      introduced in a later minor version.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Major higher than supported</th>
                    <td>
                      MUST refuse, MUST report the unsupported
                      version, MUST NOT attempt a partial read.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Major lower than supported</th>
                    <td>
                      MAY refuse, or MAY process in a documented
                      compatibility mode. MUST state which it did.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Absent or unparseable</th>
                    <td>MUST treat the package as non-conforming.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The asymmetry between a higher and a lower major is the
              interesting row. A higher major may rely on semantics the
              consumer cannot know about, so guessing risks silently
              misreading an accessibility contract, which is the worst
              available outcome. A lower major is fully knowable, so a
              compatibility mode is safe provided it is declared.
            </p>
            <p>
              Payload versioning runs on the same logic applied to the
              design system rather than the format. Removing a
              component, removing a token, renaming an identifier or
              narrowing a guarantee is major. Adding a component, a
              token or evidence is minor. Correcting prose is a patch.
            </p>
            <p>
              One rule there does not follow from ordinary semantic
              versioning and is worth stating on its own. Withdrawing
              an assistive-technology guarantee is a major payload
              change even when nothing else moves, because a consumer
              may have relied on it. The mirror case is minor: adding
              an evidence record that turns a recorded uncertainty into
              a guarantee takes nothing away. Semantic versioning
              usually tracks the shape of an interface. Here it has to
              track what was promised about behaviour, and a promise
              can be withdrawn without a single identifier changing.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why not OPC</h2>
            <p>
              Open Packaging Conventions is the obvious prior art, and
              declining to use it needs an argument rather than a
              preference. It is a formal ZIP-based multi-part
              container, standardised as ECMA-376 Part 2, whose fifth
              edition is dated December 2021, and as ISO/IEC
              29500-2:2021. The ISO abstract describes it as defining
              &ldquo;a set of conventions for packaging one or more
              interrelated byte streams (parts) as a single resource
              (package)&rdquo;, and notes the conventions are
              applicable &ldquo;not only to Office Open XML
              specifications ... but also to other markup
              specifications&rdquo;. Office Open XML is built on it,
              and so is OpenXPS, whose own standard says its
              &ldquo;format requirements are an extension of the
              packaging requirements described in the Open Packaging
              Conventions (OPC) Standard.&rdquo;
            </p>
            <p>
              Its machinery is worth describing accurately, because the
              rejection is a rejection of specific mechanisms rather
              than of the idea. ECMA&rsquo;s own overview sets them out.
              Content types are declared in a{" "}
              <code>[Content_Types].xml</code> item, which
              &ldquo;allows a consumer to determine the content type of
              every part in the package&rdquo;. Relationships live in
              separate relationship parts, where &ldquo;the
              relationships part for the package as a whole is called
              /_rels/.rels&rdquo;. And discovery works by walking those
              relationships: &ldquo;to open a package, an application
              must parse the package-relationships part and follow the
              relationships of appropriate type.&rdquo;
            </p>
            <p>
              AFDS borrows the principle and rejects the machinery.
            </p>
            <div
              className="scroll-region"
              role="region"
              aria-label="OPC mechanisms and AFDS positions"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">OPC mechanism</th>
                    <th scope="col">Position</th>
                    <th scope="col">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      One logical object of related parts
                    </th>
                    <td>Adopted</td>
                    <td>
                      This is the principle worth keeping, and OPC
                      shows a ZIP archive is a sound basis for it.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">XML parts as the content model</th>
                    <td>Rejected</td>
                    <td>
                      AFDS content is JSON and Markdown centred.
                      Wrapping JSON in XML parts adds a representation
                      nobody needs.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>[Content_Types].xml</code>
                    </th>
                    <td>Rejected</td>
                    <td>
                      The inventory already carries a media type per
                      entry, in the same file that carries its digest.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <code>_rels</code> relationship parts
                    </th>
                    <td>Rejected</td>
                    <td>
                      The manifest already supplies the relationship
                      map, in one place, in the format the rest of the
                      package uses.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Part-naming grammar</th>
                    <td>Rejected</td>
                    <td>
                      Normalised relative ZIP paths are sufficient and
                      are what ordinary tools already show.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Discovery by relationships</th>
                    <td>Rejected</td>
                    <td>
                      A consumer reads two known root files.
                      Convention is simpler and easier to verify.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The cost of that rejection is real and I would rather
              state it than let a reader discover it. AFDS gains
              nothing from the existing body of OPC tooling, and a
              developer who already knows OPC has to learn a second
              set of conventions to no benefit. The judgement is that
              XML parts and a relationship model add complexity
              without improving a JSON and Markdown centred
              representation, and that a manifest a person can read in
              a text editor is worth more to this project than reuse
              of an XML relationship library. Someone building on a
              stack that already speaks OPC could reasonably weigh
              that differently.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What is still open</h2>
            <p>
              Four questions are unresolved, and recording them is
              better than settling them by assumption.
            </p>
            <p>
              <strong>Media-type registration.</strong> A dedicated
              registration such as <code>application/afds+zip</code>{" "}
              would give the format a stable identity in HTTP and in
              operating-system type databases. Whether a project draft
              should seek registration before its field names are
              stable is the question, and I lean towards waiting.
            </p>
            <p>
              <strong>Signing.</strong> A signature mechanism is needed
              before a package can be trusted on the strength of its
              own contents. Which format to adopt, what exactly is
              signed, where the signature lives given that the
              inventory cannot record itself, and how keys are
              distributed for a project with no registry are all open.
            </p>
            <p>
              <strong>Delta distribution.</strong> A package is a
              whole-file artefact, so correcting one component ships as
              a complete replacement. For a large system with frequent
              evidence updates that is wasteful and it obscures what
              actually changed. Whether to define a delta package, and
              how one would interact with inventory verification and
              versioning, is unresolved.
            </p>
            <p>
              <strong>Package-aware editing.</strong> Editing one
              artefact currently means unpacking, editing, rebuilding
              the inventory and repacking. Whether to build tooling
              that removes that friction, or to keep treating the
              repository as the working format and the package purely
              as a distribution artefact, is unresolved. These and the
              rest of the project&rsquo;s live questions are collected
              in{" "}
              <Link href="/adaptation/afds/open-questions">
                open questions
              </Link>
              .
            </p>
            <p>
              None of this is a standard. AFDS 1.0.0 is a project
              draft, on no standards track, and the package format is
              the part of it most likely to change if anyone else ever
              implements a consumer.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>References</h2>
            <ul>
              <li>
                IETF. <em>RFC 2119</em>. Best Current Practice 14. The
                requirement keywords used throughout, and the warning
                that such imperatives &ldquo;must be used with care and
                sparingly&rdquo;.{" "}
                <a href="https://www.rfc-editor.org/rfc/rfc2119">
                  rfc/rfc2119
                </a>
              </li>
              <li>
                IANA. <em>Media type application/zip</em>. The
                registration, its note that content types within an
                archive are not known, and its overwrite security
                consideration.{" "}
                <a href={URL_ZIP_IANA}>application/zip</a>
              </li>
              <li>
                NIST. <em>FIPS 180-4, Secure Hash Standard</em>. The
                seven algorithms specified, and the statement that
                digests detect change.{" "}
                <a href={URL_FIPS}>NIST.FIPS.180-4.pdf</a>
              </li>
              <li>
                MITRE. <em>CWE-22, Path Traversal</em>. The weakness
                description and the Zip Slip examples quoted above.{" "}
                <a href="https://cwe.mitre.org/data/definitions/22.html">
                  definitions/22
                </a>
              </li>
              <li>
                MITRE.{" "}
                <em>
                  CWE-409, Improper Handling of Highly Compressed Data
                  (Data Amplification)
                </em>
                . The decompression-bomb example quoted above.{" "}
                <a href="https://cwe.mitre.org/data/definitions/409.html">
                  definitions/409
                </a>
              </li>
              <li>
                Ecma International. <em>ECMA-376</em>. Part 2, Open
                Packaging Conventions, 5th edition, December 2021.{" "}
                <a href={URL_ECMA_376}>standards/ecma-376</a>
              </li>
              <li>
                Ecma International.{" "}
                <em>Office Open XML Overview</em>. The source of the
                quoted descriptions of parts,{" "}
                <code>[Content_Types].xml</code>, <code>_rels</code>{" "}
                and relationship-walking discovery.{" "}
                <a href={URL_ECMA_PAPER}>OpenXML-White-Paper.pdf</a>
              </li>
              <li>
                Ecma International.{" "}
                <em>ECMA-388, Open XML Paper Specification</em>. 1st
                edition, June 2009. The source of the quoted sentence
                on extending OPC packaging requirements.{" "}
                <a href={URL_ECMA_388}>ECMA-388_1st_edition.pdf</a>
              </li>
              <li>
                ISO. <em>ISO/IEC 29500-2:2021</em>. Edition 4, August
                2021. The abstract quoted above.{" "}
                <a href="https://www.iso.org/standard/77818.html">
                  standard/77818
                </a>
              </li>
              <li>
                Design Tokens Community Group.{" "}
                <em>Design Tokens Format Module, 2025.10</em>. The
                version declared by <code>tokens.dtcgVersion</code>.{" "}
                <a href="https://www.designtokens.org/tr/2025.10/format/">
                  tr/2025.10/format
                </a>
              </li>
              <li>
                Bob Dodd. <em>Accessible by Design</em>. The package
                format document, the sample package and its inventory
                builder.{" "}
                <a href={URL_REPO}>accessible-by-design</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
