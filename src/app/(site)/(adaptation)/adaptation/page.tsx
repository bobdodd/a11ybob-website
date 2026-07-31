import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Adaptation",
};

export default function Adaptation() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Adaptation</h1>
            <p className="lede">
              Adapting an application to its user, rather than asking
              the user to adapt to the application. This section
              carries the practical line of my{" "}
              <Link href="/research/cisna-model">CISNA</Link> work:
              applications built over an abstract model of themselves,
              rendered per user by services the application is willing
              to wait for.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Describing people to computers</h2>
            <p>
              Software that adapts to a person has to understand the
              capacity of the user to interact with it, and the
              specific capabilities of that user together with any
              preferences they may have. That description is the part
              the field has mostly avoided. A companion to my 2009
              paper{" "}
              <em>User Capability in an Adaptive World</em>, rebuilt
              against eighteen worked profiles and surveyed against
              what else now exists: why a preference is not a
              capability, what a system actually needs to know, and
              what the model still cannot say.
            </p>
            <p>
              <Link href="/adaptation/describing-people-to-computers">
                Read the capability model
              </Link>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Describing what people want</h2>
            <p>
              The other half. A capability model says what a person is
              able to do and says nothing about what they would rather,
              and conflating the two is how adaptive systems come to be
              resented. Four kinds of preference, the rules that decide
              when each applies, and the reason the model advises while
              the person decides: a cellphone selected by a test
              subject during my master&rsquo;s research had neither the
              largest keys nor the largest text, and I would not have
              predicted it from the profile I had recorded for them.
            </p>
            <p>
              <Link href="/adaptation/describing-what-people-want">
                Read the preference model
              </Link>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Personas, and what they are missing</h2>
            <p>
              Personas are how most teams talk about users, in accessibility
              work and well beyond it, and they have carried an unanswered
              objection since 2006: a persona is a fiction, so nothing can show
              it to be wrong. A study two years later put numbers on the
              consequence, finding that the more richly a persona is described,
              the fewer real people it matches. What personas are, what the
              research says, and where a capability model helps: it supplies
              the checkable substrate the method has always lacked, and it does
              nothing at all for the two things personas are genuinely good at.
            </p>
            <p>
              <Link href="/adaptation/personas">Read the analysis</Link>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Accessible Tetris</h2>
            <p>
              A case study from my doctoral research, revisited: what
              it means for Tetris to be accessible. Not a claim of a
              finished accessible game, but an exploration of design
              method and interaction modalities, with working examples
              of techniques, from sonic metaphors and a first-person
              listening stage to state models whose game clock waits
              for the user. It closes with the design for a web-based
              demonstrator built on the spatial audio modern browsers
              deliver natively.
            </p>
            <p>
              <Link href="/adaptation/accessible-tetris">
                Read the case study
              </Link>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where this connects</h2>
            <p>
              The theory behind this section lives in Research:{" "}
              <Link href="/research/cisna-model">the CISNA Model</Link>{" "}
              (the five-layer model of accessible adaptive hypermedia
              these case studies express), and{" "}
              <Link href="/research/tetris-testbed">
                Tetris as accessibility testbed
              </Link>
              , on why this game in particular earns its keep as a
              research vehicle.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
