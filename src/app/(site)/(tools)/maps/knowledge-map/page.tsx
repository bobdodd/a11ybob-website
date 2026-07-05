import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";
import { NewTabLink } from "@/components/NewTabLink";

const CACHE_FLOW = `Every knowledge source sits behind a cache keyed by place, in
coarse cells about a kilometre across:

    you ask about a cell  ->  cache warm?  ->  yes: answer from the cache
                                          \\-> no:  fetch once, store, answer

    a stale cell is re-fetched only when someone next asks about it.
    a quiet cell costs nothing until the first person visits it.

The first visitor to a place — standing there, or asking from an
armchair — fills the cell for everyone who comes after.`;

export default function MapsKnowledgeMap() {
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
            <h1>Knowledge map</h1>
            <p className="lede">
              A conversational map that brings together the pieces built across
              this family, and adds two of its own. It carries the spoken chat of
              the{" "}
              <Link href="/maps/conversational-map">Conversational map</Link>;
              the accessibility detail recorded on map features, including mapped
              barriers in your vicinity; unnamed roads, paths and buildings for
              better area context; some knowledge of transit routes and schedule
              patterns; estimated house numbers on blocks the map never fully
              numbered; and cited place knowledge from Wikipedia and Wikivoyage.
              You can ask about where you are, or about anywhere on the map.
            </p>
            <p className="muted">
              <small>
                A test, not a finished demo &mdash; unfinished software being
                tried out and learned from.
              </small>
            </p>
          </header>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>What it is</h2>
            <p>
              The same conversation as the{" "}
              <Link href="/maps/conversational-map">Conversational map</Link>{" "}
              &mdash; a plain text box, or your voice. What differs is what sits
              behind it: alongside the map lookups, it can consult transit
              schedule data and a place-knowledge layer, and the map index itself
              now carries detail the earlier demos did not have. Because every
              named place, address and feature in the index can be looked up by
              name, questions are not limited to where you are standing &mdash;
              you can ask about any place the index covers.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Accessibility detail</h2>
            <p>
              When you ask about a place, or about getting around, the answer
              includes the accessibility detail recorded on nearby features:
              wheelchair access, tactile paving, kerb type &mdash; lowered,
              raised or flush &mdash; ramps, handrails, step counts, automatic
              doors, accessible toilets, audible and acoustic crossing signals,
              and surface quality. You can filter by it (&ldquo;step-free
              caf&eacute;s near me&rdquo;). A tag recorded as &ldquo;no&rdquo; is
              reported plainly (&ldquo;this crossing has no tactile
              paving&rdquo;); a missing tag means unknown, and is never guessed
              either way.
            </p>
            <p>
              It also reports mapped barriers in your vicinity &mdash; a bollard,
              a gate, a kissing gate, a cattle grid &mdash; named by kind, since a
              kissing gate matters differently to a wheelchair user than to a
              walker; and where a tactile map or model is mapped, it is mentioned
              as a landmark. This barrier data comes from a newer pass over the
              map data and is being added region by region, so it is not yet
              present everywhere.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Unnamed roads, paths and buildings</h2>
            <p>
              The index behind this map includes unnamed roads, paths and
              buildings &mdash; features most map searches drop because there is
              nothing to type to find them. They are stored description-only, so
              they never appear in a name search, but they give the area
              descriptions more context than the{" "}
              <Link href="/maps/context-map">Context Map</Link> had: an unnamed
              footpath nearby is reported with its kind and its accessibility
              tags, and the density of anonymous buildings around you feeds the
              description of how built-up a place is. Unnamed paths keep their
              full shape and tags; anonymous buildings are stored as a point and
              a coarse size only, no outline. The reasoning behind this trade is
              written up in the Conversational map&rsquo;s colophon.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Transit routes and schedule patterns</h2>
            <p>
              It has some knowledge of public transit: the routes serving stops
              near a point, taken from transit agencies&rsquo; published static
              schedules (GTFS). Where the data records it, that includes first
              and last service, typical frequency, the days a route runs, and
              whether the stop or route is marked wheelchair-accessible.
            </p>
            <p>
              The limits are real. This is a static timetable, not a live feed:
              it cannot say when the next bus comes, and it will tell you so if
              you ask. Coverage extends only to agencies whose feeds have been
              loaded, the loaded copy can lag behind an agency&rsquo;s own
              changes, and many stops and routes carry no accessibility
              information at all. Where there is no stop in the schedule data, it
              says so &mdash; which may mean no service, or simply no feed.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>House numbers, real and estimated</h2>
            <p>
              House numbers in OpenStreetMap are sparse &mdash; they cluster at
              corners and on scattered buildings, with long gaps between. Where a
              real number is recorded close to you, it is offered as an anchor:
              &ldquo;near number 120&rdquo;, a nearby landmark rather than your
              exact address. Where the map records only a numbered range for a
              block &mdash; the ends numbered, the middle blank &mdash; it can
              estimate your position along it and offer an approximate number:
              &ldquo;about number 118&rdquo;, always worded as an estimate and
              kept distinct from a real one. Where neither exists, no number is
              offered &mdash; nothing is invented. The interpolation data is part
              of the same region-by-region re-indexing as the barrier data, so it
              too is not yet present everywhere.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Hands-free voice conversation</h2>
            <p>
              Tap Speak once and the conversation runs hands-free: it takes a
              short pause as &ldquo;finished&rdquo; and sends, reads the answer
              aloud, and then re-opens the microphone for your next question, so
              there is no button to find between turns. A rising tone marks the
              microphone opening and a falling tone marks it closing, so the
              state is audible; what was heard is read back before it is acted
              on, so a mishear can be caught by ear. Replies usually end with a
              short suggestion of a natural next question. After about ten
              seconds of silence the conversation winds down, and Speak starts it
              again.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>What a place is known for</h2>
            <p>
              The layer that gives this map its name. Ask what a place is, what
              it is known for, or what a district is like, and it fetches entries
              from <a href="https://www.wikipedia.org/">Wikipedia</a> and{" "}
              <a href="https://www.wikivoyage.org/">Wikivoyage</a> for that
              place, with a few structured facts &mdash; when a building was
              built, who designed it, a heritage listing &mdash; from{" "}
              <a href="https://www.wikidata.org/">Wikidata</a>. The language
              model is not allowed to answer these questions from its own
              training; it is handed the fetched entries and asked to read them
              back in plain words. Every such answer states its source and how
              old the cached copy is &mdash; &ldquo;from Wikipedia, cached last
              week&rdquo; &mdash; because a listener, unlike a reader, cannot
              check a source at a glance unless it is spoken.
            </p>
            <p>
              The limits follow from the sources: the English-language wikis are
              used, a place nobody has written about gets no story, and an entry
              can be out of date. Where there is nothing, it says nothing.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>A cache that fills in with use</h2>
            <p>
              Fetching an encyclopedia entry for every question would be slow and
              would lean hard on services that are shared and free. So each
              knowledge answer is stored the first time it is fetched, filed by
              place, and handed back to the next person who asks about the same
              spot.
            </p>
            <pre>
              <code>{CACHE_FLOW}</code>
            </pre>
            <p>
              A frequently-asked-about place stays current, because each question
              after the copy goes stale refreshes it; a place nobody asks about
              costs nothing until the first person does. Because encyclopedic and
              travel facts change slowly, a stored answer is kept for weeks
              before it counts as stale, and there is no background process
              filling or expiring the cache &mdash; use alone drives it.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>The map measures; the model only speaks</h2>
            <p>
              A language model is unreliable at exactly the things this map must
              get right &mdash; distances, directions, dates, facts. So none of
              that is left to it. The model chooses what to look up and puts the
              answer into plain words; everything else is done for it. Every
              distance and bearing is computed from the map, every schedule
              detail read from the loaded timetable, every fact fetched from a
              cited source. That does not make it incapable of error &mdash; it
              can still misphrase or misjudge what you asked, and the notice
              before you start says so &mdash; but it keeps the errors to
              wording, not invented geography or invented history.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Where your words go</h2>
            <p>
              Understanding a free-form question takes a language model too large
              to run on the page, so it runs as a hosted service. To answer you,
              what you type &mdash; or, if you speak, your voice as you say it
              &mdash; together with your location is sent over the internet to a
              third-party service; spoken questions pass through a separate
              speech-to-text service first. The rest of the site is self-hosted
              and sends nothing to anyone; this map, like the{" "}
              <Link href="/maps/conversational-map">Conversational map</Link>, is
              the exception, and the notice before you start says so plainly. Do
              not type or say anything you would not want handled that way.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Built on open data</h2>
            <p>
              The map itself is{" "}
              <a href="https://www.openstreetmap.org/">OpenStreetMap</a>; the
              transit data comes from agencies&rsquo; published GTFS schedules;
              the knowledge is{" "}
              <a href="https://www.wikipedia.org/">Wikipedia</a>,{" "}
              <a href="https://www.wikivoyage.org/">Wikivoyage</a> and{" "}
              <a href="https://www.wikidata.org/">Wikidata</a>. All of it is only
              as complete and as current as the people who maintain it have made
              it: a place nobody has traced is missing, a shop that changed hands
              may carry the old name, an agency that publishes no feed has no
              times. Silence means &ldquo;not mapped&rdquo;, never &ldquo;not
              there&rdquo; &mdash; the map tells you what it knows, and no more.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>A test, not a tool</h2>
            <p>
              This is unfinished, untested software, and it says so before you
              can use it. Every time you open it you read and accept a notice
              &mdash; that it can be wrong, that it can misjudge distance or
              direction, or read back an entry or a schedule that is out of date,
              that it sends your words and location to an outside service, and
              that it is{" "}
              <strong>not for navigation or any safety decision</strong>. Keep
              using your usual ways of getting around at all times.
            </p>
          </section>

          <section className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h2>Try the interactive demo</h2>
            <p>
              <NewTabLink className="pill" href="/demos/knowledge-map/viewer.html">
                Open the Knowledge map
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

          <section className="stack" style={{ "--space": "var(--s1)" } as CSSProperties}>
            <h2>Colophon</h2>
            <p>
              A colophon is the note at the back of a book about how it was made.
              Each map in this family gets one, because the decisions behind an
              accessible map &mdash; what to store, what to trust, what to leave
              out &mdash; are the interesting part, and worth showing rather than
              burying. This map gathers up work from the others, so its colophon
              is short where theirs already tell the story; a few decisions are
              its own.
            </p>

            <h3>Grown from the family</h3>
            <p>
              Most of what happens around an answer here is not new. The
              conversation, the voice in and the answer read back, the compass
              turning &ldquo;north-east&rdquo; into &ldquo;about two
              o&rsquo;clock&rdquo; relative to the way you face, the screen held
              awake while you listen, the division of labour that keeps the model
              phrasing and never measuring &mdash; all of it comes, nearly
              unchanged, from the{" "}
              <Link href="/maps/conversational-map">Conversational map</Link>,
              and through it from the{" "}
              <Link href="/maps/context-map">Context Map</Link>. The unnamed
              features and the accessibility-first reading of a place come the
              same way. What is new here is the transit schedule data, the
              knowledge layer with its cache, and the hands-free conversation
              loop.
            </p>

            <h3>Hands-free, in a noisy world</h3>
            <p>
              A blind user asking a map a question aloud is often somewhere loud
              &mdash; a platform, a busy street &mdash; and the microphone hears
              all of it, not just them. Two things handle that. The speech
              service separates the voices it picks up, and the app locks onto
              the first one to say a few words &mdash; you, holding the phone
              &mdash; keeping only your words and dropping the conversation
              behind you. And it decides you have finished not from silence,
              which never comes in a crowd, but from the gaps between{" "}
              <em>your</em> words. It is a heuristic, not a guarantee &mdash; a
              bystander who gets a sentence in first could take the lock &mdash;
              but for a phone you are holding and talking into it holds up well,
              and it is what lets the microphone re-open after each answer
              without the conversation being hijacked by the crowd.
            </p>

            <h3>Why the knowledge is fetched, not remembered</h3>
            <p>
              The obvious way to make a map that knows about places is to let the
              language model answer from what it learned in training. It is also
              the wrong way. A model recalling facts is confident and often
              slightly wrong &mdash; a date off by a decade, an architect
              misattributed &mdash; and a blind user, who cannot glance at a
              screen to sanity-check, is the least able to catch it. So the model
              is not permitted to remember. For anything about what a place{" "}
              <em>is</em>, it is handed a real entry, fetched for that place, and
              asked only to read it back and say where it came from. It is the
              same guard the maps already use for geography, extended from
              distances and directions to facts.
            </p>

            <h3>The cache, and why it is this shape</h3>
            <p>
              Wikipedia and Wikivoyage ask to be used gently, and a fresh request
              for every question would be slow besides. So each source sits
              behind a cache, filed by place rather than by question &mdash; in
              coarse cells about a kilometre across &mdash; so that everyone
              asking about roughly the same spot, however they phrase it, gets
              the answer already fetched for it. There is deliberately no
              background process filling the cache in or expiring it: a cell is
              fetched when first asked about and refreshed when next asked about
              after going stale. The load on the shared services tracks actual
              use, which is the only shape that scales to a whole country on a
              small server.
            </p>

            <h3>Schedule knowledge, not arrivals</h3>
            <p>
              The transit answers are held to the same standard as the facts.
              What a published static schedule gives is a pattern &mdash; first
              and last service, typical frequency, the days a route runs &mdash;
              and that is what the map offers. What it does not give is where the
              bus is now, so the map refuses to imply it: no &ldquo;next one in
              three minutes&rdquo;, because it cannot know that. Saying what it
              has, and what it hasn&rsquo;t, is the point.
            </p>

            <p className="muted">
              <small>
                All of this is recent, and a test learned from in the open. The
                reasoning is written down because a decision you can see is one
                you can argue with.
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
              OpenStreetMap contributors, under ODbL; transit from
              agencies&rsquo; published GTFS feeds; knowledge from Wikipedia and
              Wikivoyage (text under CC&nbsp;BY-SA) and Wikidata (CC0), each
              cited in the answer it appears in.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
