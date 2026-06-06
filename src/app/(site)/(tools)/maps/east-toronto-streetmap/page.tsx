import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";
import { NewTabLink } from "@/components/NewTabLink";

export default function MapsEastTorontoStreetmap() {
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
            <h1>East Toronto streetmap</h1>
            <p className="lede">
              Bob&rsquo;s first attempt at rendering OpenStreetMap
              data into screen-reader-navigable SVG. The visual
              rendering is deliberately basic &mdash; the work
              isn&rsquo;t about pretty maps; it&rsquo;s about
              whether the structure of an SVG can be made
              understandable to assistive technology. The{" "}
              <em>ARIA Landmarks</em> model, the <em>filter</em>{" "}
              system, and the <em>rotor</em> first appeared here,
              and the three later maps in the family inherit the
              architecture from this one. The map content itself
              is a section of east Toronto, rendered from a single
              OpenStreetMap tile.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it is</h2>
            <p>
              A section of east Toronto rendered from one OSM
              tile, roughly 1km&sup2;. Visual fidelity isn&rsquo;t
              the point &mdash; the rendering is basic by design,
              because the interest was in the architecture of the
              SVG itself: whether OSM features could be turned
              into screen-reader-navigable structure rather than
              into a picture a sighted user looks at.
            </p>
            <p>
              The conceptual model introduced here &mdash; ARIA
              Landmarks to group features, filters to show or
              suppress categories, and the rotor to skim a
              category fast &mdash; became the family resemblance
              that the three later maps in the lineage share: the
              fully-rendered{" "}
              <Link href="/maps/tiled-toronto-map">
                tiled Toronto map
              </Link>
              , the terminal map,
              and this east Toronto demo where the model
              originated.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The SVG architecture</h2>
            <p>
              The demo is a single SVG generated from a long-ago
              one-time pull of OpenStreetMap data for a section of
              east Toronto, with ARIA labels{" "}
              <em>pre-built at generation time</em>. The data is
              not refreshed and is not the point &mdash; nothing
              on the demo queries OpenStreetMap (or any spatial
              database) at runtime; filter toggles run at CSS
              speed rather than at JavaScript speed; the SVG is
              served as a plain asset. The interest of the
              artefact is the structure of the SVG itself: whether
              an OSM extract could be turned into 
              screen-reader-navigable structure rather than into a picture a
              sighted user looks at.
            </p>
            <p>
              The architecture is a four-layer CISNA instantiation
              in cartographic form &mdash; Adaptation (which
              features to show this user), Navigation (how to move
              between them), Semantics (what each feature means
              and how it relates to nearby features), and
              Inventory (which OSM features have been rendered
              into the SVG) &mdash; with External Content sitting
              beneath everything as the raw OpenStreetMap extract.
            </p>
            <p className="muted">
              <small>
                The pipeline that processes OSM data into many
                pre-rendered SVG tiles served from Bob&rsquo;s own
                tile server, with the viewer fetching tiles as the
                viewport pans, is the contribution of the{" "}
                <Link href="/maps/tiled-toronto-map">
                  tiled Toronto map
                </Link>
                . It isn&rsquo;t part of this single-tile demo.
              </small>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Feature inventory</h2>
            <p>
              Eighteen top-level OSM categories with hundreds of
              subcategories rendered: buildings, roads (with
              casings), transit stops, parks, healthcare,
              transportation infrastructure
              (railways/airports/highways/platforms), financial
              services, sustenance & food, accommodation & tourism,
              entertainment & culture, emergency services,
              historic features, shops, schools, places of
              worship, addresses, barriers, natural features. The
              breadth that makes a map a <em>map</em> rather than
              a points-of-interest overlay.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A map to explore, not a set of pins</h2>
            <p>
              That last distinction is where this demo parts company
              with the{" "}
              <Link href="/maps/search-and-map-pins">
                search and map pin demo
              </Link>. That demo is
              about its <em>pinned points of interest</em> &mdash;
              where the properties are &mdash; so it renders a raster
              base with an addressable pin overlay, and only the pins
              need to be reachable. This map has the opposite job:
              letting a non-sighted user explore the detailed space
              itself. That is why <em>everything</em> here is drawn as
              addressable SVG, and why the affordances for navigating a
              whole map &mdash; ARIA landmarks to group features,
              category filters to manage clutter, and the rotor to skim
              one category at a time &mdash; first became necessary,
              and first appeared, here. When the space itself is the
              content, the reader needs ways through it; a handful of
              pins does not.
            </p>
            <p>
              There is no single right answer across the family &mdash;
              the rendering and the affordances follow the job. The{" "}
              <Link href="/maps/tiled-toronto-map">
                tiled Toronto map
              </Link>{" "}
              and the{" "}
              <Link href="/maps/terminal-map">terminal map</Link>{" "}
              inherit this map&rsquo;s &ldquo;explore the space&rdquo;
              brief and the navigation model that goes with it; the
              terminal map then adds search, routing, level structure,
              and the <kbd>F6</kbd> region cycle on top.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where it came from</h2>
            <p>
              First publicly shown as a 45-minute in-person
              session at the 2019 Guelph Accessibility Conference
              at the University of Guelph. The talk demoed an
              earlier, low-fidelity, black-and-white,
              file:///-served rendering of the streetmap with the
              dual-mode interaction model and the pin-as-datum
              already present in primitive form. The architectural
              decisions on this page &mdash; SVG over raster, CSS
              filters over JS, OpenStreetMap as the data source
              &mdash; came from the work that followed. The
              project&rsquo;s earlier working name was
              &ldquo;Guelph streetmap&rdquo; for that reason; the
              name has now been retired in favour of one that
              describes the map&rsquo;s actual content.
            </p>
            <p>
              The lineage reads in three steps. The{" "}
              <Link href="/maps/search-and-map-pins">
                search and map pin demo
              </Link>{" "}
              came first &mdash; it introduced the
              Cartesian-to-polar verbal description of space (the
              vocabulary the rotor still uses: &ldquo;1 o&rsquo;clock,
              fifty metres&rdquo; rather than &ldquo;at
              coordinates X, Y&rdquo;). This east Toronto demo
              came second &mdash; the conceptual model of ARIA
              Landmarks + filters + rotor that the family of maps
              now shares. The three maps that inherit the model:
              the{" "}
              <Link href="/maps/tiled-toronto-map">
                tiled Toronto map
              </Link>{" "}
              (the direct architectural
              successor, scaling the single-tile pipeline shown
              here to a full city), the{" "}
              <Link href="/maps/terminal-map">terminal map</Link>{" "}
              (which carries the same conceptual model into an
              indoor airport surface), and this demo itself, which
              remains live as the architectural reference.
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
                href="/demos/east-toronto-streetmap/viewer.html"
              >
                Open the east Toronto streetmap
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
              <a href="https://github.com/bobdodd/east-toronto-streetmap">
                github.com/bobdodd/east-toronto-streetmap
              </a>
              . The web-app source and the full OpenStreetMap-derived
              data pipeline &mdash; the raw <code>map.osm</code>{" "}
              extract, the shapefile exports, and the GeoJSON layers
              &mdash; are part of the public artefact; the map data is
              &copy; OpenStreetMap contributors, under ODbL.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/research/cisna-model">
                  The CISNA Model
                </Link>{" "}
                &mdash; the four-layer architecture this tile
                pipeline is an instantiation of.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
