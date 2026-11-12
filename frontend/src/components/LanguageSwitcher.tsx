"use client";

import Link from "next/link";
import { homePath, LANG_LABEL, rememberLang, SITE_LANGS, type SiteLang } from "@/lib/i18n/site";

/** EN · ES · PT toggle. Picking a language is remembered so auto-detection never overrides it. */
export function LanguageSwitcher({
  lang,
  label,
  alternates,
  className = "",
}: {
  lang: SiteLang;
  label: string;
  /** Equivalent page in each language; falls back to that language's home page. */
  alternates?: Partial<Record<SiteLang, string>>;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={`inline-flex items-center rounded-full bg-mist p-0.5 ${className}`}>
      {SITE_LANGS.map((l) => (
        <Link
          key={l}
          href={alternates?.[l] ?? homePath(l)}
          hrefLang={LANG_LABEL[l].html}
          lang={LANG_LABEL[l].html}
          title={LANG_LABEL[l].name}
          aria-current={l === lang ? "true" : undefined}
          onClick={() => rememberLang(l)}
          className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
            l === lang ? "bg-ink text-white" : "text-meetup-muted hover:text-ink"
          }`}
        >
          {LANG_LABEL[l].short}
        </Link>
      ))}
    </div>
  );
}
