// Lightweight bilingual (Hebrew default / English) helper.
//
// Strategy: the page is server-rendered in HEBREW only. Every translatable element
// carries a `data-i18n="<key>"` attribute, and a single JSON dictionary (emitted once
// in <Base>) maps each key to { he, en }. The client toggle rewrites textContent in
// place, so the visible DOM never holds two languages at once.

export type Lang = "he" | "en";
export const DEFAULT_LANG: Lang = "he";

/** A single bilingual string. */
export interface Bi {
  he: string;
  en: string;
}

/** The serialized dictionary shape: stable key -> bilingual pair. */
export type Dict = Record<string, Bi>;

/** Terse constructor for a bilingual pair. */
export function bi(he: string, en: string): Bi {
  return { he, en };
}

/**
 * Read a `<base>_he` / `<base>_en` pair off a structured content object
 * (about.json / settings.json / a project) into a bilingual pair.
 */
export function pair(obj: Record<string, unknown>, base: string): Bi {
  return {
    he: String(obj[`${base}_he`] ?? ""),
    en: String(obj[`${base}_en`] ?? ""),
  };
}

/** Pick the default-language (Hebrew) text for server render. */
export function he(b: Bi): string {
  return b.he;
}
