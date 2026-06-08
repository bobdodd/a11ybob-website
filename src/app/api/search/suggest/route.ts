/* GET /api/search/suggest?q=<prefix>
 *
 * Returns type-ahead suggestions across articles, reviews, and
 * glossary, grouped by corpus. Backed by OpenSearch's completion
 * suggester (FST-backed prefix matcher).
 *
 * Each item has a `text` (display) and `href` (where selecting the
 * suggestion takes the user). Selecting a suggestion is a quick-jump
 * to the resource — pressing Enter without picking a suggestion goes
 * to the regular search-results page. */

import { NextRequest, NextResponse } from "next/server";
import { opensearch } from "@/lib/opensearch";

export const dynamic = "force-dynamic";

const PER_CORPUS = 5;

type Item = { text: string; href: string };
type Group = { corpus: "articles" | "reviews" | "glossary"; label: string; items: Item[] };

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ groups: [] satisfies Group[] });
  }

  const [articles, reviews, glossary] = await Promise.all([
    suggestFrom("articles", q, ["slug", "title"]),
    suggestFrom("reviews", q, ["title"]),
    suggestFrom("glossary", q, ["term"]),
  ]);

  // Display text comes from _source rather than the suggester's
  // matched-input string, because the completion field truncates
  // inputs to 50 chars by default — we want the full title/term.
  const allGroups: Group[] = [
    {
      corpus: "articles",
      label: "Research essays",
      items: articles.map((o) => ({
        text: (o._source.title as string) ?? o.text,
        href: `/writing/research-essays/${o._source.slug as string}`,
      })),
    },
    {
      corpus: "reviews",
      label: "Reviews",
      items: reviews.map((o) => ({
        text: (o._source.title as string) ?? o.text,
        href: `/writing/reviews/${o._id}`,
      })),
    },
    {
      corpus: "glossary",
      label: "Glossary",
      items: glossary.map((o) => ({
        text: (o._source.term as string) ?? o.text,
        href: `/writing/glossary/${o._id}`,
      })),
    },
  ];
  const groups = allGroups.filter((g) => g.items.length > 0);

  return NextResponse.json({ groups });
}

type Option = {
  text: string;
  _id: string;
  _source: Record<string, unknown>;
};

async function suggestFrom(
  index: string,
  q: string,
  sourceFields: string[],
): Promise<Option[]> {
  const res = await opensearch.search({
    index,
    body: {
      _source: sourceFields,
      suggest: {
        s: {
          prefix: q,
          completion: {
            field: "suggest",
            size: PER_CORPUS,
            skip_duplicates: true,
          },
        },
      },
      size: 0,
    },
  });

  const suggest = (res.body.suggest as Record<string, unknown> | undefined)?.s;
  if (!Array.isArray(suggest) || suggest.length === 0) return [];
  const opts = (suggest[0] as { options?: Option[] }).options ?? [];
  return opts;
}
