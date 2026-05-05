import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-chrome center">
        <div
          className="stack"
          style={{ "--space": "var(--s1)" } as React.CSSProperties}
        >
          <nav aria-label="Secondary">
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
                <a href="#" rel="me">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" rel="me">
                  Mastodon
                </a>
              </li>
              <li>
                <a href="#" rel="me">
                  Threads
                </a>
              </li>
            </ul>
          </nav>
          <small>
            © 2026 Bob Dodd. This site documents its own design — colophon
            forthcoming.
          </small>
        </div>
      </div>
    </footer>
  );
}
