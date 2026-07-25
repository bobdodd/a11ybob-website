import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Contact",
};

export default function Contact() {
  return (
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s1)" } as CSSProperties}>
          <h1>Contact</h1>
          <p>
            Email is the best way to reach me about consulting work, talks,
            or anything that needs a considered reply.
          </p>
          <p>
            <a href="mailto:bob@a11ybob.com">bob@a11ybob.com</a>
          </p>
          <ul
            className="cluster list-flat"
            style={{ "--space": "var(--s1)" } as CSSProperties}
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
                Mastodon (@accessBob)
              </a>
            </li>
            <li>
              <a href="https://www.threads.net/@a11y_bob" rel="me">
                Threads (@a11y_bob)
              </a>
            </li>
            <li>
              <a href="https://github.com/bobdodd" rel="me">
                GitHub (bobdodd)
              </a>
            </li>
          </ul>
          <p>
            <small>
              For technical questions about{" "}
              <a href="/paradise">Paradise</a>, GitHub Issues is faster than
              email.
            </small>
          </p>
          <p>
            <small>I read everything. I reply to most things.</small>
          </p>
        </div>
      </div>
    </main>
  );
}
