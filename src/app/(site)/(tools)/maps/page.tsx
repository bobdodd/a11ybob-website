import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";

export default function Maps() {
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
            <h1>Accessible maps</h1>
            <p className="lede">
              Seven years of work on something the accessibility
              field has effectively abandoned: real spatial
              cognition for non-sighted users, not turn-by-turn
              navigation. Three working demos across building,
              subdivision, and city-neighbourhood scales &mdash;
              deliberately different from one another, because there
              is no one right way to render a map; it depends on what
              the map is for. What they share is an approach to
              spatial cognition, and one theoretical contribution
              about how coordinate systems collapse under modality
              conversion.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The position</h2>
            <blockquote>
              <p>
                <em>
                  Maps, just like websites &mdash; and any other
                  modal experience &mdash; need CISNA. You&rsquo;re
                  trying to give the spatial knowledge of a place
                  to a person who cannot see; the inventory of
                  features, the navigation between them, and the
                  semantics of each are all in play, and the
                  existing field has barely got past
                  &ldquo;turn-by-turn directions if you happen to
                  be on this exact bus.&rdquo; I do not do these
                  things by half.
                </em>
              </p>
            </blockquote>
            <p>
              The tagline is{" "}
              <em>do Google Maps right</em>. The commercial
              mapping companies have made <em>small beer</em>{" "}
              progress on accessibility over a decade. The
              accessibility-focused alternatives have invested
              heavily in step-by-step navigation while leaving
              spatial cognition essentially unsolved. The maps
              work here does the part the field has abandoned.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
            aria-labelledby="maps-origin-heading"
          >
            <h2 id="maps-origin-heading">Origin: this is not a retrofit</h2>
            <p>
              &ldquo;Maps need CISNA&rdquo; is not a contemporary
              framing applied to a new project. The doctoral{" "}
              <em>Design Language</em> chapter from around 2009
              cites Google Maps as the worked example of CISNA&rsquo;s
              composite-content handling:{" "}
              <em>
                &ldquo;The maps presented on Google Maps would be a
                good example of this, as each map is a composite
                of images and text.&rdquo;
              </em>{" "}
              Howell&rsquo;s 2005 paper on spatial metaphors for
              speech-based mobile city-guide services is cited
              alongside it as precedent reading. The CISNA
              architecture was being mapped onto interactive
              geographic content in the working papers fifteen
              years before the current SVG-tile platform shipped.
              What follows is the worked example of a 2009 claim.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The field critique</h2>
            <p>
              Before naming where the field has stalled, an
              integrity note about the evidence: Bob&rsquo;s
              positions on Audiom, GoodMaps, and Blind Square are{" "}
              <em>observer-grade</em> &mdash; based on the academic
              literature, published material, and direct field
              interaction. CNIB Access Labs has not formally
              evaluated any of them. The only competitor Bob has
              tested in a structured way is Navilens, via a
              small-scale installation usability test with two
              lived-experience testers plus Bob trying it out
              (CNIB Access Labs engagement; not a formal audit).
              The phrase Bob uses about it:{" "}
              <em>
                &ldquo;I wouldn&rsquo;t be prepared to call it an
                audit.&rdquo;
              </em>{" "}
              That asymmetry of evidence matters in both
              directions &mdash; more grounded than observer-only
              commentary, not inflated into formal-audit
              language.
            </p>
            <p>
              The four products below are CNIB Access Labs
              partners, recommended case-by-case depending on the
              environment and the kind of movement the user needs.
              Each represents a distinct class of
              navigation-and-wayfinding tool with its own pros and
              cons; they are not like-for-like alternatives to one
              another.
            </p>
            <p>
              The field map:
            </p>
            <ul>
              <li>
                <strong>Audiom (XR Navigation)</strong> &mdash;
                the closest existing work and the most accomplished
                commercial team in the space. Pin-as-datum,
                arrow-key movement, configurable step size,
                surface-underfoot announcement. Backed by 13
                academic studies, 150 blind + 40 sighted co-design
                participants, third-party VPAT, deployed at the
                Wisconsin Geological Survey, Georgia Tech, NASA,
                and the University of Washington. Genuine strengths
                in empirical validation and procurement readiness
                that the work here does not yet have.
              </li>
              <li>
                <strong>Navilens</strong> &mdash; a real-world
                signage augmentation via proprietary visual codes,
                not a digital map at all. Massive deployment scale
                (MTA, Barcelona Metro, Heathrow, Coca-Cola packaging,
                hundreds of brands). The structural limit:{" "}
                <em>
                  Navilens cannot give spatial knowledge of a
                  place you haven&rsquo;t visited yet
                </em>{" "}
                &mdash; the codes are physically placed; the
                product augments a route once a user is already
                walking it.
              </li>
              <li>
                <strong>GoodMaps</strong> &mdash; indoor wayfinding
                for venues mapped with their LiDAR-based 3D
                point-cloud technology, deployed at airports
                (MidAmerica St. Louis), university campuses
                (York University&rsquo;s Glendon Campus among
                others), and other commercial venues. Three
                surfaces: a mobile app for in-venue turn-by-turn
                with foot-level positioning, a web platform
                offering interactive 3D venue maps that can be
                previewed before a visit, and an SDK letting venue
                partners embed the positioning in their own apps.
                The map exploration is real but venue-bounded
                &mdash; the user gets a map of the venue they are
                entering, not a cognitive model of general space or
                unmapped places.
              </li>
              <li>
                <strong>BlindSquare</strong> &mdash; positional
                awareness in real time. As the user moves, the app
                announces nearby points of interest, intersections,
                and venue features, letting them build a mental
                picture of the world immediately around them.
                Outdoors, the positioning is GPS plus
                OpenStreetMap and Foursquare data; indoors, it is
                Apple iBeacons that venues install, each beacon
                programmed to describe its location (door, service
                counter, washroom, vestibule). Every Service
                Canada location in Canada is BlindSquare-enabled,
                alongside the Yonge &amp; St.&nbsp;Clair
                neighbourhood deployment in Toronto and other
                sites. Not turn-by-turn routing; not a pre-built
                spatial map &mdash; the user assembles the model
                from in-the-moment announcements about what is
                right here, right now.
              </li>
            </ul>
            <p>
              The gap, summarised:{" "}
              <em>
                the most frustrating thing about accessible maps is
                how little real progress there has been
              </em>{" "}
              on spatial cognition specifically. Navigation gets
              the attention. Cognition gets the concession.
            </p>
            <p>
              The research literature shows the same split. Manaswi
              Saha, Jon Froehlich, and colleagues&rsquo;{" "}
              <a href="https://doi.org/10.1145/3491102.3517460">
                2022 CHI study
              </a>{" "}
              of multi-stakeholder accessibility-map visualizations is
              careful, empirical, top-venue work &mdash; how
              policymakers, department officials, advocates, caregivers,
              and people with mobility impairments make sense of
              sidewalk-accessibility data across seven map types. Its
              own stated limitation is the tell: the visualizations,
              the authors note,{" "}
              <em>
                were not designed to support people with different
                visual abilities
              </em>
              , a gap they name explicitly and defer to future work.
              The <em>data</em> is about accessibility; the{" "}
              <em>map</em> is not accessible to a non-sighted reader.
              That deferred piece &mdash; a map a non-sighted person
              can actually read and reason over &mdash; is where this
              work starts.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Three working demos</h2>
            <p>
              Each demo is a full-screen interactive map at its own
              URL; the page here is the brief that frames the demo
              and links out to it. What the three share is the
              approach to spatial cognition &mdash; pin-as-datum at
              viewport centre, dual-mode interaction (Cartesian via
              touch, polar via keyboard) &mdash; not the rendering or
              the feature set, which differ on purpose.
            </p>
            <p>
              The difference is fit-for-purpose. On{" "}
              <strong>the Groves</strong>, what matters are the
              <em> pinned points of interest</em> &mdash; where the
              properties are &mdash; not the detail of the streets
              around them; so the Groves renders a raster base with
              an interactive pin overlay drawn on top, and only the
              pins need to be addressable. The{" "}
              <strong>East Toronto streetmap</strong> and the{" "}
              <strong>terminal map</strong> are about exploring the
              detailed space itself, so there everything is drawn as
              addressable SVG, and the richer affordances &mdash;
              ARIA landmarks, category filters, the rotor, the F6
              region cycle &mdash; live there rather than on the
              Groves. There is no one perfect solution; the right
              rendering follows the job the map is doing.
            </p>
            <ul>
              <li>
                <Link href="/maps/groves">
                  <strong>The Groves subdivision</strong>
                </Link>{" "}
                &mdash; the simplest, and the demo that produced
                the theoretical finding. By far the most 
                stripped-down: residential streets, no interior detail. The
                simplicity is what exposed the asymmetry between
                visual scanning and blind navigation.
              </li>
              <li>
                <Link href="/maps/east-toronto-streetmap">
                  <strong>East Toronto streetmap</strong>
                </Link>{" "}
                &mdash; the earliest OSM-rendering demo, first
                shown at a 45-minute in-person session at the 2019
                Guelph Accessibility Conference. The conceptual
                model the family of maps shares &mdash; ARIA
                Landmarks, filters, rotor &mdash; originated here.
                Rendering is deliberately basic; the contribution
                is the SVG structure for screen-reader navigation.
              </li>
              <li>
                <Link href="/maps/terminal-map">
                  <strong>Terminal map</strong>
                </Link>{" "}
                &mdash; interior airport-terminal wayfinding (the
                worked example is YVR&rsquo;s Level 3 departures).
                The most feature-rich demo: gates, security,
                washrooms, retail, services. The terminal-grade
                demonstration that the approach scales beyond
                residential subdivisions.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
            aria-labelledby="maps-spatial-cognition-heading"
          >
            <h2 id="maps-spatial-cognition-heading">
              Spatial cognition under modality conversion
            </h2>
            <p>
              The theoretical contribution. When spatial information
              is rendered through a modality that is{" "}
              <em>sequential rather than parallel</em> (audio,
              screen reader, haptic) and that the user{" "}
              <em>occupies rather than observes</em>, the spatial
              reference frame collapses from Cartesian to 
              first-person polar coordinates centred on the user.
              Cartesian space is a sighted observer&rsquo;s frame;
              polar space is an embodied user&rsquo;s frame. The
              modality shift forces the frame shift.
            </p>
            <p>
              The finding is the same one the audio Tetris work
              produced in different vocabulary. Converting a visual
              game to audio shifted the player from third-person
              observational to first-person immersive; converting a
              visual map to screen-reader-mediated audio shifted
              the coordinate system from Cartesian to polar centred
              on a chosen reference point. POIs became{" "}
              <em>(name, distance, compass direction)</em> arranged
              in onion-skin order from a chosen centre. Same
              asymmetry expressed in coordinate-system terms.
            </p>
            <p>
              <strong>
                It is not modality alone &mdash; it is modality
                plus interaction model.
              </strong>{" "}
              Touch as input mode preserves Cartesian even when
              output is audio, because the finger gives direct
              spatial reference. The fuller picture:
            </p>
            <ul>
              <li>
                <em>Visual + Cartesian</em> &mdash; trivially the
                sighted user&rsquo;s case.
              </li>
              <li>
                <em>Audio + sequential traversal (keyboard /
                screen-reader-only)</em> &mdash; polar, centred on a
                chosen reference. The original finding.
              </li>
              <li>
                <em>Audio + touch exploration</em> &mdash; Cartesian
                via touch (the finger is the spatial reference;
                each location announces what is under it) plus
                polar on tap (when the user interrogates a specific
                POI, the polar coordinates describe its
                surroundings).
              </li>
              <li>
                <em>Audio + live egocentric (in-situ navigation)</em>{" "}
                &mdash; polar centred on the user&rsquo;s actual
                GPS location, with compass orientation. Two
                distinct polar systems exist: allocentric (centred
                on a chosen reference, declarative, exploratory)
                and egocentric (centred on the user, dynamic,
                navigational).
              </li>
            </ul>
            <p>
              <strong>
                The pin-as-datum is the embodiment of all of this
                in the UI.
              </strong>{" "}
              In all three demos the pin sits at the centre of the
              viewport; the map orbits the pin. That makes the pin
              the visible signifier of four things at once: the
              visual marker (sighted users see it at centre); the
              polar origin (all distances and directions are
              relative to it); the datum (fixed reference the map
              orbits); and the user&rsquo;s agent in the 
              multi-agent / Community-of-Practice framing &mdash;
              negotiating on behalf of user capability and
              preference. Wheelchair users have agents that
              prioritise gradients, ramps, accessible washrooms;
              blind users have agents that prioritise accessible
              crossings and green spaces for guide-dog rest breaks.
              Same OSM data, same pin, same datum &mdash; but the
              map adapts differently because the agent at the
              centre is negotiating differently. That is{" "}
              <Link href="/research/cisna-model">CISNA</Link>{" "}
              plus the four-model capability framework plus{" "}
              <Link href="/research/2029-framework">
                the multi-agent CoP framing
              </Link>
              , applied to spatial cognition.
            </p>
            <p className="muted">
              <small>
                This is paper-shaped substance that has not yet
                been written up. Working title:{" "}
                <em>
                  &ldquo;Maps need CISNA: applying capability
                  modelling and multi-agent communities of
                  practice to accessible cartography.&rdquo;
                </em>{" "}
                A research direction, not a published claim.
              </small>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Technical foundation</h2>
            <ul>
              <li>
                <strong>
                  Addressable rendering where the goal is to explore
                  the space.
                </strong>{" "}
                Commercial maps moved to raster tiles for
                performance; raster is opaque to screen readers. SVG
                elements are individually addressable, focusable,
                semantically labellable, scalable without resampling.
                Where the job is to explore the detailed space &mdash;
                the East Toronto streetmap, the terminal map, the
                multi-tile Toronto streetmap &mdash; everything is
                drawn as SVG, the opposite of the field&rsquo;s
                performance-driven raster choice. Where the job is to
                find pinned points of interest rather than explore the
                surrounding detail &mdash; the Groves &mdash; a raster
                base carries an <em>addressable</em> pin overlay, and
                only the pins need to be vector. The accessible layer
                is always addressable; whether the base is SVG follows
                the map&rsquo;s purpose, not dogma.
              </li>
              <li>
                <strong>
                  Pre-rendered SVG, no runtime spatial-database
                  queries.
                </strong>{" "}
                Nothing on the platform queries OpenStreetMap (or
                an Overpass endpoint, or any spatial database) at
                runtime. The published demos use one-time static
                OSM pulls, rendered offline, and served as plain
                assets &mdash; the East Toronto streetmap, for
                instance, is a single SVG generated from one
                long-ago OSM extract; the data isn&rsquo;t
                refreshed. The multi-tile Toronto streetmap
                currently in development extends the same
                principle to a city: OSM data is processed offline
                into 0.01&deg; geographic squares (~1km&sup2;),
                each rendered as a compressed SVG.gz file with
                ARIA labels pre-built at generation time, served
                from a tile server Bob maintains. The viewer
                fetches tiles from that server as the viewport
                pans; the spatial database is touched only at
                tile-generation time, never at view time.
              </li>
              <li>
                <strong>CSS-based filtering for clutter management.</strong>{" "}
                Visibility toggles run at CSS speed, not JavaScript
                speed.
              </li>
              <li>
                <strong>OpenStreetMap as the data source.</strong>{" "}
                Community-maintained, openly licensed, with the
                fine-grained tagging the indoor and pedestrian
                pieces of the maps work depend on.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Universal-design discipline across four user populations</h2>
            <p>
              Not the usual one or two. Across the body of work,
              the interaction model addresses four user
              populations &mdash; screen-reader users, keyboard
              users, voice-control users (via Dragon
              NaturallySpeaking), and touch users &mdash; each
              with first-class affordances rather than a fallback
              experience.
            </p>
            <p>
              The concepts below are{" "}
              <strong>distributed across the demos</strong>: this
              is the current state-of-play of the accessible-maps
              work as a whole, not a feature list any single demo
              implements end-to-end. Each demo carries some
              subset, and each new demo has been the surface on
              which one or another of these ideas was first
              expressed in code.
            </p>
            <ul>
              <li>
                <strong>Rotor</strong> (iOS VoiceOver style) for
                narrowing tab order to a chosen POI class.
                Borrowed directly from the idiom users already
                know.
              </li>
              <li>
                <strong>F6 landmark cycle.</strong> Three-position
                cycle (sidebar &rarr; map &rarr; controls), with
                last-position memory at each landmark. Two F6
                taps from a selected map POI returns the user to
                the sidebar where they were. Borrowed from
                Windows / Microsoft Office.
              </li>
              <li>
                <strong>
                  Voice control via Dragon NaturallySpeaking.
                </strong>{" "}
                Rotor includes a Dragon-optimised mode with 
                voice-friendly category names. The voice population is
                often skipped; not skipped here.
              </li>
              <li>
                <strong>Context-adapted skip-links.</strong>{" "}
                Standard skip-to-content / skip-to-map-controls
                augmented with domain-specific landmarks (e.g.
                &ldquo;skip to Pier A / B / C / D / E&rdquo; in the
                terminal map, with focus moving to the
                lowest-numbered gate in that pier).
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The seven-year arc</h2>
            <p>
              The arc begins with the{" "}
              <strong>Groves subdivision</strong>, built out of a
              client request for accessible spatial information
              about a residential development &mdash; the work that
              produced the polar-coordinate finding. The{" "}
              <strong>East Toronto streetmap</strong> followed:
              first publicly shown at a 45-minute in-person session
              at the 2019 Guelph Accessibility Conference (a
              low-fidelity, black-and-white, file:///-served
              rendering of an east Toronto streetmap) and the demo
              that introduced the ARIA Landmarks + filters + rotor
              model the family of maps now shares. The{" "}
              <strong>multi-tile Toronto streetmap</strong>{" "}
              followed as the direct architectural successor of
              East Toronto, scaling the single-tile pipeline to a
              full city &mdash; currently in active development,
              with no public demo live yet. Most recently, the{" "}
              <strong>terminal map</strong> carries the conceptual
              model into an indoor airport surface (worked example:
              YVR&rsquo;s Level 3 departures). Same
              design vocabulary throughout; materially improved
              engineering and visual quality at each step.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Known gaps</h2>
            <ul>
              <li>
                <strong>Surface-under-foot announcement</strong>{" "}
                &mdash; Audiom has it (Esri facility data carries
                surface metadata); OSM doesn&rsquo;t carry surface
                tags consistently for pedestrian-relevant
                features. A data-source limitation, not a design
                oversight.
              </li>
              <li>
                <strong>Configurable step size on arrow-key movement</strong>{" "}
                &mdash; currently a TypeScript constant; should be
                user-configurable (city scale needs 50&ndash;100m
                steps; building scale needs 1&ndash;2m steps).
              </li>
              <li>
                <strong>
                  Direction-of-flow indication for unidirectional
                  corridors
                </strong>{" "}
                on the terminal map &mdash; needed for any
                traveller who shouldn&rsquo;t have to discover the
                direction by walking it. Known gap.
              </li>
              <li>
                <strong>Right-click menu for non-drag pin placement</strong>{" "}
                &mdash; designed but not implemented.
              </li>
              <li>
                <strong>
                  No third-party VPAT or empirical usability
                  validation at scale
                </strong>{" "}
                &mdash; Audiom has both; the work here has
                neither. Honest gap; the demos are working
                evidence, not procurement-ready artefacts.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/maps/groves">
                  The Groves subdivision
                </Link>{" "}
                &mdash; simplest demo, polar finding origin.
              </li>
              <li>
                <Link href="/maps/east-toronto-streetmap">
                  East Toronto streetmap
                </Link>{" "}
                &mdash; 2019 origin; introduced the ARIA Landmarks
                + filters + rotor model the family shares.
              </li>
              <li>
                <Link href="/maps/terminal-map">Terminal map</Link>{" "}
                &mdash; interior wayfinding, airport scale.
              </li>
              <li>
                <Link href="/research/cisna-model">
                  The CISNA Model
                </Link>{" "}
                &mdash; the methodological substrate the maps work
                applies.
              </li>
              <li>
                <Link href="/research/2029-framework">
                  The 2029 framework
                </Link>{" "}
                &mdash; the multi-agent CoP framing the 
                pin-as-datum embodies.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
