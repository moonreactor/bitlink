import { HomePage } from "@/components/landing/HomePage";
import { homeMetadata } from "@/lib/i18n/seo";

export const metadata = homeMetadata("es");

export default function Page() {
  return <HomePage lang="es" />;
}
