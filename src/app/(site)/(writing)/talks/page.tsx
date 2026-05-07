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
    title: "The Carnforth Model of Accessible Adaptive Hypermedia",
    venue: "W4A 2010",
    date: "April 2010",
    blurb:
      "With Steve Green and Elaine Pearson. Peer-reviewed; in the ACM Digital Library. Rebuilds the Dexter Model of hypertext for an era of script-heavy, AJAX-driven content.",
  },
];

export default function Talks() {
  return (
    <main id="main" className="site-main" data-zone="writing">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Talks</h1>
            <p className="lede">
              Public talks and writing in talk-shaped form.
              Reverse-chronological. Older SIGACCESS pieces from the late
              2000s are not yet listed here.
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
