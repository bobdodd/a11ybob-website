import Link from "next/link";
import type { CSSProperties } from "react";

export default function Work() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header>
            <h1>Work</h1>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What I&rsquo;m available for</h2>
            <p>
              Audit and remediation engagements. Accessibility strategy
              and design review. Expert testimony and procurement support.
              Training and workshops, particularly on integrating
              accessibility into development process. Advisory and board
              roles.
            </p>
            <p>
              Consulting work alongside the CNIB role is necessarily
              selective — what I can take on is constrained by my
              employment. Broader independent practice opens in 2029, when
              I plan to step back from CNIB to take up the long-arc
              theoretical work full-time.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Who I&rsquo;ve worked with</h2>
            <p>
              CNIB, where I am Head of Accessibility at the Access Labs
              commercial arm. CELA — co-designed and led the
              implementation of the Centre for Equitable Library Access
              that succeeded the original CNIB Library. As Director of
              Delivery at Digita11y Accessible Inc., a SaaS-era audit
              consultancy, with George Brown College, Centennial College,
              the Co-operators, Brookfield Properties, and Philip Morris.
            </p>
            <p>
              Practice, not portfolio. The list is named because clients
              who need to verify the work have asked, not because the
              work is a brochure. I am happy to provide more specific
              detail under NDA where engagement context calls for it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>How to engage</h2>
            <p>
              Email me. Tell me what you&rsquo;re working on, what
              you&rsquo;ve already tried, and what specifically you
              think I can help with. <Link href="/contact">Contact</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
