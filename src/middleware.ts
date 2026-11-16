import { defineMiddleware } from "astro:middleware";
import { langOf } from "./lib/i18n";
import { embeddedDict, translateHtml } from "./lib/translate-html";

// English pages (/en/…) render the same components as the Hebrew pages; this applies the
// page's own dictionary to their text at build time. Hebrew pages pass through untouched.
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (langOf(context.url) !== "en") return response;
  if (!(response.headers.get("content-type") ?? "").includes("text/html")) return response;

  const html = await response.text();
  const dict = embeddedDict(html);
  const body = dict ? translateHtml(html, dict, "en") : html;
  return new Response(body, { status: response.status, headers: response.headers });
});
