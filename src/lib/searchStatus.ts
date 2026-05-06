/* Build the result-count announcement for a search results page.
 *
 * Used inside a role="status" live region so the screen reader
 * announces the count after each search submit or pill-toggle
 * change. The text is also visible to all users — sighted readers
 * and screen-magnifier users get the same surfacing of "this is
 * what came back" without having to scan the result list to
 * estimate volume. */

type CorpusCount = {
  /** Singular noun, e.g. "article". Pluralised by the helper. */
  noun: string;
  total: number;
};

export function buildSearchStatus({
  q,
  primary,
  extras = [],
}: {
  q: string;
  primary: CorpusCount;
  /** Optional extra corpora; falsy entries are ignored so callers
   *  can pass conditional values inline. */
  extras?: (CorpusCount | null | false | undefined)[];
}): string {
  const primaryText =
    primary.total === 0
      ? `No ${plural(primary.noun, 0)} match ${q}.`
      : `${primary.total} ${plural(primary.noun, primary.total)} ${primary.total === 1 ? "matches" : "match"} ${q}.`;

  const realExtras = extras.filter((e): e is CorpusCount => Boolean(e));
  if (realExtras.length === 0) return primaryText;

  const extrasText = realExtras
    .map((e) => `${e.total} matching ${plural(e.noun, e.total)}`)
    .join(realExtras.length === 2 ? " and " : ", ");

  return `${primaryText} ${extrasText} also shown.`;
}

function plural(noun: string, n: number): string {
  if (n === 1) return noun;
  // Naive English pluralisation — sufficient for our nouns
  // (article, review, glossary term).
  if (noun.endsWith("y") && !/[aeiou]y$/.test(noun)) {
    return noun.slice(0, -1) + "ies";
  }
  if (noun.endsWith("s") || noun.endsWith("x") || noun.endsWith("ch")) {
    return noun + "es";
  }
  return noun + "s";
}
