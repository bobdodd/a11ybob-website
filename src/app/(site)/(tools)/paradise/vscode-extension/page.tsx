import Link from "next/link";
import type { CSSProperties } from "react";
import { ParadiseSubNav } from "@/components/ParadiseSubNav";

export default function ParadiseVSCodeExtension() {
  return (
    <main id="main" className="site-main">
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
            <h1>VS Code plugin</h1>
            <p className="lede">
              Paradise as a VS Code extension. Squigglies in the editor
              over the lines that need attention; hover details with
              the analyser&rsquo;s reasoning; project-wide problems
              panel. The plugin runs the same analyser engine as the
              Node API and the in-browser{" "}
              <Link href="/playgrounds/paradise">Playground</Link> — three
              surfaces, one analysis pipeline.
            </p>
            <p className="muted">
              <small>
                The plugin is in active development. It is
                distributed as a signed <code>.vsix</code> from the
                source repo, installed by hand &mdash; not via a
                marketplace listing. The choice is deliberate: see
                the <Link href="/colophon">colophon</Link> for the
                rationale.
              </small>
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Install (.vsix)</h2>
            <p>
              The plugin is installed by hand from the packaged{" "}
              <code>.vsix</code> file in the repo. From a checkout of
              the source:
            </p>
            <pre>
              <code>{INSTALL_VSIX}</code>
            </pre>
            <p>
              Or via the VS Code UI: <em>Extensions</em> panel →{" "}
              <em>…</em> menu → <em>Install from VSIX…</em>.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What you see</h2>
            <ul>
              <li>
                <strong>Squigglies</strong> in the editor on lines
                where Paradise has reported an issue. Severity colour
                follows VS Code&rsquo;s standard
                error/warning/information conventions.
              </li>
              <li>
                <strong>Hover popups</strong> with the analyser&rsquo;s
                reasoning, the WCAG criterion it&rsquo;s engaged, the
                engine&rsquo;s confidence level and percentage for
                this finding, and a link into the matching{" "}
                <Link href="/paradise/analysers">
                  /paradise/analysers
                </Link>{" "}
                page. The confidence reason — why the engine is
                more or less sure — is part of the popup, so the
                signal is visible at the point of reading the issue.
              </li>
              <li>
                <strong>Quick Fixes</strong> (the standard VS Code
                Code Actions / lightbulb affordance) for any issue
                that carries a fix payload. Activate the lightbulb,
                preview the suggested change, accept or dismiss.
                Fixes are best-effort: Paradise emits the corrective
                code and the file it belongs in, but the placement
                within the file is the surface&rsquo;s responsibility,
                so review the result before committing. See{" "}
                <Link href="/paradise/architecture">Architecture</Link>{" "}
                for the framing.
              </li>
              <li>
                <strong>Problems panel</strong> entries for every
                issue, with file and line jump-targets — works the
                same way the TypeScript and ESLint extensions do.
                The panel is sortable by confidence as well as
                severity, so a triage pass over HIGH-confidence
                findings only is one click away.
              </li>
              <li>
                <strong>Status bar indicator</strong> showing the
                current document&rsquo;s issue count and a quick toggle
                to enable / disable analysis.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Configuration</h2>
            <p>
              Settings live under <code>paradise.*</code> in VS Code
              settings:
            </p>
            <pre>
              <code>{CONFIG_EXAMPLE}</code>
            </pre>
            <ul>
              <li>
                <code>paradise.scope</code> — <code>file</code>{" "}
                analyses each file independently;{" "}
                <code>project</code> resolves cross-file references
                across the workspace (the multi-model mode that
                catches handler/element/style splits).
              </li>
              <li>
                <code>paradise.frameworks</code> — which
                framework-specific analysers to enable.
                Auto-detected from the workspace by default.
              </li>
              <li>
                <code>paradise.severity</code> — map analyser
                categories to VS Code severities.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>CI use</h2>
            <p>
              The same analyser engine is consumable from CI without
              VS Code. Install the npm package and call the engine
              directly:
            </p>
            <pre>
              <code>{CI_EXAMPLE}</code>
            </pre>
            <p>
              The CI surface is what the Paradise team uses for the
              evidence corpus on{" "}
              <Link href="/paradise/evidence">Evidence</Link>.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The planned browser plugin</h2>
            <p>
              A browser-extension version of Paradise is planned but
              not yet built. The intended surface is a DevTools
              panel (Chrome / Edge / Firefox) running the same
              analyser engine as the VS Code plugin and the Node API
              — same diagnostics, but rooted in the page the developer
              is currently inspecting.
            </p>
            <p>
              The browser plugin is the third release vehicle for
              Paradise (alongside the VS Code plugin and the Node
              library). It exists on this page only to mark the gap;
              there&rsquo;s no shipping artefact yet.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Limitations and known issues</h2>
            <ul>
              <li>
                <strong>Cross-file analysis can be slow on very
                large workspaces.</strong> The DocumentModel build is
                proportional to the size of the integrated source
                set. The plugin works incrementally, but the first
                full-project pass on a 500K-line codebase takes a
                noticeable few seconds.
              </li>
              <li>
                <strong>Framework-specific analysers run with the
                framework&rsquo;s minimum supported version.</strong>{" "}
                React 18+, Vue 3+, Svelte 4+, Angular 16+. Older
                versions have partial coverage.
              </li>
              <li>
                <strong>Distributed as a signed .vsix from the source
                repo</strong>, not via a marketplace. The choice is
                deliberate &mdash; see the{" "}
                <Link href="/colophon">colophon</Link> for the
                rationale.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/paradise/analysers">Analysers</Link> —
                what each warning the plugin shows actually means.
              </li>
              <li>
                <Link href="/paradise/architecture">Architecture</Link>{" "}
                — what the plugin&rsquo;s engine is doing under the
                hood.
              </li>
              <li>
                <Link href="/playgrounds/paradise">Playground</Link> — the
                in-browser sibling surface; same engine, pasted code
                instead of an editor session.
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

const INSTALL_VSIX = `# clone the Paradise repo
git clone https://github.com/bobdodd/paradise
cd paradise/app/vscode-extension

# install the packaged extension into VS Code
code --install-extension paradise-a11y.vsix`;

const CONFIG_EXAMPLE = `// .vscode/settings.json
{
  "paradise.scope": "project",
  "paradise.frameworks": ["react", "vue"],
  "paradise.severity": {
    "missing-aria-connection": "error",
    "mouse-only-click":        "warning",
    "focus-order-conflict":    "information"
  }
}`;

const CI_EXAMPLE = `// scripts/check-a11y.mjs
import { analyzeProject } from "paradise-accessibility";

const results = await analyzeProject({
  html:       ["src/**/*.html"],
  javascript: ["src/**/*.{js,ts,jsx,tsx}"],
  css:        ["src/**/*.css"],
  scope:      "project",
});

if (results.issues.some((i) => i.severity === "error")) {
  process.exit(1);
}`;
