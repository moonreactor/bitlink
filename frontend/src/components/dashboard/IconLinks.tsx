"use client";

import { useState } from "react";
import { SocialBrandIcon, detectSocialBrand } from "@/lib/socialBrands";
import type { LinkItem } from "@/lib/types";

/** The icon row at the top of the public page: same links as everywhere else, shown as icons. */
export function IconLinks({
  icons,
  onSave,
  onToggleActive,
  onMove,
  onRemove,
}: {
  icons: LinkItem[];
  onSave: (link: LinkItem, patch: Partial<LinkItem>) => void;
  onToggleActive: (link: LinkItem) => void;
  onMove: (index: number, delta: -1 | 1) => void;
  onRemove: (id: string) => void;
}) {
  if (icons.length === 0) return null;
  return (
    <section className="mu-card space-y-3 p-4 md:p-5" aria-label="Social icons">
      <div>
        <h2 className="font-display text-lg font-bold text-ink">Social icons</h2>
        <p className="text-sm text-meetup-muted">
          Shown as a row of icons at the top of your page. Switch any link between icon and button.
        </p>
      </div>
      <ul className="space-y-2">
        {icons.map((link, i) => (
          <IconRow
            key={link.id}
            link={link}
            first={i === 0}
            last={i === icons.length - 1}
            onSave={onSave}
            onToggleActive={onToggleActive}
            onMove={(d) => onMove(i, d)}
            onRemove={onRemove}
          />
        ))}
      </ul>
    </section>
  );
}

function IconRow({
  link,
  first,
  last,
  onSave,
  onToggleActive,
  onMove,
  onRemove,
}: {
  link: LinkItem;
  first: boolean;
  last: boolean;
  onSave: (link: LinkItem, patch: Partial<LinkItem>) => void;
  onToggleActive: (link: LinkItem) => void;
  onMove: (delta: -1 | 1) => void;
  onRemove: (id: string) => void;
}) {
  const [url, setUrl] = useState(link.url);
  const brand = detectSocialBrand(link.url);
  const btn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-meetup-border px-2 text-xs font-semibold text-ink hover:bg-mist disabled:opacity-30";
  return (
    <li className="flex flex-wrap items-center gap-2 rounded-xl border border-meetup-border bg-white p-2.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist text-lg">
        {brand ? <SocialBrandIcon brandId={brand.id} className="text-lg" /> : "🔗"}
      </span>
      <div className="min-w-0 flex-1 basis-40">
        <p className={`truncate text-sm font-semibold ${link.is_active ? "text-ink" : "text-meetup-muted line-through"}`}>
          {link.title}
        </p>
        <input
          aria-label={`${link.title} URL`}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => url.trim() && url.trim() !== link.url && onSave(link, { url: url.trim() })}
          className="mt-0.5 w-full truncate bg-transparent text-xs text-meetup-muted outline-none focus:text-ink"
        />
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button type="button" className={btn} disabled={first} onClick={() => onMove(-1)} aria-label="Move earlier">
          ←
        </button>
        <button type="button" className={btn} disabled={last} onClick={() => onMove(1)} aria-label="Move later">
          →
        </button>
        <button type="button" className={btn} onClick={() => onToggleActive(link)}>
          {link.is_active ? "Hide" : "Show"}
        </button>
        <button type="button" className={btn} onClick={() => onSave(link, { display: "button" })}>
          Make button
        </button>
        <button type="button" className={`${btn} text-red-600`} onClick={() => onRemove(link.id)} aria-label="Delete">
          ✕
        </button>
      </div>
    </li>
  );
}

/** "Show as" switch used by the quick-add forms. */
export function DisplayToggle({
  value,
  onChange,
}: {
  value: "button" | "icon";
  onChange: (v: "button" | "icon") => void;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-meetup-muted">
      <span>Show as</span>
      <div role="group" aria-label="Show as" className="inline-flex gap-1 normal-case">
        {(["button", "icon"] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={value === v}
            onClick={() => onChange(v)}
            className={`mu-chip ${value === v ? "mu-chip-active" : ""}`}
          >
            {v === "button" ? "Button" : "Icon"}
          </button>
        ))}
      </div>
    </div>
  );
}
