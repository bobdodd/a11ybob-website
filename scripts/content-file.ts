/* The content-file format, in one place — shared by export-content.ts (which
 * writes them) and publish-content.ts (which reads them).
 *
 * A piece of long-form writing is ONE file in the repo:
 *
 *     content/experience/<slug>.md
 *     content/article/<slug>.md
 *
 * with YAML front matter carrying the publication metadata and the markdown
 * body below it. The filename IS the slug, so a slug cannot disagree with the
 * record of it.
 *
 * Why a file rather than a per-article script: the previous shape was sixteen
 * gitignored `scripts/tmp-insert-*.ts`, ~60 lines each of which ~36 were
 * identical Mongo boilerplate. Nothing was reviewable, nothing had a history,
 * and one of them (the AI-code-repair piece) carried its whole body INLINE, so
 * that article existed only in Mongo and in an untracked file. Front matter
 * puts the metadata beside the prose it describes and lets `git log` answer
 * "when did this publish, and what changed" in one place.
 *
 * YAML rather than a hand-rolled parser because the titles contain colons and
 * question marks ("How steep is this path? Adding gradient data…"), which is
 * exactly where a quick key:value split goes wrong. */
import { readFileSync } from "fs";
import path from "path";
import yaml from "js-yaml";

export type Kind = "experience" | "article";

export type FrontMatter = {
  title: string;
  publishedAt: Date;
  tags: string[];
  /** Articles only — the broader categorical buckets. See decision 0003. */
  domains?: string[];
  /** Canonical-origin credit: first published elsewhere, a11ybob.com stays canonical. */
  originUrl?: string;
  originLabel?: string;
  /** Disables the mojibake check for this file, and records WHY. A string
   * rather than a boolean so the reason cannot be omitted: the one file that
   * needs it quotes a model's output verbatim, where the mangled characters
   * ARE the subject. See the note in check(). */
  allowMojibake?: string;
};

export type ContentFile = {
  kind: Kind;
  slug: string;
  file: string;
  front: FrontMatter;
  body: string;
};

const FM = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Whatever Mongo holds -> a Date. Older documents carry publishedAt as an
 * ISO STRING rather than a BSON date, and one of them stopped the first export
 * run dead. Coerce rather than assume; refuse only if it is unusable. */
export function asDate(v: unknown): Date {
  const d = v instanceof Date ? v : new Date(String(v ?? ""));
  if (Number.isNaN(d.getTime())) throw new Error(`unparseable date: ${JSON.stringify(v)}`);
  return d;
}

/** Serialise to the on-disk form. Block-style YAML: it diffs a line per tag. */
export function render(front: FrontMatter, body: string): string {
  const ordered: Record<string, unknown> = { title: front.title };
  ordered.publishedAt = asDate(front.publishedAt).toISOString().slice(0, 10);
  if (front.originUrl) ordered.originUrl = front.originUrl;
  if (front.originLabel) ordered.originLabel = front.originLabel;
  if (front.allowMojibake) ordered.allowMojibake = front.allowMojibake;
  if (front.domains?.length) ordered.domains = front.domains;
  ordered.tags = front.tags;
  // forceQuotes so the output does not depend on the js-yaml version deciding
  // when a scalar "needs" quoting. The bootstrap export ran on the VPS against
  // js-yaml 4.1.1 while this machine has 5.4.1, and the two disagreed on
  // exactly one thing — '2025-01-08' versus "2025-01-08" — which made every
  // one of the 32 files fail the round-trip check. A format that renders
  // differently per machine silently rewrites Bob's prose on the next export.
  const fm = yaml.dump(ordered, { lineWidth: -1, noRefs: true, quotingType: '"', forceQuotes: true });
  return `---\n${fm}---\n\n${body.trim()}\n`;
}

