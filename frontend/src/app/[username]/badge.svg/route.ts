import { badgeSvg, type BadgeTheme } from "@/lib/badgeSvg";
import { isSiteLang } from "@/lib/i18n/site";
import { fetchProfile, RESERVED } from "@/lib/publicProfile";

/** `bitlink.click/{username}/badge.svg?theme=dark&lang=es` — embeddable badge for other sites. */
export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const slug = username.toLowerCase();
  const profile = RESERVED.has(slug) ? null : await fetchProfile(slug);
  if (!profile) return new Response("Not found", { status: 404 });

  const search = new URL(request.url).searchParams;
  const theme: BadgeTheme = search.get("theme") === "dark" ? "dark" : "light";
  const langParam = search.get("lang");
  const lang = isSiteLang(langParam) ? langParam : "en";

  const svg = badgeSvg({
    username: profile.username,
    verified: profile.is_verified,
    type: profile.verification_type,
    theme,
    lang,
  });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // Short enough that a removed badge disappears from embeds within the hour.
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
    },
  });
}
