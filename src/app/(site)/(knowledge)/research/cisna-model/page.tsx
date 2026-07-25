import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";

export const metadata: Metadata = {
  title: "The CISNA Model of Accessible Adaptive Hypermedia",
};

export default function CisnaModel() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <ResearchSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>The CISNA Model of Accessible Adaptive Hypermedia</h1>
            <p className="lede">
              A five-layer reference model for adaptive hypermedia,
              published at W4A 2008 with Steve Green and Elaine Pearson
              (<a href="https://doi.org/10.1145/1368044.1368052">
                doi:10.1145/1368044.1368052
              </a>), and implemented as Carnforth-Java during
              doctoral research at Teesside.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it is</h2>
            <p>
              The CISNA Model rebuilds the Dexter Reference Model of
              Hypertext for an era of script-heavy, AJAX-driven
              content, distinguishing five layers:{" "}
              <strong>Adaptation</strong>, <strong>Navigation</strong>,{" "}
              <strong>Semantics</strong>, <strong>Inventory</strong>,
              and <strong>External Content</strong>. Each layer is a
              formal model with its own diagrams and notation; bridges
              between layers express how meaning composes upward from
              raw content through to adapted presentation.
            </p>
            <p>
              The published version (<a href="https://doi.org/10.1145/1368044.1368052">W4A 2008</a>) presents the layered
              architecture and the formal definitions; the doctoral
              Java implementation (Carnforth-Java) applies the model
              to real interfaces. The Google Maps interface is the
              worked example used in the published material.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The five layers</h2>
            <ol>
              <li>
                <strong>Adaptation</strong> — selects from the
                alternatives below based on user, device, and operating
                context. The layer where the recursive-design choice
                actually happens.
              </li>
              <li>
                <strong>Navigation</strong> — links and traversal
                between content elements. The original Dexter Model
                lives at this layer.
              </li>
              <li>
                <strong>Semantics</strong> — content composition and
                meaning, with notion ontologies, predicates, and rules.
              </li>
              <li>
                <strong>Inventory</strong> — formatted media elements
                available for use by the layers above.
              </li>
              <li>
                <strong>External Content</strong> — raw content beneath
                everything, usually networked.
              </li>
            </ol>
            <p>
              Bridges between layers — Inventory&#x2194;Semantics and
              Semantics&#x2194;Navigation — express how meaning
              composes from raw content to adapted presentation. The
              bridges are formal: not metadata annotations on the side
              of the system, but typed relationships that the model
              compiler operates on.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The lineage</h2>
            <p>
              The CISNA Model is the published version of a longer
              published track:
            </p>
            <ul>
              <li>
                <strong>2006</strong> — &ldquo;The Effectiveness of
                Self-Adapting User Interfaces as Assistive Technology
                for Handheld Mobile Devices.&rdquo; Argues for{" "}
                <em>intrinsic accessibility</em>{" "}over functional
                bolt-on assistive tech, and names the formal next step
                (game theory + autonomous agents) that the{" "}
                <Link href="/research/2029-framework">
                  2029 framework
                </Link>{" "}
                resumes.
              </li>
              <li>
                <strong>2008</strong> — &ldquo;20 Years On: the Dexter
                Model of Hypertext and its impact on web
                accessibility,&rdquo; ACM SIGACCESS Newsletter.
                Critiques the Dexter Model and its descendant HTML for
                being structured around a printer&rsquo;s view of a
                book rather than an author&rsquo;s or a reader&rsquo;s.
                Proposes the five-layer alternative that became CISNA.
              </li>
              <li>
                <strong>2008</strong> — &ldquo;The CISNA Model of
                Accessible Adaptive Hypermedia,&rdquo; W4A 2008, with
                Steve Green and Elaine Pearson (
                <a href="https://doi.org/10.1145/1368044.1368052">
                  doi:10.1145/1368044.1368052
                </a>
                ). Published version of the five-layer model with
                formal definitions. This is what the literature cites.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it became</h2>
            <p>
              The five-layer model is structurally a Shlaer-Mellor
              domain chart with peer relationships rather than the
              canonical SM client-server hierarchy. That deviation is
              itself a methodological contribution — see{" "}
              <Link href="/research/shlaer-mellor-lens">
                the Shlaer-Mellor lens
              </Link>{" "}
              for the recursive-design framing beneath it.
            </p>
            <p>
              The Carnforth-Java XML notation and execution engine
              live on as{" "}
              <Link href="/playgrounds/action-language">
                Action Language
              </Link>
              , which now ships as a TypeScript port running in the
              browser with four worked examples.
            </p>
            <p>
              The modern descendant in active use is the
              ActionLanguage intermediate representation (IR) inside{" "}
              <Link href="/paradise">Paradise</Link> — the same
              shape, the same threaded-interpreter execution model,
              applied to source-level accessibility analysis of
              JavaScript.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/playgrounds/action-language">
                  Action Language
                </Link>{" "}
                — the running code beneath CISNA, with worked examples
                in-browser.
              </li>
              <li>
                <Link href="/research/the-measure-of-accessibility">
                  The Measure of Accessibility
                </Link>{" "}
                — the formal-theory collection that CISNA
                operationalises.
              </li>
              <li>
                <Link href="/paradise">Paradise</Link> — the working
                analyser whose IR descends from this lineage.
              </li>
              <li>
                <Link href="/adaptation/accessible-tetris">
                  Accessible Tetris: a case study
                </Link>{" "}
                — CISNA applied to a real-time game: the thesis&rsquo;s
                rendering case study, revisited for the web.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
