import { LatestPosts } from "@/components/blog/LatestPosts";
import { FAQS } from "@/components/landing/faqs";
import { LandingPage } from "@/components/landing/LandingPage";
import { faqLd, JsonLd, organizationLd, softwareLd, websiteLd } from "@/lib/jsonld";
import { siteUrl } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: "Blog de Bitlink" }] },
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [organizationLd(), websiteLd(), softwareLd(), faqLd(FAQS, `${siteUrl()}/#faq`)],
        }}
      />
      <LandingPage latestPosts={<LatestPosts />} />
    </>
  );
}
