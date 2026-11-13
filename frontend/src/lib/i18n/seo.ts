import type { Metadata } from "next";
import { defaultOgImages, siteUrl } from "@/lib/site";
import { LANDING } from "./landing-copy";
import { ABOUT_COPY } from "@/components/about/AboutPage";
import { aboutPath, homePath, LANG_LABEL, shortenerPath, SITE_LANGS, type SiteLang } from "./site";

/** hreflang map (relative URLs; Next resolves them against metadataBase). */
function hreflangMap(path: (l: SiteLang) => string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of SITE_LANGS) out[LANG_LABEL[l].html] = path(l);
  out["x-default"] = path("en");
  return out;
}

export function homeLanguages() {
  return hreflangMap(homePath);
}

export function shortenerLanguages() {
  return hreflangMap(shortenerPath);
}

export function homeMetadata(lang: SiteLang): Metadata {
  const { title, description } = LANDING[lang].meta;
  const path = homePath(lang);
  return {
    // English inherits title/description from the root layout.
    ...(lang === "en" ? {} : { title: { absolute: title }, description }),
    alternates: {
      canonical: path,
      languages: homeLanguages(),
      ...(lang === "en" ? { types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: "Blog de Bitlink" }] } } : {}),
    },
    ...(lang === "en"
      ? {}
      : {
          openGraph: {
            title,
            description,
            url: `${siteUrl()}${path}`,
            siteName: "Bitlink",
            type: "website",
            locale: LANG_LABEL[lang].og,
            images: defaultOgImages(),
          },
          twitter: { card: "summary_large_image", title, description, images: defaultOgImages().map((i) => i.url) },
        }),
  };
}

export function aboutMetadata(lang: SiteLang): Metadata {
  const { title, description } = ABOUT_COPY[lang];
  const path = aboutPath(lang);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path, languages: hreflangMap(aboutPath) },
    openGraph: {
      title,
      description,
      url: `${siteUrl()}${path}`,
      siteName: "Bitlink",
      type: "website",
      locale: LANG_LABEL[lang].og,
      images: defaultOgImages(),
    },
    twitter: { card: "summary_large_image", title, description, images: defaultOgImages().map((i) => i.url) },
  };
}
