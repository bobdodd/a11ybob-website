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
              Bob grew up in Northumberland, in the north of England, and built
              a series of model railways through his teenage years. One of them
              in particular is worth dwelling on. It was first controlled with
              relay logic and later rebuilt around TTL logic gates as parts
              became available to him through contacts that his school had with
              a local electronics company; a relay interlock is a real-time
              safety system in the formal sense, and the railway accordingly was
              a real-time control system in everything but name &mdash; direct,
              immediate, hardware-shaped.
            </p>
            <p>
              Programming entered the same years from a different direction. In
              the late 1970s and early 1980s, Northumberland County Council ran
              an ICL 2900 mainframe and made batch-time on it available to
              secondary-school students; programs were written by hand on coding
              forms, sent in to be punched onto cards by typists, and run when
              the mainframe was quiet. Turnaround was measured in weeks, and a
              single typo could cost three of those weeks. Discipline, in that
              loop, was enforced by the loop itself. Two modes of working with
              logic in parallel, then &mdash; the real-time physical immediacy
              of the railway, and the slow deliberate abstraction of batch
              programming. Everything that came after is a variation on what was
              learned in those years.
            </p>
            <p>
              By early 1981, Bob and his father had kit-built a ZX80 on the
              kitchen table at home. A 16K Spectrum followed, and on it Bob
              learned Sinclair Spectrum Forth &mdash; a stack-oriented language
              that ran close to the metal because the metal was all you had.
            </p>
            <p>
              That model returned to his writing, in his doctoral work. The
              thesis chapter on haptic design names it openly:{" "}
              <em>
                the inspiration for this model of haptics is relay logic. I was
                using relays in the 1970s for my O-level Engineering project to
                control a model railway.
              </em>{" "}
              Same railway, same relay logic, repurposed as the foundation for a
              formal model of haptic interaction. Not a metaphor reached for in
              retrospect; a direct acknowledged inspiration, named in the thesis
              itself.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>Teesside, and any hardware that fitted in three months</h2>
            <p>
              Bob read BSc Computer Technology at Teesside Polytechnic from
              1982 to 1986 &mdash; a four-year course split evenly between
              hardware and software. During his time there the polytechnic
              decommissioned its Univac 1100 mainframe; the building it had
              occupied was converted into two squash courts. The conversion
              dates the era for him specifically, in a way that more abstract
              dating could not.
            </p>
            <p>
              From 1984 he was working at Metal Box Automation and Controls in
              Worcester, in a culture summed up in one sentence:{" "}
              <em>
                &ldquo;Any hardware, any language, any architecture &mdash; so
                long as projects were kept to tight deadlines, typically three
                months.&rdquo;
              </em>{" "}
              Three projects from those five years are worth naming. The first
              was the programmable logic controllers that ran the Cadbury Cream
              Egg production line, written in ladder logic with relay-symbol
              diagrams. The second was the Metal Box Microguage, an industrial
              quality-control system for measuring the wall thickness and height
              of beer cans &mdash; factory-floor version in 8085 assembler,
              portable briefcase version in PolyForth on a PC. The third was the
              Difco automated blood culture system, initially prototyped on
              Transputers &mdash; chosen for their built-in networking and an
              elegant fit for the problem &mdash; running occam, with the
              production version moved to the less exciting networked 8051
              microcontrollers in each drawer; first generation of what is now
              standard in pathology labs. The work was practitioner-level
              rather than algorithmic; what mattered was finding an elegant
              solution, not a novel one. Originally aimed at the food industry,
              where it turned out to be too slow and too expensive, the Difco
              system found its market in medicine, where it was neither.
            </p>
            <p>
              The briefcase Microguage carried a teachable parable. The earlier
              version had been implemented in floating point, and its rounding
              errors had been making its readings disagree with the printed
              reports the factory had been working from for years. Bob rewrote
              it in fixed point &mdash; the natural Forth idiom &mdash; at a
              precision that matched what the underlying test equipment could
              actually deliver. The readings became repeatable. One customer,
              presented with both the corrected values and the more honest
              precision, accused him of cheating. The accusation was wrong but
              it was instructive: the gap between accuracy and repeatability
              &mdash; and between the precision a tool claims and the precision
              its instruments can support &mdash; is the gap between a
              measurement people trust and one they do not. The same gap shows
              up in accessibility testing twenty years later.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>Distributed systems, switching, adaptive UIs</h2>
            <p>
              From 1989 Bob was at Siemens Plessey Defence Systems in Havant,
              working on communications systems for clients that included the
              Canadian Forces here in Canada. A stint at the Royal Signals
              Research Establishment in the same period extended the OSI
              seven-layer model with security layers and built the Trusted
              Network Interface Unit, specified in Z notation.{" "}
              <em>I can read Z. I can never write efficient Z.</em>
            </p>
            <p>
              GEC Plessey Telecoms followed in 1993, then Ascom AG in Solothurn
              from 1993 to 1996, where Bob was Software Group Leader for the
              introduction of object-oriented technology to Ascom&rsquo;s
              switching business &mdash; ISDN telephony and PABX systems,
              including specialist exchanges for radio call-in shows. The
              notation methods of the era ran through everything: Shlaer-Mellor,
              Executable UML, SDL.
            </p>
            <p>
              Then in 1996 came the Control Data mail hub, which bridged the
              pre-SMTP fragmentation of corporate email &mdash; Microsoft Mail,
              Lotus, IBM systems, X.400 &mdash; by converting between formats
              and routing through an X.500 directory.{" "}
              <em>
                A giant giant Perl program, a write-only language as we used to
                say, which was a bit scary.
              </em>{" "}
              A year of dynamic crew planning at British Airways followed.
            </p>
            <p>
              Between 1997 and 2001, Bob was at Nokia Mobile Phones in Finland
              and Germany, working on a joint project with Nokia Research on
              adaptive UI design methodologies for novel interfaces in in-car
              telephony. The specific goal was adapting a phone&rsquo;s UI
              for a third-party in-car infotainment system &mdash; the same
              phone software, adapted for whichever platform was hosting it. This is where adaptive UIs entered the working
              vocabulary, several years before the accessibility application
              emerged.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>The shift to accessibility</h2>
            <p>
              In the early 2000s, three family motivations layered. Bob became
              increasingly involved in his cousin&rsquo;s welfare as the MS
              progressed, and that involvement became the technical focus of
              much of the doctoral work that followed &mdash; see{" "}
              <Link href="/research/spotlight/tup">TUP</Link>, the first of the
              tools built specifically for him. Bob&rsquo;s mother has
              arthritis, and her experience of typing on mobile devices
              informed the input-reduction direction of the same tool. Then,
              late in the same period, Bob&rsquo;s father&rsquo;s final illness
              put the family in an ICU where picture-board AAC proved
              inadequate for a man trying to participate in his own treatment
              decisions. None of these alone is the formal cause of the
              research focus, but together they turned the technical work
              toward accessibility, and they kept it concrete &mdash; built for
              specific people, not for an abstract user category.
            </p>
            <p>
              Bob enrolled at Teesside two days a week for an MSc in Multimedia
              Applications, with a thesis on mobile accessibility for people
              with MS; the MSc became a PhD candidacy. There is also a third
              named user the framework was built for and tested against:{" "}
              <em>the author himself</em>, who has mild deuteranomalia,
              disclosed in the 2009{" "}
              <em>User Capability in an Adaptive World</em> paper. The
              researcher is inside the design space he is modelling.
            </p>
            <p>
              The doctoral research ran from 2004 to 2013. It began on the
              effectiveness of self-adapting user interfaces as assistive
              technology in hand-held mobile devices, and over those years grew
              into formal models of UI adaptation and of user capability. Most
              of the writing was completed and several peer-reviewed papers
              published from the work, including the W4A 2008 paper{" "}
              <em>The CISNA Model of Accessible Adaptive Hypermedia</em> (with
              Steve Green and Elaine Pearson). The viva was never taken &mdash;
              largely because of a family move to Canada, and CNIB and CELA
              happening. Two pieces of original
              conceptual work survived from the period and are still
              load-bearing for current writing: the{" "}
              <Link href="/research/cisna-model">CISNA Model</Link> itself, and{" "}
              <Link href="/research/tetris-testbed">
                Tetris as accessibility testbed
              </Link>
              , which turned out to be the most teachable artefact of the
              entire period &mdash; and produced an{" "}
              <Link href="/research/spotlight/tetris-audio">
                audio rendering
              </Link>{" "}
              that re-framed the modality question itself. Beneath both, the{" "}
              <Link href="/research/the-measure-of-accessibility">
                Measure of Accessibility
              </Link>{" "}
              collection &mdash; six pages from the{" "}
              <em>Defining Accessibility</em> chapter &mdash; gives the
              formal-and-political theory.
            </p>
            <p>
              A period in Beijing around 2004 sits inside the doctoral years.
              Bob&rsquo;s husband, Taodi, had finished his Masters and joined
              Nokia in Beijing; the route to a same-sex partner visa ran
              through Tsinghua University, where Bob spent two semesters
              studying Mandarin so he could live in China while Taodi worked.
              The gruelling 6am bus journey to Tsinghua University produced the{" "}
              <em>User Interface as an Evolving Community of Practice</em>{" "}
              chapter &mdash; one of the more biographically rooted pieces of
              the corpus, written largely on that bus. The Communities of
              Practice framing went on to become the substrate for the{" "}
              <Link href="/research/2029-framework">2029 framework</Link>.
            </p>
            <p>
              A period in Singapore in the mid-2000s, also inside the doctoral
              years, brought connections to the gay Deaf community there. Out
              of a challenge over drinks at the bar Tantric on a Friday night
              came <Link href="/research/spotlight/sign16">Sign16</Link>
              &mdash; a sign-writing system that fit on the 16-key keypad of a
              feature phone. The price of solving the problem was a beer. That
              story is the first of three on the{" "}
              <Link href="/research/spotlight">Spotlight projects</Link> page.
            </p>
            <p>
              In 2008, Bob and Taodi moved from the UK to Canada when Taodi
              joined BlackBerry in Waterloo. The PhD candidacy continued
              formally for another five years; the centre of gravity shifted.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>CNIB, CELA, and the working tools</h2>
            <p>
              From 2013, Bob&rsquo;s first role at CNIB was maintaining the
              original CNIB Library website whilst planning and developing its
              replacement, CELA, the Centre for Equitable Library Access
              &mdash; the moment Canadian public libraries finally took on the
              responsibility for accessible book access that CNIB had carried
              for a century. From 2019, as Manager of Digital Accessibility at
              CNIB Frontier, Bob built out the audit processes (websites, apps,
              lived user testing, electronic documents), the toolchain that
              supported them, and an early automated testing tool; the role
              also brought him into contact with the W3C ACT-R community group
              defining standard tests for digital accessibility, influencing
              his own work on accessibility testing.
            </p>
            <p>
              A spell from 2021 as Director of Delivery at Digita11y Accessible
              Inc. covered the audit department of a SaaS-era consultancy
              &mdash; an in-house team with external agency-supplied subcontractors,
              audit-reporting and test-automation tools, and training and
              consultancy for George Brown College, Centennial College,
              Co-operators, Brookfield Properties, and Philip Morris.
            </p>
            <p>
              The current role, Head of Accessibility at CNIB Access Labs, is
              the strategic technical seat at CNIB&rsquo;s commercial
              accessibility arm and the methodology-owner position for the
              practice as a whole. Three production tools are in active use at
              Access Labs: <em>autoA11y</em>, the commercial
              accessibility-testing platform;{" "}
              <Link href="/lived-testing">Dictaphone</Link>, an AI-assisted
              audio-and-video accessibility analyser working from
              lived-experience and audit recordings, in production for over two
              years; and <em>pdfMax</em>, a PDF accessibility platform that
              tests every document against 122 distinct accessibility standards
              spanning PDF/UA, WCAG 2.2, the Matterhorn Protocol, and PDF/UA-1.
              The Three Pillars the public deck names &mdash; automated
              testing, manual inspection, lived experience &mdash; integrate
              through those tools into a single audit pipeline. All three are
              CNIB-owned and are mentioned here as practice, not portfolio.
            </p>
            <p>
              In parallel, and on personal time, Bob develops three open-source
              tools of his own. <Link href="/paradise">Paradise</Link> is a
              multi-model accessibility analyser whose technical contribution
              is the ActionLanguage intermediate representation &mdash; a
              JavaScript-to-semantic-tree transcoder that lets analysis reason
              about runtime behaviour at the source level.{" "}
              <Link href="/carnforth">Carnforth GPL</Link> is a Chrome DevTools
              extension testing the accessible-name computation algorithm in
              depth, the runtime counterpart to Paradise&rsquo;s source-level
              work. <Link href="/a11yauto">a11yAuto</Link> is a set of five
              AI-driven proofs-of-concept targeting classes of issue commercial
              scanners cannot reach. A fourth open-source line is in
              development: vision-AI analysis of think-aloud recordings using
              the open-weights Qwen 3.5 model, intended as a values-significant
              self-hostable alternative to the Claude-based production stack.
            </p>
            <p>
              Running alongside the testing tools is a seven-year sustained
              body of work on <Link href="/maps">accessible maps</Link>: three
              working demos across building, subdivision, and city-neighbourhood
              scales, sharing one SVG-tile architecture, with a paper-shaped
              theoretical contribution &mdash;{" "}
              <em>spatial cognition under modality conversion</em> &mdash; that
              names the polar-coordinate finding the maps work produced.
            </p>
            <p>
              The pattern across these is one Bob describes directly:{" "}
              <em>
                &ldquo;I play at home, and some of that work makes its way
                through to CNIB. They&rsquo;re my employer, and a charity I
                believe in, and I love gifting them apps and code.&rdquo;
              </em>{" "}
              Carnforth GPL became autoA11y; the home audio-analysis PoC became
              Dictaphone. pdfMax, by contrast, originated entirely within
              Access Labs &mdash; the first substantive tool the practice
              produced without a home predecessor. The home/CNIB asymmetry
              isn&rsquo;t policy; it&rsquo;s preference. Hobby code is the
              right shape for theoretical exploration, and production code is
              the right shape for institutional users with conformance
              obligations. Both keep happening.
            </p>
            <p>
              The ActionLanguage IR in Paradise today carries forward the
              Forth-style threaded-interpreter execution model from{" "}
              <Link href="/playgrounds/action-language">
                the doctoral Action Language
              </Link>
              , which carried it forward from PolyForth at Metal Box in 1984.
              Same execution model, four problem domains, four decades.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h2>The 2029 project</h2>
            <p>
              In 2006, during the doctoral work, Bob built a theoretical
              framework that treats accessibility not as a binary pass/fail and
              not as a static property of either system or user, but as an
              emergent dynamic equilibrium in a contextual space of competition
              between environmental factors, technical constraints, user
              capability, user preference, and the available UI resources and
              modalities. The framework requires agency for each factor: each
              must be able to advocate, negotiate, and respond.
            </p>
            <p>
              The work was not abandoned in 2013; it was paused. The thesis
              conclusion explicitly named the next research step:{" "}
              <em>
                that competition would be best considered through the use of
                game theory, with the mathematical formalism likely to be found
                in models of autonomous agents.
              </em>{" "}
              In 2006 the theory was understood but the compute was not there.
              In 2013 the formalism was clearer but autonomous-agent
              implementations remained academic toys. With practical agentic
              AI now available, the implementation tools have caught up at
              last. The 2029 project is the resumption of named research, not a
              hobby waiting for retirement.{" "}
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
