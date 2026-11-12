import { slugify } from "@/lib/slugify";
import { ARTICLES_EN } from "./articles/en";
import { ARTICLES_ES } from "./articles/es";
import { LOCALE } from "./i18n";
import type { Article, Block, Category, CategoryId, Lang } from "./types";

export * from "./types";
export * from "./i18n";

export const CATEGORIES: Record<Lang, Category[]> = {
  en: [
    {
      id: "novedades",
      slug: "news",
      name: "News",
      title: "Bitlink news",
      description: "Launches, new features and changes in Bitlink, explained in plain language.",
    },
    {
      id: "guias",
      slug: "guides",
      name: "Guides",
      title: "Step-by-step guides",
      description: "Practical tutorials on link in bio, short links, QR codes, UTMs and analytics.",
    },
    {
      id: "comparativas",
      slug: "comparisons",
      name: "Comparisons",
      title: "Comparisons and alternatives",
      description: "What to look for before choosing a link-in-bio tool or a URL shortener.",
    },
    {
      id: "casos-de-uso",
      slug: "use-cases",
      name: "Use cases",
      title: "Use cases",
      description: "Concrete ideas for musicians, restaurants, creators, small businesses and brands.",
    },
  ],
  es: [
    {
      id: "novedades",
      slug: "novedades",
      name: "Novedades",
      title: "Novedades de Bitlink",
      description: "Lanzamientos, funciones nuevas y cambios en Bitlink, explicados en lenguaje simple.",
    },
    {
      id: "guias",
      slug: "guias",
      name: "Guías",
      title: "Guías paso a paso",
      description: "Tutoriales prácticos sobre link en bio, links cortos, códigos QR, UTMs y analítica.",
    },
    {
      id: "comparativas",
      slug: "comparativas",
      name: "Comparativas",
      title: "Comparativas y alternativas",
      description: "Qué mirar antes de elegir una herramienta de link en bio o un acortador de links.",
    },
    {
      id: "casos-de-uso",
      slug: "casos-de-uso",
      name: "Casos de uso",
      title: "Casos de uso",
      description: "Ideas concretas para músicos, restaurantes, creadores, emprendedores y marcas.",
    },
  ],
};

const ALL: Record<Lang, Article[]> = { en: ARTICLES_EN, es: ARTICLES_ES };

/** Newest first; articles dated in the future stay hidden until their day. */
export function getArticles(lang: Lang, now: Date = new Date()): Article[] {
  const today = now.toISOString().slice(0, 10);
  return ALL[lang]
    .filter((a) => a.published <= today)
    .sort((a, b) =>
      b.published === a.published ? a.title.localeCompare(b.title) : b.published.localeCompare(a.published),
    );
}

export function getArticle(lang: Lang, slug: string): Article | undefined {
  return getArticles(lang).find((a) => a.slug === slug);
}

/** The same article in the other language(s), for hreflang and the language switch. */
export function getTranslations(article: Article): Article[] {
  return (["en", "es"] as Lang[])
    .filter((l) => l !== article.lang)
    .map((l) => getArticles(l).find((a) => a.key === article.key))
    .filter((a): a is Article => Boolean(a));
}

export function getCategory(lang: Lang, id: CategoryId): Category | undefined {
  return CATEGORIES[lang].find((c) => c.id === id);
}

export function getCategoryBySlug(lang: Lang, slug: string): Category | undefined {
  return CATEGORIES[lang].find((c) => c.slug === slug);
}

export function getArticlesByCategory(lang: Lang, id: CategoryId): Article[] {
  return getArticles(lang).filter((a) => a.category === id);
}

export function getRelated(article: Article, count = 3): Article[] {
  const all = getArticles(article.lang).filter((a) => a.slug !== article.slug);
  const picked = (article.related || [])
    .map((slug) => all.find((a) => a.slug === slug))
    .filter((a): a is Article => Boolean(a));
  for (const a of all) {
    if (picked.length >= count) break;
    if (!picked.includes(a) && a.category === article.category) picked.push(a);
  }
  for (const a of all) {
    if (picked.length >= count) break;
    if (!picked.includes(a)) picked.push(a);
  }
  return picked.slice(0, count);
}

export function headingId(block: Extract<Block, { type: "h2" }>): string {
  return block.id || slugify(block.text);
}

export function toc(article: Article): { id: string; text: string }[] {
  return article.body
    .filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ id: headingId(b), text: b.text }));
}

function blockWords(b: Block): string {
  switch (b.type) {
    case "ul":
    case "ol":
      return b.items.join(" ");
    case "table":
      return [...b.head, ...b.rows.flat()].join(" ");
    case "steps":
      return b.items.map((s) => `${s.title} ${s.text}`).join(" ");
    case "cta":
      return `${b.title || ""} ${b.text || ""}`;
    default:
      return b.text;
  }
}

export function readingMinutes(article: Article): number {
  const text = [
    article.tldr,
    ...article.takeaways,
    ...article.body.map(blockWords),
    ...article.faqs.map((f) => f.q + " " + f.a),
  ].join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 220));
}

export function formatDate(iso: string, lang: Lang): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(LOCALE[lang].date, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
