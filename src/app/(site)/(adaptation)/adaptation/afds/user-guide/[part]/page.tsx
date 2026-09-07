import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { AfdsSubNav } from "@/components/AfdsSubNav";
import { GuideNav } from "@/components/GuideNav";
import { getGuideContents, getGuidePage } from "@/lib/user-guide";

const BASE = "/adaptation/afds/user-guide";

export async function generateStaticParams() {
  const contents = await getGuideContents();
  return contents.pages.map((p) => ({ part: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ part: string }>;
}): Promise<Metadata> {
  const { part } = await params;
  const found = await getGuidePage(part);
  if (!found) return {};
  return { title: `${found.page.heading}, AFDS user guide` };
}

export default async function UserGuidePart({
  params,
}: {
  params: Promise<{ part: string }>;
}) {
  const { part } = await params;
  const found = await getGuidePage(part);
  if (!found) notFound();

  const contents = await getGuideContents();
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
              <small>AFDS user guide</small>
            </p>
          </header>

          <GuideNav pages={navPages} />

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
