import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";

const SUBSTRATE = `// Stored: points in space with grouped properties.
// No edges, no circuits — those are computed from this, later.

const pins = [
  { id: "lot27",   type: "property",
    at: [x, y],                 // cartesian, on the rendered plane
    props: { collection: "Shield", beds: 2, baths: 2, price: 761880 } },

  { id: "stmarks", type: "amenity", class: "education",
    at: [x, y],
    props: { name: "St Mark's Primary" } },
];`;

const DERIVED_EDGE = `// The convenience relation: derived per selected property.
// distance and bearing are read off the coordinates, never stored.

edge("lot27" -> "stmarks") = { distance: 320 /* m */, bearing: 47 /* deg */ }`;

const CIRCUIT = `// Importance orders the rings; angle orders within a ring.
//   distance (the weight) = priority    -> which ring
//   bearing               = continuity  -> where in the ring

nearby(origin)
  .sort((a, b) =>
       band(a.distance) - band(b.distance)        // 1st key: distance band
    || clockwiseFromNorth(a.bearing, b.bearing)); // 2nd key: compass sweep`;

const PIN_MARKUP = `<!-- one pin = one typed node, focusable and operable -->
<g role="button" tabindex="0">
  <text role="heading" aria-level="4">Plot 27</text>
  <text>2 bed, 2 bath — $761,880</text>
</g>

<!-- An SVG <g> is not operable for free: the tabindex and
     Enter/Space key handling are what make it a real button. -->`;

const LANDMARK_TREE = `<header role="banner"> ... </header>
<nav aria-label="Filters"> ... </nav>            <!-- the visual filters -->

<main>
  <section aria-label="Results">
    ... one heading + button per property ...
  </section>

  <svg aria-label="Map of the subdivision">
    ... the same properties, the same headings + buttons ...
  </svg>
</main>

<!-- One landmark set, one heading hierarchy. The SVG is not a
     separate world; it is the same model, drawn. -->`;

const LIVE_REGION = `<div aria-live="polite">Plot 27 displayed on the map</div>`;

