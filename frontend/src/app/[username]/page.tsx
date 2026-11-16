import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PublicProfileView } from "@/components/PublicProfileView";
import { LANG_LABEL } from "@/lib/i18n/site";
import { JsonLd, profilePageLd } from "@/lib/jsonld";
import {
  API,
  fetchDirectory,
  fetchProfile,
  profileUrl,
  RESERVED,
} from "@/lib/publicProfile";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  if (RESERVED.has(username.toLowerCase())) return { title: "Not found | Bitlink" };

  const profile = await fetchProfile(username.toLowerCase());
  if (!profile) {
    return {
      title: "Bitlink",
      robots: { index: false, follow: false },
    };
  }

  const title = profile.seo_title || `${profile.display_name} | Bitlink`;
  const description = profile.seo_description || profile.bio || `${profile.display_name} on Bitlink`;
  const url = profileUrl(profile.username);
  const image = `${url}/opengraph-image`;
  const locale = profile.language ? LANG_LABEL[profile.language].og : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: profile.is_locked ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: "Bitlink",
      type: "profile",
      username: profile.username,
      locale,
      images: [{ url: image, width: 1200, height: 630, alt: profile.display_name }],
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
    // Cross-promotion is opt-in on both sides: only discoverable profiles show others.
    const related =
      profile.discoverable && !profile.is_locked
        ? (await fetchDirectory(12)).filter((p) => p.username !== profile.username).slice(0, 4)
        : [];
    return (
      <>
        {!profile.is_locked && <JsonLd data={profilePageLd(profile)} />}
        <PublicProfileView initial={profile} username={slug} related={related} />
      </>
    );
  }

  // Profiles win on collision; otherwise treat as short link.
  const destination = await resolveShortLink(slug);
  if (destination) {
    redirect(destination);
  }

  notFound();
}
