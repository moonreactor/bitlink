"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BackgroundMusicPlayer } from "@/components/BackgroundMusicPlayer";
import { LinkVisual } from "@/components/LinkVisual";
import { publicApi } from "@/lib/api";
import { animationClass } from "@/lib/linkAnimations";
import { buttonRadius } from "@/lib/themes";
import type { PublicProfile } from "@/lib/types";

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
      text_color: "#f8fafc",
      background_image: null as string | null,
    };
    return { ...defaults, ...profile.theme_json };
  }, [profile.theme_json]);

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
    try {
      await publicApi.subscribe(username, email);
      setSubMsg("Thanks for subscribing!");
      setEmail("");
    } catch (err) {
      setSubMsg(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{
        backgroundColor: theme.background_color,
        backgroundImage: theme.background_image ? `url(${theme.background_image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: theme.text_color,
      }}
    >
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
        <h1 className="mt-4 text-center font-display text-2xl font-bold">{profile.display_name}</h1>
        {!profile.is_locked && profile.bio && (
          <p className="mt-2 text-center text-sm opacity-80">{profile.bio}</p>
        )}

        {!profile.is_locked && profile.social_links.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {profile.social_links.map((s) => (
              <a
                key={`${s.platform}-${s.url}`}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold capitalize backdrop-blur hover:bg-white/25"
              >
                {s.platform}
              </a>
            ))}
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
          <div className="mt-8 w-full space-y-3">
            {profile.links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => onLinkClick(link.id, link.has_lock, link.title)}
                className={`flex w-full items-center gap-3 text-left font-semibold shadow-lg shadow-black/10 transition hover:scale-[1.01] ${animationClass(link.animation)} ${
                  link.is_featured
                    ? "min-h-[72px] px-4 py-4 text-base ring-2 ring-white/55"
                    : "px-4 py-3 text-sm"
                }`}
                style={{
                  background: theme.button_color,
                  color: theme.button_text_color,
                  borderRadius: buttonRadius(theme.button_style),
                }}
              >
                <LinkVisual
                  icon={link.icon}
                  thumbnailUrl={link.thumbnail_url}
                  featured={link.is_featured}
                  size={link.is_featured ? "lg" : "sm"}
                />
                <span className="flex-1 text-center">{link.title}</span>
                {link.has_lock && <span className="text-xs opacity-60">🔒</span>}
              </button>
            ))}

            {profile.show_email_capture && (
              <form onSubmit={subscribe} className="mt-6 space-y-2">
                <p className="text-center text-xs opacity-70">Get updates</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="flex-1 rounded-xl border-0 px-3 py-2.5 text-sm text-ink outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl px-4 text-sm font-semibold"
                    style={{ background: theme.button_color, color: theme.button_text_color }}
                  >
                    Join
                  </button>
                </div>
                {subMsg && <p className="text-center text-xs opacity-80">{subMsg}</p>}
              </form>
            )}
          </div>
        )}

        {!profile.remove_branding && (
          <a href="/" className="mt-12 text-xs opacity-50 hover:opacity-80">
            Made with Bitlink
          </a>
        )}
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
