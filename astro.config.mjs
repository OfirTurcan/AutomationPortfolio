// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Static output — deployed to Netlify. Update `site` to your final Netlify URL
// so absolute URLs (sitemap, social meta) resolve correctly.
export default defineConfig({
  site: "https://ofir-turcan-portfolio.netlify.app",
  vite: {
    plugins: [tailwindcss()],
  },
});
