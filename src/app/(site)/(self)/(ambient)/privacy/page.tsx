import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Privacy",
};

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
              <small>Last reviewed: 2026-06-07.</small>
            </p>
          </header>

          <p className="lede">
            This site does not track you across the web. There are no
            advertising trackers, no third-party analytics, no cookies, and
            nothing running in your browser that reports on your behaviour.
            What the site keeps — like every web server — is a short-lived
            log of the requests it receives, with your IP address masked
            before it is written to disk; from those logs I derive aggregate,
            non-identifying statistics. The detail is below.
          </p>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Cookies</h2>
            <p>
              The site sets no cookies for identification, personalisation,
              or analytics — so there is no cookie banner to dismiss, because
              there is nothing to consent to. If a cookie ever becomes
              necessary for a specific feature (a future content-management
              surface, for example, would need a session cookie for login),
              it will be listed here and limited to the surface that requires
              it.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Server logs</h2>
            <p>
              The web server records each request it receives — the method,
              path, response status, and browser user-agent string — with
              your IP address masked at the point of logging: the last part
              of the address is dropped before anything is written to disk, so
              a complete IP is never stored. These raw logs are kept
              short-lived and rotated regularly (a few days at most). From
              them I produce aggregate, non-identifying statistics — which
              pages are read, and which sites people arrive from — to
              understand what is useful here and to gauge potential consulting
              or employment interest. Those aggregate figures contain no
              personal data and are never tied back to an individual. The logs
              are processed on this same server in the EU, shared with no
              third party, and deleted on rotation.
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Map usage</h2>
            <p>
              The accessible-map demos look up your surroundings from the server
              as you use them. Each time they do, the server keeps an aggregate
              tally of the general area being asked about: the location is
              rounded to a coarse cell about five kilometres across and a
              per-area counter is increased by one. No identity, no session, no
              route, and no individual record is stored &mdash; just a running
              count per area, so there is nothing that could be tied back to a
              person, and nothing that could reconstruct where any one person
              went. I use these aggregate counts to see which areas are used
              and, most usefully, where a person&rsquo;s location falls outside
              the mapped regions &mdash; the signal for which places to map
              next.
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
              <Link href="/contact">contact page</Link>{" "}is read by Bob and
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
