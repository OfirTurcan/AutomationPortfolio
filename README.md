# SyncMoto — Bilingual Automation & AI Portfolio

A fast, static **Astro + TypeScript** portfolio with a built-in **Decap CMS** at `/admin`.
Bilingual **Hebrew (default, RTL)** / **English (LTR)** with an instant in-place toggle,
a clean, bright light theme with navy/teal accents, and ambient animated automation/AI buzzwords.

All content is structured JSON in the repo — no database, no paid backend. Editors save
through GitHub commits (Git-based workflow), which trigger a Netlify rebuild.

---

## Tech stack

- **Astro 5** (static output) + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`) + a small `global.css` design system
- **Decap CMS** (the maintained Netlify CMS successor) at `/admin`
- **Netlify** static hosting + **two Netlify Functions** for GitHub OAuth (`/auth`, `/callback`)

---

## Project structure

```
site/
├─ public/
│  ├─ admin/                 # Decap CMS
│  │  ├─ index.html
│  │  └─ config.yml          # collections, fields, GitHub backend
│  ├─ assets/                # project thumbnails / gallery images
│  └─ images/ofir_profile.png
├─ netlify/functions/        # GitHub OAuth handshake (free, no paid backend)
│  ├─ auth.mjs
│  ├─ callback.mjs
│  └─ oauth-client.mjs
├─ src/
│  ├─ content/
│  │  ├─ about.json          # About Me + skills (editable in CMS)
│  │  ├─ settings.json       # site-level bilingual UI text + SEO (editable in CMS)
│  │  └─ projects/*.json     # one normalized JSON file per project (editable in CMS)
│  ├─ content.config.ts      # Zod schema for the projects collection
│  ├─ components/            # Hero, About, Skills, Portfolio, ProjectCard, Contact, …
│  ├─ layouts/Base.astro     # head, ambient bg, i18n dictionary + toggle script
│  ├─ lib/i18n.ts            # bilingual helpers
│  └─ pages/index.astro      # builds the translation dictionary, assembles sections
├─ astro.config.mjs
└─ netlify.toml              # build + /auth /callback redirects
```

---

## Run locally

```bash
cd site
npm install
npm run dev          # http://localhost:4321
```

Other scripts:

```bash
npm run build        # static build -> dist/
npm run preview      # serve the production build locally
```

---

## How the bilingual system works

- The site is **server-rendered in Hebrew (RTL)** — that is the default and needs no JavaScript.
- A single JSON dictionary (`{ key: { he, en } }`) is embedded once per page.
- The 🌐 toggle rewrites the text of every `data-i18n` element **in place** and flips
  `dir`/`lang`. The DOM never holds two languages at once.
- Language choice is saved to `localStorage` as a **progressive enhancement** (it is applied
  after load, never blocking first paint).

---

## Editing content

### Option A — locally (no GitHub login)

In two terminals:

```bash
npm run dev          # terminal 1
npm run cms          # terminal 2  (runs decap-server on :8081)
```

Open **http://localhost:4321/admin** — `local_backend: true` connects the CMS to
`decap-server`, which writes changes straight to `src/content/**` on disk. Commit them
yourself when ready.

### Option B — in production (GitHub login)

Once deployed (below), open **https://YOUR-SITE.netlify.app/admin**, click **Login with
GitHub**, and edit. Saving commits to `main` and Netlify rebuilds automatically.

### Content model

Each project is one file in `src/content/projects/*.json` with this normalized schema:

| field | notes |
|---|---|
| `slug` | URL id + file name |
| `title_en` / `title_he` | required |
| `tagline_en` / `tagline_he` | optional |
| `description_en` / `description_he` | short paragraph |
| `outcome_en` / `outcome_he` | result line |
| `tools` / `tags` | string arrays |
| `status` | `live` · `in-progress` · `prototype` |
| `featured` | featured cards sort first |
| `order` | lower = earlier |
| `thumbnail` | shown when there is no video |
| `video_url` | YouTube **/embed/** URL; **leave empty** to show *"Private prototype / demo available on request."* |
| `gallery`, `link_live`, `link_repo`, `link_caseStudy`, `highlights_en/he` | optional |

---

## Deploy to Netlify

### 1. Create a GitHub OAuth app (for `/admin` login)

GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**:

- **Homepage URL:** `https://ofir-turcan-portfolio.netlify.app`
- **Authorization callback URL:** `https://ofir-turcan-portfolio.netlify.app/callback`

Copy the **Client ID** and generate a **Client Secret**.

> **Full step-by-step (with troubleshooting):** [docs/github-oauth-setup.md](docs/github-oauth-setup.md)

### 2. Connect the repo to Netlify

New site → import `OfirTurcan/AutomationPortfolio`. Build settings (also in `netlify.toml`):

- **Base directory:** `site`
- **Build command:** `npm run build`
- **Publish directory:** `site/dist`
- **Functions directory:** `site/netlify/functions`

### 3. Set environment variables (Site → Settings → Environment variables)

```
OAUTH_GITHUB_CLIENT_ID      = <from step 1>
OAUTH_GITHUB_CLIENT_SECRET  = <from step 1>
```

### 4. Point the CMS at your live origin

`backend.base_url` in `public/admin/config.yml` and `site` in `astro.config.mjs` are set to
`https://ofir-turcan-portfolio.netlify.app`. If your final domain differs, update both and
redeploy.

### 5. Verify the OAuth flow

Visit `https://ofir-turcan-portfolio.netlify.app/admin` → **Login with GitHub** → consent →
you should land back in the CMS authenticated. Make a test edit → confirm a commit appears
on `main` and Netlify rebuilds.

> The `/auth` and `/callback` routes are mapped to the Netlify Functions in `netlify.toml`.
> The functions only use free GitHub OAuth — there is no paid backend.

---

## Accessibility (Israeli law — IS 5568 / WCAG 2.0 AA)

Israeli public websites must be accessible under the Equal Rights for Persons with
Disabilities Regulations (Service Accessibility Adjustments), 2013, which adopt **Israeli
Standard IS 5568 (= WCAG 2.0 Level AA)**, and must publish an **accessibility statement**
naming an accessibility coordinator.

What this site ships:

- **Native accessibility menu** (floating button, every page): text resize, high-contrast
  mode, link highlighting, readable font, pause animations, reset. Settings persist in
  `localStorage`. It is real CSS, not a third-party overlay.
- **Accessibility statement** at **`/accessibility`** (linked in the footer), bilingual and
  editable in the CMS under **Site Content → Accessibility Statement**.
- Semantic landmarks, a **skip-to-content** link, visible keyboard focus, image alt text,
  iframe titles, full RTL, and `prefers-reduced-motion` support.
- **Verified with axe-core**: 0 WCAG 2.0/2.1 A & AA violations on the home and statement
  pages, in both languages, including high-contrast and menu-open states.

> **Action required before launch:** add the accessibility **coordinator phone number** in
> the CMS (or `src/content/accessibility.json` → `coordinator_phone`). The Israeli statement
> is expected to include a phone contact; the line is hidden while empty. Also keep
> `updated_date` current. Re-run an audit if you add new content types (e.g. forms).

> **Privacy:** this site collects no personal data (contact is `mailto:`/LinkedIn; only a
> functional language/a11y preference is stored locally), so no privacy policy is legally
> required yet. If you later add a contact form, analytics, or marketing cookies, add a
> privacy policy and cookie consent per the Protection of Privacy Law (incl. Amendment 13).

---

## Notes

- `raw-videos/` and `video-assets/` in the parent folder are **not** part of this site and
  are never processed.
- To change the accent palette, edit the `@theme` tokens at the top of
  `src/styles/global.css`.
