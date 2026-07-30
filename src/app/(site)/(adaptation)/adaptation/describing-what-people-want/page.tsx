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
              judgement above the
              judgement of the person living the life, which is the
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
              the
              smallest type that may be set, which input channels are
              available. Written out like that it sounds like
              permission being granted. It is not. The property is
              somebody&rsquo;s account of what a person appears able to
              do, and an account permits nothing and forbids nothing.
              What may happen is downstream of it, decided by whatever
              reads it.
            </p>
            <p>
              Choosing happens in preference, and that is what
              separates the two. Neither is a subset of the other and
              neither bounds the other. One is an attempt at describing
              what somebody appears able to do. The other is what they
              want done.
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
            <h2>Open questions</h2>
            <p>
              None of this is built. These are the decisions I can see
              from here, recorded before they get made by accident.
            </p>
            <p>
              <strong>Ranking, or strength?</strong> Audio ahead of
              vision is naturally an ordered list rather than a number.
              Asking somebody to put three channels in order is
              answerable. Asking how strongly they prefer audio, on a
              scale, walks straight back into the pseudo-precision the
              capability model has just been dug out of.
            </p>
            <p>
              <strong>How open should tools and settings be?</strong>{" "}
              They are unbounded, and always trailing whatever
              technology the person or whoever profiled them happens to
              know about. I think that is tolerable here and was only
              intolerable in a capability model, so I would hold them
              as opaque names and values and deliberately not model
              them. That is a decision rather than an obvious default.
            </p>
            <p>
              <strong>
                Does the model record what the system would have
                chosen?
              </strong>{" "}
              It has to, if an override is going to be readable as
              evidence rather than noise. That means holding the
              inferred default and the actual choice as two separate
              facts, which is more machinery than a preference store
              would otherwise need.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
