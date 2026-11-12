import { LatestPosts } from "@/components/blog/LatestPosts";
import { faqLd, JsonLd, organizationLd, softwareLd, websiteLd } from "@/lib/jsonld";
import { hasBlog, homePath, type SiteLang } from "@/lib/i18n/site";
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
            faqLd(getFaqs(lang), `${siteUrl()}${homePath(lang)}#faq`),
          ],
        }}
      />
      <LandingPage lang={lang} latestPosts={hasBlog(lang) ? <LatestPosts lang={lang} /> : undefined} />
    </>
  );
}
