"use client";

/* Client-side loader for the ALPlayground. Next 16 only allows
 * `dynamic({ ssr: false })` inside a Client Component, so the
 * dynamic-import-with-ssr-disabled call lives here rather than in
 * the page itself. The page (a Server Component) imports this
 * loader normally; this loader pulls in CodeMirror + the engine
 * on the client only.
 *
 * The loading fallback shows a brief muted line during hydration. */

import dynamic from "next/dynamic";

const ALPlayground = dynamic(
  () => import("./ALPlayground").then((m) => m.ALPlayground),
  {
    ssr: false,
    loading: () => (
      <p className="muted">
        <small>Loading the Action Language playground&hellip;</small>
      </p>
    ),
  },
);

export function ALPlaygroundLoader({
  initialSource,
}: {
  initialSource: string;
}) {
  return <ALPlayground initialSource={initialSource} />;
}
