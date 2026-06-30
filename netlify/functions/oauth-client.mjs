// Shared GitHub OAuth client + helpers for the Decap CMS auth handshake.
import { AuthorizationCode } from "simple-oauth2";

export function getClient() {
  const id = process.env.OAUTH_GITHUB_CLIENT_ID;
  const secret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error(
      "Missing OAUTH_GITHUB_CLIENT_ID / OAUTH_GITHUB_CLIENT_SECRET environment variables."
    );
  }
  return new AuthorizationCode({
    client: { id, secret },
    auth: {
      tokenHost: "https://github.com",
      tokenPath: "/login/oauth/access_token",
      authorizePath: "/login/oauth/authorize",
    },
  });
}

/** Origin (protocol + host) of the current request, behind Netlify's proxy. */
export function originOf(event) {
  const proto = event.headers["x-forwarded-proto"] || "https";
  const host = event.headers["x-forwarded-host"] || event.headers.host;
  return `${proto}://${host}`;
}

/** HTML page that hands the result back to the CMS window via postMessage. */
export function renderCallback(status, payload) {
  const content =
    status === "success"
      ? { token: payload, provider: "github" }
      : { message: String(payload) };
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  return `<!doctype html><html><head><meta charset="utf-8"/></head><body>
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(${JSON.stringify(message)}, e.origin);
    window.removeEventListener("message", receiveMessage, false);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
<p>Completing sign-in… you can close this window.</p>
</body></html>`;
}
