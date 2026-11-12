import { LandingNav } from "@/components/landing/LandingNav";
import { SiteFooter } from "@/components/SiteFooter";
import type { Lang } from "@/lib/content";

export function BlogShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <div lang={lang} className="landing-root min-h-screen overflow-x-clip bg-white text-ink">
      <LandingNav lang={lang} />
      <main id="main">{children}</main>
      <SiteFooter lang={lang} />
    </div>
  );
}
