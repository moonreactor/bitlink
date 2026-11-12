import type { Lang } from "./types";

export const LANGS: Lang[] = ["en", "es"];

export const LOCALE: Record<Lang, { og: string; date: string; hreflang: string }> = {
  en: { og: "en_US", date: "en-US", hreflang: "en" },
  es: { og: "es_419", date: "es-AR", hreflang: "es" },
};

export function blogBase(lang: Lang): string {
  return lang === "en" ? "/blog" : "/es/blog";
}

export function articlePath(lang: Lang, slug: string): string {
  return `${blogBase(lang)}/${slug}`;
}

export function categoryPath(lang: Lang, slug: string): string {
  return `${blogBase(lang)}/${lang === "en" ? "category" : "categoria"}/${slug}`;
}

export function rssPath(lang: Lang): string {
  return `${blogBase(lang)}/rss.xml`;
}

export const UI = {
  en: {
    blog: "Blog",
    blogName: "Bitlink Blog",
    all: "All",
    categoriesNav: "Blog categories",
    categoryEyebrow: "Blog · Category",
    indexEyebrow: "Blog",
    indexTitle: "Guides, news and ideas for your link in bio.",
    indexIntro:
      "Everything you need to get more clicks from your link in bio, short links and QR codes — explained step by step.",
    metaTitle: "Bitlink Blog: link-in-bio, short link and QR code guides",
    metaDescription:
      "Bitlink news and practical guides to improve your link in bio: Instagram, TikTok, UTMs, QR codes, custom domains, selling and analytics.",
    minRead: "min read",
    author: "Bitlink Team",
    updated: "Updated",
    quickAnswer: "Quick answer",
    inThisArticle: "In this article",
    faq: "Frequently asked questions",
    keepReading: "Keep reading",
    sideCtaTitle: "Your link in bio, free forever.",
    sideCtaText: "Unlimited links, short links, QR codes and analytics.",
    ctaTitle: "Build your Bitlink for free",
    ctaText: "Link in bio, short links, QR codes and analytics. No plans, no card.",
    ctaLabel: "Create my Bitlink",
    callout: { tip: "Tip", note: "Good to know", warn: "Heads up" },
    latestEyebrow: "Blog",
    latestTitle: "Guides to get more clicks.",
    latestAll: "See all guides →",
    otherLang: "Leer en español",
    rssDescription: "Bitlink news and guides on link in bio, short links, QR codes, UTMs and analytics.",
  },
  es: {
    blog: "Blog",
    blogName: "Blog de Bitlink",
    all: "Todo",
    categoriesNav: "Categorías del blog",
    categoryEyebrow: "Blog · Categoría",
    indexEyebrow: "Blog",
    indexTitle: "Guías, novedades e ideas para tu link en bio.",
    indexIntro:
      "Todo lo que necesitás para que tu link en bio, tus links cortos y tus QR consigan más clics — explicado paso a paso.",
    metaTitle: "Blog de Bitlink: guías de link en bio, links cortos y QR",
    metaDescription:
      "Novedades de Bitlink y guías prácticas para mejorar tu link en bio: Instagram, TikTok, UTMs, códigos QR, dominio propio, ventas y métricas.",
    minRead: "min de lectura",
    author: "Equipo Bitlink",
    updated: "Actualizado",
    quickAnswer: "Respuesta rápida",
    inThisArticle: "En esta nota",
    faq: "Preguntas frecuentes",
    keepReading: "Seguí leyendo",
    sideCtaTitle: "Tu link en bio, gratis para siempre.",
    sideCtaText: "Links ilimitados, links cortos, QR y estadísticas.",
    ctaTitle: "Armá tu Bitlink gratis",
    ctaText: "Link en bio, links cortos, QR y estadísticas. Sin planes ni tarjeta.",
    ctaLabel: "Crear mi Bitlink",
    callout: { tip: "Tip", note: "Para tener en cuenta", warn: "Atención" },
    latestEyebrow: "Blog",
    latestTitle: "Guías para conseguir más clics.",
    latestAll: "Ver todas las guías →",
    otherLang: "Read in English",
    rssDescription: "Novedades de Bitlink y guías de link en bio, links cortos, QR, UTMs y analítica.",
  },
} as const;

export type UIStrings = (typeof UI)[Lang];
