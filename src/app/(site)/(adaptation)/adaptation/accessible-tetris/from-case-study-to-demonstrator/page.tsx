import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { TetrisSubNav } from "@/components/TetrisSubNav";
import { NewTabLink } from "@/components/NewTabLink";

export const metadata: Metadata = {
  title: "From case study to demonstrator",
};

export default function FromCaseStudyToDemonstrator() {
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
            <h1>From case study to demonstrator</h1>
            <p className="lede">
              A simple version of the game, rich enough to exercise
              the techniques honestly and simple enough that each
              technique stays inspectable, referencing directly back
              to the CISNA Model.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What the build is, and is not</h2>
            <p>
              What comes next is deliberately <em>not</em> &ldquo;an
              accessible Tetris game&rdquo;.{" "}
              <Link href="/adaptation/accessible-tetris/the-record">
                The record
              </Link>{" "}
              shows that full-rules, full-tempo Tetris in audio
              remains an open problem, which is why Tetris was chosen
              in the first place, and the claim of the coming build is
              the same claim as the 2009 work: here is what
              accessibility of a game like this <em>means</em>, here
              are techniques, watch them operate. The web build is a{" "}
              <strong>demonstrator</strong>: a simple version of the
              game, rich enough to exercise the techniques honestly
              and simple enough that each technique stays inspectable,
              showing the method in action and referencing directly
              back to{" "}
              <Link href="/research/cisna-model">the CISNA Model</Link>
              .
            </p>
            <p>
              That reference is structural, not decorative. Each
              demonstrated element sits at a named CISNA layer, and
              the demonstrator&rsquo;s job is to make the layers{" "}
              <em>visible in operation</em>:
            </p>
            <ul>
              <li>
                The <strong>abstract game</strong>, a stated subset of
                the rules (all seven pieces, movement, rotation, lock,
                lines, hold; simplifications such as basic rotation in
                place of full SRS kick tables, and no T-spin scoring,
                chosen openly), supplies the raw material of{" "}
                <em>External Content</em>, with its events and their
                ontology (the &ldquo;landed versus arrived&rdquo;
                question) living at the <em>Semantics</em> layer. The
                two concurrent state machines and the request/answer
                bridge, including the decision that rendering may slow
                the game clock, are how that content is served upward.
                The five timeouts are all user-adjustable parameters.
              </li>
              <li>
                The <strong>metaphor implementations</strong> (the
                timbres, terrain scan, ghost echo, heartbeat, the
                wobble) are <em>Inventory</em>: formatted media
                elements available for selection, individually
                switchable so each remains falsifiable.
              </li>
              <li>
                The <strong>views</strong>, visual and the three sonic
                listening perspectives, are alternative compositions
                that the <em>Adaptation</em>{" "}layer selects among,
                driven by the capability model. The player&rsquo;s
                mixing desk is Adaptation put directly into the
                player&rsquo;s own hands.
              </li>
              <li>
                The <strong>visual view</strong> itself stays modest
                and original: high-contrast and colour-blind-safe
                schemes, respectful of{" "}
                <code>prefers-reduced-motion</code>, fully
                keyboard-operable, ARIA live announcements for players
                using a screen reader alongside partial vision, and
                its own expression throughout (palette, proportions,
                styling).
              </li>
            </ul>
            <p>
              The build order mirrors the research logic rather than
              typical game development: prototype the seven timbres
              first, then the terrain scan against static boards (can
              a listener reconstruct the shape?), then the coordinate
              stage and wobble, and only then the game logic that
              animates them. The riskiest metaphors get the earliest
              tests, with a training mode planned from the start. The
              musical sonar taught me that the best audio metaphors
              still need learning.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Six commitments</h2>
            <p>
              The survey of the record added six commitments the
              earlier plans lacked:
            </p>
            <ol>
              <li>
                <strong>Co-design from phase one.</strong> The timbre
                and terrain-scan prototypes are co-design sessions
                with blind players, not demos for later validation.
                This is the Forza and Vale precedent, and the one my
                own workplace makes easiest of all to honour.
              </li>
              <li>
                <strong>A latency budget for the epistemic loop.</strong>{" "}
                Rotation-to-fit feedback is the fastest path in the
                soundscape: sub-second, always interruptible by the
                next rotation, exempt from the general serialization
                policy. A hard requirement, stated in the capability
                model, tested from the first playable.
              </li>
              <li>
                <strong>The pitch-collision decision</strong>{" "}
                (sonar&rsquo;s higher-is-better versus terrain&rsquo;s
                higher-is-taller) resolved before the audio build
                starts, in the co-design sessions. Polarity is an
                empirical question, so let players answer it.
              </li>
              <li>
                <strong>The visual view mirrors the tension system</strong>
                : danger key-shift, urgency, and lock countdown
                rendered visually, so the functional-audio soundtrack
                never makes the game worse for deaf and
                hard-of-hearing players than the classic it adapts.
              </li>
              <li>
                <strong>A name of its own</strong> before anything
                playable ships, with the Tetris relationship stated
                descriptively.
              </li>
              <li>
                <strong>Respectful framing as a design requirement.</strong>{" "}
                Game speed is a visible, first-class percentage
                setting in the tradition the Game Accessibility
                Guidelines and APX codify, and every accommodation
                (presets, layers, speed) is written in neutral,
                empowering language, taking Celeste&rsquo;s
                assist-mode wording revision as the precedent. Nothing
                in the interface may describe an adapted way of
                playing as a lesser one.
              </li>
            </ol>
            <p>
              Two entries move onto the research agenda rather than
              the build plan: a switch-scanning input mode and
              Celeste-style rule relaxations (the motor and cognitive
              axes the capability model must grow to cover honestly),
              and the working-memory question, whether audio Tetris
              loads the visuospatial resources visual Tetris is known
              to consume, which the finished build would for the first
              time make experimentally askable.
            </p>
            <p>
              Two further lessons from the PhD build are carried as
              requirements rather than hopes. First, every metaphor
              must be <em>individually</em>{" "}falsifiable. The old
              build&rsquo;s ledger (sonar worked, margins worked only
              after retreating to music, direction-as-direction failed
              into speech) was only possible because metaphors were
              separable, and the layer mixer preserves that property.
              Second, evaluation is part of the design: instrumenting
              the interface for quantitative measures and pairing them
              with qualitative observation, in the tradition of
              Brewster and colleagues&rsquo; mobile-audio usability
              work, with the open methodological question of validity
              when comparing across users of different capabilities
              acknowledged rather than ignored.
            </p>
            <p>
              The deepest continuity is the simplest to state. In 2009
              I concluded that accessible rendering of dynamic content
              requires an abstract model of the application, rendered
              per-user by services that the application itself must be
              willing to wait for. Nothing in two decades has
              contradicted that. The browsers have simply, finally,
              provided a sonic design space rich enough to do the
              architecture justice.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A note on sources</h2>
            <p>
              These pages consolidate and supersede several working
              papers from the PhD period and after: the thesis
              case-study chapter, the metaphor literature review, the
              Design Language Set notes, the field notes on the audio
              metaphors and the first-person shift, the final stylized
              Falling Tile state model, the original Java/JOAL
              implementation, and the design work for the forthcoming
              web demonstrator. The record survey&rsquo;s annotated
              notes, with sources, are in the{" "}
              <NewTabLink href="https://github.com/bobdodd/accessible-tetris/blob/main/docs/research.md">
                research notes on GitHub
              </NewTabLink>
              , alongside{" "}
              <NewTabLink href="https://github.com/bobdodd/accessible-tetris">
                the full project repository
              </NewTabLink>
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
