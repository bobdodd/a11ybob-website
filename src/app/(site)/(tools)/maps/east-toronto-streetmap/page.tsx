import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";

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
              understandable to assistive technology. The
              <em> ARIA Landmarks</em> model, the <em>filter</em>{" "}
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
              multi-tile, fully-rendered Toronto streetmap
              currently in active development, the YVR terminal
              map, and this east Toronto demo where the model
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
              an OSM extract could be turned into screen-reader-
              navigable structure rather than into a picture a
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
                viewport pans, is the contribution of the
                in-development multi-tile Toronto streetmap. It
                isn&rsquo;t part of this single-tile demo.
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
              <Link href="/maps/groves">Groves subdivision work</Link>{" "}
              came first &mdash; it introduced the
              Cartesian-to-polar verbal description of space (the
              vocabulary the rotor still uses: &ldquo;1 o&rsquo;clock,
              fifty metres&rdquo; rather than &ldquo;at
              coordinates X, Y&rdquo;). This east Toronto demo
              came second &mdash; the conceptual model of ARIA
              Landmarks + filters + rotor that the family of maps
              now shares. The three maps that inherit the model:
              the multi-tile Toronto streetmap currently under
              active development (the direct architectural
              successor, scaling the single-tile pipeline shown
              here to a full city), the{" "}
              <Link href="/maps/yvr">YVR terminal map</Link>{" "}
              (which carries the same conceptual model into an
              indoor airport surface), and this demo itself, which
              remains live as the architectural reference.
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
              pending migration off SiteGround to the OVH VPS.
              After migration the demo moves to{" "}
              <code>maps-east-toronto.a11ybob.com</code> and the
              link here updates.
            </p>
            <p className="muted">
              <small>
                Like the other two demos, the east Toronto map
                takes over keyboard navigation, focus management,
                and screen-reader announcements once opened; that
                is why it lives at its own URL rather than as an
                iframe on this page.
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
              . The tile-generation Python pipeline and the web-app
              source are both part of the public artefact.
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
