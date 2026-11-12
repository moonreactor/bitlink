import { plain } from "@/components/blog/RichText";
import { articlePath, blogBase, categoryPath, getCategory, getTranslations, readingMinutes, UI, type Article, type Faq } from "@/lib/content";
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
    inLanguage: ["en", "es"],
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
      inLanguage: article.lang,
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
      inLanguage: article.lang,
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
