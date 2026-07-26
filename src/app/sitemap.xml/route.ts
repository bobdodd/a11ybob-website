/* The sitemap index at /sitemap.xml, the URL robots.txt advertises.
 *
 * A Route Handler rather than the app/sitemap.ts metadata convention, because
 * that convention emits <urlset> and this needs <sitemapindex>. Next's
 * generateSitemaps splits children but does not produce an index at all. */
import { getSitemapGroups, renderIndex } from "@/lib/sitemap-data";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const groups = await getSitemapGroups();
  return new Response(renderIndex(groups), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
