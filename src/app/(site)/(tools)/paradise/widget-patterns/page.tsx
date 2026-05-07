import Link from "next/link";
import type { CSSProperties } from "react";
import { ParadiseSubNav } from "@/components/ParadiseSubNav";
import {
  WIDGET_PATTERNS,
  CATEGORY_LABEL,
  patternsByCategory,
} from "@/lib/widget-patterns";

export default function ParadiseWidgetPatterns() {
  const cats = patternsByCategory();

  return (
    <main id="main" className="site-main" data-zone="tools">
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
            <h1>Widget patterns</h1>
            <p className="lede">
              The {WIDGET_PATTERNS.length} canonical WAI-ARIA widget
              patterns from the WAI-ARIA Authoring Practices Guide.
              Paradise&rsquo;s{" "}
              <Link href="/paradise/analysers/widget-pattern">
                WidgetPatternAnalyzer
              </Link>{" "}
              detects which pattern an element is attempting and
              reports incomplete or incorrect implementations. Each
              page summarises the pattern&rsquo;s expected roles,
              states, properties, keyboard interactions, and the
              WCAG criteria it engages.
            </p>
          </header>

          {cats.map(({ category, patterns }) => (
            <section
              key={category}
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <h2>{CATEGORY_LABEL[category]}</h2>
              <dl
                className="stack"
                style={{ "--space": "var(--s0)" } as CSSProperties}
              >
                {patterns.map((p) => (
                  <div
                    key={p.slug}
                    className="stack"
                    style={{ "--space": "var(--s-2)" } as CSSProperties}
                  >
                    <dt className="result-card-term">
                      <Link href={`/paradise/widget-patterns/${p.slug}`}>
                        {p.name}
                      </Link>
                    </dt>
                    <dd className="result-card-definition">{p.summary}</dd>
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
                <Link href="/paradise/analysers/widget-pattern">
                  WidgetPatternAnalyzer
                </Link>{" "}
                — the analyser that validates these patterns.
              </li>
              <li>
                <a href="https://www.w3.org/WAI/ARIA/apg/">
                  WAI-ARIA Authoring Practices Guide
                </a>{" "}
                — the canonical reference these pages summarise.
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
