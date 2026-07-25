import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";

export const metadata: Metadata = {
  title: "TUP — adaptive thumbwheel text input",
};

export default function SpotlightTUP() {
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
                <Link href="/research/spotlight">
                  &larr; Spotlight projects
                </Link>
              </small>
            </p>
            <h1>TUP &mdash; adaptive thumbwheel text input</h1>
            <p className="lede">
              An iPodLinux reimplementation of Transparent
              User-guided Prediction with two pieces of original
              engineering on top: a finite-state machine handling
              the woodpecker effect of hand tremor and the 
              sliding-touch problem of reduced cutaneous sensitivity, and an
              adaptive wheel display that puts the predicted letter
              under the user&rsquo;s finger rather than asking them
              to reach for it.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The person</h2>
            <p>
              The design target was Bob&rsquo;s cousin, who has
              Multiple Sclerosis. By the early 2000s the cousin&rsquo;s
              hand control was deteriorating but not yet at the
              point where a switch-scanning system was necessary; he
              could still use a touch device, but with two specific
              input failures. Bob&rsquo;s mother, who has arthritis,
              also informed the work: she found typing on mobile
              devices painful, and the design target became
              reducing finger motion <em>and</em>{" "}making each
              contact tolerant of imprecision.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The constraint</h2>
            <p>
              The two specific input failures named above:
            </p>
            <ul>
              <li>
                <strong>The woodpecker effect</strong>{" "}&mdash;
                hand tremor producing repeated brief contacts that
                the touch surface registered as a sequence of
                rapid presses, when only one was intended.
              </li>
              <li>
                <strong>Sliding from numbness</strong>{" "}&mdash;
                reduced cutaneous sensitivity meaning the user
                pressed without knowing how hard, and the finger
                could be pushed slightly during the press,
                landing somewhere other than the original contact
                point.
              </li>
            </ul>
            <p>
              The era was the original Apple iPod. The original TUP
              &mdash; Transparent User-guided Prediction, by
              Proschowsky, Schultz, and Jacobsen at CHI 2006 &mdash;
              was published with characters at <em>fixed</em>{" "}
              positions on the touch wheel and a prediction
              algorithm that adjusted which character got{" "}
              <em>highlighted</em>{" "}based on where the finger landed.
              Their accessibility nod was a single throwaway
              sentence: <em>&ldquo;the method might also be useful
              for disabled persons. By placing an angle detector on
              a joint, the person will be able to highlight a
              character.&rdquo;</em>{" "}Fast for typical users; nothing
              about tremor, sliding, or low-vision constraints.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The insight</h2>
            <p>
              Don&rsquo;t make the user reach for the predicted
              character. <em>Adapt the wheel so the predicted
              character is already under the finger.</em>
            </p>
            <p>
              In Bob&rsquo;s reimagining, the letter A was fixed at
              the top of the wheel as a reference; the rest of the
              alphabet was variable. As the user moved their finger
              around the wheel, a dot on a circle indicated the
              current position, and the currently-selected letter
              was shown on screen at large size, rather than tiny
              text on the wheel itself. The TUP prediction algorithm
              put the predicted letter directly under the user&rsquo;s
              finger initially; the user moved only if the
              prediction was wrong, and even then by a small
              amount.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The artefact</h2>
            <p>
              A C-language reimplementation of TUP running on
              iPodLinux &mdash;{" "}
              <em>
                &ldquo;yes, Linux ran on iPODs despite Apple&rsquo;s
                best efforts to stop it&rdquo;
              </em>{" "}
              &mdash; with two pieces of original engineering on top
              of the inverted-wheel concept:
            </p>
            <ol>
              <li>
                A <strong>finite state machine</strong>{" "}modelling
                user input, designed specifically to handle the
                woodpecker effect (multiple brief contacts treated
                as one intentional press) and the 
                sliding-from-numbness problem (a press that drifts is
                interpreted as the original landing point, not the
                drift).
              </li>
              <li>
                The <strong>adaptive wheel display</strong>{" "}with
                the large on-screen letter, designed for low-vision
                users (also relevant to MS, which can affect 
                optic-nerve function).
              </li>
            </ol>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The teaching</h2>
            <p>
              Predictive systems should reduce <em>motion</em>, not
              just suggest letters.
            </p>
            <p>
              The standard predictive-text framing &mdash;{" "}
              <em>we&rsquo;ll guess what you want and you
              confirm</em>{" "}&mdash; assumes confirmation is cheap.
              For users with MS or arthritis, every motion has cost.
              The right design question is therefore not{" "}
              <em>how can we suggest the right letter?</em>{" "}but{" "}
              <em>
                how can we put the right letter where the user
                already is?
              </em>{" "}
              Different question, different solutions, different
              metrics.
            </p>
            <p>
              <em>
                &ldquo;If I say so myself, quite clever for its
                day.&rdquo;
              </em>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The longer arc</h2>
            <p>
              TUP turned out to be a prototype of the formal
              capability model that came later. The Capability Set
              vocabulary in the doctoral framework lists haptic
              properties &mdash; <code>landingZone</code>,{" "}
              <code>guardZone</code>, <code>multiFingerTouch</code>,{" "}
              <code>interTouchGap</code>, <code>minTouchTime</code>,{" "}
              <code>typicalButtonPressRate</code>,{" "}
              <code>constantTouching</code>,{" "}
              <code>touchAStaticPoint</code>,{" "}
              <code>touchAMovingPoint</code>{" "}&mdash; that are
              precisely what TUP&rsquo;s 
              woodpecker-and-sliding-touch FSM was modelling at the engineering level
              years before the framework existed. The ad-hoc
              engineering of TUP became the formal haptic capability
              template; the persona who appears in the framework as
              a 45-year-old British male with progressive MS, hand
              tremors, no kinaesthetic sensing, fatigue-driven voice
              degradation, a measured 30&times;40 pixel landing zone
              and 80&times;80 pixel guard zone on a bad day, is
              TUP&rsquo;s design problem written down in the
              framework&rsquo;s vocabulary.
            </p>
            <p>
              The same person who motivated the engineering moved,
              over the years that followed, from thumbwheel input
              to a scanner-and-jelly-bean switch system for menu
              selection of household tasks &mdash; open door, close
              curtains, TV on, TV off. The design problem
              evolved with the user; the framework that grew out of
              the engineering was shaped by years of tracking that
              evolution.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The coda</h2>
            <p>
              A working tool, used. Not productised; not
              academically published as a separate paper; the work
              fed into the broader doctoral framework. Significant
              as an early data point in a longer pattern: an
              underspecified accessibility footnote in someone
              else&rsquo;s HCI paper, taken seriously and turned
              into the actual research question.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
