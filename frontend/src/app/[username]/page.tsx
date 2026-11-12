import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PublicProfileView } from "@/components/PublicProfileView";
import { absoluteAsset, OG_IMAGE_PATH, siteUrl } from "@/lib/site";
import type { PublicProfile } from "@/lib/types";

const API = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const WEB = siteUrl();

const RESERVED = new Set([
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
  "r",
  "u",
]);

async function fetchProfile(username: string): Promise<PublicProfile | null> {
  try {
    const res = await fetch(`${API}/api/v1/public/${username}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load profile");
    return res.json();
  } catch {
    return null;
  }
}

async function resolveShortLink(code: string): Promise<string | null> {
  try {
    const res = await fetch(`${API}/api/v1/r/${encodeURIComponent(code)}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = (await res.json()) as { url?: string };
    return data.url || null;
  } catch {
    return null;
  }
}

function absoluteUrl(pathOrUrl: string | null | undefined): string | undefined {
  if (!pathOrUrl) return undefined;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  return `${WEB.replace(/\/$/, "")}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  if (RESERVED.has(username.toLowerCase())) return { title: "Not found | Bitlink" };

  const profile = await fetchProfile(username);
  if (!profile) {
    return {
      title: "Bitlink",
      robots: { index: false, follow: false },
    };
  }

  const title = profile.seo_title || `${profile.display_name} | Bitlink`;
  const description = profile.seo_description || profile.bio || `${profile.display_name} on Bitlink`;
  const url = `${WEB.replace(/\/$/, "")}/${profile.username}`;
  const image = absoluteUrl(profile.avatar_url) || absoluteAsset(OG_IMAGE_PATH);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Bitlink",
      type: "profile",
      images: [{ url: image, alt: profile.display_name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function PublicUsernamePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const slug = username.toLowerCase();
  if (RESERVED.has(slug)) notFound();

  const profile = await fetchProfile(slug);
  if (profile) {
    return <PublicProfileView initial={profile} username={slug} />;
  }

  // Profiles win on collision; otherwise treat as short link.
  const destination = await resolveShortLink(slug);
  if (destination) {
    redirect(destination);
  }

  notFound();
}
