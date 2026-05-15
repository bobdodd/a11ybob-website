import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";

export default function FrameworkPage2029() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <ResearchSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>The 2029 framework</h1>
            <p className="lede">
              Accessibility as multi-agent communities of practice
              with formal equilibrium dynamics. The next research
              step explicitly named in the 2013 thesis conclusion,
              paused because the implementation tools didn&rsquo;t
              exist, and resumable now that practical agentic AI has
              arrived.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What the framework claims</h2>
            <p>
              Accessibility is not a binary pass/fail and not a
              static property of either system or user. It is an{" "}
              <strong>emergent dynamic equilibrium</strong> in a
              contextual space of competition between five factors:
            </p>
            <ul>
              <li>environmental factors,</li>
              <li>technical constraints,</li>
              <li>user capability,</li>
              <li>user preference, and</li>
              <li>
                available UI resources and modalities (the limited
                resource).
              </li>
            </ul>
            <p>
              The framework requires <strong>agency</strong> for each
              factor — each must be able to advocate, negotiate, and
              respond.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The published seed (2006)</h2>
            <p>
              The framework was first named in print in the 2006
              short paper:
            </p>
            <blockquote>
              <p>
                <em>
                  &ldquo;If the role of each agents involved in
                  interface construction is definable then a
                  definition of (at least) intrinsic accessibility
                  using formal methods and game theory should be
                  possible.&rdquo;
                </em>
              </p>
            </blockquote>
            <p>
              The 2013 thesis conclusion named the same step,
              explicitly:
            </p>
            <blockquote>
              <p>
                <em>
                  &ldquo;That competition, I would suggest, would be
                  best considered through the use of game theory ...
                  whether the mathematical formalism my research
                  requires will be found in models of autonomous
                  agents.&rdquo;
                </em>
              </p>
            </blockquote>
            <p>
              In 2006, the theory was understood; the compute was
              not. In 2013, the formalism was clearer; autonomous-
              agent implementations remained academic toys. With
              practical agentic AI now available, the implementation
              tools have caught up. This is the line — the 2029
              project is the resumption of explicitly-named research,
              not a hobby waiting for retirement.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why competition alone is the wrong frame</h2>
            <p>
              &ldquo;Game theory and autonomous agents&rdquo; alone
              undersells the framing. The earlier{" "}
              <Link href="/research/the-measure-of-accessibility/communities-of-practice">
                Communities of Practice
              </Link>{" "}
              chapter had the deeper move: agents are not just
              competitors, they are members of a community of
              practice with collaboration, role-playing, shared
              enterprise, and memetic learning.
            </p>
            <p>
              Today&rsquo;s multi-agent vocabulary (auctions,
              negotiations, marketplaces, multi-agent reinforcement
              learning) is <em>competition-shaped</em>. The CoP
              framing is <em>collaboration-and-learning-shaped</em> —
              agents tuning their relations, learning collectively,
              holding shared identity, migrating between roles. Same
              agents; richer model. The contemporary agentic-AI
              literature is mostly the first half. The second half —
              communities of practice with multi-agent dynamics — is
              materially open.
            </p>
            <p>
              Whether the game is cooperative or non-cooperative is
              the wrong question. The actual question is{" "}
              <em>
                how do agents in a community of practice negotiate
                competition for resources while sustaining the shared
                enterprise that makes the cooperation valuable in the
                first place?
              </em>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The roadmap</h2>
            <p>
              The 2029 project is the resumption of named research:
              applying the named-in-thesis-conclusion theoretical
              framework to accessibility, using agentic AI as the
              implementation substrate that wasn&rsquo;t available in
              2013, and explicitly carrying both the game-theoretic
              competitive dimension and the CoP collaborative-and-
              learning dimension.
            </p>
            <p className="muted">
              <small>
                This page is the public roadmap. Specific framings,
                prior-art surveys, and any associated publications
                will be added as that work resumes.
              </small>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/research/the-measure-of-accessibility/communities-of-practice">
                  The Measure of Accessibility &mdash; Communities of
                  Practice
                </Link>{" "}
                — the deeper substrate this framework rests on.
              </li>
              <li>
                <Link href="/research/the-measure-of-accessibility">
                  The Measure of Accessibility
                </Link>{" "}
                — the formal-theory collection that scaffolds the
                whole position.
              </li>
              <li>
                <Link href="/research/shlaer-mellor-lens">
                  The Shlaer-Mellor lens
                </Link>{" "}
                — the methodological substrate.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
