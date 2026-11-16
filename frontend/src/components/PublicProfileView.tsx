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
import { PROFILE_COPY, type ProfileCopy } from "@/lib/i18n/profile-copy";
import { LANG_LABEL } from "@/lib/i18n/site";
import { useSiteLang } from "@/lib/i18n/useSiteLang";
import { sharePage } from "@/lib/share";
import { ReportDialog } from "@/components/ReportDialog";
import { REPORT_COPY } from "@/lib/i18n/report-copy";
import type { PublicDirectoryItem, PublicLink, PublicProfile, SocialIconStyle } from "@/lib/types";

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
  related = [],
}: {
  initial: PublicProfile;
  username: string;
  related?: PublicDirectoryItem[];
}) {
  const siteLang = useSiteLang();
  const lang = profileLang(initial.language, siteLang);
  const t = PROFILE_COPY[lang];
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
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

  useEffect(() => {
    if (initial.language) document.documentElement.lang = LANG_LABEL[initial.language].html;
  }, [initial.language]);

  useEffect(() => {
    if (!subscribeOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSubscribeOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [subscribeOpen]);

  const blocks = useMemo(() => buildLinkBlocks(profile.links, profile.sections), [profile.links, profile.sections]);

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
      setError(t.invalidPassword);
    }
  }

  /** Locked links still ask for a code before revealing their URL. */
  function onLockedClick(linkId: string, title: string) {
    setLockPrompt({ id: linkId, title });
    setLinkCode("");
  }

  /** Regular links are real anchors; the click is only counted, never awaited. */
  function onLinkClick(linkId: string) {
    publicApi
      .click(username, linkId, { referrer: document.referrer, visitor_id: visitorId() })
      .catch(() => {});
  }

  async function onShare() {
    const result = await sharePage(username, profile.display_name);
    if (result === "copied") {
      setShareMsg(t.copied);
      window.setTimeout(() => setShareMsg(""), 2200);
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
      setError(t.invalidCode);
    }
  }

  async function subscribe(e: FormEvent) {
    e.preventDefault();
    const body: { email?: string; phone?: string } = {};
    if (profile.show_email_capture && email.trim()) body.email = email.trim();
    if (profile.show_phone_capture && phone.trim()) body.phone = phone.trim();
    if (!body.email && !body.phone) {
      setSubMsg(t.addEmailOrPhone);
      return;
    }
    try {
      await publicApi.subscribe(username, body);
      setSubMsg(t.thanks);
      setEmail("");
      setPhone("");
    } catch (err) {
      setSubMsg(err instanceof Error && err.message ? err.message : t.failed);
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
        <div className="mb-4 flex w-full items-center justify-end gap-2">
          {shareMsg && (
            <span role="status" className="text-xs opacity-80">
              {shareMsg}
            </span>
          )}
          {!profile.is_locked && showLeadForm && (
            <button
              type="button"
              onClick={() => setSubscribeOpen(true)}
              className="rounded-full bg-white/15 px-3.5 py-2 text-xs font-semibold backdrop-blur transition hover:bg-white/25"
            >
              {t.subscribe}
            </button>
          )}
          <button
            type="button"
            onClick={onShare}
            aria-label={t.share}
            title={t.share}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white/25"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 15V3m0 0L8 7m4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={t.avatarAlt(profile.display_name)}
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
              title={t.verified}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-white shadow"
              aria-label={t.verified}
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
                  rel="noopener noreferrer"
                  title={s.platform}
                  aria-label={`${profile.display_name} — ${s.platform}`}
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
            <p className="text-center text-sm opacity-80">{t.locked}</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.password}
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
              {t.unlock}
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
                    t={t}
                    onClick={onLinkClick}
                    onLockedClick={onLockedClick}
                  />
                );
              }
              return (
                <section key={`s-${block.id}`} aria-label={block.title} className="space-y-2">
                  <h2 className="px-1 text-xs font-semibold uppercase tracking-wide opacity-70">
                    {block.title}
                  </h2>
                  <div className={block.layout === "grid" ? "grid grid-cols-2 gap-2" : "space-y-2"}>
                    {block.links.map((link) => (
                      <ProfileLinkItem
                        key={link.id}
                        link={link}
                        theme={theme}
                        compact={block.layout === "grid"}
                        t={t}
                        onClick={onLinkClick}
                        onLockedClick={onLockedClick}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {(profile.products || []).length > 0 && (
              <div className="space-y-3">
                {(profile.products || []).map((product) => (
                  <a
                    key={product.id}
                    href={product.checkout_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-3 overflow-hidden px-3 py-3 text-left shadow-lg shadow-black/10 transition hover:scale-[1.01]"
                    style={{
                      background: theme.button_color,
                      color: theme.button_text_color,
                      borderRadius: buttonRadius(theme.button_style),
                    }}
                  >
                    {product.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.thumbnail_url}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      />
                    ) : null}
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold leading-tight">{product.title}</span>
                      {product.description ? (
                        <span className="mt-0.5 block text-xs opacity-80 line-clamp-2">
                          {product.description}
                        </span>
                      ) : null}
                    </span>
                    {product.price_label ? (
                      <span className="shrink-0 rounded-full bg-black/10 px-2.5 py-1 text-xs font-semibold">
                        {product.price_label}
                      </span>
                    ) : null}
                  </a>
                ))}
              </div>
            )}

            {profile.tip_jar_enabled && profile.tip_jar_url && (
              <a
                href={profile.tip_jar_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-bold shadow-lg shadow-black/10 transition hover:scale-[1.01]"
                style={{
                  background: theme.button_color,
                  color: theme.button_text_color,
                  borderRadius: buttonRadius(theme.button_style),
                }}
              >
                <span aria-hidden>♡</span>
                {profile.tip_jar_label && profile.tip_jar_label !== "Tip me" ? profile.tip_jar_label : t.tipDefault}
              </a>
            )}

          </div>
        )}

        {!profile.is_locked && (
          <AboutAccount profile={profile} t={t} lang={lang} />
        )}

        {related.length > 0 && !profile.is_locked && (
          <nav aria-label={t.discoverTitle} className="mt-8 w-full">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide opacity-70">
              {t.discoverTitle}
            </p>
            <ul className="grid grid-cols-2 gap-2">
              {related.map((p) => (
                <li key={p.username}>
                  <a
                    href={`/${p.username}`}
                    className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 transition hover:bg-white/20"
                  >
                    {p.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.avatar_url}
                        alt=""
                        loading="lazy"
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                        {p.display_name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <span className="min-w-0 truncate text-xs font-semibold">{p.display_name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <p className="mt-10 text-center text-xs opacity-55">
          <a href="/" className="hover:opacity-90">
            {t.madeWith}
          </a>
          <span aria-hidden> · </span>
          <button type="button" onClick={() => setReportOpen(true)} className="hover:opacity-90">
            {REPORT_COPY[lang].action}
          </button>
        </p>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <div className="pointer-events-auto mx-auto w-full max-w-md">
          <a
            href={`/register?ref=${encodeURIComponent(username)}`}
            onClick={() => {
              try {
                localStorage.setItem("bitlink_ref", username);
              } catch {
                /* ignore */
              }
              publicApi
                .trackCtaClick(username, {
                  referrer: typeof document !== "undefined" ? document.referrer : undefined,
                  visitor_id: visitorId(),
                })
                .catch(() => {});
            }}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink shadow-[0_-4px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition hover:scale-[1.01] hover:bg-white"
          >
            <BitlinkLogo mark href={null} height={22} className="shrink-0" />
            {t.createCta}
          </a>
        </div>
      </div>

      {reportOpen && (
        <ReportDialog
          lang={lang}
          username={username}
          links={profile.links
            .filter((l) => l.link_type !== "header" && l.url)
            .map((l) => ({ id: l.id, title: l.title }))}
          onClose={() => setReportOpen(false)}
        />
      )}

      {subscribeOpen && showLeadForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && setSubscribeOpen(false)}
        >
          <form
            onSubmit={subscribe}
            role="dialog"
            aria-modal="true"
            aria-label={t.getUpdates}
            className="w-full max-w-sm space-y-3 rounded-2xl bg-white p-5 text-ink"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">{t.getUpdates}</h2>
              <button
                type="button"
                onClick={() => setSubscribeOpen(false)}
                aria-label={t.close}
                className="px-2 text-xl leading-none"
              >
                ×
              </button>
            </div>
            {profile.show_email_capture && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full rounded-xl border border-ink/10 px-3 py-2.5 text-sm"
                required={!profile.show_phone_capture}
                autoFocus
              />
            )}
            {profile.show_phone_capture && (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full rounded-xl border border-ink/10 px-3 py-2.5 text-sm"
                required={!profile.show_email_capture}
              />
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white"
            >
              {t.join}
            </button>
            {subMsg && <p role="status" className="text-center text-xs opacity-80">{subMsg}</p>}
          </form>
        </div>
      )}

      {lockPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={unlockLink} className="w-full max-w-sm space-y-3 rounded-2xl bg-white p-5 text-ink">
            <h3 className="font-display text-lg font-semibold">{t.unlockLink(lockPrompt.title)}</h3>
            <input
              type="password"
              value={linkCode}
              onChange={(e) => setLinkCode(e.target.value)}
              placeholder={t.enterCode}
              className="w-full rounded-xl border border-ink/10 px-3 py-2"
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setLockPrompt(null)} className="px-3 py-2 text-sm">
                {t.cancel}
              </button>
              <button type="submit" className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white">
                {t.open}
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
  t,
  onClick,
  onLockedClick,
}: {
  link: PublicLink;
  theme: {
    button_color: string;
    button_text_color: string;
    button_style: string;
  };
  compact?: boolean;
  t: ProfileCopy;
  onClick: (id: string) => void;
  onLockedClick: (id: string, title: string) => void;
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

  const className = `flex w-full items-center gap-3 text-left font-semibold shadow-lg shadow-black/10 transition hover:scale-[1.01] ${animationClass(link.animation)} ${
    compact
      ? "min-h-[64px] flex-col justify-center px-3 py-3 text-xs"
      : link.is_featured
        ? "min-h-[72px] px-4 py-4 text-base ring-2 ring-white/55"
        : "px-4 py-3 text-sm"
  }`;
  const style = {
    background: theme.button_color,
    color: theme.button_text_color,
    borderRadius: buttonRadius(theme.button_style),
  };
  const content = (
    <>
      <LinkVisual
        url={link.url}
        icon={link.icon}
        thumbnailUrl={link.thumbnail_url}
        featured={link.is_featured}
        size={compact ? "md" : link.is_featured ? "lg" : "sm"}
      />
      <span className={compact ? "text-center" : "flex-1 text-center"}>{link.title}</span>
      {link.has_lock && (
        <span className="text-xs opacity-60" role="img" aria-label={t.lockedAria}>
          🔒
        </span>
      )}
    </>
  );

  // Real anchors: crawlable, middle-click / long-press friendly and never popup-blocked.
  if (link.url && !link.has_lock) {
    const external = /^https?:\/\//i.test(link.url);
    return (
      <a
        href={link.url}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={() => onClick(link.id)}
        onAuxClick={() => onClick(link.id)}
        className={className}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onLockedClick(link.id, link.title)}
      className={className}
      style={style}
    >
      {content}
    </button>
  );
}

function profileLang(lang: PublicProfile["language"], fallback: keyof typeof PROFILE_COPY) {
  return lang ?? fallback;
}

function AboutAccount({
  profile,
  t,
  lang,
}: {
  profile: PublicProfile;
  t: ProfileCopy;
  lang: keyof typeof PROFILE_COPY;
}) {
  const links = profile.links.filter((l) => l.link_type !== "header");
  const joined = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString(LANG_LABEL[lang].html, {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;
  if (!joined && !links.length && !profile.social_links.length) return null;
  return (
    <details className="mt-8 w-full rounded-2xl bg-white/10 px-4 py-3 text-xs">
      <summary className="cursor-pointer font-semibold">{t.aboutTitle}</summary>
      <div className="mt-2 space-y-2 opacity-85">
        {joined && <p>{t.aboutText(profile.display_name, joined)}</p>}
        {profile.social_links.length > 0 && (
          <p>
            <span className="font-semibold">{t.aboutSocials}: </span>
            {profile.social_links.map((s) => s.platform).join(", ")}
          </p>
        )}
        {links.length > 0 && (
          <div>
            <p className="font-semibold">{t.aboutLinks}:</p>
            <ul className="list-disc pl-4">
              {links.map((l) => (
                <li key={l.id}>{l.title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}
