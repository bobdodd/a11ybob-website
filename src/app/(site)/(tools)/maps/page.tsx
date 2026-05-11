import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";

export default function Maps() {
  return (
    <main id="main" className="site-main" data-zone="tools">
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
              subdivision, and city-neighbourhood scales; one
              shared SVG-tile architecture; one theoretical
              contribution about how coordinate systems collapse
              under modality conversion.
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
              integrity note about the evidence: my positions on
              Audiom, GoodMaps, and Blind Square are{" "}
              <em>observer-grade</em> &mdash; based on the academic
              literature, published material, and direct field
              interaction. CNIB Access Labs has not formally
              evaluated any of them. The only competitor I have
              tested in a structured way is Navilens, via a
              small-scale installation usability test with two
              lived-experience testers plus me trying it out
              (CNIB Access Labs engagement; not a formal audit).
              The phrase I use about it:{" "}
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
                <strong>GoodMaps</strong> and{" "}
                <strong>Blind Square</strong> &mdash; both invested
                in step-by-step indoor navigation. Polished, narrow
                scope. Different problem from accessible
                cartography.
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
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Three working demos</h2>
            <p>
              Each demo is a full-screen interactive map at its own
              URL; the page here is the brief that frames the demo
              and links out to it. Same design vocabulary across
              all three: SVG over raster, pin-as-datum at viewport
              centre, dual-mode interaction (Cartesian via touch,
              polar via keyboard), rotor for narrowing tab order,
              F6 landmark cycle.
            </p>
            <ul>
              <li>
                <Link href="/maps/groves">
                  <strong>The Groves subdivision</strong>
                </Link>{" "}
                &mdash; the simplest, and the demo that produced
                the theoretical finding. By far the most stripped-
                down: residential streets, no interior detail. The
                simplicity is what exposed the asymmetry between
                visual scanning and blind navigation.
              </li>
              <li>
                <Link href="/maps/yvr">
                  <strong>YVR terminal</strong>
                </Link>{" "}
                &mdash; interior wayfinding for Vancouver
                International Airport. The most feature-rich demo:
                gates, security, washrooms, retail, services. The
                airport-grade demonstration that the approach
                scales beyond residential subdivisions.
              </li>
              <li>
                <Link href="/maps/guelph">
                  <strong>Guelph streetmap</strong>
                </Link>{" "}
                &mdash; the earliest demo, from a 2019 Guelph
                Accessibility Conference webinar, and the most
                architecturally ambitious. Pre-rendered SVG tiles,
                full OSM coverage, the architecture that scales
                the approach to a city.
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
              reference frame collapses from Cartesian to first-
              person polar coordinates centred on the user.
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
              orbits); and the user&rsquo;s agent in the multi-
              agent / Community-of-Practice framing &mdash;
              negotiating on behalf of user capability and
              preference. Wheelchair users have agents that
              prioritise gradients, ramps, accessible washrooms;
              blind users have agents that prioritise accessible
              crossings and green spaces for guide-dog rest breaks.
              Same OSM data, same pin, same datum &mdash; but the
              map adapts differently because the agent at the
              centre is negotiating differently. That is{" "}
              <Link href="/research/carnforth-model">CISNA</Link>{" "}
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
                <strong>SVG over raster / canvas.</strong>{" "}
                Commercial maps moved to raster tiles for
                performance; raster is opaque to screen readers.
                SVG elements are individually addressable,
                focusable, semantically labellable, scalable
                without resampling. The choice the field made for
                performance was the choice you would avoid for
                accessibility, and the work here makes the
                opposite choice deliberately.
              </li>
              <li>
                <strong>Pre-rendered SVG tile pipeline.</strong>{" "}
                OpenStreetMap data is processed into 0.01&deg;
                geographic squares (~1km&sup2;), each rendered as
                a compressed SVG.gz file with ARIA labels pre-built
                at generation time. Performance against runtime
                Overpass queries: initial load 2&ndash;3s &rarr;
                0.5s; pan to new area 1&ndash;2s &rarr; 0.3s;
                filter toggle 500ms &rarr; 50ms; memory 100MB
                &rarr; 30MB. Works offline after the initial
                cache.
              </li>
              <li>
                <strong>CSS-based filtering for clutter management.</strong>{" "}
                Visibility toggles run at CSS speed, not JavaScript
                speed.
              </li>
              <li>
                <strong>OSM data as the values-significant source.</strong>{" "}
                Open data; non-US-corporate; community-maintained.
                The same logic that drives the rest of the site
                away from US-corporate infrastructure where the
                alternative exists.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Universal-design discipline across four user populations</h2>
            <p>
              Not the usual one or two. The interaction model
              serves screen-reader users, keyboard users, voice-
              control users (via Dragon NaturallySpeaking), and
              touch users &mdash; each with first-class affordances,
              not a fallback experience.
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
                Rotor includes a Dragon-optimised mode with voice-
                friendly category names. The voice population is
                often skipped; not skipped here.
              </li>
              <li>
                <strong>Context-adapted skip-links.</strong>{" "}
                Standard skip-to-content / skip-to-map-controls
                augmented with domain-specific landmarks (e.g.
                &ldquo;skip to Pier A / B / C / D / E&rdquo; at
                YVR, with focus moving to the lowest-numbered
                gate in that pier).
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The seven-year arc</h2>
            <p>
              2019 Guelph Accessibility Conference (the original
              webinar demo, served from file:///, black-and-white
              line art) &rarr; 2022 Groves subdivision demo
              (PNG-based map with checkbox-curated pin overlay)
              &rarr; 2025 Maps platform (pre-rendered SVG tiles,
              comprehensive OSM coverage, rotor + rose,
              cartographically professional Toronto and YVR
              maps). Same design vocabulary throughout; materially
              improved engineering and visual quality.
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
                on the terminal map &mdash; needed for wheelchair
                users who can&rsquo;t backtrack. Known gap.
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
                <Link href="/maps/yvr">YVR terminal</Link>{" "}
                &mdash; interior wayfinding, airport scale.
              </li>
              <li>
                <Link href="/maps/guelph">Guelph streetmap</Link>{" "}
                &mdash; 2019 origin, SVG-tile architecture.
              </li>
              <li>
                <Link href="/research/carnforth-model">
                  The Carnforth Model
                </Link>{" "}
                &mdash; CISNA, the methodological substrate the
                maps work applies.
              </li>
              <li>
                <Link href="/research/2029-framework">
                  The 2029 framework
                </Link>{" "}
                &mdash; the multi-agent CoP framing the pin-as-
                datum embodies.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
