import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ParadiseSubNav } from "@/components/ParadiseSubNav";
import { ANALYSERS, FAMILY_LABEL, analysersByFamily } from "@/lib/analysers";

export const metadata: Metadata = {
  title: "Analysers",
};

export default function ParadiseAnalysers() {
  const families = analysersByFamily();

  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <ParadiseSubNav />
          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>Analysers</h1>
            <p className="lede">
              The {ANALYSERS.length} accessibility analysers that ship
              with Paradise. Each takes the integrated DocumentModel
              &mdash; HTML plus the ActionLanguage intermediate
              representation (IR) plus CSS, see{" "}
              <Link href="/paradise/architecture">Architecture</Link>{" "}
              &mdash; and reports a specific class of issue. Pick any to see
              what it detects, the WCAG criteria it maps to, and a short
              broken-code example.
            </p>
          </header>

          {families.map(({ family, analysers }) => (
            <section
              key={family}
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <h2>{FAMILY_LABEL[family]}</h2>
              <dl
                className="stack"
                style={{ "--space": "var(--s0)" } as CSSProperties}
              >
                {analysers.map((a) => (
                  <div
                    key={a.slug}
                    className="stack"
                    style={{ "--space": "var(--s-2)" } as CSSProperties}
                  >
                    <dt className="result-card-term">
                      <Link href={`/paradise/analysers/${a.slug}`}>
                        {a.name}
                      </Link>
                    </dt>
                    <dd className="result-card-definition">{a.summary}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Reading on</h2>
            <ul>
              <li>
                <Link href="/paradise/architecture">Architecture</Link>{" "}
                — how the analysers consume the integrated DocumentModel.
              </li>
              <li>
                <Link href="/paradise/action-language">
                  ActionLanguage IR
                </Link>{" "}
                — the JavaScript representation the analysers reason
                over.
              </li>
              <li>
                <Link href="/paradise">Back to Paradise</Link>.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
