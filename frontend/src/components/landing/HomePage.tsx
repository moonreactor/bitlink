import { LatestPosts } from "@/components/blog/LatestPosts";
import { faqLd, JsonLd, organizationLd, siteNavigationLd, softwareLd, websiteLd } from "@/lib/jsonld";
import { LANDING } from "@/lib/i18n/landing-copy";
import { aboutPath, hasBlog, homePath, shortenerPath, type SiteLang } from "@/lib/i18n/site";
import { siteUrl } from "@/lib/site";
import { getFaqs } from "./faqs";
import { LandingPage } from "./LandingPage";

/** Server wrapper shared by `/`, `/es` and `/pt`: structured data + the localised landing. */
export function HomePage({ lang }: { lang: SiteLang }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            organizationLd(),
            websiteLd(),
            softwareLd(),
            siteNavigationLd(lang, [
              { name: LANDING[lang].nav.shorten, path: shortenerPath(lang) },
              { name: LANDING[lang].nav.about, path: aboutPath(lang) },
              { name: LANDING[lang].nav.blog, path: lang === "en" ? "/blog" : `/${lang}/blog` },
            ]),
            faqLd(getFaqs(lang), `${siteUrl()}${homePath(lang)}#faq`),
          ],
        }}
      />
      <LandingPage lang={lang} latestPosts={hasBlog(lang) ? <LatestPosts lang={lang} /> : undefined} />
    </>
  );
}
