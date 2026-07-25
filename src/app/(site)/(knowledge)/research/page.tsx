import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";

export const metadata: Metadata = {
  title: "Research",
};

export default function Research() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s3)" } as CSSProperties}>
          <ResearchSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Research</h1>
            <p className="lede">
              Frameworks, papers, and one forward-looking project.
              Most of this work was developed during doctoral
              research at Teesside between 2004 and 2013, parked
              when CNIB and CELA happened, and is being resumed now
              that the implementation tools the original research
              called for have arrived &mdash; and along the
              trajectory toward 2029, when more time becomes
              available for it.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
            aria-labelledby="research-frameworks-heading"
          >
            <h2 id="research-frameworks-heading">Frameworks</h2>
            <ul>
              <li>
                <Link href="/research/cisna-model">
                  <strong>The CISNA Model of Accessible Adaptive Hypermedia</strong>
                </Link>{" "}
                — published at{" "}
                <a href="https://doi.org/10.1145/1368044.1368052">
                  W4A 2008
                </a>{" "}
                with Steve Green and Elaine Pearson. Five-layer
                model for adaptive hypermedia
                (Adaptation, Navigation, Semantics, Inventory,
                External Content). Doctoral Java implementation:
                Carnforth-Java.
              </li>
              <li>
                <Link href="/research/polymorphic-task-decomposition">
                  <strong>Polymorphic Task Decomposition</strong>
                </Link>{" "}
                — multiple ways of manipulating the same data so a
                capability model can choose the appropriate route. A
                pre-requisite for intrinsic accessibility.
              </li>
              <li>
                <Link href="/research/tetris-testbed">
                  <strong>Tetris as accessibility testbed</strong>
                </Link>{" "}
                — methodology for evaluating accessibility frameworks
                against a paradigmatically visual, time-pressured,
                multi-channel game.
              </li>
              <li>
                <Link href="/research/shlaer-mellor-lens">
                  <strong>The Shlaer-Mellor lens</strong>
                </Link>{" "}
                — recursive design as the structural shape
                accessibility shares with bridged-domain modelling.
                The methodological substrate beneath everything else
                here.
              </li>
              <li>
                <Link href="/research/2029-framework">
                  <strong>The 2029 framework</strong>
                </Link>{" "}
                — accessibility as multi-agent communities of
                practice with formal equilibrium dynamics. The next
                research step explicitly named in the 2013 thesis
                conclusion, paused because the implementation tools
                didn&rsquo;t exist, now resumable.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
            aria-labelledby="research-measure-heading"
          >
            <h2 id="research-measure-heading">
              The Measure of Accessibility
            </h2>
            <p>
              A six-page treatment of the accessibility theory that
              emerged from the <em>Defining Accessibility</em>{" "}thesis
              chapter. The deepest single intellectual contribution
              in the corpus: the political framing of what
              accessibility actually is, the formal distinction
              between functional and intrinsic accessibility, and the
              rejection of utilitarianism in accessibility decisions.
            </p>
            <p>
              <Link href="/research/the-measure-of-accessibility">
                Read the collection &rarr;
              </Link>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
            aria-labelledby="research-al-heading"
          >
            <h2 id="research-al-heading">Action Language</h2>
            <p>
              The original XML notation and execution engine from the
              PhD, with worked examples that run in the browser via a
              TypeScript port of the Java reference. The page is{" "}
              <em>interactive</em>: visitors can edit the supplied
              examples or write their own Action Language scripts in
              the in-page editor, run them, and watch the execution
              trace in the same window. Demonstrates the Shlaer-Mellor
              lens in code: the same threaded-interpreter execution
              model that started in Forth at Metal Box in the
              mid-1980s.
            </p>
            <p>
              <Link href="/playgrounds/action-language">
                Open the Action Language page &rarr;
              </Link>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
            aria-labelledby="research-spotlight-heading"
          >
            <h2 id="research-spotlight-heading">Spotlight projects</h2>
            <p>
              Three accessibility tools, built across two decades for
              specific named people, each producing both a working
              artefact and an insight that exceeded the artefact.{" "}
              <Link href="/research/spotlight">
                See the Spotlight index &rarr;
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
