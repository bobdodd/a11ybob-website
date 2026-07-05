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
            <h1>East End Toronto streetmap</h1>
            <p className="lede">
              Bob&rsquo;s first attempt at rendering OpenStreetMap data
              into screen-reader-navigable SVG, and the origin of the
              whole family of maps. The visual rendering is deliberately
              basic &mdash; the work isn&rsquo;t about pretty maps;
              it&rsquo;s about whether the structure of an SVG can be
              made understandable to assistive technology. The{" "}
              <em>ARIA Landmarks</em>{" "}model, the <em>filter</em>{" "}system,
              and the <em>rotor</em>{" "}first appeared here, and the three
              later maps in the family inherit the architecture from
              this one. The map content is a section of the East End of
              Toronto &mdash; the area&rsquo;s actual name, not a loose
              &ldquo;east Toronto&rdquo; &mdash; rendered from a single
              OpenStreetMap tile, and first shown publicly at the 2019
              Guelph Accessibility Conference.
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
                href="/demos/east-toronto-streetmap/viewer.html"
              >
                Open the East End Toronto streetmap
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
            <h2>A map of the city fabric, not a set of pins</h2>
            <p>
              It helps to set this map against the{" "}
              <Link href="/maps/search-and-map-pins">
                search and map pin demo
              </Link>
              , because both show something called a &ldquo;map&rdquo;
              and they are fundamentally different kinds of thing. In
              the search and pin demo the streetmap is essentially a{" "}
              <strong>hero image</strong>: a backdrop on which the pins
              and controls are displayed. It isn&rsquo;t the subject;
              it&rsquo;s the canvas. Its information model is about a{" "}
              <em>subdivision</em> &mdash; the properties for sale and
              the handful of amenities around them &mdash; and the
              relationships it expresses are the relationships{" "}
              <em>of the subdivision itself</em>{" "}and{" "}
              <em>of the amenities to each other</em>, not to the world
              they sit in. It is, in effect, &ldquo;Google Maps search
              and pins&rdquo; for a subdivision, with the surrounding
              city present only as imagery.
            </p>
            <p>
              This map has the opposite job. It is about the{" "}
              <strong>underlying streetmap itself</strong> &mdash; or at
              least one small fraction of a city map. Here the map{" "}
              <em>is</em>{" "}the subject. Its information model is the{" "}
              <strong>city fabric</strong>: land areas populated with
              buildings &mdash; houses, shops, schools, bus stops,
              places of worship &mdash; and the relationships between
              them, in real geographic space. And this simple demo has{" "}
              <strong>no search</strong>{" "}at all, where the pin demo is
              built around it.
            </p>
            <p>
              That difference is why <em>everything</em>{" "}here is drawn as
              addressable SVG, while the pin demo can render a raster
              base and make only its pins reachable. When the space
              itself is the content, the reader needs ways through it; a
              handful of pins does not. There is no single right answer
              across the family &mdash; the rendering and the
              affordances follow the job. The{" "}
              <Link href="/maps/tiled-toronto-map">
                tiled Toronto map
              </Link>{" "}
              and the{" "}
              <Link href="/maps/terminal-map">terminal map</Link>{" "}
              inherit this map&rsquo;s &ldquo;explore the space&rdquo;
              brief and the navigation model that goes with it; the
              terminal map then adds search, routing, level structure,
              and the <kbd>F6</kbd>{" "}region cycle on top.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Everything is interactive &mdash; so explore by touch</h2>
            <p>
              Making the map the content has a consequence: there are{" "}
              <strong>many, many more interactive elements</strong>{" "}than
              a pin map has. Almost everything on the map is{" "}
              <em>nominally interactive</em>, or at the very least has to
              be <em>described</em>{" "}to a screen-reader user. That is
              huge. Imagine tabbing through every single feature of a
              city block, even if you wanted to &mdash; it is untenable.
              The map needs ways for a reader to take it in without
              walking the whole of it in a line, and the family&rsquo;s
              three navigation patterns &mdash; explore-by-touch,
              filters, and the rotor &mdash; exist precisely to make
              that possible.
            </p>
            <p>
              The first pattern is <strong>explore-by-touch</strong>.
              Move a finger over a touchscreen &mdash; or a mouse over
              the map &mdash; and you hear what is under it. That lets
              blind and low-vision readers build up the{" "}
              <em>spatial relationships</em>{" "}of a place directly: a
              mental picture of what is where, and what sits next to
              what, formed by exploring the surface rather than
              reconstructing it from a linear list of announcements. It
              assumes the reader has some <strong>proprioception</strong>{" "}
              &mdash; the kinaesthetic sense of where their hand and
              finger are in space &mdash; and a <strong>sense of
              touch</strong>{" "}to know when their finger is actually on the
              surface. For the people it suits, it turns the map from a
              list back into a space.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Filters</h2>
            <p>
              The second pattern is <strong>filters</strong>, which
              literally add and remove whole categories of content from
              the map &mdash; buildings, transit stops, shops. For{" "}
              <em>everyone</em>, they cut visual clutter: a category the
              reader isn&rsquo;t interested in simply isn&rsquo;t drawn.
              For a screen-reader user moving through the map by keyboard
              or swipe, they cut a huge amount of <em>noise</em>, because
              a category that isn&rsquo;t shown is also a category that
              isn&rsquo;t announced. This is a basic demo, so there are
              only a few filters; the{" "}
              <Link href="/maps/tiled-toronto-map">
                tiled Toronto map
              </Link>{" "}
              has a great many more, over far more data.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The rotor</h2>
            <p>
              The third pattern is the <strong>rotor</strong>, and it
              exists specifically to help keyboard and swipe users,
              letting them focus on one category of map content at a
              time. In this demo the rotor is a set of{" "}
              <strong>radio buttons</strong> &mdash; one category at a
              time; the tiled map expands it to{" "}
              <strong>multi-select checkboxes</strong>, so a reader can
              hold several categories in view at once. Filters change the
              map for everyone; the rotor narrows things only for the
              keyboard and swipe reader, without altering what is drawn
              for a sighted one.
            </p>
            <p>
              The name is deliberate. The map rotor tries to{" "}
              <strong>replicate a concept a screen-reader user already
              knows</strong>. On the web, a screen-reader user reaches
              for their rotor to choose what they navigate by &mdash;
              paragraphs, words, buttons, headings, links. This rotor
              reuses exactly that mental model, except that instead of
              selecting paragraphs or buttons, the reader is selecting{" "}
              <em>categories of map information</em> &mdash; transit,
              shops, schools, places of worship, parks. Taken together
              with the filters, it is what makes tabbing with a keyboard,
              or swiping on a touchscreen, practicable at all: without
              it, you would be stepping through every feature on a city
              map; with it, you constrain the journey to the category you
              care about.
            </p>
            <p>
              Underneath, the framing is a piece of plain computer
              science. The map is a <strong>giant directed graph</strong>,
              and the filters and the rotor are choosing{" "}
              <em>which of its nodes are visible</em>{" "}and{" "}
              <em>which circuits a reader travels through them</em>{" "}
              &mdash; deciding which nodes exist for navigation, and in
              what sequence you move between them. That is the same
              underlying idea the simpler{" "}
              <Link href="/maps/search-and-map-pins">
                search and map pin demo
              </Link>{" "}
              uses, in lighter form; the rotor here is the richer
              expression of it, and the shared model &mdash; typed nodes,
              the convenience graph, the order a circuit is read in
              &mdash; is set out in{" "}
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
            <h2>The look and feel</h2>
            <p>
              The East End Toronto map was an{" "}
              <strong>exploration of the underlying OpenStreetMap data
              and of navigation modalities</strong>, and out of that Bob
              built a <strong>very simplified rendering model</strong>.
              Buildings are drawn, but <strong>streets are just
              lines</strong>, and <strong>there is no text on the map at
              all</strong>. The whole thing is <strong>black and
              white</strong>. None of that is an oversight: the focus was
              much more on the <em>screen-reader reader&rsquo;s
              perspective</em>{" "}than on producing a visually rich map, so
              the rendering was kept deliberately spare and the
              experiment could be about data and navigation rather than
              cartographic polish. (The only text a sighted user sees is
              the demo&rsquo;s sticky tooltip, discussed below.)
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A fragment, not the whole</h2>
            <p>
              One thing to be clear about: this demo{" "}
              <strong>deliberately uses only a small part of the
              data</strong> &mdash; a <strong>static fragment of a single
              OpenStreetMap tile</strong>, not all of OpenStreetMap, and
              not even a whole tile. That is a scoping choice for an
              experiment, and it has a visible consequence: the map{" "}
              <strong>fades out towards its edges</strong>. Because only
              the fragment is rendered, a great deal of land use is left{" "}
              <em>unpopulated</em>{" "}near the boundaries &mdash; even though
              the <strong>full boundaries of that land use exist in the
              data</strong>, the fragment simply doesn&rsquo;t draw them
              all in.
            </p>
            <p>
              The effect is a faintly <em>Thirteenth Floor</em>{" "}quality
              &mdash; after the film in which people discover they are
              inside a simulation by travelling somewhere they&rsquo;d
              never normally think to go, and finding the rendering of
              their world breaking down at the edges. Travel far enough
              towards the boundary of this map and the world thins out
              and stops being rendered in just that way. It is an honest
              artefact of using a single static fragment, not a polished
              edge.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The SVG architecture</h2>
            <p>
              The demo is a single SVG generated from a long-ago,
              one-time pull of that OpenStreetMap fragment, with ARIA
              labels <em>pre-built at generation time</em>. The data is
              not refreshed and is not the point &mdash; nothing on the
              demo queries OpenStreetMap (or any spatial database) at
              runtime; filter toggles run at CSS speed rather than at
              JavaScript speed; the SVG is served as a plain asset. The
              interest of the artefact is the structure of the SVG
              itself: whether an OSM extract could be turned into
              screen-reader-navigable structure rather than into a
              picture a sighted user looks at.
            </p>
            <p>
              The architecture is a four-layer CISNA instantiation in
              cartographic form &mdash; Adaptation (which features to
              show this reader), Navigation (how to move between them),
              Semantics (what each feature means and how it relates to
              nearby features), and Inventory (which OSM features have
              been rendered into the SVG) &mdash; with External Content
              sitting beneath everything as the raw OpenStreetMap
              fragment.
            </p>
            <p className="muted">
              <small>
                The pipeline that processes OSM data into many
                pre-rendered SVG tiles served from Bob&rsquo;s own tile
                server, with the viewer fetching tiles as the viewport
                pans, is the contribution of the{" "}
                <Link href="/maps/tiled-toronto-map">
                  tiled Toronto map
                </Link>
                . It isn&rsquo;t part of this single-fragment demo.
              </small>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Feature inventory</h2>
            <p>
              Within that fragment, the renderer handles eighteen
              top-level OSM categories with hundreds of subcategories:
              buildings, roads (with casings), transit stops, parks,
              healthcare, transportation infrastructure
              (railways/airports/highways/platforms), financial
              services, sustenance & food, accommodation & tourism,
              entertainment & culture, emergency services, historic
              features, shops, schools, places of worship, addresses,
              barriers, natural features. That breadth of{" "}
              <em>kinds</em>{" "}is what makes it a <em>map</em>{" "}rather than
              a points-of-interest overlay &mdash; even though, in
              extent, it is only the one small fragment.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The trouble with the data</h2>
            <p>
              The hardest problem on this map &mdash; and on the tiled
              map &mdash; is <strong>information quality</strong>. The
              map is built from real OpenStreetMap data, and what you get
              for the East End of Toronto is{" "}
              <strong>incomplete, out of date, and unstructured</strong>.
              This is the standing problem with crowd-sourced
              information, and OpenStreetMap is full of it: there is{" "}
              <strong>no overarching quality assurance</strong>, and{" "}
              <strong>no process to age information out</strong>. Many
              accessibility initiatives that build on OpenStreetMap hit
              exactly the same wall &mdash; it isn&rsquo;t unique to this
              map. In places the data is years out of date: shops that
              have changed or closed, and buildings long since gone that
              are still in the record.
            </p>
            <p>
              The lack of structure bites too. OpenStreetMap gives the
              locations of transit stops, sometimes with route numbers
              and sometimes not, and <strong>without the order of the
              route</strong>. So if a reader wants to move through the
              transit stops, it is hard to know what order to present
              them in &mdash; the circuit has no inherent pattern. In
              practice the demo uses the order the OpenStreetMap database
              happens to give, which falls out as a rough{" "}
              <strong>geographic clustering</strong>{" "}rather than the
              order you would actually ride the route. The reason to use
              OpenStreetMap regardless is simple and pragmatic: it is{" "}
              <strong>one of the few &mdash; if not the only &mdash;
              international streetmaps with open data</strong>.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Semantic data for graphical content</h2>
            <p>
              That leads to a simple observation, and it is the
              through-line for this whole family of maps:
            </p>
            <blockquote>
              <p>
                In the same way that we need a semantic data structure
                to help assistive technology present HTML content and
                navigation options to users, we need semantic data for
                graphical content &mdash; maps like this, or graphs,
                charts, or animated simulations &mdash; and the quality
                of that data structure directly affects usability for
                all users, and for disabled users in particular.
              </p>
            </blockquote>
            <p>
              Semantic HTML is what lets assistive technology present a
              document and its navigation options. Graphical content
              needs the direct equivalent: an underlying semantic
              structure, of the same kind. The need generalises well
              beyond maps &mdash; the same is true of graphs, charts, and
              animated simulations, anything graphical a reader has to
              understand and navigate. And the quality of that structure
              is the lever: where the data is thin, stale, or
              unstructured, as the previous section describes, the
              experience built on it can only be as good as the
              structure allows &mdash; and it is disabled readers, who
              depend most on the structure being there and being correct,
              who feel the shortfall first. These map demos are a worked
              example of that principle, not just &ldquo;accessible
              maps.&rdquo; The four-layer model it sits inside is the{" "}
              <Link href="/research/cisna-model">CISNA Model</Link>.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Colour</h2>
            <p>
              This demo simply avoids colour &mdash; the map is black and
              white &mdash; because colour on a complex, busy map is
              genuinely hard for low-vision readers, and the
              black-and-white choice sidesteps that to keep the focus on
              structure and navigation. Three things make map colour
              hard:
            </p>
            <ul>
              <li>
                <strong>Colour blindness.</strong>{" "}The particular hues
                you choose decide whether colour-blind readers can tell
                categories apart at all.
              </li>
              <li>
                <strong>Adjacent-feature contrast.</strong>{" "}On a busy map
                features sit right next to each other, so the contrast
                between <em>adjacent</em>{" "}fills and lines becomes a
                problem in its own right, not just contrast against the
                background.
              </li>
              <li>
                <strong>Brightness.</strong>{" "}Large shifts in overall
                brightness across a map can force a reader to adjust the
                brightness of their monitor to cope.
              </li>
            </ul>
            <p>
              The likely answer is to bring onto the map the discipline
              this site already uses: it varies <em>hue</em>{" "}to separate
              and section content while holding the{" "}
              <em>contrast ratio identical</em>{" "}between page groups, so
              no group is harder to read than another and the brightness
              never lurches. A map probably needs the same &mdash;
              distinguish categories by hue, hold contrast and brightness
              constant across them &mdash; rather than letting category
              colours vary in contrast and brightness and creating the
              problems above.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Text on the map</h2>
            <p>
              No text is drawn on the map at all; the only text a sighted
              reader sees is carried by the (accessible, sticky) tooltip.
              Whether on-map lettering can be made accessible is, for
              Bob, an <strong>open question</strong>, and it sits on a
              real tension. Accessible text is usually taken to be
              horizontal and, for western languages, left to right. That
              doesn&rsquo;t suit most maps: street names are conventionally
              written <em>within</em>{" "}the rendering of the street, and{" "}
              <strong>follow and bend along it</strong> &mdash; curving,
              rotating, running at whatever angle the road runs. Building
              and amenity names are often horizontal, but street names
              are not, because it makes little sense to write a
              horizontal street name on a street running primarily
              vertically up the page; the label has to follow the
              geometry of the road to read as belonging to it.
            </p>
            <p>
              So the two conventions pull against each other &mdash;
              &ldquo;accessible means horizontal, left to right&rdquo;
              versus &ldquo;a street label must follow the curving line
              of its street.&rdquo; Bob&rsquo;s current best guess
              &mdash; untested, and not yet put to users &mdash; is to
              render street names <em>traditionally</em>, following and
              bending along the road as cartography expects, and to rely
              on the sticky tooltip and the ARIA label to carry the
              accessible, horizontal reading, rather than to force the
              on-map text itself to be accessible.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Speaking the map, and finding your place</h2>
            <p>
              Two harder problems get a page of their own, because they
              are live design questions rather than settled practice. The
              first is how features are <strong>announced</strong>. This
              map plays a particular trick: it exposes the SVG so that
              the screen reader itself announces what is under the finger
              on explore-by-touch &mdash; but delegating the announcement
              to the screen reader also means delegating the{" "}
              <em>focus outline</em>, which today is a rectangle
              regardless of the feature&rsquo;s shape and a default
              colour and weight that work poorly over a map. The terminal
              map takes the opposite choice &mdash; announcing through a
              live region, which lets it draw its own highlight but makes
              announcements queue and go stale on a busy map. The
              proposed way out is the Web Speech API, behind an opt-in
              accessibility toggle, with the operating system&rsquo;s
              audio ducking keeping the screen reader legible over the
              map&rsquo;s voice.
            </p>
            <p>
              The second is how a reader <strong>stays oriented</strong>:
              keeping focus visible when the map is zoomed out and its
              features are tiny (a question with four candidate answers,
              from a magnification lens to contextual semantic zoom), and
              knowing <em>where you are</em>{" "}when a streetmap, unlike the
              pin demo, has no single anchor to describe everything
              against &mdash; addressed by a relative account (nearest
              neighbours, their importance, and compass direction), an
              absolute one (the view&rsquo;s real-world size, and how far
              a finger-width represents), or by letting the reader plant
              an anchor of their own.
            </p>
            <p>
              <Link href="/maps/east-toronto-streetmap/speaking-and-finding-your-place">
                Speaking the map, and finding your place
              </Link>{" "}
              works through both in full.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where it came from</h2>
            <p>
              First publicly shown as a 45-minute in-person session at
              the 2019 Guelph Accessibility Conference at the University
              of Guelph &mdash; this is the demo that has actually been
              presented publicly. The talk demoed an earlier,
              low-fidelity, black-and-white, file:///-served rendering of
              the streetmap with the dual-mode interaction model and the
              pin-as-datum already present in primitive form; the{" "}
              <Link href="/maps/search-and-map-pins">
                search and map pin demo
              </Link>{" "}
              was shown briefly alongside it. The architectural decisions
              on this page &mdash; SVG over raster, CSS filters over JS,
              OpenStreetMap as the data source &mdash; came from the work
              that followed. The project&rsquo;s earlier working name was
              &ldquo;Guelph streetmap&rdquo; for that reason; it has since
              been renamed for the area it actually covers &mdash; the
              East End of Toronto, which is the real name of that part of
              the city, not a loose &ldquo;east Toronto.&rdquo;
            </p>
            <p>
              The lineage reads in three steps. The{" "}
              <Link href="/maps/search-and-map-pins">
                search and map pin demo
              </Link>{" "}
              came first &mdash; it introduced the Cartesian-to-polar
              verbal description of space (the vocabulary the rotor still
              uses: &ldquo;1 o&rsquo;clock, fifty metres&rdquo; rather
              than &ldquo;at coordinates X, Y&rdquo;). This East End
              Toronto demo came second &mdash; the conceptual model of
              ARIA Landmarks + filters + rotor that the family of maps
              now shares. The three maps that inherit the model: the{" "}
              <Link href="/maps/tiled-toronto-map">
                tiled Toronto map
              </Link>{" "}
              (the direct architectural successor, scaling the
              single-fragment pipeline shown here to a full city), the{" "}
              <Link href="/maps/terminal-map">terminal map</Link>{" "}
              (which carries the same conceptual model into an indoor
              airport surface), and this demo itself, which remains live
              as the architectural reference.
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
                <Link href="/maps/east-toronto-streetmap/speaking-and-finding-your-place">
                  Speaking the map, and finding your place
                </Link>{" "}
                &mdash; the two open problems in full: how features are
                announced (and who draws focus), and how a reader stays
                oriented at zoom and without an anchor.
              </li>
              <li>
                <Link href="/maps/how-its-built">
                  How an accessible map is built
                </Link>{" "}
                &mdash; the shared model behind the family: typed nodes,
                the convenience graph, the polar circuit, and how it is
                exposed to assistive technology.
              </li>
              <li>
                <Link href="/research/cisna-model">
                  The CISNA Model
                </Link>{" "}
                &mdash; the four-layer architecture this map is an
                instantiation of.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
