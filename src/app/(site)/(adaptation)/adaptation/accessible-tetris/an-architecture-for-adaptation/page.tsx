import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { TetrisSubNav } from "@/components/TetrisSubNav";

export const metadata: Metadata = {
  title: "An architecture for adaptation",
};

export default function AnArchitectureForAdaptation() {
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
            <h1>An architecture for adaptation</h1>
            <p className="lede">
              One abstract game, independently rendered views, and a
              game clock that waits for the interface: domains, the
              asynchronous bridge, and state models that carry
              adaptation into control flow.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Domains</h2>
            <p>
              The case study models Tetris as a Shlaer-Mellor domain
              chart. The abstract game is the application domain. Two
              service domains render it, the Visual View and the Sonic
              View, each rendering <em>all, some, or none</em>{" "}of the
              abstract game according to the capability of the current
              user. Input is delegated to its own service domain, and
              models of capability to a User Capability domain, which
              describes a user&rsquo;s physical and cognitive
              capabilities: how effectively they can press a location,
              how easily they can hold a press. One implementation
              domain appears: the keyboard event model of the
              implementation language. And one bridge deserves notice:
              Input connects to the Sonic View, because mechanical
              input has audible feedback that the sonic rendering must
              own.
            </p>
            <figure>
              <img
                src="/images/adaptation/fig-domain-chart.png"
                alt="Shlaer-Mellor domain chart of five boxes. Tetris Game, the application domain, sits at the top. Below it are three service domains: Visual View, Sonic View and Input. Below those sit User Capability, a service domain, and Keyboard Events, an implementation domain drawn with a dashed border. Arrows labelled render run from the game to both views, and delegate input from the game to Input; arrows run from the views and Input down to User Capability, labelled select modalities by capability, and from Input to Keyboard Events labelled key events. A dashed arrow from Input to the Sonic View is labelled mechanical feedback."
                width="1960"
                height="1120"
              />
              <figcaption>
                The Tetris domain chart: an abstract game rendered by
                independent views, with modality selection driven by
                user capability.
              </figcaption>
            </figure>
            <p>
              The visual components correspond to the existing Tetris
              Guidelines; the sonic components are the invented
              metaphors of the previous part. The renderings are{" "}
              <em>peers</em>. Neither is the &ldquo;real&rdquo; game
              with the other bolted on, and that symmetry is the point
              of the architecture.
            </p>
            <p>
              I should be plain about provenance here: I was not alone
              in reaching this architecture, and I did not know it at
              the time. In the same era, Grammenos, Savidis and
              Stephanidis at FORTH were building what they called{" "}
              <em>universally accessible games</em> (
              <em>Access Invaders</em>, <em>Game Over!</em>) under a
              &ldquo;unified design&rdquo; methodology: one abstract
              game, adapting its rendering to player abilities rather
              than shipping segregated special versions, with their
              evocative term <strong>parallel game universes</strong>{" "}
              for concurrently playable, differently-rendered versions
              of the same game. That is this domain chart wearing
              different clothes. The convergence supports the idea,
              since two groups independently concluded that
              accessibility of dynamic content demands an abstract
              core with adaptive rendering, but it deflates any claim
              that the architecture itself was unique to my work. What
              I still believe was distinctive here is further down the
              stack: the game clock that waits for the interface, the
              transaction-scoped request/answer discipline borrowed
              from telephony, and the treatment of the sonic design
              space at the level of <em>metaphor</em> rather than
              feature.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Two approaches to adaptation</h2>
            <p>
              Two approaches were envisioned. The <strong>manual</strong>{" "}
              approach built the game with templates defined for a
              small number of representative user profiles, each
              selecting appropriate interaction modalities. The{" "}
              <strong>automated</strong> approach considered the
              constraints and rules necessary for the game to{" "}
              <em>self-adapt</em>{" "}to user capability and operating
              context. Both rely on the same abstract description of
              the game&rsquo;s dynamic operation, independent of how
              it is rendered or how input is collected. The automated
              approach was expected to fail more often, since it must
              itself make the modality-selection judgements a designer
              makes in the manual approach, and the quality of the
              metadata attached to the abstract model constrains how
              well modalities can be grouped into a consistent,
              comprehensible interface.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The asynchronous bridge</h2>
            <p>
              The interface between game and UI is entirely
              asynchronous, and must be, because an abstract game has
              no way of knowing how long a communication with the user
              will take in any given design space. Even &ldquo;the
              game is starting&rdquo; took significantly different
              times in the two views (a colour ripple across the grid;
              a spoken announcement), and the game must synchronize
              with <em>both</em> before dropping the first tile.
            </p>
            <p>
              This forced a decision with philosophical weight:{" "}
              <strong>
                can the rendering of the user interface delay the fall
                of the tile?
              </strong>{" "}
              My answer was yes. The principle is that the UI adjusts
              to the capabilities of the user, and if the user cannot
              receive information within a given timeout, then the
              game itself must adjust. Accessibility reaches all the
              way down into the game clock. (A multi-user or
              augmented-reality game might need the opposite decision,
              letting the game catch up with the world; single-player
              Tetris has no world to appease.)
            </p>
            <p>
              The repeated asynchronous behaviour reduces to a simple
              pattern: a{" "}
              <strong>
                request/answer pair with a rendezvous on the answer
              </strong>
              . Diagrammatically it resembles UML sequence charts, but
              the concept goes back to the CCITT/ITU message sequence
              charts used to describe telecommunications protocols.
            </p>
            <figure>
              <img
                src="/images/adaptation/fig-request-answer.png"
                alt="Sequence diagram with three lifelines: Game, Visual View and Sonic View. The Game sends the request R: UI.tilePositionUpdate to both views. Each view then processes for its own duration - the visual rendering taking as long as this user needs, the sonic announcement its own duration entirely - before returning the answer A: UI.tilePositionUpdate. A filled rendezvous bar on the Game lifeline marks that the game proceeds only when every answer has arrived."
                width="1960"
                height="960"
              />
              <figcaption>
                The request/answer/rendezvous pattern between the game
                and its views.
              </figcaption>
            </figure>
            <p>
              I did not invent that pattern for Tetris. In the
              mid-1990s I was Software Group Leader on the Ascom PABX,
              a small digital telephone exchange developed almost
              entirely with the Shlaer-Mellor method. An exchange is
              asynchronous communication incarnate, and the project
              relied heavily on sequence-chart patterns to describe
              the bridges between domains. Three hard lessons from
              that work transferred directly to Tetris:
            </p>
            <ol>
              <li>
                <strong>No notification/response pairs.</strong> Every
                deadlock the analysts created traced back to a server
                treating its client as a server, so the pattern was
                banned outright.
              </li>
              <li>
                <strong>The client is fixed.</strong> For any pair of
                domains, one is client and one is server, and the
                roles never reverse. A server may send an unsolicited{" "}
                <em>indication</em>, which may prompt the client to
                open a transaction, but the server never opens one.
              </li>
              <li>
                <strong>Only the client starts a transaction.</strong>{" "}
                Where several request/answer pairs complete one client
                intention, they are wrapped in a database-style
                transaction so that exception cases can be handled
                coherently.
              </li>
            </ol>
            <p>
              Synchronous events between domains had also caused
              deadlock at Ascom (clients blocked while a
              server&rsquo;s own onward requests completed), so
              between domains everything became asynchronous, with
              clients explicitly busy-waiting on answers where
              sequencing demanded it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Notation: making Moore state models say more</h2>
            <p>
              Shlaer-Mellor expresses object behaviour with Moore
              state models, and the asynchronous patterns above needed
              to be visible <em>in</em> those models. I extended the
              notation with event prefixes:
            </p>
            <ul>
              <li>
                <strong>I:</strong>{" "}an indication; no direct response
                required (&ldquo;key pressed&rdquo;).
              </li>
              <li>
                <strong>R: / A:</strong> one half of a request/answer
                pair. The pair share an event name, prefixed by the
                (conceptual) target: conceptual, because the game
                requires the <em>service</em> of a user interface
                without knowing which domains provide it.
              </li>
              <li>
                <strong>TS: / TE:</strong> transaction start and end;
                constituent events carry the transaction ID.
              </li>
              <li>
                <strong>D:</strong>{" "}an internal decision event,
                generated and consumed within one state model, acted
                on immediately, ahead of any queued event. This is the
                mechanism behind the transient decision states that
                illuminate the algorithm&rsquo;s branch points.
              </li>
              <li>
                <strong>X:</strong> cancel an outstanding
                request/answer pair, an extension implying the
                prefixes are not mere annotation but are honoured by
                the runtime architecture beneath the model.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The state models</h2>
            <p>
              The abstract game needs only two concurrent state
              models: <strong>Game</strong>, handling the start/stop
              sequence and the hold box, and{" "}
              <strong>FallingTile</strong>, handling the current
              tile&rsquo;s descent and determining whether a new tile
              is needed or the game is over.
            </p>
            <p>
              The original prototype FallingTile was a simple object
              listening for a timer tick; the survivor of that version
              appears in the appendix of the thesis chapter as a page
              of straightforward Java. The moment FallingTile had to
              communicate asynchronously with the UI, the simple model
              broke: the algorithm must pause while the UI does its
              job. Everything that follows is the price, and the
              payoff, of that pause.
            </p>
            <p>
              An early draft of the Game model made the cost visible.
              The main body (tiles are created and keep falling until
              the game is over, plus the hold extension) is simple;{" "}
              <em>all the rest</em> of the model exists to handle
              termination, complicated by the asynchronous bridge.
              Three stylizations tamed the complexity.
            </p>
            <p>
              <strong>Hidden await-states.</strong> A dotted
              transition labelled{" "}
              <code>
                R: FT.cancelFallingTile / A: FT.landscapeUpdate
              </code>{" "}
              means: on the cancel request, await that specific
              answer, and only that answer, before completing the
              transition. Each dotted line is a hidden state that
              would otherwise bloat the diagram.
            </p>
            <p>
              <strong>Interruptibility meta-states.</strong> When hard
              drop was added, the question arose: if the game is
              mid-announcement of tile position, should hard drop
              interrupt the announcement or queue behind it?{" "}
              <em>
                Without knowing the character of the current
                interaction modalities, the answer is unknowable.
              </em>{" "}
              Visually, interrupting a grid refresh is free; sonically,
              interrupting the dancing margins mid-phrase may confuse.
              So the model itself must carry both strategies. A
              meta-state (&ldquo;HARD DROPPING DURING UPDATE&rdquo;)
              holds the alternatives, serialize after the outstanding
              transaction or interrupt it with <strong>X:</strong>,
              with the choice deferred to rendering time.
              Modality-dependence reaches into control flow: having
              selected modalities for a user, the game must adapt its{" "}
              <em>synchronization policies</em> to match their
              characteristics, and without such feedback the
              conservative rule is that serialization beats
              interruption.
            </p>
            <p>
              <strong>Contemporaneous-announcement meta-states.</strong>{" "}
              When a tile lands, the landscape updates and the tile
              disappears; when a tile falls a row, its height and both
              margins may all need announcing. Are these simultaneous
              or sequential? At the abstract level the truthful answer
              is &ldquo;whichever the user&rsquo;s modalities can
              deliver&rdquo;, so the meta-state (for example
              &ldquo;UPDATING ON LANDING&rdquo;) lists alternatives in
              preference order: Option 1, concurrent updates (
              <code>
                AND {"{"} RA: UI.landscapeUpdate, RA: UI.clearTile{" "}
                {"}"}
              </code>
              ); Option 2, serialized (<code>THEN {"{"} … {"}"}</code>
              ). The preferred option is concurrency; the fallback is
              sequence. Expanded to plain notation, each meta-state is
              a combinatorial fragment that grows with the number of
              announcements. The stylization is what keeps the model
              on a page.
            </p>
            <figure>
              <img
                src="/images/adaptation/fig-falling-tile-state-model.png"
                alt="The complete stylized Moore state model of the Falling Tile, drawn as about twenty boxes connected by labelled event arrows, flowing from a create event at the top to end states at the bottom. Solid boxes are ordinary states such as Tile Falling and Waiting For Tile Advance Timeout. Heavy dashed boxes are meta-states - Updating On Falling, Updating On Landing, Updating On Reaching Bottom - each listing a transaction start, Option 1 concurrent updates joined by AND, Option 2 serialized updates joined by THEN, and a transaction end. Dotted boxes - Lateral Movement, Rotating, and Hard Dropping During Tile Update - are interruptible updates listing serialize and interrupt alternatives. Transition labels use the notation prefixes I, R, A, D, TS, TE and X explained in the text; dashed transitions carrying paired events denote hidden await-states. All exception paths converge on Terminating On Cancel, and the normal paths end at Fall Complete or Game Over."
                width="1342"
                height="1448"
              />
              <figcaption>
                The final Falling Tile state model, carrying the full
                stylized notation: transactions, decision states,
                interruptible updates, and meta-states with concurrent
                and serialized announcement options.
              </figcaption>
            </figure>
            <p>
              One question from this modelling work stayed with me.
              The single event &ldquo;tile added to landscape&rdquo;
              is a higher abstraction than the pair &ldquo;update
              landscape, clear tile&rdquo;. At what level of
              abstraction may an abstract model speak? Position and
              movement are common concepts; is &ldquo;landed&rdquo;?
              The answer lies in the metadata and ontologies applied
              to abstract model events (without them, no rendering
              algorithm could choose its metaphors), and that question
              formed the starting point for the bridge between the
              Game and Capability domains.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
