import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Source_Serif_4 } from "next/font/google";
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

export const metadata: Metadata = {
  title: "a11ybob.com",
  description: "Bob Dodd on digital accessibility.",
};

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
