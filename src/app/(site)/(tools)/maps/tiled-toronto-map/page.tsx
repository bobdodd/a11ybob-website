import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";
import { NewTabLink } from "@/components/NewTabLink";

export default function MapsTiledTorontoMap() {
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
            <h1>Tiled Toronto map</h1>
            <p className="lede">
              A step change from the{" "}
              <Link href="/maps/east-toronto-streetmap">
                East End Toronto streetmap
              </Link>
              . It keeps the ideas &mdash; the addressable SVG, the
              filters, the rotor &mdash; but builds a live,
              context-aware map of the whole city out of pre-rendered
              SVG tiles, with far more content and improved navigation.
            </p>
            <p className="muted">
              <small>
                A first pass: this page will get the fuller treatment
                the other maps have once we sit down with it properly.
              </small>
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it is</h2>
            <p>
              The East End Toronto streetmap is a single rendered tile: one
              SVG of one area. The tiled Toronto map takes the same
              approach to city scale. It emulates the way Google Maps
              and OpenStreetMap work &mdash; a grid of tiles fetched as
              you pan &mdash; but with one crucial difference: it does
              not serve PNG images with pins drawn on top. It serves{" "}
              <strong>pre-rendered SVG tiles</strong>, so the semantic
              map information a raster PNG throws away is preserved all
              the way to the reader. Inside those tiles you get a
              better-rendered version of the East End Toronto content, with
              improved navigation and a great deal more of it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Live and context-aware</h2>
            <p>
              Unlike the other three demos, this map knows where you
              are. If you are in downtown Toronto, it locates your
              position on the map. If you are not, it falls back to a
              simulation that starts from a default location downtown,
              so the experience is the same wherever you open it from.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why a tile server of my own</h2>
            <p>
              The first attempt used OpenStreetMap directly: pull the
              PNG tiles, then pull the semantic metadata and draw it
              over them. For the level of detail this map wants, that
              was grindingly slow &mdash; up to ten seconds or more to
              assemble a single tile, which makes panning around the
              map frustrating rather than fluid.
            </p>
            <p>
              So the map is served by a separate{" "}
              <strong>tile server</strong>{" "}of its own, one that hands
              back efficient, pre-compiled SVG tiles with all the
              semantics already baked in. That is the unique selling
              point of this map against the live OpenStreetMap
              implementations that query an Overpass endpoint at view
              time: the heavy work happens once, at tile-generation
              time, not on every pan.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Ideas being tried here</h2>
            <p>
              This page is a first pass, but a few of the family&rsquo;s
              open questions are being explored on this map in
              particular, because city scale and live positioning make
              them matter more.
            </p>
            <ul>
              <li>
                <strong>A multi-select rotor.</strong>{" "}Where the{" "}
                <Link href="/maps/east-toronto-streetmap">
                  East End Toronto streetmap
                </Link>{" "}
                offers single-select radio buttons &mdash; one category
                at a time &mdash; the sheer volume of content here pushes
                the rotor to multi-select checkboxes, so a reader can
                hold several categories in view at once.
              </li>
              <li>
                <strong>Contextual zoom.</strong>{" "}Rather than a
                fixed-size focus marker, zoom to frame the focused
                feature by its size and meaning &mdash; a park or a
                school ground with some of its locality &mdash; so focus
                stays findable when the map is zoomed out.
              </li>
              <li>
                <strong>A reader-placed anchor.</strong>{" "}A movable
                reference point a reader can drop, the way you drag
                Street View onto a spot in Google Maps, so features can
                be described relative to it on a map that otherwise has
                no single anchor.
              </li>
            </ul>
            <p>
              The reasoning behind each &mdash; and why they are still
              open &mdash; is in{" "}
              <Link href="/maps/east-toronto-streetmap/speaking-and-finding-your-place">
                speaking the map, and finding your place
              </Link>
              .
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
                href="/demos/tiled-toronto-map/viewer.html"
              >
                Open the tiled Toronto map
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
            <p className="muted">
              <small>
                The viewer is a passive client: it fetches the
                pre-rendered SVG tiles from a separate origin
                (<code>tiles.a11ybob.com</code>), the way a real
                deployment would point at a CDN. Allow location access
                to be placed on the map if you are in downtown Toronto;
                otherwise it starts from a default location downtown.
              </small>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Source</h2>
            <p>
              GPL-3.0. The viewer:{" "}
              <a href="https://github.com/bobdodd/tiled-toronto-map">
                github.com/bobdodd/tiled-toronto-map
              </a>
              . The tile server:{" "}
              <a href="https://github.com/bobdodd/tile-server">
                github.com/bobdodd/tile-server
              </a>
              . The tiles are rendered from OpenStreetMap data, &copy;
              OpenStreetMap contributors, under ODbL.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
