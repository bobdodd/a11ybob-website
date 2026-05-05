import type { CSSProperties } from "react";

const talks = [
  {
    title: "The $10 Audit",
    venue: "Internal CNIB session, then various",
    date: "2024",
    blurb:
      "What you can find in ten dollars of practitioner time, and why that matters for procurement.",
  },
  {
    title: "Accessibility for Developers — A Working Introduction",
    venue: "YouTube",
    date: "2023",
    blurb:
      "The introductory series. Accessible by design, not by retrofit.",
  },
  {
    title: "Carnforth: Adaptive Hypermedia for the Cognitive Edge",
    venue: "W4A",
    date: "2010",
    blurb:
      "The W4A paper that came out of the doctoral work at Teesside.",
  },
];

export default function Talks() {
  return (
    <main id="main" className="site-main" data-zone="writing">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header>
            <h1>Talks</h1>
            <p style={{ fontSize: "var(--s1)" }}>
              Slides and recordings, reverse-chronological.
            </p>
          </header>

          <ul
            className="stack"
            style={{
              "--space": "var(--s2)",
              listStyle: "none",
              paddingInlineStart: 0,
            } as CSSProperties}
          >
            {talks.map((t) => (
              <li key={t.title}>
                <article
                  className="stack"
                  style={{ "--space": "var(--s-1)" } as CSSProperties}
                >
                  <h2 style={{ marginBlock: 0, fontSize: "var(--s2)" }}>
                    {t.title}
                  </h2>
                  <p style={{ marginBlock: 0, color: "var(--ink-muted)" }}>
                    <small>
                      {t.venue} · {t.date}
                    </small>
                  </p>
                  <p style={{ marginBlock: 0 }}>{t.blurb}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
