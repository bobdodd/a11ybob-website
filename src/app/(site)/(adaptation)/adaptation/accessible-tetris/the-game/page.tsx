import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { TetrisSubNav } from "@/components/TetrisSubNav";

export const metadata: Metadata = {
  title: "The game and the player",
};

export default function TheGame() {
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
            <h1>The game and the player</h1>
            <p className="lede">
              The rules as specified, and the cognitive load they
              place on the player: five contemporaneous information
              channels, five distinct timeouts, and a game that is
              almost completely visual by specification.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The game</h2>
            <p>
              There are many variations on the classic 1985 game.
              Modern licensed versions conform to the Tetris
              Guidelines controlled by The Tetris Company; the
              guidelines themselves are available only to licensees,
              but community documentation derived from studying
              licensed games describes them well.
            </p>
            <p>
              The essentials: the game is about managing falling
              bricks so that they form complete horizontal lines
              within the playing area. Each completed line disappears
              and scores points; completing multiple lines
              simultaneously multiplies the score. The falling bricks
              are one of seven defined shapes, the tetrominoes, each
              constructed within a 4&nbsp;×&nbsp;4 frame and occupying
              four squares of it.
            </p>
            <figure>
              <img
                src="/images/adaptation/fig-tetrominoes.png"
                alt="The seven tetromino shapes, each drawn as four connected squares within a four-by-four frame, labelled I, O, T, S, Z, J and L. The I is a horizontal bar, the O a square, the T a bar with a centre stem, S and Z mirrored zigzags, J and L mirrored hooks."
                width="1960"
                height="480"
              />
              <figcaption>The seven tetrominoes.</figcaption>
            </figure>
            <p>
              The playing area is a visible grid of 10 columns by 20
              rows, with two hidden rows at the top in which pieces
              begin their fall. As a piece falls the player may move
              it left and right and rotate it, subject to rotation
              rules that vary between versions; modern licensed games
              use the Super Rotation System (SRS). A piece falls until
              it reaches the bottom row or is impeded by an
              already-fallen piece. For a short period after landing
              it remains movable, so it is possible to slide a piece
              sideways under an overhang, and potentially for it to
              begin falling again. Once the piece times out into its{" "}
              <strong>locked</strong> position, the next piece begins
              to fall. The game ends when the stack reaches the top of
              the visible area so that a new piece cannot begin its
              descent.
            </p>
            <p>
              The next shape is always known to the player. The
              Guidelines add a <strong>hold</strong> box: the current
              falling piece may be swapped out, once, for either the
              previously held piece or (if the box is empty) the next
              piece. Modern versions also require a{" "}
              <strong>ghost</strong> piece, a translucent projection
              showing where the current piece would land if
              hard-dropped; it supports the <strong>hard drop</strong>{" "}
              control for players happy with that position. Ten levels
              of play raise the fall speed every ten completed lines.
              Control on a PC is by keyboard, with specific keys
              mandated by the Guidelines, and press-and-hold
              auto-repeat on lateral movement. Finally there are the
              corner cases, literally: rules for rotating a piece
              perched against the corner of another, the celebrated{" "}
              <strong>T-spins</strong>, which score bonus points.
            </p>
            <p>
              The game as specified is almost completely visual,
              demanding visual pattern-matching in a time-limited
              environment. The sound specification is limited to
              requiring particular Russian folk music. Haptically, the
              game is optimized to key presses. That asymmetry, with
              everything in one design space and almost nothing in the
              others, is what made it the right case study.
            </p>
            <p>
              One thing has changed since I first wrote this
              description: the stacker community has codified the
              modern game far more thoroughly than the leaked-guideline
              documents of the 2000s. SRS kick tables, the 7-bag
              randomizer, DAS/ARR movement-tuning conventions, and
              T-spin scoring are now community-documented standards,
              with open implementations (NullpoMino most completely)
              serving as de-facto behavioural references. Behavioural
              correctness is now checkable, not a vibe, which makes
              fidelity an explicit <em>choice</em> rather than an
              accident. A demonstrator of adaptation techniques can
              legitimately choose a simpler rule subset, provided the
              choice is stated rather than smuggled.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What Tetris asks of the player</h2>
            <p>
              Tetris is a deceptively simple game that places
              significant cognitive load on the player, especially as
              speed picks up. The player is expected to:
            </p>
            <ol type="a">
              <li>Recognize seven basic tiles.</li>
              <li>
                Follow the movement of one tile down the playing area
                whilst assessing its landing position.
              </li>
              <li>
                Match the outline of a moving tile to gaps in the
                silhouette at the bottom of the playing area.
              </li>
              <li>
                Optimize that match to fill horizontal lines in order
                to score points.
              </li>
              <li>
                Optimize that match to take account of the known next
                tile.
              </li>
              <li>
                Optimize that match to take account of how some tiles
                can rotate around the corners of obstacles.
              </li>
              <li>
                Optimize that match to fill more than one line
                simultaneously, for the score multiplier.
              </li>
              <li>
                Optimize that match by holding, and later re-using,
                currently unsuitable tiles.
              </li>
              <li>
                Match not only vertical gaps in the silhouette but
                horizontal gaps related to its raggedness.
              </li>
              <li>
                Continue to succeed at (a) through (i) whilst the game
                speed increases.
              </li>
            </ol>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Contemporaneous elements</h2>
            <p>In terms of game state, there are nine elements alive at once:</p>
            <ol type="a">
              <li>
                The current tile, its relationship to the playing
                area, and the time it has dwelled at its position (for
                game speed and for the lock timeout).
              </li>
              <li>
                Previous tiles still visible in the playing area,
                forming the current silhouette.
              </li>
              <li>
                The relationship of the current tile to its ghost
                position relative to the silhouette.
              </li>
              <li>The shape of the next tile.</li>
              <li>The shape of the held tile, if any.</li>
              <li>The current level.</li>
              <li>The number of lines completed.</li>
              <li>The current score.</li>
              <li>Historic high scores.</li>
            </ol>
            <p>
              Their importance varies through the game. While a tile
              is falling, the player needs (a) through (e); (f)
              through (i) matter once a tile has locked and
              line-completeness has been determined. That still leaves{" "}
              <strong>five contemporaneous information channels</strong>{" "}
              during the fall, some far from trivial; the
              tile-to-landscape relationship is a continuously
              changing spatial judgement. A sighted player absorbs all
              five in a single glance. This, condensed to one
              sentence, is the whole accessibility problem:{" "}
              <em>
                vision is a parallel medium and sound is a serial one
              </em>
              , and any sonic rendering must ration what it says.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Timing considerations</h2>
            <p>Five distinct timeouts operate inside the game:</p>
            <ol type="a">
              <li>
                Dwell time for a falling tile as it passes through
                each row.
              </li>
              <li>
                The lock timeout when a falling tile meets an
                obstruction.
              </li>
              <li>
                The delay before the next tile appears after the
                current one locks.
              </li>
              <li>The auto-repeat rate for move-left and move-right.</li>
              <li>
                The key dwell time needed to recognize a press at all.
              </li>
            </ol>
            <p>
              Each is impacted by user capability and by device
              capability. This list turned out to carry a lot of
              architectural weight: every one of these timings
              eventually became a <em>negotiation</em>{" "}between the
              game and the user interface rather than a constant. The
              scale of the eventual accommodation is worth noting. In
              the working PhD implementation, the per-row fall delay
              ran at 300&nbsp;ms in the visual configuration and
              4,000&nbsp;ms in the sonic one: the same game, thirteen
              times slower, and still recognizably Tetris.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
