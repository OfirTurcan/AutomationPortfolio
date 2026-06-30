// Step 1 of the Decap GitHub OAuth flow.
// Decap opens this in a popup; we redirect to GitHub's consent screen.
import { randomBytes } from "node:crypto";
import { getClient, originOf } from "./oauth-client.mjs";

export async function handler(event) {
  try {
    const client = getClient();
    const state = randomBytes(16).toString("hex");
    const redirectUri = `${originOf(event)}/callback`;

    const authorizationUri = client.authorizeURL({
      redirect_uri: redirectUri,
      scope: "repo,user", // repo => commit content; user => identity
      state,
    });

    return {
      statusCode: 302,
      headers: {
        Location: authorizationUri,
        // CSRF guard: verified in callback. Lax so it survives GitHub's top-level redirect.
        "Set-Cookie": `nf_oauth_state=${state}; HttpOnly; Path=/; SameSite=Lax; Secure; Max-Age=600`,
        "Cache-Control": "no-store",
      },
      body: "",
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: `OAuth misconfiguration: ${err.message}`,
    };
  }
}
