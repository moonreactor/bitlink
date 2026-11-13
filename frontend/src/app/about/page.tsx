import { AboutPage } from "@/components/about/AboutPage";
import { aboutMetadata } from "@/lib/i18n/seo";

export const metadata = aboutMetadata("en");

export default function Page() {
  return <AboutPage lang="en" />;
}
