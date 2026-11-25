import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { PublicProfileView } from "@/components/PublicProfileView";
import { ShortLinkPreview, type ShortLinkPreviewData } from "@/components/ShortLinkPreview";
import { detectLang, isSiteLang, LANG_COOKIE, LANG_LABEL, type SiteLang } from "@/lib/i18n/site";
import { JsonLd, profilePageLd } from "@/lib/jsonld";
import type { PublicDirectoryItem } from "@/lib/types";
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

/** `bitlink.click/{code}+` (Bitly-style) shows where a short link goes instead of following it. */
function previewCode(param: string): string | null {
  const raw = decodeURIComponent(param);
  return raw.length > 1 && raw.endsWith("+") ? raw.slice(0, -1).toLowerCase() : null;
}

async function fetchShortLinkPreview(code: string): Promise<ShortLinkPreviewData | null> {
  try {
    const res = await fetch(`${API}/api/v1/r/${encodeURIComponent(code)}/preview`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as ShortLinkPreviewData;
  } catch {
    return null;
  }
}

async function visitorLang(): Promise<SiteLang> {
  const saved = (await cookies()).get(LANG_COOKIE)?.value;
  if (isSiteLang(saved)) return saved;
  const h = await headers();
  return detectLang(h.get("accept-language"), h.get("x-vercel-ip-country") || h.get("cf-ipcountry"));
}

/** "Discover more": up to 2 verified profiles (a perk of the badge), the rest the most recent. */
function pickRelated(directory: PublicDirectoryItem[], self: string): PublicDirectoryItem[] {
  const others = directory.filter((p) => p.username !== self);
  const verified = others.filter((p) => p.is_verified).slice(0, 2);
  const rest = others.filter((p) => !verified.includes(p));
  return [...verified, ...rest].slice(0, 4);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  if (previewCode(username)) {
    return { title: "Link preview | Bitlink", robots: { index: false, follow: false } };
  }
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
  const code = previewCode(username);
  if (code) {
    const preview = await fetchShortLinkPreview(code);
    if (!preview) notFound();
    return <ShortLinkPreview data={preview} lang={await visitorLang()} />;
  }
  const slug = username.toLowerCase();
  if (RESERVED.has(slug)) notFound();

  const profile = await fetchProfile(slug);
  if (profile) {
    // Cross-promotion is opt-in on both sides: only discoverable profiles show others.
    const related =
      profile.discoverable && !profile.is_locked
        ? pickRelated(await fetchDirectory(24), profile.username)
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
