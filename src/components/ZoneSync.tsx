"use client";

/* ZoneSync — keeps the browser chrome (URL bar / tab strip tint) in
 * sync with the page's current zone on SPA navigation.
 *
 * Problem: Next.js App Router's viewport export renders correct
 * theme-color meta tags into each route segment's <head> on the
 * server, but most browsers — Safari in particular — only read
 * theme-color on initial document load. When the user navigates
 * between zones client-side, Next.js mutates the meta tag in the
 * DOM, but Safari keeps using whichever theme-color it picked up at
 * the start of the session (usually home).
 *
 * Fix: on every zone change, this effect (a) removes and re-creates
 * the theme-color meta tags from scratch, which triggers a fresh
 * DOM mutation observable to Safari's chrome-tinting code; and (b)
 * updates the <html> element's data-zone attribute so any browser
 * that falls back to sampling the document background also gets the
 * current zone's surface colour.
 *
 * SSR initial loads already work without this effect — the meta is
 * correct in the rendered HTML. ZoneSync only matters for in-app
 * navigation between zones. */

import { useEffect } from "react";
import {
  ZONE_THEME_COLORS,
  type ZoneName,
} from "@/lib/zone-theme-color";

export function ZoneSync({ zone }: { zone: ZoneName }) {
  useEffect(() => {
    const colors = ZONE_THEME_COLORS[zone];
    if (!colors) return;

    /* Remove every existing theme-color meta so the browser sees
     * a clean slate. */
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.remove());

    /* Re-create the light and dark variants with the current
     * zone's surface colours. Newly-appended <meta> nodes are a
     * DOM mutation the browser's chrome-tinter actually observes,
     * unlike content-attribute changes on an existing node. */
    const light = document.createElement("meta");
    light.setAttribute("name", "theme-color");
    light.setAttribute("media", "(prefers-color-scheme: light)");
    light.setAttribute("content", colors.light);
    document.head.appendChild(light);

    const dark = document.createElement("meta");
    dark.setAttribute("name", "theme-color");
    dark.setAttribute("media", "(prefers-color-scheme: dark)");
    dark.setAttribute("content", colors.dark);
    document.head.appendChild(dark);

    /* Sampling fallback for browsers that don't honour
     * theme-color: html bg follows the current zone too. */
    document.documentElement.dataset.zone = zone;
  }, [zone]);

  return null;
}
