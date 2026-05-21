import Link from "next/link";
import type { CSSProperties } from "react";
import { ResearchSubNav } from "@/components/ResearchSubNav";

export default function SpotlightSign16() {
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
            <h1>Sign16</h1>
            <p className="lede">
              A sign-writing system for mid-1990s feature phones,
              built for the gay Deaf community in Singapore in
              response to a challenge over drinks at the bar
              Tantric on a Friday night. The price of solving the
              problem was a beer.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The person</h2>
            <p>
              The challenge came from Bob&rsquo;s gay Deaf friends
              in Singapore in the mid-1990s. The complaint behind it
              was partially fair: most accessibility research at the
              time went to blind and low-vision users, or to
              mobility-impaired users; the Deaf and Hard-of-Hearing
              community got very little. Bob was challenged to come
              up with something. The agreed price was a beer.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The constraint</h2>
            <p>
              Mid-1990s Singapore had unusually early 3G cellphone
              adoption. The Deaf community used 3G video calling to
              sign peer-to-peer in real time, which solved
              synchronous communication beautifully. Asynchronous
              text on the same phones still required typing English,
              because no sign-writing system existed for cellphones.
              The era&rsquo;s SMS input ran on a 16-key keypad.
              Whatever a sign-writing system was going to be, it was
              going to have to fit there.
            </p>
            <p>
              The use case extended beyond chat. A Deaf student
              would watch an English lecture through a sign-language
              translator, see English slides, then be asked to take
              notes in English &mdash; a perpetual game of Telephone
              from English to Sign and back to English again.{" "}
              <em>&ldquo;It&rsquo;s mad, just mad.&rdquo;</em>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The insight</h2>
            <p>
              Bob couldn&rsquo;t sign &mdash; still can&rsquo;t,
              <em> &ldquo;only slightly encumbered by the fact
              that I can&rsquo;t sign.&rdquo;</em> The non-fluency
              turned out to be the key. From Bob&rsquo;s telling:
              <em>
                &ldquo;If you don&rsquo;t know what the signer is
                saying, the speech becomes performance, it becomes
                dance. So, maybe if I simply described what I saw,
                that would be a form of sign-writing?&rdquo;
              </em>
            </p>
            <p>
              Encoding the <em>form</em> of the sign rather than its{" "}
              <em>meaning</em> sidestepped the requirement to know
              any specific sign language. A signer would recognise
              their own actions in form-descriptions; the writer
              didn&rsquo;t need to know what the signs meant. The
              writer also didn&rsquo;t need to be a member of the
              signing community to build the tool, as long as the
              tool encoded what was visibly happening rather than
              what the visible thing meant.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The artefact</h2>
            <p>
              Sign16: 16 keys mapped to body parts and abstract
              movement primitives &mdash; <em>away</em>, <em>moving
              together</em>, and so on &mdash; with a custom font
              installed on the phone display so that the descriptions
              rendered as compact symbols rather than verbose
              English text. Some feature phones of the era allowed
              font installation even when they didn&rsquo;t allow app
              installation; that opening was what made the system
              shippable in the first place. A later extension for
              laptop keyboards used a richer symbol set and the same
              encoding principle.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The teaching</h2>
            <p>
              Two lessons from Sign16, both of which Bob carried
              forward.
            </p>
            <p>
              The first is that constraint-driven design produces
              solutions that freedom won&rsquo;t. Sixteen keys
              forced a productive simplification &mdash; body-part
              plus movement-primitive &mdash; that a richer input
              device would never have arrived at. The simplification
              was not a compromise on what the system could do; it
              was the structural insight that let it do anything at
              all.
            </p>
            <p>
              The second is that the writer of an accessibility tool
              does not have to be a member of the community the tool
              is for, as long as the tool encodes form rather than
              meaning and the community can read its own behaviour
              back from it. That is a stricter design discipline
              than it sounds: it rules out making implicit
              assumptions about what the community already
              understands, and it forces the encoding to be
              behavioural rather than semantic.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The coda</h2>
            <p>
              Bob won the beer.{" "}
              <em>
                &ldquo;The guys continued to sign to each other on
                their phones like it never happened.&rdquo;
              </em>{" "}
              Worth keeping verbatim &mdash; it is a self-aware
              ending to a story about a tool that solved a problem
              its users didn&rsquo;t quite have.
            </p>
            <p>
              A side observation that earns its place: Tantric on a
              Friday evening was loud and crowded, and ordering
              drinks at a packed bar is hard. For the Deaf friends,
              less so &mdash; one of them worked behind the bar, so
              they would simply sign their order over the heads of
              the people in front, and by the time they pressed
              through to the front, the drinks were ready.
              Accessibility research rarely surfaces the moments
              where the disabled approach is the{" "}
              <em>advantageous</em> one.{" "}
              <em>
                &ldquo;Sign is the greatest gift to a young person
                who likes to go clubbing.&rdquo;
              </em>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
