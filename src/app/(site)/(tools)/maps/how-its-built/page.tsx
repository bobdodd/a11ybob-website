import Link from "next/link";
import type { CSSProperties } from "react";
import { MapsSubNav } from "@/components/MapsSubNav";

const SUBSTRATE = `// What is actually stored: points in space, with grouped properties.
// No edges. No circuits. No "convenience". Just coordinates + attributes.

const pins = [
  { id: "lot27",   type: "property",
    at: [x, y],                          // cartesian, on the rendered plane
    props: { collection: "Shield", beds: 2, baths: 2, price: 761880 } },

  { id: "stmarks", type: "amenity", class: "education",
    at: [x, y],
    props: { name: "St Mark's Primary" } },

  { id: "parade",  type: "amenity", class: "retail",
    at: [x, y],
    props: { name: "The Parade shops" } },
];`;

const TYPE_TREE = `The classification is a TREE — every node has exactly one parent:

        pin
        |-- property
        \`-- amenity
              |-- education
              |-- place of worship
              |-- retail
              \`-- recreation

What makes the whole thing a DIGRAPH is a second kind of edge that does
NOT follow that hierarchy — the convenience relation, directed and weighted:

        property  --(distance, bearing)-->  amenity`;

const DERIVED_EDGE = `// The convenience relation is DERIVED, per selected property, at runtime.
// distance and bearing are read off the coordinates — never stored.

edge("lot27" -> "stmarks") = { distance: 320 /* m */, bearing: 47  /* deg, NE */ }
edge("lot27" -> "parade")  = { distance: 610 /* m */, bearing: 122 /* deg, SE */ }`;

const CIRCUIT = `// Importance and sequence are two DIFFERENT decisions.
//   distance (the weight)  ->  IMPORTANCE  ->  which ring   (priority)
//   bearing                ->  SEQUENCE    ->  where in it  (continuity)

nearby(origin)
  .sort((a, b) =>
       band(a.distance) - band(b.distance)         // 1st key: distance band (ring)
    || clockwiseFromNorth(a.bearing, b.bearing));   // 2nd key: sweep within the ring`;

const PIN_MARKUP = `<!-- The heading and the button are SIBLINGS — never nested. -->
<g class="pin">                                        <!-- grouping / position only -->

  <text id="lot27-name" role="heading" aria-level="4">   <!-- found via the headings rotor -->
    Plot 27
  </text>

  <g role="button" tabindex="0"                          <!-- found via the controls rotor -->
     aria-labelledby="lot27-name lot27-meta">            <!-- borrows the heading for its name -->
    <text id="lot27-meta">2 bed, 2 bath — $761,880</text>
  </g>

</g>`;

