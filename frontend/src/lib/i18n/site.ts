/**
 * Site-wide UI languages (landing, shortener, auth). The blog keeps its own `Lang`
 * (en | es) in lib/content — Portuguese blog articles don't exist yet.
 */
export type SiteLang = "en" | "es" | "pt";

export const SITE_LANGS: SiteLang[] = ["en", "es", "pt"];
export const DEFAULT_LANG: SiteLang = "en";
export const LANG_COOKIE = "bl_lang";

export const LANG_LABEL: Record<SiteLang, { short: string; name: string; html: string; og: string }> = {
  en: { short: "EN", name: "English", html: "en", og: "en_US" },
  es: { short: "ES", name: "Español", html: "es", og: "es_419" },
  pt: { short: "PT", name: "Português", html: "pt-BR", og: "pt_BR" },
};

export function isSiteLang(v: unknown): v is SiteLang {
  return v === "en" || v === "es" || v === "pt";
}

/** Home page for each language. */
export function homePath(lang: SiteLang): string {
  return lang === "en" ? "/" : `/${lang}`;
}

/** Free URL shortener landing for each language. */
export function shortenerPath(lang: SiteLang): string {
  return { en: "/url-shortener", es: "/acortador-de-links", pt: "/encurtador-de-links" }[lang];
}

/** In-page anchor on the home page of a language (e.g. /pt#faq). */
export function homeAnchor(lang: SiteLang, id: string): string {
  return `${homePath(lang)}#${id}`;
}

/** Blog is only translated to en/es; Portuguese visitors are not sent to a blog they cannot read. */
export function hasBlog(lang: SiteLang): boolean {
  return lang !== "pt";
}

const PT_COUNTRIES = new Set(["BR", "PT", "AO", "MZ"]);
const ES_COUNTRIES = new Set([
  "AR", "MX", "ES", "CL", "CO", "PE", "UY", "PY", "BO", "EC", "VE", "CR", "PA", "GT", "HN", "SV", "NI", "DO", "CU", "PR",
]);

export function langFromCountry(country: string | null | undefined): SiteLang | null {
  const c = (country || "").trim().toUpperCase();
  if (PT_COUNTRIES.has(c)) return "pt";
  if (ES_COUNTRIES.has(c)) return "es";
  return null;
}

/** Best supported language from an Accept-Language header, honouring q-values. */
export function langFromAcceptLanguage(header: string | null | undefined): SiteLang | null {
  if (!header) return null;
  const ranked = header
    .split(",")
    .map((part, i) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const weight = q ? Number.parseFloat(q.trim().slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), weight: Number.isFinite(weight) ? weight : 0, i };
    })
    .filter((x) => x.tag && x.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.i - b.i);
  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isSiteLang(base)) return base;
  }
  return null;
}

/**
 * Pick the language for a first-time visitor.
 * 1. A Portuguese/Spanish Accept-Language wins (the visitor told their browser).
 * 2. Otherwise (English or nothing) fall back to the visitor's country, so a Brazilian
 *    with an English browser still lands on Portuguese.
 */
export function detectLang(acceptLanguage: string | null | undefined, country: string | null | undefined): SiteLang {
  const fromHeader = langFromAcceptLanguage(acceptLanguage);
  if (fromHeader && fromHeader !== "en") return fromHeader;
  return langFromCountry(country) ?? fromHeader ?? DEFAULT_LANG;
}

/** Client-side: remember an explicit language choice for a year. */
export function rememberLang(lang: SiteLang): void {
  try {
    document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    /* ignore */
  }
}

/** Client-side: the language the visitor explicitly chose (or the middleware detected), if any. */
export function readLangCookie(): SiteLang | null {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${LANG_COOKIE}=([^;]+)`));
    return m && isSiteLang(m[1]) ? m[1] : null;
  } catch {
    return null;
  }
}
