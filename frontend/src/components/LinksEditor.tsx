"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormEvent, useEffect, useRef, useState } from "react";
import { LinkAnimationPicker } from "@/components/LinkAnimationPicker";
import { LinkIconPicker } from "@/components/LinkIconPicker";
import { LinkVisual } from "@/components/LinkVisual";
import { MediaUploadField } from "@/components/MediaUploadField";
import { useToast } from "@/components/Toast";
import { linksApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { animationClass } from "@/lib/linkAnimations";
import { detectSocialBrand } from "@/lib/socialBrands";
import type { CollectionLayout, LinkItem, LinkType } from "@/lib/types";

const LINK_TYPES: { id: LinkType; label: string }[] = [
  { id: "url", label: "Link" },
  { id: "youtube", label: "YouTube" },
  { id: "spotify", label: "Spotify" },
  { id: "header", label: "Header" },
  { id: "contact", label: "Contact" },
];

type Draft = {
  title: string;
  url: string;
  link_type: LinkType;
  collection: string;
  collection_layout: CollectionLayout;
  thumbnail_url: string;
  icon: string | null;
  animation: string;
  is_featured: boolean;
  visible_from: string | null;
  visible_until: string | null;
};

const emptyDraft = (): Draft => ({
  title: "",
  url: "",
  link_type: "url",
  collection: "",
  collection_layout: "list",
  thumbnail_url: "",
  icon: null,
  animation: "none",
  is_featured: false,
  visible_from: null,
  visible_until: null,
});

function looksLikeUrl(value: string) {
  const v = value.trim();
  if (v.length < 4) return false;
  if (/\s/.test(v)) return false;
  return /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}([/:?#].*)?$/i.test(v) || v.includes(".");
}

export function LinksEditor() {
  const { success, error: toastError } = useToast();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [composerOpen, setComposerOpen] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const metaReq = useRef(0);
  const titleTouched = useRef(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  async function load() {
    const token = getAccessToken();
    if (!token) return;
    setLinks(await linksApi.list(token));
  }

  useEffect(() => {
    load();
  }, []);

  async function hydrateFromUrl(rawUrl: string) {
    const token = getAccessToken();
    if (!token || !looksLikeUrl(rawUrl)) return;

    const reqId = ++metaReq.current;
    setFetchingMeta(true);
    setComposerOpen(true);

    try {
      const meta = await linksApi.meta(token, rawUrl.trim());
      if (reqId !== metaReq.current) return;

      const brand = detectSocialBrand(meta.url);
      setDraft((prev) => ({
        ...prev,
        url: meta.url,
        title: titleTouched.current && prev.title.trim() ? prev.title : meta.title,
        // Prefer brand SVG for known socials; otherwise use favicon as thumbnail
        thumbnail_url: brand ? "" : meta.favicon_url || "",
        icon: prev.icon,
      }));
    } catch {
      if (reqId !== metaReq.current) return;
      const normalized = rawUrl.trim().startsWith("http") ? rawUrl.trim() : `https://${rawUrl.trim()}`;
      let fallbackTitle = rawUrl.trim();
      try {
        fallbackTitle = new URL(normalized).hostname.replace(/^www\./, "");
      } catch {
        /* ignore */
      }
      setDraft((prev) => ({
        ...prev,
        url: normalized,
        title: titleTouched.current && prev.title.trim() ? prev.title : fallbackTitle,
      }));
    } finally {
      if (reqId === metaReq.current) setFetchingMeta(false);
    }
  }

  function onUrlChange(value: string) {
    setDraft((prev) => ({ ...prev, url: value }));
    if (looksLikeUrl(value)) {
      setComposerOpen(true);
    }
  }

  function onUrlCommit() {
    if (looksLikeUrl(draft.url)) {
      void hydrateFromUrl(draft.url);
    }
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    if (draft.link_type !== "header" && !draft.url.trim()) {
      toastError(draft.link_type === "contact" ? "Add an email or phone" : "Paste a link first");
      return;
    }
    if (!draft.title.trim() && draft.link_type === "header") {
      toastError("Header needs a title");
      return;
    }
    try {
      const title =
        draft.title.trim() ||
        (draft.link_type === "header" ? "Section" : draft.url.trim() || "Link");
      await linksApi.create(token, {
        title,
        url: draft.url.trim() || null,
        link_type: draft.link_type,
        collection: draft.collection.trim() || null,
        collection_layout: draft.collection_layout,
        thumbnail_url: draft.thumbnail_url.trim() || null,
        icon: draft.icon,
        animation: draft.animation,
        is_featured: draft.link_type === "header" ? false : draft.is_featured,
        visible_from: draft.visible_from,
        visible_until: draft.visible_until,
      });
      setDraft(emptyDraft());
      setComposerOpen(false);
      titleTouched.current = false;
      await load();
      success("Link created");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to create link");
    }
  }

  function resetComposer() {
    setDraft(emptyDraft());
    setComposerOpen(false);
    titleTouched.current = false;
    metaReq.current += 1;
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    const next = arrayMove(links, oldIndex, newIndex);
    setLinks(next);
    const token = getAccessToken();
    if (!token) return;
    try {
      await linksApi.reorder(
        token,
        next.map((l, i) => ({ id: l.id, position: i })),
      );
      success("Order updated");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to reorder links");
      await load();
    }
  }

  async function toggle(link: LinkItem, field: "is_active" | "is_featured") {
    const token = getAccessToken();
    if (!token) return;
    try {
      await linksApi.update(token, link.id, { [field]: !link[field] });
      await load();
      success(field === "is_featured" ? "Featured updated" : "Link status updated");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update link");
    }
  }

  async function remove(id: string) {
    const token = getAccessToken();
    if (!token) return;
    if (!confirm("Delete this link?")) return;
    try {
      await linksApi.remove(token, id);
      if (expandedId === id) setExpandedId(null);
      await load();
      success("Link deleted");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to delete link");
    }
  }

  async function saveInline(
    link: LinkItem,
    patch: Partial<LinkItem> & {
      clear_thumbnail?: boolean;
      clear_icon?: boolean;
      clear_collection?: boolean;
    },
  ) {
    const token = getAccessToken();
    if (!token) return;
    const body: Record<string, unknown> = { ...patch };
    if (patch.thumbnail_url === null || patch.thumbnail_url === "") body.clear_thumbnail = true;
    if (patch.icon === null || patch.icon === "") body.clear_icon = true;
    if (patch.clear_collection || patch.collection === null || patch.collection === "") {
      body.clear_collection = true;
      delete body.collection;
    }
    try {
      await linksApi.update(token, link.id, body);
      await load();
      success("Link updated");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update link");
    }
  }

  async function setLock(link: LinkItem, code: string | null) {
    const token = getAccessToken();
    if (!token) return;
    try {
      if (code === null) {
        await linksApi.update(token, link.id, { clear_lock_code: true });
        success("Link lock removed");
      } else {
        await linksApi.update(token, link.id, { lock_code: code });
        success("Link lock added");
      }
      await load();
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update lock");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Links</h1>
        <p className="mt-1 text-sm text-meetup-muted">
          Links, embeds, headers, and collections — paste a URL or pick a type.
        </p>
      </div>

      <form onSubmit={onCreate} className="mu-card space-y-4 p-4 md:p-5">
        <div className="flex flex-wrap gap-2">
          {LINK_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setDraft((prev) => ({ ...prev, link_type: t.id }));
                setComposerOpen(true);
              }}
              className={`mu-chip ${draft.link_type === t.id ? "mu-chip-active" : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <input
              value={draft.url}
              onChange={(e) => onUrlChange(e.target.value)}
              onBlur={onUrlCommit}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("text");
                if (looksLikeUrl(pasted)) {
                  window.setTimeout(() => void hydrateFromUrl(pasted), 0);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !composerOpen) {
                  e.preventDefault();
                  onUrlCommit();
                }
              }}
              placeholder={
                draft.link_type === "header"
                  ? "Optional — headers only need a title"
                  : draft.link_type === "contact"
                    ? "Email or phone"
                    : draft.link_type === "youtube"
                      ? "YouTube URL or video id"
                      : draft.link_type === "spotify"
                        ? "Spotify track / playlist URL"
                        : "Paste or type a link (https://…)"
              }
              autoComplete="url"
              className="mu-input w-full pr-24"
            />
            {fetchingMeta && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-meetup-purple">
                Fetching…
              </span>
            )}
          </div>
          {!composerOpen && (
            <button
              type="button"
              onClick={() => {
                if (draft.link_type === "header") setComposerOpen(true);
                else onUrlCommit();
              }}
              disabled={draft.link_type !== "header" && !looksLikeUrl(draft.url) && draft.link_type !== "contact"}
              className="mu-btn-primary shrink-0 disabled:opacity-50"
            >
              Continue
            </button>
          )}
        </div>

        {composerOpen && (
          <div className="space-y-4 rounded-meetup border border-meetup-border bg-meetup-bg/60 p-4">
            <div className="flex items-start gap-3">
              <LinkVisual
                url={draft.url}
                icon={draft.icon}
                thumbnailUrl={draft.thumbnail_url || null}
                featured={draft.is_featured}
                size="md"
              />
              <div className="min-w-0 flex-1 space-y-3">
                <label className="block text-sm">
                  <span className="mb-1 block font-semibold text-ink">Title</span>
                  <input
                    value={draft.title}
                    onChange={(e) => {
                      titleTouched.current = true;
                      setDraft({ ...draft, title: e.target.value });
                    }}
                    placeholder="Link title"
                    required
                    className="mu-input"
                  />
                </label>
                <p className="truncate text-xs text-meetup-muted">{draft.url || "—"}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-ink">Collection</span>
                <input
                  className="mu-input"
                  value={draft.collection}
                  onChange={(e) => setDraft({ ...draft, collection: e.target.value })}
                  placeholder="e.g. Music, Shop"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-ink">Collection layout</span>
                <select
                  className="mu-input"
                  value={draft.collection_layout}
                  onChange={(e) =>
                    setDraft({ ...draft, collection_layout: e.target.value as CollectionLayout })
                  }
                >
                  <option value="list">List</option>
                  <option value="grid">Grid</option>
                </select>
              </label>
            </div>

            {draft.link_type !== "header" && (
              <label className="inline-flex items-center gap-2 text-sm text-meetup-muted">
                <input
                  type="checkbox"
                  checked={draft.is_featured}
                  onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })}
                />
                Featured link
              </label>
            )}

            <LinkIconPicker value={draft.icon} onChange={(icon) => setDraft({ ...draft, icon })} />

            <ImageUrlField
              value={draft.thumbnail_url}
              onChange={(thumbnail_url) => setDraft({ ...draft, thumbnail_url })}
              hint="Favicon is filled automatically. You can replace it with any image URL."
            />

            <LinkAnimationPicker
              value={draft.animation}
              onChange={(animation) => setDraft({ ...draft, animation })}
            />

            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-meetup-muted">
                Visible from
                <input
                  type="datetime-local"
                  className="mu-input mt-1"
                  value={toLocalInput(draft.visible_from)}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      visible_from: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                />
              </label>
              <label className="text-xs text-meetup-muted">
                Visible until
                <input
                  type="datetime-local"
                  className="mu-input mt-1"
                  value={toLocalInput(draft.visible_until)}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      visible_until: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                />
              </label>
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-1">
              <button type="button" onClick={resetComposer} className="mu-btn-ghost">
                Cancel
              </button>
              <button type="submit" className="mu-btn-primary" disabled={fetchingMeta}>
                Add link
              </button>
            </div>
          </div>
        )}
      </form>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3">
            {links.length === 0 && (
              <li className="rounded-2xl border border-dashed border-meetup-border p-8 text-center text-sm text-meetup-muted">
                No links yet. Paste a URL above to get started.
              </li>
            )}
            {links.map((link) => (
              <SortableLink
                key={link.id}
                link={link}
                expanded={expandedId === link.id}
                onToggleExpand={() =>
                  setExpandedId((id) => (id === link.id ? null : link.id))
                }
                onToggle={toggle}
                onRemove={remove}
                onSave={saveInline}
                onSetLock={setLock}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function ImageUrlField({
  value,
  onChange,
  hint,
}: {
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <MediaUploadField
      label="Image / favicon"
      value={value || null}
      onChange={(url) => onChange(url || "")}
      hint={hint || "Upload or paste a URL. Thumbnail overrides the icon on the public page."}
    />
  );
}

function toLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function SortableLink({
  link,
  expanded,
  onToggleExpand,
  onToggle,
  onRemove,
  onSave,
  onSetLock,
}: {
  link: LinkItem;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggle: (link: LinkItem, field: "is_active" | "is_featured") => void;
  onRemove: (id: string) => void;
  onSave: (
    link: LinkItem,
    patch: Partial<LinkItem> & {
      clear_thumbnail?: boolean;
      clear_icon?: boolean;
      clear_collection?: boolean;
    },
  ) => Promise<void>;
  onSetLock: (link: LinkItem, code: string | null) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [linkType, setLinkType] = useState<LinkType>(link.link_type || "url");
  const [collection, setCollection] = useState(link.collection || "");
  const [collectionLayout, setCollectionLayout] = useState<CollectionLayout>(
    link.collection_layout || "list",
  );
  const [icon, setIcon] = useState<string | null>(link.icon);
  const [thumbnail, setThumbnail] = useState(link.thumbnail_url || "");
  const [animation, setAnimation] = useState(link.animation || "none");
  const [featured, setFeatured] = useState(link.is_featured);
  const [visibleFrom, setVisibleFrom] = useState(link.visible_from);
  const [visibleUntil, setVisibleUntil] = useState(link.visible_until);

  useEffect(() => {
    if (!expanded) return;
    setTitle(link.title);
    setUrl(link.url);
    setLinkType(link.link_type || "url");
    setCollection(link.collection || "");
    setCollectionLayout(link.collection_layout || "list");
    setIcon(link.icon);
    setThumbnail(link.thumbnail_url || "");
    setAnimation(link.animation || "none");
    setFeatured(link.is_featured);
    setVisibleFrom(link.visible_from);
    setVisibleUntil(link.visible_until);
  }, [expanded, link]);

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border bg-white p-4 shadow-meetup ${
        link.is_featured ? "border-meetup-purple/40 ring-1 ring-meetup-purple/20" : "border-meetup-border"
      } ${link.is_active ? "" : "opacity-60"}`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="mt-2 cursor-grab touch-none text-ink/30 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag"
        >
          ⠿
        </button>
        <button type="button" onClick={onToggleExpand} className={animationClass(link.animation)}>
          <LinkVisual
            url={link.url}
            icon={link.icon}
            thumbnailUrl={link.thumbnail_url}
            featured={link.is_featured}
            size="md"
          />
        </button>
        <div className="min-w-0 flex-1">
          <button type="button" onClick={onToggleExpand} className="w-full text-left">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-semibold text-ink">{link.title}</p>
              <span className="rounded-full bg-mist px-2 py-0.5 text-[10px] font-bold uppercase text-meetup-muted">
                {link.link_type || "url"}
              </span>
              {link.collection && (
                <span className="rounded-full bg-meetup-lavender px-2 py-0.5 text-[10px] font-bold uppercase text-meetup-purple">
                  {link.collection}
                </span>
              )}
              {link.is_featured && (
                <span className="rounded-full bg-meetup-lavender px-2 py-0.5 text-[10px] font-bold uppercase text-meetup-purple">
                  Featured
                </span>
              )}
              {link.animation && link.animation !== "none" && (
                <span className="rounded-full bg-mist px-2 py-0.5 text-[10px] font-bold uppercase text-meetup-muted">
                  {link.animation}
                </span>
              )}
              {link.has_lock && (
                <span className="rounded-full bg-warn/15 px-2 py-0.5 text-[10px] font-bold uppercase text-warn">
                  Locked
                </span>
              )}
            </div>
            <p className="truncate text-xs text-meetup-muted">
              {link.link_type === "header" ? "Section header" : link.url}
            </p>
          </button>

          {!expanded && (
            <div className="mt-3 flex flex-wrap gap-2">
              <MiniBtn onClick={onToggleExpand}>Customize</MiniBtn>
              <MiniBtn onClick={() => onToggle(link, "is_active")}>
                {link.is_active ? "Disable" : "Enable"}
              </MiniBtn>
              <MiniBtn onClick={() => onToggle(link, "is_featured")}>
                {link.is_featured ? "Unfeature" : "Feature"}
              </MiniBtn>
              <MiniBtn
                onClick={() => {
                  if (link.has_lock) onSetLock(link, null);
                  else {
                    const code = prompt("Lock code for this link:");
                    if (code) onSetLock(link, code);
                  }
                }}
              >
                {link.has_lock ? "Remove lock" : "Add lock"}
              </MiniBtn>
              <MiniBtn onClick={() => onRemove(link.id)} danger>
                Delete
              </MiniBtn>
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-meetup-border pt-4">
          <label className="block text-sm">
            <span className="mb-1 block font-semibold">Type</span>
            <select
              className="mu-input"
              value={linkType}
              onChange={(e) => setLinkType(e.target.value as LinkType)}
            >
              {LINK_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-semibold">Title</span>
            <input className="mu-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          {linkType !== "header" && (
            <label className="block text-sm">
              <span className="mb-1 block font-semibold">
                {linkType === "contact" ? "Email / phone" : "URL"}
              </span>
              <input className="mu-input" value={url} onChange={(e) => setUrl(e.target.value)} />
            </label>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-semibold">Collection</span>
              <input
                className="mu-input"
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                placeholder="Optional group"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-semibold">Layout</span>
              <select
                className="mu-input"
                value={collectionLayout}
                onChange={(e) => setCollectionLayout(e.target.value as CollectionLayout)}
              >
                <option value="list">List</option>
                <option value="grid">Grid</option>
              </select>
            </label>
          </div>

          {linkType !== "header" && (
            <label className="inline-flex items-center gap-2 text-sm text-meetup-muted">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              Featured link
            </label>
          )}

          <LinkIconPicker value={icon} onChange={setIcon} />
          <ImageUrlField value={thumbnail} onChange={setThumbnail} />
          <LinkAnimationPicker value={animation} onChange={setAnimation} />

          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-meetup-muted">
              Visible from
              <input
                type="datetime-local"
                className="mu-input mt-1"
                value={toLocalInput(visibleFrom)}
                onChange={(e) =>
                  setVisibleFrom(e.target.value ? new Date(e.target.value).toISOString() : null)
                }
              />
            </label>
            <label className="text-xs text-meetup-muted">
              Visible until
              <input
                type="datetime-local"
                className="mu-input mt-1"
                value={toLocalInput(visibleUntil)}
                onChange={(e) =>
                  setVisibleUntil(e.target.value ? new Date(e.target.value).toISOString() : null)
                }
              />
            </label>
          </div>

          <div className="flex flex-wrap justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <MiniBtn onClick={() => onToggle(link, "is_active")}>
                {link.is_active ? "Disable" : "Enable"}
              </MiniBtn>
              {linkType !== "header" && (
                <MiniBtn
                  onClick={() => {
                    if (link.has_lock) onSetLock(link, null);
                    else {
                      const code = prompt("Lock code for this link:");
                      if (code) onSetLock(link, code);
                    }
                  }}
                >
                  {link.has_lock ? "Remove lock" : "Add lock"}
                </MiniBtn>
              )}
              <MiniBtn onClick={() => onRemove(link.id)} danger>
                Delete
              </MiniBtn>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={onToggleExpand} className="mu-btn-ghost">
                Close
              </button>
              <button
                type="button"
                className="mu-btn-primary"
                onClick={() =>
                  onSave(link, {
                    title,
                    url,
                    link_type: linkType,
                    collection: collection.trim() || null,
                    collection_layout: collectionLayout,
                    clear_collection: !collection.trim(),
                    icon,
                    thumbnail_url: thumbnail || null,
                    animation,
                    is_featured: linkType === "header" ? false : featured,
                    visible_from: visibleFrom,
                    visible_until: visibleUntil,
                  } as Partial<LinkItem> & { clear_thumbnail?: boolean; clear_icon?: boolean; clear_collection?: boolean })
                }
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
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
      className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
        danger
          ? "bg-red-50 text-red-600"
          : "bg-mist text-meetup-muted hover:bg-meetup-lavender hover:text-meetup-purple"
      }`}
    >
      {children}
    </button>
  );
}
