import type { MetadataRoute } from "next";
import {
  articlePath,
  blogBase,
  CATEGORIES,
  categoryPath,
  getArticles,
  getCategory,
  getTranslations,
  LANGS,
  type Lang,
} from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const WEB = siteUrl();
  const abs = (p: string) => `${WEB}${p}`;
  const pair = (en: string, es: string) => ({ languages: { en: abs(en), es: abs(es), "x-default": abs(en) } });
  const otherLang = (l: Lang): Lang => (l === "en" ? "es" : "en");

  const entries: MetadataRoute.Sitemap = [{ url: abs("/"), changeFrequency: "weekly", priority: 1 }];

  for (const lang of LANGS) {
    const articles = getArticles(lang);
    entries.push({
      url: abs(blogBase(lang)),
      lastModified: articles[0]?.updated || articles[0]?.published,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: pair(blogBase("en"), blogBase("es")),
    });

    for (const c of CATEGORIES[lang]) {
      const inCat = articles.filter((a) => a.category === c.id);
      const twin = getCategory(otherLang(lang), c.id);
      const here = categoryPath(lang, c.slug);
      const there = twin ? categoryPath(otherLang(lang), twin.slug) : undefined;
      entries.push({
        url: abs(here),
        lastModified: inCat[0]?.updated || inCat[0]?.published,
        changeFrequency: "weekly",
        priority: 0.6,
        ...(there ? { alternates: lang === "en" ? pair(here, there) : pair(there, here) } : {}),
      });
    }

    for (const a of articles) {
      const here = articlePath(lang, a.slug);
      const twin = getTranslations(a)[0];
      const there = twin ? articlePath(twin.lang, twin.slug) : undefined;
      entries.push({
        url: abs(here),
        lastModified: a.updated || a.published,
        changeFrequency: "monthly",
        priority: a.category === "guias" || a.category === "comparativas" ? 0.8 : 0.7,
        images: [abs(a.cover.src)],
        ...(there ? { alternates: lang === "en" ? pair(here, there) : pair(there, here) } : {}),
      });
    }
  }

  entries.push({ url: abs("/register"), changeFrequency: "yearly", priority: 0.5 });
  return entries;
}
