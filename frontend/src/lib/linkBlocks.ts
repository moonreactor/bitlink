import type { LinkItem, PublicLink, PublicSection, LinkSection, SectionLayout } from "./types";

export type LinkBlock =
  | { kind: "single"; link: PublicLink }
  | { kind: "section"; id: string; title: string; layout: SectionLayout; links: PublicLink[] };

/** Group the public links (already in page order) into loose links and titled sections. */
export function buildLinkBlocks(links: PublicLink[], sections: PublicSection[] = []): LinkBlock[] {
  const byId = new Map(sections.map((s) => [s.id, s]));
  const blocks: LinkBlock[] = [];
  const sectionIndex = new Map<string, number>();

  for (const link of links) {
    const section = link.section_id ? byId.get(link.section_id) : undefined;
    if (!section) {
      blocks.push({ kind: "single", link });
      continue;
    }
    const existing = sectionIndex.get(section.id);
    if (existing === undefined) {
      sectionIndex.set(section.id, blocks.length);
      blocks.push({
        kind: "section",
        id: section.id,
        title: section.title,
        layout: section.layout,
        links: [link],
      });
    } else {
      const block = blocks[existing];
      if (block.kind === "section") block.links.push(link);
    }
  }
  return blocks;
}

/** Page order as the dashboard editor shows it (includes empty sections). */
export type EditorBlock =
  | { kind: "link"; link: LinkItem }
  | { kind: "section"; section: LinkSection; links: LinkItem[] };

const byPosition = <T extends { position: number; created_at: string }>(a: T, b: T) =>
  a.position - b.position || a.created_at.localeCompare(b.created_at);

export function buildEditorBlocks(links: LinkItem[], sections: LinkSection[]): EditorBlock[] {
  const known = new Set(sections.map((s) => s.id));
  const inside = new Map<string, LinkItem[]>();
  const loose: LinkItem[] = [];
  for (const link of links) {
    if (link.section_id && known.has(link.section_id)) {
      inside.set(link.section_id, [...(inside.get(link.section_id) ?? []), link]);
    } else {
      loose.push(link);
    }
  }

  const top: ({ kind: "section"; section: LinkSection } | { kind: "link"; link: LinkItem })[] = [
    ...sections.map((section) => ({ kind: "section" as const, section })),
    ...loose.map((link) => ({ kind: "link" as const, link })),
  ];
  const item = (e: (typeof top)[number]) => (e.kind === "section" ? e.section : e.link);
  top.sort(
    (a, b) =>
      byPosition(item(a), item(b)) ||
      (a.kind === b.kind ? 0 : a.kind === "section" ? -1 : 1),
  );

  return top.map((e) =>
    e.kind === "link"
      ? e
      : { kind: "section", section: e.section, links: (inside.get(e.section.id) ?? []).sort(byPosition) },
  );
}

/** Blocks → payload for `PUT /me/layout`. */
export function toLayoutPayload(blocks: EditorBlock[]) {
  return blocks.map((b) =>
    b.kind === "link"
      ? ({ type: "link", id: b.link.id } as const)
      : ({ type: "section", id: b.section.id, link_ids: b.links.map((l) => l.id) } as const),
  );
}
