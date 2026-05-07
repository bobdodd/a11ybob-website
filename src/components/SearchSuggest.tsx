"use client";

/* Type-ahead combobox for the search field. Implements the WAI-ARIA
 * combobox pattern (1.2):
 *   - input has role="combobox", aria-controls, aria-expanded,
 *     aria-activedescendant, aria-autocomplete="list"
 *   - dropdown has role="listbox"
 *   - each suggestion has role="option" with a stable id
 *   - keyboard: ArrowUp/Down to navigate, Enter to select the
 *     active option, Escape to close, typing keeps editing
 *   - selecting an option navigates via next/router (client-side)
 *
 * Suggestions come from /api/search/suggest, debounced 150ms.
 * Submitting the form with no option active runs the regular
 * server-side search as before — so the combobox is a strict
 * progressive enhancement of the form.
 *
 * The form submit button still lives in SearchForm (server-rendered),
 * outside this component; this component only owns the input and
 * its dropdown. */

import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

type Item = { text: string; href: string };
type Group = { corpus: string; label: string; items: Item[] };

type Props = {
  id: string;
  name: string;
  defaultValue?: string;
  /** id of the hint element (rendered by the parent at form level
   *  so the cluster row keeps the input and button at the same
   *  height). Used to set aria-describedby on the input. */
  hintId?: string;
  /** Visually-hidden label content for screen readers. */
  ariaLabel: string;
};

const DEBOUNCE_MS = 150;
const MIN_CHARS = 2;

export function SearchSuggest({
  id,
  name,
  defaultValue = "",
  hintId,
  ariaLabel,
}: Props) {
  const router = useRouter();
  const listId = useId();

  const [value, setValue] = useState(defaultValue);
  const [groups, setGroups] = useState<Group[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  // Tracked via ref so the in-flight fetch handler reads the latest
  // value without re-running the effect on every focus toggle. The
  // dropdown should never open while the input is unfocused —
  // otherwise a slow response after a blur reopens it from offscreen.
  const focusedRef = useRef(false);

  // Flat list of items used for keyboard nav.
  const flat = useMemo(
    () => groups.flatMap((g) => g.items.map((it) => ({ ...it, corpus: g.corpus }))),
    [groups],
  );

  const reqId = useRef(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch suggestions when value changes (debounced).
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (value.trim().length < MIN_CHARS) {
      setGroups([]);
      setOpen(false);
      return;
    }
    debounceTimer.current = setTimeout(async () => {
      const myId = ++reqId.current;
      try {
        const res = await fetch(
          `/api/search/suggest?q=${encodeURIComponent(value.trim())}`,
          { cache: "no-store" },
        );
        if (myId !== reqId.current) return; // outdated response
        if (!res.ok) return;
        const data = (await res.json()) as { groups: Group[] };
        setGroups(data.groups);
        // Only open if the input is still focused — a fetch that
        // completes after the user has tabbed away must not reopen
        // the dropdown over the page content.
        setOpen(focusedRef.current && data.groups.length > 0);
        setActiveIndex(-1);
      } catch {
        // Network failure — silently stop offering suggestions; the
        // form's plain-Enter submit still works.
      }
    }, DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [value]);

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (flat.length === 0) return;
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i + 1) % flat.length);
    } else if (e.key === "ArrowUp") {
      if (flat.length === 0) return;
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i <= 0 ? flat.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (open && activeIndex >= 0 && flat[activeIndex]) {
        e.preventDefault();
        const target = flat[activeIndex].href;
        setOpen(false);
        router.push(target);
      }
      // Otherwise let the form submit as normal.
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
      }
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const activeId =
    open && activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined;

  return (
    <div className="search-suggest">
      <label htmlFor={id} className="visually-hidden">
        {ariaLabel}
      </label>
      <input
        id={id}
        type="search"
        name={name}
        defaultValue={defaultValue}
        autoComplete="on"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={activeId}
        aria-describedby={hintId}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => {
          focusedRef.current = false;
          // Delay so a click on a suggestion can fire first.
          setTimeout(() => setOpen(false), 150);
        }}
        onFocus={() => {
          focusedRef.current = true;
          if (groups.length > 0) setOpen(true);
        }}
      />

      <ul
        id={listId}
        role="listbox"
        aria-label="Suggestions"
        hidden={!open || flat.length === 0}
        className="search-suggest-list"
      >
        {groups.map((g, gi) => {
          // Compute the starting flat index of this group so option
          // ids align with the flat list used for keyboard nav.
          const flatStart = groups
            .slice(0, gi)
            .reduce((sum, prev) => sum + prev.items.length, 0);
          return (
            <li key={g.corpus} role="presentation" className="search-suggest-group">
              <div
                role="presentation"
                className="search-suggest-group-label"
              >
                {g.label}
              </div>
              <ul role="presentation">
                {g.items.map((it, i) => {
                  const flatIndex = flatStart + i;
                  const isActive = flatIndex === activeIndex;
                  return (
                    <li
                      key={`${g.corpus}-${i}`}
                      role="option"
                      id={`${listId}-opt-${flatIndex}`}
                      aria-selected={isActive}
                      onMouseDown={(e) => {
                        // Prevent input blur stealing the click.
                        e.preventDefault();
                      }}
                      onClick={() => {
                        setOpen(false);
                        router.push(it.href);
                      }}
                    >
                      {it.text}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
