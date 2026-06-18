import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";

export default function SpeakingAndFindingYourPlace() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <MapsSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <p>
              <small>
                <Link href="/maps/east-toronto-streetmap">
                  &larr; East End Toronto streetmap
                </Link>
              </small>
            </p>
            <h1>Speaking the map, and finding your place</h1>
            <p className="lede">
              Two problems sit underneath an accessible map and are
              still genuinely open: how a feature is{" "}
              <em>announced</em>{" "}when a reader explores by touch, and
              how a reader <em>stays oriented</em> &mdash; finding
              focus when the map is zoomed out, and knowing where they
              are when there is no single anchor to describe everything
              against. This page works through both, and is honest that
              they are design questions, not settled practice.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Who announces, and who draws focus</h2>
            <p>
              The trick this map plays is to expose the SVG so that the
              screen reader announces the content on explore-by-touch.
              The map is real, first-class SVG on the page, each feature
              carrying its ARIA label, so when a reader moves a finger
              (or a mouse) over it, the screen reader itself speaks what
              is underneath. The announcement is the assistive
              technology&rsquo;s job, done well, for free.
            </p>
            <p>
              There is a cost to that delegation: if the assistive
              technology does the announcing, it also draws the focus
              indicator &mdash; and screen readers are not sophisticated
              about this yet. The focus outline is usually a{" "}
              <strong>rectangle, regardless of the actual SVG
              shape</strong>{" "}it surrounds, so an irregular building or a
              curving road gets a bounding box. Its default thickness
              and colour are tuned for text on a page, and they work
              poorly over the busy, varied fills of a map. Hand the
              announcement to the screen reader and you lose control of
              the focus indicator&rsquo;s shape, weight, and colour
              &mdash; which matters a great deal on a map.
            </p>
            <p>
              The{" "}
              <Link href="/maps/terminal-map">terminal map</Link> takes
              the other path: it handles explore-by-touch in its own
              code and announces through an ARIA{" "}
              <strong>live region</strong>. Because the map is now in
              control, it can draw its own shape-aware highlight, in the
              right weight and colour &mdash; the focus-indicator
              problem goes away. But a new one arrives: a live region{" "}
              <strong>queues, and does not interrupt</strong>. A reader
              exploring a busy map by touch gets stuck behind a stale
              list &mdash; the live region reads out every feature their
              finger has already passed over before it catches up to
              where the finger is now.
            </p>
            <p>
              Neither approach is ideal. Delegating to the screen reader
              gives accurate announcements and explore-by-touch for
              free, but a rectangular, poorly contrasting focus outline
              you cannot style. Owning it in code gives full control of
              the highlight, but inherits the live region&rsquo;s
              staleness. And the &ldquo;announce only where I am now,
              interrupting whatever came before&rdquo; behaviour that
              would fix the second problem is{" "}
              <em>intrinsic to the screen reader&rsquo;s own focus and
              explore-by-touch engine</em> &mdash; it is exactly what
              the first approach gets for free, and exactly what the
              live-region approach structurally loses. It is not a
              feature you can bolt back onto a live region.
            </p>
            <p>
              It is tempting to think a live region could just be made to
              interrupt, but it can&rsquo;t, reliably.{" "}
              <code>aria-live=&ldquo;assertive&rdquo;</code>{" "}only raises
              the <em>priority</em>{" "}of an announcement &mdash; and even
              its interrupt behaviour varies across NVDA, JAWS,
              VoiceOver, and TalkBack. There is no property that flushes
              an already-queued backlog, and replacing the region&rsquo;s
              text doesn&rsquo;t guarantee the screen reader discards
              speech it has already started. Live regions are specified
              for low-frequency status messages, not for high-frequency
              positional tracking. The realistic mitigations are only
              partial: you can <strong>throttle to dwell</strong> &mdash;
              announce only when the finger settles, not on every feature
              passed over, which never generates the backlog but loses
              the continuous &ldquo;drag and hear everything&rdquo; feel;
              or you can <strong>move real DOM focus</strong>{" "}to the
              feature under the finger, which restores the screen
              reader&rsquo;s self-interruption but lands you straight back
              on its rectangular focus outline &mdash; the other horn of
              the trade-off.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A possible answer: the Web Speech API and audio ducking</h2>
            <p>
              The candidate fix &mdash; proposed, not yet built or
              tested &mdash; is to drop the live region and announce
              through the <strong>Web Speech API</strong> (
              <code>speechSynthesis</code>) instead. A live region
              cannot flush its backlog;{" "}
              <code>speechSynthesis</code>{" "}can. Calling{" "}
              <code>speechSynthesis.cancel()</code>{" "}clears the current
              and queued utterances, and you immediately{" "}
              <code>speak()</code>{" "}the new one. So on explore-by-touch
              you cancel-then-speak on every move, and the reader only
              ever hears where the finger is <em>now</em> &mdash; the
              self-interrupting behaviour the live region lacks,
              recovered in code.
            </p>
            <p>
              It is not a clean win. The page&rsquo;s synthesis voice
              will not be the reader&rsquo;s own screen-reader voice, so
              they hear a <strong>mix of two voices</strong> &mdash; the
              map in one, their screen reader in another. And because a
              map that just talks would be constantly chatty to{" "}
              <em>everyone</em>, the behaviour has to sit behind an{" "}
              <strong>opt-in accessibility toggle</strong>{" "}rather than
              be on by default.
            </p>
            <p>
              What it does <em>not</em>{" "}need is any attempt to silence
              the screen reader. When the screen reader speaks, the
              operating system applies <strong>audio ducking</strong>{" "}
              &mdash; it lowers other audio, the map&rsquo;s synthesis
              included, so the screen reader stays legible. That is
              exactly what you want: the screen reader should be able to
              talk at the same time, for system messages, and remain
              clearly on top. The division of labour is clean &mdash;
              the page owns feature announcement, the screen reader owns
              its own system and chrome messages, and ducking arbitrates
              the overlap. The one genuinely open detail is that{" "}
              <code>speechSynthesis</code>{" "}will not inherit the
              reader&rsquo;s chosen voice, rate, or verbosity, so the
              map voice may feel foreign or wrongly paced unless those
              are exposed as settings.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Finding focus when the map is zoomed out</h2>
            <p>
              Zoom on this demo is fixed by the reader. When the map is
              zoomed out, it can be very hard to see where focus is
              moving, because the features are &mdash; by definition
              &mdash; very small. The demo today does the simplest
              thing: a location indicator of a fixed size, regardless of
              zoom. What <em>should</em>{" "}happen when focus lands on a
              feature too small to see is an open question, with four
              candidate answers:
            </p>
            <ol>
              <li>
                <strong>A magnification bubble</strong>{" "}over the current
                location &mdash; like the old macOS Dock magnification
                effect (now off by default, but presumably still
                available), magnifying the focused area in place.
              </li>
              <li>
                <strong>Zoom on tab</strong>{" "}to guarantee a minimum
                indicator size &mdash; when focus moves, zoom the map so
                the indicator is always at least some readable size.
                This is the opposite of the current fixed-size approach.
              </li>
              <li>
                <strong>Contextual zoom</strong> &mdash; zoom by the
                graphical size <em>and</em>{" "}the semantic meaning of the
                focused feature. A park, a school ground, or hospital
                grounds would be framed together with some of the
                surrounding locality. The open sub-questions: what to do
                with a long road or street, which doesn&rsquo;t frame
                neatly, and how much context to give a point feature
                like a transit stop.
              </li>
              <li>
                <strong>Leave the zoom alone and improve the
                marker</strong> &mdash; keep a static indicator but make
                it findable at any zoom, the way ZoomText offers a
                cross-hairs locator alongside its enlarged-pointer
                variations.
              </li>
            </ol>
            <p>
              Bob&rsquo;s preference is the third &mdash; contextual
              zoom &mdash; but with two honest caveats: it isn&rsquo;t
              built fully (the{" "}
              <Link href="/maps/terminal-map">terminal map</Link> only
              gestures at the idea), and there is no user data to decide
              on yet.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Knowing where you are</h2>
            <p>
              The{" "}
              <Link href="/maps/search-and-map-pins">
                search and map pin demo
              </Link>{" "}
              had it easy: every pin is described relative to the chosen
              property, so even without explore-by-touch a reader gets a
              sense of the spatial relationships &mdash; this amenity is
              north-east of the property, two hundred metres away. There
              is a natural anchor to describe everything against. A full
              streetmap has no such anchor; tab into it and you are, in
              effect, stuck in Cartesian coordinates inside a graph.
              Conveying <em>where you are</em>{" "}needs two things at once.
            </p>
            <p>
              <strong>A relative account.</strong>{" "}Describe each feature
              by its nearest neighbours, by their relative importance,
              and by cardinal direction &mdash; which is what the{" "}
              <Link href="/maps/terminal-map">terminal map</Link> does,
              each point of interest naming its nearest others and their
              compass direction. This map does <em>not</em>{" "}do it yet,
              and the reason is the data: the OpenStreetMap extract is
              too incomplete and unstructured to rank importance or to
              trust the neighbours it offers &mdash; as the{" "}
              <Link href="/maps/east-toronto-streetmap">
                East End Toronto streetmap
              </Link>{" "}
              page sets out in full.
            </p>
            <p>
              <strong>An absolute account.</strong>{" "}Alongside the
              relative description, the reader should know the Cartesian
              reality &mdash; how large a slice of map they actually
              have. How many metres or kilometres (feet or miles) the
              view spans side to side and top to bottom; and, at least
              roughly, how much real distance the width of their finger
              represents. That last one translates the physical act of
              exploring by touch into real-world scale: a finger-width
              is so many metres, so a reader can feel <em>how far</em>{" "}
              they have moved, not just <em>what</em>{" "}they are over.
            </p>
            <p>
              <strong>Or create an anchor.</strong>{" "}A third option is to
              let the reader plant one &mdash; essentially what you do
              in Google Maps when you drag Street View onto a point on
              the map. Drop a movable reference point and everything can
              be described relative to it, which restores the search and
              map pin demo&rsquo;s &ldquo;relative to the property&rdquo;
              advantage on a map that has no built-in anchor. Bob is
              experimenting with this in the{" "}
              <Link href="/maps/tiled-toronto-map">
                tiled Toronto map
              </Link>
              .
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/maps/east-toronto-streetmap">
                  East End Toronto streetmap
                </Link>{" "}
                &mdash; the demo these notes are about.
              </li>
              <li>
                <Link href="/maps/how-its-built">
                  How an accessible map is built
                </Link>{" "}
                &mdash; the shared model: typed nodes, the convenience
                graph, and how a circuit is read.
              </li>
              <li>
                <Link href="/maps">Maps</Link> &mdash; the wider
                accessible maps work.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
