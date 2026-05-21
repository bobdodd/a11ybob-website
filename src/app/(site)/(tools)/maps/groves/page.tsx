import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";

export default function MapsGroves() {
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
            <h1>The Groves subdivision</h1>
            <p className="lede">
              By far the most stripped-down of the three demos.
              Residential streets in Buckhorn, Ontario; no interior
              buildings; no feature inventory beyond the road
              network. The simplicity is precisely what made the
              modality-conversion finding visible.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it is</h2>
            <p>
              A streetmap of The Groves subdivision in Buckhorn,
              built in 2022. PNG-based map underneath, with a
              checkbox-curated pin overlay above. Cartesian via
              touch, polar on tap. Pin-as-datum at the centre of
              the viewport.
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
              The finding generalised. It applies to YVR&rsquo;s
              gates and washrooms and Guelph&rsquo;s pubs and
              parks as much as to the Groves&rsquo; residential
              streets. The simplicity here is what made the
              generalisation visible; the richer demos use it
              without re-discovering it.
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
              versa); and the user&rsquo;s agent in the multi-
              agent CoP framing.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Try it</h2>
            <p>
              The live demo currently lives at{" "}
              <a href="https://bobd76.sg-host.com">
                bobd76.sg-host.com
              </a>{" "}
              alongside the East Toronto streetmap on the same
              hosting.
              Pending the in-progress migration off SiteGround
              onto the OVH VPS, after which the demo moves to{" "}
              <code>maps-groves.a11ybob.com</code> and the link
              here updates.
            </p>
            <p className="muted">
              <small>
                The demo takes over keyboard navigation, focus
                management, and screen-reader announcements once
                opened; that is why it lives at its own URL rather
                than as an iframe on this page.
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
              <a href="https://github.com/bobdodd/accessible-maps">
                github.com/bobdodd/accessible-maps
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
