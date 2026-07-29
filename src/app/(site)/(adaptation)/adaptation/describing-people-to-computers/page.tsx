import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { NewTabLink } from "@/components/NewTabLink";

export const metadata: Metadata = {
  title: "Describing people to computers",
};

export default function DescribingPeople() {
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
            <h1>Describing people to computers</h1>
            <p className="lede">
              Software that adapts to a person has to understand the
              capacity of the user to interact with it, and the
              specific capabilities of that user together with any
              preferences they may have. That description is the hard
              part, and it is the part the field has mostly avoided.
              This is a companion to my 2009 paper{" "}
              <em>User Capability in an Adaptive World</em>, rebuilt
              in 2026 against eighteen worked profiles, with a survey
              of what else now exists.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Adaptation is impossible without a description of the person</h2>
            <p>
              An adaptive interface is one that changes to suit its
              user. Every discussion of how it should change skips
              past a prior question: change according to what? The
              system needs a description of the person on the other
              side of the screen, in terms it can act on.
            </p>
            <p>
              Almost all accessibility work addresses the other half.
              The Web Content Accessibility Guidelines describe
              properties a page should have. The Accessible Rich
              Internet Applications specification describes semantics
              a widget should expose. Both are descriptions of
              content. Neither says anything about the person, because
              both assume the person brings assistive technology that
              already knows what they need.
            </p>
            <p>
              That assumption holds for a screen reader and breaks for
              nearly everything else. A game cannot infer from a
              screen reader that its player has three degrees of gaze
              accuracy and needs two and a half seconds to confirm a
              selection. Somebody has to write that down.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>A preference is not a capability</h2>
            <p>
              The standard that does describe people is{" "}
              <abbr title="International Organization for Standardization">
                ISO
              </abbr>
              /
              <abbr title="International Electrotechnical Commission">
                IEC
              </abbr>{" "}
              24751, known as AccessForAll. It became a standard in
              2008 and is still the deployed one. It records a
              person&rsquo;s Personal Needs and Preferences: a screen
              reader, a speech rate, a Braille display, a set of
              display options.
            </p>
            <p>
              My 2009 paper made one objection to it, and seventeen
              years later I would make the same one. Consider a
              profile that says the user requires a screen reader.
              Does that person need a screen reader, or do they simply
              wish to use one? The profile cannot tell you, and the
              difference decides everything. A blind user has no
              alternative. A sighted user who prefers audio has
              several. A system that treats those two the same will be
              wrong about one of them, and it will never find out
              which.
            </p>
            <p>
              The deeper problem is that a preference records a
              solution rather than a requirement. It says which
              technology the person settled on, not what made them
              settle on it. When the technology changes, or the
              context changes, or the application offers something
              better, the profile is stale and nothing in it explains
              why.
            </p>
            <p>
              So the model I proposed records what a person can do,
              not what they have chosen. Its governing sentence has
              not changed:{" "}
              <strong>
                it is what the user can do, not why she cannot.
              </strong>{" "}
              Not the diagnosis, not the equipment, and not the
              accommodation. The capability.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What a system actually needs to know</h2>
            <p>
              The test for any property in this model is simple, and I
              only made it explicit in 2026 after finding I had
              drifted away from it. A property has to name a decision
              that a renderer, an input handler, or a content selector
              actually makes. If it cannot, it is a medical
              observation with a schema around it, however true it
              may be.
            </p>
            <p>
              Applying that test found three practical questions the
              model could not answer at all:
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="Three practical questions and how the model answers them"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">The question</th>
                    <th scope="col">Why it decides something</th>
                    <th scope="col">Answer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">How fast can you write?</th>
                    <td>
                      Below roughly ten words a minute, free text entry
                      stops being a feature and becomes an obstacle.
                      Offer prediction, stored phrases, or do not ask
                      for text.
                    </td>
                    <td>
                      <code>textEntryRate</code>, in words per minute
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">How big must a target be?</th>
                    <td>
                      Sets the smallest a control may be drawn. A toe
                      is not the same size as a finger, and the
                      difference is measurable.
                    </td>
                    <td>
                      <code>minTargetSize</code>, in millimetres
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      How many places can you touch at once?
                    </th>
                    <td>
                      One means every interaction is strictly
                      sequential. No modifier keys, no chords, no
                      multi-touch gesture of any kind.
                    </td>
                    <td>
                      <code>simultaneousContacts</code>, a count
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              The spread on the first of those is the argument for
              recording it. Across my worked profiles, text entry runs
              from three words a minute for a single-switch scanning
              user to thirty for someone who types with their toes. A
              tenfold difference, invisible to any model that records
              only which input device is in use.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Every capability is full, partial, or absent</h2>
            <p>
              This is the shape of the whole model and the thing most
              easily misread, including by me when I rebuilt it. Each
              property takes one of three values. A measurement
              appears against the middle value and against nothing
              else.
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="The capability scale"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Value</th>
                    <th scope="col">Means</th>
                    <th scope="col">Measurement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">FULL</th>
                    <td>The capability is unimpaired.</td>
                    <td>None. There is nothing left to qualify.</td>
                  </tr>
                  <tr>
                    <th scope="row">PARTIAL</th>
                    <td>The capability exists but is limited.</td>
                    <td>
                      Required, where the property declares one.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">NONE</th>
                    <td>The capability is absent.</td>
                    <td>None. There is nothing there to measure.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              So a person who cannot perceive contrast has contrast
              NONE. Writing nought per cent would claim that a
              measurement was taken of something that is not there.
              This distinction sounds pedantic and is not: a nought is
              a number, and numbers get computed with.
            </p>
            <p>
              The original tables in the paper obscure this, which is
              how I misread my own work. Their Values column shows the
              three-part scale on some rows and the measurement on
              others. Focus reads &ldquo;FULL PARTIAL NONE&rdquo;.
              Focus duration reads &ldquo;Time in minutes&rdquo;. The
              second is not a different kind of property. It is the
              same kind, with the minutes attached to its middle
              value: full means indefinitely, none means not at all,
              and the minutes exist only in between.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Precedence decides which questions are worth asking</h2>
            <p>
              Properties sit in a hierarchy of importance. The
              original paper attaches one sentence to the top of every
              table: remaining properties are only of interest for
              PARTIAL sight.
            </p>
            <p>
              Read literally, and it is meant literally, that sentence
              does a great deal of work. A child property is worth
              asking about exactly when its parent is PARTIAL. A FULL
              parent leaves no impairment to describe. A NONE parent
              leaves nothing to describe either. There is no point
              asking a blind person for their minimum readable font
              size.
            </p>
            <p>
              Two consequences follow, and I got the second of them
              wrong at first.
            </p>
            <p>
              <strong>Absence propagates.</strong> A capability cannot
              exist beneath one that does not. The model refuses
              partial colour perception under absent sight, and that
              refusal is correct.
            </p>
            <p>
              <strong>Fullness does not propagate.</strong> A FULL
              parent makes its children uninteresting, never
              forbidden. I first implemented this as a ceiling, where
              a child could never exceed its parent, and it broke
              immediately. Someone with tunnel vision has PARTIAL
              sight and may have entirely FULL colour perception. A
              Braille reader has FULL language and a very specific
              tactile script. Recording either is extra detail, not a
              contradiction.
            </p>
            <p>
              The clearest case came from a profile for a person with
              Multiple Sclerosis, which is the paper&rsquo;s own
              worked example. Hearing is FULL and listening duration
              is PARTIAL at fifteen minutes, because fatigue in
              Multiple Sclerosis is central rather than sensory. Under
              a ceiling rule that combination is incoherent. It is not
              incoherent. It is the condition.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The body is not a pair of hands</h2>
            <p>
              The 2026 rebuild kept finding the same fault in
              different places. Every part of the model that touched
              the body assumed hands, and nobody had decided it
              should.
            </p>
            <p>
              Tactile sense began as contact on the skin, which is
              whole-body and could not say that vibration white finger
              takes the fingertips and leaves the rest intact. So I
              narrowed it to the hands, which fixed that case and
              broke a larger one: a person with no arms who types with
              their toes has excellent sensation in their toes and,
              under a hands-only reading, none worth recording. I had
              traded one inexpressible person for another.
            </p>
            <p>
              The fix was to say where. Tactile sense is now recorded
              by body site, listing only the sites that differ from
              full, because absence already means &ldquo;not of
              interest&rdquo; everywhere else in the model.
            </p>
            <p>
              Then a question exposed something worse. Asked whether
              one-handedness was expressible, I found the model did
              not merely fail. It stated a falsehood. A setting of
              &ldquo;hands, no sensation&rdquo; claims both hands, and
              a one-handed person&rsquo;s remaining hand feels
              perfectly well. An incomplete model is a gap. A model
              that asserts the opposite of the truth is a defect, and
              I had recorded it twice as the former.
            </p>
            <p>
              Sites now carry a side, which is a separate field rather
              than a doubled list, because side is orthogonal to site.
              It earns its place by the decision test: which side a
              person works with decides where controls go, where a
              switch is mounted, and which one-handed keyboard layout
              to offer.
            </p>
            <p>
              The same de-centring applies to control. A property
              named for manual stability assumed hands; it is now
              effector stability, because a foot is an effector and so
              is a chin. Discrete control now names which body sites
              do the work. Someone who types with their toes has full
              discrete control and needs a different layout, not a
              lesser one, and calling that PARTIAL without saying why
              would be a falsehood as well as an insult.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>
              Knowing a language, receiving it, and producing it are three
              separate facts
            </h2>
            <p>
              The original paper has a fragment of a language grouping
              which points at this without completing it. It gives a
              property for reading signed text with the parents
              &ldquo;sight plus signLanguageSet&rdquo;, and never
              defines signLanguageSet. Filling that gap forced the
              distinction into the open.
            </p>
            <p>
              Knowing American Sign Language does not require eyes.
              Reading it visually does. A DeafBlind signer may have
              had American Sign Language as a first language since
              childhood and now receive it hand over hand. When I
              first made knowledge of a signed language depend on
              sight, the model refused to let that person know their
              own first language.
            </p>
            <p>
              The paper already had the answer in its own structure.
              Language itself has no parents, while reading written
              text needs sight, understanding speech needs hearing,
              and reading sign needs sight. Knowing and receiving were
              always separate. I had collapsed them.
            </p>
            <p>
              Production is a third axis, and the paper has only one
              production property. Someone with tremor or absent touch
              may read the two-handed manual alphabet on their own
              hand without difficulty and be quite unable to spell it
              onto someone else&rsquo;s. The rule that emerged is
              short:{" "}
              <strong>
                reception depends on senses, production depends on
                hands.
              </strong>
            </p>
            <p>
              Recording four language skills separately, listening,
              speaking, reading and writing, is what makes two very
              different people expressible. A person using English as
              an additional language understands better than they
              speak. A Deaf person may read and write English fluently
              with no listening at all. &ldquo;Knows English&rdquo; is
              true of both and useless about either.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Most properties decide nothing on their own</h2>
            <p>
              Requiring each property to name a decision was the first
              half of the fix. The second half corrects an
              overstatement in the first.
            </p>
            <p>
              Contrast sensitivity sets no palette by itself. It does
              so together with six colour and intensity bands. Gaze
              accuracy fixes no target size until it is read alongside
              minimum target size and effector stability. A property
              usually contributes to a decision rather than making
              one, and a model that claimed otherwise would produce
              one overstated claim per property.
            </p>
            <p>
              So a property declares either a decision it makes or a
              contribution it offers, naming the properties it must be
              read with. Of the twenty-six decisions the current model
              supports, seventeen are joint. Two thirds of what this
              model decides needs more than one property, and the
              tidier one-to-one version would have hidden every one of
              them.
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="Examples of joint decisions and the properties they need"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Decision</th>
                    <th scope="col">Properties needed together</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">The visual palette</th>
                    <td>
                      seven properties: colour and intensity in three
                      frequency bands each, plus contrast sensitivity
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">How a soundscape is spatialised</th>
                    <td>
                      azimuth resolution, elevation resolution,
                      binaural hearing
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">The smallest a control may be drawn</th>
                    <td>
                      minimum target size, effector stability, gaze
                      accuracy
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      How long a session may run before a break
                    </th>
                    <td>
                      focus duration, tracking duration, listening
                      duration, input duration
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Whether speech may be accepted as input</th>
                    <td>
                      speech intelligibility to people, and separately
                      to machines
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              That last row is worth dwelling on. Automatic speech
              recognition is trained on a narrow band of voices. A
              person whose family understands them perfectly may be
              unusable by voice control, and a system that infers the
              machine figure from the human one will offer &ldquo;just
              talk to it&rdquo; and strand them. Recording a single
              intelligibility number would hide exactly the case that
              breaks.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The unit of use is not always one person</h2>
            <p>
              Working through profiles for switch, breath and gaze
              access, I concluded that a real-time falling-block game
              is structurally closed to a single-switch scanning user.
              Scanning takes seconds per selection and the pieces do
              not wait.
            </p>
            <p>
              That conclusion was narrow in a way I could not see: it
              assumed the unit of play is an individual. When bespoke
              controls cannot bridge a gap, disabled gamers routinely
              share controls with a gaming buddy who covers the timing
              or the inputs they cannot manage. Microsoft ships a
              Copilot mode on Xbox that makes two controllers act as
              one, for precisely this.
            </p>
            <p>
              My own model had the structure and I had never asked
              what it was for. Its Entity is defined as either a user
              or a group of users, and the paper describes building
              group settings as functionally dependent on member
              settings. What it does not anticipate is this
              resolution. A classroom sharing one screen needs the
              most accommodating setting, so if one student needs
              eighteen point type, everyone gets eighteen point type.
              A co-pilot pair is the opposite: capability is divided,
              so whatever either can do, the pair can do.
            </p>
            <p>
              The asymmetry in what may be lent is the part that
              matters:
            </p>
            <ul>
              <li>
                <strong>Motor capability delegates cleanly.</strong>{" "}
                A buddy&rsquo;s hands are as good as anyone&rsquo;s
                for pressing a button on time. The game cannot tell
                whose finger arrived.
              </li>
              <li>
                <strong>
                  Perception does not delegate in real time.
                </strong>{" "}
                A sighted friend describing a falling piece is always
                describing where it was. In a turn-based game the same
                description works perfectly, which is a fact about the
                game rather than about the people.
              </li>
              <li>
                <strong>Comprehension must not delegate at all.</strong>{" "}
                A buddy who decides what to do is not assisting, they
                are playing, and a model that called that access would
                be lying.
              </li>
            </ul>
            <p>
              So co-piloting rescues the switch-scanning player from a
              real-time game and does nothing whatever for a DeafBlind
              one. That asymmetry is the finding, and it is the sort
              of claim that softens into &ldquo;assistive partnership
              helps&rdquo; and stops meaning anything unless it is
              stated precisely.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Eighteen profiles, and what each one broke</h2>
            <p>
              The model was rebuilt against worked profiles rather
              than in the abstract, and every one of them found
              something. They are stand-ins, to be replaced or
              augmented with lived experience when it is available,
              and each records that basis in its own data so a fixture
              cannot quietly become a finding. They are deliberately
              not personas: no name, no age, no occupation and no
              narrative, because those invite generalising from a
              character to a population.
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="Profiles and the model changes each one forced"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Profile</th>
                    <th scope="col">What it forced</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Blind since birth</th>
                    <td>
                      Settings beneath absent sight are removed, not
                      zeroed. Recording nought per cent contrast would
                      claim a measurement of something absent.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Deaf</th>
                    <td>
                      Signed languages had no property. Also that Deaf
                      is not DeafBlind, and reaching for Braille here
                      is exactly the error capability modelling
                      prevents.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Deafened, asymmetric loss</th>
                    <td>
                      Binaural hearing carries a frequency band rather
                      than a percentage, because an ear that has lost
                      only its lower register keeps contributing above
                      the crossover.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Deafened, four kilohertz notch</th>
                    <td>
                      The usable frequency range is two bands with a
                      gap between them. A gap is a silent failure: a
                      cue placed at four kilohertz is not misheard, it
                      is never received.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">DeafBlind</th>
                    <td>
                      Knowing a language separated from receiving it.
                      Also the hardest case for an audio-first
                      demonstrator, which has nothing to offer this
                      person at all.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Multiple Sclerosis</th>
                    <td>
                      Kinaesthesia separated from touch, since the two
                      dissociate in both directions. Also that
                      fullness must not propagate.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Vibration white finger</th>
                    <td>
                      Tactile sense by body site, and cold as a
                      capability trigger rather than a comfort
                      setting.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Types with toes</th>
                    <td>
                      Effector sites on control properties, and the
                      renaming of manual stability. Nothing in this
                      profile is reduced. Only the site differs.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">One-handed, after a stroke</th>
                    <td>
                      Laterality. The model had been asserting that
                      both hands were affected.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Single-switch scanning</th>
                    <td>
                      Switch site count separated from activation
                      timing, because scanning is timed with one
                      switch and untimed with two.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Eye gaze, late-stage motor neurone disease</th>
                    <td>
                      Gaze control is a motor capability, not a visual
                      one. Sight is unaffected while ocular motility
                      is not.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">English as an additional language</th>
                    <td>
                      Four language skills rated separately. Also that
                      a capability model describing only disabled
                      people has become a disability model with better
                      manners.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              The full set, with every property and every value, is
              generated directly from the running models so the
              document and the code cannot disagree.{" "}
              <NewTabLink href="https://github.com/bobdodd/accessible-tetris/blob/main/docs/user-profiles.md">
                Read the generated profile document
              </NewTabLink>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What else exists</h2>
            <p>
              The 2009 paper had one comparator. In 2026 there are
              several, and one of them arrives at my position
              independently.
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="Alternative approaches to describing users"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">Approach</th>
                    <th scope="col">What it is</th>
                    <th scope="col">How it relates</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">AccessForAll</th>
                    <td>
                      ISO/IEC 24751, taken into deployment by the
                      Global Public Inclusive Infrastructure and the
                      Cloud4All project.
                    </td>
                    <td>
                      Still preference-based. Its own framing is what
                      the user wants the environment to look or behave
                      like, which is configuration rather than
                      capability.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Ability-Based Design</th>
                    <td>
                      Jacob Wobbrock, Krzysztof Gajos and colleagues.
                      Shift the focus from disability to ability, and
                      put the burden on the technology to adapt.
                    </td>
                    <td>
                      The philosophical sibling. Its 2022 paper on
                      conceptual user modelling argues that modelling
                      should centre on what a user is able to do
                      rather than on preferences or demographics.
                      Independent arrival at the same position.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">SUPPLE</th>
                    <td>
                      Automatic interface generation from ability
                      models, with motor ability measured directly
                      rather than reported.
                    </td>
                    <td>
                      Further ahead on working software, behind on
                      formality. No precedence, no functional
                      dependency, no separation of capability from
                      capacity.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Inclusive Design Toolkit</th>
                    <td>
                      Cambridge Engineering Design Centre. Seven
                      capability areas on anchored ordinal scales,
                      with population data and an exclusion
                      calculator.
                    </td>
                    <td>
                      Not a rival model of the person. It rates what a
                      design demands, which is the other side of the
                      join, and it is the most developed
                      population-backed example of that side I have
                      found.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      International Classification of Functioning
                    </th>
                    <td>
                      The World Health Organization&rsquo;s
                      biopsychosocial classification of body
                      functions, activities and participation.
                    </td>
                    <td>
                      The clinical vocabulary, and the model this work
                      defines itself against. Useful as an interchange
                      format if clinical data ever needs importing.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      World Wide Web Consortium Adapt
                    </th>
                    <td>
                      Vocabularies that let content declare its own
                      semantics so it can be personalised.
                    </td>
                    <td>
                      Not a rival. It is the content side of the same
                      bridge, and complements a user model rather than
                      replacing one.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Read against that field, what remains distinctive here
              is the three-value scale with a measurement only on the
              middle value, precedence as acquisition order,
              functional dependency on external influences, the
              separation of capability from capacity from preference,
              and a formal executable information model underneath it
              all. What is behind is the scales, the empirical
              grounding, and deployment.
            </p>
            <p>
              The survey does not hand me a scale. Cambridge solves
              the scaling problem on the demand side, where a task can
              be rated against a population, and that is a different
              question from asking a person what they can do. The
              anchored ordinal values my percentages need have to come
              from people describing themselves, which is interview
              work rather than borrowed apparatus.
            </p>

            <h3>References</h3>

            <h4>This work</h4>
            <ul>
              <li>
                Dodd, R., Green, S. and Pearson, E. (2009).{" "}
                <em>User Capability in an Adaptive World</em>.
                Proceedings of the 1st International Workshop on
                Multimodal Interfaces in Semantic Interaction, MSIADU
                &rsquo;09, Beijing.{" "}
                <a href="https://doi.org/10.1145/1631097.1631110">
                  doi:10.1145/1631097.1631110
                </a>
              </li>
              <li>
                Dodd, R., Green, S. and Pearson, E. (2008).{" "}
                <em>
                  The CISNA Model of Accessible Adaptive Hypermedia
                </em>
                . Proceedings of the International Cross-Disciplinary
                Conference on Web Accessibility, W4A 2008.{" "}
                <a href="https://doi.org/10.1145/1368044.1368052">
                  doi:10.1145/1368044.1368052
                </a>
              </li>
              <li>
                Dodd, R. (2008).{" "}
                <em>
                  20 Years On: the Dexter Model of Hypertext and its
                  impact on web accessibility
                </em>
                . ACM SIGACCESS Accessibility and Computing.
              </li>
            </ul>

            <h4>Standards and classifications</h4>
            <ul>
              <li>
                ISO/IEC 24751-1:2008.{" "}
                <em>
                  Information technology. Individualized adaptability
                  and accessibility in e-learning, education and
                  training. Part 1: Framework and reference model
                </em>
                . International Organization for Standardization.
                Confirmed as current on periodic review in 2020.{" "}
                <a href="https://www.iso.org/standard/41521.html">
                  iso.org/standard/41521.html
                </a>
              </li>
              <li>
                ISO/IEC 24751-2:2008.{" "}
                <em>
                  Part 2: &ldquo;Access for all&rdquo; personal needs
                  and preferences for digital delivery
                </em>
                .{" "}
                <a href="https://www.iso.org/standard/43603.html">
                  iso.org/standard/43603.html
                </a>
              </li>
              <li>
                ISO/IEC 24751-3:2008.{" "}
                <em>
                  Part 3: &ldquo;Access for all&rdquo; digital resource
                  description
                </em>
                .{" "}
                <a href="https://www.iso.org/standard/43604.html">
                  iso.org/standard/43604.html
                </a>
              </li>
              <li>
                ISO/IEC 24751-4:2023.{" "}
                <em>
                  Part 4: &ldquo;Access for all&rdquo; framework for
                  individualized accessibility and registry server
                  application programming interface
                </em>
                .{" "}
                <a href="https://www.iso.org/standard/82901.html">
                  iso.org/standard/82901.html
                </a>
              </li>
              <li>
                World Health Organization (2001).{" "}
                <em>
                  International Classification of Functioning,
                  Disability and Health
                </em>
                . Geneva: WHO.{" "}
                <a href="https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health">
                  who.int
                </a>
              </li>
              <li>
                World Wide Web Consortium.{" "}
                <em>WAI-Adapt</em>, formerly Personalization Semantics.
                Web Accessibility Initiative.{" "}
                <a href="https://www.w3.org/WAI/adapt/">
                  w3.org/WAI/adapt
                </a>
              </li>
            </ul>

            <h4>Ability-based design</h4>
            <ul>
              <li>
                Wobbrock, J.O., Kane, S.K., Gajos, K.Z., Harada, S. and
                Froehlich, J. (2011).{" "}
                <em>
                  Ability-Based Design: Concept, Principles and
                  Examples
                </em>
                . ACM Transactions on Accessible Computing 3(3),
                article 9.{" "}
                <a href="https://doi.org/10.1145/1952383.1952384">
                  doi:10.1145/1952383.1952384
                </a>
              </li>
              <li>
                Wobbrock, J.O., Gajos, K.Z., Kane, S.K. and
                Vanderheiden, G.C. (2018).{" "}
                <em>Ability-Based Design</em>. Communications of the
                ACM 61(6).{" "}
                <a href="https://doi.org/10.1145/3148051">
                  doi:10.1145/3148051
                </a>
              </li>
              <li>
                Nolte, A., Wobbrock, J.O., Volkmann, T. and Jochems, N.
                (2022).{" "}
                <em>
                  Implementing Ability-Based Design: A Systematic
                  Approach to Conceptual User Modeling
                </em>
                . ACM Transactions on Accessible Computing 15(4).{" "}
                <a href="https://doi.org/10.1145/3551646">
                  doi:10.1145/3551646
                </a>
              </li>
            </ul>

            <h4>Adaptive interface generation</h4>
            <ul>
              <li>
                Gajos, K.Z., Weld, D.S. and Wobbrock, J.O. (2010).{" "}
                <em>
                  Automatically generating personalized user interfaces
                  with SUPPLE
                </em>
                . Artificial Intelligence 174(12&ndash;13), 910&ndash;950.{" "}
                <a href="https://doi.org/10.1016/j.artint.2010.05.005">
                  doi:10.1016/j.artint.2010.05.005
                </a>
              </li>
              <li>
                Gajos, K.Z., Wobbrock, J.O. and Weld, D.S. (2007).{" "}
                <em>
                  Automatically generating user interfaces adapted to
                  users&rsquo; motor and vision capabilities
                </em>
                . Proceedings of the ACM Symposium on User Interface
                Software and Technology, UIST &rsquo;07.
              </li>
            </ul>

            <h4>Inclusive design and population data</h4>
            <ul>
              <li>
                Engineering Design Centre, University of Cambridge.{" "}
                <em>Inclusive Design Toolkit</em>. Capability scales,
                capability loss simulation and exclusion calculation.{" "}
                <a href="https://www.inclusivedesigntoolkit.com/">
                  inclusivedesigntoolkit.com
                </a>
              </li>
              <li>
                Engineering Design Centre, University of Cambridge.{" "}
                <em>Exclusion Calculator</em>.{" "}
                <a href="https://calc.inclusivedesigntoolkit.com/">
                  calc.inclusivedesigntoolkit.com
                </a>
              </li>
            </ul>

            <h4>Deployment of AccessForAll</h4>
            <ul>
              <li>
                Raising the Floor.{" "}
                <em>AccessForAll</em>, and the Global Public Inclusive
                Infrastructure. Includes the Cloud4All project.{" "}
                <a href="https://raisingthefloor.org/our-approach-accessforall/">
                  raisingthefloor.org
                </a>
              </li>
            </ul>

            <h4>Design spaces</h4>
            <ul>
              <li>
                Nesbitt, K.V. (2003).{" "}
                <em>
                  Designing Multi-sensory Displays for Abstract Data
                </em>
                . PhD thesis, University of Sydney. The source of the
                visual, auditory and haptic design spaces the subject
                ontologies are scoped to.
              </li>
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What this model still cannot say</h2>
            <p>
              Recorded here rather than left to be discovered, because
              a limitation written down is a limitation someone can
              argue with.
            </p>
            <p>
              <strong>
                Ten properties still carry percentages nobody can
                source.
              </strong>{" "}
              Nobody can report their contrast sensitivity as thirty
              per cent or their kinaesthesia as twenty-five. Those
              numbers are pseudo-precision: they look like measurement
              and are not. The replacement is an anchored ordinal
              scale of the kind a Likert instrument produces, which
              the model already supports and which I have not yet
              applied. It has a consequence worth naming, because a
              Likert response is ordinal rather than interval:
              arithmetic on those values has to become a declared
              lookup, which makes visible an assumption of linearity
              that the arithmetic was hiding.
            </p>
            <p>
              <strong>Vision has no laterality.</strong> Hemiplegia
              commonly comes with loss of the visual field on the same
              side, and while a viewing rectangle can describe the
              remaining field, that is close rather than equivalent.
            </p>
            <p>
              <strong>
                Progressive conditions are recorded as snapshots.
              </strong>{" "}
              A profile for late-stage motor neurone disease is true
              on the day it was taken. Versioning a profile through
              time is what the adaptation model&rsquo;s instance
              sequences are for, and they are not built.
            </p>
            <p>
              <strong>
                Body sites have no granularity below the named site.
              </strong>{" "}
              Sensation in one hand and not the other is now
              expressible. Sensation in the palm but not the
              fingertips is not.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Looking at the larger picture</h2>
            <p>
              A model of the user is half of an adaptive system. The
              other half is a model of the application, abstract
              enough that it can be rendered differently for different
              people, which is the line of work in{" "}
              <Link href="/research/cisna-model">
                the CISNA model of accessible adaptive hypermedia
              </Link>
              .
            </p>
            <p>
              Modelling capability and capacity helps define user
              need. Interaction modalities and the metaphors they use
              have to be considered alongside it, to establish what
              capabilities a modality requires of the user before it
              can be used effectively. That is part of an Interaction
              Model, which matches possible modalities to user need.
            </p>
            <p>
              The two meet in a demonstrator. The{" "}
              <Link href="/adaptation/accessible-tetris">
                accessible Tetris case study
              </Link>{" "}
              is where these profiles are put to work against a real
              application, and where the model&rsquo;s findings stop
              being tidy. A real-time falling-block game is closed to
              a single-switch scanning user unless the game itself
              will wait, and an audio-first demonstrator has nothing
              to offer a DeafBlind player at all. Both are findings
              rather than embarrassments, and both came from writing
              the profiles down.
            </p>
            <p>
              The models, the profiles and the generated document are
              open source.{" "}
              <NewTabLink href="https://github.com/bobdodd/accessible-tetris">
                Read the code on GitHub
              </NewTabLink>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
