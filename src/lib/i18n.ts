// Lightweight bilingual (Hebrew default / English) helper.
//
// Strategy: components render HEBREW. Every translatable element carries a
// `data-i18n="<key>"` attribute (and `data-i18n-attr="attr:key,…"` for attributes), and
// each page builds one dictionary (`{ key: { he, en } }`) that is embedded in the page.
// Hebrew pages live at `/…`; their English copies at `/en/…` are produced at build time
// by src/middleware.ts, which applies that same dictionary (see translate-html.ts).
// So one set of components and one dictionary serve both languages.

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

/** Language of a page, from its URL: everything under /en/ is English. */
export function langOf(url: URL): Lang {
  return url.pathname === "/en" || url.pathname.startsWith("/en/") ? "en" : "he";
}

/** Path of a page in a given language, from its Hebrew path (e.g. "/privacy/"). */
export function localePath(path: string, lang: Lang): string {
  if (lang === "he") return path;
  return path === "/" ? "/en/" : `/en${path}`;
}

/** The Hebrew path of the current page (strips a leading /en). */
export function basePath(url: URL): string {
  const p = url.pathname;
  if (p === "/en" || p === "/en/") return "/";
  return p.startsWith("/en/") ? p.slice(3) : p;
}
