"use client";

import { FormEvent, useEffect, useState } from "react";
import { MediaUploadField } from "@/components/MediaUploadField";
import { useToast } from "@/components/Toast";
import { authApi, linksApi, profileApi, socialApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { LinkItem, Profile, SocialLink } from "@/lib/types";

const PLATFORMS = ["instagram", "twitter", "tiktok", "youtube", "linkedin", "github", "website"];

export default function SettingsPage() {
  const { success, error: toastError } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [profilePassword, setProfilePassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

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
      show_email_capture: profile.show_email_capture,
      show_phone_capture: profile.show_phone_capture,
      google_analytics_id: profile.google_analytics_id,
      meta_pixel_id: profile.meta_pixel_id,
      qr_fg_color: profile.qr_fg_color || "#000000",
      qr_bg_color: profile.qr_bg_color || "#ffffff",
      qr_logo_enabled: profile.qr_logo_enabled,
      background_music_url: profile.background_music_url,
      background_music_enabled: profile.background_music_enabled,
      redirect_link_id: profile.redirect_link_id,
    };
    if (!profile.redirect_link_id) body.clear_redirect = true;
    if (!profile.background_music_url) body.clear_background_music = true;
    if (!profile.google_analytics_id) body.clear_google_analytics_id = true;
    if (!profile.meta_pixel_id) body.clear_meta_pixel_id = true;
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

  async function changePassword(e: FormEvent) {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    setChangingPassword(true);
    try {
      await authApi.changePassword(token, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      success("Password updated");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  }

  if (!profile) return <p className="text-sm text-meetup-muted">Loading…</p>;

  const qrSrc = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/me/qr`;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Settings</h1>
        <p className="mt-1 text-sm text-meetup-muted">Profile, SEO, music, locks, QR.</p>
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
        <MediaUploadField
          label="Avatar"
          value={profile.avatar_url}
          onChange={(url) => setProfile({ ...profile, avatar_url: url })}
          hint="Upload a square photo or paste an image URL."
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
            checked={profile.show_email_capture}
            onChange={(e) => setProfile({ ...profile, show_email_capture: e.target.checked })}
          />
          Show email capture on public page
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={profile.show_phone_capture}
            onChange={(e) => setProfile({ ...profile, show_phone_capture: e.target.checked })}
          />
          Show phone capture on public page
        </label>
        <p className="text-xs text-meetup-muted">
          The “Create your Bitlink” CTA always appears on your public page and can’t be turned off.
        </p>

        <div className="space-y-3 rounded-xl border border-meetup-border p-3">
          <p className="text-sm font-medium">Tracking pixels</p>
          <Field
            label="Google Analytics ID"
            value={profile.google_analytics_id || ""}
            onChange={(v) => setProfile({ ...profile, google_analytics_id: v || null })}
          />
          <Field
            label="Meta Pixel ID"
            value={profile.meta_pixel_id || ""}
            onChange={(v) => setProfile({ ...profile, meta_pixel_id: v || null })}
          />
          <p className="text-xs text-meetup-muted">Example: G-XXXXXXXX / 123456789012345</p>
        </div>

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

      <form onSubmit={changePassword} className="space-y-3 mu-card p-5 md:p-6">
        <h2 className="font-display text-lg font-semibold">Change password</h2>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Current password</span>
          <input
            type="password"
            required
            className="w-full rounded-xl border border-meetup-border px-3 py-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">New password</span>
          <input
            type="password"
            required
            minLength={8}
            className="w-full rounded-xl border border-meetup-border px-3 py-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button type="submit" disabled={changingPassword} className="mu-btn-primary disabled:opacity-60">
          {changingPassword ? "Updating…" : "Update password"}
        </button>
      </form>

      <section className="mu-card space-y-4 p-5 md:p-6">
        <div>
          <h2 className="font-display text-lg font-semibold">QR code</h2>
          <p className="mt-1 text-sm text-meetup-muted">Customize colors and download PNG or SVG.</p>
        </div>
        <div className="flex flex-wrap items-start gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrSrc}
            alt="QR code"
            className="h-48 w-48 rounded-xl border border-meetup-border bg-white p-2"
          />
          <div className="min-w-0 flex-1 space-y-3">
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>Foreground</span>
              <input
                type="color"
                value={profile.qr_fg_color || "#000000"}
                onChange={(e) => setProfile({ ...profile, qr_fg_color: e.target.value })}
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-sm">
              <span>Background</span>
              <input
                type="color"
                value={profile.qr_bg_color || "#ffffff"}
                onChange={(e) => setProfile({ ...profile, qr_bg_color: e.target.value })}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={profile.qr_logo_enabled}
                onChange={(e) => setProfile({ ...profile, qr_logo_enabled: e.target.checked })}
              />
              Center avatar as logo
            </label>
            <p className="text-xs text-meetup-muted">Save settings to apply QR style, then download.</p>
            <div className="flex flex-wrap gap-2">
              <QrDownloadButton format="png" label="Download PNG" />
              <QrDownloadButton format="svg" label="Download SVG" />
            </div>
          </div>
        </div>
        <QrLoader refreshKey={`${profile.qr_fg_color}-${profile.qr_bg_color}-${profile.qr_logo_enabled}-${profile.updated_at}`} />
      </section>
    </div>
  );
}

function QrLoader({ refreshKey }: { refreshKey: string }) {
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
  }, [refreshKey]);
  return null;
}

function QrDownloadButton({ format, label }: { format: "png" | "svg"; label: string }) {
  const [busy, setBusy] = useState(false);
  async function download() {
    const token = getAccessToken();
    if (!token) return;
    setBusy(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/me/qr?fmt=${format}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bitlink-qr.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }
  return (
    <button type="button" onClick={download} disabled={busy} className="mu-btn-secondary disabled:opacity-60">
      {busy ? "…" : label}
    </button>
  );
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
