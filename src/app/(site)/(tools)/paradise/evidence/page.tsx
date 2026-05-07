import Link from "next/link";
import type { CSSProperties } from "react";
import { ParadiseSubNav } from "@/components/ParadiseSubNav";

export default function ParadiseEvidence() {
  return (
    <main id="main" className="site-main" data-zone="tools">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <ParadiseSubNav />
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Evidence</h1>
            <p className="lede">
              The numbers behind the technical claim, the methodology
              that produced them, and case studies of where Paradise
              gets results that single-file linters and rendered-DOM
              scanners miss. This page is also the place to be honest
              about where Paradise still falls short.
            </p>
            <p className="muted">
              <small>
                In progress. The corpus, the comparison harness, and
                the per-issue analysis are documented in the Paradise
                repo under <code>ANALYZER_AUDIT_REPORT.md</code>; this
                page is being written from there.
              </small>
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The 88% number</h2>
            <p>
              On the test corpus, Paradise reports 88% fewer false
              positives than the combination of axe and
              eslint-plugin-jsx-a11y running over the same code. The
              corpus is a curated set of HTML / JavaScript / CSS
              triples drawn from real production codebases (with
              permission), each annotated with ground-truth
              accessibility issues by experienced practitioners.
            </p>
            <p>
              False positives are the issues that <em>none</em> of the
              practitioners flagged but at least one tool reported.
              Those are the warnings that train developers to ignore
              accessibility tooling — every false positive is a
              user-trust cost. The reduction matters because it&rsquo;s
              the gap between &ldquo;tool you act on&rdquo; and
              &ldquo;tool you skim past&rdquo;.
            </p>
            <p>
              The number is honest about scope. It is computed against
              <em> source-detectable</em> issues — things that can be
              identified without running the application. Runtime-only
              concerns (focus order during dynamic content load,
              ARIA-live announcements, third-party widgets injected at
              interaction time) are not in the corpus. For those,
              runtime tools are the right answer; see{" "}
              <Link href="/paradise/lineage">Lineage</Link> for the
              autoA11y / Paradise complementarity.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Methodology</h2>
            <p>
              The evaluation pipeline:
            </p>
            <ul>
              <li>
                <strong>Corpus.</strong> A curated set of HTML / JS /
                CSS triples, each between 200 and 5,000 lines total,
                drawn from real production codebases with permission.
                Diverse in framework choice (vanilla, React, Vue,
                Svelte, Angular).
              </li>
              <li>
                <strong>Ground truth.</strong> Each triple is annotated
                by two independent accessibility practitioners; their
                annotations are reconciled into a single ground-truth
                set of issues. Inter-rater agreement is reported in
                the audit document.
              </li>
              <li>
                <strong>Tools under test.</strong> axe (rendered-DOM),
                eslint-plugin-jsx-a11y (AST-pattern), and Paradise.
                Each tool is run against each triple in its native
                idiom (axe via Puppeteer; eslint via ESLint; Paradise
                via its Node API).
              </li>
              <li>
                <strong>Counting.</strong> True positives are
                ground-truth issues each tool reported. False
                positives are issues a tool reported that
                weren&rsquo;t in ground truth. False negatives are
                ground-truth issues no tool reported.
              </li>
            </ul>
            <p>
              The 88% headline is the <em>aggregate false-positive
              rate</em> across the corpus. Per-corpus breakdowns and
              per-issue-type breakdowns live in the audit report.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Case studies</h2>
            <p className="muted">
              <small>
                Three or four worked case studies will land here once
                the cleaned-up corpus is published. For now, the
                worked example on{" "}
                <Link href="/paradise/architecture">Architecture</Link>{" "}
                shows the canonical &ldquo;cross-file split&rdquo; case
                — a click handler in <code>handlers.js</code>, a
                CSS rule in <code>styles.css</code>, an HTML element in{" "}
                <code>index.html</code> — that single-file tools
                cannot reason about.
              </small>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where Paradise still misses</h2>
            <p>
              Honest framing: the source-level approach has structural
              limits. Paradise will not see:
            </p>
            <ul>
              <li>
                <strong>Runtime-only content.</strong> Third-party
                widgets injected into iframes, dynamic modules whose
                source isn&rsquo;t present at scan time, content
                streamed from a server in response to user
                interaction.
              </li>
              <li>
                <strong>Real focus order during animation.</strong>{" "}
                Paradise reasons about declared focus behaviour;
                animations and transitions can change the ordering in
                ways that only a runtime tool can observe.
              </li>
              <li>
                <strong>Live-region announcements.</strong> Paradise
                can detect that a live region exists; it can&rsquo;t
                evaluate whether the announcement timing and content
                are appropriate for the user.
              </li>
              <li>
                <strong>Visual-design regressions.</strong> Contrast
                ratios in dynamically-themed UIs, focus-indicator
                visibility against arbitrary backgrounds — Paradise
                checks the rules; rendering tools check the result.
              </li>
            </ul>
            <p>
              Each of these is a runtime tool&rsquo;s strength. The
              honest accessibility practice uses both: source-level
              analysis catches what authors can fix in source, runtime
              analysis catches what only manifests when the
              application runs. The integration model with autoA11y
              (Paradise&rsquo;s runtime complement; full history on{" "}
              <Link href="/paradise/lineage">Lineage</Link>) is
              described in the Paradise repo&rsquo;s{" "}
              <code>AUTO_A11Y_INTEGRATION_PLAN.md</code>.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/paradise/architecture">Architecture</Link>{" "}
                — the multi-model approach the evidence rests on.
              </li>
              <li>
                <Link href="/paradise/analysers">Analysers</Link> —
                the fourteen analysers each contributing to the
                aggregate number.
              </li>
              <li>
                <Link href="/paradise/lineage">Lineage</Link> — the
                autoA11y relationship.
              </li>
              <li>
                <Link href="/paradise">Back to Paradise</Link>.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
