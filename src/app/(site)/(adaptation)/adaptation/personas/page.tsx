import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Personas, and what they are missing",
};

export default function Personas() {
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
            <h1>Personas, and what they are missing</h1>
            <p className="lede">
              Personas are how most design teams talk about users, and they
              have been under a methodological objection for twenty years
              that has not been answered on its own terms: a persona cannot be
              checked against anything. My capability model can. What follows is what personas are, what the research
              actually says about them, and where a formal description of a
              person does and does not help.
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What a persona is</h2>
            <p>
              A persona is a fictional individual, described as though they
              were real, standing in for a group of users. It has a name, a
              photograph, an age, a job, a level of confidence with technology,
              and above all a set of goals. Teams write two or three of them and
              then design for those characters rather than for an abstraction.
            </p>
            <p>
              The technique comes from Alan Cooper, who introduced it in{" "}
              <em>The Inmates Are Running the Asylum</em>{" "}
              in 1999 to solve a
              specific problem he called the elastic user. When a team says
              &ldquo;the user&rdquo;, the phrase stretches to fit whatever the
              speaker wants: the user is expert enough to cope with this
              interface, and novice enough to need that wizard, in the same
              meeting. Naming a character stops the stretching. Someone can be
              asked whether a design suits that person, and cannot silently
              redefine them halfway through the argument.
            </p>
            <p>
              That is a real problem and personas do solve it. Most of the
              criticism that follows is not about whether the technique does
              anything; it is about what the technique licenses people to claim.
            </p>
            <p>
              Personas are asked to do three jobs and succeed at them
              unequally. The first is{" "}
              <strong>communication</strong>, giving a team a shared referent
              that is harder to bend than a category. The second is{" "}
              <strong>empathy</strong>, making designers care about somebody who
              is not themselves. The third is{" "}
              <strong>decision</strong>, settling arguments about what to build.
              The methodological literature is largely a fight about the third.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The methodological objection</h2>
            <p>
              The standing critique is Chapman and Milham&rsquo;s, from 2006,
              and its title tells you the tone: <em>The Personas&rsquo; New
              Clothes</em>. Their argument is that a persona is a fiction, and a
              fiction cannot be verified or falsified, so it has no demonstrable
              validity. They set out three failures.
            </p>
            <p>
              A persona <strong>cannot be checked</strong>. There is no
              observation that would show a persona to be wrong, because there
              is nobody it is a description of. A persona&rsquo;s{" "}
              <strong>relationship to a real population is unclear</strong>: it
              is impossible to say how many actual users, if any, a given
              persona resembles. And <strong>inference from a highly specific
              individual is unsound</strong>, because the specificity that makes
              a persona vivid is exactly what makes it unrepresentative.
            </p>
            <p>
              Two years later the same group made the third point numerically.
              Working across six
              survey datasets ranging from 268 to 10,307 respondents, they
              measured how many real people match a persona-like description as
              attributes are added to it. The expected prevalence falls away
              rapidly. A persona described richly enough to feel like a person
              describes, in the limit, nobody at all.
            </p>
            <p>
              That result is not an argument against detail. It is an argument
              against detail combined with a claim of representativeness, which
              is precisely what a persona makes when it says it stands in for a
              group. The trouble is not that Sarah has a name and a job. The
              trouble is asserting that Sarah is the users.
            </p>
            <p>
              Chapman and Milham draw a further consequence. Because personas
              cannot be
              settled with data, disagreements about them get settled by
              seniority instead. A method meant to end arguments about the
              elastic user becomes a new thing to argue about, with no
              evidential procedure for resolution.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The case in favour</h2>
            <p>
              Pruitt and Grudin (at Microsoft) were promoting use of personas
              back in 2003, with Pruitt and Adlin setting the method out at book
              length in 2006, the same year as the above criticism rather than
              in answer to it. They ground the practice in a documented process:
              real research feeding persona creation, explicit assumptions
              written down, and ongoing use throughout a project rather than a
              poster made once and forgotten. Their position is that a persona
              is a{" "}
              <strong>communication artefact</strong> whose value lies in being
              used, and that judging it as though it were a statistical estimate
              is a category error.
            </p>
            <p>
              The one piece of evidence that does come after the criticism is
              Nielsen and Storgaard Hansen&rsquo;s 2014 study, which tested the
              practice empirically at scale and found personas genuinely in use
              and considered applicable by the teams using them. That is
              evidence about adoption rather than about validity, and is offered
              as such.
            </p>
            <p>
              Both positions are reasonable and neither closes the hole. If a
              persona is a communication artefact rather than an estimate, then
              it cannot settle a question that needs evidence, and nothing in
              the method marks where the one use ends and the other begins.
              Twenty years on, the objection has not been answered on its own
              terms.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The data-driven answer, and its limits</h2>
            <p>
              The modern attempt to close the hole is to stop inventing personas
              and start deriving them. Jansen, Salminen and colleagues build
              personas by factorising very large behavioural datasets, tens of
              millions of interactions, into a small number of representative
              profiles, then attaching human attributes to the result. If a
              persona is a cluster centroid, the question &ldquo;how many users
              does this represent&rdquo; has an answer.
            </p>
            <p>
              This is a real advance and it inherits two problems, of which
              the better known is the milder. Clustering tells you about the
              people in the dataset, and the people who could not use the
              product well enough to generate data are the ones an accessibility
              argument is about. A method that derives its users from engagement
              logs will under-represent anybody the current design already
              excludes.
            </p>
            <p>
              The second problem is not an accident of collection, which is what
              makes it the harder one. These methods work by reduction. They
              look for the few profiles that account for the most variance and
              treat what is left as residual, and how many profiles to produce
              is a number somebody picks. Picking a small one is the entire
              point, because a hundred personas would be no more usable than the
              raw data was.
            </p>
            <p>
              A minority is exactly what that arithmetic absorbs into a
              neighbouring cluster or discards. So disabled users are not merely
              under-collected in large datasets, they are pushed out by an
              analysis whose purpose is to find what most people have in common.
              The two problems compound: the data holds fewer of them than it
              should, and then the method is built to look past the ones it
              holds.
            </p>
            <p>
              The same group has since worked on transparency, on explaining to
              practitioners where a generated persona came from, which suggests
              they know the inference is doing more work than it looks.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Personas and disability</h2>
            <p>
              The best-known accessibility use of personas is Microsoft&rsquo;s
              persona spectrum, from Kat Holmes and the inclusive design work.
              It takes a limitation and draws it three ways: permanent, as
              somebody with one arm; temporary, as somebody with a broken wrist;
              and situational, as somebody holding a baby. The pitch is that
              designing for the permanent case serves all three, so inclusive
              design is not charity but reach.
            </p>
            <p>
              It has done a great deal of good in getting the subject taken
              seriously, and it draws three criticisms.
            </p>
            <p>
              <strong>It flattens.</strong> Disability arrives as one bullet on
              a card. A person is blind, and that is the whole of what the team
              knows, which is not enough to design anything and is enough to
              feel finished.
            </p>
            <p>
              <strong>It essentialises.</strong> A categorical label collapses
              everyone it names into a supposed common experience, and misses
              how disability intersects with everything else about somebody.
            </p>
            <p>
              <strong>The situational case crowds out the permanent one.</strong>{" "}
              This is the sharpest criticism and it comes from inside the
              practice. Once a team has understood that captions help in a noisy
              bar, it is easy for the noisy bar to become the working example,
              because it is the one everybody in the room has experienced. The
              person who has been Deaf since birth becomes a rhetorical device
              for making a point about everybody else.
            </p>
            <p>
              There is also careful academic work on doing it better. Schulz and
              Fuglerud have written specifically on creating personas with
              disabilities, and there is a growing practice of co-creating
              personas with disabled people rather than about them, which
              addresses the invention problem at its source even if it leaves
              the representativeness problem where it was.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where this work fits</h2>
            <p>
              I did not set out to fix personas. I set out to describe people to
              computers, in{" "}
              <Link href="/adaptation/describing-people-to-computers">
                a capability model
              </Link>{" "}
              and{" "}
              <Link href="/adaptation/describing-what-people-want">
                a preference model
              </Link>
              . Reading the persona literature afterwards, the fit is closer
              than I expected, and specifically it is closest at the point the
              literature has been stuck on.
            </p>

            <div
              className="scroll-region"
              role="region"
              aria-label="Persona criticisms and how a capability model answers them"
              tabIndex={0}
            >
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th scope="col">The criticism</th>
                    <th scope="col">What my capability model does</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Cannot be checked</th>
                    <td>
                      Every property is a claim about what one person can do,
                      and can be checked against that person. Profiles record
                      their own basis, so a fixture cannot quietly become a
                      finding.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Unclear relationship to a population
                    </th>
                    <td>
                      The model declines the claim rather than making it
                      falsely. A profile describes one person, or generically
                      the typical capabilities of an identified group, and says
                      which it is doing.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">
                      Specificity destroys representativeness
                    </th>
                    <td>
                      Specificity is the point and representativeness is not
                      claimed, so the trade the prevalence study measured does
                      not arise.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Flattening disability to a bullet</th>
                    <td>
                      Fifty-nine properties across five ontologies, each full,
                      partial or absent, with a measurement on the middle value.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Essentialising a category</th>
                    <td>
                      Any combination of values is expressible, and a generic
                      profile is a starting point that must be edited to be
                      used.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Two of those need more than a table cell.
            </p>
            <p>
              <strong>
                The narrative I left out was left out for this reason.
              </strong>{" "}
              The eighteen worked profiles behind my capability model have no
              name, no age, no occupation and no story, because those invite
              generalising from a character to a population. I wrote that before
              reading Chapman and Milham, and it is their third objection
              arrived at from the opposite direction: they measured what
              specificity costs, and I had removed the specificity that was not
              earning anything.
            </p>
            <p>
              <strong>A template is a constructor, not a classifier.</strong>{" "}
              The essentialising criticism lands on assigning somebody to a
              category and stopping. A generic profile here is a surface to
              build from: Fred is like Jim except, and the exceptions are
              recorded as a sequence of changes against the template. The
              mechanism that makes a template usable is the same one that moves
              away from it, so using it at all commits you to individualising
              it. That is structural rather than a promise, which is what makes
              it an answer rather than an apology.
            </p>
            <p>
              It also produces a number personas cannot report. Not how many
              people this represents, which the model rightly declines to
              answer, but{" "}
              <strong>how much of this profile is this person</strong>: the
              changes against the template are readable, so the parts nobody
              ever asked about are visible as inherited rather than known.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Where it does not fit</h2>
            <p>
              A capability profile is not a persona and does not do a
              persona&rsquo;s work. Three gaps matter.
            </p>
            <p>
              <strong>Goals are missing entirely.</strong> What somebody is
              trying to achieve, what they know about the domain, how often they
              use the thing, what they are afraid of: none of that is in my
              capability model or my preference model, and a great deal of what
              personas are for lives there. A model of what a person can do and
              would rather says nothing about what they came to do.
            </p>
            <p>
              <strong>Empathy is not served by a property table.</strong> The
              narrative I removed is the part that makes a designer care. A
              profile is a substrate; it is not a replacement for the thing that
              gets a room to take somebody seriously.
            </p>
            <p>
              <strong>There is no population dimension.</strong> The
              data-driven school can say how common a profile is and this cannot.
              For prioritising work across a whole product that matters, and the
              honest answer is that population data is a different instrument,
              better suited to measuring what a design demands than to
              describing who is using it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What I would actually propose</h2>
            <p>
              Not that capability models replace personas. That claim would be
              too strong and would lose the two things personas are good at.
            </p>
            <p>
              A persona becomes <strong>a narrative laid over a checkable
              profile</strong>. The narrative does the communicating and the
              caring, and is explicitly not evidence. The profile is what a
              system reads and what a claim can be tested against. The two are
              kept apart in the way capability and preference are kept apart,
              and for the same reason: they answer different questions, and
              merging them lets one borrow authority it has not got.
            </p>
            <p>
              That gives the practice something it has lacked since 1999. A
              designer can still say Sarah would struggle here, somebody can
              still ask what that claim rests on, and the answer is now a set of
              properties that could be taken to a real person and checked,
              rather than a paragraph nobody can argue with.
            </p>
            <p>
              It also makes the invented parts visible as invented. A persona
              today mixes observation and invention in one paragraph with no
              seam. Separating the layers means the seam is where you can see
              it, which is the whole of what falsifiability asks for.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>The risk in doing this</h2>
            <p>
              A table of properties looks more authoritative than a sketch of a
              person. The essentialising criticism bites hardest where a
              description gets mistaken for a verdict, and a formal profile is
              far easier to mistake that way than a paragraph about somebody
              called Sarah. Formalising the substrate raises the stakes on the
              rule rather than retiring it: the profile is an attempt to
              describe somebody from outside, it advises and does not decide,
              and the person it describes outranks it.
            </p>
            <p>
              The other half of that rule is on the{" "}
              <Link href="/adaptation/describing-what-people-want">
                preference page
              </Link>
              , where a handset chosen during my master&rsquo;s research had
              neither the largest keys nor the largest text, and I would not
              have predicted it from the profile I had recorded. A formal model
              is not a better oracle. It is a more honest record, and those are
              different things.
            </p>

            <h3>References</h3>

            <h4>The method and its origin</h4>
            <ul>
              <li>
                Cooper, A. (1999). <em>The Inmates Are Running the Asylum</em>.
                Sams Publishing. The origin of personas and of the elastic user.
              </li>
              <li>
                Pruitt, J. and Grudin, J. (2003). Personas: practice and theory.{" "}
                <em>Proceedings of the 2003 Conference on Designing for User
                Experiences</em> (DUX &rsquo;03).{" "}
                <a href="https://doi.org/10.1145/997078.997089">
                  doi:10.1145/997078.997089
                </a>
              </li>
              <li>
                Pruitt, J. and Adlin, T. (2006).{" "}
                <em>
                  The Persona Lifecycle: Keeping People in Mind Throughout
                  Product Design
                </em>
                . Morgan Kaufmann.
              </li>
              <li>
                Nielsen, L. and Storgaard Hansen, K. (2014). Personas is
                applicable: a study on the use of personas in Denmark.{" "}
                <em>
                  Proceedings of the SIGCHI Conference on Human Factors in
                  Computing Systems
                </em>{" "}
                (CHI &rsquo;14), 1665&ndash;1674.{" "}
                <a href="https://doi.org/10.1145/2556288.2557080">
                  doi:10.1145/2556288.2557080
                </a>
              </li>
            </ul>

            <h4>The methodological critique</h4>
            <ul>
              <li>
                Chapman, C. N. and Milham, R. P. (2006). The Personas&rsquo; New
                Clothes: methodological and practical arguments against a
                popular method.{" "}
                <em>
                  Proceedings of the Human Factors and Ergonomics Society Annual
                  Meeting
                </em>
                , 50(5).{" "}
                <a href="https://doi.org/10.1177/154193120605000503">
                  doi:10.1177/154193120605000503
                </a>
              </li>
              <li>
                Chapman, C. N., Love, E., Milham, R. P., ElRif, P. and Alford,
                J. L. (2008). Quantitative evaluation of personas as
                information.{" "}
                <em>
                  Proceedings of the Human Factors and Ergonomics Society Annual
                  Meeting
                </em>
                , 52(16), 1107&ndash;1111. The prevalence study.{" "}
                <a href="https://doi.org/10.1177/154193120805201602">
                  doi:10.1177/154193120805201602
                </a>
              </li>
            </ul>

            <h4>Data-driven personas</h4>
            <ul>
              <li>
                Jansen, B. J., Salminen, J., Jung, S. and Guan, K. (2021).{" "}
                <em>Data-Driven Personas</em>. Synthesis Lectures on
                Human-Centered Informatics, Springer.{" "}
                <a href="https://doi.org/10.1007/978-3-031-02231-9">
                  doi:10.1007/978-3-031-02231-9
                </a>
              </li>
              <li>
                Salminen, J., Santos, J. M., Jung, S.-G. and Eslami, M. (2019).
                Persona transparency: analyzing the impact of explanations on
                perceptions of data-driven personas.{" "}
                <em>
                  International Journal of Human&ndash;Computer Interaction
                </em>
                .{" "}
                <a href="https://doi.org/10.1080/10447318.2019.1688946">
                  doi:10.1080/10447318.2019.1688946
                </a>
              </li>
            </ul>

            <h4>Disability and inclusive design</h4>
            <ul>
              <li>
                Holmes, K. (2018).{" "}
                <em>Mismatch: How Inclusion Shapes Design</em>. MIT Press. The
                persona spectrum.
              </li>
              <li>
                Schulz, T. and Fuglerud, K. S. (2020). Creating personas with
                disabilities. arXiv:2003.11875.{" "}
                <a href="https://arxiv.org/abs/2003.11875">arxiv.org/abs/2003.11875</a>
              </li>
              <li>
                Microsoft Design.{" "}
                <em>Inclusive Design</em>. The published toolkit and activity
                cards.{" "}
                <a href="https://inclusive.microsoft.design/">
                  inclusive.microsoft.design
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
