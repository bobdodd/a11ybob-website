import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { AfdsSubNav } from "@/components/AfdsSubNav";
import { SpecNav } from "@/components/SpecNav";
import { getSpecContents, getSpecPage } from "@/lib/specification";

const BASE = "/adaptation/afds/specification";

export async function generateStaticParams() {
  const contents = await getSpecContents();
  return contents.pages.map((p) => ({ part: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ part: string }>;
}): Promise<Metadata> {
  const { part } = await params;
  const found = await getSpecPage(part);
  if (!found) return {};
  return { title: `${found.page.heading}, AFDS specification 1.0.0` };
}

export default async function SpecificationPart({
  params,
}: {
  params: Promise<{ part: string }>;
}) {
  const { part } = await params;
  const found = await getSpecPage(part);
  if (!found) notFound();

  const contents = await getSpecContents();
  const navPages = contents.pages.map((p) => ({
    href: `${BASE}/${p.slug}`,
    label: p.label,
  }));

  return (
    <main id="main" className="site-main">
      <div className="center">
        <div
          className="stack"
          style={{ "--space": "var(--s3)" } as CSSProperties}
        >
          <AfdsSubNav />

          <header
            className="stack"
            style={{ "--space": "var(--s0)" } as CSSProperties}
          >
            <h1>{found.page.heading}</h1>
            <p className="muted">
              <small>AFDS specification, version 1.0.0</small>
            </p>
          </header>

          <SpecNav pages={navPages} />

          <div className="prose">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {found.body}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </main>
  );
}
