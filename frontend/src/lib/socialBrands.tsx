import type { ReactNode } from "react";

export type SocialBrandId =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitter"
  | "x"
  | "linkedin"
  | "github"
  | "facebook"
  | "spotify"
  | "whatsapp"
  | "discord"
  | "twitch"
  | "threads"
  | "pinterest"
  | "telegram"
  | "snapchat"
  | "behance"
  | "dribbble"
  | "reddit"
  | "mail";

type BrandMeta = {
  id: SocialBrandId;
  label: string;
  /** Brand accent for icon well background (subtle tint) */
  color: string;
  match: (host: string, href: string) => boolean;
};

const BRANDS: BrandMeta[] = [
  {
    id: "instagram",
    label: "Instagram",
    color: "#E4405F",
    match: (h) => h === "instagram.com" || h === "instagr.am" || h.endsWith(".instagram.com"),
  },
  {
    id: "tiktok",
    label: "TikTok",
    color: "#000000",
    match: (h) => h === "tiktok.com" || h.endsWith(".tiktok.com") || h === "vm.tiktok.com",
  },
  {
    id: "youtube",
    label: "YouTube",
    color: "#FF0000",
    match: (h) =>
      h === "youtube.com" ||
      h === "youtu.be" ||
      h === "m.youtube.com" ||
      h.endsWith(".youtube.com"),
  },
  {
    id: "twitter",
    label: "X",
    color: "#000000",
    match: (h) => h === "twitter.com" || h === "x.com" || h.endsWith(".twitter.com") || h.endsWith(".x.com"),
  },
  {
    id: "x",
    label: "X",
    color: "#000000",
    match: () => false,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "#0A66C2",
    match: (h) => h === "linkedin.com" || h.endsWith(".linkedin.com"),
  },
  {
    id: "github",
    label: "GitHub",
    color: "#181717",
    match: (h) => h === "github.com" || h === "gist.github.com",
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "#1877F2",
    match: (h) => h === "facebook.com" || h === "fb.com" || h === "fb.me" || h.endsWith(".facebook.com"),
  },
  {
    id: "spotify",
    label: "Spotify",
    color: "#1DB954",
    match: (h) => h === "spotify.com" || h === "open.spotify.com" || h.endsWith(".spotify.com"),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: "#25D366",
    match: (h, href) =>
      h === "wa.me" ||
      h === "whatsapp.com" ||
      h === "api.whatsapp.com" ||
      h === "chat.whatsapp.com" ||
      href.startsWith("whatsapp:"),
  },
  {
    id: "discord",
    label: "Discord",
    color: "#5865F2",
    match: (h) => h === "discord.com" || h === "discord.gg" || h.endsWith(".discord.com"),
  },
  {
    id: "twitch",
    label: "Twitch",
    color: "#9146FF",
    match: (h) => h === "twitch.tv" || h.endsWith(".twitch.tv"),
  },
  {
    id: "threads",
    label: "Threads",
    color: "#000000",
    match: (h) => h === "threads.net" || h.endsWith(".threads.net"),
  },
  {
    id: "pinterest",
    label: "Pinterest",
    color: "#E60023",
    match: (h) => h === "pinterest.com" || h === "pin.it" || h.endsWith(".pinterest.com"),
  },
  {
    id: "telegram",
    label: "Telegram",
    color: "#26A5E4",
    match: (h, href) =>
      h === "t.me" || h === "telegram.me" || h === "telegram.org" || href.startsWith("tg:"),
  },
  {
    id: "snapchat",
    label: "Snapchat",
    color: "#FFFC00",
    match: (h) => h === "snapchat.com" || h.endsWith(".snapchat.com"),
  },
  {
    id: "behance",
    label: "Behance",
    color: "#1769FF",
    match: (h) => h === "behance.net" || h.endsWith(".behance.net"),
  },
  {
    id: "dribbble",
    label: "Dribbble",
    color: "#EA4C89",
    match: (h) => h === "dribbble.com" || h.endsWith(".dribbble.com"),
  },
  {
    id: "reddit",
    label: "Reddit",
    color: "#FF4500",
    match: (h) => h === "reddit.com" || h.endsWith(".reddit.com"),
  },
  {
    id: "mail",
    label: "Email",
    color: "#EA4335",
    match: (_h, href) => href.startsWith("mailto:"),
  },
];

