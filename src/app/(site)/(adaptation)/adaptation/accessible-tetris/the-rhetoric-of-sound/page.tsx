import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { TetrisSubNav } from "@/components/TetrisSubNav";

export const metadata: Metadata = {
  title: "The rhetoric of sound",
};

export default function TheRhetoricOfSound() {
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
            <h1>The rhetoric of sound</h1>
            <p className="lede">
              Sound offers about seven dependable dimensions, in
              series, against a screen that offers many in parallel.
              That shortage forces every sonic interface into figures
              of speech, and sorting my seven devices by the figure
              each one uses turns up a pattern I did not expect.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The seven dimensions of audible meaning</h2>
            <p>
              Before deciding how to say something in sound, it is
              worth being blunt about how much sound can say. Setting
              aside speech, which is expensive in both time and
              attention, the dimensions an untrained listener decodes
              reliably are few:
            </p>
            <ul>
              <li>
                <strong>Azimuth</strong>, the left-right position of a
                source. The strongest of the lot, and the one that
                needs no explanation to anybody.
              </li>
              <li>
                <strong>Pitch</strong>, high and low, which maps
                readily onto up and down, more and less, near and far.
              </li>
              <li>
                <strong>Loudness</strong>, which reads as proximity or
                as insistence.
              </li>
              <li>
                <strong>Tempo and pulse rate</strong>, which read as
                urgency almost universally.
              </li>
              <li>
                <strong>Timbre</strong>, the character of a sound,
                which carries identity and category: this is a
                different kind of thing from that.
              </li>
              <li>
                <strong>Consonance and dissonance</strong>, which read
                as resolved and unresolved, settled and unsettled,
                good and bad.
              </li>
              <li>
                <strong>Voice identity</strong>, a speaker being
                recognisably a different speaker, which sorts
                information into streams without a word spent on
                saying so.
              </li>
            </ul>
            <p>And then the weak ones.</p>
            <ul>
              <li>
                <strong>Elevation</strong>{" "}is far coarser than people
                expect: perhaps five distinguishable bands, not the
                twenty rows of a Tetris well.
              </li>
              <li>
                <strong>Reverberation and brightness</strong>{" "}suggest
                distance and enclosure, but vaguely.
              </li>
              <li>
                <strong>Front and back</strong>{" "}are close to unusable
                over headphones, because the brain resolves them
                largely through small head movements, and somebody
                sitting at a screen with headphones on does not make
                them reliably.
              </li>
            </ul>
            <p>
              That is roughly seven dependable dimensions, delivered in
              series, against a visual display offering position in two
              dimensions, colour, size, shape, texture, motion and
              persistence, all in parallel and all continuously
              available. The asymmetry is not a detail. It is the
              design constraint that generates everything else, and the
              PhD build makes the point in miniature: the whole
              soundscape was barely a dozen wav samples deep, doing the
              work of a screenful of pixels.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why the shortage forces figures</h2>
            <p>
              There is far more to say than there are literal channels
              to say it in. So transliteration is not available, and
              one thing has to stand for another. The figure chosen is
              not decoration laid over the interface. It{" "}
              <em>is</em>{" "}the interface, and it is doing compression.
            </p>
            <p>
              Rhetoric has careful names for the ways one thing stands
              for another, and the distinctions turn out to be
              practical rather than academic:
            </p>
            <ul>
              <li>
                <strong>Metaphor</strong>{" "}maps across domains on the
                basis of resemblance. Something in the target behaves{" "}
                <em>like</em>{" "}something in the source, and the
                listener transfers the structure. Falling water for a
                falling tile is metaphor.
              </li>
              <li>
                <strong>Metonym</strong>{" "}works by association and
                contiguity rather than resemblance. What stands in is
                not similar to what it represents; it is connected to
                it, adjacent to it, part of its world. The crown for
                the monarchy. A different voice for a different
                category of information. Its close relative{" "}
                <strong>synecdoche</strong>{" "}substitutes a part for
                the whole, which is what a footstep does when it
                represents a person walking.
              </li>
              <li>
                <strong>Allegory</strong>{" "}is not a single
                substitution at all. It is a sustained frame in which
                many substitutions cohere, a whole small world within
                which the individual mappings make sense together and,
                importantly, within which the listener can reason.
              </li>
            </ul>
            <p>
              To those three I would add the case that is not a figure
              at all, and which turns out to be the most instructive:
              the <strong>literal</strong>{" "}mapping, where a thing
              simply is itself. Direction represents direction.
              Distance represents distance. The auditory-display field
              has long had a version of this distinction, separating
              sounds that resemble their source from sounds that stand
              in by pure convention. What this work suggested to me is
              that the interesting boundary is not between resemblance
              and convention. It is between the literal and the
              figurative.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The seven devices, sorted by figure</h2>
            <p>
              Sorting the devices of{" "}
              <Link href="/adaptation/accessible-tetris/the-sonic-design-space">
                the previous section
              </Link>{" "}
              by the figure each one uses puts the field notes in a
              different light:
            </p>
            <ul>
              <li>
                <strong>Gravity as waterfall</strong>{" "}is metaphor at
                its most effective, and it worked outright. It asks
                nothing of the player, because everybody already knows
                what approaching water means. That is the tell: the
                best metaphors are grounded in bodily experience the
                listener acquired long before meeting the interface.
              </li>
              <li>
                <strong>Musical sonar</strong>{" "}is metaphor of a more
                demanding kind, since sonar is not an experience most
                people have had. It worked, but new listeners took a
                while, and a training mode belongs in any future
                version. Metaphor drawn from something known only by
                description has to be taught.
              </li>
              <li>
                <strong>Aside</strong>{" "}is metonym, and theatrical: a
                whisper does not resemble low-priority information, it
                is associated with it, in the way whispers are
                associated with confidences. Cheap and reliable.
              </li>
              <li>
                <strong>Talking scrollbar</strong>{" "}is a figure
                borrowed from a figure, a scrollbar being already a
                metaphor for relative position. It half worked, and had
                to be coarsened to three positions.
              </li>
              <li>
                <strong>Dancing margins</strong>{" "}began literal, using
                real three-dimensional distance for grid distance,
                and failed. It was rescued only when the dance became a
                dance in <em>music</em>{" "}rather than in location: a
                symbolic encoding carrying what position could not.
              </li>
              <li>
                <strong>Direction as direction</strong>{" "}is literal,
                as the name concedes, and it failed most completely of
                all. What replaced it was{" "}
                <strong>voice identity</strong>, a different speaker
                meaning a different category, which is metonym and
                worked immediately and for free.
              </li>
              <li>
                <strong>Braided audio</strong>{" "}is not a figure at
                all. Nothing stands for anything. It is closer to
                prosody or rhetorical emphasis, being about how
                attention is allocated across what is said rather than
                what any part of it means.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>
              The finding: literal mappings failed, figurative ones
              survived
            </h2>
            <p>
              Lined up that way the pattern is hard to miss. Direction
              as direction failed outright. Dancing margins failed as
              literal spatialisation and had to be rescued
              symbolically. The talking scrollbar had to be coarsened
              until it was barely spatial. Meanwhile the waterfall, the
              aside, the substitute voice and the braid all worked, and
              the sonar worked with teaching.
            </p>
            <p>
              I do not think this is an accident of a weak 2009 audio
              engine, though the engine certainly was weak. The literal
              channels are the ones where sound has the least
              resolution to offer: fine elevation, fine distance, front
              and back. Reaching for the literal means asking the
              medium for accuracy it does not have. Reaching for a
              figure means asking the listener for an inference they
              can make effortlessly, using knowledge they already hold.
              The figure is not a compromise forced by a poor engine.
              It is the medium&rsquo;s native strength.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Sequence and proportion as meaning</h2>
            <p>
              Braided audio deserves separating out, because it is the
              one device that operates on a different level from the
              rest. Playing the sonar and the margins at once, even
              from radically different locations, was discordant and
              distracting, so I serialised them into a braid and used
              the braid <em>ratio</em>{" "}to express priority: two
              sweeps of the sonar for every sweep of the margins,
              because tessellation matters more than margins while a
              piece is falling.
            </p>
            <p>
              It does two jobs at once, sharing a single channel and
              encoding relative importance in the sharing. The general
              point is worth stating plainly, because it is a channel
              most interface designers never think to use: in a serial
              medium, the order and proportion in which things are said
              is itself a carrier of meaning.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What the figures are, and are not</h2>
            <p>
              A caution about status, because it would be easy to read
              the ledger above as findings. The seven devices are not
              the contribution. They are{" "}
              <em>reifications</em>: particular, contingent instances
              of underlying principles, built so that the principles
              had something to be tested through. Whether falling water
              is the best available figure for gravity is an empirical
              question I have not answered.
            </p>
            <p>
              The claims are the general ones. That the literal
              channels are thin and the figurative ones rich. That a
              serial medium makes sequence and proportion into carriers
              of meaning. That spending one perceptual dimension twice
              creates a collision, as{" "}
              <Link href="/adaptation/accessible-tetris/the-record">
                the record
              </Link>{" "}
              sets out at my own expense. That sound has no
              third-person vantage point to offer. The seven examples
              are how I arrived at those claims rather than the
              evidence that settles them, and the examples deserve
              replacing wherever something better is found.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
