import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";
import { NewTabLink } from "@/components/NewTabLink";

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
              page with no graphics at all, so a blind screen-reader user
              can read their surroundings directly.
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
            <h2>What it is</h2>
            <p>
              Take the tiled Toronto map, remove the map, and keep the
              voice. What is left is three buttons and a running
              transcript. Press one and it tells you where you are and
              what is around you &mdash; the road you are on, the
              cross-street ahead, the notable places nearby &mdash; each
              with a distance and a clock-face or compass direction.
              There is nothing to look at and nothing to pan. The
              description <em>is</em> the map.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why strip the map away</h2>
            <p>
              A visual map is something a sighted reader takes in at a
              glance and a screen-reader user works through a great deal
              of structure to reach. For someone who only ever hears the
              map, all that structure &mdash; the tiles, the rotor, the
              focus management &mdash; sits between them and the one
              thing they came for: <em>what is around me</em>. The
              Context Map takes it away. It is also small and
              one-handed by design, for reading your surroundings while
              you are moving, phone in one hand, in a crowd.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The three controls</h2>
            <ul>
              <li>
                <strong>Quick describe</strong> &mdash; one line, on
                demand: which way you face, the road you are on, and the
                most worth-mentioning thing near you.
              </li>
              <li>
                <strong>Describe as I move</strong> &mdash; a running
                commentary as you walk; and because being turned around
                is movement too, it calls out when you turn, names your
                new direction, and re-casts everything around you to it.
                That is the part being tested in a crowd.
              </li>
              <li>
                <strong>Detailed surroundings</strong> &mdash; the full
                picture, read out and laid out as headings you can move
                through: ahead, to your right, behind you, to your left.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A test, not a tool</h2>
            <p>
              This is unfinished, untested software, and it says so
              before you can use it. You have to read and accept a
              notice &mdash; that it can be wrong, that it is{" "}
              <strong>not for navigation or any safety decision</strong>,
              and that you use it entirely at your own risk &mdash; every
              time you open it. It is shared to learn from a real trial,
              not to be relied on. Keep using your usual ways of getting
              around at all times.
            </p>
          </section>

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
            <h2>Source</h2>
            <p>
              GPL-3.0. The Context Map runs on the same engine and
              backend as the{" "}
              <Link href="/maps/tiled-toronto-map">
                tiled Toronto map
              </Link>{" "}
              &mdash;{" "}
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
