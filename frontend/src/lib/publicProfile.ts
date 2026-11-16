import { siteUrl } from "@/lib/site";
import type { PublicDirectoryItem, PublicProfile } from "@/lib/types";

/** Server-side helpers for public profile pages (page, OG image, sitemap). */
export const API =
  process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const RESERVED = new Set([
  "blog",
  "dashboard",
  "login",
  "register",
  "api",
  "settings",
  "appearance",
  "links",
  "admin",
  "forgot-password",
  "reset-password",
  "short-links",
  "short",
  "acortador-de-links",
  "url-shortener",
  "encurtador-de-links",
  "about",
  "directory",
  "es",
  "pt",
  "r",
  "u",
]);

export async function fetchProfile(username: string): Promise<PublicProfile | null> {
  try {
    const res = await fetch(`${API}/api/v1/public/${encodeURIComponent(username)}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load profile");
    return res.json();
  } catch {
    return null;
  }
}

/** Opt-in directory (profiles that chose to be discoverable). */
export async function fetchDirectory(limit = 12): Promise<PublicDirectoryItem[]> {
  try {
    const res = await fetch(`${API}/api/v1/public/directory?limit=${limit}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export function profileUrl(username: string): string {
  return `${siteUrl().replace(/\/$/, "")}/${username}`;
}

export function absoluteUrl(pathOrUrl: string | null | undefined): string | undefined {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  return `${siteUrl().replace(/\/$/, "")}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
