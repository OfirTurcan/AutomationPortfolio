// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Local dev/preview only: serve the CMS at /admin and /admin/ like Netlify does
// (Astro's dev server doesn't map public/admin/ to its index.html by itself).
const adminIndex = {
  name: "admin-index",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === "/admin" || req.url === "/admin/") req.url = "/admin/index.html";
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === "/admin" || req.url === "/admin/") req.url = "/admin/index.html";
      next();
    });
  },
};

// Static output — deployed to Netlify. Update `site` to your final Netlify URL
// so absolute URLs (sitemap, social meta) resolve correctly.
export default defineConfig({
  site: "https://ofir-turcan-portfolio.netlify.app",
  vite: {
    plugins: [tailwindcss(), adminIndex],
  },
});
