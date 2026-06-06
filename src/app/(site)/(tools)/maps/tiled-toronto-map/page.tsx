import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";

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
                East Toronto streetmap
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
              The East Toronto streetmap is a single rendered tile: one
              SVG of one area. The tiled Toronto map takes the same
              approach to city scale. It emulates the way Google Maps
              and OpenStreetMap work &mdash; a grid of tiles fetched as
              you pan &mdash; but with one crucial difference: it does
              not serve PNG images with pins drawn on top. It serves{" "}
              <strong>pre-rendered SVG tiles</strong>, so the semantic
              map information a raster PNG throws away is preserved all
              the way to the reader. Inside those tiles you get a
              better-rendered version of the East Toronto content, with
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
              <strong>tile server</strong> of its own, one that hands
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
            <h2>The live demo</h2>
            <p>
              The interactive demo is being prepared for hosting here,
              alongside the other three maps. It has two moving parts
              &mdash; the viewer and the tile server that feeds it
              &mdash; so standing it up on the site is a larger step
              than the single-file demos, and it follows separately.
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
