import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ParadiseSubNav } from "@/components/ParadiseSubNav";
import {
  WIDGET_PATTERNS,
  CATEGORY_LABEL,
  findPattern,
} from "@/lib/widget-patterns";

export function generateStaticParams() {
  return WIDGET_PATTERNS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pattern = findPattern(slug);
  return { title: pattern ? pattern.name : "Widget patterns" };
}

export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = findPattern(slug);
  if (!pattern) notFound();

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
            <p>
              <small>
                <Link href="/paradise/widget-patterns">← All patterns</Link>{" "}
                · <span className="muted">{CATEGORY_LABEL[pattern.category]}</span>
              </small>
            </p>
            <h1>{pattern.name}</h1>
            <p className="lede">{pattern.summary}</p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Pattern</h2>
            <p>{pattern.description}</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Roles</h2>
            <ul>
              {pattern.roles.map((r) => (
                <li key={r}>
                  <code>{r}</code>
                </li>
              ))}
            </ul>
          </section>

          {pattern.statesAndProps.length > 0 && (
            <section
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <h2>States and properties</h2>
              <dl
                className="stack"
                style={{ "--space": "var(--s-1)" } as CSSProperties}
              >
                {pattern.statesAndProps.map((sp) => (
                  <div
                    key={sp.name}
                    className="stack"
                    style={{ "--space": "var(--s-2)" } as CSSProperties}
                  >
                    <dt>
                      <code>{sp.name}</code>
                    </dt>
                    <dd className="result-card-definition">{sp.note}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {pattern.keyboard.length > 0 && (
            <section
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <h2>Keyboard interaction</h2>
              <dl
                className="stack"
                style={{ "--space": "var(--s-1)" } as CSSProperties}
              >
                {pattern.keyboard.map((k, i) => (
                  <div
                    key={i}
                    className="stack"
                    style={{ "--space": "var(--s-2)" } as CSSProperties}
                  >
                    <dt>
                      <kbd>{k.keys}</kbd>
                    </dt>
                    <dd className="result-card-definition">{k.behaviour}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>WCAG criteria</h2>
            <ul>
              {pattern.wcag.map((c) => (
                <li key={c.criterion}>
                  <strong>{c.criterion}</strong> — {c.title}
                </li>
              ))}
            </ul>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Canonical reference</h2>
            <p>
              <a href={pattern.apg}>
                WAI-ARIA Authoring Practices Guide — {pattern.name}
              </a>
            </p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>More</h2>
            <ul>
              <li>
                <Link href="/paradise/widget-patterns">All patterns</Link>
              </li>
              <li>
                <Link href="/paradise/analysers/widget-pattern">
                  WidgetPatternAnalyzer
                </Link>{" "}
                — the analyser that validates these patterns.
              </li>
              <li>
                <Link href="/paradise">Back to Paradise</Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
