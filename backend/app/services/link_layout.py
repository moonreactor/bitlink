"""Page ordering for links and sections.

Top-level order = loose links (no section) and sections, interleaved by `position`.
Inside a section, links are ordered by their own `position`.
"""

from collections import defaultdict
from collections.abc import Iterable, Sequence
from uuid import UUID

from app.models.link import Link
from app.models.link_section import LinkSection


class LayoutError(ValueError):
    pass


def _group(links: Iterable[Link], sections: Sequence[LinkSection]):
    section_ids = {s.id for s in sections}
    inside: dict[UUID, list[Link]] = defaultdict(list)
    loose: list[Link] = []
    for link in links:
        if link.section_id in section_ids:
            inside[link.section_id].append(link)
        else:
            loose.append(link)
    for items in inside.values():
        items.sort(key=lambda l: (l.position, l.created_at))
    return loose, inside


def top_level_order(links: Iterable[Link], sections: Sequence[LinkSection]) -> list[Link | LinkSection]:
    """Loose links and sections in page order (sections win ties against loose links)."""
    loose, _ = _group(links, sections)
    entries: list[Link | LinkSection] = [*sections, *loose]
    return sorted(entries, key=lambda e: (e.position, 0 if isinstance(e, LinkSection) else 1, e.created_at))


def public_blocks(
    links: Iterable[Link], sections: Sequence[LinkSection]
) -> list[tuple[LinkSection | None, list[Link]]]:
    """Blocks of the public page. `(None, [link])` is a loose link, `(section, links)` a section.

    Only the links given are considered, so pass the visible ones; sections left without links
    disappear. Featured links float to the top of their container, as before.
    """
    links = list(links)
    loose, inside = _group(links, sections)
    entries = top_level_order(links, [s for s in sections if inside.get(s.id)])

    featured_loose = [e for e in entries if isinstance(e, Link) and e.is_featured]
    rest = [e for e in entries if not (isinstance(e, Link) and e.is_featured)]

    blocks: list[tuple[LinkSection | None, list[Link]]] = [(None, [l]) for l in featured_loose]
    for entry in rest:
        if isinstance(entry, LinkSection):
            items = sorted(inside[entry.id], key=lambda l: not l.is_featured)  # stable
            blocks.append((entry, items))
        else:
            blocks.append((None, [entry]))
    return blocks


def next_top_position(links: Iterable[Link], sections: Sequence[LinkSection]) -> int:
    loose, _ = _group(links, sections)
    positions = [e.position for e in (*sections, *loose)]
    return (max(positions) + 1) if positions else 0


def next_section_link_position(links: Iterable[Link], section_id: UUID) -> int:
    positions = [l.position for l in links if l.section_id == section_id]
    return (max(positions) + 1) if positions else 0


def apply_layout(
    links: Sequence[Link], sections: Sequence[LinkSection], blocks: Sequence[dict]
) -> None:
    """Apply a full page layout.

    `blocks` is ordered top to bottom; each is `{"type": "link", "id"}` or
    `{"type": "section", "id", "link_ids": [...]}`. Anything not mentioned keeps its relative
    order and goes to the end, so a stale client can never lose items.
    """
    link_by_id = {l.id: l for l in links}
    section_by_id = {s.id: s for s in sections}
    seen_links: set[UUID] = set()
    seen_sections: set[UUID] = set()

    def take_link(link_id: UUID) -> Link:
        link = link_by_id.get(link_id)
        if link is None:
            raise LayoutError("Unknown link in layout")
        if link_id in seen_links:
            raise LayoutError("Link appears twice in layout")
        seen_links.add(link_id)
        return link

    top: list[Link | LinkSection] = []
    for block in blocks:
        if block["type"] == "link":
            top.append(take_link(block["id"]))
            continue
        section = section_by_id.get(block["id"])
        if section is None:
            raise LayoutError("Unknown section in layout")
        if section.id in seen_sections:
            raise LayoutError("Section appears twice in layout")
        seen_sections.add(section.id)
        for index, link_id in enumerate(block.get("link_ids", [])):
            link = take_link(link_id)
            link.section_id = section.id
            link.position = index
        top.append(section)

    # Leftovers: keep relative order, append at the end.
    leftovers_in_section: dict[UUID, list[Link]] = defaultdict(list)
    leftover_top: list[Link | LinkSection] = []
    for entry in top_level_order(links, sections):
        if isinstance(entry, LinkSection):
            if entry.id not in seen_sections:
                leftover_top.append(entry)
        elif entry.id not in seen_links:
            leftover_top.append(entry)
    for link in sorted(links, key=lambda l: (l.position, l.created_at)):
        if link.id in seen_links or link.section_id is None or link.section_id not in section_by_id:
            continue
        leftovers_in_section[link.section_id].append(link)

    for section_id, items in leftovers_in_section.items():
        start = len([l for l in links if l.id in seen_links and l.section_id == section_id])
        for offset, link in enumerate(items):
            link.position = start + offset

    for index, entry in enumerate([*top, *leftover_top]):
        entry.position = index
        if isinstance(entry, Link):
            entry.section_id = None


def dissolve_section(
    links: Sequence[Link], sections: Sequence[LinkSection], section: LinkSection
) -> None:
    """Remove a section's grouping, leaving its links in the same place on the page."""
    ordered: list[Link | LinkSection] = []
    _, inside = _group(links, sections)
    for entry in top_level_order(links, sections):
        if entry is section:
            ordered.extend(inside.get(section.id, []))
        else:
            ordered.append(entry)
    for index, entry in enumerate(ordered):
        entry.position = index
        if isinstance(entry, Link):
            entry.section_id = None
