import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Describing what people want",
};

export default function DescribingWhatPeopleWant() {
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
            <h1>Describing what people want</h1>
            <p className="lede">
              A capability model says what a person is able to do. It
              says nothing about what they would rather, and those are
              different questions with different answers. This is the
              other half, and the half where the person, not the
              model, has the last word. A companion to{" "}
              <Link href="/adaptation/describing-people-to-computers">
                describing people to computers
              </Link>
              .
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The user, the profile, and the preference</h2>
            <p>
              Three things are in play whenever a system adapts: the
              person, what the profile says about them, and what they
              have asked for. Only the first of those has any
              authority. A capability profile is an inference about
              somebody, assembled from whatever could be observed or
              asked, and inferences are wrong sometimes.
            </p>
            <p>
              My master&rsquo;s work looked at the accessibility of
              mobile devices, back when they still had physical
              keyboards. Working with a person who has Multiple
              Sclerosis as a test subject, I went through a large
              number of cellphones looking for one that suited them.
              The one they selected had neither the largest keys nor
              the largest text. It had blue backlit keys and clear
              audio confirmation of each press, and they reported that
              the illuminated characters were easier to read given how
              the light changed through their own home.
            </p>
            <p>
              A capability model does not predict anything. People do.
              Given the profile I had recorded for that person using
              mine, I would not have predicted that choice: I would
              have expected the largest keys and the largest text. What
              decided it was the backlighting, and how that met the
              light in one particular home, and the model gave me
              nowhere to record either.
            </p>
            <p>
              I read that as a limit rather than an oversight. A
              profile describes somebody from outside, and some of what
              determines whether a thing works for them sits in the
              room with them. That is the reason I would treat a
              profile as a description rather than a finding.
            </p>
            <p>
              So the profile advises and the person decides. If someone
              wants lower contrast than the profile would suggest, or
              smaller text, or an audio metaphor that looks unlikely to
              serve them, that is their choice and the system&rsquo;s
              work is to honour it. A tool may reasonably warn that a
              setting is an unusual one for that profile, and it
              probably should. A tool that refuses has put its own
              judgement above the judgement of the person living the
              life, which is the
              medical model arriving by a side door: a system deciding
              what somebody ought to want on the strength of what it
              believes about their body.
            </p>
            <p>
              Holding both halves is what makes the disagreement worth
              something. When somebody consistently chooses against
              what the profile would suggest, that is worth reading as
              a question about the profile: whether it is wrong, or
              whether something it never captured is doing the work. A
              system that recorded the override as user error would be
              discarding something it could have learned from.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Capability describes, preference chooses</h2>
            <p>
              Capability describes, and that is the whole of it. A
              capability model is an attempt to describe one person,
              or generically the typical capabilities of an identified
              group of people, and it has no authority beyond that
              attempt.
            </p>
            <p>
              Capability properties <em>drive</em>{" "}
              decisions about what may happen: which channels may carry
              text to the user, which hues and tones may carry meaning,
              the smallest type that may be set, which input channels
              are available. Written out like that it sounds like
              permission being granted. It is not. The property is
              somebody&rsquo;s account of what a person appears able to
              do, and an account permits nothing and forbids nothing.
              What may happen is downstream of it, decided by whatever
              reads it.
            </p>
            <p>
              Choosing happens through preference, or through the
              application of selection rules where no preference has
              been stated. Either way it is not capability doing it.
              Neither model is a subset of the other and neither bounds
              the other. One is an attempt at describing what somebody
              appears able to do. The other is what they want done.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Four kinds of preference</h2>
            <p>
              The 2009 model treats preference generically. Working
              through it again in 2026, I think there are four distinct
              kinds, and they sit at different levels of abstraction.
              That layering is the structure rather than untidiness:
              the first choice is which sense to use at all, and the
              last is which piece of software, configured how.
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="Four kinds of preference"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Kind</th>
                    <th scope="col">Example</th>
                    <th scope="col">What capability already says</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Design space</th>
                    <td>
                      Audio ahead of vision. Tactile wherever it is
                      available.
                    </td>
                    <td>
                      Which channels can carry text to this person at
                      all.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Modality</th>
                    <td>Keyboard ahead of mouse.</td>
                    <td>
                      Which input channels are available, and from
                      which part of the body.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Properties of perception</th>
                    <td>
                      Blue text on a cream background. A particular
                      typeface. A minimum size.
                    </td>
                    <td>
                      Which hues and tones can carry meaning, and the
                      smallest type that resolves.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Tools and settings</th>
                    <td>
                      This screen reader, at this speech rate, in this
                      context.
                    </td>
                    <td>
                      <strong>Nothing.</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              That last row is the interesting one. A tool is a
              solution, and a capability model has nowhere to put a
              solution, which is exactly why AccessForAll&rsquo;s
              personal needs and preferences jarred when they were
              recorded as need. The information was never wrong. It was
              filed in the wrong place. Give preference a model of its
              own and the same data goes in without distortion, which
              is the resolution of an objection I have been making
              since 2009.
            </p>

            <h3>Two shapes, four categories</h3>
            <p>
              The four have to be reachable in one consistent way or
              the model has four sub-models rather than one. What makes
              that work is that only two shapes are needed. Some
              preferences are an <em>order</em>: sonic before visual,
              keyboard before pointer. Others are a{" "}
              <em>value</em>: a size, a typeface requirement, a named
              tool with its settings. Everything in all four categories
              is one or the other.
            </p>
            <p>
              An order is deliberately partial. Saying sonic comes
              before visual says nothing whatever about touch, and
              nobody should have to rank everything in order to state a
              view about something. So an unranked entry reads as{" "}
              <em>no view</em>, which is not the same as last. A system
              that treated the two alike would be inventing an opinion
              nobody expressed.
            </p>
            <p>
              One case forced a distinction I had missed. Reading along
              with speech wants text and audio{" "}
              <em>at the same time</em>, carrying the same content, and
              no ordering can say that. An order means one as a
              fallback for the other. That is a set, not a ranking, and
              the two are different statements about how somebody wants
              to work.
            </p>
            <p>
              Tools take the value shape, and a tool is a named thing
              with typed properties: the tool is the key, its settings
              are the parts, and each part carries its own type. A
              speech rate is checked as strictly as anything else in
              the model. Naming a tool without setting all of its
              controls is the ordinary case and is not an omission.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A preference is not unconditional</h2>
            <p>
              Preferences come with rules about when they apply. A
              screen reader on a phone and a magnifier on a desktop is
              one person with two preferences, each holding under
              different conditions, and neither of them wrong.
            </p>
            <p>
              That is the same shape as the external influences and
              setting groups on the capability side, so I would use the
              machinery that is already there rather than invent a
              second one. A preference names the conditions it applies
              under, in the same vocabulary a setting group uses.
            </p>
            <p>
              It also settles the objection about duplication properly.
              The reason a preference set had to be copied per context
              was that the context was baked into the copy. Qualify the
              preference by context instead, and the person is written
              down once.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>One choice, several consequences</h2>
            <p>
              The four categories descend from the widest choice to the
              narrowest, and that ordering earns its keep because a
              choice near the top implies choices below it. Somebody
              who asks for help with text perception has, in effect,
              said things about letterforms and spacing they never
              enumerated, and would not thank anyone for making them
              enumerate.
            </p>
            <p>
              That is one preference stated, and these follow from it:
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="What one stated preference implies"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">What follows</th>
                    <th scope="col">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Senses used together</th>
                    <td>Visual and sonic, reading along.</td>
                  </tr>
                  <tr>
                    <th scope="row">What the typeface must manage</th>
                    <td>
                      b and d, p and q not reflections of each other.
                      1, l and I told apart. Open apertures. No
                      decorative forms.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Contrast</th>
                    <td>Softened.</td>
                  </tr>
                  <tr>
                    <th scope="row">Spacing</th>
                    <td>
                      More air between letters, between words, and
                      between lines.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Two of those are worth stopping on. The typeface entry is
              not a font. It is what a font has to do, which means the
              requirement outlives any particular face not being
              installed, and choosing an actual one becomes a decision
              a renderer makes against what it has.
            </p>
            <p>
              And the contrast entry is <em>softened</em>. A capability
              record showing unimpaired contrast sensitivity would
              suggest strong contrast is perfectly fine, and for a
              great many people strong contrast is exactly what makes
              text swim. The preference asks for less, the model knows
              which capability it sits beside, and it is bounded by it
              in neither direction. That is the same argument as the
              cellphone, small enough to fit in a table row.
            </p>

            <h3>Following through is not deciding</h3>
            <p>
              Working a choice out on somebody&rsquo;s behalf is a step
              away from deciding for them, so two rules hold it apart.
            </p>
            <p>
              <strong>Nothing inferred overwrites anything stated.</strong>{" "}
              Where a person has said what they want, their answer
              stands and the rule&rsquo;s answer is kept beside it
              rather than thrown away. Somebody who asked for help with
              text perception and separately asked for maximum contrast
              gets maximum contrast, and the record still shows that a
              rule would have softened it. That disagreement is
              information about the rule.
            </p>
            <p>
              <strong>Everything records where it came from.</strong>{" "}
              A value is either something the person said or something
              worked out from something they said, and the two are
              never merged. That matters beyond bookkeeping: when the
              high-level choice changes, everything drawn from it is
              stale and has to be drawn again, and nothing could tell
              which values those were unless it had been written down
              at the time.
            </p>
            <p>
              There is a third rule that is really about restraint. The
              cascade only ever runs downward, from something a person
              chose. Nothing infers a high-level preference from a
              capability record. A system that decided somebody wanted
              help with text perception on the strength of what it
              believed about them would be labelling them, and that is
              the practice this whole model exists to avoid.
            </p>
            <p>
              So a value in a resolved profile arrived in one of three
              ways: the person stated it, a rule inferred it from
              something they stated, or nothing was stated at all and a
              selection rule decided. All three are legible, and only
              the first two belong to the person.
            </p>
            <p>
              One naming decision sits underneath all of it. The
              preference is called help with text perception rather
              than anything about dyslexia, because a preference is
              something a person chooses and its name should be a
              phrase they would use. A condition name labels whoever
              picks it. My own first suggestions, high-legibility
              reading and letter-shape clarity, were no better: they
              are this profession&rsquo;s vocabulary wearing a
              user-facing disguise.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Accessibility in the subjunctive</h2>
            <p>
              Almost none of this work is written in the indicative.
              Guidance says what a page should have. A capability
              record is an attempt at what somebody appears able to do.
              A preference says what they would rather. Not one of
              those describes a state of affairs that exists, and the
              grammar is not incidental to the subject.
            </p>
            <p>
              What follows is that an adapted interface has no single
              actual form. It has a space of forms, and which one
              appears depends on who arrives, what they have asked for
              and where they are standing. Capability and preference
              modelling is how that space gets described. Subjunctive
              interaction experiences seems to me a fair name for what
              comes out of it, and a more honest one than talking about
              the interface as though there were only ever going to be
              one.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What is built, and what is not</h2>
            <p>
              The schema exists, with the four categories in one key
              space, the two shapes, and validation that refuses a
              wrong type while accepting an unwelcome choice. The
              inference above runs. Rules are written in the same
              executable language the capability model uses for its
              derived values, so an inference is a declared, traceable
              expression rather than something happening to people out
              of sight.
            </p>
            <p>
              Three questions I recorded before building are now
              answered, and the answers were not all the ones I
              expected.
            </p>
            <p>
              <strong>Ranking rather than strength.</strong> Ordering
              three channels is answerable; rating how strongly you
              prefer audio, on a scale, walks straight back into the
              pseudo-precision the capability model was just dug out
              of. Orders it is, and partial ones.
            </p>
            <p>
              <strong>Tools are modelled, not opaque.</strong> I
              expected to hold them as unstructured names and values,
              on the grounds that any list of tools trails whatever
              technology somebody happens to know about. A named tool
              with typed properties turned out to cost nothing and to
              catch real mistakes, and the openness I was worried about
              is about which tools exist, not about whether a speech
              rate should be a number.
            </p>
            <p>
              <strong>
                Provenance, rather than a parallel record of what the
                system would have chosen.
              </strong>{" "}
              I had thought the model would need to store the rule
              output alongside the actual choice as two separate
              facts. Recording where each value came from does the same
              work more cheaply, and keeping the overruled inference
              beside it covers the case I actually cared about.
            </p>
            <p>
              What is not built: nothing yet enforces at run time that
              a rule only writes the preferences it declared, which the
              capability side already does for its actions and which
              wants doing before there are many rules. Conditions on
              preferences are designed and not written. And no rule yet
              infers anything in the modality category, so that one is
              populated but untested by use.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
