"use client";

import { FormEvent, useRef, useState } from "react";
import { useToast } from "@/components/Toast";
import { linksApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { QUICK_ADD, isPrefixOnly, type QuickAddTemplate } from "@/lib/quickAdd";
import { SocialBrandIcon } from "@/lib/socialBrands";
import type { LinkItem } from "@/lib/types";

function normalize(raw: string) {
  const v = raw.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function looksLikeUrl(raw: string) {
  const v = raw.trim();
  return /^https?:\/\/\S+\.\S+/i.test(v) || /^[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v);
}

/**
 * Zero-friction "add your first link": pick a platform (or paste anything) and
 * hit Add — the link is created immediately, no extra form.
 */
export function QuickAddLink({ onCreated }: { onCreated: (link: LinkItem) => void }) {
  const { success, error: toastError } = useToast();
  const [url, setUrl] = useState("");
  const [template, setTemplate] = useState<QuickAddTemplate | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(t: QuickAddTemplate) {
    setTemplate(t);
    setUrl(t.prefix);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(t.prefix.length, t.prefix.length);
    });
  }

  const ready = looksLikeUrl(url) && !isPrefixOnly(url);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const token = getAccessToken();
    if (!token || !ready || busy) return;
    setBusy(true);
    const target = normalize(url);
    let title = template?.label || "";
    if (!title) {
      try {
        title = (await linksApi.meta(token, target)).title;
      } catch {
        try {
          title = new URL(target).hostname.replace(/^www\./, "");
        } catch {
          title = "My link";
        }
      }
    }
    try {
      const link = await linksApi.create(token, { title: title || "My link", url: target, link_type: "url" });
      setUrl("");
      setTemplate(null);
      success("Link added to your page");
      onCreated(link);
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Couldn’t add the link");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {QUICK_ADD.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => pick(t)}
            className={`mu-chip min-h-[40px] shrink-0 ${template?.id === t.id ? "mu-chip-active" : ""}`}
          >
            {t.brand ? (
              <SocialBrandIcon brandId={t.brand} className="text-base" />
            ) : (
              <GlobeIcon />
            )}
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="quick-add-url">
          Link URL
        </label>
        <input
          id="quick-add-url"
          ref={inputRef}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={template ? `${template.prefix}${template.placeholder}` : "Paste any link…"}
          inputMode="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          className="mu-input min-h-[48px] min-w-0 flex-1"
        />
        <button
          type="submit"
          disabled={!ready || busy}
          className="mu-btn-primary min-h-[48px] shrink-0 px-6 disabled:opacity-40"
        >
          {busy ? "Adding…" : "Add"}
        </button>
      </div>
    </form>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </svg>
  );
}
