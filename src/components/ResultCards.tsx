/* Result-card components for each search corpus. Each card renders
 * the same way regardless of whether it appears on its own corpus's
 * primary search page or as a cross-corpus inclusion on another
 * page. The host wraps the cards in the appropriate list element. */

import Link from "next/link";
import type { CSSProperties } from "react";
import type { ArticleHit } from "@/lib/articles";
import type { Review } from "@/lib/reviews";
import type { GlossaryEntry } from "@/lib/glossary";
import { renderSnippet } from "@/lib/searchHighlight";
import { tierLabel } from "@/lib/searchTier";

type HeadingLevel = "h2" | "h3";

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

/* ───── Article ─────────────────────────────────────────────────── */

export function ArticleResultCard({
  hit,
  q,
  headingLevel: H = "h2",
}: {
  hit: ArticleHit;
  q?: string;
  headingLevel?: HeadingLevel;
}) {
  const searching = Boolean(q);
  const articleHref = q
    ? `/writing/${hit.slug}?q=${encodeURIComponent(q)}`
    : `/writing/${hit.slug}`;
  const titleHtml =
    searching && hit.highlights.title?.[0]
      ? renderSnippet(hit.highlights.title[0])
      : null;
  const contentFragments = hit.highlights.content ?? [];

  return (
    <li>
      <article
        className="stack"
        style={{ "--space": "var(--s-1)" } as CSSProperties}
      >
        <H style={{ marginBlock: 0, fontSize: "var(--s1)" }}>
          <Link href={articleHref}>
            {titleHtml ? (
              <span dangerouslySetInnerHTML={{ __html: titleHtml }} />
            ) : (
              hit.title
            )}
          </Link>
        </H>

        {(hit.publishedAt || hit.domains.length > 0 || hit.tier) && (
          <p style={{ marginBlock: 0 }}>
            {hit.tier && (
              <span className="tier-badge">{tierLabel(hit.tier)}</span>
            )}
            {(hit.publishedAt || hit.domains.length > 0) && (
              <small
                style={{
                  color: "var(--ink-muted)",
                  marginInlineStart: hit.tier ? "var(--s-1)" : 0,
                }}
              >
                {[
                  hit.publishedAt &&
                    new Date(hit.publishedAt).toISOString().slice(0, 10),
                  hit.domains.length > 0 && hit.domains.join(" · "),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </small>
            )}
          </p>
        )}

        {searching && contentFragments.length > 0 && (
          <div
            style={{ marginBlock: 0 }}
            dangerouslySetInnerHTML={{
              __html: contentFragments.map(renderSnippet).join(" … "),
            }}
          />
        )}
      </article>
    </li>
  );
}

/* ───── Review ──────────────────────────────────────────────────── */

export function ReviewResultCard({
  hit,
  headingLevel: H = "h2",
}: {
  hit: Review;
  headingLevel?: HeadingLevel;
}) {
  const titleHtml = hit.highlights?.title?.[0]
    ? renderSnippet(hit.highlights.title[0])
    : null;
  const summaryFrags = hit.highlights?.summary ?? [];
  const findingsFrags = hit.highlights?.key_findings ?? [];
  const snippetHtml =
    summaryFrags.length > 0
      ? summaryFrags.map(renderSnippet).join(" … ")
      : findingsFrags.length > 0
        ? findingsFrags.map(renderSnippet).join(" … ")
        : null;

  return (
    <li>
      <article
        className="stack"
        style={{ "--space": "var(--s-1)" } as CSSProperties}
      >
        <H style={{ marginBlock: 0, fontSize: "var(--s1)" }}>
          <Link href={`/writing/reviews/${hit._id}`}>
            {titleHtml ? (
              <span dangerouslySetInnerHTML={{ __html: titleHtml }} />
            ) : (
              hit.title
            )}
          </Link>
        </H>
        <p style={{ marginBlock: 0 }}>
          {hit.tier && (
            <span className="tier-badge">{tierLabel(hit.tier)}</span>
          )}
          <small
            style={{
              color: "var(--ink-muted)",
              marginInlineStart: hit.tier ? "var(--s-1)" : 0,
            }}
          >
            {hit.authors.length > 0 && <>{hit.authors.join(", ")} · </>}
            {hit.year && <>{hit.year}</>}
            {hit.publication && <> · {hit.publication}</>}
          </small>
        </p>
        {snippetHtml ? (
          <p
            style={{ marginBlock: 0 }}
            dangerouslySetInnerHTML={{ __html: snippetHtml }}
          />
        ) : (
          hit.summary && (
            <p style={{ marginBlock: 0 }}>{truncate(hit.summary, 280)}</p>
          )
        )}
        {hit.tags.length > 0 && (
          <p style={{ marginBlock: 0 }}>
            <small style={{ color: "var(--ink-muted)" }}>
              {hit.tags.slice(0, 5).join(" · ")}
            </small>
          </p>
        )}
      </article>
    </li>
  );
}

/* ───── Glossary ────────────────────────────────────────────────── */

/* Returns a <dt>/<dd> pair — caller wraps in <dl>. */
export function GlossaryResultCard({ entry }: { entry: GlossaryEntry }) {
  const termHtml = entry.highlights?.term?.[0]
    ? renderSnippet(entry.highlights.term[0])
    : null;
  const akaHtml = entry.highlights?.aka?.length
    ? entry.highlights.aka.map(renderSnippet).join(", ")
    : null;
  const defHtml = entry.highlights?.definition?.length
    ? entry.highlights.definition.map(renderSnippet).join(" … ")
    : null;

  return (
    <>
      <dt style={{ fontSize: "var(--s1)", fontWeight: 600 }}>
        <Link href={`/writing/glossary/${entry._id}`}>
          {termHtml ? (
            <span dangerouslySetInnerHTML={{ __html: termHtml }} />
          ) : (
            entry.term
          )}
        </Link>
        {entry.aka.length > 0 && (
          <span
            style={{
              marginInlineStart: "var(--s-1)",
              color: "var(--ink-muted)",
              fontWeight: 400,
              fontSize: "var(--s-1)",
            }}
          >
            {akaHtml ? (
              <>
                (also:{" "}
                <span dangerouslySetInnerHTML={{ __html: akaHtml }} />)
              </>
            ) : (
              <>(also: {entry.aka.slice(0, 3).join(", ")})</>
            )}
          </span>
        )}
      </dt>
      <dd style={{ marginInlineStart: 0 }}>
        {entry.tier && (
          <>
            <span className="tier-badge">{tierLabel(entry.tier)}</span>{" "}
          </>
        )}
        {defHtml ? (
          <span dangerouslySetInnerHTML={{ __html: defHtml }} />
        ) : (
          truncate(entry.definition, 280)
        )}
      </dd>
    </>
  );
}
