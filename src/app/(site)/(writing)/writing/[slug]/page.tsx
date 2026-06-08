import { permanentRedirect } from "next/navigation";

/* The long-form essays moved from /writing/<slug> to
 * /writing/research-essays/<slug> when Writing became an umbrella over
 * four corpora (research essays, experience, reviews, glossary). These
 * old reader URLs are externally linked + indexed, so 308-redirect them
 * to the new location, preserving the slug.
 *
 * This dynamic segment only catches slugs that aren't a static sibling
 * (research-essays, experience, reviews, glossary all take precedence). */
export default async function LegacyArticleRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(`/writing/research-essays/${slug}`);
}
