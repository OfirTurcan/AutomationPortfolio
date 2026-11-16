// Build-time translation of a rendered page into English (used by src/middleware.ts).
//
// It does what the old client-side toggle did, once, at build time: every element with
// data-i18n="key" gets its content replaced by the English text, and data-i18n-attr pairs
// set translated attributes. Only those spots are edited (by source offsets); every other
// byte of the page is left exactly as rendered, so markup, scripts and styles can't drift.
import { parse, walkSync, ELEMENT_NODE } from "ultrahtml";
import type { Dict, Lang } from "./i18n";

const escText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s: string) => escText(s).replace(/"/g, "&quot;");

interface Edit {
  start: number;
  end: number;
  text: string;
}

export function translateHtml(html: string, dict: Dict, lang: Lang): string {
  const doc = parse(html);
  const edits: Edit[] = [];
  // Content ranges already replaced: anything nested inside is gone with the old content.
  const replaced: [number, number][] = [];
  const inside = (pos: number) => replaced.some(([a, b]) => pos >= a && pos < b);

  walkSync(doc, (node: any) => {
    if (node.type !== ELEMENT_NODE || !node.loc) return;
    const [open, close] = node.loc;
    if (inside(open.start)) return;
    const attrs: Record<string, string> = node.attributes ?? {};

    // Attributes: data-i18n-attr="aria-label:key,title:key"
    const attrSpec = attrs["data-i18n-attr"];
    if (attrSpec) {
      let tag = html.slice(open.start, open.end);
      for (const pair of attrSpec.split(",")) {
        const [attr, key] = pair.split(":").map((x) => x.trim());
        const value = dict[key]?.[lang];
        if (!attr || value == null) continue;
        const re = new RegExp(`(\\s${attr.replace(/[-]/g, "\\-")}=)("[^"]*"|'[^']*')`);
        if (re.test(tag)) tag = tag.replace(re, `$1"${escAttr(value)}"`);
      }
      edits.push({ start: open.start, end: open.end, text: tag });
    }

    // Content: data-i18n="key" replaces everything between the tags (textContent semantics).
    const key = attrs["data-i18n"];
    const value = key ? dict[key]?.[lang] : undefined;
    if (value != null && close && close.start > open.end) {
      edits.push({ start: open.end, end: close.start, text: escText(value) });
      replaced.push([open.end, close.start]);
    }
  });

  edits.sort((a, b) => b.start - a.start);
  let out = html;
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return out;
}

/** Read the dictionary a page embeds in <script id="i18n-dict">. */
export function embeddedDict(html: string): Dict | null {
  const m = html.match(/<script type="application\/json" id="i18n-dict">([\s\S]*?)<\/script>/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}
