# GitHub OAuth setup for Decap CMS

This guide enables **login at `/admin`** on the live site so you can edit content through the
browser. Saving in the CMS commits to `main` on GitHub, which triggers a Netlify rebuild.

The site uses Decap's **GitHub backend**. Authentication is handled by two free Netlify
Functions already in this repo (`netlify/functions/auth.mjs` and `callback.mjs`) — no paid
backend, no third-party OAuth service. You just need to create a GitHub **OAuth App** and give
its credentials to Netlify.

> Live site origin used throughout: **`https://ofir-turcan-portfolio.netlify.app`**
> If your final domain changes, replace it everywhere below **and** in
> `public/admin/config.yml` (`base_url`) and `astro.config.mjs` (`site`).

---

## 1. What you'll need

- Access to the **GitHub account** that owns `OfirTurcan/AutomationPortfolio`.
- Access to the **Netlify site** for this project.
- ~5 minutes.

> The GitHub account you log in with at `/admin` must have **push access** to the repo (the
> owner does). Other editors must be added as repo collaborators with write access.

---

## 2. Create the GitHub OAuth App

1. Go to **https://github.com/settings/developers** → **OAuth Apps** → **New OAuth App**.
   (Direct link: https://github.com/settings/applications/new)
2. Fill in **exactly**:

   | Field | Value |
   |---|---|
   | **Application name** | `Ofir Turcan Portfolio CMS` (any name) |
   | **Homepage URL** | `https://ofir-turcan-portfolio.netlify.app` |
   | **Authorization callback URL** | `https://ofir-turcan-portfolio.netlify.app/callback` |

   > The callback URL must match **exactly**: `https://` scheme, no trailing slash, and the path
   > is a single `/callback`. A mismatch is the #1 cause of login failures.

3. Click **Register application**.
4. Copy the **Client ID**.
5. Click **Generate a new client secret** and copy it now — GitHub shows the secret only once.

> Optional (recommended): upload an app logo. It appears on the GitHub consent screen.

---

## 3. Add the credentials to Netlify

1. In Netlify: **Site configuration → Environment variables → Add a variable**.
2. Add these two (exact names):

   | Key | Value |
   |---|---|
   | `OAUTH_GITHUB_CLIENT_ID` | the Client ID from step 2 |
   | `OAUTH_GITHUB_CLIENT_SECRET` | the Client secret from step 2 |

3. **Trigger a redeploy** (Deploys → Trigger deploy → Deploy site). The functions read these
   variables at runtime, so they must exist **before** you try to log in, and a deploy must run
   after you add them.

> Keep the client secret only in Netlify. Never commit it. `.env` is git-ignored; `.env.example`
> holds placeholders only.

The functions request the GitHub scope **`repo,user`** — `repo` lets the CMS commit content,
`user` reads your identity. (Set in `netlify/functions/auth.mjs`.)

---

## 4. Confirm the repo config (already set)

These are committed and should already be correct — verify if you changed the domain:

- `public/admin/config.yml`
  ```yaml
  backend:
    name: github
    repo: OfirTurcan/AutomationPortfolio
    branch: main
    base_url: https://ofir-turcan-portfolio.netlify.app   # = your live origin
    auth_endpoint: auth
  ```
- `netlify.toml` maps the friendly routes to the functions:
  ```toml
  [[redirects]]
    from = "/auth"
    to = "/.netlify/functions/auth"
    status = 200
  [[redirects]]
    from = "/callback"
    to = "/.netlify/functions/callback"
    status = 200
  ```
- `astro.config.mjs` → `site: "https://ofir-turcan-portfolio.netlify.app"`.

---

## 5. Test the login flow

1. Open **https://ofir-turcan-portfolio.netlify.app/admin**.
2. Click **Login with GitHub**. A popup opens.
3. What happens under the hood:
   - Decap opens `…/auth` → the `auth` function redirects you to GitHub's consent screen.
   - You approve → GitHub redirects to `…/callback` → the `callback` function exchanges the
     code for a token and hands it back to the CMS window.
4. The popup closes and the CMS is now authenticated.
5. Make a small edit (e.g. About Me) and **Publish**. Confirm:
   - a new commit appears on `main` in GitHub, and
   - Netlify starts a new deploy.

---

## 6. Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| GitHub says **redirect_uri mismatch** | Callback URL in the OAuth App ≠ `https://<your-origin>/callback`. Fix the typo/scheme/trailing slash in the OAuth App settings. |
| `/admin` login does nothing / popup 404 on **/auth** | Functions not deployed, or `netlify.toml` redirects missing. Confirm Functions directory is `site/netlify/functions` and redeploy. |
| Page shows **"OAuth misconfiguration"** (HTTP 500) | `OAUTH_GITHUB_CLIENT_ID` / `OAUTH_GITHUB_CLIENT_SECRET` not set, or you didn't redeploy after adding them. |
| **"Invalid OAuth state"** on return | Third-party/blocked cookies. Allow cookies for the site and retry; don't reuse a stale popup. |
| Login works but **saving fails** | The logged-in GitHub user lacks push access to the repo, or `branch: main` doesn't exist. Add the user as a write collaborator. |
| Login works locally but not in prod | `base_url` still points at the wrong origin. It must equal the deployed site URL. |

---

## 7. Security & maintenance

- **Rotate** the client secret (GitHub → the OAuth App → Generate a new client secret) if it is
  ever exposed, then update the Netlify variable and redeploy.
- **Revoking** the OAuth App (or your GitHub token) forces re-login next time.
- If the repo later moves under a **GitHub organization**, an org owner may need to approve the
  OAuth App for it to access org repos.
- Local editing never needs any of this: run `npm run cms` + `npm run dev` and open `/admin`
  (uses `local_backend`, writes JSON straight to disk).
