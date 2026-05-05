import type { CSSProperties } from "react";

export default function Paradise() {
  return (
    <main id="main" className="site-main" data-zone="tools">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s3)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Paradise</h1>
            <p style={{ fontSize: "var(--s1)" }}>
              A multi-model accessibility analyser whose technical
              contribution is the ActionLanguage intermediate representation
              — a JavaScript-to-semantic-tree transcoder that lets analysis
              reason about runtime behaviour at the source level.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it is</h2>
            <p>
              Paradise parses HTML, JavaScript, and CSS into separate
              semantic models, then merges them through selector matching
              and reasons over the integrated structure. Framework-aware
              extractors cover React, Vue, Svelte, and Angular. A VS Code
              extension runs project-wide background analysis as you work.
              ~95 passing tests, &gt;90% coverage.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why source-level analysis matters</h2>
            <p>
              Most accessibility tooling operates at one of two levels.
              AST-pattern checkers (eslint-plugin-jsx-a11y and similar) see
              syntactic patterns but not behaviour. Rendered-DOM scanners
              (axe, WAVE, Lighthouse, the new GitHub scanner) see the result
              but not the intent. Both miss issues whose cause crosses the
              boundary between source and runtime.
            </p>
            <p>
              Paradise operates at semantic-behavioural level. The
              ActionLanguage IR is the missing middle: code is decomposed
              into a typed tree of state-changing operations whose
              accessibility consequences can be reasoned about without
              running the application. Documented case studies show an{" "}
              <strong>88% false-positive reduction</strong> against
              single-file or rendered-DOM scanners on real codebases.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Try it</h2>
            <pre>
              <code>
                git clone https://github.com/bobdodd/phd{"\n"}cd phd/Action\
                {" "}Language{"\n"}npm install{"\n"}npm test
              </code>
            </pre>
            <p>
              Source:{" "}
              <a href="https://github.com/bobdodd/phd">
                github.com/bobdodd/phd
              </a>{" "}
              (Paradise lives in the <code>Action Language</code>{" "}
              subdirectory; a top-level{" "}
              <code>github.com/bobdodd/paradise</code> repo move is on the
              roadmap).
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Relationship to autoA11y</h2>
            <p>
              autoA11y is the production-grade testing tool currently being
              prepared for the Revenue Quebec RFI; it is a separate
              codebase and a CNIB asset, not a Bob asset. Paradise is mine.
              The two are complementary: autoA11y handles runtime-only
              tests (real-DOM behaviour, focus order, dynamic content);
              Paradise handles source-detectable tests (selector
              consequences, JavaScript runtime patterns, framework-specific
              extractions). The integration plan in the Paradise repo
              (<code>AUTO_A11Y_INTEGRATION_PLAN.md</code>) makes the
              relationship explicit.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Citation</h2>
            <pre>
              <code>
                @software&#123;dodd_paradise_2026,{"\n"}  author = &#123;Dodd, Bob&#125;,{"\n"}  title = &#123;Paradise: a multi-model accessibility analyser&#125;,{"\n"}  year = &#123;2026&#125;,{"\n"}  url = &#123;https://github.com/bobdodd/phd&#125;{"\n"}&#125;
              </code>
            </pre>
          </section>
        </div>
      </div>
    </main>
  );
}
