/** Canonical public web origin used for Open Graph and absolute links. */
export function siteUrl(): string {
  const fromEnv = (process.env.NEXT_PUBLIC_WEB_URL || "").trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  // Never fall back to the API host — OG images live on the web service.
  if (process.env.NODE_ENV === "production") return "https://bitlink.click";
  return "http://localhost:3000";
}

export function absoluteAsset(path: string): string {
  const base = siteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export const OG_IMAGE_PATH = "/bitlink-og.webp";
