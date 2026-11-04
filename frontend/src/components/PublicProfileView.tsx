"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BackgroundMusicPlayer } from "@/components/BackgroundMusicPlayer";
import { BitlinkLogo } from "@/components/BitlinkLogo";
import { LinkVisual } from "@/components/LinkVisual";
import { TrackingPixels } from "@/components/TrackingPixels";
import { publicApi } from "@/lib/api";
import { fontStack, googleFontsHref } from "@/lib/fonts";
import { buildLinkBlocks } from "@/lib/linkBlocks";
import { animationClass } from "@/lib/linkAnimations";
import { brandColor, brandFromPlatform, detectSocialBrand } from "@/lib/socialBrands";
import { buttonRadius, resolveSocialIconColor } from "@/lib/themes";
import type { PublicLink, PublicProfile, SocialIconStyle } from "@/lib/types";

function visitorId() {
  if (typeof window === "undefined") return undefined;
  const key = "bitlink_vid";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function PublicProfileView({
  initial,
  username,
}: {
  initial: PublicProfile;
  username: string;
}) {
  const [profile, setProfile] = useState(initial);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subMsg, setSubMsg] = useState("");
  const [lockPrompt, setLockPrompt] = useState<{ id: string; title: string } | null>(null);
  const [linkCode, setLinkCode] = useState("");
  const [error, setError] = useState("");

  const theme = useMemo(() => {
    const defaults = {
      background_color: "#0f172a",
      button_color: "#ffffff",
      button_text_color: "#0f172a",
      button_style: "rounded",
      font_family: "DM Sans",
      text_color: "#f8fafc",
      background_image: null as string | null,
      social_icon_style: "mono" as SocialIconStyle,
      social_icon_color: "#f8fafc",
    };
    return { ...defaults, ...profile.theme_json };
  }, [profile.theme_json]);

  const blocks = useMemo(() => buildLinkBlocks(profile.links), [profile.links]);

  useEffect(() => {
    const href = googleFontsHref(theme.font_family);
    if (!href) return;
    const id = `bitlink-font-${theme.font_family}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, [theme.font_family]);

  useEffect(() => {
    if (profile.redirect_url && !profile.is_locked) {
      window.location.href = profile.redirect_url;
      return;
    }
    if (!profile.is_locked) {
      publicApi.trackView(username, { referrer: document.referrer, visitor_id: visitorId() }).catch(() => {});
    }
  }, [profile.is_locked, profile.redirect_url, username]);

  async function unlockProfile(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await publicApi.unlock(username, password);
      const next = await publicApi.getProfile(username, res.unlock_token || password);
      setProfile(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid password");
    }
  }

  async function onLinkClick(linkId: string, hasLock: boolean, title: string) {
    if (hasLock) {
      setLockPrompt({ id: linkId, title });
      setLinkCode("");
      return;
    }
    try {
      const res = await publicApi.click(username, linkId, {
        referrer: document.referrer,
        visitor_id: visitorId(),
      });
      window.open(res.url, "_blank", "noopener,noreferrer");
    } catch {
      /* ignore */
    }
  }

  async function unlockLink(e: FormEvent) {
    e.preventDefault();
    if (!lockPrompt) return;
    try {
      const res = await publicApi.click(username, lockPrompt.id, {
        referrer: document.referrer,
        visitor_id: visitorId(),
        unlock_code: linkCode,
      });
      setLockPrompt(null);
      window.open(res.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    }
  }

  async function subscribe(e: FormEvent) {
    e.preventDefault();
    const body: { email?: string; phone?: string } = {};
    if (profile.show_email_capture && email.trim()) body.email = email.trim();
    if (profile.show_phone_capture && phone.trim()) body.phone = phone.trim();
    if (!body.email && !body.phone) {
      setSubMsg("Add an email or phone number.");
      return;
    }
    try {
      await publicApi.subscribe(username, body);
      setSubMsg("Thanks for subscribing!");
      setEmail("");
      setPhone("");
    } catch (err) {
      setSubMsg(err instanceof Error ? err.message : "Failed");
    }
  }

  const showLeadForm = profile.show_email_capture || profile.show_phone_capture;

  return (
    <div
      className="relative min-h-screen px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-10"
      style={{
        backgroundColor: theme.background_color,
        backgroundImage: theme.background_image ? `url(${theme.background_image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: theme.text_color,
        fontFamily: fontStack(theme.font_family),
      }}
    >
      {!profile.is_locked && (
        <TrackingPixels
          googleAnalyticsId={profile.google_analytics_id}
          metaPixelId={profile.meta_pixel_id}
        />
      )}

      {!profile.is_locked &&
        profile.background_music_enabled &&
        profile.background_music_video_id && (
          <BackgroundMusicPlayer videoId={profile.background_music_video_id} />
        )}

      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt=""
            className="h-24 w-24 rounded-full object-cover ring-2 ring-white/30"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15 text-3xl font-bold">
            {profile.display_name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <h1 className="mt-4 flex items-center justify-center gap-2 text-center text-2xl font-bold">
          <span>{profile.display_name}</span>
          {profile.is_verified && (
            <span
              title="Verified"
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-white shadow"
              aria-label="Verified"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M20 6 9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </h1>
        {!profile.is_locked && profile.bio && (
          <p className="mt-2 text-center text-sm opacity-80">{profile.bio}</p>
        )}

        {!profile.is_locked && profile.social_links.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            {profile.social_links.map((s) => {
              const brand = detectSocialBrand(s.url) || brandFromPlatform(s.platform);
              const brandHex = brand ? brandColor(brand.id) : theme.text_color;
              const fill = resolveSocialIconColor(theme, brandHex);
              return (
                <a
                  key={`${s.platform}-${s.url}`}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  title={s.platform}
                  className="transition hover:scale-110"
                >
                  <LinkVisual
                    url={s.url}
                    platform={s.platform}
                    size="sm"
                    chrome="plain"
                    iconColor={theme.social_icon_style === "brand" ? "brand" : fill}
                  />
                </a>
              );
            })}
          </div>
        )}

        {profile.is_locked ? (
          <form onSubmit={unlockProfile} className="mt-10 w-full space-y-3">
            <p className="text-center text-sm opacity-80">This page is locked</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border-0 px-4 py-3 text-ink outline-none"
              required
            />
            {error && <p className="text-center text-sm text-red-200">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 text-sm font-semibold"
              style={{
                background: theme.button_color,
                color: theme.button_text_color,
                borderRadius: buttonRadius(theme.button_style),
              }}
            >
              Unlock
            </button>
          </form>
        ) : (
          <div className="mt-8 w-full space-y-4">
            {blocks.map((block) => {
              if (block.kind === "single") {
                return (
                  <ProfileLinkItem
                    key={block.link.id}
                    link={block.link}
                    theme={theme}
                    onClick={onLinkClick}
                  />
                );
              }
              return (
                <div key={`c-${block.name}`} className="space-y-2">
                  <p className="px-1 text-xs font-semibold uppercase tracking-wide opacity-70">
                    {block.name}
                  </p>
                  <div className={block.layout === "grid" ? "grid grid-cols-2 gap-2" : "space-y-2"}>
                    {block.links.map((link) => (
                      <ProfileLinkItem
                        key={link.id}
                        link={link}
                        theme={theme}
                        compact={block.layout === "grid"}
                        onClick={onLinkClick}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {profile.tip_jar_enabled && profile.tip_jar_url && (
              <a
                href={profile.tip_jar_url}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-bold shadow-lg shadow-black/10 transition hover:scale-[1.01]"
                style={{
                  background: theme.button_color,
                  color: theme.button_text_color,
                  borderRadius: buttonRadius(theme.button_style),
                }}
              >
                <span aria-hidden>♡</span>
                {profile.tip_jar_label || "Tip me"}
              </a>
            )}

            {showLeadForm && (
              <form onSubmit={subscribe} className="mt-6 space-y-2">
                <p className="text-center text-xs opacity-70">Get updates</p>
                {profile.show_email_capture && (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full rounded-xl border-0 px-3 py-2.5 text-sm text-ink outline-none"
                    required={!profile.show_phone_capture}
                  />
                )}
                {profile.show_phone_capture && (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+54 9 11 1234 5678"
                    className="w-full rounded-xl border-0 px-3 py-2.5 text-sm text-ink outline-none"
                    required={!profile.show_email_capture}
                  />
                )}
                <button
                  type="submit"
                  className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold"
                  style={{ background: theme.button_color, color: theme.button_text_color }}
                >
                  Join
                </button>
                {subMsg && <p className="text-center text-xs opacity-80">{subMsg}</p>}
              </form>
            )}
          </div>
        )}

        <p className="mt-10 text-center text-xs opacity-55">
          <a href="/" className="hover:opacity-90">
            Made with Bitlink
          </a>
        </p>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <div className="pointer-events-auto mx-auto w-full max-w-md">
          <a
            href="/register"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink shadow-[0_-4px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition hover:scale-[1.01] hover:bg-white"
          >
            <BitlinkLogo mark href={null} height={22} className="shrink-0" />
            Create your Bitlink — free
          </a>
        </div>
      </div>

      {lockPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={unlockLink} className="w-full max-w-sm space-y-3 rounded-2xl bg-white p-5 text-ink">
            <h3 className="font-display text-lg font-semibold">Unlock “{lockPrompt.title}”</h3>
            <input
              type="password"
              value={linkCode}
              onChange={(e) => setLinkCode(e.target.value)}
              placeholder="Enter code"
              className="w-full rounded-xl border border-ink/10 px-3 py-2"
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setLockPrompt(null)} className="px-3 py-2 text-sm">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">
                Open
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function ProfileLinkItem({
  link,
  theme,
  compact,
  onClick,
}: {
  link: PublicLink;
  theme: {
    button_color: string;
    button_text_color: string;
    button_style: string;
  };
  compact?: boolean;
  onClick: (id: string, hasLock: boolean, title: string) => void;
}) {
  const type = link.link_type || "url";

  if (type === "header") {
    return (
      <p className="px-1 pt-2 text-sm font-bold tracking-wide opacity-90">{link.title}</p>
    );
  }

  if ((type === "youtube" || type === "spotify") && link.embed?.embed_url && !link.has_lock) {
    return (
      <div className="overflow-hidden rounded-2xl shadow-lg shadow-black/10">
        <div className="px-3 py-2 text-center text-sm font-semibold" style={{ background: theme.button_color, color: theme.button_text_color }}>
          {link.title}
        </div>
        {type === "youtube" ? (
          <div className="aspect-video w-full bg-black">
            <iframe
              title={link.title}
              src={link.embed.embed_url}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <iframe
            title={link.title}
            src={link.embed.embed_url}
            className="h-[152px] w-full"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onClick(link.id, link.has_lock, link.title)}
      className={`flex w-full items-center gap-3 text-left font-semibold shadow-lg shadow-black/10 transition hover:scale-[1.01] ${animationClass(link.animation)} ${
        compact
          ? "min-h-[64px] flex-col justify-center px-3 py-3 text-xs"
          : link.is_featured
            ? "min-h-[72px] px-4 py-4 text-base ring-2 ring-white/55"
            : "px-4 py-3 text-sm"
      }`}
      style={{
        background: theme.button_color,
        color: theme.button_text_color,
        borderRadius: buttonRadius(theme.button_style),
      }}
    >
      {!compact && (
        <LinkVisual
          url={link.url}
          icon={link.icon}
          thumbnailUrl={link.thumbnail_url}
          featured={link.is_featured}
          size={link.is_featured ? "lg" : "sm"}
        />
      )}
      <span className={compact ? "text-center" : "flex-1 text-center"}>{link.title}</span>
      {link.has_lock && <span className="text-xs opacity-60">🔒</span>}
    </button>
  );
}
