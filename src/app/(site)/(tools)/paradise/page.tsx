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
              A multi-model accessibility analyser that produces auditable
              findings instead of false-positive noise.
            </p>
          </header>

          <section>
            <h2>What it does</h2>
            <p>
              Paradise analyses HTML and component code by running multiple
              specialised analysers in parallel, reconciling their findings
              through a typed intermediate representation called
              ActionLanguage.
            </p>
          </section>

          <section>
            <h2>Why it&rsquo;s different</h2>
            <p>
              Where conventional axe-style scanners surface every potential
              issue and leave the developer to filter, Paradise reduces
              false-positive volume by 88% in the case studies we have
              measured. The single hard, defensible claim of the project.
            </p>
          </section>

          <section>
            <h2>Try it</h2>
            <pre>
              <code>
                git clone https://github.com/bobdodd/paradise{"\n"}cd paradise{"\n"}npm install{"\n"}npm test
              </code>
            </pre>
            <p>
              Source: <a href="https://github.com/bobdodd/paradise">github.com/bobdodd/paradise</a>{" "}
              (repository move forthcoming — currently nested in the{" "}
              <code>phd</code> parent).
            </p>
          </section>

          <section>
            <h2>Citation</h2>
            <pre>
              <code>
                @software&#123;dodd_paradise_2026,{"\n"}  author = &#123;Dodd, Bob&#125;,{"\n"}  title = &#123;Paradise&#125;,{"\n"}  year = &#123;2026&#125;,{"\n"}  url = &#123;https://github.com/bobdodd/paradise&#125;{"\n"}&#125;
              </code>
            </pre>
          </section>

          <p>
            <small>Placeholder content — full details land with the Paradise repo move.</small>
          </p>
        </div>
      </div>
    </main>
  );
}
