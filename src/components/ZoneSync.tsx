"use client";

/* ZoneSync — keeps the <html> element's data-zone attribute in
 * sync with the current SiteShell zone on client-side navigation.
 *
 * The root layout renders <html data-zone="home"> as a static
 * fallback. Each route's SiteShell sets data-zone on an inner
 * <div>, so the body content paints in the correct zone, but the
 * html element's attribute stays "home" across the whole session.
 * Some browsers — Safari notably — derive their URL-bar tint by
 * sampling the document's outer background, which resolves
 * through the html element's CSS tokens. With data-zone stuck on
 * "home" everywhere, Safari's toolbar stays cream regardless of
 * which page is showing.
 *
 * This effect copies the current zone onto document.documentElement
 * so the html bg matches the page bg, and Safari (and any other
 * browser using a sampling heuristic) tints its chrome correctly.
 *
 * Earlier drafts of this component also removed and re-created
 * theme-color meta tags from JS to nudge Safari into re-reading
 * them on SPA navigation. That approach turned out to break
 * client-side routing — Next.js renders those meta tags through
 * React's <head> management, and removing them out from under
 * React left its virtual DOM out of sync with the real DOM. The
 * first nav click would change the URL but the new layout would
 * fail to mount; the second click recovered. The meta-tag dance
 * is gone; the data-zone update is the safe, React-compatible
 * version of the same idea (modifying an attribute on the html
 * root, which React doesn't manage). */

import { useEffect } from "react";
import type { ZoneName } from "@/lib/zone-theme-color";

export function ZoneSync({ zone }: { zone: ZoneName }) {
  useEffect(() => {
    document.documentElement.dataset.zone = zone;
  }, [zone]);

  return null;
}
