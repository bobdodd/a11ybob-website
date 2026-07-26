/* Child sitemaps at /sitemaps/<name>.xml, listed by the index at /sitemap.xml.
 *
 * Names are fixed (core, writing, reviews, glossary) and anything else 404s,
 * so this cannot be used to probe for arbitrary content. */
import { getSitemapGroup, renderUrlset } from "@/lib/sitemap-data";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
): Promise<Response> {
  const { name } = await params;
  const group = await getSitemapGroup(name.replace(/\.xml$/, ""));
  if (!group) {
    return new Response("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new Response(renderUrlset(group.entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
