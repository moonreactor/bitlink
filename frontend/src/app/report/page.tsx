"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BitlinkLogo } from "@/components/BitlinkLogo";
import { ReportForm } from "@/components/ReportDialog";
import { REPORT_COPY } from "@/lib/i18n/report-copy";
import { useSiteLang } from "@/lib/i18n/useSiteLang";

function ReportContent() {
  const lang = useSiteLang();
  const t = REPORT_COPY[lang];
  const code = useSearchParams().get("code") ?? "";
  return (
    <main className="mx-auto w-full max-w-md px-5 py-12">
      <BitlinkLogo href="/" height={28} />
      <h1 className="mt-8 font-display text-3xl font-bold text-ink">{t.pageTitle}</h1>
      <p className="mt-2 text-sm text-ink/65">{t.pageIntro}</p>
      <div className="mt-6 rounded-2xl border border-ink/10 bg-white/80 p-5">
        <ReportForm key={lang} lang={lang} shortCode={code} inline />
      </div>
      <Link href="/" className="mt-6 inline-block text-sm text-ink/50 hover:text-ink">
        ← Bitlink
      </Link>
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense>
      <ReportContent />
    </Suspense>
  );
}
