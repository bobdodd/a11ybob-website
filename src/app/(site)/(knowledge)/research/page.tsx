import Link from "next/link";
import type { CSSProperties } from "react";

export default function Research() {
  return (
    <main id="main" className="site-main" data-zone="knowledge">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s3)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Research</h1>
            <p className="lede">
              Three pieces of original conceptual work, all developed
              during doctoral research at Teesside between 2004 and 2013,
              and one forward-looking framework that needed agentic AI to
              test.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The Carnforth Model of Accessible Adaptive Hypermedia</h2>
            <p>
              Published at W4A 2010, with Steve Green and Elaine Pearson.
              Rebuilds the Dexter Model of hypertext for an era of
              script-heavy, AJAX-driven content, distinguishing five
              abstractions: content, inventory, semantics, navigation, and
              adaptation.
            </p>
            <p>
              The Carnforth Model is the first piece of doctoral work that
              has stayed live since 2010. It shapes how the article archive
              is structured today — particularly the separation of content
              from semantics from adaptation, which lets the same review
              data drive several reading surfaces.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Polymorphic Task Deconstruction</h2>
            <p>
              A way of describing multiple manipulations of the same data
              — direct manipulation versus modal dialogue, voice versus
              gesture, full-screen versus assistive overlay — so a
              capability model can choose the most appropriate route for
              the user&rsquo;s circumstances. PTD is the part of the
              doctoral framework that most directly informs the analyser
              work in <Link href="/paradise">Paradise</Link>: it is what
              gives the analyser a vocabulary for &ldquo;there are several
              valid ways to express this; pick one.&rdquo;
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Tetris as accessibility testbed</h2>
            <p>
              The most teachable artefact of the doctoral period. Tetris
              carries the right complexity for accessibility analysis: six
              tile types, four orientations, the silhouette-recognition
              problem at the bottom of the well, the next-tile preview, the
              held-tile, multi-line scoring, increasing tempo. Everything
              an accessibility researcher needs to test — vision, audition,
              motor, cognitive, timing — but with a frame anyone tracks.
            </p>
            <p>
              <em>
                You could go to a conference, talk about Tetris, and people
                understand where you are. Then you start talking about how
                someone with hand tremors plays it.
              </em>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Accessibility as game-theoretic equilibrium (2029)</h2>
            <p>
              The original theoretical contribution and the forward-looking
              framework. Accessibility is treated not as a binary pass/fail
              and not as a static property of either system or user, but as
              an emergent dynamic equilibrium in a contextual space of
              competition between five factors: environmental constraints,
              technical constraints, user capability, user preference, and
              the available UI resources and modalities. Each factor must
              be able to advocate, negotiate, and respond — that is, must
              have agency.
            </p>
            <p>
              In 2006, when the framework was first developed, intelligent
              agents were understood theoretically but the compute was not
              there. With practical agentic AI in the last eighteen
              months, the implementation tools have caught up. The plan is
              to take this work back up in 2029. Whether the game is
              cooperative or non-cooperative remains an open question.
            </p>
            <p className="muted">
              <small>
                This page is the public roadmap for the 2029 work. Specific
                framings, prior-art surveys, and any associated
                publications will be added as that work resumes.
              </small>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
