import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { TetrisSubNav } from "@/components/TetrisSubNav";

export const metadata: Metadata = {
  title: "Why assistive technology fails",
};

export default function WhyAssistiveTechnologyFails() {
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
            <h1>Why assistive technology fails</h1>
            <p className="lede">
              Screen readers transliterate; Tetris speaks in metaphor,
              geometry, and timing. A screen reader pointed at Tetris
              can say the score. It cannot say the game.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Transliteration and its limits</h2>
            <p>
              Metaphor, with its relatives metonym and synecdoche,
              plays a central role in guiding expectation in user
              interfaces: the desktop metaphor organizes data;
              traffic-light colours present line quality; a scrollbar
              presents relative position. Most interfaces yield up a
              large number of metaphors on inspection, with no
              guarantee of consistency between applications
              (&ldquo;pages&rdquo; in a browser and a word processor
              behave quite differently under zoom).
            </p>
            <p>
              Conventional assistive technology, such as screen
              readers and zooming tools, relies on{" "}
              <em>automated transliteration</em>{" "}between the default
              presentation and one suited to the user. Its success
              depends on how well it interprets the default
              presentation, including content expressed only through
              metaphor. As Barbosa put it, &ldquo;the appropriateness
              and sophistication of interpretations is directly
              proportional to the expressiveness of the underlying
              domain models&rdquo;. A screen reader would need the
              domain model of the platform <em>and</em>{" "}of every
              application, including each one&rsquo;s metaphors. In
              practical terms it can&rsquo;t have them. So screen
              readers transliterate little beyond the well-known
              metaphors of the host platform, and content carried by
              scalar representation or relative geometry is largely
              lost.
            </p>
            <p>
              The platform &ldquo;accessibility layers&rdquo;
              (Windows, macOS, Java) expose{" "}
              <em>instances of presentation elements</em>, with some
              alternative content. They do not expose a model of the
              interface, nor the mapping between content and
              presentation. That mapping is left for the AT vendor to
              hard-code, version by version.
            </p>
            <p>
              Now hold Tetris up against that machinery. Nearly
              everything that matters in the game is the kind of
              content transliteration loses: the silhouette is
              relative geometry; the fit between piece and gap is
              proximal, spatial, and continuous; urgency is carried by
              animation timing. A screen reader pointed at Tetris can
              say the score. It cannot say the game.
            </p>
            <p>
              The conclusion I drew, and the thesis of the wider
              research, is that accessibility of this kind of content
              cannot be retrofitted by inspection from outside. The
              application must be built over an{" "}
              <em>abstract model</em> of itself, with rendering, in
              whatever design space suits the user, treated as a
              service that consumes that model. Accessibility becomes
              an architecture, not a layer.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A vocabulary of game presentation metaphors</h2>
            <p>
              The first thing to strike me when dealing with Tetris as
              a developer was the lack of standardized metaphors for
              expressing computer games. I was so used to thinking in
              HTML for the web that I felt almost naked without the
              familiar document metaphor of headings, paragraphs,
              tables, and divisions supporting description and
              rendering. So the first task was to identify common
              presentation metaphors in games, as they apply to
              Tetris.
            </p>
            <p>
              <strong>Cockpit and head-up display.</strong> Classic
              Tetris is a cockpit: the playing area surrounded by
              instruments. A ghost piece overlaid on the playing area
              is head-up display; a version with both is a combination
              of the two.
            </p>
            <p>
              <strong>Immersive and observational.</strong> In an
              immersive game the user is at the centre of the action
              with a restricted field of view, as in a first-person
              shooter. In an observational game the user is an
              omnipotent observer of the whole playing area: Tetris,
              Pac-Man, Manic Miner. Hold this distinction; it becomes
              the pivot of the entire case study.
            </p>
            <p>
              <strong>Sprite-based animation.</strong> Elements
              perceived as appearing, moving within, and leaving the
              playing area. I identified eleven non-exclusive aspects
              of sprite behaviour: game-influenced; user-influenced;
              sprite-influenced; time-limited; morphing; translucent
              (the ghost); opaque; synchronized; handshaking (the
              tessellation of tile against landscape); pregnant (a
              locked tile separating into its four squares); and borg
              (those squares merging into the silhouette). A falling
              Tetris tile is simultaneously game-influenced,
              user-influenced, sprite-influenced, morphing, opaque,
              handshaking, pregnant, and borg. Each aspect has
              properties and potentially its own life-cycle
              describable as a finite state model; a sprite may take
              on and shed aspects as it moves through its life. The
              sprite has a state model, and so may each aspect of its
              behaviour.
            </p>
            <p>
              <strong>Canvas-based and grid-based playing areas</strong>
              , in 2-D and 3-D. Tetris is grid-based 2-D: sprites jump
              a perceptible cell at a time, emphasizing the grid.
            </p>
            <p>
              <strong>Gravity.</strong> Things <em>fall</em>, rather
              than merely move toward the bottom of the screen. You
              could play Tetris rotated ninety degrees, but the
              metaphor is emphatically falling bricks.
            </p>
            <p>
              <strong>History.</strong> The last <em>n</em>{" "}actions
              are remembered; the silhouette is the game&rsquo;s
              accumulated history made visible.
            </p>
            <p>
              <strong>Elapsed time.</strong> From game start (Tetris)
              or first move (chess). Chess reminds us there may be
              several clocks at once.
            </p>
            <p>
              This taxonomy did real work: it is what the adaptive
              renderer selects <em>against</em>. In the thesis&rsquo;s
              terms, characteristics of the underlying content are
              matched to <strong>Design Language Sets</strong>,
              coordinated groups of interaction modalities analogous
              to design patterns or web templates, and the taxonomy
              above is the vocabulary in which Tetris&rsquo;s
              characteristics get stated. The frame those sets live
              inside is{" "}
              <Link href="/research/cisna-model">
                the CISNA Model
              </Link>{" "}
              of accessible adaptive hypermedia, the thesis&rsquo;s
              core contribution, published at W4A 2008. CISNA rebuilds
              the Dexter Reference Model of hypertext into five
              layers: <em>Adaptation</em> (selecting among
              alternatives by user, device, and context),{" "}
              <em>Navigation</em> (links and traversal),{" "}
              <em>Semantics</em> (composition and meaning, with
              ontologies and rules), <em>Inventory</em> (the formatted
              media elements available for use), and{" "}
              <em>External Content</em> (the raw content beneath). The
              Tetris work was an investigation of how DLSs for a
              real-time game could be expressed through CISNA: the
              game&rsquo;s abstract events live at the Semantics
              layer, the metaphors of the next part are Inventory, and
              the choice of which metaphors a given player receives is
              the Adaptation layer doing its job.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
