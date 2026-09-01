/*
 * The AFDS specification pages.
 *
 * The specification is written and maintained in the
 * accessible-by-design repository as one Markdown document. The
 * files under content/specification are generated from it by
 * tools/site/build-spec-pages.py in that repository and committed
 * here, so this site builds with no cross-repository dependency.
 *
 * Nothing in this module edits the specification's words. It reads
 * the generated files and the contents index and hands them to the
 * pages.
 */

import { readFile } from "fs/promises";
import path from "path";

export type SpecClause = {
  number: string;
  title: string;
  anchor: string;
};

export type SpecPage = {
  slug: string;
  heading: string;
  label: string;
  clauses: SpecClause[];
};

export type SpecContents = {
  version: string;
  source: string;
  pages: SpecPage[];
};

const DIR = path.join(process.cwd(), "content", "specification");

export async function getSpecContents(): Promise<SpecContents> {
  const raw = await readFile(path.join(DIR, "contents.json"), "utf8");
  return JSON.parse(raw) as SpecContents;
}

export async function getSpecPage(
  slug: string,
): Promise<{ page: SpecPage; body: string } | null> {
  const contents = await getSpecContents();
  const page = contents.pages.find((p) => p.slug === slug);
  if (!page) return null;

  // The slug came from the contents index, not from the request, so
  // it cannot be used to read outside the directory.
  const body = await readFile(path.join(DIR, `${slug}.md`), "utf8");
  return { page, body };
}
