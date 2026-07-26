import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { TetrisSubNav } from "@/components/TetrisSubNav";

export const metadata: Metadata = {
  title: "The sonic design space",
};

export default function TheSonicDesignSpace() {
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
            <h1>The sonic design space</h1>
            <p className="lede">
              Seven invented audio metaphors with honest field notes,
              and the discovery they forced: rendered in sound, a
              third-person game becomes a first-person experience.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Inventing the metaphors</h2>
            <p>
              With the visual rendering essentially a
              re-implementation of classic Tetris, the research weight
              fell on the sonic view. There was no existing vocabulary
              to borrow: the sonic components and their interaction
              metaphors were almost entirely new to Tetris, expressing
              abstract concepts such as gravity, orientation,
              topography, and relative distance. These are the
              metaphors I invented for the PhD implementation,
              together with field notes on how each survived contact
              with reality. The implementation ran on an ordinary
              laptop, in Java, with JOAL (OpenAL bindings) providing
              positional audio, an engine whose limitations themselves
              shaped the design in instructive ways.
            </p>
            <p>
              A word on the status of these field notes, because it
              matters: they are designer introspection, checked
              against at most one or two informal testers. When I say
              a metaphor &ldquo;works surprisingly well&rdquo;, the
              fair expansion is{" "}
              <em>
                worked surprisingly well for me, its designer, who
                knew what it was trying to say
              </em>
              . Nothing in this part has been evaluated in the sense
              the auditory-display literature means by the word, that
              is, quantitative task measures across users in the
              tradition of Brewster&rsquo;s and Walker&rsquo;s work;
              the thesis&rsquo;s planned formal evaluation was never
              run. The notes are hypotheses with one data point each.
            </p>
            <p>
              <strong>Aside.</strong>{" "}Literally an aside: I whisper
              the type of the next tile, and the content of the hold
              box, into the player&rsquo;s right ear. Low-priority
              peripheral information delivered on a spatially
              distinct, low-attention channel.
            </p>
            <p>
              <strong>Musical sonar.</strong>{" "}I needed a way to
              express the quality of the tessellation between the
              falling tile and the ground. I play a single note for
              each column of the tile&rsquo;s width, in sequence,
              around the user; the tune repeats every couple of
              seconds, or when the user moves or rotates the tile. The
              higher the note, the better the fit. It works
              surprisingly well, once you get the idea. New listeners
              took a while to understand it; a training mode belongs
              in any future version.
            </p>
            <p>
              <strong>Dancing margins.</strong>{" "}A way to describe the
              distance of the falling tile from the edges of the
              playing grid, complicated by the fact that fallen tiles
              can obstruct movement, so the true &ldquo;margin&rdquo;
              is the distance the piece can actually travel. My
              solution was to place a sound to the left and right of
              the user, using 3-D distance to express grid distance.
              The audio engine&rsquo;s positional quality let me down.
              I first made the sounds physically &ldquo;dance&rdquo;
              forwards and backwards to help the ears fix their
              locations, and when even that proved weak, the dance
              became a dance in <em>music</em> rather than location;
              oddly, that made the margin positions clearer. The
              lesson generalizes: when spatialization is poor,
              redundant musical encoding can carry what position
              cannot.
            </p>
            <p>
              <strong>Talking scrollbar.</strong>{" "}The old idea of
              speaking text left-to-right so the listener knows how
              far through it they are, applied to tile position. Again
              the 3-D audio was not precise enough (the sound jumped
              perceptibly), so I scaled it back to three coarse
              locations: the falling tile&rsquo;s sound plays left,
              middle, or right in front of the user. Taken together
              with the dancing margins, it locates the tile in space.
            </p>
            <p>
              <strong>Direction as direction.</strong>{" "}Orientation of
              the falling tile: essentially north, south, east, west.
              I could simply speak it, but I was already whispering in
              the player&rsquo;s ear, so I tried animating a sound{" "}
              <em>passing</em> the user in one of four directions.
              Forward/back motion was unconvincing in the engine, so I
              rotated the axes 45° to give NW/SE and SW/NE passes;
              since orientation, not true direction, is what matters,
              the rotation was harmless. In the end even this failed
              to earn its keep. The diagonal passes sounded odd and
              imprecise, and I fell back to speaking the orientation,
              but in a separate, male voice, distinct from the female
              voice describing the tile. Two lessons: spatial motion
              is a fragile carrier for categorical information, and
              voice identity is itself a usable channel.
            </p>
            <p>
              <strong>Gravity as waterfall.</strong>{" "}The action of
              falling, and how far there is left to fall, delivered
              inside an already busy soundscape. My solution was
              falling water, with volume and pitch manipulated over
              time so the water feels nearer as the tile descends. I
              first implemented it as ambient sound and later as a
              point source; there was a qualitative difference between
              tweening the volume and tweening the location, in the
              point source&rsquo;s favour. The metaphor asks nothing
              of the player: everyone knows what approaching water
              means.
            </p>
            <p>
              <strong>Braided audio.</strong>{" "}The technique I adapted
              from the &ldquo;Audio Hallway&rdquo; work of navigating
              large music collections: splice the play-out of several
              streams into alternating segments. Playing the musical
              sonar and the dancing margins simultaneously, even from
              radically different locations, was discordant and
              distracting, so I serialized them into a braid and used
              the braid <em>ratio</em> to express priority: two scans
              of the sonar for every scan of the margins, because
              tessellation matters more than margins when playing.
              Braided audio thereby does two jobs at once. It shares a
              single musical play-out channel, and it encodes relative
              importance.
            </p>
            <figure>
              <img
                src="/images/adaptation/fig-braided.png"
                alt="Timeline of audio segments alternating along a single play-out channel: sonar sweep, left margin, sonar sweep, right margin, sonar sweep, left margin, and so on along an arrow marked time. The sonar segments appear twice as often as the margin segments, showing how the interleave ratio expresses the sonar's higher priority."
                width="1960"
                height="600"
              />
              <figcaption>
                Braided audio: interleaving serializes competing
                streams, and the interleave ratio expresses priority.
              </figcaption>
            </figure>
            <p>
              The wav assets of the original build tell the same story
              in miniature: spoken letters and numbers for the asides
              and scores, water sounds for gravity, and note sets for
              the sonar. A soundscape barely a dozen samples deep,
              doing the work of a screenful of pixels.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The voice of the game: third person becomes first person</h2>
            <p>
              What I find most interesting in the created audio
              metaphors is the effective change in the <em>voice</em>{" "}
              of the game. Tetris went from being a third-person
              observational game to a first-person immersive
              experience.
            </p>
            <p>And it wasn&rsquo;t deliberate.</p>
            <p>
              The game became immersive because the player became the
              centre of all interaction modalities. The tile moves
              relative to the player; the margins are described
              relative to the tile the player is steering; gravity
              ebbs and flows <em>toward</em> the listener; the sonar
              plays out <em>around</em> them. Realizing I had changed
              the nature of the game, I went looking for alternative,
              observational audio metaphors for gravity, tessellation,
              and relative position. Beyond a screen-reader-style
              approach with multiple speaking actors, I came up empty.
              It appears to be in the nature of the sonic design space
              to be first-person immersive for anything beyond simple
              linear play-out of content.
            </p>
            <p>
              The deeper reason emerged when I thought about
              coordinates. Visual Tetris cheats: it presents a spatial
              cognitive task as a flat projection on a rectangle, and
              the player&rsquo;s visual system does the
              reconstruction. The moment the game moves to audio it is
              inherently in a{" "}
              <em>listener-centric polar coordinate system</em>, where
              everything is defined by angle and distance from the
              player. I can&rsquo;t fake a flat rectangle, and I
              shouldn&rsquo;t try.
            </p>
            <p>
              If a third-person observational game naturally becomes
              first-person immersive under sonic rendering, what
              should happen to the classic WIMP interface? Windows,
              macOS, and the Linux desktops are all third-person
              observational visual interfaces, and what today&rsquo;s
              assistive technology provides is the descriptive,
              spoken, screen-reader approach: an extremely limited set
              of metaphors. My experience with Tetris suggests a much
              richer set is waiting to be explored. Exploiting it
              requires the UI to be described in abstract terms and
              rendered according to user need, which leads straight
              back to the architectural model of this case study.
            </p>
            <p>
              Looking at assistive technology I had seen deployed, the
              pattern repeats: adaptation seems only ever to travel
              one direction, toward immersion. Switch scanning is
              immersive: the user rides a moving play-out, waiting to
              strike within a time window. Screen magnification is
              immersive: the user no longer looks down on content but
              navigates <em>within</em> it. Even page re-ordering for
              screen reading is first-person, leading the user through
              content in a chosen order. I cannot think of a
              first-person modality that becomes third-person
              observational under adaptation.
            </p>
            <p>
              There is one place the reverse can happen: adaptation
              for deaf and hearing-impaired users, where audio&rsquo;s
              emotional and off-stage content gets re-presented
              visually as icons for events outside the field of view.
              First-person becomes third, and something is lost in the
              translation, because a static icon carries little of the
              emotive content the sound carried. If timely or emotive
              information is lost in adaptation, the interface is not
              wholly accessible. That places a hard requirement on the{" "}
              <em>quality of the underlying abstract description</em>:
              in games, content may need to be described in terms as
              basic as whether the news is good or bad, so that
              whatever design space renders it can find an expression
              with equivalent force.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Sorting the seven</h2>
            <p>
              Seven devices, invented separately and judged separately,
              are a ledger rather than an argument. Sorting them by the
              kind of figure each one uses, metaphor, metonym, allegory
              or no figure at all, turns the ledger into a finding, and
              the finding is not the one I expected:{" "}
              <Link href="/adaptation/accessible-tetris/the-rhetoric-of-sound">
                the literal mappings failed and the figurative ones
                survived
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
