import { AboutPage } from "@/components/about/AboutPage";
import { aboutMetadata } from "@/lib/i18n/seo";

export const metadata = aboutMetadata("es");

export default function Page() {
  return <AboutPage lang="es" />;
}
