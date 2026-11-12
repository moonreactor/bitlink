import { HomePage } from "@/components/landing/HomePage";
import { homeMetadata } from "@/lib/i18n/seo";

export const metadata = homeMetadata("pt");

export default function Page() {
  return <HomePage lang="pt" />;
}
