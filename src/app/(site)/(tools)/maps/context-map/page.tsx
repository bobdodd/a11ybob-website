import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";
import { NewTabLink } from "@/components/NewTabLink";

export const metadata: Metadata = {
  title: "Context Map",
};

export default function MapsContextMap() {
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
                <Link href="/maps">&larr; Maps</Link>
              </small>
            </p>
            <h1>Context Map</h1>
            <p className="lede">
              The other maps draw something. The Context Map draws
              nothing. It is the three spoken descriptions from the{" "}
              <Link href="/maps/tiled-toronto-map">
                tiled Toronto map
              </Link>{" "}
              &mdash; quick, continuous, and detailed &mdash; on a plain
              page with three big buttons and no graphics at all. There
              is no map to read: you press a button and it tells you
              where you are and what is around you.
            </p>
            <p className="muted">
              <small>
                A test, not a finished demo &mdash; built to be trialled
                on the street, among crowds, and learned from.
              </small>
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Try the interactive demo</h2>
            <p>
              <NewTabLink
                className="pill"
                href="/demos/context-map/viewer.html"
              >
                Open the Context Map
              </NewTabLink>
            </p>
            <p className="muted">
              <small>
                You will be asked to read and accept the notice, then to
                allow location access. The demo takes over screen-reader
                announcements and runs on its own surface, which is why
                it opens in a new window. Close it to come back here.
              </small>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it is</h2>
            <p>
              Take the tiled Toronto map, remove the map, and keep the
              voice. What is left is three buttons and a running
              transcript. Press one and it tells you where you are and
              what is around you &mdash; the road you are on, the
              cross-street ahead, the notable places nearby &mdash; each
              with a distance and a clock-face or compass direction.
              There is nothing to look at and nothing to pan. The
              description <em>is</em>{" "}the map.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why a map you don&rsquo;t look at</h2>
            <p>
              Digital maps are, for the most part, not very accessible
              &mdash; and the parts that are can still be hard work to
              operate. Even the navigation aids built for blind and
              low-vision people tend to do one narrow thing well and say
              little about <em>where you are and what your surroundings
              are like</em>. That is getting better, but it is still not
              great.
            </p>
            <p>
              A visual map is something a sighted reader takes in at a
              glance and a screen-reader user works through a great deal
              of structure to reach. For someone who only ever hears the
              map, all that structure &mdash; the tiles, the rotor, the
              focus management &mdash; sits between them and the one
              thing they came for: <em>what is around me</em>. The
              Context Map takes it away. The aim is to be as simple as it
              can possibly be: three big buttons, a line or a paragraph
              of plain speech, and no map-reading skill asked of anyone.
              You do not pan, zoom, or hunt through structure. You press
              a button and listen.
            </p>
            <p>
              And because it speaks out loud rather than only feeding a
              screen reader, it is not only for screen-reader users.
              Someone with limited mobility who cannot easily turn to
              look around them &mdash; who cannot turn their head freely,
              or whose hands are busy with crutches or another mobility
              aid &mdash; can hold the phone and hear the same
              description.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The three controls</h2>
            <ul>
              <li>
                <strong>Quick describe</strong>{" "}&mdash; one line, on
                demand: which way you face, the road you are on, the
                nearest main intersection, and the most worth-mentioning
                thing near you.
              </li>
              <li>
                <strong>Describe as I move</strong>{" "}&mdash; a running
                commentary as you walk; and because being turned around
                is movement too, it calls out when you turn, names your
                new direction, and re-casts everything around you to it.
                That is the part being tested in a crowd.
              </li>
              <li>
                <strong>Detailed surroundings</strong>{" "}&mdash; the full
                picture, read out and laid out as headings you can move
                through: ahead, to your right, behind you, to your left.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it chooses to tell you</h2>
            <p>
              A description is only useful if it is the <em>right</em>{" "}
              handful of things. Each press gives you the road you are
              on; the nearest main intersection at each end of your
              block, the one ahead of you first; the notable named places
              nearby; and a one-line read on the character of the area
              you are in &mdash; each with a distance and a clock-face or
              compass direction.
            </p>
            <p>
              What counts as worth mentioning depends on where you are.
              In a built-up area it leans on the things that matter on a
              city street &mdash; shops, places to eat, pedestrian
              crossings, transit stops. Out in the country those would
              leave you with almost nothing, so it speaks to the shape of
              the land instead: the lakes, ponds and wetland around you,
              woodland, and the nearest named settlement. The same press
              in the middle of Cambridge and beside a lake near Buckhorn
              should each feel like a fair account of that place.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Presence, never absence</h2>
            <p>
              The page only ever tells you what <em>is</em>{" "}there. It
              never tells you something is absent &mdash; never
              &ldquo;no crossing here&rdquo;, never &ldquo;nothing
              nearby&rdquo;. The reason is the data: OpenStreetMap is
              mapped unevenly, and accessibility tags especially &mdash;
              dropped kerbs above all &mdash; are sparse. Silence means
              &ldquo;not mapped&rdquo;, which is not the same as
              &ldquo;not there&rdquo;. Treating a gap in the data as a
              fact about the world is exactly the kind of mistake that
              gets someone into trouble at a kerb, so the page refuses to
              make it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Which way you&rsquo;re facing</h2>
            <p>
              Everything is described relative to the way you are
              pointing: 12 o&rsquo;clock is straight ahead, 3
              o&rsquo;clock is to your right. For that to be right, the
              page has to know your heading &mdash; and there are two
              honest sources for it, each trustworthy in different
              circumstances.
            </p>
            <p>
              When you are <strong>moving</strong>, the most reliable
              heading is your course over the ground from GPS: it is
              immune to a miscalibrated compass, which on some phones can
              read fully half a turn out. When you are{" "}
              <strong>standing still</strong>, GPS has no course to give,
              and only the magnetometer &mdash; the device compass
              &mdash; knows which way you are turned. The design uses
              both, each where it is the trustworthy one.
            </p>
            <p>
              For the current street trials the GPS side is{" "}
              <strong>switched off</strong>{" "}and the page runs on the
              compass alone, so we can shake out the magnetometer
              behaviour on its own. That is a temporary testing state,
              not the design &mdash; the two-source heading is built and
              waiting to be turned back on.
            </p>
            <p>
              The compass came with a problem of its own. A phone&rsquo;s
              reported compass heading assumes you are holding it flat in
              your palm; held upright, the way you naturally carry it
              while walking, the raw figure drifts as the phone tilts.
              iOS quietly corrects for this in the operating system; on
              Android it does not, so we compute a tilt-compensated
              heading ourselves from the phone&rsquo;s full orientation
              &mdash; the true bearing of the back of the phone &mdash;
              which stays correct however the phone is held.
            </p>
            <p>
              Being turned around is a kind of movement too. Rather than
              reacting to every small wobble, &ldquo;Describe as I
              move&rdquo; waits until a turn has <em>settled</em>, then
              announces your new direction and re-casts everything around
              you to it. That steadiness is the part being tested in a
              crowd.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Speaking alongside your screen reader</h2>
            <p>
              The page speaks through the browser&rsquo;s Web Speech API.
              Where that is missing &mdash; on a hardened platform like
              GrapheneOS, for instance &mdash; it falls back to an ARIA
              live region instead. The two are never used together: a
              live region running alongside real speech would say
              everything twice.
            </p>
            <p>
              Speech is the preferred channel, not merely the
              fallback&rsquo;s alternative. ARIA live regions were not
              designed for a stream of frequent messages, and they have
              no way to <em>stop</em>{" "}an announcement part-way through
              &mdash; once one starts, you wait it out, even after you
              have already moved on. The Speech API can interrupt itself
              and pace what it says. It also opens the page up: because
              it speaks aloud in its own right, it works for sighted
              disabled users who do not run a screen reader at all.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Staying on while you move</h2>
            <p>
              While &ldquo;Describe as I move&rdquo; is running, the page
              holds a screen wake lock so the display does not sleep and
              cut the commentary off mid-walk. It tells you it is doing
              this: the screen will stay on until you switch apps or
              close the page.
            </p>
            <p>
              That is as far as a web page can go. Keeping the audio
              running in the <em>background</em>{" "}&mdash; while you are in
              another app, or with the phone locked in your pocket
              &mdash; is not something a web page is permitted to do. It
              would need a native app, which is granted permissions the
              browser withholds. The wake lock is the ceiling of what is
              possible here, and the page is honest about that limit.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Built on OpenStreetMap</h2>
            <p>
              All of the place data comes from{" "}
              <a href="https://www.openstreetmap.org/">
                OpenStreetMap
              </a>
              , the crowd-sourced map of the world. Building on it means
              its limitations come straight through to you: a building
              nobody has traced is missing; a shop that changed hands
              last year may still carry the old name. The Context Map can
              only ever be as current and as complete as the map
              underneath it.
            </p>
            <p>
              The other side of that is the good part. OpenStreetMap
              holds a surprising amount of accessibility detail that most
              maps never surface &mdash; dropped kerbs, signal-controlled
              crossings, tactile paving, benches, accessible washrooms,
              ramps and stairs &mdash; and the Context Map brings it out
              and speaks it. That information has been in the map all
              along; it has rarely been <em>read aloud</em>.
            </p>
            <p>
              What is frustrating is how much accessibility data sits
              locked inside commercial tools, where it cannot be
              contributed back to a shared map that anyone can build on
              &mdash; even when it was a volunteer who gathered it in the
              first place.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The map behind a page with no map</h2>
            <p>
              There is still a map underneath &mdash; you just never see
              it. The descriptions are not read off drawn tiles; they
              come from a search index. Every feature on the tiled
              Toronto map &mdash; every shop, crossing, bench and
              water&rsquo;s edge &mdash; is also a record in an
              OpenSearch index, carrying its position, its kind, and its
              accessibility detail. It is the very same index that powers
              the search box on the visual map.
            </p>
            <p>
              That is what lets this page exist without graphics at all.
              Instead of rendering a tile and asking you to interpret it,
              the Context Map asks the index a question &mdash;{" "}
              <em>
                what is near this point, in which direction, how far
              </em>{" "}
              &mdash; and reads the answer back. No tiles to draw,
              nothing to pan or zoom: the search data <em>is</em>{" "}the
              map.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A test, not a tool</h2>
            <p>
              This is unfinished, untested software, and it says so
              before you can use it. Every time you open it you have to
              read and accept a notice &mdash; that it can be wrong, that
              it is{" "}
              <strong>
                not for navigation or any safety decision
              </strong>
              , and that you use it entirely at your own risk. The notice
              appears on every visit, not once, because the software is
              unfinished and the stakes on a street are real. Keep using
              your usual ways of getting around at all times.
            </p>
            <p>
              Where it can, it repairs quietly rather than alarming you.
              If the compass is slow to start, or a location request
              times out, it retries in the background instead of throwing
              an error into your ear in the middle of the pavement.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Source</h2>
            <p>
              GPL-3.0. The Context Map is the spoken layer of the{" "}
              <Link href="/maps/tiled-toronto-map">
                tiled Toronto map
              </Link>{" "}
              &mdash; it runs on the same engine and the same backend,
              and is reachable from within that map as well as on its own
              here &mdash;{" "}
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