export default function MapsHowItsBuilt() {
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
            <h1>How an accessible map is built</h1>
            <p className="lede">
              The maps in this family look different on purpose &mdash;
              a building, a subdivision, a city &mdash; but underneath
              they are one idea, built one way. This page is that idea,
              in enough detail to build your own. It is deliberately not
              a recipe to copy: the snippets are here to make the model
              legible, not to be lifted. You have to understand the
              model before any recipe would help.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A map is information before it is a picture</h2>
            <p>
              Open any digital map and what is actually stored is a list
              of points with coordinates. A sighted reader makes that
              list mean something: the eye runs over the plane, groups
              the clusters, judges what is near what, infers that the
              row of pins along the top is the shopping parade and the
              dense knot in the corner is the school district. None of
              that inference is in the data. It is supplied, for free
              and unconsciously, by sight and context.
            </p>
            <p>
              Assistive technology has neither. It can only report what
              is encoded. So a map that stores coordinates and nothing
              else hands a screen-reader user a bag of points with no
              way to understand how they relate &mdash; which is to say,
              no map at all. The relationships a sighted reader infers
              are exactly the part that has to be made explicit: which
              points are of which kind, which are near which, which
              matter most for the task in hand. Those relationships
              &mdash; the <strong>edges</strong> and their{" "}
              <strong>weights</strong> &mdash; are not metadata
              decorating the map. On a non-visual map they{" "}
              <em>are</em> the map. Make them explicit and assistive
              technology can convey them; leave them implicit and no
              amount of alt text recovers them.
            </p>
            <p>
              This is the build-level account of the{" "}
              <Link href="/maps">modality-conversion problem</Link> the
              rest of the maps section names. Everything below is one
              answer to a single question: how do you make the
              relationships explicit, and then express them in a form a
              screen reader, a magnifier, and a keyboard can each pick
              up?
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>One model, two projections</h2>
            <p>
              A map of this kind has two faces: the list of search
              results, and the rendered map. It is tempting to treat
              them as two features. They are not &mdash; they are two{" "}
              <em>projections</em> of one underlying model. The same
              property exists once, as data; the list and the map are
              both ways of reading it.
            </p>
            <p>
              The mistake to avoid is making one projection accessible
              by quietly substituting the other &mdash; handing the
              screen-reader user the results list and calling the map
              done. The results list is not the map. The map&rsquo;s
              distinctive content is spatial: what is near what, how
              things cluster, which way is which. The goal is to give
              every user as much access to <em>each</em> projection as
              the medium allows &mdash; an accessible results list and
              an accessible map, both, each on its own terms. That is
              maximisation, not a promise of perfect parity; some of the
              spatial reading will always be richer in one modality than
              another, and the work is to close that gap as far as the
              medium can.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The information model: a typed digraph</h2>
            <p>
              Every pin is a <strong>node</strong>, and every node has a
              type. There are two classes &mdash; property and amenity
              &mdash; and amenities carry their own subtypes: education,
              places of worship, retail, recreation. That classification
              is a <strong>tree</strong>: a clean is-a hierarchy, one
              parent per node. What turns the tree into a{" "}
              <strong>digraph</strong> is a second kind of edge that
              does not follow the hierarchy &mdash; the{" "}
              <strong>convenience relation</strong>: a directed,
              weighted link from a property to a nearby amenity, carrying
              the distance and bearing between them.
            </p>
            <p>
              Crucially, none of those edges is stored. What is stored is
              smaller and dumber: points in space, with grouped
              properties.
            </p>
            <pre>
              <code>{SUBSTRATE}</code>
            </pre>
            <p>
              The edges, the weights, and the circuits a reader will
              navigate are all computed from that substrate at the
              moment they are needed.
            </p>
            <pre>
              <code>{DERIVED_EDGE}</code>
            </pre>
            <p>
              The digraph, in other words, is not an object you persist;
              it is a <strong>function you evaluate</strong>, and its
              arguments are the user&rsquo;s need and the user&rsquo;s
              current selection. That is what makes the model general.
              The same pins, drawn the same way, yield a different
              digraph for a different reader: a home-buyer weights
              proximity to shops and schools; someone choosing somewhere
              to retire weights quiet and healthcare. The picture is
              identical; the weighted graph underneath is not. The graph
              is <strong>needs-driven</strong>.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Cartesian to polar: rendering for sequential listening</h2>
            <p>
              A sighted reader scans the plane in two dimensions at once:
              the whole map is present, and the eye chooses where to go.
              A screen-reader user receives the map as a{" "}
              <em>sequence</em> &mdash; one announcement after another
              &mdash; with no two-dimensional frame to hold them in. The
              visual map is Cartesian; the experience the non-sighted
              user inhabits is <strong>polar</strong>: a series of things
              described relative to a chosen origin. That origin is the{" "}
              <strong>pin-as-datum</strong> &mdash; the selected property
              &mdash; with everything else given as a distance and a
              direction from it.
            </p>
            <p>
              Building that polar reading well turns on a distinction
              that is easy to miss: <strong>weight gives you importance,
              not sequence.</strong> You cannot simply read the amenities
              out in weight order, because the second-most-important may
              sit on the opposite side of the subdivision from the first,
              and a description that jumps back and forth across the map
              is no easier to hold than the bag of points we started
              with. Two different things have to be decided: which
              amenities matter, and in what order to walk them.
            </p>
            <p>
              The resolution is to use two keys. Distance &mdash; the
              weight &mdash; sets priority, and it does so in{" "}
              <strong>bands</strong>: an inner ring of the closest
              amenities, then the next ring out, and so on. Within a
              ring, a second key &mdash; bearing &mdash; gives a stable
              sweep, clockwise from north. The result is an onion-ring,
              or spiral, traversal: closest things first, and within each
              band a predictable turn around the compass rather than a
              scatter.
            </p>
            <pre>
              <code>{CIRCUIT}</code>
            </pre>
            <p>
              Banding the distance is a deliberate choice over a smooth
              spiral. A continuous spiral needs no threshold, but it
              blurs distance into a gradient; banded rings cost you a
              decision about what counts as &ldquo;near,&rdquo; and repay
              it in something a screen-reader user can actually hear
              &mdash; &ldquo;within five minutes: the school and the
              park; within fifteen: &hellip;&rdquo; &mdash; where the
              step from one ring to the next is itself an orientation
              cue.
            </p>
            <p>
              Because the whole construction hangs off the origin, the
              obvious question is what the origin is when the user has
              selected several properties to compare, or none. With one
              property selected, it is that property. With none, it falls
              back to the centre of the subdivision. With several, there
              is no single origin &mdash; and the honest answer is that
              this is where the model still has open questions. The demo
              described here keeps it simple and anchors on the centre,
              leaving multi-property comparison as unfinished business
              rather than pretending it is solved.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Expressing it so assistive technology can pick it up</h2>
            <p>
              A model that exists only in the developer&rsquo;s head
              helps no one. It has to be expressed in the rendering in a
              form assistive technology can read &mdash; and that means
              treating the whole page as <em>one</em> structure, not an
              accessible HTML part bolted to an inaccessible picture.
              There is a single set of landmarks to move through and a
              single hierarchy of headings, and the SVG map participates
              in both. It makes no conceptual difference that the results
              are HTML and the map is SVG; they are the same model, drawn
              twice.
            </p>
            <pre>
              <code>{LANDMARK_TREE}</code>
            </pre>
            <p>
              Within that structure, each pin is exposed as a node the
              reader can find and act on. In the demo a property pin is a{" "}
              <em>heading</em> and a <em>button</em> at once &mdash; a
              heading so it appears when a screen-reader user skims by
              heading, a button so it appears when they skim by control,
              and so it can be activated.
            </p>
            <pre>
              <code>{PIN_MARKUP}</code>
            </pre>
            <p>
              That much is sound &mdash; and it also shows exactly why
              understanding matters more than copying. ARIA defines{" "}
              <code>button</code> as a role whose descendants are
              presentational, which means that, by the letter of the
              specification, a heading placed <em>inside</em> a button
              should be folded into the button&rsquo;s name and vanish
              from the headings list. That it survives in the demo is
              down to how leniently browsers and screen readers map SVG:
              useful, but not guaranteed, and the kind of thing that can
              quietly break between versions. The robust version keeps
              the heading <em>out</em> of the button&rsquo;s subtree; the
              demo leans on the leniency and accepts that it must be
              tested across screen readers rather than assumed. Either
              choice is defensible. Choosing without knowing the
              trade-off is not.
            </p>
            <p>
              Three success criteria carry most of this.{" "}
              <strong>1.3.1 Info and Relationships</strong> is the home
              of the structure itself &mdash; the nodes and, just as
              importantly, the <em>edges</em> between them, made
              programmatically determinable rather than left to be
              inferred from pixels; the &ldquo;relationships&rdquo;
              clause is precisely the half a coordinate dump throws away.{" "}
              <strong>4.1.2 Name, Role, Value</strong> governs the
              interactive surface &mdash; a pin announcing its name, its
              role, and its state. And <strong>2.4.3 Focus Order</strong>{" "}
              is the one the circuit was about all along: the spiral is a
              focus order, and 2.4.3&rsquo;s demand that order
              &ldquo;preserve meaning&rdquo; is the formal statement of
              the rule that the sequence must not scatter.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Navigating it</h2>
            <p>
              Readers arrive with different levels of fluency in their
              assistive technology, and a map that serves only the most
              expert locks the rest out. The demo treats the navigation
              methods as a ladder of increasing power, each a fallback
              for the one above it. <strong>Arrow keys</strong> walk the
              content in order &mdash; which is why the focus order, the
              circuit, is the floor everyone stands on.{" "}
              <strong>Heading navigation</strong> jumps between pins for
              those who know it. <strong>Landmark navigation</strong>{" "}
              jumps between whole regions for those who know that. Each is
              built to work alone, and heading and landmark structure are
              kept close to parallel on purpose, so that no one is
              stranded by knowing only the more basic gesture.
            </p>
            <p>
              Changing <em>what</em> the map shows is the same operation
              in both projections: a <strong>filter</strong> in the
              visual one, the screen-reader <strong>rotor</strong> in the
              non-visual one &mdash; one capability for choosing which
              nodes and edges are live, expressed through each
              projection&rsquo;s native control. When a selection
              changes, the change is announced through a live region
              rather than by moving focus.
            </p>
            <pre>
              <code>{LIVE_REGION}</code>
            </pre>
            <p>
              That last decision is worth dwelling on. When a user picks
              a result, focus <em>stays</em> on the results list; it does
              not jump to the property on the map. The reason is that a
              buyer often wants to select several properties and then
              compare them spatially, and yanking focus to the map on
              each pick would wreck that. Keeping focus put avoids an
              unexpected change of context, and the live-region
              announcement &mdash; &ldquo;Plot 27 displayed on the
              map&rdquo; &mdash; does the work the focus move would have
              done. The cost is that the property must now be{" "}
              <em>found</em> on the map by navigation, which is exactly
              why every pin is both a heading and a button: the cost is
              paid back by making it cheap to land on from either rotor.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why the demos differ</h2>
            <p>
              Everything above is one model, and the maps in this family
              are that model evaluated for different jobs. The difference
              between them is not a difference of principle; it is which
              part of the graph does the work.
            </p>
            <p>
              The{" "}
              <Link href="/maps/search-and-map-pins">
                search and map pin demo
              </Link>{" "}
              is almost entirely about its <em>nodes</em>. The user
              filters properties, and the amenity graph beneath barely
              moves; the edges are simple, and the rendered streets are
              only context &mdash; which is why it can run on a raster
              base with an addressable pin overlay rather than a fully
              drawn map. The{" "}
              <Link href="/maps/east-toronto-streetmap">
                East Toronto streetmap
              </Link>{" "}
              and the{" "}
              <Link href="/maps/terminal-map">terminal map</Link> are
              about their <em>edges</em>: in a wayfinding map the routes
              are the edges, so filtering and the rotor act on the edges
              directly, the graph is dense, and every feature has to be
              drawn as addressable SVG because the space itself is the
              content. Same model; the weight simply falls in different
              places.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Honest limits</h2>
            <p>
              Three honesties, because a model that hides its seams
              teaches the wrong lesson. First: the validation around
              ARIA and roles in SVG is lax, and that cuts both ways
              &mdash; you can get away with markup that HTML tooling
              would reject, but the same gap means nothing warns you when
              it is wrong, so SVG is a place to test <em>more</em> across
              real assistive technology, not less. Second: the numbers in
              the demo &mdash; the distances, the prices &mdash; are
              placeholder; it shows the <em>form</em> of an accessible
              description, not real geography. Third: the multi-property
              comparison left open above is genuinely open. None of these
              is a reason not to build; they are the parts of the map you
              should know are still being drawn.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/maps/search-and-map-pins">
                  Search and map pin demo
                </Link>{" "}
                &mdash; the model at its simplest: nodes, a raster base,
                the polar finding made visible.
              </li>
              <li>
                <Link href="/maps/east-toronto-streetmap">
                  East Toronto streetmap
                </Link>{" "}
                &mdash; where the landmarks, filters, and rotor first
                appeared.
              </li>
              <li>
                <Link href="/maps/terminal-map">Terminal map</Link>{" "}
                &mdash; the richest feature inventory, edges doing the
                work.
              </li>
              <li>
                <Link href="/maps/tiled-toronto-map">
                  Tiled Toronto map
                </Link>{" "}
                &mdash; the same model carried to city scale on
                pre-rendered SVG tiles.
              </li>
              <li>
                <Link href="/research/cisna-model">The CISNA Model</Link>{" "}
                &mdash; the capability framework the maps work applies.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
