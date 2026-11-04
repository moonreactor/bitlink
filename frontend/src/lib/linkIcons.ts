export type LinkIconPreset = {
  id: string;
  emoji: string;
  label: string;
};

export const LINK_ICON_PRESETS: LinkIconPreset[] = [
  { id: "link", emoji: "🔗", label: "Link" },
  { id: "globe", emoji: "🌐", label: "Website" },
  { id: "shop", emoji: "🛍️", label: "Shop" },
  { id: "cart", emoji: "🛒", label: "Store" },
  { id: "music", emoji: "🎵", label: "Music" },
  { id: "headphones", emoji: "🎧", label: "Podcast" },
  { id: "video", emoji: "🎬", label: "Video" },
  { id: "camera", emoji: "📸", label: "Photos" },
  { id: "instagram", emoji: "📸", label: "Instagram" },
  { id: "tiktok", emoji: "📱", label: "TikTok" },
  { id: "youtube", emoji: "▶️", label: "YouTube" },
  { id: "twitter", emoji: "🐦", label: "X / Twitter" },
  { id: "mail", emoji: "✉️", label: "Email" },
  { id: "phone", emoji: "📞", label: "Phone" },
  { id: "chat", emoji: "💬", label: "Chat" },
  { id: "calendar", emoji: "📅", label: "Calendar" },
  { id: "ticket", emoji: "🎟️", label: "Tickets" },
  { id: "map", emoji: "📍", label: "Location" },
  { id: "book", emoji: "📚", label: "Book" },
  { id: "news", emoji: "📰", label: "Blog" },
  { id: "briefcase", emoji: "💼", label: "Work" },
  { id: "resume", emoji: "📄", label: "Resume" },
  { id: "code", emoji: "💻", label: "Code" },
  { id: "github", emoji: "🐙", label: "GitHub" },
  { id: "heart", emoji: "❤️", label: "Love" },
  { id: "star", emoji: "⭐", label: "Featured" },
  { id: "fire", emoji: "🔥", label: "Hot" },
  { id: "sparkles", emoji: "✨", label: "New" },
  { id: "gift", emoji: "🎁", label: "Gift" },
  { id: "coffee", emoji: "☕", label: "Support" },
  { id: "rocket", emoji: "🚀", label: "Launch" },
  { id: "game", emoji: "🎮", label: "Games" },
  { id: "art", emoji: "🎨", label: "Art" },
  { id: "mic", emoji: "🎤", label: "Live" },
  { id: "food", emoji: "🍔", label: "Food" },
  { id: "travel", emoji: "✈️", label: "Travel" },
];

export function isLikelyEmoji(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 8) return false;
  // Reject obvious URLs / plain ascii words
  if (/^[a-z0-9_\-./]+$/i.test(trimmed)) return false;
  return true;
}
