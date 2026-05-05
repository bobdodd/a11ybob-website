import type { CSSProperties } from "react";

export default function Contact() {
  return (
    <main id="main" className="site-main" data-zone="self">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s1)" } as CSSProperties}>
          <h1>Contact</h1>
          <p>
            <a href="mailto:hello@a11ybob.com">hello@a11ybob.com</a>
          </p>
          <ul
            className="cluster"
            style={{
              "--space": "var(--s1)",
              listStyle: "none",
              paddingInlineStart: 0,
            } as CSSProperties}
          >
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
          <p>
            <small>
              For technical questions about Paradise, GitHub Issues is faster
              than email.
            </small>
          </p>
          <p>
            <small>I read everything; I reply to most things.</small>
          </p>
        </div>
      </div>
    </main>
  );
}
