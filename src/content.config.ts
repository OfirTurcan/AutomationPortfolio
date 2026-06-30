import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Portfolio entries — one structured JSON file per project in src/content/projects/.
// Edited through Decap CMS (Portfolio collection). All four seed projects share this
// single normalized schema regardless of their original shape.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/projects" }),
  schema: z.object({
    slug: z.string(),
    title_en: z.string(),
    title_he: z.string(),
    tagline_en: z.string().optional(),
    tagline_he: z.string().optional(),
    description_en: z.string(),
    description_he: z.string(),
    outcome_en: z.string(),
    outcome_he: z.string(),
    tools: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    status: z.enum(["live", "in-progress", "prototype"]).default("live"),
    featured: z.boolean().default(false),
    order: z.number().optional(),
    thumbnail: z.string(),
    video_url: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    link_live: z.string().optional(),
    link_repo: z.string().optional(),
    link_caseStudy: z.string().optional(),
    highlights_en: z.array(z.string()).optional(),
    highlights_he: z.array(z.string()).optional(),
  }),
});

export const collections = { projects };
