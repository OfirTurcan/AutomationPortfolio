// Click-to-play: the YouTube/Vimeo iframe is only created when the visitor presses play,
// so just viewing the page loads nothing from (and sets no cookies for) those services.
// Shared by project cards and testimonials. Markup: <button class="tst-video"
//   data-embed="…" data-kind="youtube|vimeo|cap|file" data-title-key="dict key"
//   data-name-key="dict key" data-name="fallback">
document.addEventListener("click", (e) => {
  const btn = (e.target as Element | null)?.closest<HTMLButtonElement>(".tst-video");
  if (!btn) return;
  const src = btn.dataset.embed;
  if (!src) return;

  let dict: Record<string, { he: string; en: string }> = {};
  try {
    dict = JSON.parse(document.getElementById("i18n-dict")?.textContent ?? "{}");
  } catch {}
  const lang = document.documentElement.lang === "en" ? "en" : "he";
  const t = (key?: string) => (key ? dict[key]?.[lang] ?? "" : "");

  const label = t(btn.dataset.titleKey ?? "tst_video_title");
  const name = t(btn.dataset.nameKey) || btn.dataset.name || "";

  const title = [label, name].filter(Boolean).join(": ");

  // Self-hosted file: a native player, downloaded only now that play was pressed.
  if (btn.dataset.kind === "file") {
    const video = document.createElement("video");
    video.className = "tst-frame";
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("aria-label", title);
    const poster = btn.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1];
    if (poster) video.poster = poster;
    btn.replaceWith(video);
    video.focus();
    return;
  }

  const frame = document.createElement("iframe");
  frame.className = "tst-frame";
  frame.src = src;
  frame.title = title;
  frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  frame.allowFullscreen = true;
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  btn.replaceWith(frame);
  frame.focus();
});
