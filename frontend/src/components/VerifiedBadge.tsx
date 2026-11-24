"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { SiteLang } from "@/lib/i18n/site";
import { BADGE_COLOR, VERIFICATION_COPY, verificationType, verifiedSince } from "@/lib/verification";

function Check({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Small, non-interactive badge (directory cards, short link preview, admin). */
export function VerifiedMark({
  type,
  lang,
  size = 16,
}: {
  type: string | null | undefined;
  lang: SiteLang;
  size?: number;
}) {
  const kind = verificationType(type);
  const t = VERIFICATION_COPY[lang];
  const label = `${t.verified} · ${t.types[kind]}`;
  return (
    <span
      role="img"
      title={label}
      aria-label={label}
      className="inline-flex shrink-0 items-center justify-center rounded-full text-white"
      style={{ width: size, height: size, background: BADGE_COLOR[kind] }}
    >
      <Check size={Math.round(size * 0.6)} />
    </span>
  );
}

/**
 * Badge next to the profile name; opens a card that says who verified the account and since when.
 * The card is centered on the nearest positioned ancestor (the name heading), so it never runs
 * off the edge of a phone screen however long the name is.
 */
export function VerifiedBadge({
  type,
  verifiedAt,
  domain,
  lang,
}: {
  type: string | null | undefined;
  verifiedAt: string | null | undefined;
  domain?: string | null;
  lang: SiteLang;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const panelId = useId();
  const kind = verificationType(type);
  const t = VERIFICATION_COPY[lang];
  const since = verifiedSince(verifiedAt, lang);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={ref} className="inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${t.verified} · ${t.types[kind]}`}
        title={`${t.verified} · ${t.types[kind]}`}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-white shadow transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        style={{ background: BADGE_COLOR[kind] }}
      >
        <Check size={14} />
      </button>
      {open && (
        <span
          id={panelId}
          role="dialog"
          aria-label={t.title(t.types[kind])}
          className="absolute left-1/2 top-full z-30 mt-2 w-64 max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-2xl bg-white p-4 text-left text-sm font-normal text-slate-800 shadow-xl ring-1 ring-black/5"
        >
          <span className="flex items-center gap-2 font-semibold text-slate-900">
            <VerifiedMark type={kind} lang={lang} size={18} />
            {t.title(t.types[kind])}
          </span>
          <span className="mt-2 block text-xs leading-relaxed text-slate-600">{t.explanation}</span>
          {(since || domain) && (
            <span className="mt-3 block space-y-1 border-t border-slate-100 pt-3 text-xs text-slate-700">
              {since && <span className="block">{t.since(since)}</span>}
              {domain && <span className="block">{t.domain(domain)}</span>}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
