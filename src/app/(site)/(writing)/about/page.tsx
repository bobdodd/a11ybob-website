import Link from "next/link";
import type { CSSProperties } from "react";

export default function About() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h1>About</h1>
            <p className="lede">
              <em>
                Systems that respond intelligently to context, and the humans
                within them.
              </em>
            </p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>The model railway</h2>
            <p>
              Bob grew up in Northumberland and built a model railway, first
              controlled with relay logic, later with TTL gates. A relay
              interlock is a real-time safety system; the railway was a
              real-time control system before he had ever touched a computer.
              Everything that came afterwards is a variation on what was
              learned then.
            </p>
            <p>
              Northumberland County Council ran an ICL 2900 mainframe and
              gave secondary-school students batch-time on it. Programs were
              written on coding forms, sent in to be punched onto cards by
              typists, and run when the mainframe was quiet. Turnaround was
              measured in weeks. A typo cost three weeks. Discipline was
              enforced by the loop.
            </p>
            <p>
              Around 1980 Bob and his father kit-built a ZX80 on the kitchen
              table. A 16K Spectrum followed; on it, Bob learned Sinclair
              Spectrum Forth — a stack-oriented language that ran close to
              the metal because the metal was all you had.
            </p>
            <p>
              The model railway returns explicitly in the doctoral
              work twenty-five years later. The thesis chapter on
              haptic design names it: <em>the inspiration for this
              model of haptics is relay logic. I was using relays in
              the 1970s for my O-level Engineering project to
              control a model railway.</em> Same model railway,
              same relay logic, becoming the foundation for a
              formal model of haptic interaction. Not a metaphor;
              a direct acknowledged inspiration.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>Teesside, and any hardware that fitted in three months</h2>
            <p>
              BSc Computer Technology at Teesside Polytechnic (1982–86), half
              hardware and half software. The polytechnic decommissioned its
              Univac 1100 during Bob&rsquo;s time there; the building it
              vacated became two squash courts. The squash courts dated the
              era specifically, in a way more abstract dating could not.
            </p>
            <p>
              From 1984, Metal Box Automation and Controls in Worcester. The
              company culture, in one sentence:{" "}
              <em>
                &ldquo;Any hardware, any language, any architecture — so long
                as projects took only three months.&rdquo;
              </em>{" "}
              Three projects from those five years are worth naming. The
              programmable logic controllers that ran the Cadbury Cream Egg
              production line, written in ladder logic with relay-symbol
              diagrams. The Metal Box Microguage, an industrial QC system
              for measuring the wall thickness and height of beer cans —
              factory-floor version on 8085 assembler, portable briefcase
              version in PolyForth on a PC. The Difco automated blood
              culture system, built on Transputers running occam, with
              networked 8051s in each drawer; first generation of what is
              now standard in pathology labs. CSP foundations meant the
              concurrency could be formally reasoned about. Originally aimed
              at the food industry, where it was too slow and too expensive;
              found its market in medicine, where it was neither.
            </p>
            <p>
              The Microguage carried a teachable parable. The earlier
              version had a floating-point implementation with rounding
              errors that made its readings disagree with the printed
              reports the factory had been working from for years. Bob
              rewrote it in fixed point — the natural Forth idiom — and the
              readings became repeatable. One customer, presented with the
              new honest precision, accused him of cheating. The accusation
              was wrong but it was instructive. The gap between accuracy
              and repeatability is the gap between a measurement people
              trust and one they do not, and the same gap shows up in
              accessibility testing twenty years later.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>Distributed systems, switching, adaptive UIs</h2>
            <p>
              Siemens Plessey Defence Systems in Havant from 1989. NATO
              communications work, including the Canadian Forces low-level
              air-defence comms system, and a stint at the Royal Signals
              Research Establishment extending the OSI seven-layer model
              with security layers and building the Trusted Network
              Interface Unit, specified in Z notation.{" "}
              <em>I can read Z. I can never write efficient Z.</em>
            </p>
            <p>
              GEC Plessey Telecoms in 1993, then Ascom AG in Solothurn from
              1993 to 1996, where Bob was Software Group Leader for the
              introduction of object-oriented technology to Ascom&rsquo;s
              switching business. ISDN telephony and PABX systems, including
              specialist exchanges for radio call-in shows. Notation methods
              of the era: Shlaer-Mellor, Executable UML, SDL.
            </p>
            <p>
              The mid-1990s also covered a period in Singapore, with
              connections to the gay Deaf community there. Out of a
              challenge over drinks at the bar Tantric on a Friday
              night came{" "}
              <Link href="/research/spotlight/sign16">Sign16</Link>{" "}
              — a sign-writing system that fit on the 16-key keypad
              of a feature phone. The price of solving the problem
              was a beer. The story is the first of three on the{" "}
              <Link href="/research/spotlight">Spotlight projects</Link>{" "}
              page.
            </p>
            <p>
              Then in 1996, building the Control Data mail hub that bridged
              the pre-SMTP fragmentation of corporate email — Microsoft
              Mail, Lotus, IBM systems, X.400 — converting between formats
              and routing through an X.500 directory.{" "}
              <em>A giant giant Perl program, which was a bit scary.</em> A
              year of dynamic crew planning at British Airways followed.
            </p>
            <p>
              From 1997 to 2001, Nokia Mobile Phones in Finland and
              Germany. Lead researcher on a joint project with Nokia
              Research on adaptive UI design methodologies for novel
              interfaces in in-car telephony. Self-adapting UIs that could
              move between devices of varying capability — a 1100 feature
              phone at the cheap end, a 9900 with a flip-out QWERTY at the
              high end — same software, adapting at runtime. This is where
              adaptive UIs entered the working vocabulary, several years
              before the accessibility application emerged.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>The shift to accessibility</h2>
            <p>
              In the early 2000s, three family motivations layered.
              Bob&rsquo;s cousin had been diagnosed with multiple
              sclerosis and his progression became the technical
              focus of much of the doctoral work — see{" "}
              <Link href="/research/spotlight/tup">TUP</Link>, the
              first of the tools built specifically for him.
              Bob&rsquo;s mother has arthritis, and her experience
              of typing on mobile devices informed the input-
              reduction direction of the same tool. Then, late in
              the period, Bob&rsquo;s father&rsquo;s final illness
              put the family in an ICU where picture-board AAC
              proved inadequate for a man trying to participate in
              his own treatment decisions. None of these alone is
              the formal cause of the research focus; together they
              turned the technical work toward accessibility, and
              they kept it concrete &mdash; built for specific
              people, not for an abstract user category.
            </p>
            <p>
              Bob enrolled at Teesside one day a week for an MSc in
              Multimedia Applications; the thesis was on mobile
              accessibility for people with MS. The MSc became a
              PhD candidacy. There is also a third named user the
              framework was built for and tested against:{" "}
              <em>the author himself</em>, who has mild deuteranomalia,
              disclosed in the 2009{" "}
              <em>User Capability in an Adaptive World</em> paper.
              The researcher is inside the design space he is
              modelling.
            </p>
            <p>
              The doctoral research at Teesside ran from 2004 to 2013, on
              the effectiveness of self-adapting user interfaces as
              assistive technology in hand-held mobile devices. Most of the
              writing was completed and several peer-reviewed papers
              published from the work, including the W4A 2008 paper{" "}
              <em>The CISNA Model of Accessible Adaptive Hypermedia</em>{" "}
              (with Steve Green and Elaine Pearson). The viva was never
              taken — largely because CNIB and CELA happened. Three pieces
              of original conceptual work survived from the period and are
              still load-bearing for current writing: the{" "}
              <Link href="/research/cisna-model">CISNA Model</Link>{" "}
              itself;{" "}
              <Link href="/research/polymorphic-task-deconstruction">
                Polymorphic Task Deconstruction
              </Link>
              , a way of describing multiple manipulations of the
              same data so a capability model can choose between
              them; and{" "}
              <Link href="/research/tetris-testbed">
                Tetris as accessibility testbed
              </Link>
              , which turned out to be the most teachable artefact
              of the entire period — and produced an{" "}
              <Link href="/research/spotlight/tetris-audio">
                audio rendering
              </Link>{" "}
              that re-framed the modality question itself. Beneath
              all three, the{" "}
              <Link href="/research/the-measure-of-accessibility">
                Measure of Accessibility
              </Link>{" "}
              collection &mdash; six pages from the{" "}
              <em>Defining Accessibility</em> chapter &mdash; gives
              the formal-and-political theory.
            </p>
            <p>
              A period in Beijing around 2004 sits inside the
              doctoral years. Bob&rsquo;s husband, Taodi, finished
              his Masters and joined Nokia in Beijing; the route to
              a same-sex partner visa ran through Tsinghua
              University, where Bob spent two semesters studying
              Mandarin so he could live in China while Taodi
              worked. The bus journey to Tsinghua at 6am produced
              the{" "}
              <em>User Interface as an Evolving Community of Practice</em>{" "}
              chapter &mdash; one of the more biographically rooted
              pieces of the corpus, written largely on the bus.
              The Communities of Practice framing went on to become
              the substrate for the 2029 framework on{" "}
              <Link href="/research/2029-framework">that page</Link>.
            </p>
            <p>
              In 2008 Bob and Taodi moved from the UK to Canada when
              Taodi joined BlackBerry in Waterloo. The PhD candidacy
              continued formally for another five years; the centre
              of gravity shifted.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>CNIB, CELA, and the working tools</h2>
            <p>
              From 2013, the original CNIB Library website. Then the
              co-design and implementation of CELA — the Centre for
              Equitable Library Access — the moment Canadian public
              libraries finally took on the responsibility for accessible
              book access that CNIB had carried for a century. From 2019,
              Manager of Digital Accessibility at CNIB Frontier, building
              the audit processes (websites, apps, lived user testing,
              electronic documents), the toolchain, and an early automated
              testing tool. Joined the W3C ACT-R community group defining
              standard tests for digital accessibility.
            </p>
            <p>
              A spell as Director of Delivery at Digita11y Accessible Inc.
              (2021 onwards) covered the audit department of a SaaS-era
              consultancy — in-house and Indian subcontractor team,
              audit-reporting and test-automation tools, training and
              consultancy for George Brown College, Centennial College,
              Co-operators, Brookfield Properties, Philip Morris.
            </p>
            <p>
              The current role, Head of Accessibility at CNIB Access Labs,
              is the strategic technical seat at CNIB&rsquo;s commercial
              accessibility arm and the methodology-owner position
              for the practice as a whole. Three production tools
              are in active use at Access Labs:{" "}
              <em>autoA11y</em> (the commercial accessibility-testing
              platform);{" "}
              <Link href="/lived-testing">Dictaphone</Link> (audio-and-
              video accessibility analysis from lived-experience and
              audit recordings, AI-assisted, in production for over
              two years); and <em>pdfMax</em> (PDF accessibility
              platform, testing every document against 122 distinct
              accessibility standards spanning PDF/UA, WCAG 2.2, the
              Matterhorn Protocol, and PDF/UA-1). The Three Pillars
              the public deck names &mdash; automated testing, manual
              inspection, lived experience &mdash; integrate through
              those tools into a single audit pipeline. All three
              are CNIB-owned and are mentioned here as practice, not
              portfolio.
            </p>
            <p>
              In parallel, and on personal time, three Bob-owned
              open-source tools:{" "}
              <Link href="/paradise">Paradise</Link> &mdash; a
              multi-model accessibility analyser whose technical
              contribution is the ActionLanguage intermediate
              representation, a JavaScript-to-semantic-tree
              transcoder that lets analysis reason about runtime
              behaviour at the source level;{" "}
              <Link href="/carnforth">Carnforth GPL</Link> &mdash;
              a Chrome DevTools extension testing the accessible-
              name computation algorithm in depth, the runtime
              counterpart to Paradise&rsquo;s source-level work;
              and <Link href="/a11yauto">a11yAuto</Link> &mdash;
              five AI-driven PoCs targeting classes of issue
              commercial scanners cannot reach. A fourth open-
              source line is in development: vision-AI analysis of
              think-aloud recordings using the open-weights
              Qwen 3.5 model, intended as a values-significant
              self-hostable alternative to the Claude-based
              production stack.
            </p>
            <p>
              A seven-year sustained body of work, separate from
              the testing tools, on{" "}
              <Link href="/maps">accessible maps</Link>: three
              working demos across building, subdivision, and
              city-neighbourhood scales, sharing one SVG-tile
              architecture, with a paper-shaped theoretical
              contribution &mdash;{" "}
              <em>
                spatial cognition under modality conversion
              </em>{" "}
              &mdash; that names the polar-coordinate finding the
              maps work produced.
            </p>
            <p>
              The pattern across these is one Bob describes
              directly:{" "}
              <em>
                &ldquo;I play at home, and some of that work makes
                its way through to CNIB. They&rsquo;re my employer,
                and a charity I believe in, and I love gifting them
                apps and code.&rdquo;
              </em>{" "}
              Carnforth GPL became autoA11y; the home audio-analysis
              PoC became Dictaphone; pdfMax, by contrast, originated
              entirely within Access Labs &mdash; the first
              substantive tool the practice produced without a home
              predecessor. The home/CNIB asymmetry isn&rsquo;t
              policy; it&rsquo;s preference. Hobby code is the
              right shape for theoretical exploration; production
              code is the right shape for institutional users
              with conformance obligations. Both keep happening.
            </p>
            <p>
              The ActionLanguage IR in Paradise today carries
              forward the Forth-style threaded-interpreter execution
              model from{" "}
              <Link href="/playgrounds/action-language">
                the doctoral Action Language
              </Link>
              , which carried it forward from PolyForth at Metal
              Box in 1984. Same execution model, four problem
              domains, four decades.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>The 2029 project</h2>
            <p>
              In 2006, during the doctoral work, Bob built a theoretical
              framework that treats accessibility not as a binary pass/fail
              and not as a static property of either system or user, but
              as an emergent dynamic equilibrium in a contextual space of
              competition between environmental factors, technical
              constraints, user capability, user preference, and the
              available UI resources and modalities. The framework
              requires agency for each factor — each must be able to
              advocate, negotiate, and respond.
            </p>
            <p>
              The work was not abandoned in 2013; it was paused.
              The 2013 thesis conclusion explicitly named the next
              research step:{" "}
              <em>
                that competition would be best considered through
                the use of game theory, with the mathematical
                formalism likely to be found in models of autonomous
                agents.
              </em>{" "}
              In 2006 the theory was understood but the compute was
              not there. In 2013 the formalism was clearer but
              autonomous-agent implementations remained academic
              toys. With practical agentic AI now available, the
              implementation tools have caught up. The 2029 project
              is the resumption of named research, not a hobby
              waiting for retirement.{" "}
              <Link href="/research/2029-framework">Read on.</Link>
            </p>
          </section>

          <p className="lede">
            <em>
              It was always about systems that respond intelligently to
              context. The model railway just had fewer modalities.
            </em>
          </p>
        </div>
      </div>
    </main>
  );
}
