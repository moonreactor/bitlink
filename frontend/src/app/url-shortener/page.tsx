import type { Metadata } from "next";
import { shortenerLanguages } from "@/lib/i18n/seo";
import { ShortenerPage } from "@/components/shortener/ShortenerPage";

export const metadata: Metadata = {
  title: "Free Bitlink Creator: URL Shortener, No Sign-up | Bitlink",
  description:
    "Free bitlink creator: turn any long URL into a short link in one click, with no account and no limits. Add a free Bitlink account to track clicks.",
  alternates: {
    canonical: "/url-shortener",
    languages: shortenerLanguages(),
  },
};

export default function Page() {
  return <ShortenerPage lang="en" />;
}
