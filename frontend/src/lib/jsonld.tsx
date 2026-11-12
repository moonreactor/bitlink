import { plain } from "@/components/blog/RichText";
import { articlePath, blogBase, categoryPath, getCategory, getTranslations, LOCALE, readingMinutes, UI, type Article, type Faq } from "@/lib/content";
import { LANG_LABEL, shortenerPath, type SiteLang } from "@/lib/i18n/site";
import { absoluteAsset, OG_IMAGE_PATH, siteUrl } from "@/lib/site";

const WEB = siteUrl();
export const ORG_ID = `${WEB}/#organization`;
export const SITE_ID = `${WEB}/#website`;

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapes everything except "<", which could close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationLd() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Bitlink",
    url: WEB,
    logo: { "@type": "ImageObject", url: absoluteAsset("/bitlink-logo.png") },
    description:
      "Bitlink is a free link-in-bio and URL shortener with analytics, QR codes, UTMs, custom domains and products. No paid plans.",
  };
}

export function websiteLd() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: WEB,
    name: "Bitlink",
    inLanguage: ["en", "es", "pt-BR"],
    publisher: { "@id": ORG_ID },
  };
}

export function softwareLd() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${WEB}/#software`,
    name: "Bitlink",
    url: WEB,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    image: absoluteAsset(OG_IMAGE_PATH),
    description:
      "Link-in-bio and URL shortener, free forever: unlimited links, short links on bitlink.click with UTMs and device/geo routing, custom QR codes, analytics with CSV export, custom domains, products and tips.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "Unlimited link-in-bio links",
      "Unlimited short links with custom back-halves",
      "UTM parameters, device and country routing",
      "Custom QR codes (PNG/SVG) with editable destination",
      "Analytics: views, clicks, sources, countries, CSV export",
      "YouTube and Spotify embeds",
      "Custom domain",
      "Products with external checkout, tip jar",
      "Email and phone capture, Google Analytics and Meta Pixel",
      "Scheduled and password-locked links",
    ],
    publisher: { "@id": ORG_ID },
  };
}

export function shortenerLd(lang: SiteLang) {
  const path = shortenerPath(lang);
  return {
    "@type": "WebApplication",
    "@id": `${WEB}${path}#app`,
    name: { en: "Bitlink free URL shortener", es: "Acortador de links gratis de Bitlink", pt: "Encurtador de links grátis do Bitlink" }[lang],
    url: `${WEB}${path}`,
    inLanguage: LANG_LABEL[lang].html,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: {
      en: "Shorten links for free: no sign-up and no limits. A free account shows clicks by day, country, device and source and keeps your links forever (anonymous links are kept for 60 days).",
      es: "Acortá links gratis, sin registro y sin límites. Con una cuenta gratis ves clics por día, país, dispositivo y origen y conservás tus links para siempre (los anónimos se conservan 60 días).",
      pt: "Encurte links de graça: sem cadastro e sem limites. Com uma conta grátis você vê cliques por dia, país, dispositivo e origem e mantém seus links para sempre (os anônimos ficam guardados por 60 dias).",
    }[lang],
    featureList: {
      en: ["No sign-up", "Unlimited links", "Links never expire with a free account", "Clicks by country, device and source with a free account", "QR codes", "UTMs and device/country rules"],
      es: ["Sin registro", "Links ilimitados", "Sin vencimiento con cuenta gratis", "Clics por país, dispositivo y origen con cuenta gratis", "Códigos QR", "UTMs y reglas por dispositivo y país"],
      pt: ["Sem cadastro", "Links ilimitados", "Sem expiração com conta grátis", "Cliques por país, dispositivo e origem com conta grátis", "QR codes", "UTMs e regras por dispositivo e país"],
    }[lang],
    publisher: { "@id": ORG_ID },
  };
}

export function faqLd(faqs: Faq[], id?: string) {
  return {
    "@type": "FAQPage",
    ...(id ? { "@id": id } : {}),
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: plain(f.q),
      acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${WEB}${item.path}`,
    })),
  };
}

export function articleUrl(article: Article): string {
  return `${WEB}${articlePath(article.lang, article.slug)}`;
}

export function articleLd(article: Article) {
  const url = articleUrl(article);
  const category = getCategory(article.lang, article.category);
  const t = UI[article.lang];
  const isNews = article.category === "novedades";
  const ld: Record<string, unknown>[] = [
    {
      "@type": isNews ? "NewsArticle" : "BlogPosting",
      "@id": `${url}#article`,
      mainEntityOfPage: url,
      headline: article.title,
      description: article.description,
      abstract: plain(article.tldr),
      image: [`${url}/opengraph-image`, absoluteAsset(article.cover.src)],
      datePublished: article.published,
      dateModified: article.updated || article.published,
      inLanguage: LOCALE[article.lang].hreflang,
      workTranslation: getTranslations(article).map((tr) => ({ "@id": `${articleUrl(tr)}#article` })),
      articleSection: category?.name,
      keywords: article.keywords.join(", "),
      timeRequired: `PT${readingMinutes(article)}M`,
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      isPartOf: { "@id": SITE_ID },
      about: { "@id": `${WEB}/#software` },
    },
    breadcrumbLd([
      { name: "Bitlink", path: "/" },
      { name: t.blog, path: blogBase(article.lang) },
      ...(category ? [{ name: category.name, path: categoryPath(article.lang, category.slug) }] : []),
      { name: article.title, path: articlePath(article.lang, article.slug) },
    ]),
  ];

  if (article.faqs.length) ld.push(faqLd(article.faqs, `${url}#faq`));

  for (const block of article.body) {
    if (block.type !== "steps") continue;
    ld.push({
      "@type": "HowTo",
      name: block.name,
      inLanguage: LOCALE[article.lang].hreflang,
      totalTime: "PT10M",
      estimatedCost: { "@type": "MonetaryAmount", currency: "USD", value: "0" },
      step: block.items.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: plain(s.title),
        text: plain(s.text),
        url: `${url}#paso-${i + 1}`,
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": [organizationLd(), ...ld] };
}
