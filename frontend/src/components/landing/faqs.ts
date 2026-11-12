import { LANDING } from "@/lib/i18n/landing-copy";
import type { SiteLang } from "@/lib/i18n/site";

/** Landing FAQ — shared by the accordion and the FAQPage JSON-LD on each home page. */
export function getFaqs(lang: SiteLang) {
  return LANDING[lang].faqs;
}

export const FAQS = getFaqs("en");
