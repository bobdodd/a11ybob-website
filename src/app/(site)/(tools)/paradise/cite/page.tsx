import Link from "next/link";
import type { CSSProperties } from "react";
import { ParadiseSubNav } from "@/components/ParadiseSubNav";

export default function ParadiseCite() {
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
            <h1>Citation</h1>
            <p className="lede">
              How to cite Paradise in academic writing, in tooling
              comparisons, or in any context where the source-level
              accessibility analysis claim needs an attribution. Both
              Paradise itself and the underlying W4A 2010 paper that
              the ActionLanguage IR descends from have suggested
              citations.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Citing Paradise</h2>
            <p>Suggested human-readable citation:</p>
            <blockquote>
              Dodd, B. <em>Paradise: a multi-model accessibility
              analyser</em>. Open-source software, MIT licence.{" "}
              <a href="https://github.com/bobdodd/phd/tree/main/Action%20Language">
                https://github.com/bobdodd/phd/tree/main/Action&nbsp;Language
              </a>
            </blockquote>
            <p>BibTeX:</p>
            <pre>
              <code>{BIBTEX_PARADISE}</code>
            </pre>
            <p className="muted">
              <small>
                A DOI via Zenodo is on the release roadmap; the entry
                above will gain a <code>doi</code> field once the
                first tagged release lands. Until then, cite the
                repository URL.
              </small>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Citing the W4A 2010 paper</h2>
            <p>
              For the theoretical foundation that the ActionLanguage
              IR descends from, cite the W4A 2010 paper directly:
            </p>
            <blockquote>
              Dodd, R., Green, S., &amp; Pearson, E. (2010).{" "}
              <em>The Carnforth Model of Accessible Adaptive
              Hypermedia</em>. In <em>Proceedings of the 2010
              International Cross Disciplinary Conference on Web
              Accessibility (W4A)</em>. ACM.{" "}
              <a href="https://doi.org/10.1145/1805986.1806008">
                https://doi.org/10.1145/1805986.1806008
              </a>
            </blockquote>
            <p>BibTeX:</p>
            <pre>
              <code>{BIBTEX_CARNFORTH}</code>
            </pre>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>When to cite which</h2>
            <ul>
              <li>
                <strong>Citing the tool</strong> — using Paradise in
                an audit, comparing it to other tooling, building on
                the API: cite Paradise.
              </li>
              <li>
                <strong>Citing the theoretical contribution</strong>{" "}
                — the multi-layer Carnforth Model, the adaptation
                layer, source-level accessibility analysis as a
                concept: cite the W4A 2010 paper as well as Paradise.
                The paper is the primary source for the framework;
                Paradise is the practical realisation.
              </li>
              <li>
                <strong>Citing the IR specifically</strong> — work
                that builds on or extends ActionLanguage, the action-
                tree representation, or the JavaScript-to-tree
                transcoding: both citations.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Author and ORCID</h2>
            <p>
              Bob (Robert) Dodd. ORCID linkage forthcoming alongside
              the first tagged release.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/paradise/lineage">Lineage</Link> — the
                research arc from the W4A paper to Paradise.
              </li>
              <li>
                <Link href="/paradise/action-language">
                  ActionLanguage IR
                </Link>{" "}
                — the technical contribution at the centre of the
                citation.
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

const BIBTEX_PARADISE = `@software{dodd_paradise,
  author = {Dodd, Bob},
  title  = {Paradise: a multi-model accessibility analyser},
  url    = {https://github.com/bobdodd/phd/tree/main/Action%20Language},
  note   = {Open-source software, MIT licence}
}`;

const BIBTEX_CARNFORTH = `@inproceedings{dodd2010carnforth,
  author    = {Dodd, Robert and Green, Steve and Pearson, Elaine},
  title     = {The Carnforth Model of Accessible Adaptive Hypermedia},
  booktitle = {Proceedings of the 2010 International Cross Disciplinary
               Conference on Web Accessibility (W4A)},
  year      = {2010},
  publisher = {ACM},
  doi       = {10.1145/1805986.1806008}
}`;
