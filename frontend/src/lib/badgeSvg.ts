import type { SiteLang } from "@/lib/i18n/site";
import { BADGE_COLOR, verificationType } from "@/lib/verification";

/**
 * Embeddable "Verified on Bitlink" badge (`/{username}/badge.svg`) that owners put on their
 * website or README, linking back to their page. When the profile is not verified (or loses the
 * badge later) it still renders, as a plain "on Bitlink" pill, so embeds never break and never lie.
 */

export type BadgeTheme = "light" | "dark";

const LABEL: Record<SiteLang, { verified: string; plain: string }> = {
  en: { verified: "Verified on Bitlink", plain: "on Bitlink" },
  es: { verified: "Verificado en Bitlink", plain: "en Bitlink" },
  pt: { verified: "Verificado no Bitlink", plain: "no Bitlink" },
};

// Rough advance widths for a 12px system sans (checked in Chrome): sizes the pill without a font engine.
function textWidth(text: string, size: number): number {
  let units = 0;
  for (const ch of text) {
    if ("ilj.,:;|!'".includes(ch)) units += 0.3;
    else if ("mwMW@".includes(ch)) units += 0.9;
    else if (ch === " ") units += 0.3;
    else if (ch >= "A" && ch <= "Z") units += 0.68;
    else units += 0.56;
  }
  return Math.ceil(units * size);
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function badgeSvg(opts: {
  username: string;
  verified: boolean;
  type: string | null;
  theme: BadgeTheme;
  lang: SiteLang;
}): string {
  const { username, verified, theme, lang } = opts;
  const dark = theme === "dark";
  const bg = dark ? "#0f172a" : "#ffffff";
  const border = dark ? "#334155" : "#e2e8f0";
  const fg = dark ? "#f8fafc" : "#0f172a";
  const muted = dark ? "#94a3b8" : "#64748b";
  const color = BADGE_COLOR[verificationType(opts.type)];

  const handle = `@${username}`;
  const label = verified ? LABEL[lang].verified : LABEL[lang].plain;
  const h = 28;
  const pad = 10;
  const icon = verified ? 16 : 0;
  const gap = verified ? 6 : 0;
  const handleW = textWidth(handle, 12);
  const labelW = textWidth(label, 11);
  const w = pad + icon + gap + handleW + 6 + labelW + pad;
  const x0 = pad + icon + gap;
  const title = verified ? `${handle} · ${label}` : `${handle} ${label}`;

  const check = verified
    ? `<circle cx="${pad + 8}" cy="14" r="8" fill="${color}"/>` +
      `<path d="M${pad + 4.5} 14.2l2.4 2.4 4.6-5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`
    : "";

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">` +
    `<title>${esc(title)}</title>` +
    `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="14" fill="${bg}" stroke="${border}"/>` +
    check +
    `<g font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">` +
    `<text x="${x0}" y="18" font-size="12" font-weight="600" fill="${fg}">${esc(handle)}</text>` +
    `<text x="${x0 + handleW + 6}" y="18" font-size="11" fill="${muted}">${esc(label)}</text>` +
    `</g></svg>`
  );
}
