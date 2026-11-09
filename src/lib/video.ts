// Turns whatever URL an editor pastes into the CMS (a normal YouTube/Vimeo "watch"
// link, a youtu.be short link, a Shorts link, or an /embed/ link) into a privacy-friendly
// embed URL. The embed is only loaded after the visitor clicks play (see Testimonials),
// so no third-party cookies are set just by viewing the page.

export interface ParsedVideo {
  provider: "youtube" | "vimeo";
  id: string;
  /** Iframe src to use once the visitor presses play. */
  embedUrl: string;
}

const YT_ID = /^[\w-]{11}$/;

export function parseVideoUrl(raw: string | undefined | null): ParsedVideo | null {
  const value = (raw ?? "").trim();
  if (!value) return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
  const parts = url.pathname.split("/").filter(Boolean);

  // ---- YouTube --------------------------------------------------------------
  if (host === "youtu.be" || host === "youtube.com" || host === "youtube-nocookie.com") {
    let id = "";
    if (host === "youtu.be") id = parts[0] ?? "";
    else if (parts[0] === "watch") id = url.searchParams.get("v") ?? "";
    else if (["embed", "shorts", "live", "v"].includes(parts[0] ?? "")) id = parts[1] ?? "";
    if (!YT_ID.test(id)) return null;
    return {
      provider: "youtube",
      id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
    };
  }

  // ---- Vimeo ----------------------------------------------------------------
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    // vimeo.com/123456789, vimeo.com/123456789/abcdef1234 (unlisted), player.vimeo.com/video/123456789
    const nums = parts.filter((p) => /^\d+$/.test(p));
    const id = nums[0] ?? "";
    if (!id) return null;
    const hash = url.searchParams.get("h") ?? parts.find((p) => /^[a-f0-9]{8,}$/i.test(p) && p !== id) ?? "";
    const query = new URLSearchParams({ autoplay: "1", dnt: "1" });
    if (hash) query.set("h", hash);
    return {
      provider: "vimeo",
      id,
      embedUrl: `https://player.vimeo.com/video/${id}?${query.toString()}`,
    };
  }

  return null;
}
