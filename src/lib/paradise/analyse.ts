/* Wrapper around the Paradise engine. Takes HTML / JavaScript / CSS
 * source strings and returns the integrated analysis results. The
 * engine itself lives in `src/lib/paradise/{analyzers,parsers,models}`
 * — this file just orchestrates a typical analysis pipeline so the
 * Playground UI doesn't have to deal with engine internals. */

// The engine ships as compiled CJS .js files with .d.ts declarations.
// Importing the .js paths directly avoids pulling in a TS rebuild
// step; the .d.ts files give us types for free.
import { HTMLParser } from "./parsers/HTMLParser";
import { JavaScriptParser } from "./parsers/JavaScriptParser";
import { CSSParser } from "./parsers/CSSParser";
import { DocumentModel } from "./models/DocumentModel";
import { BaseAnalyzer, type Issue } from "./analyzers/BaseAnalyzer";

import { MouseOnlyClickAnalyzer } from "./analyzers/MouseOnlyClickAnalyzer";
import { OrphanedEventHandlerAnalyzer } from "./analyzers/OrphanedEventHandlerAnalyzer";
import { MissingAriaConnectionAnalyzer } from "./analyzers/MissingAriaConnectionAnalyzer";
import { VisibilityFocusConflictAnalyzer } from "./analyzers/VisibilityFocusConflictAnalyzer";
import { FocusOrderConflictAnalyzer } from "./analyzers/FocusOrderConflictAnalyzer";
import { KeyboardNavigationAnalyzer } from "./analyzers/KeyboardNavigationAnalyzer";
import { ARIASemanticAnalyzer } from "./analyzers/ARIASemanticAnalyzer";
import { WidgetPatternAnalyzer } from "./analyzers/WidgetPatternAnalyzer";
import { FocusManagementAnalyzer } from "./analyzers/FocusManagementAnalyzer";
import { HeadingStructureAnalyzer } from "./analyzers/HeadingStructureAnalyzer";

export type { Issue } from "./analyzers/BaseAnalyzer";

export type SourceFile = { name: string; content: string };

/* Multi-file input. Each language can carry zero or more source
 * files; each file is named so the engine's diagnostics can point
 * back to the right file. The shape mirrors the upstream
 * playground's EXAMPLES.files. */
export type AnalyseInput = {
  html?: SourceFile[];
  javascript?: SourceFile[];
  css?: SourceFile[];
};

export type AnalyseResult = {
  issues: Issue[];
  /** Number of analysers that ran without throwing. */
  ranAnalysers: number;
  /** Per-analyser errors so we can surface engine bugs without
   *  hiding them. */
  errors: { analyser: string; message: string }[];
};

/* The set of analysers we run by default. Maps to /paradise/analysers
 * sub-pages by slug; the slug is used by the Playground UI to link
 * each issue back to the analyser's documentation. */
const ANALYSERS: { slug: string; ctor: new () => BaseAnalyzer }[] = [
  { slug: "mouse-only-click", ctor: MouseOnlyClickAnalyzer },
  { slug: "orphaned-event-handler", ctor: OrphanedEventHandlerAnalyzer },
  { slug: "missing-aria-connection", ctor: MissingAriaConnectionAnalyzer },
  { slug: "visibility-focus-conflict", ctor: VisibilityFocusConflictAnalyzer },
  { slug: "focus-order-conflict", ctor: FocusOrderConflictAnalyzer },
  { slug: "keyboard-navigation", ctor: KeyboardNavigationAnalyzer },
  { slug: "aria-semantic", ctor: ARIASemanticAnalyzer },
  { slug: "widget-pattern", ctor: WidgetPatternAnalyzer },
  { slug: "focus-management", ctor: FocusManagementAnalyzer },
  { slug: "structural-html", ctor: HeadingStructureAnalyzer },
];

/* Map an Issue back to the slug of the analyser that produced it.
 * Each analyser tags its issues with a `type` string; the mapping is
 * by analyser instance during the run. */
export type IssueWithSlug = Issue & { analyserSlug: string };

/* Stable-order severity / confidence pairs for the UI. The engine
 * uses 'error' | 'warning' | 'info' for severity and
 * 'HIGH' | 'MEDIUM' | 'LOW' for confidence. */
export const SEVERITIES = ["error", "warning", "info"] as const;
export const CONFIDENCES = ["HIGH", "MEDIUM", "LOW"] as const;

/* The engine's Issue.confidence carries a level but not a numeric
 * score. The Playground UI shows a percentage so users can compare
 * issues at a glance — we compute it from the confidence level and
 * the document context. The mapping mirrors the upstream
 * playground: full document gives HIGH→100/MEDIUM→80/LOW→50; body-
 * only and fragment inputs reduce all three. */
export type DocumentContext = "full" | "body" | "fragment";

const CONFIDENCE_SCORE_TABLE: Record<
  DocumentContext,
  Record<(typeof CONFIDENCES)[number], number>
> = {
  full: { HIGH: 100, MEDIUM: 80, LOW: 50 },
  body: { HIGH: 90, MEDIUM: 70, LOW: 45 },
  fragment: { HIGH: 80, MEDIUM: 55, LOW: 40 },
};

export function confidenceScore(
  level: (typeof CONFIDENCES)[number] | undefined,
  context: DocumentContext,
): number | undefined {
  if (!level) return undefined;
  return CONFIDENCE_SCORE_TABLE[context][level];
}

export function analyse(input: AnalyseInput): AnalyseResult & {
  issues: IssueWithSlug[];
} {
  const errors: AnalyseResult["errors"] = [];

  // Each parser produces one model per file; DocumentModel takes
  // arrays for each language and merges across all of them.
  const htmlFiles = input.html?.filter((f) => f.content.trim()) ?? [];
  const jsFiles = input.javascript?.filter((f) => f.content.trim()) ?? [];
  const cssFiles = input.css?.filter((f) => f.content.trim()) ?? [];

  const dom =
    htmlFiles.length === 1
      ? new HTMLParser().parse(htmlFiles[0].content, htmlFiles[0].name)
      : htmlFiles.length > 1
        ? htmlFiles.map((f) =>
            new HTMLParser().parse(f.content, f.name),
          )
        : undefined;
  const al = jsFiles.map((f) =>
    new JavaScriptParser().parse(f.content, f.name),
  );
  const css = cssFiles.map((f) =>
    new CSSParser().parse(f.content, f.name),
  );

  const model = new DocumentModel({
    scope: "page",
    dom,
    javascript: al,
    css,
  });
  model.merge();

  const allIssues: IssueWithSlug[] = [];
  let ranAnalysers = 0;

  for (const { slug, ctor } of ANALYSERS) {
    try {
      const analyser = new ctor();
      const issues = analyser.analyze({
        documentModel: model,
        actionLanguageModel: al[0],
        scope: "page",
      });
      for (const issue of issues) {
        allIssues.push({ ...issue, analyserSlug: slug });
      }
      ranAnalysers += 1;
    } catch (e) {
      errors.push({
        analyser: slug,
        message: (e as Error).message,
      });
    }
  }

  return { issues: allIssues, ranAnalysers, errors };
}
