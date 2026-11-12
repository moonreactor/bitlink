import type { Metadata } from "next";
import { ShortenerPage } from "@/components/shortener/ShortenerPage";

export const metadata: Metadata = {
  title: "Acortador de links gratis, sin registro y sin límites | Bitlink",
  description:
    "Acortá links gratis, sin crear cuenta y sin límites. Si querés seguir las métricas de clics, creá una cuenta gratis en Bitlink.",
  alternates: {
    canonical: "/acortador-de-links",
    languages: { es: "/acortador-de-links", en: "/url-shortener", "x-default": "/url-shortener" },
  },
};

export default function Page() {
  return <ShortenerPage lang="es" />;
}
