import { AboutPage } from "@/components/about/AboutPage";
import { aboutMetadata } from "@/lib/i18n/seo";

export const metadata = aboutMetadata("pt");

export default function Page() {
  return <AboutPage lang="pt" />;
}
