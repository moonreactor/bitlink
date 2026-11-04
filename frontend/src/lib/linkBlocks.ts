import type { CollectionLayout, PublicLink } from "./types";

export type LinkBlock =
  | { kind: "single"; link: PublicLink }
  | { kind: "collection"; name: string; layout: CollectionLayout; links: PublicLink[] };

/** Group public links into singles + named collections (order by first appearance). */
export function buildLinkBlocks(links: PublicLink[]): LinkBlock[] {
  const blocks: LinkBlock[] = [];
  const collectionIndex = new Map<string, number>();

  for (const link of links) {
    const name = link.collection?.trim();
    if (!name) {
      blocks.push({ kind: "single", link });
      continue;
    }
    const existing = collectionIndex.get(name);
    if (existing === undefined) {
      collectionIndex.set(name, blocks.length);
      blocks.push({
        kind: "collection",
        name,
        layout: link.collection_layout || "list",
        links: [link],
      });
    } else {
      const block = blocks[existing];
      if (block.kind === "collection") block.links.push(link);
    }
  }

  return blocks;
}
