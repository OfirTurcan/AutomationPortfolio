// Structured data (schema.org JSON-LD) for the home page, built from the same CMS
// content the page shows: who Ofir is, what SyncMoto does, and (when the FAQ section is
// switched on) the questions and answers. Read by search engines and AI assistants.
import about from "../content/about.json";
import faq from "../content/faq.json";
import settings from "../content/settings.json";

export function homeJsonLd(site: URL) {
  const url = new URL("/", site).href;
  const id = (name: string) => `${url}#${name}`;
  const skills = about.skills.flatMap((g) => g.items);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": id("website"),
      url,
      name: about.name,
      description: settings.site_description_en,
      inLanguage: ["he", "en"],
      publisher: { "@id": id("business") },
    },
    {
      "@type": "Person",
      "@id": id("person"),
      name: about.founder_name,
      jobTitle: about.headline_en,
      description: about.about_en,
      image: new URL(about.profile_image, site).href,
      url,
      sameAs: [about.linkedin_url],
      worksFor: { "@id": id("business") },
      knowsAbout: skills,
    },
    {
      "@type": "ProfessionalService",
      "@id": id("business"),
      name: about.name,
      description: about.summary_en,
      url,
      image: new URL("/images/og-image.jpg", site).href,
      email: about.email,
      founder: { "@id": id("person") },
      areaServed: { "@type": "Country", name: "Israel" },
      address: { "@type": "PostalAddress", addressCountry: "IL" },
      knowsAbout: skills,
    },
  ];

  const items = faq.items ?? [];
  if (faq.show_section && items.length > 0) {
    // Hebrew is what the page shows by default, so the FAQPage matches the visible text.
    graph.push({
      "@type": "FAQPage",
      "@id": id("faq"),
      inLanguage: "he",
      mainEntity: items.map((q) => ({
        "@type": "Question",
        name: q.question_he,
        acceptedAnswer: { "@type": "Answer", text: q.answer_he },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
