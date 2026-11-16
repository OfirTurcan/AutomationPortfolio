import type { APIRoute } from "astro";
import { localePath } from "../lib/i18n";

// Every public page exists in Hebrew (/…) and English (/en/…). Each entry lists both
// versions as alternates so search engines treat them as translations of each other.
const PAGES = ["/", "/privacy/", "/accessibility/"];

export const GET: APIRoute = ({ site }) => {
  const abs = (p: string) => new URL(p, site).href;
  const urls = PAGES.flatMap((p) => {
    const he = abs(p);
    const en = abs(localePath(p, "en"));
    const alternates = [
      `    <xhtml:link rel="alternate" hreflang="he" href="${he}"/>`,
      `    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${he}"/>`,
    ].join("\n");
    return [he, en].map((loc) => `  <url>\n    <loc>${loc}</loc>\n${alternates}\n  </url>`);
  }).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
