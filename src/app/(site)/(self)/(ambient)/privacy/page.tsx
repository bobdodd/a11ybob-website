import Link from "next/link";
import type { CSSProperties } from "react";

export default function Privacy() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Privacy</h1>
            <p className="muted">
              <small>Last reviewed: 2026-05-05.</small>
            </p>
          </header>

          <p className="lede">
            This site does not track you. There is no analytics. There are
            no advertising trackers. There are no third-party scripts that
            phone home with your behaviour.
          </p>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Cookies</h2>
            <p>
              The site sets no cookies for identification, personalisation,
              or analytics. If a cookie ever becomes necessary for a
              specific feature (a future content-management surface, for
              example, would need a session cookie for login), it will be
              listed here and limited to the surface that requires it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Server logs</h2>
            <p>
              The web server keeps short-lived operational logs (request
              method, path, response status, user-agent string) for
              debugging and abuse-mitigation purposes. These logs are not
              correlated with anything else, are not shared with any
              third party, and are rotated regularly.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Hosting</h2>
            <p>
              The site is hosted on OVHcloud at their Gravelines data
              centre. All operational data is resident in the European
              Union under EU jurisdiction.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Email</h2>
            <p>
              Email sent to the address on the{" "}
              <Link href="/contact">contact page</Link> is read by Bob and
              not shared with anyone else. Replies, if any, come from the
              same address.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>External links and embeds</h2>
            <p>
              Outbound links to LinkedIn, Mastodon, Threads, GitHub, and
              other services do not load anything from those services
              until you click. Where the site embeds external content (it
              currently does not), the source and the privacy implications
              will be noted next to the embed.
            </p>
          </section>

          <p>
            <small>
              If anything on this page becomes inaccurate, it will be
              updated and the &ldquo;Last reviewed&rdquo; date will
              change.
            </small>
          </p>
        </div>
      </div>
    </main>
  );
}
