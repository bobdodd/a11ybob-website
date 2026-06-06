import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";
import { NewTabLink } from "@/components/NewTabLink";

export default function MapsSearchAndMapPins() {
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
            <h1>Search and map pin demo</h1>
            <p className="lede">
              By far the most stripped-down of the three demos. The
              residential streets of a typical North American urban
              subdivision; no interior buildings; no feature inventory
              beyond the road network. The simplicity is precisely what
              made the modality-conversion finding visible.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it is</h2>
            <p>
              A streetmap of a residential subdivision. PNG-based map
              underneath, with a checkbox-curated pin overlay above.
              Cartesian via touch, polar on tap. Pin-as-datum at the
              centre of the viewport.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why a raster base, and why that&rsquo;s right here</h2>
            <p>
              The later maps in the family draw{" "}
              <em>everything</em> as addressable SVG, because their
              job is to let a non-sighted user explore the detailed
              space itself. This demo does not work that way, and
              that is a deliberate, fit-for-purpose choice rather than
              a shortcoming. Here what matters are the{" "}
              <strong>pinned points of interest</strong> &mdash; where
              the properties are in the subdivision &mdash; not the
              detail of the streets around them. The map renders a
              raster base for sighted context, and the accessible,
              interactive layer is the <em>pin overlay</em> drawn on
              top: only the pins need to be addressable, focusable, and
              described, because only the pins are what the map is
              about.
            </p>
            <p>
              This is the family&rsquo;s working principle in
              miniature: there is no single right way to render an
              accessible map &mdash; the rendering should follow the
              job. This demo answers &ldquo;where are the
              properties, and what is near each one?&rdquo;; the{" "}
              <Link href="/maps/east-toronto-streetmap">
                East Toronto streetmap
              </Link>{" "}
              and the{" "}
              <Link href="/maps/terminal-map">terminal map</Link>{" "}
              answer &ldquo;help me explore this whole space,&rdquo;
              and pay the cost of making every feature addressable to
              do it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why this demo produced the polar finding</h2>
            <p>
              The simplicity is the point. Most accessible-mapping
              prototypes start by piling on features &mdash; POIs,
              accessibility tags, transit overlays &mdash; and the
              cognitive load of the feature set obscures whatever
              spatial-cognition decision is being made underneath.
              With residential streets and nothing else, the
              modality-conversion problem became visible: the
              sighted observer scans the map in two dimensions; the
              non-sighted user, hearing announcements sequentially,
              has nothing like a two-dimensional reference frame to
              hold those announcements in. The visual map is
              Cartesian. The audio experience the user inhabits is
              polar.
            </p>
            <p>
              The finding generalised. It applies to a
              terminal&rsquo;s gates and washrooms and a
              streetmap&rsquo;s pubs and parks as much as to this
              demo&rsquo;s residential streets. The simplicity here
              is what made the generalisation visible; the richer
              demos use it without re-discovering it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Dual-mode interaction</h2>
            <p>
              Touch users move their finger across the map and
              hear what is under the finger at each location.
              Cartesian. Direct. Keyboard and screen-reader users
              tap a POI (or a coordinate) and hear its surroundings
              described &mdash; <em>(name, distance, compass
              direction)</em> for nearby features, arranged in
              onion-skin order from the tapped point. Polar.
              Allocentric, in the spatial-cognition vocabulary:
              centred on a chosen reference point, declarative,
              exploratory.
            </p>
            <p>
              The pin functions as four things at once: visual
              marker (sighted users see it at centre); polar
              origin (distances and directions resolve against
              it); datum (the map orbits the pin, not vice
              versa); and the user&rsquo;s agent in the 
              multi-agent CoP framing.
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
                href="/demos/search-and-map-pins/viewer.html"
              >
                Open the search and map pin demo
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
            <h2>Source</h2>
            <p>
              GPL-3.0. Source:{" "}
              <a href="https://github.com/bobdodd/search-and-map-pins">
                github.com/bobdodd/search-and-map-pins
              </a>
              . A single self-contained HTML file; the base map and
              all assets are original work.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
