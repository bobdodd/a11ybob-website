import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { ParadiseSubNav } from "@/components/ParadiseSubNav";
import {
  ANALYSERS,
  FAMILY_LABEL,
  findAnalyser,
  sourceUrl,
} from "@/lib/analysers";

export function generateStaticParams() {
  return ANALYSERS.map((a) => ({ slug: a.slug }));
}

export default async function AnalyserPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const analyser = findAnalyser(slug);
  if (!analyser) notFound();

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
            <p>
              <small>
                <Link href="/paradise/analysers">← All analysers</Link>{" "}
                · <span className="muted">{FAMILY_LABEL[analyser.family]}</span>
              </small>
            </p>
            <h1>{analyser.name}</h1>
            <p className="lede">{analyser.summary}</p>
          </header>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>What it detects</h2>
            <p>{analyser.description}</p>
          </section>

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>WCAG criteria</h2>
            <ul>
              {analyser.wcag.map((c) => (
                <li key={c.criterion}>
                  <strong>{c.criterion}</strong> — {c.title}
                </li>
              ))}
            </ul>
          </section>

          {analyser.example && (
            <section
              className="stack"
              style={{ "--space": "var(--s0)" } as CSSProperties}
            >
              <h2>Example</h2>
              <pre>
                <code>{analyser.example.code}</code>
              </pre>
              <p>
                <strong>Paradise reports:</strong>{" "}
                {analyser.example.report}
              </p>
            </section>
          )}

          <section
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h2>Source</h2>
            <p>
              <a href={sourceUrl(analyser)}>
                <code>{analyser.sourcePath}</code>
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
                <Link href="/paradise/analysers">All analysers</Link>
              </li>
              <li>
                <Link href="/paradise/architecture">Architecture</Link>
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
