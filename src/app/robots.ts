import type { MetadataRoute } from "next";

/* Generates /robots.txt. Allow crawling everything except the JSON search
 * API (no value indexed), and point crawlers at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://a11ybob.com/sitemap.xml",
    host: "https://a11ybob.com",
  };
}
