// Pointer-following spotlight on project cards (mouse/trackpad only). Sets --mx/--my on the
// card; the glow itself is a CSS mask on .spot-layer (see global.css). Purely decorative:
// the card is fully readable and usable without it.
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll<HTMLElement>(".spot").forEach((card) => {
    let frame = 0;
    let x = 0;
    let y = 0;
    card.addEventListener("pointermove", (e) => {
      x = e.clientX;
      y = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        // Read the rect per frame: the card moves on scroll and with its hover lift.
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${x - r.left}px`);
        card.style.setProperty("--my", `${y - r.top}px`);
      });
    });
  });
}
