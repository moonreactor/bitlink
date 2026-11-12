import type { Lang } from "./types";

export const LANGS: Lang[] = ["en", "es", "pt"];

export const LOCALE: Record<Lang, { og: string; date: string; hreflang: string }> = {
  en: { og: "en_US", date: "en-US", hreflang: "en" },
  es: { og: "es_419", date: "es-AR", hreflang: "es" },
  pt: { og: "pt_BR", date: "pt-BR", hreflang: "pt-BR" },
};

/** Label of the “read this in …” link pointing at each language. */
export const READ_IN: Record<Lang, string> = {
  en: "Read in English",
  es: "Leer en español",
  pt: "Ler em português",
};

/** hreflang map (incl. x-default → English) for a page that exists in several languages. */
export function hreflangMap(paths: Partial<Record<Lang, string>>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of LANGS) {
    const p = paths[l];
    if (p) out[LOCALE[l].hreflang] = p;
  }
  const def = paths.en || Object.values(paths).find(Boolean);
  if (def) out["x-default"] = def;
  return out;
}

export function blogBase(lang: Lang): string {
  return lang === "en" ? "/blog" : `/${lang}/blog`;
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
    rssDescription: "Novedades de Bitlink y guías de link en bio, links cortos, QR, UTMs y analítica.",
  },
  pt: {
    blog: "Blog",
    blogName: "Blog do Bitlink",
    all: "Tudo",
    categoriesNav: "Categorias do blog",
    categoryEyebrow: "Blog · Categoria",
    indexEyebrow: "Blog",
    indexTitle: "Guias, novidades e ideias para o seu link na bio.",
    indexIntro:
      "Tudo o que você precisa para o seu link na bio, seus links curtos e seus QR codes terem mais cliques — explicado passo a passo.",
    metaTitle: "Blog do Bitlink: guias de link na bio, links curtos e QR code",
    metaDescription:
      "Novidades do Bitlink e guias práticos para melhorar seu link na bio: Instagram, TikTok, UTMs, QR codes, domínio próprio, vendas e métricas.",
    minRead: "min de leitura",
    author: "Equipe Bitlink",
    updated: "Atualizado",
    quickAnswer: "Resposta rápida",
    inThisArticle: "Neste artigo",
    faq: "Perguntas frequentes",
    keepReading: "Continue lendo",
    sideCtaTitle: "Seu link na bio, grátis para sempre.",
    sideCtaText: "Links ilimitados, links curtos, QR code e estatísticas.",
    ctaTitle: "Crie seu Bitlink de graça",
    ctaText: "Link na bio, links curtos, QR code e estatísticas. Sem planos, sem cartão.",
    ctaLabel: "Criar meu Bitlink",
    callout: { tip: "Dica", note: "Bom saber", warn: "Atenção" },
    latestEyebrow: "Blog",
    latestTitle: "Guias para conseguir mais cliques.",
    latestAll: "Ver todos os guias →",
    rssDescription: "Novidades do Bitlink e guias sobre link na bio, links curtos, QR code, UTMs e análise de dados.",
  },
} as const;

export type UIStrings = (typeof UI)[Lang];