function normalizeHost(raw: string): string {
  return raw.toLowerCase().replace(/^www\./, "");
}

export function detectSocialBrand(url: string | null | undefined): BrandMeta | null {
  if (!url?.trim()) return null;
  const raw = url.trim();
  try {
    const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
    const parsed = new URL(withProtocol);
    const host = normalizeHost(parsed.hostname);
    const href = withProtocol.toLowerCase();
    for (const brand of BRANDS) {
      if (brand.id === "x") continue;
      if (brand.match(host, href)) return brand.id === "twitter" ? { ...brand, id: "x", label: "X" } : brand;
    }
  } catch {
    const lower = raw.toLowerCase();
    if (lower.startsWith("mailto:")) return BRANDS.find((b) => b.id === "mail") || null;
  }
  return null;
}

export function brandFromPlatform(platform: string | null | undefined): BrandMeta | null {
  if (!platform) return null;
  const key = platform.toLowerCase().trim();
  const alias: Record<string, SocialBrandId> = {
    instagram: "instagram",
    ig: "instagram",
    tiktok: "tiktok",
    youtube: "youtube",
    yt: "youtube",
    twitter: "twitter",
    x: "twitter",
    linkedin: "linkedin",
    github: "github",
    facebook: "facebook",
    fb: "facebook",
    spotify: "spotify",
    whatsapp: "whatsapp",
    discord: "discord",
    twitch: "twitch",
    threads: "threads",
    pinterest: "pinterest",
    telegram: "telegram",
    snapchat: "snapchat",
    behance: "behance",
    dribbble: "dribbble",
    reddit: "reddit",
    email: "mail",
    mail: "mail",
  };
  const id = alias[key];
  if (!id) return null;
  const found = BRANDS.find((b) => b.id === id);
  if (!found) return null;
  if (found.id === "twitter") return { ...found, id: "x", label: "X" };
  return found;
}

function Svg({ children, title }: { children: ReactNode; title: string }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden focusable="false">
      <title>{title}</title>
      {children}
    </svg>
  );
}

