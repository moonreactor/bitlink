"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type CollisionDetection,
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
import { linksApi, sectionsApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { animationClass } from "@/lib/linkAnimations";
import { QUICK_ADD, isPrefixOnly, type QuickAddTemplate } from "@/lib/quickAdd";
import { SocialBrandIcon, detectSocialBrand } from "@/lib/socialBrands";
import { DisplayToggle, IconLinks } from "@/components/dashboard/IconLinks";
import { buildEditorBlocks, toLayoutPayload, type EditorBlock } from "@/lib/linkBlocks";
import type { LinkDisplay, LinkItem, LinkSection, LinkType, SectionLayout } from "@/lib/types";

const LINK_TYPES: { id: LinkType; label: string }[] = [
  { id: "url", label: "Link" },
  { id: "youtube", label: "YouTube" },
  { id: "spotify", label: "Spotify" },
  { id: "contact", label: "Contact" },
];

type Draft = {
  display: LinkDisplay;
  title: string;
  url: string;
  link_type: LinkType;
  section_id: string | null;
  thumbnail_url: string;
  icon: string | null;
  animation: string;
  is_featured: boolean;
  visible_from: string | null;
  visible_until: string | null;
};

const emptyDraft = (display: LinkDisplay = "button"): Draft => ({
  display,
  title: "",
  url: "",
  link_type: "url",
  section_id: null,
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
  const [sections, setSections] = useState<LinkSection[]>([]);
  const [sectionComposer, setSectionComposer] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionLayout, setSectionLayout] = useState<SectionLayout>("list");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [composerOpen, setComposerOpen] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [moreOptions, setMoreOptions] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const metaReq = useRef(0);
  const titleTouched = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const buttons = links.filter((l) => l.display !== "icon");
  const icons = links
    .filter((l) => l.display === "icon")
    .sort((a, b) => a.position - b.position);
  const blocks = buildEditorBlocks(buttons, sections);

  async function load() {
    const token = getAccessToken();
    if (!token) return;
    const [l, s] = await Promise.all([linksApi.list(token), sectionsApi.list(token)]);
    setLinks(l);
    setSections(s);
    setLoaded(true);
  }

  function focusComposer(caretAtEnd = false) {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    requestAnimationFrame(() => {
      const el = urlInputRef.current;
      if (!el) return;
      el.focus({ preventScroll: true });
      if (caretAtEnd) el.setSelectionRange(el.value.length, el.value.length);
    });
  }

  function applyTemplate(t: QuickAddTemplate) {
    titleTouched.current = true;
    metaReq.current += 1;
    setFetchingMeta(false);
    setDraft({ ...emptyDraft(draft.display), link_type: "url", url: t.prefix, title: t.label });
    setComposerOpen(true);
    focusComposer(true);
  }

  useEffect(() => {
    load();
    // Deep link from the bottom-bar "+" / onboarding checklist.
    const params = new URLSearchParams(window.location.search);
    if (params.get("add")) {
      window.history.replaceState(null, "", window.location.pathname);
      focusComposer();
    }
    const onAdd = () => focusComposer();
    window.addEventListener("bitlink:add-link", onAdd);
    return () => window.removeEventListener("bitlink:add-link", onAdd);
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
    if (looksLikeUrl(draft.url) && !isPrefixOnly(draft.url)) {
      void hydrateFromUrl(draft.url);
    }
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    if (draft.link_type === "url" && isPrefixOnly(draft.url)) {
      toastError("Finish the link — add your username after the /");
      focusComposer(true);
      return;
    }
    if (!draft.url.trim()) {
      toastError(draft.link_type === "contact" ? "Add an email or phone" : "Paste a link first");
      return;
    }
    try {
      // Don't block the tap on a pending metadata fetch (blur fires it right before submit).
      metaReq.current += 1;
      setFetchingMeta(false);
      const title = draft.title.trim() || draft.url.trim() || "Link";
      await linksApi.create(token, {
        title,
        url: draft.url.trim() || null,
        link_type: draft.link_type,
        display: draft.display,
        section_id: draft.section_id,
        thumbnail_url: draft.thumbnail_url.trim() || null,
        icon: draft.icon,
        animation: draft.animation,
        is_featured: draft.is_featured,
        visible_from: draft.visible_from,
        visible_until: draft.visible_until,
      });
      const wasFirst = draft.display === "button" && buttons.filter((l) => l.link_type !== "header").length === 0;
      const wasIcon = draft.display === "icon";
      setDraft(emptyDraft(draft.display));
      setComposerOpen(false);
      setMoreOptions(false);
      titleTouched.current = false;
      await load();
      success(wasFirst ? "Your first link is live 🎉 Now share your page" : wasIcon ? "Icon added" : "Link added");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to create link");
    }
  }

  function resetComposer() {
    setDraft(emptyDraft());
    setComposerOpen(false);
    setMoreOptions(false);
    titleTouched.current = false;
    metaReq.current += 1;
    setFetchingMeta(false);
  }

  /** Items can only be dropped next to items of the same container (the page, or one section). */
  const collisionDetection: CollisionDetection = (args) => {
    const from = args.active.data.current?.container;
    return closestCenter({
      ...args,
      droppableContainers: args.droppableContainers.filter(
        (c) => c.data.current?.container === from,
      ),
    });
  };

  /** Apply a new page layout locally, then persist it; reload if the server disagrees. */
  async function commitBlocks(next: EditorBlock[]) {
    const nextSections: LinkSection[] = [];
    const nextLinks: LinkItem[] = [];
    next.forEach((b, i) => {
      if (b.kind === "link") {
        nextLinks.push({ ...b.link, section_id: null, position: i });
        return;
      }
      nextSections.push({ ...b.section, position: i });
      b.links.forEach((l, j) => nextLinks.push({ ...l, section_id: b.section.id, position: j }));
    });
    setSections(nextSections);
    setLinks([...nextLinks, ...links.filter((l) => l.display === "icon")]);
    const token = getAccessToken();
    if (!token) return;
    try {
      await sectionsApi.saveLayout(token, toLayoutPayload(next));
      success("Order updated");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to reorder");
      await load();
    }
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const container = active.data.current?.container as string | undefined;
    if (container !== over.data.current?.container) return;

    if (container === "root") {
      const ids = blocks.map((b) => (b.kind === "link" ? b.link.id : `section:${b.section.id}`));
      const from = ids.indexOf(String(active.id));
      const to = ids.indexOf(String(over.id));
      if (from < 0 || to < 0) return;
      await commitBlocks(arrayMove(blocks, from, to));
      return;
    }

    const next = blocks.map((b) => {
      if (b.kind !== "section" || b.section.id !== container) return b;
      const from = b.links.findIndex((l) => l.id === active.id);
      const to = b.links.findIndex((l) => l.id === over.id);
      return from < 0 || to < 0 ? b : { ...b, links: arrayMove(b.links, from, to) };
    });
    await commitBlocks(next);
  }

  /** Move a top-level block one step (accessible alternative to dragging). */
  async function moveBlock(index: number, delta: -1 | 1) {
    const to = index + delta;
    if (to < 0 || to >= blocks.length) return;
    await commitBlocks(arrayMove(blocks, index, to));
  }

  async function createSection(e: FormEvent) {
    e.preventDefault();
    const token = getAccessToken();
    const title = sectionTitle.trim();
    if (!token || !title) return;
    try {
      await sectionsApi.create(token, { title, layout: sectionLayout });
      setSectionTitle("");
      setSectionLayout("list");
      setSectionComposer(false);
      await load();
      success("Section added");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to add section");
    }
  }

  async function updateSection(id: string, patch: { title?: string; layout?: SectionLayout }) {
    const token = getAccessToken();
    if (!token) return;
    try {
      await sectionsApi.update(token, id, patch);
      await load();
      success("Section updated");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update section");
      await load();
    }
  }

  async function removeSection(section: LinkSection, count: number) {
    const token = getAccessToken();
    if (!token) return;
    const msg = count
      ? `Delete the section “${section.title}”? Its ${count} link${count === 1 ? "" : "s"} will stay on your page.`
      : `Delete the section “${section.title}”?`;
    if (!confirm(msg)) return;
    try {
      await sectionsApi.remove(token, section.id);
      await load();
      success("Section deleted");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to delete section");
    }
  }

  function addLinkToSection(sectionId: string) {
    setDraft({ ...emptyDraft(), section_id: sectionId });
    setComposerOpen(true);
    focusComposer();
  }

  async function moveIcon(index: number, delta: -1 | 1) {
    const to = index + delta;
    if (to < 0 || to >= icons.length) return;
    const next = arrayMove(icons, index, to).map((l, i) => ({ ...l, position: i }));
    setLinks([...buttons, ...next]);
    const token = getAccessToken();
    if (!token) return;
    try {
      await linksApi.reorder(token, next.map((l) => ({ id: l.id, position: l.position })));
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to reorder");
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
    },
  ) {
    const token = getAccessToken();
    if (!token) return;
    const body: Record<string, unknown> = { ...patch };
    if (patch.thumbnail_url === null || patch.thumbnail_url === "") body.clear_thumbnail = true;
    if (patch.icon === null || patch.icon === "") body.clear_icon = true;
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
    <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Links</h1>
        <p className="mt-1 text-sm text-meetup-muted">
          What people can tap on your page. Group links into sections and drag to reorder.
        </p>
      </div>

      <form ref={formRef} onSubmit={onCreate} className="mu-card scroll-mt-20 space-y-4 p-4 md:p-5">
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-meetup-muted">Quick add</p>
            <DisplayToggle
              value={draft.display}
              onChange={(display) =>
                setDraft((prev) => ({
                  ...prev,
                  display,
                  ...(display === "icon" ? { section_id: null, link_type: "url" as LinkType, is_featured: false } : {}),
                }))
              }
            />
          </div>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
            {QUICK_ADD.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTemplate(t)}
                className="mu-chip min-h-[40px] shrink-0"
              >
                {t.brand && <SocialBrandIcon brandId={t.brand} className="text-base" />}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <input
              ref={urlInputRef}
              aria-label="Link URL"
              inputMode={draft.link_type === "contact" ? "email" : "url"}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
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
                draft.link_type === "contact"
                  ? "Email or phone"
                  : draft.link_type === "youtube"
                    ? "YouTube URL or video id"
                    : draft.link_type === "spotify"
                      ? "Spotify track / playlist URL"
                      : "Paste or type a link (https://…)"
              }
              autoComplete="url"
              className="mu-input min-h-[48px] w-full pr-24"
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
              onClick={onUrlCommit}
              disabled={!looksLikeUrl(draft.url) && draft.link_type !== "contact"}
              className="mu-btn-primary min-h-[48px] shrink-0 disabled:opacity-50"
            >
              Continue
            </button>
          )}
        </div>

        {composerOpen && (
          <div className="space-y-4 rounded-meetup border border-meetup-border bg-meetup-bg/60 p-4">
            {sections.length > 0 && draft.display === "button" && (
              <label className="block text-sm">
                <span className="mb-1 block font-semibold text-ink">Section</span>
                <select
                  className="mu-input"
                  value={draft.section_id ?? ""}
                  onChange={(e) => setDraft({ ...draft, section_id: e.target.value || null })}
                >
                  <option value="">No section (loose link)</option>
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.title}
                    </option>
                  ))}
                </select>
              </label>
            )}
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

            {draft.display === "button" && (
            <button
              type="button"
              onClick={() => setMoreOptions((v) => !v)}
              aria-expanded={moreOptions}
              className="inline-flex min-h-[44px] items-center gap-1 rounded-xl px-1 text-sm font-semibold text-meetup-purple"
            >
              <span>{moreOptions ? "Fewer options" : "More options"}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
                className={`transition ${moreOptions ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            )}

            {moreOptions && draft.display === "button" && (
              <div className="space-y-4 border-t border-meetup-border pt-4">
                <div>
                  <p className="mb-2 text-sm font-semibold text-ink">Type</p>
                  <div className="flex flex-wrap gap-2">
                    {LINK_TYPES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setDraft((prev) => ({ ...prev, link_type: t.id }))}
                        className={`mu-chip ${draft.link_type === t.id ? "mu-chip-active" : ""}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-meetup-muted">
                  <input
                    type="checkbox"
                    checked={draft.is_featured}
                    onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })}
                  />
                  Featured link
                </label>

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
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1 sm:flex sm:justify-end">
              <button type="button" onClick={resetComposer} className="mu-btn-ghost min-h-[48px]">
                Cancel
              </button>
              <button type="submit" className="mu-btn-primary min-h-[48px]">
                {draft.display === "icon" ? "Add icon" : "Add link"}
              </button>
            </div>
          </div>
        )}
      </form>

      <IconLinks
        icons={icons}
        onSave={(link, patch) => saveInline(link, patch)}
        onToggleActive={(link) => toggle(link, "is_active")}
        onMove={moveIcon}
        onRemove={remove}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-ink">Your page</h2>
        {!sectionComposer && (
          <button type="button" onClick={() => setSectionComposer(true)} className="mu-btn-ghost">
            + Add section
          </button>
        )}
      </div>

      {sectionComposer && (
        <form onSubmit={createSection} className="mu-card space-y-3 p-4">
          <p className="text-sm text-meetup-muted">
            A section is a title for the links that follow, shown as a list or a grid.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              autoFocus
              className="mu-input min-h-[44px] flex-1"
              value={sectionTitle}
              maxLength={80}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="e.g. Music, Shop, Social"
              aria-label="Section title"
            />
            <LayoutToggle value={sectionLayout} onChange={setSectionLayout} />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="mu-btn-ghost"
              onClick={() => {
                setSectionComposer(false);
                setSectionTitle("");
              }}
            >
              Cancel
            </button>
            <button type="submit" className="mu-btn-primary" disabled={!sectionTitle.trim()}>
              Add section
            </button>
          </div>
        </form>
      )}

      <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragEnd={onDragEnd}>
        <SortableContext
          items={blocks.map((b) => (b.kind === "link" ? b.link.id : `section:${b.section.id}`))}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-3">
            {loaded && blocks.length === 0 && (
              <li className="rounded-2xl border border-dashed border-meetup-border bg-white/60 p-6 text-center">
                <p className="font-semibold text-ink">Your page has no links yet</p>
                <p className="mx-auto mt-1 max-w-xs text-sm text-meetup-muted">
                  Tap Instagram or WhatsApp above and type your handle — that’s it. You can add more later.
                </p>
              </li>
            )}
            {blocks.map((block) =>
              block.kind === "link" ? (
                <SortableLink
                  key={block.link.id}
                  link={block.link}
                  container="root"
                  sections={sections}
                  expanded={expandedId === block.link.id}
                  onToggleExpand={() =>
                    setExpandedId((id) => (id === block.link.id ? null : block.link.id))
                  }
                  onToggle={toggle}
                  onRemove={remove}
                  onSave={saveInline}
                  onSetLock={setLock}
                />
              ) : (
                <SectionBlock
                  key={block.section.id}
                  section={block.section}
                  count={block.links.length}
                  canMoveUp={blocks.indexOf(block) > 0}
                  canMoveDown={blocks.indexOf(block) < blocks.length - 1}
                  onMove={(delta) => moveBlock(blocks.indexOf(block), delta)}
                  onUpdate={updateSection}
                  onRemove={removeSection}
                  onAddLink={addLinkToSection}
                >
                  <SortableContext
                    items={block.links.map((l) => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <ul className="space-y-3">
                      {block.links.length === 0 && (
                        <li className="rounded-xl border border-dashed border-meetup-border px-3 py-4 text-center text-xs text-meetup-muted">
                          Empty section. Add a link here, or move one in from a link’s “Section” menu.
                        </li>
                      )}
                      {block.links.map((link) => (
                        <SortableLink
                          key={link.id}
                          link={link}
                          container={block.section.id}
                          sections={sections}
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
                </SectionBlock>
              ),
            )}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function LayoutToggle({
  value,
  onChange,
}: {
  value: SectionLayout;
  onChange: (v: SectionLayout) => void;
}) {
  return (
    <div role="group" aria-label="Section layout" className="inline-flex shrink-0 gap-1">
      {(["list", "grid"] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={value === l}
          onClick={() => onChange(l)}
          className={`mu-chip min-h-[40px] ${value === l ? "mu-chip-active" : ""}`}
        >
          {l === "list" ? "☰ List" : "▦ Grid"}
        </button>
      ))}
    </div>
  );
}

function SectionBlock({
  section,
  count,
  canMoveUp,
  canMoveDown,
  onMove,
  onUpdate,
  onRemove,
  onAddLink,
  children,
}: {
  section: LinkSection;
  count: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (delta: -1 | 1) => void;
  onUpdate: (id: string, patch: { title?: string; layout?: SectionLayout }) => void;
  onRemove: (section: LinkSection, count: number) => void;
  onAddLink: (sectionId: string) => void;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `section:${section.id}`,
    data: { container: "root" },
  });
  const [title, setTitle] = useState(section.title);
  useEffect(() => setTitle(section.title), [section.title]);

  function commitTitle() {
    const next = title.trim();
    if (!next) return setTitle(section.title);
    if (next !== section.title) onUpdate(section.id, { title: next });
  }

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
      }}
      className="rounded-2xl border border-meetup-purple/25 bg-meetup-purple/5 p-3 md:p-4"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="flex h-10 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-lg text-ink/30 active:cursor-grabbing active:bg-mist"
          {...attributes}
          {...listeners}
          aria-label={`Reorder section ${section.title}`}
        >
          ⠿
        </button>
        <input
          className="mu-input min-h-[40px] min-w-0 flex-1 font-semibold"
          value={title}
          maxLength={80}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          aria-label="Section title"
        />
        <LayoutToggle value={section.layout as SectionLayout} onChange={(layout) => onUpdate(section.id, { layout })} />
        <div className="inline-flex gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={!canMoveUp}
            aria-label={`Move section ${section.title} up`}
            className="mu-chip min-h-[40px] min-w-[40px] justify-center disabled:opacity-40"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={!canMoveDown}
            aria-label={`Move section ${section.title} down`}
            className="mu-chip min-h-[40px] min-w-[40px] justify-center disabled:opacity-40"
          >
            ↓
          </button>
        </div>
      </div>
      {children}
      <div className="mt-3 flex items-center justify-between gap-2">
        <button type="button" onClick={() => onAddLink(section.id)} className="mu-btn-ghost text-sm">
          + Add link here
        </button>
        <button
          type="button"
          onClick={() => onRemove(section, count)}
          className="text-sm font-semibold text-red-600 hover:underline"
        >
          Delete section
        </button>
      </div>
    </li>
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
  container,
  sections,
  expanded,
  onToggleExpand,
  onToggle,
  onRemove,
  onSave,
  onSetLock,
}: {
  link: LinkItem;
  /** "root" for loose links, or the id of the section the link is in (drag stays inside it). */
  container: string;
  sections: LinkSection[];
  expanded: boolean;
  onToggleExpand: () => void;
  onToggle: (link: LinkItem, field: "is_active" | "is_featured") => void;
  onRemove: (id: string) => void;
  onSave: (
    link: LinkItem,
    patch: Partial<LinkItem> & {
      clear_thumbnail?: boolean;
      clear_icon?: boolean;
    },
  ) => Promise<void>;
  onSetLock: (link: LinkItem, code: string | null) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
    data: { container },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [linkType, setLinkType] = useState<LinkType>(link.link_type || "url");
  const [sectionId, setSectionId] = useState<string | null>(link.section_id);
  const [icon, setIcon] = useState<string | null>(link.icon);
  const [thumbnail, setThumbnail] = useState(link.thumbnail_url || "");
  const [animation, setAnimation] = useState(link.animation || "none");
  const [featured, setFeatured] = useState(link.is_featured);
  const [visibleFrom, setVisibleFrom] = useState(link.visible_from);
  const [visibleUntil, setVisibleUntil] = useState(link.visible_until);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    setTitle(link.title);
    setUrl(link.url);
    setLinkType(link.link_type || "url");
    setSectionId(link.section_id);
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
          className="-ml-2 -mt-1 flex h-11 w-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-lg text-ink/30 active:cursor-grabbing active:bg-mist"
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${link.title}`}
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
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <VisibleSwitch
                checked={link.is_active}
                onChange={() => onToggle(link, "is_active")}
                label={link.title}
              />
              <MiniBtn onClick={onToggleExpand}>Edit</MiniBtn>
              <MiniBtn
                onClick={() => setShowMore((v) => !v)}
                ariaExpanded={showMore}
                ariaLabel="More actions"
              >
                <span aria-hidden className="text-base leading-none tracking-widest">
                  ⋯
                </span>
              </MiniBtn>
              {showMore && (
                <div className="flex w-full flex-wrap gap-2">
                  {link.link_type !== "header" && (
                    <MiniBtn onClick={() => onToggle(link, "is_featured")}>
                      {link.is_featured ? "Unfeature" : "Feature"}
                    </MiniBtn>
                  )}
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

          <label className="block text-sm">
            <span className="mb-1 block font-semibold">Section</span>
            <select
              className="mu-input"
              value={sectionId ?? ""}
              onChange={(e) => setSectionId(e.target.value || null)}
            >
              <option value="">No section (loose link)</option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.title}
                </option>
              ))}
            </select>
          </label>

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
                    section_id: sectionId,
                    icon,
                    thumbnail_url: thumbnail || null,
                    animation,
                    is_featured: linkType === "header" ? false : featured,
                    visible_from: visibleFrom,
                    visible_until: visibleUntil,
                  } as Partial<LinkItem> & { clear_thumbnail?: boolean; clear_icon?: boolean })
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
  ariaExpanded,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  ariaExpanded?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-label={ariaLabel}
      className={`inline-flex min-h-[36px] items-center rounded-full px-3.5 text-[13px] font-semibold ${
        danger
          ? "bg-red-50 text-red-600 active:bg-red-100"
          : "bg-mist text-ink hover:bg-meetup-lavender hover:text-meetup-purple"
      }`}
    >
      {children}
    </button>
  );
}

function VisibleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`Show “${label}” on my page`}
      onClick={onChange}
      className="inline-flex min-h-[36px] items-center gap-2 rounded-full pr-1 text-[13px] font-semibold text-meetup-muted"
    >
      <span
        className={`relative inline-block h-6 w-10 rounded-full transition ${
          checked ? "bg-emerald-500" : "bg-meetup-border"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
      {checked ? "Visible" : "Hidden"}
    </button>
  );
}
