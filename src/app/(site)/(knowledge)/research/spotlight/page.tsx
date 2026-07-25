import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";

export const metadata: Metadata = {
  title: "Spotlight projects",
};

export default function SpotlightIndex() {
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
            <h1>Spotlight projects</h1>
            <p className="lede">
              Three accessibility tools, built across two decades for
              specific named people. Each produced a working artefact
              and an insight that exceeded the artefact. They share
              a structure: a person the tool was for, a constraint
              that defined the problem, a counterintuitive insight
              that solved it, an artefact that resulted, a teaching
              that exceeded the artefact, and a coda about what
              happened to it.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The three projects</h2>
            <ul>
              <li>
                <Link href="/research/spotlight/sign16">
                  <strong>Sign16</strong>
                </Link>{" "}
                &mdash; a sign-writing system on a 16-key feature
                phone, built mid-1990s in Singapore for the gay
                Deaf community there. Won for the price of a beer.
              </li>
              <li>
                <Link href="/research/spotlight/tup">
                  <strong>TUP</strong>
                </Link>{" "}
                &mdash; adaptive thumbwheel text input on iPodLinux,
                early 2000s, for cousin Paul as his MS progressed.
                The predictive system that put the predicted letter{" "}
                <em>under your finger</em>, rather than asking you to
                reach for it.
              </li>
              <li>
                <Link href="/research/spotlight/tetris-audio">
                  <strong>Audio Tetris</strong>
                </Link>{" "}
                &mdash; a Java/JOAL audio rendering of the most
                visual game, built as the PhD&rsquo;s deliberate
                falsification test for the framework. Discovered, by
                accident, that the modality shift turned a 
                third-person observational game into a first-person
                immersive one.
              </li>
            </ul>
            <p className="muted">
              <small>
                Substantive prose pages are in active drafting
                (Track 3 of the site update plan); each page will
                run roughly 1,000&ndash;2,000 words.
              </small>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