/** Official-style monochrome brand marks (simple paths). */
export function SocialBrandIcon({
  brandId,
  className = "",
}: {
  brandId: SocialBrandId;
  className?: string;
}) {
  const id = brandId === "twitter" ? "x" : brandId;
  const paths: Record<string, ReactNode> = {
    instagram: (
      <Svg title="Instagram">
        <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.92A3.12 3.12 0 1 1 12 8.88a3.12 3.12 0 0 1 0 6.24zM17.52 6.9a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0z" />
        <path d="M12 2.4c-2.6 0-2.93.01-3.96.06-2.62.12-4.06 1.55-4.18 4.18-.05 1.03-.06 1.36-.06 3.96s.01 2.93.06 3.96c.12 2.62 1.55 4.06 4.18 4.18 1.03.05 1.36.06 3.96.06s2.93-.01 3.96-.06c2.62-.12 4.06-1.55 4.18-4.18.05-1.03.06-1.36.06-3.96s-.01-2.93-.06-3.96c-.12-2.62-1.55-4.06-4.18-4.18C14.93 2.41 14.6 2.4 12 2.4zm0 1.68c2.56 0 2.86.01 3.86.06 1.96.09 3.03 1.14 3.12 3.12.05 1 .06 1.29.06 3.86s-.01 2.86-.06 3.86c-.09 1.96-1.16 3.03-3.12 3.12-1 .05-1.3.06-3.86.06s-2.86-.01-3.86-.06c-1.96-.09-3.03-1.16-3.12-3.12-.05-1-.06-1.3-.06-3.86s.01-2.86.06-3.86c.09-1.96 1.16-3.03 3.12-3.12 1-.05 1.3-.06 3.86-.06z" />
      </Svg>
    ),
    tiktok: (
      <Svg title="TikTok">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.34 6.34 6.34 0 0 0 9.49 21.7a6.34 6.34 0 0 0 6.34-6.34V8.73a8.2 8.2 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" />
      </Svg>
    ),
    youtube: (
      <Svg title="YouTube">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
      </Svg>
    ),
    x: (
      <Svg title="X">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </Svg>
    ),
    linkedin: (
      <Svg title="LinkedIn">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.23 0z" />
      </Svg>
    ),
    github: (
      <Svg title="GitHub">
        <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z" />
      </Svg>
    ),
    facebook: (
      <Svg title="Facebook">
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.7 4.54-4.7 1.32 0 2.7.24 2.7.24v2.97h-1.52c-1.5 0-1.96.93-1.96 1.89v2.26h3.34l-.53 3.49h-2.81V24C19.61 23.1 24 18.1 24 12.07z" />
      </Svg>
    ),
    spotify: (
      <Svg title="Spotify">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.7 1.32.3.18.42.66.24 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-.96-.12-1.14-.6-.12-.48.12-.96.6-1.14 4.38-1.32 9.78-.66 13.5 1.62.36.18.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.48-1.02.66-1.56.3z" />
      </Svg>
    ),
    whatsapp: (
      <Svg title="WhatsApp">
        <path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
        <path d="M12 2a10 10 0 0 0-8.68 14.94L2 22l5.2-1.36A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31A8.2 8.2 0 1 1 12 20.2z" />
      </Svg>
    ),
    discord: (
      <Svg title="Discord">
        <path d="M20.32 4.37A19.8 19.8 0 0 0 15.89 3l-.2.37a18.3 18.3 0 0 1 4.3 1.6 16.4 16.4 0 0 0-13.98 0A16.6 16.6 0 0 1 8.25 3.3L8.1 3A19.9 19.9 0 0 0 3.66 4.4C.53 9.1-.32 13.67.1 18.18A19.7 19.7 0 0 0 5.97 21l.4-.55a13 13 0 0 1-1.66-1.35l.4-.3a14.1 14.1 0 0 0 12.78 0l.4.3a12.7 12.7 0 0 1-1.66 1.36l.4.54a19.6 19.6 0 0 0 5.88-2.81c.5-5.2-.85-9.73-3.59-13.82zM8.52 15.33c-1.07 0-1.95-1-1.95-2.2s.86-2.2 1.95-2.2 1.98 1 1.95 2.2c0 1.2-.86 2.2-1.95 2.2zm6.96 0c-1.07 0-1.95-1-1.95-2.2s.86-2.2 1.95-2.2 1.98 1 1.95 2.2c0 1.2-.88 2.2-1.95 2.2z" />
      </Svg>
    ),
    twitch: (
      <Svg title="Twitch">
        <path d="M2.15 0 0.5 4.2v16.1h5.5V24l3.3-3.7h5.1L22.5 12V0zm18.5 11.1-3.3 3.7h-5.1l-3.3 3.7v-3.7H4.7V1.8h16z" />
        <path d="M16.7 4.9h1.8v5.5h-1.8zm-5 0h1.8v5.5H11.7z" />
      </Svg>
    ),
    threads: (
      <Svg title="Threads">
        <path d="M16.2 10.1c-.1-.05-.2-.1-.3-.14a5.7 5.7 0 0 0-.5-2.2 4.3 4.3 0 0 0-4.6-2.5c-2.5.1-4.3 1.6-4.4 3.8-.1 1.5.6 2.6 1.8 3.2 1 .5 2.2.6 3.4.7l.1.4c-.3 1.5-1.1 2.3-2.5 2.2-1.1 0-1.8-.4-2.4-1.3l-1.7 1c.8 1.3 2.1 2 3.9 2.1h.2c2.4 0 4-1.4 4.4-3.9.1-.6.1-1.2.1-1.8 1-.6 1.7-1.5 1.8-2.7.1-1.1-.3-2-.9-2.7zm-5.9 2.6c-.5-.2-.8-.6-.8-1.2 0-1.1 1-1.9 2.1-1.9.8 0 1.4.3 1.8.9.2.4.4.8.5 1.3-1.3-.1-2.6-.3-3.6-.9z" />
        <path d="M12.1.5C5.7.5.5 5.7.5 12.1s5.2 11.6 11.6 11.6 11.6-5.2 11.6-11.6S18.5.5 12.1.5zm0 21c-5.2 0-9.4-4.2-9.4-9.4s4.2-9.4 9.4-9.4 9.4 4.2 9.4 9.4-4.2 9.4-9.4 9.4z" />
      </Svg>
    ),
    pinterest: (
      <Svg title="Pinterest">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 5 3.1 9.2 7.5 10.9-.1-.9-.2-2.3 0-3.3.2-.9 1.4-5.9 1.4-5.9s-.4-.7-.4-1.8c0-1.7 1-3 2.2-3 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4-.3 1.2.6 2.2 1.8 2.2 2.1 0 3.6-2.7 3.6-5.9 0-2.4-1.6-4.2-4.6-4.2-3.3 0-5.4 2.5-5.4 5.2 0 1 .3 1.7.8 2.2.2.2.2.3.1.6l-.3 1.2c0 .2-.3.3-.5.2-1.7-.7-2.5-2.6-2.5-4.7 0-3.5 3-7.7 8.9-7.7 4.8 0 7.9 3.4 7.9 7.2 0 4.9-2.7 8.6-6.8 8.6-1.4 0-2.6-.7-3.1-1.6l-.8 3.2c-.3 1.1-1.1 2.5-1.6 3.3A12 12 0 0 0 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0z" />
      </Svg>
    ),
    telegram: (
      <Svg title="Telegram">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.9 8.2-1.8 8.5c-.1.6-.5.7-1 .5l-2.8-2.1-1.4 1.3c-.1.2-.3.3-.6.3l.2-2.9 5.3-4.8c.2-.2 0-.3-.3-.1l-6.5 4.1-2.8-.9c-.6-.2-.6-.6.1-.9l11-4.2c.5-.3 1 .1.7 1z" />
      </Svg>
    ),
    snapchat: (
      <Svg title="Snapchat">
        <path d="M12.04 2c-2.5 0-4.1 1.7-4.1 4.3v.7c0 .2 0 .3-.1.4-.7 1.3-1.7 2.5-2.9 3.5-.2.1-.2.3-.1.5.3.6.7 1.1.7 1.7 0 .5-.4.8-.8 1.1-.2.1-.3.3-.2.5.4.7 1.5 1 2.3 1.2.2 0 .3.1.3.3 0 .5-.1 1.1-.2 1.5-.1.4.1.7.5.7h.1c.7-.1 1.4-.3 2.2-.3.3 0 .5.1.7.3.4.4 1 .6 1.6.6s1.2-.2 1.6-.6c.2-.2.4-.3.7-.3.8 0 1.5.2 2.2.3h.1c.4 0 .6-.3.5-.7-.1-.4-.2-1-.2-1.5 0-.2.1-.3.3-.3.8-.2 1.9-.5 2.3-1.2.1-.2 0-.4-.2-.5-.4-.3-.8-.6-.8-1.1 0-.6.4-1.1.7-1.7.1-.2.1-.4-.1-.5-1.2-1-2.2-2.2-2.9-3.5-.1-.1-.1-.2-.1-.4v-.7c0-2.6-1.6-4.3-4.1-4.3h-.1z" />
      </Svg>
    ),
    behance: (
      <Svg title="Behance">
        <path d="M8.4 10.5c.9-.4 1.4-1.1 1.4-2.1 0-1.8-1.3-2.9-3.5-2.9H0v12.9h6.5c2.4 0 4.1-1.3 4.1-3.5 0-1.5-.8-2.6-2.2-3.1v-.3zM3.1 7.3h2.4c.9 0 1.4.4 1.4 1.1S6.4 9.6 5.4 9.6H3.1V7.3zm2.7 8.4H3.1v-3.4h2.8c1.1 0 1.7.5 1.7 1.6 0 1.2-.7 1.8-1.8 1.8zM24 7.7h-6.2V6h6.2v1.7zM18.8 17.7c2.7 0 4.7-1.7 4.7-4.5 0-2.7-1.9-4.4-4.6-4.4-2.8 0-4.7 1.8-4.7 4.5 0 2.8 1.9 4.4 4.6 4.4zm-.1-7.1c1.4 0 2.3 1 2.3 2.6s-.9 2.7-2.3 2.7-2.3-1.1-2.3-2.7.9-2.6 2.3-2.6z" />
      </Svg>
    ),
    dribbble: (
      <Svg title="Dribbble">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm7.9 5.6a10.1 10.1 0 0 1 2.2 6.3c-.3-.1-3.3-.7-6.3-.3-.1-.2-.1-.3-.2-.5-.2-.5-.4-1-.7-1.5 3.5-1.4 5.1-3.5 5-4zM12 1.9c2.5 0 4.7.9 6.5 2.4-.1.8-1.5 2.6-4.6 3.8-1.5-2.7-3.1-4.9-3.3-5.1A10 10 0 0 1 12 1.9zM8.7 3.6c.2.2 1.8 2.5 3.3 5.1-4.1 1.1-7.8 1.1-8.2 1.1A10.2 10.2 0 0 1 8.7 3.6zM1.9 12v-.3c.4 0 4.7 0 9.2-1.3.3.5.5 1 .7 1.6l-.3.1c-4.6 1.5-7.1 5.5-7.3 5.8A10.1 10.1 0 0 1 1.9 12zm10.1 10.1a10.1 10.1 0 0 1-6.2-2.1c.2-.3 2.1-3.9 7.1-5.7l.1-.1c1.2 3.1 1.7 5.7 1.8 6.4a10 10 0 0 1-2.8 1.5zm3.8-1.4c-.1-.5-.5-3-.1.6-4.1-1.2-2-4.9-.3-5.3 1.7.1 3.4.4 4.7.9a10.1 10.1 0 0 1-3.7 4.7z" />
      </Svg>
    ),
    reddit: (
      <Svg title="Reddit">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.74c.69 0 1.25.56 1.25 1.25a1.25 1.25 0 0 1-2.44.51 6.8 6.8 0 0 0-3.95 1.04 2.9 2.9 0 0 1 2.42 2.89c0 .1 0 .19-.02.28.9-.1 1.73.2 2.38.72a1.25 1.25 0 1 1-.63 2.2 2.9 2.9 0 0 1-2.86 3.44 2.9 2.9 0 0 1-2.85-3.44 1.25 1.25 0 1 1-.64-2.2c.66-.52 1.48-.82 2.39-.72a2.9 2.9 0 0 1-.02-.28 2.9 2.9 0 0 1 2.42-2.89 6.8 6.8 0 0 0-3.95-1.04 1.25 1.25 0 1 1-1.2-1.76A6.9 6.9 0 0 1 12 5.5c1.5 0 2.91.47 4.06 1.26a1.24 1.24 0 0 1 .95-.99c0-.02 0-.02.01-.03z" />
      </Svg>
    ),
    mail: (
      <Svg title="Email">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
      </Svg>
    ),
  };

  return <span className={`inline-flex items-center justify-center ${className}`}>{paths[id]}</span>;
}

export function brandColor(brandId: SocialBrandId): string {
  const id = brandId === "x" || brandId === "twitter" ? "twitter" : brandId;
  return BRANDS.find((b) => b.id === id)?.color || "#212121";
}
