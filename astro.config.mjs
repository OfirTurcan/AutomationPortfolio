// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Local dev/preview only: serve the CMS at /admin like Netlify does. Astro's dev server
// doesn't map public/admin/ to its index.html, so /admin redirects to /admin/ (keeping
// relative URLs right) and /admin/ is served from /admin/index.html.
function adminRoutes(req, res, next) {
  if (req.url === "/admin") {
    res.statusCode = 302;
    res.setHeader("Location", "/admin/");
    res.end();
    return;
  }
  if (req.url === "/admin/") req.url = "/admin/index.html";
  next();
}
const adminIndex = {
  name: "admin-index",
  configureServer(server) {
    server.middlewares.use(adminRoutes);
  },
  configurePreviewServer(server) {
    server.middlewares.use(adminRoutes);
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
