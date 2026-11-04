import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProfileView } from "@/components/PublicProfileView";
import type { PublicProfile } from "@/lib/types";

const API = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const WEB = process.env.NEXT_PUBLIC_WEB_URL || process.env.NEXT_PUBLIC_API_URL?.replace(":8000", ":3000") || "http://localhost:3000";

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
  const profile = await fetchProfile(username);
  if (!profile) return { title: "Not found | Bitlink" };

  const title = profile.seo_title || `${profile.display_name} | Bitlink`;
  const description = profile.seo_description || profile.bio || `${profile.display_name} on Bitlink`;
  const url = `${WEB.replace(/\/$/, "")}/${profile.username}`;
  const image = absoluteUrl(profile.avatar_url);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Bitlink",
      type: "profile",
      ...(image ? { images: [{ url: image, alt: profile.display_name }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function PublicUsernamePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const reserved = new Set([
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
  ]);
  if (reserved.has(username.toLowerCase())) notFound();

  const profile = await fetchProfile(username);
  if (!profile) notFound();

  return <PublicProfileView initial={profile} username={username} />;
}