/** Read and validate one content file. Throws with the file named. */
export function parse(file: string): ContentFile {
  const raw = readFileSync(file, "utf8");
  const m = FM.exec(raw);
  if (!m) throw new Error(`${file}: no YAML front matter (expected a leading --- block)`);

  const parsed = yaml.load(m[1]);
  if (!parsed || typeof parsed !== "object") throw new Error(`${file}: front matter is not a mapping`);
  const f = parsed as Record<string, unknown>;

  const dir = path.basename(path.dirname(file));
  if (dir !== "experience" && dir !== "article") {
    throw new Error(`${file}: must live under content/experience/ or content/article/`);
  }
  const kind: Kind = dir;
  const slug = path.basename(file, ".md");
  if (!SLUG_RE.test(slug)) throw new Error(`${file}: "${slug}" is not a valid slug (lower-case, digits, single hyphens)`);

  const title = f.title;
  if (typeof title !== "string" || !title.trim()) throw new Error(`${file}: title is required`);

  // js-yaml parses an unquoted YYYY-MM-DD as a Date already; accept a string too.
  const pa = f.publishedAt;
  const publishedAt = pa instanceof Date ? pa : new Date(String(pa));
  if (Number.isNaN(publishedAt.getTime())) throw new Error(`${file}: publishedAt is missing or unparseable`);

  // Empty tags are LEGAL. Decision 0003: "Empty by default — Bob will tag in
  // the CMS", and 17 of the 18 migrated articles have none. An untagged piece
  // renders fine; it just does not appear under a tag facet. Surfaced as a
  // warning in check(), never a refusal — inventing tags to satisfy a
  // validator would be exactly the invented metadata CLAUDE.md forbids.
  const tags = Array.isArray(f.tags) ? f.tags.map(String) : [];

  const domains = Array.isArray(f.domains) ? f.domains.map(String) : undefined;
  if (kind === "experience" && domains) throw new Error(`${file}: domains is an ARTICLE field (decision 0003)`);

  const originUrl = typeof f.originUrl === "string" ? f.originUrl : undefined;
  const originLabel = typeof f.originLabel === "string" ? f.originLabel : undefined;
  if (originLabel && !originUrl) throw new Error(`${file}: originLabel without originUrl`);

  const allowMojibake = typeof f.allowMojibake === "string" ? f.allowMojibake.trim() : undefined;
  if (f.allowMojibake !== undefined && !allowMojibake) {
    throw new Error(`${file}: allowMojibake must be a non-empty reason, not a bare flag`);
  }

  const known = new Set(["title", "publishedAt", "tags", "domains", "originUrl", "originLabel", "allowMojibake"]);
  const unknownKeys = Object.keys(f).filter((k) => !known.has(k));
  if (unknownKeys.length) throw new Error(`${file}: unknown front-matter key(s): ${unknownKeys.join(", ")}`);

  const body = raw.slice(m[0].length).trim();
  if (!body) throw new Error(`${file}: empty body`);

  return { kind, slug, file, front: { title, publishedAt, tags, domains, originUrl, originLabel, allowMojibake }, body };
}

/* ── Body checks ────────────────────────────────────────────────────────────
 * Every one of these is a bug that actually reached the site or was caught in
 * review. They are cheap here and expensive once published. */

export type Problem = { level: "error" | "warning"; message: string };

export function check(cf: ContentFile, publicDir: string): Problem[] {
  const p: Problem[] = [];
  const { body } = cf;

  if (cf.front.tags.length === 0) {
    p.push({ level: "warning", message: "no tags — the piece will not appear under any tag facet" });
  }

  // NOTE: a level-1 heading in the body is LEGAL and is not checked. Both
  // readers detect it (`hasOwnTitle` / `articleHasOwnTitle`) and suppress
  // their own <h1>, so the markdown is treated as self-framing. Verified
  // against the live site: one <h1> per page either way. An earlier version of
  // this file refused it and would have rejected 18 published essays.

  // react-markdown is configured with rehypeRaw and NO remark-gfm, so a pipe
  // table renders as literal pipes. Raw <table> passes through and picks up
  // the element-level styling in base.css.
  if (/^\s*\|.*\|\s*$/m.test(body) && /^\s*\|[\s:|-]+\|\s*$/m.test(body)) {
    p.push({ level: "error", message: "markdown table will NOT render (no remark-gfm) — use a raw <table> with a <caption>" });
  }

  // UTF-8 read as cp1252/Latin-1. Arrived once in a hand-off and would have
  // gone through the whole prose unnoticed.
  //
  // Not always a defect, which is why the opt-out exists rather than a
  // downgrade to a warning. `local-ai-models-to-evaluate-web-pages` quotes a
  // language-detection model VERBATIM, and the mangled characters are planted
  // defects in the test page the model was reading — the paragraph after the
  // quotation says so and comments on them. Correcting them would falsify the
  // quotation and delete the article's point. So: keep the check hard, and
  // require an author's written reason to disable it per file.
  const mojibake = cf.front.allowMojibake ? null : body.match(/[ÂÃ]\S|â€|â€™|â€"/g);
  if (mojibake) {
    p.push({ level: "error", message: `looks mojibake-encoded (${mojibake.length} sequence(s), e.g. ${JSON.stringify(mojibake[0])}) — UTF-8 read as Latin-1` });
  }

  // Every local image must exist, or the page publishes with a broken figure
  // whose alt text still reads as complete to a screen reader.
  for (const m of body.matchAll(/!\[[^\]]*\]\((\/[^)\s]+)\)/g)) {
    const rel = m[1].replace(/^\//, "");
    try {
      readFileSync(path.join(publicDir, rel));
    } catch {
      p.push({ level: "error", message: `image not found in public/: ${m[1]}` });
    }
  }

  // Alt text is not optional here.
  for (const m of body.matchAll(/!\[\s*\]\(([^)\s]+)\)/g)) {
    p.push({ level: "error", message: `image has empty alt text: ${m[1]}` });
  }

  // Bob's house style for published prose. A warning, not a refusal — the
  // author decides, but it should never pass unnoticed.
  const emdashes = (body.match(/—/g) ?? []).length;
  if (emdashes > 0) p.push({ level: "warning", message: `${emdashes} em-dash(es) in the body — house style is none` });

  if (/\b(we|our|us)\b/i.test(body.replace(/^>.*$/gm, ""))) {
    p.push({ level: "warning", message: 'first-person plural ("we"/"our"/"us") — house voice is first-person singular' });
  }

  return p;
}
