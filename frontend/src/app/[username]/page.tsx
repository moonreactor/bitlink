import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProfileView } from "@/components/PublicProfileView";
import type { PublicProfile } from "@/lib/types";

const API = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const profile = await fetchProfile(username);
  if (!profile) return { title: "Not found | Bitlink" };
  return {
    title: profile.seo_title || `${profile.display_name} | Bitlink`,
    description: profile.seo_description || profile.bio || undefined,
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
  ]);
  if (reserved.has(username.toLowerCase())) notFound();

  const profile = await fetchProfile(username);
  if (!profile) notFound();

  return <PublicProfileView initial={profile} username={username} />;
}
