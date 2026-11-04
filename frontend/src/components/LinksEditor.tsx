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
import { FormEvent, useEffect, useState } from "react";
import { LinkAnimationPicker } from "@/components/LinkAnimationPicker";
import { LinkIconPicker } from "@/components/LinkIconPicker";
import { LinkVisual } from "@/components/LinkVisual";
import { useToast } from "@/components/Toast";
import { linksApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { animationClass } from "@/lib/linkAnimations";
import type { LinkItem } from "@/lib/types";

type Draft = {
  title: string;
  url: string;
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
  thumbnail_url: "",
  icon: null,
  animation: "none",
  is_featured: false,
  visible_from: null,
  visible_until: null,
});

export function LinksEditor() {
  const { success, error: toastError } = useToast();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [showExtras, setShowExtras] = useState(false);
  const [editing, setEditing] = useState<LinkItem | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  async function load() {
    const token = getAccessToken();
    if (!token) return;
    setLinks(await linksApi.list(token));
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    try {
      const normalized = draft.url.startsWith("http") ? draft.url : `https://${draft.url}`;
      await linksApi.create(token, {
        title: draft.title,
        url: normalized,
        thumbnail_url: draft.thumbnail_url.trim() || null,
        icon: draft.icon,
        animation: draft.animation,
        is_featured: draft.is_featured,
      });
      setDraft(emptyDraft());
      setShowExtras(false);
      await load();
      success("Link created");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to create link");
    }
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
      await load();
      success("Link deleted");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to delete link");
    }
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const token = getAccessToken();
    if (!token) return;
    const body: Record<string, unknown> = {
      title: editing.title,
      url: editing.url,
      thumbnail_url: editing.thumbnail_url || null,
      icon: editing.icon,
      animation: editing.animation || "none",
      is_featured: editing.is_featured,
      visible_from: editing.visible_from || null,
      visible_until: editing.visible_until || null,
    };
    if (!editing.thumbnail_url) body.clear_thumbnail = true;
    if (!editing.icon) body.clear_icon = true;
    try {
      await linksApi.update(token, editing.id, body);
      setEditing(null);
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
        <h1 className="font-display text-3xl font-bold text-ink">Links</h1>
        <p className="mt-1 text-sm text-ink/55">
          Icons, images, featured style, and animations. Drag to reorder.
        </p>
      </div>

      <form onSubmit={onCreate} className="space-y-3 rounded-2xl border border-ink/10 bg-white/70 p-4 backdrop-blur">
        <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Title"
            required
            className="rounded-xl border border-ink/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
          <input
            value={draft.url}
            onChange={(e) => setDraft({ ...draft, url: e.target.value })}
            placeholder="https://…"
            required
            className="rounded-xl border border-ink/10 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="submit"
            className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink/90"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={draft.is_featured}
              onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })}
            />
            Featured
          </label>
          <button
            type="button"
            onClick={() => setShowExtras((v) => !v)}
            className="text-sm font-medium text-accent hover:underline"
          >
            {showExtras ? "Hide extras" : "Add icon, image & animation"}
          </button>
        </div>

        {showExtras && (
          <div className="space-y-4 rounded-xl border border-ink/10 bg-white/80 p-3">
            <LinkIconPicker value={draft.icon} onChange={(icon) => setDraft({ ...draft, icon })} />
            <ImageUrlField
              value={draft.thumbnail_url}
              onChange={(thumbnail_url) => setDraft({ ...draft, thumbnail_url })}
            />
            <LinkAnimationPicker
              value={draft.animation}
              onChange={(animation) => setDraft({ ...draft, animation })}
            />
          </div>
        )}
      </form>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3">
            {links.length === 0 && (
              <li className="rounded-2xl border border-dashed border-ink/15 p-8 text-center text-sm text-ink/45">
                No links yet. Add your first one above.
              </li>
            )}
            {links.map((link) => (
              <SortableLink
                key={link.id}
                link={link}
                onToggle={toggle}
                onRemove={remove}
                onEdit={() => setEditing(link)}
                onSetLock={setLock}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <form
            onSubmit={saveEdit}
            className="max-h-[90vh] w-full max-w-lg space-y-3 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <h3 className="font-display text-xl font-semibold">Edit link</h3>
            <input
              className="w-full rounded-xl border border-ink/10 px-3 py-2 text-sm"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
            <input
              className="w-full rounded-xl border border-ink/10 px-3 py-2 text-sm"
              value={editing.url}
              onChange={(e) => setEditing({ ...editing, url: e.target.value })}
            />

            <label className="inline-flex items-center gap-2 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={editing.is_featured}
                onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
              />
              Featured link
            </label>

            <LinkIconPicker
              value={editing.icon}
              onChange={(icon) => setEditing({ ...editing, icon })}
            />

            <ImageUrlField
              value={editing.thumbnail_url || ""}
              onChange={(thumbnail_url) =>
                setEditing({ ...editing, thumbnail_url: thumbnail_url || null })
              }
            />

            <LinkAnimationPicker
              value={editing.animation || "none"}
              onChange={(animation) => setEditing({ ...editing, animation })}
            />

            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-ink/60">
                Visible from
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-xl border border-ink/10 px-2 py-2 text-sm"
                  value={toLocalInput(editing.visible_from)}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      visible_from: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                />
              </label>
              <label className="text-xs text-ink/60">
                Visible until
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-xl border border-ink/10 px-2 py-2 text-sm"
                  value={toLocalInput(editing.visible_until)}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      visible_until: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-xl px-4 py-2 text-sm">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function ImageUrlField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-ink/70">Image URL</span>
      <div className="flex items-start gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-14 w-14 rounded-xl object-cover ring-1 ring-ink/10" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-ink/15 text-[10px] text-ink/35">
            Preview
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-1">
          <input
            className="w-full rounded-xl border border-ink/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            placeholder="https://…/image.jpg"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <p className="text-[11px] text-ink/40">
            Paste a direct image URL. Thumbnail overrides the icon on the public page.
          </p>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[11px] font-medium text-ink/45 hover:text-ink"
            >
              Remove image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function SortableLink({
  link,
  onToggle,
  onRemove,
  onEdit,
  onSetLock,
}: {
  link: LinkItem;
  onToggle: (link: LinkItem, field: "is_active" | "is_featured") => void;
  onRemove: (id: string) => void;
  onEdit: () => void;
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

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border bg-white/80 p-4 backdrop-blur ${
        link.is_featured ? "border-accent/30 ring-1 ring-accent/20" : "border-ink/10"
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
        <div className={animationClass(link.animation)}>
          <LinkVisual
            icon={link.icon}
            thumbnailUrl={link.thumbnail_url}
            featured={link.is_featured}
            size="md"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {!link.thumbnail_url && !link.icon && (
              <span className="text-base" aria-hidden>
                🔗
              </span>
            )}
            <p className="truncate font-semibold text-ink">{link.title}</p>
            {link.is_featured && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                Featured
              </span>
            )}
            {link.animation && link.animation !== "none" && (
              <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-bold uppercase text-ink/50">
                {link.animation}
              </span>
            )}
            {link.has_lock && (
              <span className="rounded-full bg-warn/15 px-2 py-0.5 text-[10px] font-bold uppercase text-warn">
                Locked
              </span>
            )}
          </div>
          <p className="truncate text-xs text-ink/45">{link.url}</p>
          {(link.visible_from || link.visible_until) && (
            <p className="mt-1 text-[11px] text-ink/40">
              Schedule: {link.visible_from ? new Date(link.visible_from).toLocaleString() : "…"} →{" "}
              {link.visible_until ? new Date(link.visible_until).toLocaleString() : "…"}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <MiniBtn onClick={() => onToggle(link, "is_active")}>
              {link.is_active ? "Disable" : "Enable"}
            </MiniBtn>
            <MiniBtn onClick={() => onToggle(link, "is_featured")}>
              {link.is_featured ? "Unfeature" : "Feature"}
            </MiniBtn>
            <MiniBtn onClick={onEdit}>Edit</MiniBtn>
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
        </div>
      </div>
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
        danger ? "bg-red-50 text-red-600" : "bg-ink/5 text-ink/70 hover:bg-ink/10"
      }`}
    >
      {children}
    </button>
  );
}
