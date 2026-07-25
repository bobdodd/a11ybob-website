import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";
import { MeasureSubNav } from "@/components/MeasureSubNav";

export const metadata: Metadata = {
  title: "6. Communities of Practice",
};

export default function CommunitiesOfPractice() {
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
            <p>
              <small>
                <Link href="/research/the-measure-of-accessibility">
                  &larr; The Measure of Accessibility
                </Link>
              </small>
            </p>
            <h1>6. Communities of Practice</h1>
            <p className="lede">
              <em>
                If a user interface can be described as a community
                of practice, then an inaccessible user interface is
                a dysfunctional community.
              </em>
            </p>
          </header>

          <MeasureSubNav />

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why this page closes the collection</h2>
            <p>
              The previous five pages give a position. Page 1 sets
              the political character of the question. Pages 2 and
              3 give formal definitions of functional and intrinsic
              accessibility. Page 4 names the cost-aware analysis
              that holds the formal definitions honest. Page 5
              gives the methodological substrate that lets the
              formal definitions be built rather than just stated.
            </p>
            <p>
              Page 5 ends with the structure: domains, bridges,
              compilers, the recursive-design frame. This page asks
              what is <em>happening</em>{" "}in that structure. The
              actors inside the structure are not passive
              compositional units; they play roles, they
              collaborate, they compete, they learn. Treating them
              as a community of practice rather than as a
              compositional graph names the dynamics that the
              recursive-design frame leaves implicit. Those
              dynamics are also the bridge to the multi-agent
              framing that the{" "}
              <Link href="/research/2029-framework">
                2029 framework
              </Link>{" "}
              resumes.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The user interface as a community of practice</h2>
            <p>
              A community of practice, in Wenger&rsquo;s sense, is
              a group of actors playing roles in a shared
              enterprise, with collaboration, learning, identity,
              and shared repertoire as the binding forces. The
              pattern was developed for analysing professional
              groups &mdash; midwives, claims processors, Naval
              quartermasters &mdash; but it generalises in
              interesting ways to other actor-collections, including
              the components of a running interface.
            </p>
            <p>
              At least nine entities can be named as actors in the
              ordinary user interface: the User Capability Context
              (what the user can do in the body and the moment),
              User Preference (what the user has chosen to ask
              for), the Content Provider (the source of the
              underlying material), the Content Manager (which
              material is currently in scope), the Content Presenter
              (how the material is rendered), Custom &amp; Practice
              (the convention that says &ldquo;forms look like
              this&rdquo;), Cultural Context (the convention that
              says &ldquo;red means danger&rdquo;, or
              &ldquo;red means luck&rdquo;, depending on where you
              are), the Device Capability Context (what the device
              can do), and the Operational Context (where the user
              is, what time it is, who else is around).
            </p>
            <p>
              Each of these has what Wenger would call an{" "}
              <em>identity</em>{" "}in the community &mdash; a stable
              role and a characteristic pattern of contribution.
              Custom &amp; Practice is the damping factor, pulling
              every interface toward rectangular grids and visual
              metaphors regardless of the user-platform. Cultural
              Context is the guardian of meanings, intervening
              when the Content Presenter would otherwise commit a
              cultural error. User Preference is the king the whole
              enterprise exists to serve, and the actor whose
              objections, when they appear, are the most expensive
              to override. The roles are not symmetrical, and the
              asymmetries themselves carry meaning.
            </p>
            <p>
              The shared enterprise is straightforward: provide
              content and collate feedback between device and user.
              Every actor contributes to that enterprise, by
              negotiation and by routine. The enterprise is the
              shared object that holds the community together.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>User populations as a community of practice</h2>
            <p>
              The same analysis applies one level up. The users of
              an interface, considered collectively, also form
              communities of practice &mdash; particularly when the
              users share a disability-relevant capacity profile and
              are connected through peer-group infrastructure
              (advocacy organisations, online forums, mutual-aid
              networks, family circles, professional bodies for
              accessibility practitioners). The RNIB, the RNID, the
              MS Society, and their international counterparts are
              communities of practice in this sense.
            </p>
            <p>
              The interesting consequence at this level is that{" "}
              <em>portable user profiles act as memes</em>. A
              configuration that one user finds works for them is
              shared with peers in the same community; the peers
              copy it with variation; the variations that work
              propagate further; the variations that don&rsquo;t
              get dropped. Peer-group infrastructure provides the
              selection pressure that makes profile evolution
              non-random. Disability communities, in this frame,
              act as evolutionary substrates for accessibility
              settings.
            </p>
            <p>
              That observation has a falsifiable consequence:{" "}
              <em>
                user interfaces that optimise user profiling to
                improve the evolutionary process will be more
                accessible than those that do not.
              </em>{" "}
              Profiles that propagate easily, that vary at the
              right granularity, and that recombine cleanly when
              users move between communities should produce
              accessibility outcomes that converge faster on
              good fits than profiles which stay siloed,
              unsharable, or coarse. The claim is testable; the
              experimental apparatus does not yet exist; the
              prediction is on the table.
            </p>
            <p>
              The reframe also shifts what &ldquo;accessible&rdquo;
              asks for. The narrow reading is{" "}
              <em>does this interface adapt to a given user
              profile?</em>{" "}The wider reading is{" "}
              <em>does this interface support the social processes
              by which good profiles emerge and spread?</em>{" "}An
              interface that nails the first while ignoring the
              second is helping each user in isolation; an
              interface that does both is helping the community
              learn.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Inaccessibility as community dysfunction</h2>
            <p>
              The reframe yields a useful definition by negation.
              If a working user interface is a functional community
              of practice, an inaccessible user interface is a
              dysfunctional one. Three modes of dysfunction recur,
              and each maps onto a class of accessibility failure
              that the formal definitions of pages 2 and 3 can
              detect but cannot diagnose.
            </p>
            <ol>
              <li>
                <strong>
                  Competition between actors for limited resources.
                </strong>{" "}
                The audio channel is finite; the screen real estate
                is finite; the user&rsquo;s attention is finite.
                When multiple actors want the same resource without
                a mechanism for arbitration, the resource is
                claimed by whichever actor gets there first, which
                is rarely the one with the strongest claim. The
                accessibility prompt loses to the marketing pop-up
                because the marketing pop-up was added last and
                runs first. The screen-reader announcement loses to
                the live-region update because the live region
                changes too often. Each individual collision is a
                bug; the pattern is a failure of the community to
                arbitrate. (This is also the failure mode that the{" "}
                <Link href="/research/the-measure-of-accessibility/the-shlaer-mellor-lens">
                  Shlaer-Mellor assigner state model
                </Link>{" "}
                exists to handle.)
              </li>
              <li>
                <strong>
                  Inappropriate power structures.
                </strong>{" "}
                The Content Presenter overriding User Preference
                is the canonical case &mdash; a developer fixes a
                font size into the stylesheet despite the user
                having set a different one in their browser; the
                Presenter has decided it knows better than the
                Preference. The reverse is rarer but exists: User
                Preference being permitted to override Cultural
                Context in ways that produce accidentally offensive
                output, or User Preference being permitted to
                override Custom &amp; Practice in ways that leave
                the user navigating an interface no other user
                would recognise. Both directions are governance
                failures: the wrong actor is making the call.
              </li>
              <li>
                <strong>
                  Inappropriate decision-making.
                </strong>{" "}
                The community needs models of its actors and
                feedback channels between them. When the models are
                missing, the loop is open. When the granularity is
                wrong &mdash; <em>all blind users can&rsquo;t
                see</em>, <em>all deaf users can&rsquo;t hear</em>,{" "}
                <em>all motor-impaired users use the same switch
                interface</em>{" "}&mdash; the decisions get made
                against a category that does not match the user.
                The user is the residual; their experience is the
                accident.
              </li>
            </ol>
            <p>
              All three failure modes are visible in current
              accessibility practice; all three are addressable in
              the recursive-design frame; all three become more
              tractable when you have a vocabulary for the
              community-of-practice dynamics. The formal
              definitions on pages 2 and 3 detect the failures;
              the community-of-practice analysis explains them.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Why competition-only agentic AI is the wrong frame</h2>
            <p>
              The current agentic-AI literature is 
              competition-shaped. Auctions, negotiations, marketplaces, 
              multi-agent reinforcement learning &mdash; all of them
              model the relationships between agents primarily as
              competition for scarce resources, with cooperation as
              an emergent equilibrium when the game permits it.
              That framing is plausible; it is also incomplete.
            </p>
            <p>
              The community-of-practice framing is 
              collaboration-and-learning-shaped. Agents do not just bid against
              each other for the audio channel; they tune their
              relationships, they learn collectively, they hold
              shared identity, they migrate between roles as the
              shared enterprise demands. Same agents; richer
              model. The contemporary literature has the first
              half of the story. The second half &mdash;
              communities of practice with multi-agent dynamics,
              applied to a domain where the shared enterprise
              actually means something &mdash; is materially open.
            </p>
            <p>
              Whether the game is cooperative or non-cooperative is
              the wrong question. The actual question is{" "}
              <em>
                how do agents in a community of practice negotiate
                competition for resources while sustaining the
                shared enterprise that makes the cooperation
                valuable in the first place?
              </em>{" "}
              That question is what the 2029 framework takes up.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where this points</h2>
            <p>
              Six pages, one position. Accessibility is political;
              functional and intrinsic accessibility are the
              formal measures of two distinct properties; equivalent
              experience is the cost-aware analysis that holds them
              honest; recursive design is the methodological
              substrate that makes the definitions buildable; and
              communities of practice name what is actually
              happening inside the structure once it is built.
            </p>
            <p>
              The point of the collection is not to settle the
              field. The point is to articulate a coherent position
              that is formally precise, methodologically grounded,
              and politically honest &mdash; one that a serious
              practitioner or a serious researcher can argue with,
              extend, or refute. The forward-looking work that
              flows from this position is the{" "}
              <Link href="/research/2029-framework">
                2029 framework
              </Link>
              ; the practical work that flows from it lives in{" "}
              <Link href="/paradise">Paradise</Link>; the
              substrate that makes both possible runs in code at{" "}
              <Link href="/playgrounds/action-language">
                Action Language
              </Link>
              .
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Continue</h2>
            <p>
              <Link href="/research/the-measure-of-accessibility/the-shlaer-mellor-lens">
                &larr; Previous: 5. The Shlaer-Mellor lens
              </Link>
              {" · "}
              <Link href="/research/2029-framework">
                See also: The 2029 framework &rarr;
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
