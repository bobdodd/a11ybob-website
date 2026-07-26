import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { TetrisSubNav } from "@/components/TetrisSubNav";

export const metadata: Metadata = {
  title: "What the browser makes possible",
};

export default function WhatTheBrowserMakesPossible() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <TetrisSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>What the browser makes possible</h1>
            <p className="lede">
              The Web Audio API delivers true binaural positioning on
              ordinary headphones, inside a web page. The design for
              the sonic view rebuilt on it: timbres, terrain, three
              listening views, and a player&rsquo;s mixing desk.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The platform catches up</h2>
            <p>
              The PhD implementation exercised the architecture but
              fought its platform: JOAL&rsquo;s positional audio was
              weak enough that three of my seven metaphors had to
              retreat from spatialization to musical or spoken
              encoding. Two decades later the platform has caught up.
              The Web Audio API offers <code>PannerNode</code> with
              head-related transfer function (HRTF) processing in
              every modern browser: true binaural positioning on
              ordinary headphones, inside a web page, with no
              installation at all. That changes what the sonic view
              can attempt, and it is the foundation of the
              demonstrator this case study now serves.
            </p>
            <p>
              The design that follows assumes headphones and spatial
              audio, and it assumes users who retain stereo hearing
              across the musical registers. As always, the deeper
              principle is that the user decides how to experience the
              game. The Russian folk music can go and dance elsewhere:
              the functional audio <em>is</em> the soundtrack.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Three categories of information</h2>
            <p>
              Audio is sequential, so the design must ration it. Every
              piece of game information falls into one of three
              delivery categories, and keeping them distinct is what
              prevents replacing visual overload with auditory
              overload:
            </p>
            <ul>
              <li>
                <strong>Ambient/persistent</strong>: always present,
                continuously updated. The active piece&rsquo;s
                position and identity, the urgency state.
              </li>
              <li>
                <strong>Event-driven</strong>: fires on change.
                Rotation, landing, line clear, level up.
              </li>
              <li>
                <strong>On-demand</strong>: player-queried when they
                have cognitive bandwidth. The silhouette scan, the
                next piece, the held piece.
              </li>
            </ul>
            <p>
              Mapping the five in-fall channels: the current tile and
              its ghost relationship are ambient; the silhouette is
              on-demand plus an automatic replay after each lock; next
              and held are on-demand. The braided-audio insight
              survives intact. It has simply become a scheduling
              policy.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The sonic palette</h2>
            <p>
              Each tetromino gets a persistent tonal identity, not a
              sound effect but a timbre: the I-piece a pure sine, the
              O a warm pad, the T a plucked string, S and Z a detuned
              pair expressing their mirrored tension, J and L related
              but mirrored instruments. Horizontal position maps to
              stereo azimuth, the mapping that needs no learning at
              all. Descent maps to a falling pitch or closing filter:
              gravity as waterfall, rebuilt from oscillators. Rotation
              steps through a four-interval motif, so each orientation
              is heard as a chord position. The ghost is the
              piece&rsquo;s own timbre processed into an echo, quiet,
              reverb-heavy, panned to the landing column, with the
              echo delay shrinking as the piece approaches it until
              the two sounds converge into an intuitive &ldquo;about
              to land&rdquo;. The musical sonar returns as the{" "}
              <strong>terrain scan</strong>: the ten columns played as
              a rapid arpeggio, pan giving <em>where</em> and pitch
              giving <em>how high</em>. Raggedness is heard as
              dissonance, a nearly-complete line as a smooth scale:
              musical harmony as board state. Urgency is a heartbeat
              whose tempo tracks fall speed; the lock timeout is a
              distinct accelerating tick; danger shifts the whole
              soundscape from major to minor pentatonic. Anchoring
              everything to a pentatonic scale keeps the emergent
              composition pleasant rather than cacophonous. Line
              completion resolves it: a horizontal sweep, harmonically
              stacked by line count (unison, octave, chord, and a full
              triumphant arpeggio for a Tetris), followed by a replay
              of the new terrain and a breath of silence before the
              next piece.
            </p>
            <p>
              A skilled player keeping a clean board produces calm
              consonance; a struggling player produces dissonance and
              driving tempo. The game{" "}
              <em>sounds like how well you are playing</em>, an
              intuitive, emotional read on game state that costs the
              player no parsing at all.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Three first-person views</h2>
            <p>
              The polar-coordinate realization becomes explicit
              architecture. The game&rsquo;s information space
              decomposes into three switchable first-person listening
              perspectives.
            </p>
            <p>
              These are the point at which the design stops offering
              single figures and starts offering{" "}
              <Link href="/adaptation/accessible-tetris/the-rhetoric-of-sound">
                allegory
              </Link>
              : each view is a sustained frame with its own internal
              logic, inside which many separate mappings cohere rather
              than merely coexisting. That is what answers the
              complaint the case study opens with, that interfaces
              yield up a large number of figures with no guarantee of
              consistency between them. A frame buys the consistency
              wholesale. The Well is the proof: inside it the sonar
              stops being a borrowed figure and becomes native, because
              depth-sounding a surface below you is the literal
              activity the frame describes rather than an analogy the
              listener has to accept.
            </p>
            <figure>
              <img
                src="/images/adaptation/fig-audio-stage.png"
                alt="Three panels showing the first-person listening views. The Wall, the side view: ten dots arc in front of a listener marked you, every column the same distance away; captions read azimuth equals column, precise, and elevation plus pitch equals height. The Well, the top-down view: the listener sits above a plan-view grid containing a T-shaped piece footprint, with a sonar line measuring depth to the surface; the shape becomes a horizontal sound pattern to match to the gap. Mission Control, the dashboard: four stations placed around the listener - Held at minus forty degrees behind, Next at plus forty degrees behind, Level at minus thirty degrees front-below, Score at plus thirty degrees front-below - with the note that nothing sits at exactly zero or one hundred eighty degrees, so no two stations share a cone of confusion."
                width="1960"
                height="860"
              />
              <figcaption>
                The Wall, The Well, and Mission Control.
              </figcaption>
            </figure>
            <p>
              <strong>The Wall</strong>{" "}is the side view, and the
              default, because it is how a novice knows Tetris. The
              ten columns map onto an arc with the listener at its
              centre: every column equidistant (no volume bias),
              maximally separated in azimuth (the ear&rsquo;s best
              dimension), with height carried literally in elevation.
              It excels at tracking the fall. It struggles with
              pattern-matching, which from the side is like judging
              whether a key fits a lock viewed edge-on.
            </p>
            <p>
              <strong>The Well</strong>{" "}is the top-down view. The
              listener looks down into the well; the piece is near,
              the silhouette surface below, and a sonar ping&rsquo;s
              return time gives the gap depth per column. The sonar
              metaphor is <em>native</em>{" "}to this view. The
              piece&rsquo;s shape becomes a horizontal sound-pattern
              to align with a horizontal gap-pattern, which is a far
              more tractable auditory task, and rotation is heard as
              the footprint physically rearranging. This is the
              strategist&rsquo;s view, at the cost of the fall&rsquo;s
              kinetic urgency.
            </p>
            <p>
              <strong>Mission Control</strong> is the dashboard: fixed
              spatial stations for held piece, next piece, level,
              lines, and score. It is a snapshot, not a stream,
              visited in the natural pause after a lock, just as a
              sighted player glances at the score panel.
            </p>
            <p>
              Switching is by dedicated key, heralded by a short 3-D
              earcon, brief enough not to affect gameplay. The game
              does not pause on switch by default (knowing{" "}
              <em>when</em> to glance is part of the game), but
              pause-on-switch exists as an option: the game is complex
              enough, and the unadapted original deserves respect.
              Views can also be layered, a primary view at full level
              with another bled in quietly behind, which the mixing
              model below makes free.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Psychoacoustic ground rules</h2>
            <p>
              The design is constrained throughout by what ears
              actually resolve, and my old field notes agree with the
              textbook figures to a degree I did not expect:
            </p>
            <ul>
              <li>
                <strong>The X-axis is king.</strong> Horizontal
                discrimination is around 1–2°; ten columns across a
                frontal arc are comfortably discriminable. The most
                important game dimension gets the most precise
                perceptual dimension.
              </li>
              <li>
                <strong>Elevation is coarse.</strong> Vertical
                discrimination is perhaps 10–20°, in practice about
                five bands: very high, high, middle, low, very low.
                Twenty rows collapse to five perceivable zones, so the
                design works in zones (Sky, Upper, Middle, Lower,
                Ground, each with its own timbral character) and lets{" "}
                <em>pitch</em> carry the fine-grained height, with
                brightness and tempo as further redundant cues. No
                single perceptual channel carries critical information
                alone, and the mixing desk lets each player weight the
                cues that work for their ears.
              </li>
              <li>
                <strong>Avoid pure front/back.</strong> Sounds
                mirrored across the interaural axis produce nearly
                identical cues: the cone of confusion. Nothing
                critical sits at exactly 0° or 180°, and every Mission
                Control station is offset (±40° behind, ±30°
                front-below) so no two stations share a cone.
              </li>
              <li>
                <strong>The wobble.</strong>{" "}In life, the brain
                resolves front/back by micro head movements, which
                don&rsquo;t happen wearing headphones at a screen. So
                the game space imperceptibly wobbles: a slow,
                irregular figure-eight oscillation of the audio
                listener&rsquo;s orientation, the two axes at
                incommensurate frequencies (so the pattern never
                repeats and is never heard as rhythm), amplitude a
                subliminal 2–4°. This is the direct descendant of my
                dancing margins. In the PhD build I moved the{" "}
                <em>sources</em> to help the ears; now I move the{" "}
                <em>listener</em>, and nobody has to hear it
                happening.
              </li>
            </ul>
            <figure>
              <img
                src="/images/adaptation/fig-zones.png"
                alt="A twenty-row Tetris column bracketed into five labelled zones of four rows each: zone five, Sky, rows seventeen to twenty, bright and airy with high overtones; zone four, Upper, rows thirteen to sixteen, clear and present; zone three, Middle, rows nine to twelve, neutral and warm; zone two, Lower, rows five to eight, darker and denser; zone one, Ground, rows one to four, deep, heavy and compressed. A side panel titled height is a cluster of redundant cues lists: spatial elevation gives the coarse zone, one of about five; pitch is continuous and precise; brightness from filtering is textural and intuitive; tempo and pulse rate carry urgency. No single perceptual channel carries the vertical dimension alone."
                width="1960"
                height="920"
              />
              <figcaption>
                Twenty rows, five zones: designing to auditory
                resolution, with height carried by redundant cues.
              </figcaption>
            </figure>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The player&rsquo;s mixing desk</h2>
            <p>
              User agency gets its own architecture. The soundscape is
              built as independently controllable layers (core piece,
              ghost, terrain, queue, scoring, tension, events), each
              with an on/off toggle, volume, density (full ten-column
              scan versus an abbreviated three-column one), and
              spatial spread. Presets bundle them:{" "}
              <strong>Minimal</strong> (piece and events only, to
              learn the basics), <strong>Standard</strong> (piece,
              ghost, urgency, events), <strong>Full</strong>{" "}
              (everything), <strong>Custom</strong> (the whole desk).
              A new player starts minimal and adds layers as their
              audio literacy grows; an expert runs the full
              soundscape. Player-defined information density{" "}
              <em>is</em> player-defined difficulty. It is also the
              manual-template adaptation of the architecture, with the
              player as the final authority on their own capability
              model. The old People/Capabilities/Preferences model
              becomes the settings store behind the desk.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
