"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { shortLinksApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { ShortLinkItem } from "@/lib/types";

const PRESETS = [
  { fg: "#000000", bg: "#ffffff" },
  { fg: "#4c1d95", bg: "#ffffff" },
  { fg: "#ffffff", bg: "#111827" },
  { fg: "#065f46", bg: "#ecfdf5" },
];

export default function QrToolPage() {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<ShortLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [logo, setLogo] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const selected = items.find((i) => i.id === selectedId) || null;

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    shortLinksApi
      .list(token)
      .then((list) => {
        setItems(list);
        if (list.length) setSelectedId(list[0].id);
      })
      .catch(() => toastError("Could not load short links"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live preview (debounced so dragging the color picker doesn't spam the API).
  useEffect(() => {
    const token = getAccessToken();
    if (!token || !selectedId) return;
    let cancelled = false;
    let objectUrl: string | null = null;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(shortLinksApi.qrUrl(selectedId, "png", { fg, bg, logo }), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const blob = await res.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setPreview(objectUrl);
      } catch {
        if (!cancelled) setPreview(null);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [selectedId, fg, bg, logo]);

  async function download(fmt: "png" | "svg") {
    const token = getAccessToken();
    if (!token || !selected) return;
    setBusy(true);
    try {
      const res = await fetch(shortLinksApi.qrUrl(selected.id, fmt, { fg, bg, logo }), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = `bitlink-${selected.code}.${fmt}`;
      a.click();
      URL.revokeObjectURL(url);
      success(`QR ${fmt.toUpperCase()} downloaded`);
    } catch {
      toastError("Could not download QR");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">QR codes</h1>
        <p className="mt-1 text-sm text-meetup-muted">
          Turn any of your short links into a QR. The QR points to the short URL, so you can change
          the destination later and printed codes keep working.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-meetup-muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className="space-y-3 border-y border-dashed border-meetup-border py-10 text-center">
          <p className="text-sm text-meetup-muted">You don&apos;t have any short links yet.</p>
          <Link href="/dashboard/short-links" className="mu-btn-primary inline-block">
            Create a short link
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[1fr_240px] md:items-start">
          <div className="space-y-5">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink">Short link</span>
              <select
                className="mu-input w-full"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.short_url.replace(/^https?:\/\//, "")}
                    {i.title ? ` — ${i.title}` : ""}
                  </option>
                ))}
              </select>
              {selected && (
                <span className="block truncate text-xs text-meetup-muted">
                  → {selected.destination_url}
                </span>
              )}
            </label>

            <div className="flex flex-wrap gap-2" aria-label="Color presets">
              {PRESETS.map((p) => (
                <button
                  key={p.fg + p.bg}
                  type="button"
                  onClick={() => {
                    setFg(p.fg);
                    setBg(p.bg);
                  }}
                  aria-label={`Preset ${p.fg} on ${p.bg}`}
                  className="h-9 w-9 rounded-lg ring-1 ring-meetup-border"
                  style={{ background: p.bg, color: p.fg }}
                >
                  <span className="text-lg font-bold">▪</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-ink">QR color</span>
                <input
                  type="color"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="h-10 w-full cursor-pointer rounded-lg ring-1 ring-meetup-border"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-ink">Background</span>
                <input
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="h-10 w-full cursor-pointer rounded-lg ring-1 ring-meetup-border"
                />
              </label>
            </div>
            <p className="text-xs text-meetup-muted">
              Keep strong contrast with a dark QR on a light background so it scans reliably.
            </p>

            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={logo} onChange={(e) => setLogo(e.target.checked)} />
              Show my profile photo in the center (PNG only)
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="mu-btn-primary disabled:opacity-60"
                disabled={busy || !selected}
                onClick={() => download("png")}
              >
                Download PNG
              </button>
              <button
                type="button"
                className="mu-btn-ghost disabled:opacity-60"
                disabled={busy || !selected}
                onClick={() => download("svg")}
              >
                Download SVG
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-2xl bg-white p-5 ring-1 ring-meetup-border">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="QR code preview" className="w-full max-w-[220px] rounded-lg" />
            ) : (
              <div className="aspect-square w-full max-w-[220px] animate-pulse rounded-lg bg-black/5" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
