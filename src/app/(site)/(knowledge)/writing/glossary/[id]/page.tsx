import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { getGlossaryById } from "@/lib/glossary";
import { WritingSubNav } from "@/components/WritingSubNav";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = await getGlossaryById(id);
  return { title: entry ? entry.term : "Glossary" };
}

export default async function GlossaryEntry({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getGlossaryById(id);
  if (!entry) notFound();

  return (
    <main id="main" className="site-main">
      <div className="center">
        <div className="stack" style={{ "--space": "var(--s2)" } as CSSProperties}>
          <WritingSubNav />
          <p>
            <small>
              <Link href="/writing/glossary">← All terms</Link>
            </small>
          </p>

          <header className="stack" style={{ "--space": "var(--s0)" } as CSSProperties}>
            <h1>{entry.term}</h1>
            {entry.aka.length > 0 && (
              <p className="muted">
                Also known as: {entry.aka.join(", ")}
              </p>
            )}
          </header>

          <div className="preserve-whitespace">{entry.definition}</div>

          {entry.category.length > 0 && (
            <p className="flush">
              <strong>Category:</strong>{" "}
              {entry.category.map((c, i) => (
                <span key={c}>
                  {i > 0 && " · "}
                  <Link href={`/writing/glossary?category=${encodeURIComponent(c)}`}>
                    {c}
                  </Link>
                </span>
              ))}
            </p>
          )}

          {entry.related_terms.length > 0 && (
            <p className="flush">
              <strong>Related:</strong> {entry.related_terms.join(" · ")}
            </p>
          )}

          {entry.sources.length > 0 && (
            <section>
              <h2 className="lede">Sources</h2>
              <ul>
                {entry.sources.map((s) => (
                  <li key={s}>
                    {/^https?:\/\//.test(s) ? <a href={s}>{s}</a> : s}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
