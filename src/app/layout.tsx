import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Source_Serif_4 } from "next/font/google";
import { zoneViewport } from "@/lib/zone-theme-color";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-source",
});

const sourceSerif = Source_Serif_4({
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading-source",
});

/* Every page supplies its own title; the template appends the site
 * name so each browser tab, bookmark and history entry is uniquely
 * identifiable (WCAG 2.4.2 Page Titled). The unique part comes first
 * so it survives tab truncation and is announced before the
 * boilerplate. `default` covers any route that doesn't set one. */
export const metadata: Metadata = {
  title: {
    default: "a11ybob.com",
    template: "%s - a11ybob.com",
  },
  description: "Bob Dodd on digital accessibility.",
};

/* Default theme-color for routes that don't have a zone layout in
 * their tree (e.g. /styleguide, /health). Each zone-bearing layout
 * overrides this with its own viewport export. The home zone is
 * the default because <html> carries data-zone="home" as its
 * fallback. */
export const viewport = zoneViewport("home");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${atkinson.variable} ${sourceSerif.variable}`}
      data-zone="home"
    >
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
