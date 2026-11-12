import type { SocialBrandId } from "@/lib/socialBrands";

/** One-tap starters so a new user never faces a blank URL field. */
export type QuickAddTemplate = {
  id: string;
  label: string;
  /** URL prefix the user completes (cursor lands at the end). */
  prefix: string;
  placeholder: string;
  brand?: SocialBrandId;
};

export const QUICK_ADD: QuickAddTemplate[] = [
  { id: "instagram", label: "Instagram", prefix: "https://instagram.com/", placeholder: "your_handle", brand: "instagram" },
  { id: "tiktok", label: "TikTok", prefix: "https://tiktok.com/@", placeholder: "your_handle", brand: "tiktok" },
  { id: "whatsapp", label: "WhatsApp", prefix: "https://wa.me/", placeholder: "5491122334455", brand: "whatsapp" },
  { id: "youtube", label: "YouTube", prefix: "https://youtube.com/@", placeholder: "your_channel", brand: "youtube" },
  { id: "spotify", label: "Spotify", prefix: "https://open.spotify.com/", placeholder: "artist/…", brand: "spotify" },
  { id: "website", label: "Website", prefix: "https://", placeholder: "yoursite.com" },
];

export function findQuickAdd(id: string | null | undefined) {
  return QUICK_ADD.find((t) => t.id === id) || null;
}

/** True once the user typed something beyond the template prefix. */
export function isPrefixOnly(url: string) {
  const v = url.trim();
  return QUICK_ADD.some((t) => v === t.prefix || v === t.prefix.replace(/\/$/, ""));
}
