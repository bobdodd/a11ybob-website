import Link from "next/link";
import type { CSSProperties } from "react";
import { SiteShell } from "@/components/SiteShell";

export default function NotFound() {
  return (
    <SiteShell zone="self">
      <main id="main" className="site-main" data-zone="self">
        <div className="center">
          <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
            <header>
              <h1>Not found</h1>
              <p style={{ fontSize: "var(--s1)", color: "var(--ink-muted)" }}>
                The page you asked for does not exist on this site.
              </p>
            </header>

            <p>
              It may have been moved, renamed, or never have existed in
              the first place. If you arrived from a link on another
              site, that link is now wrong and the site owner would
              probably like to know.
            </p>

            <section
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <h2>Useful destinations</h2>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/writing">Writing</Link> — long-form essays
                </li>
                <li>
                  <Link href="/about">About</Link> — the 50-year arc
                </li>
                <li>
                  <Link href="/contact">Contact</Link> — if you suspect the
                  link you followed is broken
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
