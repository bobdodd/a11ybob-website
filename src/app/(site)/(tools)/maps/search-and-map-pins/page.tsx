import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";
import { NewTabLink } from "@/components/NewTabLink";

export const metadata: Metadata = {
  title: "Search and map pin demo",
};

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
              made the modality-conversion finding visible &mdash; and
              what makes it the clearest place to see the{" "}
              <Link href="/maps/how-its-built">underlying model</Link>{" "}
              at work.
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
                href="/demos/search-and-map-pins/viewer.html"
              >
                Open the search and map pin demo
              </NewTabLink>
            </p>
            <p className="muted">
              <small>
                Once opened, the demo takes over keyboard navigation,
                focus management, and screen-reader announcements, so it
                runs on its own surface rather than inside this page
                &mdash; which is why it opens in a new window. Close it to
                come back here.
              </small>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it is</h2>
            <p>
              A streetmap of a residential subdivision: a raster (PNG)
              base for sighted context, with a checkbox-curated pin
              overlay as the accessible layer on top. The pins are of
              two kinds &mdash; the <strong>properties</strong>{" "}for sale,
              which are the search results, and a handful of local{" "}
              <strong>amenities</strong>{" "}around them: a school, shops, a
              place of worship, somewhere to walk. Cartesian via touch,
              polar on tap; the selected pin sits at the centre of the
              viewport as the datum everything else is described against.
            </p>
            <p className="muted">
              <small>
                Shown briefly at the 2019 Guelph Accessibility
                Conference alongside the{" "}
                <Link href="/maps/east-toronto-streetmap">
                  East End Toronto streetmap
                </Link>
                , where the family&rsquo;s interaction model was first
                presented.
              </small>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why a raster base, and why that&rsquo;s right here</h2>
            <p>
              The later maps in the family draw <em>everything</em>{" "}as
              addressable SVG, because their job is to let a non-sighted
              user explore the detailed space itself. This demo does not
              work that way, and that is a deliberate, fit-for-purpose
              choice rather than a shortcoming. Here what matters are the{" "}
              <strong>pinned points of interest</strong>{" "}&mdash; where
              the properties are in the subdivision &mdash; not the
              detail of the streets around them. The map renders a raster
              base for sighted context, and the accessible, interactive
              layer is the <em>pin overlay</em>{" "}drawn on top: only the
              pins need to be addressable, focusable, and described,
              because only the pins are what the map is about.
            </p>
            <p>
              This is the family&rsquo;s working principle in miniature:
              there is no single right way to render an accessible map
              &mdash; the rendering should follow the job. This demo
              answers &ldquo;where are the properties, and what is near
              each one?&rdquo;; the{" "}
              <Link href="/maps/east-toronto-streetmap">
                East End Toronto streetmap
              </Link>{" "}
              and the{" "}
              <Link href="/maps/terminal-map">terminal map</Link>{" "}answer
              &ldquo;help me explore this whole space,&rdquo; and pay the
              cost of making every feature addressable to do it. Why one
              model renders so differently across the family is taken up
              in{" "}
              <Link href="/maps/how-its-built">
                how an accessible map is built
              </Link>
              .
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The information behind the pins</h2>
            <p>
              Each pin is a <em>typed</em>{" "}node. A property carries its
              address and the things a buyer filters on &mdash;
              bedrooms, bathrooms, style, price. An amenity carries its
              name and its class: education, retail, a place of worship,
              somewhere to walk. Between a property and the amenities
              around it runs the relation that actually matters to a
              buyer &mdash; <strong>convenience</strong>: how near each
              amenity is, and in which direction.
            </p>
            <p>
              That relation is not stored. It is computed from the
              coordinates the moment a property is chosen, which is why
              the same handful of pins can answer one buyer&rsquo;s
              priorities and then another&rsquo;s without the map
              changing. The general shape of this &mdash; typed nodes, a
              convenience graph, weights that follow need &mdash; is set
              out in{" "}
              <Link href="/maps/how-its-built">
                how an accessible map is built
              </Link>
              ; this demo is its simplest instance, which is exactly what
              makes it a good place to see it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Search, and where focus goes</h2>
            <p>
              The search filters the properties: bedrooms, bathrooms,
              style, and price narrow which pins the map shows. Choosing
              a result then does something deliberately unobvious &mdash;{" "}
              <strong>focus stays on the results list</strong>{" "}rather
              than jumping to the property on the map.
            </p>
            <p>
              The reason is the buyer&rsquo;s actual task. People want to
              pick several candidates and <em>then</em>{" "}compare where
              they sit relative to the things they care about; pulling
              focus onto the map at each pick would wreck that. Instead, a
              live region announces &ldquo;property displayed on the
              map,&rdquo; and the property waits there to be found.
              Keeping focus put avoids an unexpected change of context,
              and the announcement does the work the focus move would
              have done.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Finding a property, and the description around it</h2>
            <p>
              Because focus does not move, every pin has to be cheap to
              reach by navigation &mdash; so each property is both a{" "}
              <em>heading</em>{" "}and a <em>button</em>. A screen-reader
              user can jump straight to it by heading or by control,
              whichever rotor they reach for, and activate it once there.
            </p>
            <p>
              One subtlety, because it is a common trap: the heading and
              the button are kept as <em>siblings</em>, not nested. ARIA
              treats a button&rsquo;s descendants as presentational, so a
              heading placed <em>inside</em>{" "}a button can be folded into
              the button&rsquo;s name and disappear from the headings
              list. Keeping them siblings guarantees the heading stays a
              heading; the reasoning is worked through in{" "}
              <Link href="/maps/how-its-built">
                how an accessible map is built
              </Link>
              .
            </p>
            <p>
              Land on a property and its surroundings are described{" "}
              <em>from it outward</em>: the nearest amenities first, then
              the next ring further out, each given as a name, a
              distance, and a compass direction. That onion-ring order is
              the polar reading made concrete &mdash; closest matters
              most, and the description sweeps around the compass rather
              than scattering across the map. Why that order is a
              separate problem from the <em>importance</em>{" "}of each
              amenity &mdash; and why a plain &ldquo;nearest
              first&rdquo; list is not enough &mdash; is worked through in{" "}
              <Link href="/maps/how-its-built">
                how an accessible map is built
              </Link>
              ; here the set is small enough to hear in full.
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
              spatial-cognition decision is being made underneath. With
              residential streets and nothing else, the
              modality-conversion problem became visible: the sighted
              observer scans the map in two dimensions; the non-sighted
              user, hearing announcements sequentially, has nothing like
              a two-dimensional reference frame to hold those
              announcements in. The visual map is Cartesian. The audio
              experience the user inhabits is polar.
            </p>
            <p>
              The finding generalised. It applies to a terminal&rsquo;s
              gates and washrooms and a streetmap&rsquo;s pubs and parks
              as much as to this demo&rsquo;s residential streets. The
              simplicity here is what made the generalisation visible;
              the richer demos use it without re-discovering it.
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
              . A single self-contained HTML file; the base map and all
              assets are original work.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
