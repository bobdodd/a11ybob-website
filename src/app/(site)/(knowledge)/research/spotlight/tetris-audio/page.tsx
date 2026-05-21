import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";

export default function SpotlightTetrisAudio() {
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
            <p>
              <small>
                <Link href="/research/spotlight">
                  &larr; Spotlight projects
                </Link>
              </small>
            </p>
            <h1>Audio Tetris</h1>
            <p className="lede">
              A Java/JOAL audio rendering of the most visual game,
              built as the doctoral framework&rsquo;s deliberate
              falsification test. Discovered, by accident, that the
              modality shift turned a third-person observational
              game into a first-person immersive one.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The person</h2>
            <p>
              The audio Tetris was built as the rendering case
              study in the doctoral work. Audio testers included
              Bob&rsquo;s husband, Taodi, who appears by name in
              the case-study chapter:{" "}
              <em>&ldquo;Taodi took a while to understand...&rdquo;</em>{" "}
              A working tool tested on a real listener, not a
              theoretical exercise.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The constraint</h2>
            <p>
              Tetris is a paradigmatically visual game: falling
              tiles, terrain shape, fit quality, line completion.
              The rendering case study had to express all of that
              in audio, with sufficient richness that the player
              could play the game. The information channels needed:
              type of falling tile, position, orientation, terrain
              shape under the falling tile, fit quality of any
              given placement, gravity (rate of fall), line
              completion, scoring. Audio is sequential by default,
              where the visual scene is parallel.
            </p>
            <p>
              Tetris was deliberately chosen as a falsification
              test, not as a teaching example. From the case study:
            </p>
            <blockquote>
              <p>
                <em>
                  &ldquo;What really defeats existing assistive
                  technology is the proximal content inherent in the
                  game &mdash; rotating and guiding falling shapes
                  to match gaps on the floor of the grid. If the
                  approach in this research to accessibility is
                  truly better than existing AT, then one would
                  expect to see it succeed in this proximal
                  context.&rdquo;
                </em>
              </p>
            </blockquote>
            <p>
              The doctoral framework hung on Tetris working.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The artefact</h2>
            <p>
              A Java implementation using JOAL (Java OpenAL audio
              bindings), with seven specific audio metaphors
              developed and iterated:
            </p>
            <ol>
              <li>
                <strong>Aside</strong> &mdash; whispering the type
                of the next tile and the contents of the hold box
                into the player&rsquo;s right ear.
              </li>
              <li>
                <strong>Musical sonar</strong> &mdash; a single note
                for each column of the falling tile&rsquo;s width,
                played in sequence around the user; higher notes
                mean better fit.{" "}
                <em>
                  &ldquo;It works surprisingly well. Well, once you
                  get the idea.&rdquo;
                </em>
              </li>
              <li>
                <strong>Dancing margins</strong> &mdash; sounds left
                and right of the player, with 3D distance expressing
                the grid distance to the play-area edges. Iterated
                several times; the 3D audio engine wasn&rsquo;t
                great, so the implementation settled on a{" "}
                <em>dance in music</em> rather than a{" "}
                <em>dance in location</em>.
              </li>
              <li>
                <strong>Talking scrollbar</strong> &mdash; the
                falling-tile sound played left, middle, or right to
                locate the tile horizontally.
              </li>
              <li>
                <strong>Direction-as-direction</strong> &mdash;
                animated sounds passing the player in N/S/E/W
                directions to indicate orientation. Eventually
                replaced with a separate spoken voice in a
                different register from the tile description, because
                the 3D audio quality wouldn&rsquo;t support the
                directional metaphor.
              </li>
              <li>
                <strong>Gravity as waterfall</strong> &mdash;
                ambient sound of falling water, manipulating volume
                and pitch over time so the water{" "}
                <em>feels nearer</em>. Implemented as a point
                source after experimentation.
              </li>
              <li>
                <strong>Braided audio</strong> &mdash; interleaved
                play-out of musical sonar and dancing margins, with
                prioritisation (two scans of sonar to one of
                margins) as a way to share the audio resource and
                express importance simultaneously. Adapted from
                Schmandt&rsquo;s &ldquo;Audio Hallway&rdquo;
                navigation approach.
              </li>
            </ol>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The insight</h2>
            <p>
              Converting Tetris from visual to audio turned a third-
              person observational game into a first-person
              immersive one. And it wasn&rsquo;t deliberate.
            </p>
            <p>
              From the chapter:
            </p>
            <blockquote>
              <p>
                <em>
                  &ldquo;The game became immersive because the
                  player became the centre of all interaction
                  modalities. The tile moves relative to the player
                  (and simultaneously, the distance of the margins
                  from the tile are described relatively to the
                  position of the user), gravity ebbs and flows
                  towards the user, and the sonar plays out around
                  the player.&rdquo;
                </em>
              </p>
            </blockquote>
            <p>
              The audio metaphors were built to test specific
              information-channel hypotheses. The immersion
              re-framing was the by-product, and it raises a
              question that the original research question
              didn&rsquo;t anticipate: when assistive tech
              translates from one modality to another, is it merely
              changing the channel, or is it changing the
              experience itself?
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The teaching</h2>
            <p>
              Two pieces, both of which generalise beyond Tetris.
            </p>
            <p>
              <strong>The sonic design space is naturally
              immersive.</strong> Bob looked for observational audio
              metaphors as alternatives to the immersive ones, and{" "}
              <em>&ldquo;came up empty.&rdquo;</em> When the
              modality is audio, the player is at the centre of the
              perceptual field by default; the observational stance
              that the visual version of Tetris encouraged is not
              available without active engineering effort to
              suppress immersion. The bias of the modality matters.
            </p>
            <p>
              <strong>
                Current screen-reader assistive tech is therefore an
                extremely narrow slice of what audio accessibility
                could be.
              </strong>{" "}
              Most observational tools &mdash; screen readers,
              captioning, text-to-speech of visual UIs &mdash;
              translate visual content into a single linear audio
              channel, losing parallelism, losing positional
              information, losing the option for immersion. Audio
              interfaces <em>can</em> be richly immersive; the
              dominant assistive-tech approaches just don&rsquo;t
              take that option. When we build assistive tech, the
              question worth asking is not just <em>can the user
              access the content?</em> but{" "}
              <em>what experience are we offering?</em> Two
              different questions, two different success criteria.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The closure</h2>
            <p>
              A perfect closure exists in the Personas appendix of
              the doctoral framework. From David Furness&rsquo;s
              persona &mdash; profoundly deaf, protanopic &mdash;
              comes the line:
            </p>
            <blockquote>
              <p>
                <em>
                  &ldquo;Even a simple game such as Tetris is a
                  problem on versions with a black background as
                  one of the standard shapes &mdash; a long red
                  rectangle is essentially invisible to him.&rdquo;
                </em>
              </p>
            </blockquote>
            <p>
              The very game chosen as the framework&rsquo;s hardest
              test fails for the colour-blind user, in a way the
              standard visual game also fails. The framework exists
              to handle exactly this case. The case study and the
              Personas appendix close the loop on each other.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/research/tetris-testbed">
                  Tetris as accessibility testbed
                </Link>{" "}
                &mdash; the methodology framing that this artefact
                tested.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
