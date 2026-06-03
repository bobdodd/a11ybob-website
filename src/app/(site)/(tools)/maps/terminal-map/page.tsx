import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";
import { NewTabLink } from "@/components/NewTabLink";
import { ImageFigure } from "@/components/ImageFigure";

export default function MapsTerminalMap() {
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
            <h1>Terminal map</h1>
          </header>

          <ImageFigure
            src="/maps/terminal-map-hero.png"
            alt="The terminal-map demo with Gate 60 selected. A left-hand panel holds a gate-and-shop search field and the selected gate's details — Gate 60, an international departures gate on Pier D, Lufthansa flight LH880 to Hong Kong departing 05:00, on time — above 'Find on map' and 'Directions from here' buttons. The main area renders Level 3 departures as a winding concourse with numbered gate markers, points-of-interest icons, and labelled zones including the International Gates and the U.S. Connections Facility; a pin marks a chosen location and a pan-and-zoom keypad sits at the lower right."
            frameN={2924}
            frameD={1664}
            contain
            triggerLabel="the terminal-map demo"
            captionText="The terminal-map demo: a searchable, screen-reader-navigable rendering of Level 3 departures, with per-gate detail and directions in the side panel. The worked example is Vancouver International's Level 3 departures."
            caption={
              <>
                The terminal-map demo: a searchable,
                screen-reader-navigable rendering of Level 3
                departures, with per-gate detail and directions in
                the side panel. The worked example is Vancouver
                International&rsquo;s Level 3 departures.
              </>
            }
          />

          <p className="lede">
            Interior wayfinding for an airport terminal &mdash; the
            richest feature inventory of the three demos: gates,
            security checkpoints, washrooms, retail, services,
            accessible routes, charging stations, in an environment
            that fails most of the assumptions consumer mapping tools
            make. The worked example is a real terminal &mdash;
            Vancouver International&rsquo;s Level 3 departures &mdash;
            but the demo is here as a generic terminal-wayfinding
            example; the particular airport is incidental.
          </p>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Try the interactive demo</h2>
            <p>
              <NewTabLink
                className="pill"
                href="/demos/terminal-map/viewer.html"
              >
                Open the interactive terminal map
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
            <h2>What a map is for</h2>
            <p>
              A map is not an in-situ, point-to-point guided
              navigation tool. It is usable <em>without</em> being at
              the place it represents: it lets you explore the space,
              discover spatial relationships, and understand scale
              from anywhere. It is <em>also</em> usable when you are
              at the location &mdash; if the map knows where you are,
              it can give immediate context and the turn-by-turn
              experience. That second, location-aware experience is,
              in practice, what Google and Apple Maps give sighted,
              non-disabled users. This demo does the first part; it
              has no location sensing (see Limitations).
            </p>
            <p>
              A map also has a <strong>physicality</strong>. Unlike
              step-by-step guidance, it fills the page or the screen,
              and every point within it has meaning tied directly to
              its Cartesian coordinates in that space. Proximity
              matters; spatial relationships matter; there is a
              tactile experience to be had. On a touchscreen that is
              an opportunity to design for <em>explore-by-touch</em>,
              and a challenge: translating that experience into
              meaningful interaction for a screen-reader user.
            </p>
            <p>
              That challenge is sharper than it first appears. For
              blind screen-reader users in particular, explore-by-
              touch of a map is still a new and novel experience.
              Faced with a Cartesian map view, users often become
              disoriented, and frustrated by compass directions: they
              are used to relative, body-centred terms &mdash;
              forward, left, right, slide-right &mdash; or clock-face
              directions. Usability testing has recorded complaints
              like <em>&ldquo;That&rsquo;s no good! What do you mean
              go east? I don&rsquo;t know where east is &mdash; I need
              to know whether to go forward or not.&rdquo;</em> The
              modality breaks because the user has no prior experience
              of the concept of a map. People who lost their sight
              later in life tend to understand it; people blind from
              birth much less so. Maps have existed in their current
              form for centuries, yet for these users they are a novel
              interface that has to be explained.
            </p>
            <p>
              That is why the very first focusable items on the page
              &mdash; before even the skip links &mdash; are two
              help controls, styled like skip links so they appear
              only on focus:{" "}
              <em>Help for screen reader users</em> and{" "}
              <em>Help for keyboard navigation users</em>, each
              opening a help dialog. The skip-to-map-controls and
              per-pier skip links follow them.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>How the map is built</h2>
            <p>
              Major digital mapping companies serve up an{" "}
              <em>image</em> and then render additional content
              &mdash; sometimes SVG &mdash; on top of it to decorate
              it. This terminal map has no underlying image:{" "}
              <strong>everything is drawn as SVG</strong>. Bob took a
              PDF of a terminal map and re-rendered it in SVG; the
              Google or OpenStreetMap approach would instead have been
              to take a screenshot and add interactivity on top.
            </p>
            <p>
              Drawing everything as SVG makes the number of rendered
              nodes on the page far higher than the image-plus-overlay
              approach, which is a real cost (see Limitations). The
              payoff is full flexibility for assistive technology to
              render and interact with the map. It also avoids the
              &ldquo;layers of zoom&rdquo; images commercial maps rely
              on &mdash; the same picture re-served at different zoom
              levels for rendering efficiency &mdash; the problem
              Bob&rsquo;s raw-OpenStreetMap Toronto model set out to
              replace.
            </p>
            <p>
              The deeper reason to build from SVG is the filters.
              Filters over an image are limited by the detail baked
              into that image: it is hard to take content away, far
              easier to add content to a blank canvas. So the map is
              built bottom-up, in the manner of the{" "}
              <Link href="/research/cisna-model">CISNA model</Link>:
              features are drawn from an inventory up into a semantic
              layer to match user need and preference, and the
              navigation layer is then adapted to the needs of
              assistive-technology users. As Bob puts it,{" "}
              <em>&ldquo;maps really do need CISNA.&rdquo;</em>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Getting around the map</h2>
            <p>
              A map is not just a rectangle of coordinates; it needs
              other content to help a user explore it and understand
              what they find. The terminal map has three conceptual
              blocks of navigable content: the <strong>map</strong>{" "}
              itself, the <strong>map controls</strong> (pan and
              zoom), and the <strong>header</strong> (search and
              filters). Both the header and the controls float above
              the map and can be shrunk to expose more of it &mdash;
              because here, unlike on a Google map where the only
              navigable content is the sidebar, the map itself is
              navigable content. (In practice the header is mostly
              full-screen, so it could nearly as well have been
              pinned full-size.)
            </p>
            <p>
              Those blocks are exposed as <strong>ARIA landmarks</strong>:
              the header is a <code>banner</code>, the map is a{" "}
              <code>main</code> region (the SVG inside it carries{" "}
              <code>role=&ldquo;document&rdquo;</code>), and the
              controls are a named <code>region</code>,
              &ldquo;Map controls&rdquo;. A screen-reader user can
              therefore step block-to-block with landmark navigation
              &mdash; the <kbd>R</kbd> key in JAWS, <kbd>D</kbd> in
              NVDA, the Landmarks rotor in VoiceOver.
            </p>
            <p>
              Landmark navigation has a catch: it always lands you at
              the <em>start</em> of a landmark, which is not always
              what you want. Having explored by touch to a particular
              point of interest, you may want to dip back into the
              header or controls without losing your place on the
              map. So the three blocks behave like windows in
              Microsoft Windows &mdash; each keeps its own focus
              history. The <kbd>F6</kbd> key moves focus to the
              last-focused location in each block in turn (a default
              the first time), announcing where focus has landed;{" "}
              <kbd>F6</kbd> cycles left-to-right, <kbd>Shift</kbd>+
              <kbd>F6</kbd> right-to-left.
            </p>
            <p>
              <kbd>F6</kbd> matters beyond screen-reader efficiency.
              For sighted disabled users with a mobility impairment
              who do not use a screen reader but do use the keyboard
              &mdash; directly, or through assistive technology that
              drives the interface with keyboard events &mdash; it is
              the only quick way around a map interface, especially
              one that lets you tab through map elements. Bob&rsquo;s
              view is that <kbd>F6</kbd> is the shortcut missing from
              almost every website that has enough blocks of content
              for landmark navigation to be worthwhile.
            </p>
            <p>
              There are also <strong>skip-to-pier links</strong>:
              focus-revealed links that jump to the first gate in
              piers A, B, C, D, and E. They are the map&rsquo;s
              equivalent of the traditional skip-to-content link,
              useful on repeated visits and for keyboard-only users.
              How well they serve <em>switch</em> users is a more
              complicated question, covered in the{" "}
              <Link href="/maps/terminal-map/switch-and-magnifier-support">
                switch-access and magnifier notes
              </Link>
              .
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Describing space in words</h2>
            <p>
              To describe a whole space when there is no directional
              point of reference, you need Cartesian coordinates
              &mdash; or at least the experience of their surface. But
              at any single point within that space, what a person
              needs is relative, polar description: what is here, what
              is nearby, what is further away but useful, and what
              timely information relates to this place. The terminal
              map describes those relationships with{" "}
              <strong>compass direction and distance</strong>.
            </p>
            <p>
              Compass directions sit awkwardly with the tester
              frustration noted above, and the reason is a real
              constraint. Egocentric directions (forward, left, right)
              are impossible without knowing which way the user is
              facing, and the demo cannot sense that. Compass plus
              distance is the only description that stays consistent
              for a fixed-orientation drawn map. Going egocentric
              would mean mapping the map&rsquo;s frame onto the
              user&rsquo;s body &mdash; understanding that
              &ldquo;forward&rdquo; is currently to the left and
              &ldquo;right&rdquo; is up the page &mdash; which is what
              a sighted person does with a paper map (unless they
              rotate it). Point-to-point directions <em>could</em>{" "}
              switch to egocentric once the user has been located and
              oriented (<em>&ldquo;turn east, then walk forward ten
              metres until the gate is on your right&rdquo;</em>); this
              demo, with no sensing, stays in compass terms.
            </p>
            <p>
              The description comes at two levels.{" "}
              <strong>Sticky tooltips</strong> name what is under the
              finger or at a location and give the immediately useful,
              timely facts &mdash; the current or next flight from a
              gate, whether a shop is open or closed. The{" "}
              <strong>left-hand panel</strong> gives the richer
              account: not just the place itself but where it sits
              relative to the gates and points of interest around it,
              in compass-and-distance terms. That is spatial
              information delivered without having to explore the map
              at all.
            </p>
            <p>
              The tooltips are deliberately <em>sticky</em> rather
              than the browser&rsquo;s default{" "}
              <code>title</code>-attribute tooltip, which is not
              accessible: it appears on hover and vanishes the moment
              the pointer leaves the element. At high magnification the
              tooltip is rarely fully inside the magnifier window, so
              the user must move to read it &mdash; and moving
              dismisses it. The sticky tooltip instead persists until
              the user presses <kbd>Escape</kbd> (all pop-up content
              on the map closes with <kbd>Escape</kbd>) or hovers
              another element, and it is drawn as close as possible to
              the hover point so at least part of it lands inside the
              magnifier window. This is what WCAG 2.2 success
              criterion 1.4.13, Content on Hover or Focus, asks for:
              dismissable, hoverable, persistent.
            </p>
            <p>
              Even &ldquo;what is nearby&rdquo; is constructed from
              user need rather than read off the map. The nearest
              washrooms might be promoted even if they are further
              away than something else; if the rotor is set to
              optimise for blind users, a service-dog rest area might
              be promoted. That is CISNA in action at the most banal
              level.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Search</h2>
            <p>
              Search is central to any dense map, and on the web that
              means the <code>search</code> landmark together with
              explore-by-touch. Here the search field lives in the
              header, reachable by landmark navigation, and it is the
              default destination for <kbd>F6</kbd> if the user has
              not yet visited the header.
            </p>
            <p>
              Search is also central to <em>not</em> using the map.
              For most blind and low-vision users, search is where
              they will want to be, so a working principle of the
              design is that{" "}
              <strong>
                all of the information the graphical map shows must be
                findable through search, without going to the map at
                all
              </strong>
              . The map may explain that information better, but the
              information has to exist outside the map.
            </p>
            <p>
              In practice the field offers auto-complete, with a live
              region announcing the number of completions as the user
              types (a <code>role=&ldquo;combobox&rdquo;</code> with{" "}
              <code>aria-autocomplete=&ldquo;list&rdquo;</code> and a
              shared polite status region). It should also draw on the
              browser&rsquo;s own text history, which means the HTML{" "}
              <code>autocomplete</code> attribute should be on &mdash;
              even the few digital maps that offer search often break
              this.
            </p>
            <p className="muted">
              <small>
                One honest exception in <em>this</em> demo: its search
                and directions forms set{" "}
                <code>autocomplete=&ldquo;off&rdquo;</code> on purpose.
                With it on, the field surfaces the recorder&rsquo;s
                own past searches, which is not wanted in the demo
                videos. Production maps should leave{" "}
                <code>autocomplete</code> on; the demo turns it off
                only to keep recordings clean.
              </small>
            </p>
            <p>
              Selecting a search result on a map is not like selecting
              a conventional web result, where many results resolve to
              one linked target and the page navigates there. On a map
              the behaviour is context-sensitive. On the{" "}
              <Link href="/maps/groves">Groves map</Link>, selecting a
              property highlights it and adds it to the map&rsquo;s tab
              order with a live-region announcement, but focus stays in
              the results so the user can add several properties before
              exploring them spatially. On the terminal map, selecting
              a result shows that gate or POI&rsquo;s full details in
              the header <em>and</em> highlights it on the map with a
              live-region announcement, while focus stays on the
              details for reading. Those details include the
              item&rsquo;s context &mdash; the gates and points of
              interest around it &mdash; so, again, spatial information
              without exploring the map.
            </p>
            <p>
              A selected item is highlighted on the map with a pulsing
              halo, but on a busy map that can still be hard to find,
              especially under magnification. The{" "}
              <strong>&ldquo;Find on map&rdquo; button</strong> answers
              that by moving the selected result to the exact centre of
              the map viewport &mdash; a known, repeatable location
              &mdash; and moving focus there. Whether a magnifier then
              follows that focus depends on the magnifier; the centring
              is the part that does not depend on it. (Details in the{" "}
              <Link href="/maps/terminal-map/switch-and-magnifier-support">
                switch-access and magnifier notes
              </Link>
              .) A cross-hair marking that centre is a likely future
              improvement.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Zoom</h2>
            <p>
              A digital map needs two kinds of zoom: zooming the{" "}
              <em>map</em>, and zooming the whole <em>page</em> so the
              header and controls magnify with it &mdash; the latter so
              that low-vision users who need text magnification can read
              all the text on the page, not just the text on the map.
              The terminal map makes this context-sensitive: the
              on-screen control buttons and pinch-to-zoom on the map
              zoom only the map; pinch-to-zoom on the header or the
              controls zooms the whole page. The context of use selects
              the mode.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Routing and step-by-step directions</h2>
            <p>
              The map can draw a route between selected gates or points
              of interest. It is an illustrative route, not real
              pathfinding. The header then offers step-by-step
              navigation: a <em>Next</em> button announces each segment
              in turn, an <em>End step-by-step navigation</em> button
              exits, and a segments list lets the user jump to any
              segment &mdash; each entry announces its distance, the
              active one is marked, and the matching segment highlights
              on the map while the others dim. The underlying route
              also carries an accessible-route flag, a total distance,
              and an estimated time.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Limitations</h2>
            <p>
              The demo is a proof of the approach, not a finished
              product, and it is worth being precise about where it
              stops.
            </p>
            <ul>
              <li>
                <strong>No location sensing.</strong> It supports
                exploration &mdash; understanding the space and its
                relationships from anywhere &mdash; but not the
                in-situ, point-to-point experience that needs to know
                where the user is.
              </li>
              <li>
                <strong>Switch access is only partially served.</strong>{" "}
                The skip-to-pier links and rich interactive structure
                are not a reliable primary accommodation for switch
                users; landmark structure and <kbd>F6</kbd> region
                cycling help more, but the high node count works
                against them. The{" "}
                <Link href="/maps/terminal-map/switch-and-magnifier-support">
                  switch-access notes
                </Link>{" "}
                set out why.
              </li>
              <li>
                <strong>A high rendered-node count.</strong> Drawing
                everything as SVG, rather than image-plus-overlay,
                produces many more DOM nodes &mdash; more for a switch
                user to scan through, and a potential rendering cost.
              </li>
              <li>
                <strong>Zoom does not change level of detail.</strong>{" "}
                Gate numbers and POIs simply scale; nothing is grouped
                or dropped as you zoom out. A fuller version would
                group gates (a single &ldquo;gates 41&ndash;44&rdquo;)
                and group POIs semantically (&ldquo;shops&rdquo;), while
                keeping security and washrooms ungrouped until the zoom
                level forced otherwise.
              </li>
              <li>
                <strong>Two dimensions only.</strong> Buildings are
                three-dimensional; the map shows one level (Level 3,
                Departures). There is a level selector but no visible
                connectors between levels. A fuller version would add
                connector POIs for stairs, elevators, and escalators,
                with &ldquo;teleport&rdquo; controls that move the user
                between levels &mdash; focus landing on the connecting
                POI on the far side, with live-region announcements to
                re-orient.
              </li>
              <li>
                <strong>
                  The highlight pulse does not yet respect
                  reduced-motion.
                </strong>{" "}
                The pulse is deliberate &mdash; it draws attention to a
                point &mdash; but under{" "}
                <code>prefers-reduced-motion</code> it should pulse only
                briefly, for a user-configurable time. There is no
                settings surface for that yet.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Open questions</h2>
            <p>
              Some design questions are genuinely open. When directions
              cross between levels, the expectation is that the route
              shows the segment for the level currently displayed, and
              changing level shows that level&rsquo;s segment. But the
              step-by-step instructions raise unresolved questions:
              should per-segment progress be represented on the map at
              all, and what should a blind screen-reader user know about
              what is happening on the map as they step through a route?
              These are not yet answered.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/maps/terminal-map/switch-and-magnifier-support">
                  Switch access and magnifier support
                </Link>{" "}
                &mdash; how skip links, landmarks, and focus behave
                across switch-access and magnification software, and
                what that means for this map.
              </li>
              <li>
                <Link href="/research/cisna-model">The CISNA Model</Link>{" "}
                &mdash; the layered architecture the map is built from.
              </li>
              <li>
                <Link href="/maps">Maps</Link> &mdash; the wider
                accessible-maps work this demo belongs to.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Source</h2>
            <p>
              GPL-3.0. Source:{" "}
              <a href="https://github.com/bobdodd/terminal-map">
                github.com/bobdodd/terminal-map
              </a>
              . The terminal map has its own repository; the other two
              demos live in{" "}
              <a href="https://github.com/bobdodd/accessible-maps">
                accessible-maps
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
