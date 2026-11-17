// Cookie consent: stores the visitor's choice, opens the preferences panel, shows the
// first-visit bar only when a measurement tool is configured, and loads Google Analytics 4
// / Microsoft Clarity only after "measurement" is allowed. See CookieConsent.astro.

const KEY = "cookie-consent";
const VERSION = 1;

interface Consent {
  v: number;
  analytics: boolean;
  marketing: boolean;
  ts: number;
}

function read(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || "null");
    return c && c.v === VERSION ? c : null;
  } catch {
    return null;
  }
}

function write(c: Omit<Consent, "v" | "ts">): Consent {
  const full = { v: VERSION, ...c, ts: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(full));
  } catch {}
  return full;
}

let loaded = false;

function loadAnalytics(ga4?: string, clarity?: string) {
  if (loaded) return;
  loaded = true;
  if (ga4) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4)}`;
    document.head.append(s);
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () {
      w.dataLayer.push(arguments);
    };
    w.gtag("js", new Date());
    w.gtag("config", ga4);
  }
  if (clarity) {
    const w = window as any;
    w.clarity =
      w.clarity ||
      function () {
        (w.clarity.q = w.clarity.q || []).push(arguments);
      };
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${encodeURIComponent(clarity)}`;
    document.head.append(s);
  }
}

/** Remove measurement cookies after consent is withdrawn (current host and parent domains). */
function clearAnalyticsCookies() {
  const names = document.cookie.split(";").map((c) => c.split("=")[0].trim());
  const parts = location.hostname.split(".");
  const domains = ["", ...parts.map((_, i) => "." + parts.slice(i).join(".")).slice(0, -1)];
  for (const name of names) {
    if (!/^(_ga|_gid|_gat|_clck|_clsk|CLID|MUID)/.test(name)) continue;
    for (const d of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ""}`;
    }
  }
}

export function initCookieConsent() {
  const dlg = document.getElementById("ck-dialog") as HTMLDialogElement | null;
  const bar = document.getElementById("ck-bar");
  if (!dlg || !bar) return;

  const ga4 = dlg.dataset.ga4;
  const clarity = dlg.dataset.clarity;
  const hasTools = Boolean(ga4 || clarity);
  const box = (name: string) => dlg.querySelector<HTMLInputElement>(`input[name="${name}"]`)!;
  const agree = dlg.querySelector<HTMLInputElement>("#ck-agree")!;
  const acceptAll = dlg.querySelector<HTMLButtonElement>('[data-ck="all"]')!;

  const apply = (c: Consent) => {
    if (c.analytics && hasTools) loadAnalytics(ga4, clarity);
  };

  const save = (analytics: boolean, marketing: boolean) => {
    const before = read();
    const c = write({ analytics, marketing });
    bar.hidden = true;
    if (dlg.open) dlg.close();
    if (before?.analytics && !analytics) {
      clearAnalyticsCookies();
      // Scripts already running can't be unloaded; a reload starts the page without them.
      if (loaded) location.reload();
      return;
    }
    apply(c);
  };

  const open = () => {
    const c = read();
    box("analytics").checked = Boolean(c?.analytics);
    box("marketing").checked = Boolean(c?.marketing);
    agree.checked = false;
    acceptAll.disabled = true;
    if (typeof dlg.showModal === "function") dlg.showModal();
  };

  agree.addEventListener("change", () => {
    acceptAll.disabled = !agree.checked;
  });

  document.addEventListener("click", (e) => {
    const t = e.target as Element | null;
    if (t?.closest("[data-ck-open]")) {
      e.preventDefault();
      open();
      return;
    }
    if (t?.closest("[data-ck-close]")) {
      dlg.close();
      return;
    }
    const action = t?.closest<HTMLElement>("[data-ck]")?.dataset.ck;
    if (action === "all" || action === "bar-all") save(true, true);
    else if (action === "essential") save(false, false);
    else if (action === "save") save(box("analytics").checked, box("marketing").checked);
  });

  const stored = read();
  if (stored) apply(stored);
  else if (hasTools) bar.hidden = false;
}
