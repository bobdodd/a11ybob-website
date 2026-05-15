import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";

export default function TetrisTestbed() {
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
            <h1>Tetris as accessibility testbed</h1>
            <p className="lede">
              The most teachable artefact of the doctoral period.
              Tetris carries the right complexity for accessibility
              analysis, with a frame anyone tracks. Used during the
              PhD as the deliberate falsification test for the
              framework.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why Tetris</h2>
            <p>
              Six tile types, four orientations, the silhouette-
              recognition problem at the bottom of the well, the
              next-tile preview, the held-tile, multi-line scoring,
              increasing tempo. Everything an accessibility researcher
              needs to test — vision, audition, motor, cognitive,
              timing — but with a frame anyone tracks.
            </p>
            <p>
              <em>
                You could go to a conference, talk about Tetris, and
                people understand where you are. Then you start
                talking about how someone with hand tremors plays it.
              </em>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Tetris as falsification test</h2>
            <p>
              Tetris was chosen not as a teaching example but as
              the framework&rsquo;s deliberate hardest test:
            </p>
            <blockquote>
              <p>
                <em>
                  What really defeats existing assistive technology is
                  the proximal content inherent in the game — rotating
                  and guiding falling shapes to match gaps on the
                  floor of the grid. If the approach in this research
                  to accessibility is truly better than existing AT,
                  then one would expect to see it succeed in this
                  proximal context.
                </em>
              </p>
            </blockquote>
            <p>
              The thesis depends on Tetris working: a paradigmatically
              visual, time-pressured, multi-channel game expressed
              richly enough in audio that the player can play. The
              audio version that was built — see{" "}
              <Link href="/research/spotlight/tetris-audio">
                the Spotlight project page
              </Link>{" "}
              for the seven specific audio metaphors — produced an
              unexpected observation: the modality shift turned a
              third-person observational game into a first-person
              immersive one.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The closure with the Personas appendix</h2>
            <p>
              A perfect closure exists in the thesis Personas
              appendix. From David Furness&rsquo;s persona — profoundly
              deaf, protanopic — comes the line:{" "}
              <em>
                &ldquo;Even a simple game such as Tetris is a problem
                on versions with a black background as one of the
                standard shapes — a long red rectangle is essentially
                invisible to him.&rdquo;
              </em>{" "}
              The very game chosen as the framework&rsquo;s hardest
              test fails for the colour-blind user, in a way the
              standard visual game also fails. The framework exists
              to handle exactly this case.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/research/spotlight/tetris-audio">
                  Spotlight: Audio Tetris
                </Link>{" "}
                — the seven audio metaphors and the modality-shift
                observation.
              </li>
              <li>
                <Link href="/research/the-measure-of-accessibility">
                  The Measure of Accessibility
                </Link>{" "}
                — the formal-theory collection that Tetris was built
                to test.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
