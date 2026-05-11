import Link from "next/link";
import type { CSSProperties } from "react";

export default function LivedTesting() {
  return (
    <main id="main" className="site-main" data-zone="tools">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Lived-experience testing with audio-and-video AI</h1>
            <p className="lede">
              A production tool that turns lived-experience tester
              recordings into structured, WCAG-mapped accessibility
              reports. Audio-and-video analysis of real sessions
              &mdash; the territory commercial automated scanners
              do not reach. Described, not demoed: the production
              tool is CNIB-owned, and the home-developed predecessor
              is too close to it to be safely published as a
              separate open-source artefact yet.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Position</h2>
            <p>
              At CNIB Access Labs I lead development of{" "}
              <em>Dictaphone</em> (codenamed{" "}
              <code>pythonAudioA11y</code>), an audio-and-video
              accessibility analyser that takes MP4 recordings of
              lived-experience and audit sessions and produces
              structured, WCAG-mapped reports with time-indexed
              callouts linked to the source video. The tool has
              been in production at CNIB for over two years and
              has been presented at a11yTO. <em>Dictaphone is a
              CNIB product; the underlying intellectual approach
              is mine.</em> Practice, not portfolio.
            </p>
            <p>
              The tagline from the public deck:{" "}
              <em>
                AI-Powered Accessibility Analysis from Recordings
                &mdash; Transcription | Speaker Identification |
                WCAG Analysis | Integrated with Auto A11y.
              </em>{" "}
              Closing slide: <em>From Recording to Report.</em>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The five-stage pipeline</h2>
            <ol>
              <li>
                <strong>Video Input</strong> &mdash; MP4
                recordings from lived-experience or audit
                sessions.
              </li>
              <li>
                <strong>Audio Extraction</strong> &mdash; FFmpeg
                splits the audio at natural silence points (not
                fixed intervals). Roughly 10-minute segments
                preserve speaker context; 44.1 kHz quality is
                maintained throughout.
              </li>
              <li>
                <strong>Transcription</strong> &mdash; Deepgram
                Nova-2 with speaker diarisation and word-level
                timestamp precision.
              </li>
              <li>
                <strong>Speaker Identification</strong> &mdash;
                pyannote.audio voice embeddings plus ML
                clustering for consistent speaker identity
                across long recordings. Cross-segment speaker
                remapping is non-trivial audio ML; most
                accessibility tools don&rsquo;t touch this
                territory at all.
              </li>
              <li>
                <strong>AI Analysis</strong> &mdash; Claude with
                WCAG heuristics and context-aware prompts;
                extended-context support up to 1M tokens for
                long sessions; prompt caching for cost
                optimisation.
              </li>
            </ol>
            <p>
              The five-stage pipeline is publicly named in the
              CNIB Access Labs commercial deck; the description
              here uses that same vocabulary at the same
              abstraction level.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Three productised analysis contexts</h2>
            <p>
              Each recording can be analysed under one of three
              first-class contexts in the production tool:
            </p>
            <ul>
              <li>
                <strong>Audit</strong> &mdash; WCAG compliance
                focus, structured issue reporting with success-
                criteria mapping, designed for professional
                accessibility auditors.
              </li>
              <li>
                <strong>Lived Experience</strong> &mdash; user
                impact and pain points from the disabled-user
                perspective. Extracts user quotes, assertions,
                and key takeaways; designed for lived-experience
                testing programmes.
              </li>
              <li>
                <strong>NaviLens</strong> &mdash; wayfinding and
                QR navigation. Specialised detection of QR-code
                navigation issues; physical environment and
                signage accessibility; designed for indoor and
                outdoor navigation testing.
              </li>
            </ul>
            <p>
              The NaviLens context is the public-deck evidence
              that CNIB Access Labs has built specific tooling
              for QR-code navigation evaluation &mdash; not just
              observed the product from outside. That anchors
              the related Navilens framing on{" "}
              <Link href="/maps">/maps</Link> in actual
              productised evaluation capability.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Four-category structured output</h2>
            <p>
              Each recording produces four distinct kinds of
              evidence, kept separate rather than collapsed into
              a single &ldquo;findings&rdquo; bucket:
            </p>
            <ul>
              <li>
                <strong>Key Takeaways</strong> &mdash; analyst-
                narrative top-level findings.
              </li>
              <li>
                <strong>User Pain Points</strong> &mdash;
                discrete moments of friction with severity
                ratings.
              </li>
              <li>
                <strong>User Assertions</strong> &mdash; direct
                statements and observations from testers, with
                full quotes.
              </li>
              <li>
                <strong>Accessibility Issues</strong> &mdash;
                WCAG-mapped with remediation guidance and
                timecoded video references.
              </li>
            </ul>
            <p>
              The four-way split is its own design move. Most
              tools collapse <em>what to tell stakeholders</em>{" "}
              and <em>where the user struggled</em> and{" "}
              <em>what the user said</em> and{" "}
              <em>what is structurally wrong</em> into one
              undifferentiated stream. Keeping them apart makes
              the report usable as four different kinds of
              deliverable for four different audiences.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Per-issue fields, outputs, captions</h2>
            <p>
              Per issue: title, description, what, why, who, how-
              to-fix, WCAG 2.2 success-criterion mapping, impact
              (Low / Medium / High), and precise timecodes
              linking back into the source video. Built-in
              heuristics for screen reader, screen magnifier,
              keyboard navigation, and assistive-technology
              compatibility.
            </p>
            <p>
              Outputs: JSON (machine-consumable), HTML (human-
              review, bilingual), VTT captions, and{" "}
              <em>
                an optional enhanced video with callouts overlaid
                at precise moments and chapter markers
              </em>
              . Callouts are positioned with word-level timing for
              pixel-perfect sync; chapter markers are compatible
              with VLC, QuickTime, and web players. The companion
              video editor keeps editing non-destructive.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Bilingual-native</h2>
            <p>
              <em>
                The analysis is performed natively in each
                language &mdash; not machine-translated after
                the fact.
              </em>{" "}
              Three modes: English-only, French-only, or both in
              parallel (the default). Distinct per-language
              output files (
              <code>issues.fr.json</code>, <code>issues.fr.html</code>
              , etc.). Canadian-government-grade discipline at
              the data-model level, not as a post-hoc
              translation pass.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The capability gap this addresses</h2>
            <p>
              No commercial automated accessibility tool currently
              analyses recorded user behaviour against the screen
              being recorded. axe handles static HTML. Lighthouse
              handles runtime DOM. LLM scanners increasingly
              handle code and markup. None of them analyse the
              interaction between user and interface across time,
              with the user&rsquo;s own spoken commentary as
              evidence.
            </p>
            <p>
              That territory has been human-led usability
              research; bringing AI assistance to it has
              research-grade significance even at present-day
              tooling maturity. Dictaphone makes the analysis
              tractable at scale &mdash; the kind of audit that
              would take a human auditor a day per recording can
              be drafted by the tool in minutes, then reviewed
              and corrected by the auditor in considerably less
              than a day.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Important workflow note</h2>
            <p>
              <em>The output is always manually checked.</em>{" "}
              Humans take responsibility for conformance
              statements; machines do not. The automation
              accelerates the review process; it does not
              replace the reviewer. This is the right framing for
              AI-assisted accessibility audit work and is worth
              being explicit about whenever the tool is
              mentioned.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where this sits relative to the other tools</h2>
            <p>
              Dictaphone is integrated with{" "}
              <em>autoA11y</em> &mdash; CNIB&rsquo;s commercial
              accessibility-testing platform. The recordings
              dashboard, the WCAG Issues view filterable by
              level, and the lived-experience results all sit
              alongside automated and manual findings in a single
              unified report. Together the tools cover what the
              practice describes publicly as the{" "}
              <em>Three Pillars</em>: automated testing, manual
              inspection, lived experience.
            </p>
            <p>
              Dictaphone is the lived-experience pillar made
              tractable at scale. autoA11y is the automated
              pillar, productised. Manual inspection remains
              human-led. The three pillars run as one integrated
              audit pipeline rather than as three separate
              workstreams.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Research direction &mdash; the home-version Qwen PoC</h2>
            <p>
              A Bob-owned proof-of-concept using{" "}
              <strong>Qwen 3.5</strong> (Alibaba&rsquo;s
              open-weights vision-language model) is in
              development as a values-significant alternative to
              the Claude-based production stack &mdash; self-
              hostable, with no US-corporate API dependency. The
              choice is deliberate: the production stack
              acknowledges Claude as a flagged exception to the
              minimise-US-exposure trajectory the rest of the
              practice follows; the home-version research line
              commits to the non-US, self-hostable, open-weights
              alternative.
            </p>
            <p>
              Targeting two classes of issue: visual
              accessibility problems a sighted analyst would
              normally catch from watching, and user-interaction
              problems (hesitation, abandonment, target
              misidentification &mdash; the usability dimension
              of accessibility audits). License: GPL-3.0,
              matching the rest of the Bob-owned tooling.
            </p>
            <p>
              <em>
                Demonstrations of the Bob-owned home version
                will appear here when the home and production
                versions have diverged sufficiently to be safely
                separable.
              </em>{" "}
              The research direction is itself the path toward
              the <em>Canadian-sovereign alternative
              workflow</em> offered as a separate engagement at
              CNIB Access Labs.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/carnforth">Carnforth GPL</Link>{" "}
                &mdash; runtime DOM testing; the open-source
                companion to the Bob-owned tooling line.
              </li>
              <li>
                <Link href="/a11yauto">a11yAuto</Link> &mdash;
                AI-driven text-and-HTML testing PoCs.
              </li>
              <li>
                <Link href="/paradise">Paradise</Link> &mdash;
                source-level multi-model analysis.
              </li>
              <li>
                <Link href="/work">/work</Link> &mdash; the CNIB
                Access Labs framing for the production tooling.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