const LANDMARK_TREE = `<header role="banner"> ... </header>
<nav aria-label="Filters"> ... </nav>                <!-- the visual filters -->

<main>
  <section aria-label="Results">
    ... one heading + button per property ...        <!-- the LIST projection -->
  </section>

  <svg aria-label="Map of the subdivision">
    ... the SAME properties, the SAME headings + buttons ...   <!-- the MAP projection -->
  </svg>
</main>

<!-- One landmark set. One heading hierarchy. The SVG is not a separate
     world bolted on; it is the same model, drawn. -->`;

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
              The maps in this family look different on purpose &mdash; a
              building, a subdivision, a city &mdash; but underneath they
              are one idea, built one way. This page is that idea, worked
              through in enough detail to build your own. It is
              deliberately not a recipe to copy: the code is here to make
              the model legible, not to be lifted. You have to understand
              the model before any recipe would help &mdash; so the prose,
              not the snippets, is the point.
            </p>
          </header>

          {/* ===== 1 ===== */}
          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>A map is information before it is a picture</h2>
            <p>
              Open any digital map and ask what is actually stored. It is a
              list of points with coordinates, and some attributes hung off
              each one. That is all. Everything that makes it feel like a{" "}
              <em>map</em> happens in the head of the person looking at it.
            </p>
            <p>
              A sighted reader does an enormous amount of unconscious work
              on that list. The eye runs over the whole plane at once,
              groups the clusters, judges what is near what, and supplies
              context from experience: the row of pins along the top edge
              is the shopping parade; the dense knot in the corner is the
              school catchment; this lot backs onto the green space, that
              one is hemmed in by the arterial road. None of those
              relationships are in the data. They are inferred &mdash; for
              free, instantly, and without anyone noticing it is happening
              &mdash; from sight, proximity, and prior knowledge of how
              places work.
            </p>
            <p>
              Assistive technology has none of that. It cannot scan a plane
              in parallel, it has no gestalt, and it brings no context. It
              can only report what is actually encoded. So a map that
              stores coordinates and nothing else hands a screen-reader
              user a bag of points and no way to understand how any of them
              relate &mdash; which is to say, no map at all. As the rest of
              this section&rsquo;s parent work puts it:{" "}
              <strong>
                a map of nodes and cartesian coordinates provides no design
                intent for assistive technology to follow.
              </strong>{" "}
              The sighted user is trusted to look and infer; the non-sighted
              user is left to reverse-engineer a structure from a list, with
              nothing to go on.
            </p>
            <p>
              The fix is not to apologise for the picture or to bolt a text
              caption onto it. It is to make the relationships a sighted
              reader infers <em>explicit in the data</em>: which points are
              of which kind, which are near which, and which matter most for
              the task at hand. Those relationships &mdash; the{" "}
              <strong>edges</strong> and their <strong>weights</strong>{" "}
              &mdash; are not metadata decorating a map. On a non-visual map
              they <em>are</em> the map. Equitable access comes from
              expressing them in the rendering: not just the lines, icons,
              and shapes, but the <strong>semantic relationships</strong>{" "}
              between them, in a form assistive technology can pick up.
            </p>
            <p>
              This is also why the obvious &ldquo;accessible map&rdquo;
              fails. Put alt text on every pin, or expose a list of
              coordinates, and you have given a screen-reader user every{" "}
              <em>node</em> and not one <em>relationship</em>. It passes a
              label audit and conveys nothing about how the places relate
              &mdash; which is the whole map. WCAG 1.3.1 is literally named{" "}
              <em>Info <strong>and Relationships</strong></em>; the second
              half is the load-bearing half, and the coordinate dump is
              exactly what throws it away. Everything below is one long
              answer to a single question: how do you make the
              relationships explicit, and then render them so a screen
              reader, a magnifier, and a keyboard can each get at them?
            </p>
          </section>

          {/* ===== 2 ===== */}
          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>One model, two projections</h2>
            <p>
              A map of this kind has two faces. There is the list of search
              results, and there is the rendered map. The tempting mistake
              is to treat them as two features that happen to sit on the
              same page. They are not. They are two <em>projections</em> of
              a single underlying model: a property exists once, as data,
              and the list and the map are both ways of reading that one
              thing. Search results and map renderings, in other words, are
              just different projections of the same information.
            </p>
            <p>
              Holding that line matters because it rules out the move most
              &ldquo;accessible maps&rdquo; quietly make: serving the
              non-sighted user whichever projection is <em>easiest</em> to
              make accessible &mdash; usually the list &mdash; and calling
              the map done. That is not access to the map. It is a polite
              refusal of it. The results list is not the map; the
              map&rsquo;s distinctive content is <em>spatial</em>: how
              things cluster, what lies in which direction, what is near
              what, how convenience varies from one edge of the subdivision
              to the other. None of that is in the list.
            </p>
            <p>
              So the job is not to pick a projection. It is to give every
              user as much access to <em>each</em> projection as the medium
              allows &mdash; an accessible results list <em>and</em> an
              accessible map, both, each on its own terms. That phrase
              &mdash; <em>as much as you can</em> &mdash; is doing real
              work: it is maximisation, not a promise of perfect parity.
              Some of the spatial reading will always be richer in one
              modality than another, and pretending otherwise helps no one.
              The discipline is to close the gap as far as the medium can,
              per projection, rather than to collapse the two into whichever
              is convenient.
            </p>
          </section>

          {/* ===== 3 ===== */}
          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>The information model: a typed digraph</h2>
            <p>
              If the relationships are the map, then the model has to be a
              structure that <em>holds</em> relationships. The one that fits
              is a <strong>typed directed graph</strong> &mdash; a digraph
              &mdash; and it is worth being precise about its parts, because
              two different kinds of structure are tangled together in it
              and they do different jobs.
            </p>

            <h3>Pins are typed nodes</h3>
            <p>
              A pin is a point in space that carries information unique to
              that location, and every pin has a <strong>type</strong>.
              There are two classes &mdash; <strong>property</strong> and{" "}
              <strong>amenity</strong> &mdash; and amenities carry their own
              subtypes: education, places of worship, retail, recreation,
              and so on. A property is a thing for sale, with an address and
              the attributes a buyer filters on (bedrooms, bathrooms, style,
              price). An amenity is a thing in the world around it, with a
              name and a class. The type is not decoration; it is what lets
              a reader say &ldquo;show me the schools&rdquo; or &ldquo;take
              me to the next property&rdquo; and have that mean something.
            </p>

            <h3>The classification is a tree</h3>
            <p>
              That type system is a <strong>tree</strong>: a clean is-a
              hierarchy in which every node has exactly one parent. A school
              is an education amenity is an amenity; it is not also,
              simultaneously, a property. The tree is the part of the
              structure that answers &ldquo;what <em>kind</em> of thing is
              this,&rdquo; and because it is a strict hierarchy it gives you
              categorical navigation almost for free.
            </p>
            <pre>
              <code>{TYPE_TREE}</code>
            </pre>

            <h3>The edges are what make it a digraph</h3>
            <p>
              A tree on its own is not enough, and this is the distinction
              that does the most work: what turns the classification tree
              into a <strong>digraph</strong> is a second kind of edge that
              does <em>not</em> follow the hierarchy. The obvious one is the{" "}
              <strong>convenience relation</strong> &mdash; a{" "}
              <em>directed</em>, <em>weighted</em> link from a property to a
              nearby amenity, carrying the distance and bearing between
              them. It runs property&nbsp;&rarr;&nbsp;amenity because that is
              the direction a buyer reasons in (&ldquo;how near is the
              school to <em>this</em> home?&rdquo;), and it is weighted
              because not every nearby thing matters equally. The tree says
              what a node <em>is</em>; the edges say how nodes{" "}
              <em>relate</em>. Both are needed, and they are not the same
              shape.
            </p>

            <h3>Stored vs computed: the digraph is a function, not a file</h3>
            <p>
              Here is the part that surprises people: none of those edges is
              stored. What is stored is smaller and dumber than the digraph
              &mdash; it is points in space with grouped properties.
            </p>
            <pre>
              <code>{SUBSTRATE}</code>
            </pre>
            <p>
              The edges, the weights, and the circuits a reader will
              navigate are all <em>interpreted from that substrate at
              runtime</em>. The distance and bearing on a convenience edge
              are read off the coordinates the moment they are needed, not
              kept in a table:
            </p>
            <pre>
              <code>{DERIVED_EDGE}</code>
            </pre>
            <p>
              So the digraph is not an object you persist; it is a{" "}
              <strong>function you evaluate</strong>. And once you see it
              that way, its two arguments fall out naturally: the
              user&rsquo;s <strong>need</strong> (which edges and weights
              matter) and the user&rsquo;s current <strong>selection</strong>{" "}
              (where the graph is anchored). Re-anchoring on a different
              property is not a structural change; it is just a different
              argument to the same evaluation over the same fixed substrate.
            </p>

            <h3>The digraph is needs-driven</h3>
            <p>
              That is what makes the model general rather than a one-off for
              property search. The same pins, drawn in the same positions,
              yield a <em>different</em> digraph for a different reader,
              because the weighting is a function of who is asking. A
              home-buyer weights proximity to shops and a good school. A
              map built for prospective parents would weight a quite
              different set, even though the picture on screen is identical.
              Someone choosing where to retire weights quiet and access to
              healthcare. Same coordinates, same pins, same rendered image
              &mdash; and a different weighted digraph underneath each time.
              The digraph is needs-driven, and it is weighted; architecturally
              that means the weighting is a <em>parameter</em> of the model,
              not a constant baked into it.
            </p>
            <p>
              And this is precisely where the accessibility pays off,
              because the two structures map onto the two things a
              non-visual reader needs to do. The <strong>type tree</strong>{" "}
              is the spine of <em>categorical</em> navigation: group and
              filter by class, step through &ldquo;next education
              pin,&rdquo; collapse a whole category you do not care about.
              The <strong>directed edges</strong> are{" "}
              <em>relational</em> navigation: stand on a property and walk
              its edges out to the amenities that make it convenient. Get
              the model right and the navigation is implied by it.
            </p>
          </section>

          {/* ===== 4 ===== */}
          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>Cartesian to polar: rendering for a reader who listens in sequence</h2>
            <p>
              Now the model has to be <em>read</em>, and the medium changes
              everything about how. A sighted reader takes the plane in two
              dimensions at once: the whole map is present, and the eye
              chooses where to go and in what order. A screen-reader user
              receives the map as a <strong>sequence</strong> &mdash; one
              announcement after another, in time &mdash; and has no
              two-dimensional frame to hold those announcements in. The
              visual map is <strong>Cartesian</strong>. The experience the
              non-sighted user actually inhabits is{" "}
              <strong>polar</strong>: a series of things described relative
              to a chosen origin. That origin is the{" "}
              <strong>pin-as-datum</strong> &mdash; the selected property
              &mdash; and everything else is given as a distance and a
              direction from it.
            </p>

            <h3>Weight gives you importance, not sequence</h3>
            <p>
              Building that polar reading well turns on a distinction that
              is easy to miss and easy to get wrong:{" "}
              <strong>the weight tells you importance, not sequence.</strong>{" "}
              You cannot simply read the amenities out in order of weight.
              The second-most-important amenity may sit on the opposite side
              of the subdivision from the most important, and a description
              that jumps north, then south, then back north is no easier to
              hold in the head than the bag of points we started with
              &mdash; the user just hops randomly around the map. Two
              genuinely different things have to be decided: <em>which</em>{" "}
              amenities matter (importance), and in <em>what order</em> to
              walk them (sequence). A single weight answers only the first.
            </p>

            <h3>Two keys: rings for priority, a sweep for continuity</h3>
            <p>
              The resolution is to sort on two keys, in order. Distance
              &mdash; the weight &mdash; sets priority, and it does so in{" "}
              <strong>bands</strong>: an inner ring of the closest
              amenities, then the next ring out, and so on. Within a ring, a
              second key &mdash; bearing &mdash; gives a stable{" "}
              <strong>sweep</strong>, clockwise from north. The result is an
              onion-ring, or spiral, traversal: closest things first, and
              within each band a predictable turn around the compass rather
              than a scatter.
            </p>
            <pre>
              <code>{CIRCUIT}</code>
            </pre>
            <p>
              It is worth naming why this works, because it is the whole
              trick. <strong>Radius is the priority axis</strong> &mdash;
              which amenities matter most. <strong>Angle is the continuity
              axis</strong> &mdash; what stops the description teleporting
              across the map between two things of near-equal weight. A pure
              weight-sort has only the first axis, so it hops. The spiral
              has both, in the right order: radius primary, angle secondary.
              That is the difference between a description you can follow and
              one you cannot. (In the demo, with a handful of pins, this
              shows up in its simplest form &mdash; describe the amenities
              starting at north and rotating clockwise; on a larger, real
              subdivision it becomes the full onion-ring spiral, closest ring
              first.)
            </p>

            <h3>Banded rings vs a smooth spiral</h3>
            <p>
              Banding the distance is a deliberate choice over a continuous
              spiral, and it is a real trade-off. A continuous spiral needs
              no threshold &mdash; radius just grows as you sweep &mdash; but
              it blurs distance into a smooth gradient. Banded rings cost you
              a policy decision (what counts as &ldquo;near&rdquo;?) and
              repay it with something a screen-reader user can actually hear:
              announceable bands &mdash; &ldquo;within five minutes: the
              school and the park; within fifteen: &hellip;&rdquo; &mdash;
              where the very step from one ring to the next becomes an
              orientation cue (&ldquo;now further out&rdquo;). Distance stops
              being a number and becomes a spoken category. For a non-visual
              reader that legibility is usually worth the threshold policy.
            </p>

            <h3>Where the origin comes from</h3>
            <p>
              Because the whole construction hangs off the origin, the
              obvious question is what the origin is when the user has not
              selected a single property. The answer follows selection
              count. With <strong>one</strong> property selected, the origin
              is that property &mdash; the per-property spiral. With{" "}
              <strong>none</strong>, it falls back to the centre of the
              subdivision, and amenities are described relative to that. With{" "}
              <strong>several</strong> selected for comparison, there is no
              single origin, and &mdash; honestly &mdash; this is where the
              model still has open questions: do you anchor on a centroid and
              report each amenity&rsquo;s convenience per property
              (&ldquo;the school is 300&thinsp;m from A, 600&thinsp;m from
              B&rdquo;), or nominate a primary? The demo keeps it simple,
              anchors on the centre, and leaves multi-property comparison as
              unfinished business rather than pretending it is solved.
            </p>
          </section>

          {/* ===== 5 ===== */}
          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>Expressing it so assistive technology can pick it up</h2>
            <p>
              A model that lives only in the developer&rsquo;s head helps no
              one. It has to be expressed in the rendering, in a form
              assistive technology can read &mdash; and the first principle
              is to treat the whole page as <em>one</em> structure, not as an
              accessible HTML part with an inaccessible picture bolted to the
              side.
            </p>

            <h3>One page, one structure</h3>
            <p>
              There is a single set of navigation landmarks for a screen
              reader to move through, and a single hierarchy of headings.
              The SVG map participates in both. It makes no conceptual
              difference that the results list is HTML and the map is SVG;
              they are the same model, drawn twice, and they live in one
              landmark tree and one heading outline.
            </p>
            <pre>
              <code>{LANDMARK_TREE}</code>
            </pre>

            <h3>Every pin is a node you can find and act on</h3>
            <p>
              Within that structure, each pin is exposed as something a
              reader can both <em>find</em> and <em>act on</em>. In the demo
              a property is a <strong>heading</strong> (so it appears when a
              screen-reader user skims by heading) and a{" "}
              <strong>button</strong> (so it appears when they skim by
              control, and so it can be activated) &mdash; two independent
              ways to land on the same pin.
            </p>
            <pre>
              <code>{PIN_MARKUP}</code>
            </pre>
            <p>
              The detail that matters here &mdash; and the reason this page
              keeps insisting you understand rather than copy &mdash; is{" "}
              <strong>that the heading and the button are siblings, never
              nested.</strong> ARIA defines <code>button</code> as a role
              whose descendants are <em>presentational</em>: by the letter of
              the spec, a heading placed <em>inside</em> a button should be
              folded into the button&rsquo;s name and vanish from the
              headings list. A heading nested in a button is therefore a
              heading you cannot rely on. Keeping them as siblings &mdash;
              the button borrowing the heading&rsquo;s text for its name via{" "}
              <code>aria-labelledby</code> rather than swallowing it &mdash;
              guarantees the heading stays a heading. (In SVG specifically
              the visible title often has to remain inside the card for paint
              reasons, so the robust form is a screen-reader-only heading as
              the sibling; the principle is the same.) The point is general:
              the structure is right, or the rotor lies to you, and no
              validator will warn you that it has.
            </p>

            <h3>The three success criteria that carry it</h3>
            <p>
              In WCAG terms, three criteria do most of the work, and it is
              worth knowing which is responsible for what:
            </p>
            <ul>
              <li>
                <strong>1.3.1 Info and Relationships</strong> owns the{" "}
                <em>structure itself</em> &mdash; the typed nodes <em>and</em>
                {" "}the edges between them, made programmatically
                determinable rather than left to be inferred from pixels. The
                &ldquo;relationships&rdquo; clause is exactly the half a
                coordinate dump violates; this is where the digraph has to
                actually surface.
              </li>
              <li>
                <strong>4.1.2 Name, Role, Value</strong> governs the{" "}
                <em>interactive surface</em> &mdash; a pin announcing its name,
                its role (property, or amenity-of-a-subtype), and its state
                (selected; current; &ldquo;2 of 5 in this ring&rdquo;); the
                filter controls; the traversal cursor &mdash; and keeping all
                of that in sync as the user moves.
              </li>
              <li>
                <strong>2.4.3 Focus Order</strong> is the one the whole
                circuit discussion was really about. The spiral{" "}
                <em>is</em> a focus order, and 2.4.3&rsquo;s requirement that
                order &ldquo;preserve meaning and operability&rdquo; is the
                formal statement of the rule that the sequence must not
                scatter. Importance-versus-sequence is not a nicety; it is
                how you satisfy 2.4.3 for a map.
              </li>
            </ul>
            <p>
              One honesty runs under all of this:{" "}
              <strong>ARIA support in SVG is lax,</strong> and the laxity
              cuts both ways. You can get away with markup that HTML tooling
              would reject &mdash; but the same gap means nothing warns you
              when it is wrong, and behaviour varies across screen readers
              and browser versions. SVG is therefore a place to test{" "}
              <em>more</em> across real assistive technology, not less. The
              quiet success in one screen reader is not the same as a correct
              accessibility tree.
            </p>
          </section>

          {/* ===== 6 ===== */}
          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>Navigating it</h2>

            <h3>The food chain: arrow keys, then headings, then landmarks</h3>
            <p>
              Readers arrive with very different fluency in their assistive
              technology, and a map that serves only the most expert locks
              everyone else out. The demo treats the navigation methods as a
              ladder of increasing power, each a fallback for the one above
              it. <strong>Arrow keys</strong> walk the content in order
              &mdash; the most basic skill, and the reason the focus order,
              the circuit, is the floor everyone stands on.{" "}
              <strong>Heading navigation</strong> jumps between pins for those
              who know it. <strong>Landmark navigation</strong> jumps between
              whole regions for those who know that. Landmark navigation is a
              little more efficient, but each rung is built to work alone, and
              the heading structure and the landmark structure are kept close
              to parallel on purpose &mdash; so a reader who only knows
              heading navigation is not stranded, and gets nearly the same
              reach as one who knows landmarks. It is redundancy as
              resilience, not duplication.
            </p>

            <h3>Filters and the rotor are one capability</h3>
            <p>
              Changing <em>what</em> the map shows is a single capability
              expressed twice: a <strong>filter</strong> in the visual
              projection, the screen-reader <strong>rotor</strong> in the
              non-visual one. Both choose which nodes and edges are live;
              each is its projection&rsquo;s native control for the same
              operation. What that manipulation touches differs by map. On
              this search-and-pins demo it is almost entirely{" "}
              <em>node-side</em> &mdash; the property search narrows which
              property-nodes are shown, and the amenity graph beneath barely
              moves. On a wayfinding map it acts heavily on <em>edges</em>,
              because there the routes <em>are</em> edges. Same control, very
              different consequences, depending on which part of the graph
              the map is about.
            </p>

            <h3>Why focus stays on the results</h3>
            <p>
              When a selection changes, the change is announced through a
              live region rather than by moving focus.
            </p>
            <pre>
              <code>{LIVE_REGION}</code>
            </pre>
            <p>
              That decision repays a close look, because it is
              counter-intuitive and deliberate. When a user picks a result,
              focus <em>stays</em> on the results list; it does{" "}
              <em>not</em> jump to the property on the map. The reason is the
              buyer&rsquo;s actual task: people want to select several
              candidates and <em>then</em> go and compare where they sit
              relative to the things they care about, and yanking focus onto
              the map at every pick would wreck that workflow. Keeping focus
              put avoids an unexpected change of context (the concern behind
              WCAG 3.2.1 / 3.2.2), and the live-region announcement &mdash;
              &ldquo;Plot 27 displayed on the map&rdquo; &mdash; does the work
              the focus move would have done, as a status message (4.1.3).
              The cost is real: the property now has to be <em>found</em> on
              the map by navigation rather than handed to you. That cost is
              exactly why every pin is both a heading and a button &mdash; so
              it is cheap to land on from whichever rotor the reader reaches
              for. The decision and its compensation are a pair; you cannot
              make the first without paying for it with the second.
            </p>
          </section>

          {/* ===== 7 ===== */}
          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>Why the maps in the family differ</h2>
            <p>
              Everything above is one model, and the maps in this family are
              that model evaluated for different jobs. The difference between
              them is not a difference of principle &mdash; they share the
              digraph, the polar reading, the one-structure rendering. It is
              a difference in <em>which part of the graph does the work,</em>
              and the rendering follows from that.
            </p>
            <p>
              The{" "}
              <Link href="/maps/search-and-map-pins">
                search and map pin demo
              </Link>{" "}
              is almost entirely about its <strong>nodes</strong>. The user
              filters properties; the amenity graph beneath barely moves; the
              edges are simple; and the streets are only context. That is
              precisely why it can run on a raster base with an addressable
              pin overlay rather than a fully drawn map &mdash; only the pins
              need to be addressable, because only the pins are what the map
              is about. The{" "}
              <Link href="/maps/east-toronto-streetmap">
                East Toronto streetmap
              </Link>{" "}
              and the{" "}
              <Link href="/maps/terminal-map">terminal map</Link> are about
              their <strong>edges</strong>: in a wayfinding map the routes{" "}
              <em>are</em> the edges, so filtering and the rotor act on the
              edges directly, the graph is dense, and every feature has to be
              drawn as addressable SVG because the space itself is the
              content. Same model; the weight simply falls in a different
              place, and the right rendering follows the job rather than a
              house style.
            </p>
          </section>

          {/* ===== 8 ===== */}
          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>Honest limits</h2>
            <p>
              A model that hides its seams teaches the wrong lesson, so three
              honesties to close on.
            </p>
            <ul>
              <li>
                <strong>SVG accessibility is under-specified in practice.</strong>{" "}
                The validation around ARIA and roles in SVG is lax; that lets
                you get away with things, and it equally means nothing flags
                the things you got wrong. Treat SVG as the place that needs{" "}
                <em>more</em> testing across real screen readers, not less.
              </li>
              <li>
                <strong>The numbers in the demo are placeholder.</strong> The
                distances, the prices, the amenities &mdash; mathematical
                lorem ipsum, not real geography. The demo shows the{" "}
                <em>form</em> of an accessible description (a thing named,
                placed, and ordered relative to an anchor), not a working
                subdivision tool. That is the right scope for a demonstration
                of the model; it is not a product.
              </li>
              <li>
                <strong>Multi-property comparison is genuinely open.</strong>{" "}
                The question from the polar section &mdash; what the origin is
                when several properties are selected at once &mdash; does not
                have a settled answer here. It is a real piece of the map
                still being drawn, and it is more honest to say so than to
                paper over it.
              </li>
            </ul>
          </section>

          {/* ===== reading on ===== */}
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
                &mdash; the model at its simplest: nodes, a raster base, the
                polar finding made visible.
              </li>
              <li>
                <Link href="/maps/east-toronto-streetmap">
                  East Toronto streetmap
                </Link>{" "}
                &mdash; where the landmarks, filters, and rotor first
                appeared.
              </li>
              <li>
                <Link href="/maps/terminal-map">Terminal map</Link> &mdash;
                the richest feature inventory; the edges doing the work.
              </li>
              <li>
                <Link href="/maps/tiled-toronto-map">Tiled Toronto map</Link>{" "}
                &mdash; the same model carried to city scale on pre-rendered
                SVG tiles.
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
