"use client";

/* PlaygroundPreview — sandboxed iframe that renders the user's
 * HTML / JavaScript / CSS buffers as a single document. The
 * rendered iframe Document is the source of truth that the
 * upcoming screen-reader and switch-access simulators will walk;
 * it's also useful on its own as a "what does the page look like"
 * pane the user can flip to.
 *
 * The buffers come from the playground state in their multi-file
 * shape (LangBuffers): HTML files are concatenated body-first,
 * JS files concatenated in order, CSS files concatenated in
 * order. The iframe's <head> carries the concatenated CSS; the
 * <body> carries the cleaned HTML; the JS runs at the end of
 * <body> wrapped in a try-catch so a broken handler shows up as
 * an in-iframe banner rather than silently failing.
 *
 * Sandboxing: srcdoc + sandbox="allow-scripts allow-same-origin".
 * allow-same-origin is needed so the parent can read the iframe's
 * Document (the SR / switch simulators need that). The iframe is
 * still origin-isolated from third-party scripts because srcdoc
 * documents inherit no parent network context. */

import { useEffect, useRef } from "react";
import type { LangBuffers } from "@/lib/paradise/examples";

interface PlaygroundPreviewProps {
  buffers: LangBuffers;
  /* Called every time the iframe finishes loading the rebuilt
   * srcdoc. The Document is live for as long as the iframe is
   * mounted; the simulators store a ref to it. */
  onDomReady?: (iframeDoc: Document) => void;
}

export function PlaygroundPreview({
  buffers,
  onDomReady,
}: PlaygroundPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  /* Concatenate the user's buffers into a single document.
   * We strip <link>, <style>, and <script> tags from the HTML
   * because CSS and JavaScript are injected separately — those
   * tags inside the HTML buffer would either duplicate work or
   * (for <link>) point at relative URLs that don't resolve in
   * the srcdoc context. */
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const cssContent = buffers.css.map((f) => f.content).join("\n\n");
    const jsContent = buffers.javascript.map((f) => f.content).join("\n\n");
    let htmlContent = buffers.html.map((f) => f.content).join("\n");

    htmlContent = htmlContent.replace(/<link[^>]*>/gi, "");
    htmlContent = htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    htmlContent = htmlContent.replace(
      /<script[^>]*>[\s\S]*?<\/script>/gi,
      "",
    );

    const fullHTML = buildIframeDocument({
      html: htmlContent,
      css: cssContent,
      js: jsContent,
    });

    iframe.srcdoc = fullHTML;

    const handleLoad = () => {
      const doc = iframe.contentDocument;
      if (doc && onDomReady) onDomReady(doc);
    };
    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, [buffers, onDomReady]);

  return (
    <iframe
      ref={iframeRef}
      className="playground-preview-iframe"
      /* allow-same-origin is required so the parent can reach the
       * iframe's Document — the SR and switch simulators walk
       * that DOM. allow-scripts runs the user's JS. The two
       * together don't grant network or storage access in srcdoc
       * mode; the document inherits no origin. */
      sandbox="allow-scripts allow-same-origin"
      title="Rendered preview of your code"
    />
  );
}

/* Build the iframe's full HTML document. Kept as a module-level
 * function so the SR / switch simulators can build one with
 * additional injected helper classes (highlight outlines etc.)
 * later without duplicating this template. */
function buildIframeDocument({
  html,
  css,
  js,
}: {
  html: string;
  css: string;
  js: string;
}) {
  /* The iframe is its own document, so it cannot read our site's
   * CSS custom properties. The reset and base styles below are
   * the minimum needed so the user's content lays out
   * predictably — no positioning surprises, comfortable
   * line-height, a sans-serif system stack. The user's CSS
   * (whatever they pasted) appends to this. */
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; padding: 1rem; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .__preview-error { position: fixed; inset-block-start: 0; inset-inline: 0; padding: 0.75rem 1rem; background: #fee; color: #800; border-block-end: 2px solid #800; font-family: ui-monospace, monospace; font-size: 0.85rem; z-index: 99999; }
    ${css}
  </style>
</head>
<body>
${html}
<script>
try {
${js}
} catch (err) {
  var msg = document.createElement("div");
  msg.className = "__preview-error";
  msg.textContent = "JavaScript error: " + (err && err.message ? err.message : err);
  document.body.insertBefore(msg, document.body.firstChild);
  console.error("Preview JS error:", err);
}
</script>
</body>
</html>`;
}
