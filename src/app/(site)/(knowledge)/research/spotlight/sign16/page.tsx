import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";

export default function SpotlightSign16() {
  return (
    <main id="main" className="site-main" data-zone="knowledge">
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
            <p>
              <small>
                <Link href="/research/spotlight">
                  &larr; Spotlight projects
                </Link>
              </small>
            </p>
            <h1>Sign16</h1>
            <p className="lede">
              A sign-writing system for mid-1990s feature phones,
              built for the gay Deaf community in Singapore in
              response to a challenge over drinks at the bar Tantric
              on a Friday night. The price of solving the problem
              was a beer.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <p className="muted">
              Substantive draft pending. The page will run the
              full Spotlight structure &mdash; the person, the
              constraint, the insight, the artefact, the teaching,
              the coda &mdash; with the 16-keys-as-body-parts
              encoding, the Tantric anecdote, and the closing line
              about the friends continuing to sign on their phones
              &ldquo;like it never happened.&rdquo;
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
