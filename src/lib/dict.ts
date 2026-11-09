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
  footer_privacy: { he: "מדיניות פרטיות", en: "Privacy policy" },
  back_home: { he: "חזרה לעמוד הבית", en: "Back to home" },

  // Testimonials
  tst_of_five: { he: "מתוך 5", en: "out of 5" },
  tst_avg_label: { he: "דירוג ממוצע", en: "Average rating" },
  tst_count_one: { he: "המלצה אחת", en: "1 testimonial" },
  tst_count_many: { he: "המלצות", en: "testimonials" },
  tst_play_video: { he: "צפייה בהמלצה בווידאו", en: "Watch the video testimonial" },
  tst_video_title: { he: "המלצת וידאו", en: "Video testimonial" },

  // Privacy page chrome
  priv_toc: { he: "תוכן עניינים", en: "Contents" },
  priv_updated: { he: "עודכן לאחרונה", en: "Last updated" },
  priv_contact_cta: { he: "שאלה על הפרטיות שלכם? דברו איתי", en: "Questions about your privacy? Get in touch" },

  // Contact popup + floating button
  cf_fab: { he: "בואו נדבר - השאירו פרטים", en: "Let's talk - leave your details" },
  cf_title: { he: "בואו נדבר", en: "Let's talk" },
  cf_subtitle: {
    he: "השאירו פרטים ואחזור אליכם לתיאום פגישה.",
    en: "Leave your details and I'll get back to you to schedule a meeting.",
  },
  cf_name: { he: "שם מלא", en: "Full name" },
  cf_email: { he: "אימייל", en: "Email" },
  cf_phone: { he: "טלפון / וואטסאפ", en: "Phone / WhatsApp" },
  cf_goal: {
    he: "איזה תהליך חוזר בעסק שלכם גוזל לכם הכי הרבה זמן, כסף וכאבי ראש?",
    en: "Which repetitive process in your business costs you the most time, money and headaches?",
  },
  cf_goal_ph: {
    he: "למשל: העתקת לידים ל-CRM ידנית, הצעות מחיר שלוקחות שעות, דוחות שבועיים, לקוחות שנופלים בין הכיסאות…",
    en: "e.g. copying leads into the CRM by hand, quotes that take hours, weekly reports, customers falling through the cracks…",
  },
  cf_consent_a: {
    he: "אשמח לקבל מידע נוסף על שירותי SyncMoto | אני כמובן מאשר/ת קבלת דיוור פרסומי למייל ולמספר הטלפון/וואטסאפ, ו/או פנייה טלפונית, בכפוף",
    en: "I'd like to receive more information about SyncMoto's services. I confirm that I agree to receive promotional emails and messages to my email and phone/WhatsApp, and/or phone calls, subject to the",
  },
  cf_consent_link: { he: "למדיניות הפרטיות", en: "privacy policy" },
  cf_note: {
    he: "הפרטים ישמשו לחזרה אליכם בלבד, אלא אם סימנתם את התיבה לקבלת מידע נוסף.",
    en: "Your details are used only to get back to you, unless you tick the box above to receive more information.",
  },
  cf_submit: { he: "חזרו אלי בבקשה לתיאום פגישה", en: "Please get back to me to schedule a meeting" },
  cf_err_required: { he: "שדה חובה", en: "This field is required" },
  cf_err_email: { he: "נא להזין כתובת אימייל תקינה", en: "Please enter a valid email address" },
  cf_err_phone: { he: "נא להזין מספר טלפון תקין", en: "Please enter a valid phone number" },
  cf_success_title: { he: "תודה! פותח עבורכם וואטסאפ…", en: "Thanks! Opening WhatsApp for you…" },
  cf_success_body: {
    he: "לחצו על ״שליחה״ בוואטסאפ כדי שההודעה תגיע אליי. אם וואטסאפ לא נפתח, אפשר לפתוח אותו כאן:",
    en: "Tap Send in WhatsApp so your message reaches me. If WhatsApp didn't open, use this link:",
  },
  cf_success_link: { he: "פתיחת וואטסאפ", en: "Open WhatsApp" },

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
