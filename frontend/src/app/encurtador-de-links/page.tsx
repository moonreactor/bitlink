import type { Metadata } from "next";
import { ShortenerPage } from "@/components/shortener/ShortenerPage";
import { shortenerLanguages } from "@/lib/i18n/seo";

export const metadata: Metadata = {
  title: "Encurtador de links grátis, sem cadastro e sem limites | Bitlink",
  description:
    "Encurte links de graça, sem criar conta e sem limites. Se quiser acompanhar os cliques, crie uma conta grátis no Bitlink.",
  alternates: {
    canonical: "/encurtador-de-links",
    languages: shortenerLanguages(),
  },
};

export default function Page() {
  return <ShortenerPage lang="pt" />;
}
