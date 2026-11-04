"use client";

import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { shortLinksApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { ShortLinkItem } from "@/lib/types";

type Draft = {
  destination_url: string;
  code: string;
  title: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
};

const emptyDraft = (): Draft => ({
  destination_url: "",
  code: "",
  title: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
});

export default function ShortLinksPage() {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<ShortLinkItem[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [showUtm, setShowUtm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [codeHint, setCodeHint] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDest, setEditDest] = useState("");

  async function load() {
    const token = getAccessToken();
    if (!token) return;
    setItems(await shortLinksApi.list(token));
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const code = draft.code.trim().toLowerCase();
    if (code.length < 2) {
      setCodeHint("");
      return;
    }
    const token = getAccessToken();
    if (!token) return;
    const t = window.setTimeout(() => {
      shortLinksApi
        .check(token, code)
        .then((r) => setCodeHint(r.available ? "Available" : "Taken"))
        .catch(() => setCodeHint(""));
    }, 300);
    return () => window.clearTimeout(t);
  }, [draft.code]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    setSaving(true);
    try {
      await shortLinksApi.create(token, {
        destination_url: draft.destination_url.trim(),
        code: draft.code.trim() || null,
        title: draft.title.trim() || null,
        utm_source: draft.utm_source.trim() || null,
        utm_medium: draft.utm_medium.trim() || null,
        utm_campaign: draft.utm_campaign.trim() || null,
        utm_term: draft.utm_term.trim() || null,
        utm_content: draft.utm_content.trim() || null,
      });
      setDraft(emptyDraft());
      setShowUtm(false);
      setCodeHint("");
      await load();
      success("Short link created");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to create short link");
    } finally {
      setSaving(false);
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      success("Copied");
    } catch {
      toastError("Could not copy");
    }
  }

  async function toggleActive(item: ShortLinkItem) {
    const token = getAccessToken();
    if (!token) return;
    try {
      await shortLinksApi.update(token, item.id, { is_active: !item.is_active });
      await load();
      success(item.is_active ? "Short link disabled" : "Short link enabled");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function saveDestination(item: ShortLinkItem) {
    const token = getAccessToken();
    if (!token) return;
    try {
      await shortLinksApi.update(token, item.id, { destination_url: editDest.trim() });
      setEditingId(null);
      await load();
      success("Destination updated");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update destination");
    }
  }

  async function remove(item: ShortLinkItem) {
    const token = getAccessToken();
    if (!token) return;
    if (!confirm(`Delete ${item.short_url}?`)) return;
    try {
      await shortLinksApi.remove(token, item.id);
      await load();
      success("Short link deleted");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  async function downloadQr(item: ShortLinkItem) {
    const token = getAccessToken();
    if (!token) return;
    try {
      const res = await fetch(shortLinksApi.qrUrl(item.id, "png"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bitlink-${item.code}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toastError("Could not download QR");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Short links</h1>
        <p className="mt-1 text-sm text-meetup-muted">
          Unlimited branded shorts with UTMs, editable destinations, and QR — free.
        </p>
      </div>

      <form onSubmit={onCreate} className="mu-card space-y-4 p-5 md:p-6">
        <label className="block text-sm">
          <span className="mb-1 block font-semibold">Destination URL</span>
          <input
            className="mu-input"
            required
            placeholder="https://example.com/landing"
            value={draft.destination_url}
            onChange={(e) => setDraft({ ...draft, destination_url: e.target.value })}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold">Custom back-half (optional)</span>
            <input
              className="mu-input"
              placeholder="promo"
              value={draft.code}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  code: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
                })
              }
            />
            {codeHint && (
              <span
                className={`mt-1 block text-xs font-semibold ${
                  codeHint === "Available" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {codeHint}
              </span>
            )}
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold">Title (optional)</span>
            <input
              className="mu-input"
              placeholder="Instagram bio"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </label>
        </div>

        <button
          type="button"
          className="text-sm font-semibold text-meetup-purple hover:underline"
          onClick={() => setShowUtm((v) => !v)}
        >
          {showUtm ? "Hide UTM builder" : "Add UTMs"}
        </button>

        {showUtm && (
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["utm_source", "utm_source"],
                ["utm_medium", "utm_medium"],
                ["utm_campaign", "utm_campaign"],
                ["utm_term", "utm_term"],
                ["utm_content", "utm_content"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="mb-1 block font-medium">{label}</span>
                <input
                  className="mu-input"
                  value={draft[key]}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                />
              </label>
            ))}
          </div>
        )}

        <button type="submit" disabled={saving} className="mu-btn-primary disabled:opacity-60">
          {saving ? "Creating…" : "Create short link"}
        </button>
      </form>

      <section className="space-y-3">
        {items.length === 0 && (
          <p className="rounded-2xl border border-dashed border-meetup-border bg-white px-4 py-10 text-center text-sm text-meetup-muted">
            No short links yet. Create your first one above.
          </p>
        )}
        {items.map((item) => (
          <article
            key={item.id}
            className={`mu-card space-y-3 p-4 md:p-5 ${item.is_active ? "" : "opacity-60"}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-lg font-bold text-ink">
                  {item.title || item.code}
                </p>
                <button
                  type="button"
                  className="mt-0.5 text-sm font-semibold text-meetup-purple hover:underline"
                  onClick={() => copyText(item.short_url)}
                >
                  {item.short_url}
                </button>
                <p className="mt-1 truncate text-xs text-meetup-muted">{item.final_url}</p>
              </div>
              <span className="rounded-full bg-meetup-lavender px-2.5 py-1 text-xs font-bold tabular-nums text-meetup-purple">
                {item.clicks} clicks
              </span>
            </div>

            {editingId === item.id ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  className="mu-input flex-1"
                  value={editDest}
                  onChange={(e) => setEditDest(e.target.value)}
                />
                <button type="button" className="mu-btn-primary" onClick={() => saveDestination(item)}>
                  Save
                </button>
                <button type="button" className="mu-btn-ghost" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <MiniBtn onClick={() => copyText(item.short_url)}>Copy</MiniBtn>
                <MiniBtn
                  onClick={() => {
                    setEditingId(item.id);
                    setEditDest(item.destination_url);
                  }}
                >
                  Edit destination
                </MiniBtn>
                <MiniBtn onClick={() => downloadQr(item)}>QR PNG</MiniBtn>
                <MiniBtn onClick={() => toggleActive(item)}>
                  {item.is_active ? "Disable" : "Enable"}
                </MiniBtn>
                <MiniBtn onClick={() => remove(item)} danger>
                  Delete
                </MiniBtn>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}

function MiniBtn({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
        danger
          ? "border-red-200 text-red-600 hover:bg-red-50"
          : "border-meetup-border text-meetup-muted hover:border-meetup-purple/40 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
