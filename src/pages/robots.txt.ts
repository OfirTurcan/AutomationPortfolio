import type { APIRoute } from "astro";

// Everyone may crawl the public site, including AI search and assistant crawlers
// (listed explicitly so the intent is clear). The CMS at /admin is excluded.
export const GET: APIRoute = ({ site }) => {
  const body = `User-agent: *
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Google-Extended
User-agent: Applebot-Extended
Allow: /
Disallow: /admin/

Sitemap: ${new URL("/sitemap.xml", site).href}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
