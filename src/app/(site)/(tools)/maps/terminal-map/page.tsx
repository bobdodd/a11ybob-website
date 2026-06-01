import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";
import { NewTabLink } from "@/components/NewTabLink";

export default function MapsTerminalMap() {
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
            <h1>Terminal map</h1>
            <p className="lede">
              Interior wayfinding for an airport terminal &mdash; the
              richest feature inventory of the three demos: gates,
              security checkpoints, washrooms, retail, services,
              accessible routes, charging stations, in an environment
              that fails most of the assumptions consumer mapping
              tools make. The worked example is a real terminal
              &mdash; Vancouver International&rsquo;s Level 3
              departures &mdash; but the demo is here as a generic
              terminal-wayfinding example; the particular airport is
              incidental.
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
                href="/demos/terminal-map/viewer.html"
              >
                Open the interactive terminal map
              </NewTabLink>
            </p>
            <p className="muted">
              <small>
                Once opened, the demo takes over keyboard navigation,
                focus management, and screen-reader announcements, so
                it runs on its own surface rather than inside this
                page &mdash; which is why it opens in a new window.
                Close it to come back here.
              </small>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it is</h2>
            <p>
              An interior terminal map, built using the same
              architecture as the other two demos &mdash;
              pin-as-datum at viewport centre, dual-mode interaction,
              rotor for narrowing tab order, F6 landmark cycle,
              Dragon-optimised voice control, context-adapted
              skip-links. The skip-links here are the
              terminal-specific kind: <em>skip to Pier A</em>,{" "}
              <em>skip to Pier B</em>, and so on, with focus landing
              on the lowest-numbered gate in the chosen pier.
            </p>
            <p>
              The map data is Vancouver International&rsquo;s
              published Level 3 departures plan. YVR retains copyright
              in the underlying cartography &mdash; the{" "}
              <a href="https://github.com/bobdodd/terminal-map/blob/main/NOTICE">
                repository NOTICE
              </a>{" "}
              records this &mdash; and it is shown here purely as the
              example the technique runs on, not because the airport
              itself matters to the demonstration.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why interior wayfinding is harder</h2>
            <ul>
              <li>
                <strong>No GPS.</strong> Indoor positioning is its
                own engineering problem; this demo doesn&rsquo;t
                solve it. The pin moves under user control, not under
                GPS lock.
              </li>
              <li>
                <strong>No OSM ground truth.</strong> Indoor features
                are not consistently captured in OpenStreetMap data.
                The map is hand-built from publicly-available terminal
                plans.
              </li>
              <li>
                <strong>Denser feature semantics.</strong> Outdoor
                maps deal with roads, buildings, parks. Terminal maps
                deal with gates by airline, security checkpoints by
                class, washrooms with accessibility attributes, retail
                by type, lounges by alliance, family rooms, quiet
                rooms, charging stations, accessible-route segments.
                The cognitive load is higher because the affordances
                matter more acutely.
              </li>
              <li>
                <strong>Accessibility-critical.</strong> A user
                missing a gate on a streetmap walks an extra block. A
                user missing a gate in a terminal misses a flight. The
                cost of wayfinding failure is substantively higher
                indoors.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Status</h2>
            <p>
              This is Pattern B work: built at home in evenings, with
              the expectation of using it for work, while CNIB had a
              relationship with YVR. It is not a CNIB commercial
              deliverable, and the data shown is Lorem-Ipsum-grade
              placeholder where real proprietary data would otherwise
              sit. The intent was to demonstrate the approach to a
              potential client; the client conversation did not
              progress; the architecture and the proof remain in the
              public repository.
            </p>
            <p>
              The most &ldquo;could-be-commercial&rdquo; of the three
              demos. Useful as the argument that the architecture
              scales beyond hobby projects into terminal-grade
              wayfinding artefacts.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Source</h2>
            <p>
              GPL-3.0. Source:{" "}
              <a href="https://github.com/bobdodd/terminal-map">
                github.com/bobdodd/terminal-map
              </a>
              . The terminal map has its own repository; the other two
              demos live in{" "}
              <a href="https://github.com/bobdodd/accessible-maps">
                accessible-maps
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
