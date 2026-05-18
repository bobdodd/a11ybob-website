import type { Viewport } from "next";

/* Per-zone theme-color values for the browser chrome.
 *
 * Without an explicit theme-color meta, Safari (and a few other
 * browsers that tint their toolbar to match the page) sample from
 * the document's outer background. The <html> root carries
 * data-zone="home" as a fallback, so every page would have a
 * home-coloured toolbar regardless of which zone the page itself
 * paints in. Setting theme-color per route segment via the App
 * Router's viewport export pushes the correct zone surface to the
 * browser chrome.
 *
 * Values mirror the [data-zone] surface-1 tokens in tokens.css —
 * the lighter band the page body uses. Dark-mode variants mirror
 * the @media (prefers-color-scheme: dark) overrides in the same
 * file. Light/dark are supplied as separate themeColor entries so
 * the browser picks the one matching the user's OS preference. */

type ZoneName =
  | "home"
  | "ambient"
  | "work"
  | "about"
  | "writing"
  | "research"
  | "paradise"
  | "tools"
  | "playgrounds"
  | "maps";

const ZONE_THEME_COLORS: Record<ZoneName, { light: string; dark: string }> = {
  home:        { light: "oklch(95% 0.05 85)",   dark: "oklch(20% 0.05 85)"   },
  about:       { light: "oklch(95% 0.03 350)",  dark: "oklch(20% 0.03 350)"  },
  writing:     { light: "oklch(95% 0.05 30)",   dark: "oklch(20% 0.05 30)"   },
  work:        { light: "oklch(95% 0.045 130)", dark: "oklch(20% 0.045 130)" },
  maps:        { light: "oklch(95% 0.045 155)", dark: "oklch(20% 0.045 155)" },
  tools:       { light: "oklch(95% 0.04 190)",  dark: "oklch(20% 0.04 190)"  },
  paradise:    { light: "oklch(95% 0.04 215)",  dark: "oklch(20% 0.04 215)"  },
  research:    { light: "oklch(95% 0.045 250)", dark: "oklch(20% 0.045 250)" },
  ambient:     { light: "oklch(95% 0.012 270)", dark: "oklch(20% 0.012 270)" },
  playgrounds: { light: "oklch(95% 0.045 305)", dark: "oklch(20% 0.045 305)" },
};

export function zoneViewport(zone: ZoneName): Viewport {
  const c = ZONE_THEME_COLORS[zone];
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: c.light },
      { media: "(prefers-color-scheme: dark)",  color: c.dark  },
    ],
  };
}
