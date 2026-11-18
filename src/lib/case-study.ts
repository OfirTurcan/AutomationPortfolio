// Project case-study windows (native modal <dialog>s rendered by ProjectCard.astro).
//
// - Opening uses the built-in `command="show-modal"` button attributes; browsers that
//   don't support them yet get the same behaviour from the small fallback below.
// - Shareable links: /#case-<slug> opens that project's window on load, the address bar
//   follows the open window, and closing it restores the plain page address.

const dialogs = () => [...document.querySelectorAll<HTMLDialogElement>("dialog.cs-dialog")];

if (!("commandForElement" in HTMLButtonElement.prototype)) {
  document.addEventListener("click", (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLButtonElement>('button[command="show-modal"][commandfor]');
    const dlg = btn && document.getElementById(btn.getAttribute("commandfor")!);
    if (dlg instanceof HTMLDialogElement && !dlg.open) dlg.showModal();
  });
}

for (const dlg of dialogs()) {
  // Light dismiss (click outside) where <dialog closedby> isn't supported yet.
  if (!("closedBy" in HTMLDialogElement.prototype)) {
    const outside = (e: PointerEvent) => {
      const r = dlg.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    dlg.addEventListener("pointerdown", (e) => (pressedOutside = outside(e)));
    dlg.addEventListener("pointerup", (e) => {
      if (pressedOutside && outside(e)) dlg.close();
    });
  }

  // Keep the address in sync so the open case study can be shared or bookmarked.
  new MutationObserver(() => {
    const hash = `#${dlg.id}`;
    if (dlg.open && location.hash !== hash) history.replaceState(null, "", hash);
    if (!dlg.open && location.hash === hash) history.replaceState(null, "", location.pathname + location.search);
  }).observe(dlg, { attributes: true, attributeFilter: ["open"] });
}

// Deep link: open the case study named in the address.
const fromHash = location.hash.startsWith("#case-") ? document.getElementById(location.hash.slice(1)) : null;
if (fromHash instanceof HTMLDialogElement) fromHash.showModal();
