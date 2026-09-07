/*
 * The AFDS user guide pages.
 *
 * The guide is written and maintained in the accessible-by-design
 * repository as one Markdown document. The files under
 * content/user-guide are generated from it by
 * tools/site/build-guide-pages.py in that repository and committed
 * here, so this site builds with no cross-repository dependency.
 *
 * Nothing in this module edits the guide's words. It reads the
 * generated files and the contents index and hands them to the pages.
 */

import { readFile } from "fs/promises";
import path from "path";

export type GuideSection = {
  title: string;
  anchor: string;
};

export type GuidePage = {
  slug: string;
  heading: string;
  label: string;
  sections: GuideSection[];
};

export type GuideContents = {
  version: string;
  source: string;
  pages: GuidePage[];
};

const DIR = path.join(process.cwd(), "content", "user-guide");

export async function getGuideContents(): Promise<GuideContents> {
  const raw = await readFile(path.join(DIR, "contents.json"), "utf8");
  return JSON.parse(raw) as GuideContents;
}

export async function getGuidePage(
  slug: string,
): Promise<{ page: GuidePage; body: string } | null> {
  const contents = await getGuideContents();
  const page = contents.pages.find((p) => p.slug === slug);
  if (!page) return null;

  // The slug came from the contents index, not from the request, so
  // it cannot be used to read outside the directory.
  const body = await readFile(path.join(DIR, `${slug}.md`), "utf8");
  return { page, body };
}
