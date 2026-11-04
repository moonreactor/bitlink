"use client";

import { FormEvent, useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { linksApi, profileApi, socialApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { LinkItem, Profile, SocialLink } from "@/lib/types";

const PLATFORMS = ["instagram", "twitter", "tiktok", "youtube", "linkedin", "github", "website"];

export default function SettingsPage() {
  const { success, error: toastError } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [profilePassword, setProfilePassword] = useState("");

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    Promise.all([profileApi.get(token), linksApi.list(token), socialApi.list(token)]).then(
      ([p, l, s]) => {
        setProfile(p);
        setLinks(l);
        setSocials(
          s.length
            ? s
            : PLATFORMS.slice(0, 3).map((platform, position) => ({ platform, url: "", position })),
        );
      },
    );
  }, []);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    const token = getAccessToken();
    if (!token) return;
    const body: Record<string, unknown> = {
      username: profile.username,
      display_name: profile.display_name,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      seo_title: profile.seo_title,
      seo_description: profile.seo_description,
      remove_branding: profile.remove_branding,
      show_email_capture: profile.show_email_capture,
      background_music_url: profile.background_music_url,
      background_music_enabled: profile.background_music_enabled,
      redirect_link_id: profile.redirect_link_id,
    };
    if (!profile.redirect_link_id) body.clear_redirect = true;
    if (!profile.background_music_url) body.clear_background_music = true;
    if (profilePassword) body.profile_password = profilePassword;
    try {
      const updated = await profileApi.update(token, body);
      setProfile(updated);
      setProfilePassword("");
      success("Profile saved");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to save profile");
    }
  }

  async function clearLock() {
    const token = getAccessToken();
    if (!token) return;
    try {
      const updated = await profileApi.update(token, { clear_profile_password: true });
      setProfile(updated);
      success("Profile lock removed");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to remove lock");
    }
  }

  async function saveSocials(e: FormEvent) {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    const items = socials
      .filter((s) => s.url.trim())
      .map((s, i) => ({ platform: s.platform, url: s.url, position: i }));
    try {
      const saved = await socialApi.replace(token, items);
      setSocials(saved);
      success("Social links saved");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to save socials");
    }
  }

  if (!profile) return <p className="text-sm text-meetup-muted">Loading…</p>;

  const qrSrc = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/me/qr`;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Settings</h1>
        <p className="mt-1 text-sm text-meetup-muted">Profile, SEO, music, locks, branding, QR.</p>
      </div>

      <form onSubmit={saveProfile} className="space-y-4 mu-card p-5 md:p-6">
        <h2 className="font-display text-lg font-semibold">Profile</h2>
        <Field
          label="Username"
          value={profile.username}
          onChange={(v) => setProfile({ ...profile, username: v })}
        />
        <Field
          label="Display name"
          value={profile.display_name}
          onChange={(v) => setProfile({ ...profile, display_name: v })}
        />
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Bio</span>
          <textarea
            className="w-full rounded-xl border border-meetup-border px-3 py-2"
            rows={3}
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </label>
        <Field
          label="Avatar URL"
          value={profile.avatar_url || ""}
          onChange={(v) => setProfile({ ...profile, avatar_url: v || null })}
        />
        <Field
          label="SEO title"
          value={profile.seo_title || ""}
          onChange={(v) => setProfile({ ...profile, seo_title: v || null })}
        />
        <Field
          label="SEO description"
          value={profile.seo_description || ""}
          onChange={(v) => setProfile({ ...profile, seo_description: v || null })}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={profile.remove_branding}
            onChange={(e) => setProfile({ ...profile, remove_branding: e.target.checked })}
          />
          Remove Bitlink branding
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={profile.show_email_capture}
            onChange={(e) => setProfile({ ...profile, show_email_capture: e.target.checked })}
          />
          Show email capture on public page
        </label>

        <div className="space-y-3 rounded-xl border border-meetup-border p-3">
          <p className="text-sm font-medium">Background music (YouTube)</p>
          <p className="text-xs text-meetup-muted">
            Paste a YouTube link. Visitors can pause or mute from your public page.
          </p>
          <input
            className="w-full rounded-xl border border-meetup-border px-3 py-2 text-sm"
            placeholder="https://www.youtube.com/watch?v=…"
            value={profile.background_music_url || ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                background_music_url: e.target.value || null,
                background_music_enabled: e.target.value.trim()
                  ? profile.background_music_enabled
                  : false,
              })
            }
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={profile.background_music_enabled}
              disabled={!profile.background_music_url}
              onChange={(e) =>
                setProfile({ ...profile, background_music_enabled: e.target.checked })
              }
            />
            Enable background music on public page
          </label>
          {profile.background_music_video_id && (
            <p className="text-[11px] text-ink/40">
              Detected video id: <code>{profile.background_music_video_id}</code>
            </p>
          )}
        </div>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Redirect entire page to link</span>
          <select
            className="w-full rounded-xl border border-meetup-border px-3 py-2"
            value={profile.redirect_link_id || ""}
            onChange={(e) =>
              setProfile({ ...profile, redirect_link_id: e.target.value || null })
            }
          >
            <option value="">No redirect</option>
            {links.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-xl border border-meetup-border p-3">
          <p className="text-sm font-medium">
            Profile lock {profile.has_profile_lock ? "(active)" : "(off)"}
          </p>
          <div className="mt-2 flex gap-2">
            <input
              type="password"
              placeholder="Set password"
              value={profilePassword}
              onChange={(e) => setProfilePassword(e.target.value)}
              className="flex-1 rounded-xl border border-meetup-border px-3 py-2 text-sm"
            />
            {profile.has_profile_lock && (
              <button type="button" onClick={clearLock} className="mu-btn-ghost px-3 text-sm">
                Clear
              </button>
            )}
          </div>
        </div>

        <button type="submit" className="mu-btn-primary">
          Save settings
        </button>
      </form>

      <form onSubmit={saveSocials} className="space-y-3 mu-card p-5 md:p-6">
        <h2 className="font-display text-lg font-semibold">Social icons</h2>
        {socials.map((s, idx) => (
          <div key={idx} className="grid grid-cols-[140px_1fr] gap-2">
            <select
              className="rounded-xl border border-meetup-border px-2 py-2 text-sm"
              value={s.platform}
              onChange={(e) => {
                const next = [...socials];
                next[idx] = { ...s, platform: e.target.value };
                setSocials(next);
              }}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              className="rounded-xl border border-meetup-border px-3 py-2 text-sm"
              placeholder="https://…"
              value={s.url}
              onChange={(e) => {
                const next = [...socials];
                next[idx] = { ...s, url: e.target.value };
                setSocials(next);
              }}
            />
          </div>
        ))}
        <button
          type="button"
          className="text-sm font-semibold text-meetup-purple"
          onClick={() => setSocials([...socials, { platform: "instagram", url: "", position: socials.length }])}
        >
          + Add social
        </button>
        <div>
          <button type="submit" className="mu-btn-primary">
            Save socials
          </button>
        </div>
      </form>

      <section className="mu-card p-5 md:p-6">
        <h2 className="font-display text-lg font-semibold">QR code</h2>
        <p className="mt-1 text-sm text-meetup-muted">Points to your public Bitlink page.</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrSrc}
          alt="QR code"
          className="mt-4 h-48 w-48 rounded-xl border border-meetup-border bg-white p-2"
          onError={(e) => {
            const token = getAccessToken();
            if (!token) return;
            fetch(qrSrc, { headers: { Authorization: `Bearer ${token}` } })
              .then((r) => r.blob())
              .then((blob) => {
                (e.target as HTMLImageElement).src = URL.createObjectURL(blob);
              });
          }}
        />
        <QrLoader />
      </section>
    </div>
  );
}

function QrLoader() {
  // Ensure QR loads with auth header by replacing img via effect
  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    const img = document.querySelector<HTMLImageElement>('img[alt="QR code"]');
    if (!img) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/me/qr`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.blob())
      .then((blob) => {
        img.src = URL.createObjectURL(blob);
      });
  }, []);
  return null;
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        className="w-full rounded-xl border border-meetup-border px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
