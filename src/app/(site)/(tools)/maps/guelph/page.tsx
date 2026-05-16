import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";

export default function MapsGuelph() {
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
            <h1>Guelph streetmap</h1>
            <p className="lede">
              The earliest demo, from a 2019 Guelph Accessibility
              Conference webinar, and the most architecturally
              ambitious. Pre-rendered SVG tiles, comprehensive OSM
              feature coverage, and the architecture that scales
              the approach to a full city. The spiritual ancestor
              of the current accessible-maps Toronto streetmap
              work.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it is</h2>
            <p>
              A streetmap of Guelph, Ontario. Same design
              vocabulary as the other two demos &mdash;
              pin-as-datum, dual-mode interaction, rotor, F6
              landmark cycle, Dragon voice support &mdash; but the
              first surface that demonstrated the approach scales
              to a city rather than to a subdivision or a single
              building. The Toronto streetmap (in active
              development) grew from this architecture.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The SVG-tile architecture</h2>
            <p>
              The technical contribution that makes the city scale
              workable. OpenStreetMap data is processed into{" "}
              <strong>0.01&deg; geographic squares</strong>{" "}
              (roughly 1km&sup2; each), each rendered offline as a
              compressed SVG.gz file with ARIA labels{" "}
              <em>pre-built at generation time</em>. The viewer
              loads only the tiles in and adjacent to the current
              viewport; pan operations resolve as tile fetches
              rather than as Overpass queries against a remote
              database; filter toggles run at CSS speed rather
              than at JavaScript speed.
            </p>
            <p>
              The performance numbers against a naive runtime-
              query implementation:
            </p>
            <ul>
              <li>Initial load: 2&ndash;3s &rarr; 0.5s</li>
              <li>Pan to new area: 1&ndash;2s &rarr; 0.3s</li>
              <li>Filter toggle: 500ms &rarr; 50ms</li>
              <li>Memory footprint: 100MB &rarr; 30MB</li>
              <li>Offline-capable after initial cache</li>
            </ul>
            <p>
              The architecture is a four-layer CISNA instantiation
              in cartographic form &mdash; Adaptation
              (which features to show this user), Navigation (how
              to move between them), Semantics (what each feature
              means and how it relates to nearby features), and
              Inventory (which SVG tiles cover this viewport and
              which raw OSM features have been rendered into them)
              &mdash; with External Content sitting beneath
              everything as the raw OpenStreetMap source data.
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
              The 2019 Guelph Accessibility Conference webinar.
              That talk demoed an earlier, file:///-served, black-
              and-white line-art version of the streetmap with the
              dual-mode interaction model and the pin-as-datum
              already present in primitive form. The architectural
              decisions on this page &mdash; SVG over raster, CSS
              filters over JS, pre-rendered tiles over runtime
              queries, OSM as the values-significant data source
              &mdash; came from the work that followed.
            </p>
            <p>
              The Toronto streetmap currently under development
              is the direct successor: same architecture, same
              tile generation pipeline, scaled to a larger city
              and a richer feature set. The Guelph demo remains
              live as the architectural reference.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Try it</h2>
            <p>
              The live Guelph demo currently lives at{" "}
              <a href="https://bobd76.sg-host.com">
                bobd76.sg-host.com
              </a>{" "}
              pending migration off SiteGround to the OVH VPS.
              After migration the demo moves to{" "}
              <code>maps-guelph.a11ybob.com</code> and the link
              here updates.
            </p>
            <p className="muted">
              <small>
                Like the other two demos, the Guelph map takes
                over keyboard navigation, focus management, and
                screen-reader announcements once opened; that is
                why it lives at its own URL rather than as an
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
              GPL-3.0. Repository information will be linked here
              when the maps repository is moved to its dedicated
              public location alongside the other tooling. The
              tile-generation Python pipeline and the web-app
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
