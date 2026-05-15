import Link from "next/link";
import type { CSSProperties } from "react";
import { ParadiseSubNav } from "@/components/ParadiseSubNav";

export default function ParadiseLineage() {
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
            <h1>Lineage</h1>
            <p className="lede">
              Paradise is the practical realisation of an idea I parked in
              2010 when I left academia for CNIB. The route from there to
              here passes through real-time systems, Shlaer-Mellor
              executable UML, the W4A 2008 CISNA Model paper, twenty-five
              years of practitioner work at CNIB, and a long detour into
              tools that didn&rsquo;t quite reach what the framework
              wanted. ActionLanguage, the intermediate representation at
              the heart of Paradise, descends directly from a tree-shaped
              semantic model I designed for that PhD-era work — finally
              matched, fifteen years later, with a problem it was the
              right shape for.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Real-time systems and Shlaer-Mellor</h2>
            <p>
              I started in real-time systems — telephony switching, ISDN
              call control, the kind of code where a missed deadline is a
              user-visible failure rather than an aesthetic concern. The
              dominant rigorous-modelling notation of that era was
              Shlaer-Mellor, later branded executable UML. Models had to
              be simulatable; specifications had to be precise enough to
              compile to running systems. The mindset that came with that
              work — small algorithm fragments described in formal
              languages, executable from their specification, substitutable
              at runtime — never left me.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The PhD: adaptive user interfaces</h2>
            <p>
              At Teesside University I worked on adaptive user interfaces
              for mobile accessibility — UIs that could reshape themselves
              for the user&rsquo;s capabilities, context, and preferences,
              not by serving up a different design but by{" "}
              <em>substituting algorithm fragments at runtime</em>. The
              same mindset as Shlaer-Mellor: a program is a tree of
              actions; some sub-trees can be replaced with semantically-
              equivalent variants tuned to a particular user.
            </p>
            <p>
              Two artefacts came out of that work. The{" "}
              <strong>Action Language Model</strong> — a tree-based
              semantic representation of small block-structured programs,
              with sequenced child actions, typed attributes, and an
              accompanying execution engine. And the{" "}
              <strong>Adaptation Model</strong> — a description of
              variations between algorithm versions, expressed as
              add/modify/delete operations on the action tree.
            </p>
            <p>
              The PhD itself didn&rsquo;t complete. Funding ran out, life
              changed, I went to CNIB. The Action Language Model and the
              execution engine sat on my hard drive for fifteen years.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The CISNA Model — W4A 2008</h2>
            <p>
              While the PhD was active, Steve Green, Elaine Pearson, and I
              published <em>The CISNA Model of Accessible Adaptive
              Hypermedia</em> at W4A 2008 (
              <a href="https://doi.org/10.1145/1368044.1368052">
                doi:10.1145/1368044.1368052
              </a>
              ). The paper extends the classical Dexter Model of
              hypertext for an era of script-heavy, AJAX-driven content,
              distinguishing five abstractions: <em>content</em>,{" "}
              <em>inventory</em>, <em>semantics</em>, <em>navigation</em>,
              and <em>adaptation</em>. The Action Language Model fitted
              into the <em>adaptation</em> layer — the place where
              algorithm fragments could be swapped to serve different
              users.
            </p>
            <p>
              The paper has aged better than I expected. The five-layer
              decomposition still describes the actual structure of a
              modern web page reasonably well; the explicit{" "}
              <em>adaptation</em> layer turned out to be exactly where
              accessibility tooling operates when it operates at the right
              level. Paradise sits squarely in that layer.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Twenty-five years of practitioner work</h2>
            <p>
              At CNIB I led accessibility audits, remediation, and
              tooling for two and a half decades. The view from that work
              was that the gap between research and practice was
              persistent and structural. Every research framework I knew
              of presupposed a level of source-level analysis that the
              tools of the day couldn&rsquo;t deliver — eslint-style AST
              checkers couldn&rsquo;t see across files, and rendered-DOM
              scanners couldn&rsquo;t see source intent. The CISNA
              Model&rsquo;s adaptation layer was conceptually right but
              practically empty.
            </p>
            <p>
              What changed wasn&rsquo;t the research. What changed was
              JavaScript itself getting structured enough that
              source-level reasoning about behaviour became tractable —
              ES6 classes, modules, closures with predictable scope rules,
              and the parser ecosystem (Acorn, Babel) that could turn
              them into ASTs reliably. With that in place, the missing
              piece was a representation that captured what the program{" "}
              <em>does</em>, not just what was <em>written</em>. I
              already had one, in a folder I hadn&rsquo;t opened in
              fifteen years.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The tools lineage, end to end</h2>
            <p>
              The naming lineage now reads as one continuous engineering
              project across two complementary branches &mdash; the
              runtime/AI branch and the source-level static-analysis
              branch &mdash; both descending from the same theoretical
              starting point and converging again at present-day
              practice.
            </p>
            <ul>
              <li>
                <strong>CISNA Model</strong> &mdash; theory. W4A
                2008, with Steve Green and Elaine Pearson (
                <a href="https://doi.org/10.1145/1368044.1368052">
                  doi:10.1145/1368044.1368052
                </a>
                ). The five-layer model of accessible adaptive
                hypermedia. See{" "}
                <Link href="/research/cisna-model">
                  /research/cisna-model
                </Link>
                .
              </li>
              <li>
                <strong>Carnforth-Java</strong> &mdash; the doctoral
                Java implementation of CISNA, with the Action
                Language XML notation and a Forth-style threaded-
                interpreter execution engine. See{" "}
                <Link href="/playgrounds/action-language">
                  /playgrounds/action-language
                </Link>{" "}
                for the in-browser worked examples ported to
                TypeScript.
              </li>
              <li>
                <strong>
                  <Link href="/carnforth">Carnforth GPL</Link>
                </strong>{" "}
                &mdash; 2024 Chrome DevTools extension; runtime DOM
                testing focused on WCAG 4.1.2 (Name, Role, Value).
                Bob-owned, GPL-3.0. The first surfacing of the
                Carnforth name in a shipping runtime tool.
              </li>
              <li>
                <strong>
                  <Link href="/a11yauto">a11yAuto</Link>
                </strong>{" "}
                &mdash; Bob-owned GPL repository of AI-driven
                accessibility-testing demonstrations. The original
                name; the repository preserves it. Five PoCs covering
                classes of issue commercial tools cannot reach.
              </li>
              <li>
                <strong>autoA11y</strong> &mdash; CNIB&rsquo;s much
                more complete production rebrand and continuation of
                a11yAuto. CNIB-owned. The current commercial
                platform sold by CNIB Access Labs; in active
                development; integrated with{" "}
                <Link href="/lived-testing">Dictaphone</Link> for
                lived-experience analysis.
              </li>
              <li>
                <strong>Paradise (this section)</strong> &mdash;
                source-level multi-model static analysis in
                TypeScript. Bob-owned; the modern Forth-loop closure
                on the same execution model that started in
                PolyForth at Metal Box in 1984.
              </li>
            </ul>
            <p>
              <em>
                One name across twenty years. Three Bob-owned
                open-source tools across three different testing
                approaches; one CNIB-owned production platform
                between them.
              </em>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The boundary between Paradise and autoA11y</h2>
            <p>
              The runtime/AI branch and the source-level branch are
              complementary, not competitive. autoA11y operates at
              runtime: it observes the real DOM, real focus order,
              real dynamic content. Paradise operates on source: it
              reads the HTML, JavaScript, and CSS before the page
              renders. The two answer different questions, and an
              honest accessibility practice uses both.
              Paradise&rsquo;s repository carries an integration plan
              (<code>AUTO_A11Y_INTEGRATION_PLAN.md</code>) that names
              the boundary explicitly.
            </p>
            <p>
              The boundary line: <em>if Bob left CNIB tomorrow,
              would this artefact go with him?</em> Carnforth GPL,
              a11yAuto, and Paradise all answer yes. autoA11y and
              Dictaphone answer no. The first three are mine; the
              last two are CNIB&rsquo;s. The site treats each at
              its appropriate framing &mdash; portfolio for the
              Bob-owned tools, practice for the CNIB-owned tools.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where ActionLanguage came from</h2>
            <p>
              The Action Language Model from the PhD work is — almost
              unaltered — the IR Paradise builds for JavaScript. The
              shape carried over: tree of actions, sequenced children,
              typed attributes, abstract enough to collapse
              semantically-equivalent fragments to the same tree,
              annotated enough to recover line numbers for diagnostics.
              What was rebuilt was the{" "}
              <em>transcoder</em> — the part that takes input source and
              produces the tree. The original transcoder was for a small
              custom language designed for the PhD; the new transcoder
              accepts JavaScript up to ES6.
            </p>
            <p>
              The reuse isn&rsquo;t accidental. The whole point of
              Shlaer-Mellor-style action models is that they capture
              executable semantics in a way that&rsquo;s neutral to the
              source language. A model that worked for the small
              algorithms in the adaptive-UI PhD was always going to
              transfer to JavaScript fragments — the only question was
              whether anyone would ever bother to do the work. I bothered.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What this is heading towards</h2>
            <p>
              Paradise is a platform, not a finished product. Through
              2029 I&rsquo;ll continue developing it as a vehicle for
              testing the more theoretical ideas the PhD-era framework
              gestured at — the adaptation layer of the CISNA Model
              put into actual practice; semantic analysis of behaviours
              hidden in complex client-side JavaScript; perhaps the
              full Adaptation Model resurrected for runtime UI variation
              tuned to user capability. The plugins (the VS Code one
              now, a planned browser one to follow) are the
              user-facing release vehicles. The platform itself is
              where the research-and-tooling work continues to happen.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/paradise/architecture">Architecture</Link> —
                the multi-model approach in detail (in progress).
              </li>
              <li>
                <Link href="/paradise/action-language">
                  ActionLanguage IR
                </Link>{" "}
                — a worked example of the tree (in progress).
              </li>
              <li>
                <a href="https://doi.org/10.1145/1368044.1368052">
                  Dodd, Green &amp; Pearson —{" "}
                  <em>The CISNA Model of Accessible Adaptive
                  Hypermedia</em>
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
