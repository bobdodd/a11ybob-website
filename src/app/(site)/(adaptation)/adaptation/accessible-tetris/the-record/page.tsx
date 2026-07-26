import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { TetrisSubNav } from "@/components/TetrisSubNav";
import { NewTabLink } from "@/components/NewTabLink";

export const metadata: Metadata = {
  title: "The record against my concepts",
};

export default function TheRecord() {
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
            <h1>The record against my concepts</h1>
            <p className="lede">
              In 2026 I surveyed what others have said about Tetris
              and accessibility, the audio-game lineage, the
              accessible-game-design literature, and the open-source
              landscape. This page reports what I found, plainly: this
              is research, not marketing.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A calibration first</h2>
            <p>
              The claims being tested here are the exploratory ones
              stated in the introduction, a method, a set of
              modalities, and worked examples, not a delivery claim.
              Some of what follows would be damning against &ldquo;I
              built an accessible Tetris&rdquo;; against &ldquo;I
              explored what accessible Tetris means&rdquo;, several of
              the same findings are simply the exploration doing its
              job and returning results. I have tried to keep that
              distinction visible without using it as a shield. The
              annotated survey notes, with sources, are in the{" "}
              <NewTabLink href="https://github.com/bobdodd/accessible-tetris/blob/main/docs/research.md">
                research notes on GitHub
              </NewTabLink>
              .
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where the record supports the work</h2>
            <p>
              <strong>
                The architecture was right, and independently
                invented.
              </strong>{" "}
              The FORTH unified-design work is the strongest support{" "}
              <em>because</em> it is parallel invention: two groups,
              unaware of each other, concluded that accessible dynamic
              content requires an abstract game adaptively rendered
              per user. When independent lines of work converge on a
              structure, the structure is probably sound.
            </p>
            <p>
              <strong>Epistemic action gives the sonar its theory.</strong>{" "}
              Kirsh and Maglio&rsquo;s classic Tetris studies showed
              that expert players{" "}
              <em>
                physically rotate pieces rather than mentally rotating
                them
              </em>
              : external action is cheaper than internal simulation,
              so experts offload cognition onto the world. My musical
              sonar re-scanning on every rotation is this loop rebuilt
              in sound; the re-scan is the payoff of the epistemic
              action, restored in another design space. In 2009 I had
              the mechanism but not the name. The cognitive-science
              literature had the name all along.
            </p>
            <p>
              <strong>Tetris really is visuospatial to its core.</strong>{" "}
              Emily Holmes&rsquo;s line of work uses Tetris to disrupt
              traumatic-memory consolidation <em>because</em>{" "}the game
              saturates visuospatial working memory. That is
              independent experimental confirmation of this case
              study&rsquo;s central premise: a sonic rendering is not
              translating decoration, it is re-housing the
              game&rsquo;s entire cognitive substance.
            </p>
            <p>
              <strong>
                The mainstream caught up and validated the instincts.
              </strong>{" "}
              Forza Motorsport&rsquo;s Blind Driving Assists steer a
              racing game, a harder real-time spatial problem than
              Tetris, entirely through layered, player-tunable audio
              cues: commercial-scale proof that the layered-soundscape
              approach works. Celeste&rsquo;s assist mode made
              player-controlled difficulty a celebrated design
              pattern, which is my mixing desk&rsquo;s philosophy of
              information density as the player&rsquo;s dial. The Last
              of Us Part II set full completion without sight, not a
              side-mode, as the industry bar, which is the full-game
              principle as product requirement. And the Audio Game
              Hub&rsquo;s six-figure download counts document the
              demand the audio-games community has always asserted.
            </p>
            <p>
              <strong>
                The one direct predecessor validates the problem by
                dodging it.
              </strong>{" "}
              The only published academic sound-Tetris made the game
              audible by simplifying it, reportedly to a single piece
              type. It confirms both that the problem is real and that
              the obvious escape route exists. The distinction I want
              to hold is between simplification as{" "}
              <em>the accessibility solution</em> (making the
              rendering work by gutting the game, a one-piece Tetris
              presented as Tetris made accessible) and simplification
              as <em>demonstrator scope</em>, where the techniques are
              designed against the real game and a stated subset of it
              is implemented to exhibit them. My 2009 build ran all
              seven pieces at dilated tempo; the coming web
              demonstrator will state its subset openly. The
              unified-design school and the disability
              community&rsquo;s own standards both aim adaptation at
              the whole game. The exploratory point is to learn how
              far that aim can be carried, not to redefine the target
              downward and declare victory.
            </p>
            <p>
              <strong>Time dilation became codified practice.</strong>{" "}
              The accommodation that looked most radical in 2009,
              stretching the game clock thirteen-fold for the sonic
              configuration, is now an industry pattern with a name.
              The Game Accessibility Guidelines carry a specific
              guideline to{" "}
              <em>include an option to adjust the game speed</em>{" "}
              (&ldquo;issues with precise timing can be alleviated
              very effectively with a choice of game speed&rdquo;);
              AbleGamers&rsquo; APX catalogue has a challenge pattern
              called <em>Slow It Down</em>; Celeste ships a 50–100%
              game-speed setting and Forza Horizon 5 goes to 40%. My
              exploration arrived at the pattern from first
              principles, the game must wait for the user, a decade
              before it was catalogued. The demonstrator should honour
              that lineage by making speed a visible, first-class
              percentage setting rather than a buried timeout.
            </p>
            <p>
              <strong>
                The manual/automated split called the industry&rsquo;s
                path.
              </strong>{" "}
              The 2009 work envisioned two adaptation approaches,
              manual (designer-built templates per capability profile)
              and automated (the game self-adapting), and expected the
              automated one to fail more often. The record since is
              striking. The industry&rsquo;s accessibility wins have
              come almost entirely from the manual path of
              player-controlled assist modes, speed sliders, and
              remapping, while dynamic difficulty adjustment, a mature
              literature for <em>engagement</em>, remains
              conspicuously thin on disability. The
              assistive-technology abandonment literature suggests
              why: the strongest predictors of abandonment include
              lack of user involvement and control, which is what
              automated adaptation takes away. My old skepticism reads
              better with age than I had any right to expect. The
              automated path is still open, as research, with the same
              caution attached.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where the record challenges it</h2>
            <p>
              <strong>
                Temporal parity: my own numbers are the sharpest
                challenge.
              </strong>{" "}
              My PhD build preserved every rule and ran the sonic
              configuration at 4,000&nbsp;ms per row against the
              visual 300&nbsp;ms, a thirteen-fold time dilation. The
              one academic predecessor simplified the <em>rules</em>;
              I simplified <em>time</em>. Read against a delivery
              claim that would be a failure; read against the
              exploratory claim it is the <em>finding</em>, a first
              measurement of where the modality boundary actually
              lies, which is the kind of result choosing a too-hard
              problem is supposed to produce. But the finding still
              challenges any successor. Continuing to succeed as speed
              increases may simply be unreachable in audio at visual
              tempos, and that possibility has to be inherited
              honestly, not promised away. Is a game whose identity
              includes time pressure still &ldquo;the full
              game&rdquo; when time-dilated by an order of magnitude?
              I do not have a clean answer. The most defensible
              position, and the one Celeste&rsquo;s assist mode
              models, is that parity of <em>rules</em> is the goal to
              hold to, while parity of <em>tempo</em> is a per-player
              setting on a continuous axis, speed being itself a
              capability dimension. The corollary must be stated:
              cross-modal score comparison is then meaningless, and
              the sonic game is the same game played at a different
              point in the speed-difficulty space. An accommodation,
              not an equivalence.
            </p>
            <p>
              <strong>
                Audio may invert the expert&rsquo;s cheapest move.
              </strong>{" "}
              The epistemic-action result supports the sonar and cuts
              against the wider design. Physical rotation is a net win
              for sighted experts{" "}
              <em>because feedback is instant and free</em>. In my
              design, rotation triggers announcements that cost
              seconds: braided, serialized, possibly queued behind
              other updates. If rotating-to-see becomes expensive,
              audio players are pushed back toward the mental
              simulation that sighted experts demonstrably avoid; the
              design would punish the very strategy that makes experts
              expert. The consequence is a hard requirement the 2009
              design never stated. The rotation-to-fit feedback loop
              must be the <em>fastest</em> path in the soundscape, a
              sub-second burst, always interruptible by the next
              rotation, whatever the general interruptibility policy
              says. Latency budgets, not just modality characters,
              belong in the capability model.
            </p>
            <p>
              <strong>
                Modern AI interpretation weakens the transliteration
                argument, partly.
              </strong>{" "}
              My critique of assistive technology rested on
              Barbosa&rsquo;s dictum that interpretation is bounded by
              the expressiveness of the interpreter&rsquo;s domain
              models, and in 2009 that bound was crippling. In 2026,
              agentic overlays are making <em>existing</em>{" "}
              inaccessible games playable by having large models
              interpret the screen, and large models carry enormous
              implicit domain knowledge, including of Tetris. An LLM
              watching the board genuinely can narrate the game. What
              it cannot do is <em>re-house</em>{" "}it. Interpretation of
              the visual rendering inherits the visual information
              architecture, the flat rectangle and the observational
              stance; it can describe the board but not make it a
              place around the player. The first-person shift remains
              beyond transliteration&rsquo;s reach, because it is not
              a description of the screen at all. But my field&rsquo;s
              2009-era claim that AT &ldquo;cannot catch&rdquo;
              metaphor-borne content is now only half true, and this
              case study&rsquo;s argument must be restated more
              modestly. Interpretation is no longer impossible; it is
              second-best. Demonstrating <em>how much</em> better
              native abstract-model rendering is has become an
              empirical obligation rather than an assertion.
            </p>
            <p>
              <strong>
                Generic HRTF will under-deliver for some players.
              </strong>{" "}
              My psychoacoustic rules assume the textbook figures, but
              the browser&rsquo;s HRTF is one generic head, with no
              individualization, and real listeners vary. Elevation
              discrimination and front/back resolution will straggle
              the lab numbers for a meaningful fraction of players; my
              five elevation zones may still be optimistic for some
              ears. This does not break the design, because redundant
              coding was already a rule, but it promotes redundancy
              and per-user cue weighting from good practice to
              necessity, and it makes the wobble&rsquo;s effectiveness
              something to <em>measure</em>, not assume.
            </p>
            <p>
              <strong>My own palette has an internal collision.</strong>{" "}
              The PhD musical sonar encoded fit quality as pitch:{" "}
              <em>higher is better</em>. The new terrain scan encodes
              column height as pitch: <em>higher is taller</em>, and
              taller is danger. Walker&rsquo;s auditory-display work
              established that mapping polarity is an empirical matter
              that designers guess wrong, and here I have two of my
              own metaphors assigning opposite valences to the same
              channel. If both survive into the build unresolved, the
              player meets pitch meaning &ldquo;good&rdquo; in one
              phrase and &ldquo;threat&rdquo; in the next. Before
              implementation, one of three resolutions must be chosen:
              separate registers/timbres for the two metaphors,
              retiring pitch-fit in favour of the terrain scan&rsquo;s
              consonance-as-quality encoding, or retiring the old
              sonar entirely. This is the kind of defect a design
              review against the literature is for. Because I was
              evaluating each metaphor independently, the clash was
              invisible: it only surfaced when I set out to build a
              newer and more complete version and put the old and new
              palettes into a single table.
            </p>
            <p>
              What may yet save both encodings is the concept of
              adaptation itself. Adapting for a person means holding a
              large catalogue of interaction techniques and selecting
              among them to meet capability in a context of use, so
              one player might receive the pitch-fit sonar and another
              the consonance encoding, without either being{" "}
              <em>the</em>{" "}answer. Two metaphors that collide when
              stacked in one rendering may sit perfectly well as
              alternatives the{" "}
              <Link href="/research/cisna-model">Adaptation layer</Link>{" "}
              chooses between. That is what the CISNA model was for.
            </p>
            <p>
              <strong>
                Novel interfaces face an abandonment base rate, and
                adaptations carry social meaning.
              </strong>{" "}
              The assistive-technology literature reports 30–40% of
              devices abandoned, with the predictors being lack of
              user voice in selection, inadequate training, poor
              performance, and unmet changing needs. A seven-metaphor
              novel soundscape could trip every one of them. And the
              player-motivation research (Beeston, Power, Cairns,
              Barlet) found that what disabled players value most is{" "}
              <em>
                feeling enabled, on a level footing, playing the same
                game as everyone else
              </em>
              . That finding pulls in two directions for this work. It
              supports full-rules adaptation, and it warns that an
              audio Tetris <em>experienced as the special version</em>{" "}
              would miss the very thing players say they want, however
              good its rendering. The Sekiro discourse showed how much
              stigma can attach to accommodation, and Celeste&rsquo;s
              assist-mode wording change showed the remedy is partly
              editorial: the language around an adaptation carries as
              much dignity or stigma as the mechanism. The social
              meaning of the sonic view is a design surface I had
              treated as neutral. It is not.
            </p>
            <p>
              <strong>Nothing here is evaluated. Still.</strong>{" "}Every
              metaphor&rsquo;s pass/fail is one designer&rsquo;s
              introspection. For exploratory work that is a legitimate
              place to stop, since hypothesis generation is what
              exploration is for, and the field&rsquo;s evaluation
              standards existed in 2009 (I cited them in my own
              reading notes) because the thesis planned a later stage
              it never reached. The trap to avoid now is inheritance.
              The demonstrator must treat &ldquo;works surprisingly
              well&rdquo; as a hypothesis it helps test, never as
              established fact it builds upon.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What I simply hadn&rsquo;t considered</h2>
            <p>
              <strong>Co-design, and its limits here.</strong>{" "}The
              pattern behind the recent successes is hard to miss.
              Forza&rsquo;s blind-driving assists were built through
              years of collaboration with blind consultants; The Vale
              was developed with CNIB consultation. My plans, 2009 and
              2026 alike, treated blind players as <em>evaluators</em>{" "}
              at the end of the pipeline, not designers at the start of
              it. I work as a consultant in digital accessibility,
              surrounded by the expertise those studios went looking
              for, so the gap would be an easy one to close.
            </p>
            <p>
              Maybe. Having sat with that criticism, I think it
              misidentifies what this work is. Research is not product
              design. It proposes a thesis, hypotheses and research
              questions, and then finds appropriate ways of exploring
              them; it is not goal-based, and it does not map neatly
              onto interviews, surveys and co-design sessions run to
              meet specific inclusion targets. If my goal were to
              measure the effectiveness of any of these metaphors,
              metonyms or allegories, there would be a clear goal and
              co-design would be the clear and correct approach. Here,
              a basic smoke test of a metaphor is enough to inform the
              research, and very small sets of testers, as test
              subjects rather than collaborators, were in my view
              enough. Testing ideas is not testing, or designing,
              products.
            </p>
            <p>
              The distinction matters most at the point where the two
              meet. A demonstrator built to be played, rather than a
              metaphor built to be probed, is a product claim, and it
              earns the obligation the studios accepted.
            </p>
            <p>
              <strong>Motor and cognitive access.</strong> My analysis
              has been vision-first throughout. The standard survey
              framing, that a player must <em>receive stimuli</em>,{" "}
              <em>determine responses</em>, and <em>provide input</em>
              , exposes the other two barriers. Input: Tetris&rsquo;s
              timing demands (auto-repeat tuning, lock delay, key
              dwell) are motor barriers, the one-switch community has
              adapted falling-block games for single-switch scanning,
              and my five adjustable timeouts help but no switch-input
              mode was ever designed. Cognition: my layer model
              controls <em>information</em> density, but rule
              relaxations in the Celeste sense (larger lock windows,
              slower progressions, undo) are a different accessibility
              axis that the capability model claims in principle and
              specifies nowhere.
            </p>
            <p>
              <strong>The braille-graphical design space.</strong>{" "}A
              community project has driven a refreshable braille
              terminal as a 20&nbsp;×&nbsp;4 tactile raster for an
              inverted Tetris. Braille displays as low-resolution{" "}
              <em>graphical</em> devices constitute a fourth design
              space, tactile-graphical, distinct from the vibrotactile
              haptics I deferred, and my domain chart can host it as
              naturally as a Braille View service domain. I had never
              enumerated it.
            </p>
            <p>
              <strong>Deaf players of <em>my</em> game.</strong> Once
              the functional audio is the soundtrack, game-relevant
              state (the danger key-shift, the urgency tempo, the lock
              countdown) lives in sound. A deaf or hard-of-hearing
              player of my accessible Tetris gets a <em>worse</em>{" "}
              game than classic Tetris unless the visual view mirrors
              that state visually. My own 2009 note on emotive loss in
              deaf adaptation predicted this failure mode, and
              seventeen years later I still designed it in. The visual
              view must render the tension system, not as an
              accessibility afterthought but because the
              architecture&rsquo;s symmetry principle demands it.
            </p>
            <p>
              <strong>The working-memory question.</strong>{" "}If visual
              Tetris consumes visuospatial working memory, what does
              audio Tetris consume? Spatialized audio may still engage
              spatial cognition; musical encoding may shift load to
              auditory-verbal systems; the truth is unknown and
              testable with the paradigms Holmes&rsquo;s group uses.
              This is a genuine open research question that the
              accessible build makes askable for the first time. It
              could be the project&rsquo;s most novel scientific
              contribution, and it was not on my list.
            </p>
            <p>
              <strong>The name.</strong>{" "}
              <em>Tetris Holding v. Xio Interactive</em> (2012)
              settled that game mechanics are unprotectable ideas
              while their audiovisual expression is protected. That
              favours this project twice over: the mechanics are free
              to implement, and my entire purpose is a{" "}
              <em>different expression</em>. But Tetris® remains a
              trademark vigorously enforced. Scholarship sits
              comfortably under nominative use; a playable public
              release less so. The playable build needs its own name,
              with &ldquo;after Tetris&rdquo; in the description. A
              decision to make before anything ships, not after.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
