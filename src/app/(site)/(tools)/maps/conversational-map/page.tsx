import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";
import { NewTabLink } from "@/components/NewTabLink";

export default function MapsConversationalMap() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s3)" } as CSSProperties}>
          <MapsSubNav />

          <header className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <p>
              <small>
                <Link href="/maps">&larr; Maps</Link>
              </small>
            </p>
            <h1>Conversational map</h1>
            <p className="lede">
              The{" "}
              <Link href="/maps/context-map">Context Map</Link> gives you three
              fixed descriptions: quick, continuous, and detailed. Useful, but
              one size fits all. The Conversational map removes the buttons and
              lets you simply <em>ask</em> &mdash; in plain language, by typing
              &mdash; about where you are now, or anywhere on the map at all.
            </p>
            <p className="muted">
              <small>
                A test, not a finished demo &mdash; the next step past the
                three-button model, being tried out and learned from.
              </small>
            </p>
          </header>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>What it is</h2>
            <p>
              A plain text box. You ask a question &mdash; &ldquo;what&rsquo;s
              near me?&rdquo;, &ldquo;is there a step-free entrance to the
              library?&rdquo;, &ldquo;how far is the CN Tower, and which
              way?&rdquo; &mdash; and it answers from the same map database
              behind the other maps. The fixed descriptions could only ever tell
              you the handful of things they were built to tell you. This lets
              you ask the question you actually have.
            </p>
            <p>
              And it is not limited to where you are standing. Because every
              named place, address and feature in the index can be looked up by
              name, you can ask about <em>anywhere</em> &mdash; what surrounds a
              station across the city, whether a park has accessible paths, how a
              neighbourhood you have never been to is laid out.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>How it works</h2>
            <p>
              Behind the text box, a language model interprets your question and
              decides what to look up &mdash; it does not invent answers, and it
              does not do the geography itself. It calls a small set of map tools
              that query the index and return the facts already worked out:
              what is near a point, what a place contains, the distance and
              direction from one spot to another. The model&rsquo;s job is to
              understand what you asked and put the answer in plain words; every
              distance and direction comes from the map, computed, not guessed.
            </p>
            <p>
              That division is deliberate. Language models are unreliable at
              spatial reasoning &mdash; distances, bearings, what lies between two
              places &mdash; so none of that is left to the model. It chooses the
              questions; the map does the measuring.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Sending your words elsewhere to answer</h2>
            <p>
              Understanding free-form questions needs a capable language model,
              and that runs as a hosted service rather than on the
              page. So to answer you, what you type and your current location
              (when you have shared it) are sent over the internet to a
              third-party service to be processed. The rest of the site is
              self-hosted and sends nothing to anyone; this one feature is the
              exception, and the notice before you start says so plainly. Do not
              type anything you would not want handled that way.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>The same map underneath</h2>
            <p>
              There is still no map to look at. The answers come from the
              OpenSearch index that powers the{" "}
              <Link href="/maps/tiled-toronto-map">tiled Toronto map</Link> and
              the <Link href="/maps/context-map">Context Map</Link> &mdash; every
              shop, crossing, bench and water&rsquo;s edge as a record with its
              position, its kind, and its accessibility detail. The index now
              reaches well beyond Toronto: it covers the whole of Canada, so the
              same question works in St.&nbsp;John&rsquo;s, Yellowknife or
              Victoria as in Cambridge.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Built on OpenStreetMap</h2>
            <p>
              All of the place data comes from{" "}
              <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, the
              crowd-sourced map of the world. Its limitations come straight
              through: a building nobody has traced is missing, a shop that
              changed hands may carry the old name. The map can only ever be as
              current and complete as the data underneath. As on the Context Map,
              it only tells you what <em>is</em> mapped &mdash; silence means
              &ldquo;not mapped&rdquo;, never &ldquo;not there&rdquo;.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>A test, not a tool</h2>
            <p>
              This is unfinished, untested software, and it says so before you
              can use it. Every time you open it you read and accept a notice
              &mdash; that it can be wrong, that it can misjudge distance or
              direction or answer incorrectly, that it sends your words and
              location to an outside service, and that it is{" "}
              <strong>not for navigation or any safety decision</strong>. Keep
              using your usual ways of getting around at all times.
            </p>
            <p className="muted">
              <small>
                Text first. Speaking your question aloud, and hearing the answer
                read with clock-face directions relative to the way you are
                facing, are the next things to add &mdash; the heading work from
                the Context Map carries straight over.
              </small>
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Try the interactive demo</h2>
            <p>
              <NewTabLink className="pill" href="/demos/conversational-map/viewer.html">
                Open the Conversational map
              </NewTabLink>
            </p>
            <p className="muted">
              <small>
                You will be asked to read and accept the notice, then to allow
                location access. It opens in its own window; close it to come
                back here.
              </small>
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Source</h2>
            <p>
              GPL-3.0, part of the{" "}
              <Link href="/maps/tiled-toronto-map">tiled Toronto map</Link>{" "}
              project &mdash;{" "}
              <a href="https://github.com/bobdodd/tiled-toronto-map">
                github.com/bobdodd/tiled-toronto-map
              </a>
              . The place data is derived from OpenStreetMap, &copy;
              OpenStreetMap contributors, under ODbL.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
