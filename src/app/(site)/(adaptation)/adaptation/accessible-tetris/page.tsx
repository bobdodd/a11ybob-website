import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { TetrisSubNav } from "@/components/TetrisSubNav";
import { NewTabLink } from "@/components/NewTabLink";

export const metadata: Metadata = {
  title: "Accessible Tetris: a case study",
};

export default function AccessibleTetris() {
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
            <h1>Accessible Tetris: a case study</h1>
            <p className="lede">
              What it means for Tetris to be accessible: an
              exploration of design method and interaction
              modalities from my doctoral research, with working
              examples of techniques, revisited for the modern web.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why Tetris?</h2>
            <p>
              My PhD thesis used two case studies. The first looked at
              user and context profiling; the second looked at the
              rendering of content to match a given profile. Tetris
              was the second case study, and these pages are a
              self-contained account of it: what the game demands of a
              player, why conventional assistive technology cannot
              meet those demands, the interaction metaphors and
              software architecture I built in response, and what I
              learned along the way. The account closes with the
              design for a web-based demonstrator of these techniques,
              using spatial audio that browsers can now deliver
              natively.
            </p>
            <p>
              Let me state the claim of this work carefully, because
              it is easy to misread and I have no wish to oversell it.
              The claim is <strong>not</strong> that I created an
              accessible Tetris game. The claim is that I considered{" "}
              <em>what it means</em> for Tetris to be accessible, as
              an exploration of design method and interaction
              modalities, with working, exploratory examples of some
              of the techniques. The 2009 work was about method and
              modality, not delivery. The adaptation it explored was
              grounded in my capability-modelling work and in the{" "}
              <Link href="/research/cisna-model">CISNA model</Link> of
              expressed adaptation that forms the core of the thesis.
              The web build these pages now serve is of the same
              character: a simple version of the game, constructed to
              demonstrate those techniques in action and to reference
              directly back to the CISNA work. It is not a finished
              product claiming to have solved the problem.
            </p>
            <p>
              I chose Tetris deliberately, to be difficult: because it
              is hard, not because it was doable. The classic static
              view of content embodied in the web&rsquo;s document
              models, and in operating-system &ldquo;accessibility
              layers&rdquo;, is a solved problem by comparison. A
              dynamic, animated game with retained state, random
              elements, and hard timing is a challenge of a different
              order. What really defeats existing assistive technology
              is the <em>proximal</em>{" "}content inherent in the game:
              rotating and guiding falling shapes to match gaps in the
              landscape below. A screen reader can tell you a
              button&rsquo;s name. It has no vocabulary at all for
              &ldquo;the T-piece is two columns left of a T-shaped
              hole and falling fast&rdquo;. If an approach to
              accessibility claims to be better than existing
              assistive technology, this is the kind of context where
              it must prove itself.
            </p>
            <figure>
              <img
                src="/images/adaptation/fig-board.png"
                alt="Annotated diagram of a Tetris playing area, ten columns wide by twenty visible rows. A purple T-shaped tile is falling mid-field, and a dashed T outline near the bottom marks its ghost landing position. The stack of locked tiles across the bottom forms the silhouette, with an arrow marking a one-column gap in it. Side panels show a Hold box containing a J piece, a Next box containing an S piece, and a score panel reading score 1400, lines 17, level 2. A dashed strip above the field marks the two hidden spawn rows."
                width="1960"
                height="1280"
              />
              <figcaption>
                The anatomy of Tetris: playing area, falling tile,
                ghost position, silhouette, next and held pieces.
              </figcaption>
            </figure>
            <p>
              Tetris also demanded adaptation both <em>within</em> and{" "}
              <em>between</em> design spaces (visual, sonic, and
              haptic). Since the target hardware was an unmodified
              laptop, haptic adaptation was constrained to user input
              and its feedback rather than general content
              presentation, which concentrated the research question
              nicely: can the full state of a real-time spatial game
              be delivered through sound?
            </p>
            <p>
              Two outcomes interested me: the impact on user-interface
              design of designing <em>for adaptability</em>, and the
              practical ease (or otherwise) of adapting content to
              match user capability and context. A degree of failure
              was expected, particularly where time-critical,
              contemporaneous information streams meet the
              comparatively low bandwidth of the sonic design space.
              That expectation shaped the architecture, as the later
              pages show.
            </p>
            <p>
              This revision of the case study also does something the
              original could not: it holds the work up against the
              wider record, taking in the cognitive science of Tetris,
              the accessible-games literature, and what players and
              studios have built since.{" "}
              <Link href="/adaptation/accessible-tetris/the-record">
                The record
              </Link>{" "}
              reports plainly where that record supports these
              concepts, where it challenges them, and what I simply
              had not considered.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The parts</h2>
            <ol>
              <li>
                <Link href="/adaptation/accessible-tetris/the-game">
                  The game and the player
                </Link>
                : the rules as specified, and the cognitive load they
                place on a player.
              </li>
              <li>
                <Link href="/adaptation/accessible-tetris/why-assistive-technology-fails">
                  Why assistive technology fails
                </Link>
                : transliteration, metaphor, and a vocabulary for game
                presentation.
              </li>
              <li>
                <Link href="/adaptation/accessible-tetris/the-sonic-design-space">
                  The sonic design space
                </Link>
                : seven invented audio metaphors with field notes, and
                the first-person shift they revealed.
              </li>
              <li>
                <Link href="/adaptation/accessible-tetris/an-architecture-for-adaptation">
                  An architecture for adaptation
                </Link>
                : domains, the asynchronous bridge, and state models
                whose game clock waits for the user.
              </li>
              <li>
                <Link href="/adaptation/accessible-tetris/what-the-browser-makes-possible">
                  What the browser makes possible
                </Link>
                : the spatial-audio design for the web, from timbres
                to the listening views.
              </li>
              <li>
                <Link href="/adaptation/accessible-tetris/the-record">
                  The record
                </Link>
                : where the research literature supports these
                concepts, challenges them, and exposes blind spots.
              </li>
              <li>
                <Link href="/adaptation/accessible-tetris/from-case-study-to-demonstrator">
                  From case study to demonstrator
                </Link>
                : the plan for the web build, and its commitments.
              </li>
            </ol>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Materials</h2>
            <p>
              The full case study, its figures, the research notes,
              and the engineering design live in the project
              repository:{" "}
              <NewTabLink href="https://github.com/bobdodd/accessible-tetris">
                accessible-tetris on GitHub
              </NewTabLink>
              . The theoretical frame is{" "}
              <Link href="/research/cisna-model">the CISNA Model</Link>
              ; the research-vehicle argument is at{" "}
              <Link href="/research/tetris-testbed">
                Tetris as accessibility testbed
              </Link>
              . Tetris® is a trademark of The Tetris Company; this is
              non-commercial accessibility research, and no Tetris
              Company assets are used.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
