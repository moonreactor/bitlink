import type { MetadataRoute } from "next";
import {
  articlePath,
  blogBase,
  CATEGORIES,
  categoryPath,
  getArticles,
  getCategory,
  getTranslations,
  hreflangMap,
  LANGS,
  type Lang,
} from "@/lib/content";
import { homePath, shortenerPath, SITE_LANGS, LANG_LABEL } from "@/lib/i18n/site";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const WEB = siteUrl();
  const abs = (p: string) => `${WEB}${p}`;
  const alt = (paths: Partial<Record<Lang, string>>) => ({
    languages: Object.fromEntries(Object.entries(hreflangMap(paths)).map(([k, v]) => [k, abs(v)])),
  });

  const siteAlt = (path: (l: (typeof SITE_LANGS)[number]) => string) => ({
    languages: {
      ...Object.fromEntries(SITE_LANGS.map((l) => [LANG_LABEL[l].html, abs(path(l))])),
      "x-default": abs(path("en")),
    },
  });

  const entries: MetadataRoute.Sitemap = SITE_LANGS.map((l) => ({
    url: abs(homePath(l)),
    changeFrequency: "weekly" as const,
    priority: l === "en" ? 1 : 0.9,
    alternates: siteAlt(homePath),
  }));

  for (const l of SITE_LANGS) {
    entries.push({ url: abs(shortenerPath(l)), changeFrequency: "monthly", priority: 0.9, alternates: siteAlt(shortenerPath) });
  }

  for (const lang of LANGS) {
    const articles = getArticles(lang);
    entries.push({
      url: abs(blogBase(lang)),
      lastModified: articles[0]?.updated || articles[0]?.published,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: alt(Object.fromEntries(LANGS.map((l) => [l, blogBase(l)]))),
    });

    for (const c of CATEGORIES[lang]) {
      const inCat = articles.filter((a) => a.category === c.id);
      const catPaths: Partial<Record<Lang, string>> = {};
      for (const l of LANGS) {
        const twin = getCategory(l, c.id);
        if (twin) catPaths[l] = categoryPath(l, twin.slug);
      }
      const here = categoryPath(lang, c.slug);
      entries.push({
        url: abs(here),
        lastModified: inCat[0]?.updated || inCat[0]?.published,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: alt(catPaths),
      });
    }

    for (const a of articles) {
      const here = articlePath(lang, a.slug);
      const twins = getTranslations(a);
      const artPaths: Partial<Record<Lang, string>> = { [lang]: here };
      for (const tw of twins) artPaths[tw.lang] = articlePath(tw.lang, tw.slug);
      entries.push({
        url: abs(here),
        lastModified: a.updated || a.published,
        changeFrequency: "monthly",
        priority: a.category === "guias" || a.category === "comparativas" ? 0.8 : 0.7,
        images: [abs(a.cover.src)],
        ...(twins.length ? { alternates: alt(artPaths) } : {}),
      });
    }
  }

  entries.push({ url: abs("/register"), changeFrequency: "yearly", priority: 0.5 });
  return entries;
}
