import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import about from "../content/about.json";
import faq from "../content/faq.json";

// /llms.txt: a plain Markdown summary of the site for AI assistants, generated from the
// same CMS content as the pages (English versions, so the Hebrew-first page is also
// readable in English). Few AI systems use it yet; it is cheap to keep current.
export const GET: APIRoute = async ({ site }) => {
  const abs = (p: string) => new URL(p, site).href;
  const projects = (await getCollection("projects"))
    .map((e) => e.data)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || (a.order ?? 999) - (b.order ?? 999));

  const lines: string[] = [
    `# ${about.name} - ${about.founder_name}`,
    "",
    `> ${about.summary_en}`,
    "",
    `- Website: ${abs("/")} (Hebrew by default, English via the language toggle)`,
    `- LinkedIn: ${about.linkedin_url}`,
    `- Email: ${about.email}`,
    `- Location: ${about.location_en}`,
    "",
    "## About",
    "",
    about.about_en,
    "",
    "## Capabilities",
    "",
    ...about.skills.map((g) => `- ${g.title_en}: ${g.items.join(", ")}`),
    "",
    "## Projects",
    "",
  ];

  for (const p of projects) {
    lines.push(`### ${p.title_en}${p.tagline_en ? ` - ${p.tagline_en}` : ""}`, "");
    lines.push(p.description_en, "");
    lines.push(`- Outcome: ${p.outcome_en}`);
    if (p.tools.length) lines.push(`- Tools: ${p.tools.join(", ")}`);
    if (p.link_live) lines.push(`- Live: ${p.link_live}`);
    if (p.link_caseStudy) lines.push(`- Case study: ${p.link_caseStudy}`);
    lines.push("");
  }

  const items = faq.items ?? [];
  if (faq.show_section && items.length > 0) {
    lines.push("## FAQ", "");
    for (const q of items) lines.push(`### ${q.question_en || q.question_he}`, "", q.answer_en || q.answer_he, "");
  }

  lines.push("## Pages", "", `- [Privacy policy](${abs("/privacy/")})`, `- [Accessibility statement](${abs("/accessibility/")})`, "");

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
