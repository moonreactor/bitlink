import { ImageResponse } from "next/og";
import { absoluteUrl, fetchProfile, RESERVED } from "@/lib/publicProfile";
import { BADGE_COLOR, verificationType } from "@/lib/verification";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Bitlink profile";
export const dynamic = "force-dynamic";

export default async function OgImage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const slug = username.toLowerCase();
  const profile = RESERVED.has(slug) ? null : await fetchProfile(slug);

  const theme = (profile?.theme_json || {}) as Record<string, string>;
  const bg = theme.background_color || "#0f172a";
  const fg = theme.text_color || "#f8fafc";
  const name = profile?.display_name || "Bitlink";
  const bio = profile && !profile.is_locked ? profile.bio : null;
  const avatar = absoluteUrl(profile?.avatar_url);
  const badge = profile?.is_verified ? BADGE_COLOR[verificationType(profile.verification_type)] : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          color: fg,
          fontFamily: "sans-serif",
          padding: 64,
        }}
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            width={220}
            height={220}
            alt=""
            style={{ borderRadius: 999, objectFit: "cover", border: "6px solid rgba(255,255,255,0.35)" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              width: 220,
              height: 220,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.18)",
              fontSize: 110,
              fontWeight: 800,
            }}
          >
            {name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 36,
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: -1.5,
          }}
        >
          {name}
          {badge ? (
            <div
              style={{
                display: "flex",
                width: 56,
                height: 56,
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                background: badge,
                color: "#ffffff",
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path d="M20 6 9 17l-5-5" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ) : null}
        </div>
        {bio ? (
          <div
            style={{
              display: "flex",
              marginTop: 16,
              maxWidth: 900,
              textAlign: "center",
              fontSize: 32,
              opacity: 0.8,
              lineHeight: 1.3,
            }}
          >
            {bio.length > 120 ? `${bio.slice(0, 117)}…` : bio}
          </div>
        ) : null}
        <div style={{ display: "flex", position: "absolute", bottom: 40, fontSize: 30, opacity: 0.7 }}>
          {`bitlink.click/${profile?.username || ""}`}
        </div>
      </div>
    ),
    size,
  );
}
