import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-chrome center">
        <div
          className="stack"
          style={{ "--space": "var(--s1)" } as React.CSSProperties}
        >
          <nav aria-label="Site">
            <ul
              className="nav-list cluster"
              style={{ "--space": "var(--s1)" } as React.CSSProperties}
            >
              <li>
                <Link href="/now">Now</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/accessibility">Accessibility</Link>
              </li>
              <li>
                <Link href="/colophon">Colophon</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Elsewhere">
            <ul
              className="nav-list cluster"
              style={{ "--space": "var(--s1)" } as React.CSSProperties}
            >
              <li>
                <a
                  href="https://www.linkedin.com/in/robert-dodd-54981159/"
                  rel="me"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://mastodon.social/@accessBob" rel="me">
                  Mastodon
                </a>
              </li>
              <li>
                <a href="https://www.threads.net/@a11y_bob" rel="me">
                  Threads
                </a>
              </li>
              <li>
                <a href="https://github.com/bobdodd" rel="me">
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
          <small>
            © 2026 Bob Dodd. Source under the{" "}
            <a href="https://www.gnu.org/licenses/gpl-3.0.html">GPL v3</a>;
            writing under{" "}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/">
              CC BY-SA 4.0
            </a>
            . See <Link href="/colophon">colophon</Link>.
          </small>
        </div>
      </div>
    </footer>
  );
}
