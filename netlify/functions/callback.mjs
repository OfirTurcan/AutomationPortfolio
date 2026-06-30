// Step 2 of the Decap GitHub OAuth flow.
// GitHub redirects here with ?code&state; we exchange the code for a token
// and post it back to the CMS window.
import { getClient, originOf, renderCallback } from "./oauth-client.mjs";

function readCookie(header, name) {
  if (!header) return null;
  const match = header.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : null;
}

export async function handler(event) {
  const params = event.queryStringParameters || {};
  const { code, state, error, error_description } = params;

  if (error) {
    return html(renderCallback("error", error_description || error));
  }
  if (!code) {
    return html(renderCallback("error", "Missing authorization code."));
  }

  // CSRF: state from the URL must match the cookie set in /auth.
  const cookieState = readCookie(event.headers.cookie, "nf_oauth_state");
  if (cookieState && state && cookieState !== state) {
    return html(renderCallback("error", "Invalid OAuth state."));
  }

  try {
    const client = getClient();
    const accessToken = await client.getToken({
      code,
      redirect_uri: `${originOf(event)}/callback`,
    });
    const token = accessToken.token.access_token;
    if (!token) throw new Error("No access token returned by GitHub.");
    return html(renderCallback("success", token), true);
  } catch (err) {
    return html(renderCallback("error", err.message));
  }
}

function html(body, clearCookie = false) {
  const headers = { "Content-Type": "text/html", "Cache-Control": "no-store" };
  if (clearCookie) {
    headers["Set-Cookie"] = "nf_oauth_state=; HttpOnly; Path=/; SameSite=Lax; Secure; Max-Age=0";
  }
  return { statusCode: 200, headers, body };
}
