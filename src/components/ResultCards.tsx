/* Result-card components for each search corpus. Each card renders
 * the same way regardless of whether it appears on its own corpus's
 * primary search page or as a cross-corpus inclusion on another
 * page. The host wraps the cards in the appropriate list element.
 *
 * Visual styling lives in components/result-card.css; this file
 * carries only the structural and content concerns. */

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
        className="result-card stack"
        style={{ "--space": "var(--s-1)" } as CSSProperties}
      >
        <H className="result-card-heading">
          <Link href={articleHref}>
            {titleHtml ? (
              <span dangerouslySetInnerHTML={{ __html: titleHtml }} />
            ) : (
              hit.title
            )}
          </Link>
        </H>

        {(hit.publishedAt || hit.domains.length > 0 || hit.tier) && (
          <p>
            {hit.tier && (
              <span className="tier-badge">{tierLabel(hit.tier)}</span>
            )}
            {(hit.publishedAt || hit.domains.length > 0) && (
              <small className="muted">
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
            className="result-card-snippet"
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
        className="result-card stack"
        style={{ "--space": "var(--s-1)" } as CSSProperties}
      >
        <H className="result-card-heading">
          <Link href={`/writing/reviews/${hit._id}`}>
            {titleHtml ? (
              <span dangerouslySetInnerHTML={{ __html: titleHtml }} />
            ) : (
              hit.title
            )}
          </Link>
        </H>
        <p>
          {hit.tier && (
            <span className="tier-badge">{tierLabel(hit.tier)}</span>
          )}
          <small className="muted">
            {hit.authors.length > 0 && <>{hit.authors.join(", ")} · </>}
            {hit.year && <>{hit.year}</>}
            {hit.publication && <> · {hit.publication}</>}
          </small>
        </p>
        {snippetHtml ? (
          <p
            className="result-card-snippet"
            dangerouslySetInnerHTML={{ __html: snippetHtml }}
          />
        ) : (
          hit.summary && <p>{truncate(hit.summary, 280)}</p>
        )}
        {hit.tags.length > 0 && (
          <p>
            <small className="muted">{hit.tags.slice(0, 5).join(" · ")}</small>
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
      <dt className="result-card-term">
        <Link href={`/writing/glossary/${entry._id}`}>
          {termHtml ? (
            <span dangerouslySetInnerHTML={{ __html: termHtml }} />
          ) : (
            entry.term
          )}
        </Link>
        {entry.aka.length > 0 && (
          <span className="result-card-aka">
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
      <dd className="result-card-definition">
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
