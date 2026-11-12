import type { Metadata } from "next";
import { ShortenerPage } from "@/components/shortener/ShortenerPage";

export const metadata: Metadata = {
  title: "Free URL shortener, no sign-up and no limits | Bitlink",
  description:
    "Shorten links for free, with no account and no limits. Create a free Bitlink account when you want to track clicks.",
  alternates: {
    canonical: "/url-shortener",
    languages: { es: "/acortador-de-links", en: "/url-shortener", "x-default": "/url-shortener" },
  },
};

export default function Page() {
  return <ShortenerPage lang="en" />;
}
