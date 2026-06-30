import type { Dict } from "./i18n";
import settings from "../content/settings.json";
import about from "../content/about.json";

/** Every `<base>_he` / `<base>_en` pair on a flat object becomes a `<base>` key. */
export function collectPairs(obj: Record<string, unknown>): Dict {
  const d: Dict = {};
  for (const key of Object.keys(obj)) {
    if (key.endsWith("_he")) {
      const base = key.slice(0, -3);
      const en = `${base}_en`;
      if (en in obj) {
        d[base] = { he: String(obj[key]), en: String(obj[en]) };
      }
    }
  }
  return d;
}

// Static UI labels shared by every page (not authored in content files).
const STATIC_LABELS: Dict = {
  // Portfolio cards
  demo_note: {
    he: "פרוטוטייפ פרטי / דמו זמין לפי בקשה",
    en: "Private prototype / demo available on request",
  },
  label_featured: { he: "מומלץ", en: "Featured" },
  label_outcome: { he: "תוצאה", en: "Outcome" },
  label_view_live: { he: "צפייה באתר", en: "View live" },
  label_case: { he: "מקרה בוחן", en: "Case study" },
  label_repo: { he: "מאגר קוד", en: "Repository" },
  status_live: { he: "פעיל", en: "Live" },
  "status_in-progress": { he: "בפיתוח", en: "In progress" },
  status_prototype: { he: "פרוטוטייפ", en: "Prototype" },

  // Skip link + footer
  skip_to_content: { he: "דלג לתוכן הראשי", en: "Skip to main content" },
  footer_accessibility: { he: "הצהרת נגישות", en: "Accessibility statement" },
  back_home: { he: "חזרה לעמוד הבית", en: "Back to home" },

  // Accessibility menu
  a11y_button: { he: "תפריט נגישות", en: "Accessibility menu" },
  a11y_title: { he: "נגישות", en: "Accessibility" },
  a11y_font_increase: { he: "הגדל טקסט", en: "Increase text size" },
  a11y_font_decrease: { he: "הקטן טקסט", en: "Decrease text size" },
  a11y_contrast: { he: "ניגודיות גבוהה", en: "High contrast" },
  a11y_links: { he: "הדגשת קישורים", en: "Highlight links" },
  a11y_readable: { he: "גופן קריא", en: "Readable font" },
  a11y_pause_motion: { he: "עצירת אנימציות", en: "Pause animations" },
  a11y_reset: { he: "איפוס הגדרות", en: "Reset settings" },
  a11y_close: { he: "סגירה", en: "Close" },
  a11y_statement_link: { he: "להצהרת הנגישות המלאה", en: "Read the full accessibility statement" },
};

/**
 * Dictionary shared by all pages: settings + about pairs, skill group titles,
 * static UI labels, and the default SEO title/description. Pages add their own
 * page-specific keys (projects, statement text) on top.
 */
export function coreDict(): Dict {
  const d: Dict = {
    ...collectPairs(settings as Record<string, unknown>),
    ...collectPairs(about as Record<string, unknown>),
    ...STATIC_LABELS,
  };
  about.skills.forEach((g, i) => {
    d[`skill_group_${i}`] = { he: g.title_he, en: g.title_en };
  });
  d.__title = { he: settings.site_title_he, en: settings.site_title_en };
  d.__desc = { he: settings.site_description_he, en: settings.site_description_en };
  return d;
}
