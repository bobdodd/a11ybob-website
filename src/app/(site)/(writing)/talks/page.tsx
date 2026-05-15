import type { CSSProperties } from "react";

const talks = [
  {
    title: "What Music Knows About Accessibility",
    venue: "LinkedIn (article)",
    date: "May 2026",
    blurb:
      "A long-form essay on what the music-accessibility literature has worked out, and what the rest of design has been slow to learn from it.",
  },
  {
    title: "The $10 Audit",
    venue: "a11yTO",
    date: "2022",
    blurb:
      "Why digital accessibility is so expensive, and how to fix it. Role-specific recommendations for designers, developers, and testers — grounded in the observation that remediation after UAT is the single biggest cost driver.",
  },
  {
    title: "An Introduction to Accessibility for Developers",
    venue: "YouTube",
    date: "2022",
    blurb:
      "An autobiographical-and-technical introduction. Where the work came from, and what working accessibility-aware engineering looks like day to day.",
  },
  {
    title: "The CISNA Model of Accessible Adaptive Hypermedia",
    venue: "W4A 2008",
    date: "April 2008",
    blurb:
      "With Steve Green and Elaine Pearson. Peer-reviewed; in the ACM Digital Library (doi:10.1145/1368044.1368052). Rebuilds the Dexter Model of hypertext for an era of script-heavy, AJAX-driven content.",
  },
  {
    title: "User Capability in an Adaptive World",
    venue: "Adaptive Hypermedia conference / journal piece",
    date: "2009",
    blurb:
      "With Steve Green and Elaine Pearson. The four-model architecture (Capability, Capacity, Preference, Requirement) that operationalises intrinsic accessibility. Discloses the author's own mild deuteranomalia as one of the named users the framework was tested against.",
  },
  {
    title:
      "20 Years On: the Dexter Model of Hypertext and its impact on web accessibility",
    venue: "ACM SIGACCESS Newsletter",
    date: "2008",
    blurb:
      "Critiques the Dexter Reference Model and its descendant HTML for being structured around the printer's view of a book rather than the author's or the reader's. Proposes the five-layer alternative that became the CISNA Model.",
  },
  {
    title:
      "The Effectiveness of Self-Adapting User Interfaces as Assistive Technology for Handheld Mobile Devices",
    venue: "Short paper, conference proceedings",
    date: "2006",
    blurb:
      "The seed of the 2029 framework, in print. Argues for intrinsic accessibility (built into the underlying interface) over functional accessibility (bolt-on assistive tech grafted onto a standard interface). Names the formal next step: a definition of intrinsic accessibility using formal methods and game theory.",
  },
];

export default function Talks() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Talks</h1>
            <p className="lede">
              Public talks and peer-reviewed writing in talk-shaped
              form. Reverse-chronological.
            </p>
          </header>

          <ul
            className="list-flat stack"
            style={{ "--space": "var(--s2)" } as CSSProperties}
          >
            {talks.map((t) => (
              <li key={t.title}>
                <article
                  className="stack"
                  style={{ "--space": "var(--s-1)" } as CSSProperties}
                >
                  <h2 className="search-results-heading">{t.title}</h2>
                  <p className="flush muted">
                    <small>
                      {t.venue} · {t.date}
                    </small>
                  </p>
                  <p className="flush">{t.blurb}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
