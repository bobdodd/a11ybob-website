import Link from "next/link";
import type { CSSProperties } from "react";

export default function About() {
  return (
    <main id="main" className="site-main" data-zone="writing">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s1)" } as CSSProperties}
          >
            <h1>About</h1>
            <p style={{ fontSize: "var(--s1)" }}>
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
              In the early 2000s, a cousin&rsquo;s diagnosis with multiple
              sclerosis became the family motivation that turned the
              technical work toward accessibility. Bob enrolled at Teesside
              one day a week for an MSc in Multimedia Applications; the
              thesis was on mobile accessibility for people with MS. The
              MSc became a PhD candidacy.
            </p>
            <p>
              The doctoral research at Teesside ran from 2004 to 2013, on
              the effectiveness of self-adapting user interfaces as
              assistive technology in hand-held mobile devices. Most of the
              writing was completed and several peer-reviewed papers
              published from the work, including the W4A 2010 paper{" "}
              <em>The Carnforth Model of Accessible Adaptive Hypermedia</em>{" "}
              (with Steve Green and Elaine Pearson). The viva was never
              taken — largely because CNIB and CELA happened. Three pieces
              of original conceptual work survived from the period and are
              still load-bearing for current writing: the Carnforth Model
              itself; Polymorphic Task Deconstruction, a way of describing
              multiple manipulations of the same data so a capability model
              can choose between them; and Tetris as accessibility
              testbed, which turned out to be the most teachable artefact
              of the entire period.
            </p>
            <p>
              In 2008 Bob and his husband moved from the UK to Canada when
              the latter joined BlackBerry in Waterloo. The PhD candidacy
              continued formally for another five years; the centre of
              gravity shifted.
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
              accessibility arm. Active consulting projects in flight,
              development of autoA11y for the Revenue Quebec RFI, ongoing
              audit, lived user testing, and remediation work. In parallel,
              and on personal time,{" "}
              <Link href="/paradise">Paradise</Link> — a multi-model
              accessibility analyser whose technical contribution is the
              ActionLanguage intermediate representation, a
              JavaScript-to-semantic-tree transcoder that lets analysis
              reason about runtime behaviour at the source level.
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
              advocate, negotiate, and respond. In 2006 the theory was
              understood but the compute was not there. With practical
              agentic AI, the implementation tools have caught up. The
              plan is to take this work back up in 2029.
            </p>
          </section>

          <p style={{ fontSize: "var(--s1)" }}>
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
