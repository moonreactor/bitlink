"use client";

import { FormEvent, useEffect, useState } from "react";
import { MediaUploadField } from "@/components/MediaUploadField";
import { useToast } from "@/components/Toast";
import { productsApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { ProductItem } from "@/lib/types";

type Draft = {
  title: string;
  description: string;
  price_label: string;
  checkout_url: string;
  thumbnail_url: string;
};

const emptyDraft = (): Draft => ({
  title: "",
  description: "",
  price_label: "",
  checkout_url: "",
  thumbnail_url: "",
});

export default function ProductsPage() {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<ProductItem[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const token = getAccessToken();
    if (!token) return;
    setItems(await productsApi.list(token));
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    setSaving(true);
    try {
      await productsApi.create(token, {
        title: draft.title.trim(),
        description: draft.description.trim() || null,
        price_label: draft.price_label.trim() || null,
        checkout_url: draft.checkout_url.trim(),
        thumbnail_url: draft.thumbnail_url.trim() || null,
        is_active: true,
      });
      setDraft(emptyDraft());
      await load();
      success("Product added");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: ProductItem) {
    const token = getAccessToken();
    if (!token) return;
    try {
      await productsApi.update(token, item.id, { is_active: !item.is_active });
      await load();
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function saveEdit(item: ProductItem, body: Record<string, unknown>) {
    const token = getAccessToken();
    if (!token) return;
    try {
      await productsApi.update(token, item.id, body);
      setEditingId(null);
      await load();
      success("Product updated");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function remove(id: string) {
    const token = getAccessToken();
    if (!token) return;
    if (!window.confirm("Delete this product?")) return;
    try {
      await productsApi.remove(token, id);
      await load();
      success("Product deleted");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  async function move(id: string, dir: -1 | 1) {
    const token = getAccessToken();
    if (!token) return;
    const idx = items.findIndex((p) => p.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= items.length) return;
    const next = [...items];
    const tmp = next[idx];
    next[idx] = next[swap];
    next[swap] = tmp;
    const payload = next.map((p, i) => ({ id: p.id, position: i }));
    try {
      setItems(await productsApi.reorder(token, payload));
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to reorder");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Products</h1>
        <p className="mt-1 text-sm text-meetup-muted">
          Showcase offers with an external checkout link (Mercado Pago, Stripe, Gumroad…).
        </p>
      </div>

      <form onSubmit={onCreate} className="space-y-3 mu-card p-5 md:p-6">
        <h2 className="font-display text-lg font-semibold">Add product</h2>
        <Field
          label="Title"
          value={draft.title}
          onChange={(v) => setDraft({ ...draft, title: v })}
          required
        />
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Description</span>
          <textarea
            className="w-full rounded-xl border border-meetup-border px-3 py-2"
            rows={2}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Price label"
            value={draft.price_label}
            onChange={(v) => setDraft({ ...draft, price_label: v })}
            placeholder="$9.99 / Free"
          />
          <Field
            label="Checkout URL"
            value={draft.checkout_url}
            onChange={(v) => setDraft({ ...draft, checkout_url: v })}
            required
            placeholder="https://…"
          />
        </div>
        <MediaUploadField
          label="Thumbnail"
          value={draft.thumbnail_url || null}
          onChange={(url) => setDraft({ ...draft, thumbnail_url: url || "" })}
          hint="Optional image for the product card."
        />
        <button type="submit" disabled={saving} className="mu-btn-primary disabled:opacity-60">
          {saving ? "Saving…" : "Add product"}
        </button>
      </form>

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-meetup-muted">No products yet.</p>
        )}
        {items.map((item, index) => (
          <div key={item.id} className="mu-card space-y-3 p-4">
            {editingId === item.id ? (
              <EditForm
                item={item}
                onCancel={() => setEditingId(null)}
                onSave={(body) => saveEdit(item, body)}
              />
            ) : (
              <>
                <div className="flex gap-3">
                  {item.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.thumbnail_url}
                      alt=""
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-meetup-bg text-xs text-meetup-muted">
                      No img
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-ink">{item.title}</p>
                      {item.price_label && (
                        <span className="rounded-full bg-meetup-bg px-2 py-0.5 text-xs font-medium">
                          {item.price_label}
                        </span>
                      )}
                      {!item.is_active && (
                        <span className="text-xs text-meetup-muted">Hidden</span>
                      )}
                    </div>
                    {item.description && (
                      <p className="mt-0.5 line-clamp-2 text-sm text-meetup-muted">{item.description}</p>
                    )}
                    <a
                      href={item.checkout_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block truncate text-xs text-meetup-pink hover:underline"
                    >
                      {item.checkout_url}
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="mu-btn-secondary text-xs" onClick={() => setEditingId(item.id)}>
                    Edit
                  </button>
                  <button type="button" className="mu-btn-secondary text-xs" onClick={() => toggleActive(item)}>
                    {item.is_active ? "Hide" : "Show"}
                  </button>
                  <button
                    type="button"
                    className="mu-btn-secondary text-xs"
                    disabled={index === 0}
                    onClick={() => move(item.id, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="mu-btn-secondary text-xs"
                    disabled={index === items.length - 1}
                    onClick={() => move(item.id, 1)}
                  >
                    ↓
                  </button>
                  <button type="button" className="mu-btn-secondary text-xs text-red-600" onClick={() => remove(item.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EditForm({
  item,
  onCancel,
  onSave,
}: {
  item: ProductItem;
  onCancel: () => void;
  onSave: (body: Record<string, unknown>) => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || "");
  const [price, setPrice] = useState(item.price_label || "");
  const [url, setUrl] = useState(item.checkout_url);
  const [thumb, setThumb] = useState(item.thumbnail_url || "");

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          title: title.trim(),
          description: description.trim() || null,
          clear_description: !description.trim(),
          price_label: price.trim() || null,
          clear_price_label: !price.trim(),
          checkout_url: url.trim(),
          thumbnail_url: thumb.trim() || null,
          clear_thumbnail: !thumb.trim(),
        });
      }}
    >
      <Field label="Title" value={title} onChange={setTitle} required />
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Description</span>
        <textarea
          className="w-full rounded-xl border border-meetup-border px-3 py-2"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Price label" value={price} onChange={setPrice} />
        <Field label="Checkout URL" value={url} onChange={setUrl} required />
      </div>
      <MediaUploadField
        label="Thumbnail"
        value={thumb || null}
        onChange={(u) => setThumb(u || "")}
      />
      <div className="flex gap-2">
        <button type="submit" className="mu-btn-primary">
          Save
        </button>
        <button type="button" className="mu-btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        className="w-full rounded-xl border border-meetup-border px-3 py-2"
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
