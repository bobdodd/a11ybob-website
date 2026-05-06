/* Three-tier scoring helpers shared by articles, reviews, glossary
 * search. See docs/decisions/0007-tiered-article-search.md for the
 * pattern (boost 10 phrase, 4 all-terms, 1 some-terms). */

export type SearchTier = "phrase" | "all" | "some";

/* Build the three should-clauses for a multi_match-based tiered query.
 * Pass the field-weighting array used by the index. */
export function tieredShould(
  q: string,
  fields: string[],
): Record<string, unknown>[] {
  return [
    {
      multi_match: {
        query: q,
        type: "phrase",
        fields,
        boost: 10,
        _name: "phrase",
      },
    },
    {
      multi_match: {
        query: q,
        operator: "and",
        fields,
        boost: 4,
        _name: "all",
      },
    },
    {
      multi_match: {
        query: q,
        fields,
        boost: 1,
        _name: "some",
      },
    },
  ];
}

/* True when the query has 2+ tokens — for a single token, the three
 * tiers match the same documents and the label carries no information. */
export function tierMeaningful(q: string | undefined): boolean {
  if (!q) return false;
  return q.trim().split(/\s+/).length >= 2;
}

/* Pick the highest-priority tier matched, or undefined if none. */
export function pickTier(matched: string[] | undefined): SearchTier | undefined {
  if (!matched) return undefined;
  const set = new Set(matched);
  if (set.has("phrase")) return "phrase";
  if (set.has("all")) return "all";
  if (set.has("some")) return "some";
  return undefined;
}

/* Human-readable label for a tier, suitable for display in result cards. */
export function tierLabel(tier: SearchTier): string {
  switch (tier) {
    case "phrase":
      return "Exact phrase";
    case "all":
      return "All terms";
    case "some":
      return "Some terms";
  }
}
