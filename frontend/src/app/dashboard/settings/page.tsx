"use client";

import { FormEvent, useEffect, useState } from "react";
import { MediaUploadField } from "@/components/MediaUploadField";
import { useToast } from "@/components/Toast";
import { authApi, domainApi, linksApi, profileApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import type { DomainInfo, LinkItem, Profile } from "@/lib/types";
import { VerifiedMark } from "@/components/VerifiedBadge";
import { VERIFICATION_COPY, verificationType, verifiedSince } from "@/lib/verification";

const NAV = [
  { id: "profile", label: "Profile" },
  { id: "page", label: "Page" },
  { id: "domain", label: "Domain" },
  { id: "security", label: "Security" },
  { id: "qr", label: "QR" },
] as const;

export default function SettingsPage() {
  const { success, error: toastError } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [profilePassword, setProfilePassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [domain, setDomain] = useState<DomainInfo | null>(null);
  const [domainInput, setDomainInput] = useState("");
  const [domainBusy, setDomainBusy] = useState(false);
  const [domainMsg, setDomainMsg] = useState("");
  const [saving, setSaving] = useState(false);
  // Name as last saved: renaming a verified profile removes the badge until it is reviewed again.
  const [savedName, setSavedName] = useState({ username: "", display_name: "" });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    Promise.all([profileApi.get(token), linksApi.list(token), domainApi.get(token)]).then(
      ([p, l, d]) => {
        setProfile(p);
        setSavedName({ username: p.username, display_name: p.display_name });
        setLinks(l);
        setDomain(d);
        setDomainInput(d.custom_domain || "");
      },
    );
  }, []);

  const profileLoaded = profile !== null;
  useEffect(() => {
    if (!profileLoaded) return;
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [profileLoaded]);

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
      tip_jar_enabled: profile.tip_jar_enabled,
      tip_jar_url: profile.tip_jar_url,
      tip_jar_label: profile.tip_jar_label || "Tip me",
      google_analytics_id: profile.google_analytics_id,
      meta_pixel_id: profile.meta_pixel_id,
      qr_fg_color: profile.qr_fg_color || "#000000",
      qr_bg_color: profile.qr_bg_color || "#ffffff",
      qr_logo_enabled: profile.qr_logo_enabled,
      background_music_url: profile.background_music_url,
      background_music_enabled: profile.background_music_enabled,
      redirect_link_id: profile.redirect_link_id,
      language: profile.language,
      discoverable: profile.discoverable,
    };
    if (!profile.language) body.clear_language = true;
    if (!profile.redirect_link_id) body.clear_redirect = true;
    if (!profile.background_music_url) body.clear_background_music = true;
    if (!profile.google_analytics_id) body.clear_google_analytics_id = true;
    if (!profile.meta_pixel_id) body.clear_meta_pixel_id = true;
    if (!profile.tip_jar_url) body.clear_tip_jar_url = true;
    if (profilePassword) body.profile_password = profilePassword;
    const renamed =
      profile.username !== savedName.username || profile.display_name !== savedName.display_name;
    if (
      profile.is_verified &&
      renamed &&
      !window.confirm(
        "Changing your username or display name removes your verified badge until the Bitlink team reviews it again. Continue?",
      )
    ) {
      return;
    }
    setSaving(true);
    try {
      const updated = await profileApi.update(token, body);
      setProfile(updated);
      setSavedName({ username: updated.username, display_name: updated.display_name });
      setProfilePassword("");
      success("Profile saved");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
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

  async function saveDomain(e: FormEvent) {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;
    setDomainBusy(true);
    setDomainMsg("");
    try {
      const d = await domainApi.set(token, domainInput.trim());
      setDomain(d);
      setDomainInput(d.custom_domain || "");
      success("Domain saved — add the TXT record, then verify");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to save domain");
    } finally {
      setDomainBusy(false);
    }
  }

  async function verifyDomain() {
    const token = getAccessToken();
    if (!token) return;
    setDomainBusy(true);
    try {
      const d = await domainApi.verify(token);
      setDomain(d);
      setDomainMsg(d.message);
      if (d.verified) success("Domain verified");
      else toastError(d.message);
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setDomainBusy(false);
    }
  }

  async function clearDomain() {
    const token = getAccessToken();
    if (!token) return;
    setDomainBusy(true);
    try {
      const d = await domainApi.clear(token);
      setDomain(d);
      setDomainInput("");
      setDomainMsg("");
      success("Custom domain removed");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to remove domain");
    } finally {
      setDomainBusy(false);
    }
  }

  if (!profile) return <p className="text-sm text-meetup-muted">Loading…</p>;

  const qrSrc = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1/me/qr`;

  return (
    <div className="mx-auto max-w-2xl space-y-2">
      <div className="pb-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Settings</h1>
        <p className="mt-1 text-sm text-meetup-muted">Profile, public page, domain, and security.</p>
      </div>

      <nav
        className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-0 md:px-0"
        aria-label="Settings sections"
      >
        {NAV.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="mu-chip min-h-[40px] shrink-0"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <form id="profile" onSubmit={saveProfile} className="scroll-mt-24">
        <section className="mu-dash-block">
          <header>
            <h2 className="mu-dash-h2">Profile</h2>
            <p className="mu-dash-lead">How you appear at the top of your page.</p>
          </header>
          <div className="space-y-4">
            {profile.is_verified && (
              <div className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-white/70 p-3 text-sm">
                <VerifiedMark type={profile.verification_type} lang="en" size={20} />
                <div>
                  <p className="font-semibold">
                    Verified · {VERIFICATION_COPY.en.types[verificationType(profile.verification_type)]}
                    {profile.verified_at && (
                      <span className="font-normal text-ink/55">
                        {" "}
                        since {verifiedSince(profile.verified_at, "en")}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-ink/60">
                    Your badge shows on your page, your share previews, your QR codes and on your
                    short links (add a + to see it). Changing your username or display name
                    removes it until we review it again.
                  </p>
                </div>
              </div>
            )}
            <MediaUploadField
              label="Avatar"
              value={profile.avatar_url}
              onChange={(url) => setProfile({ ...profile, avatar_url: url })}
              hint="Square photo works best."
            />
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
              <span className="mb-1.5 block font-medium">Bio</span>
              <textarea
                className="mu-input"
                rows={3}
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </label>
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
          </div>
        </section>

        <section id="page" className="mu-dash-block scroll-mt-24">
          <header>
            <h2 className="mu-dash-h2">Public page</h2>
            <p className="mu-dash-lead">Language, captures, tips, music, and tracking.</p>
          </header>

          <div className="divide-y divide-meetup-border border-y border-meetup-border">
            <ToggleRow
              title="Email capture"
              hint="Collect emails on your public page."
              checked={profile.show_email_capture}
              onChange={(v) => setProfile({ ...profile, show_email_capture: v })}
            />
            <ToggleRow
              title="Phone capture"
              hint="Collect phone numbers on your public page."
              checked={profile.show_phone_capture}
              onChange={(v) => setProfile({ ...profile, show_phone_capture: v })}
            />
            <ToggleRow
              title="List in Bitlink directory"
              hint="Adds your page to the sitemap and discovery. Locked pages are never listed."
              checked={profile.discoverable}
              onChange={(v) => setProfile({ ...profile, discoverable: v })}
            />
          </div>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Page language</span>
            <select
              className="mu-input"
              value={profile.language || ""}
              onChange={(e) =>
                setProfile({ ...profile, language: (e.target.value || null) as Profile["language"] })
              }
            >
              <option value="">Automatic (visitor&apos;s language)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="pt">Português</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Redirect entire page to link</span>
            <select
              className="mu-input"
              value={profile.redirect_link_id || ""}
              onChange={(e) => setProfile({ ...profile, redirect_link_id: e.target.value || null })}
            >
              <option value="">No redirect</option>
              {links.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-ink">Tip jar</h3>
            <p className="text-xs text-meetup-muted -mt-2">
              Mercado Pago, Cafecito, PayPal, or any tip link.
            </p>
            <ToggleRow
              title="Show tip jar"
              checked={profile.tip_jar_enabled}
              onChange={(v) => setProfile({ ...profile, tip_jar_enabled: v })}
            />
            <Field
              label="Button label"
              value={profile.tip_jar_label || "Tip me"}
              onChange={(v) => setProfile({ ...profile, tip_jar_label: v || "Tip me" })}
            />
            <Field
              label="Tip URL"
              value={profile.tip_jar_url || ""}
              onChange={(v) => setProfile({ ...profile, tip_jar_url: v || null })}
            />
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-ink">Background music</h3>
            <p className="text-xs text-meetup-muted -mt-2">Paste a YouTube link. Visitors can pause or mute.</p>
            <input
              className="mu-input"
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
            <ToggleRow
              title="Enable on public page"
              checked={profile.background_music_enabled}
              disabled={!profile.background_music_url}
              onChange={(v) => setProfile({ ...profile, background_music_enabled: v })}
            />
            {profile.background_music_video_id && (
              <p className="text-[11px] text-ink/40">
                Detected video id: <code>{profile.background_music_video_id}</code>
              </p>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold text-ink">Tracking</h3>
            <Field
              label="Google Analytics ID"
              value={profile.google_analytics_id || ""}
              onChange={(v) => setProfile({ ...profile, google_analytics_id: v || null })}
              placeholder="G-XXXXXXXX"
            />
            <Field
              label="Meta Pixel ID"
              value={profile.meta_pixel_id || ""}
              onChange={(v) => setProfile({ ...profile, meta_pixel_id: v || null })}
              placeholder="123456789012345"
            />
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold text-ink">
              Profile lock{" "}
              <span className="font-normal text-meetup-muted">
                {profile.has_profile_lock ? "· active" : "· off"}
              </span>
            </h3>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="password"
                placeholder="Set password"
                value={profilePassword}
                onChange={(e) => setProfilePassword(e.target.value)}
                className="mu-input flex-1"
              />
              {profile.has_profile_lock && (
                <button type="button" onClick={clearLock} className="mu-btn-ghost shrink-0">
                  Clear lock
                </button>
              )}
            </div>
          </div>
        </section>

        <section id="qr" className="mu-dash-block scroll-mt-24">
          <header>
            <h2 className="mu-dash-h2">Profile QR</h2>
            <p className="mu-dash-lead">Customize colors and download PNG or SVG. Save settings to apply style.</p>
          </header>
          <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrSrc}
              alt="QR code"
              className="mx-auto h-44 w-44 shrink-0 rounded-2xl bg-white p-3 ring-1 ring-meetup-border sm:mx-0"
            />
            <div className="min-w-0 flex-1 space-y-4">
              <label className="mu-toggle-row text-sm">
                <span className="font-medium">Foreground</span>
                <input
                  type="color"
                  value={profile.qr_fg_color || "#000000"}
                  onChange={(e) => setProfile({ ...profile, qr_fg_color: e.target.value })}
                />
              </label>
              <label className="mu-toggle-row text-sm">
                <span className="font-medium">Background</span>
                <input
                  type="color"
                  value={profile.qr_bg_color || "#ffffff"}
                  onChange={(e) => setProfile({ ...profile, qr_bg_color: e.target.value })}
                />
              </label>
              <ToggleRow
                title="Center avatar as logo"
                checked={profile.qr_logo_enabled}
                onChange={(v) => setProfile({ ...profile, qr_logo_enabled: v })}
              />
              <div className="flex flex-wrap gap-2">
                <QrDownloadButton format="png" label="Download PNG" />
                <QrDownloadButton format="svg" label="Download SVG" />
              </div>
            </div>
          </div>
          <QrLoader
            refreshKey={`${profile.qr_fg_color}-${profile.qr_bg_color}-${profile.qr_logo_enabled}-${profile.updated_at}`}
          />
        </section>

        <div className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 -mx-4 border-t border-meetup-border bg-meetup-bg/95 px-4 py-3 backdrop-blur md:bottom-0 md:mx-0 md:rounded-b-none md:px-0">
          <button type="submit" disabled={saving} className="mu-btn-primary w-full sm:w-auto">
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>

      <section id="domain" className="mu-dash-block scroll-mt-24 pt-4">
        <header>
          <h2 className="mu-dash-h2">Custom domain</h2>
          <p className="mu-dash-lead">
            Serve your profile on links.yourbrand.com. Add a TXT record to verify, then CNAME to{" "}
            <code className="rounded bg-white px-1.5 py-0.5 text-xs">
              {domain?.cname_target || "your Bitlink web host"}
            </code>
            .
          </p>
        </header>
        <form onSubmit={saveDomain} className="space-y-4">
          <Field label="Domain" value={domainInput} onChange={setDomainInput} placeholder="links.yourbrand.com" />
          {domain?.custom_domain && domain.custom_domain_verify_token && (
            <div className="space-y-2 text-sm">
              <p>
                Status:{" "}
                <span
                  className={
                    domain.custom_domain_verified ? "font-semibold text-emerald-700" : "font-semibold text-ink"
                  }
                >
                  {domain.custom_domain_verified ? "Verified" : "Pending verification"}
                </span>
              </p>
              <p className="text-xs text-meetup-muted">Add a TXT record with this value:</p>
              <code className="block break-all rounded-xl bg-white px-3 py-2 text-xs text-ink ring-1 ring-meetup-border">
                {domain.custom_domain_verify_token}
              </code>
              <ul className="list-disc pl-4 text-xs text-meetup-muted">
                {(domain.txt_hostnames || []).map((h) => (
                  <li key={h}>
                    <code>{h}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {domainMsg && <p className="text-xs text-meetup-muted">{domainMsg}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={domainBusy} className="mu-btn-primary disabled:opacity-60">
              Save domain
            </button>
            <button
              type="button"
              disabled={domainBusy || !domain?.custom_domain}
              onClick={verifyDomain}
              className="mu-btn-ghost disabled:opacity-60"
            >
              Verify DNS
            </button>
            <button
              type="button"
              disabled={domainBusy || !domain?.custom_domain}
              onClick={clearDomain}
              className="mu-btn-ghost text-red-600 disabled:opacity-60"
            >
              Remove
            </button>
          </div>
        </form>
      </section>

      <section id="security" className="mu-dash-block scroll-mt-24">
        <header>
          <h2 className="mu-dash-h2">Account password</h2>
          <p className="mu-dash-lead">Change the password you use to sign in.</p>
        </header>
        <form onSubmit={changePassword} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Current password</span>
            <input
              type="password"
              required
              className="mu-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">New password</span>
            <input
              type="password"
              required
              minLength={8}
              className="mu-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <button type="submit" disabled={changingPassword} className="mu-btn-primary disabled:opacity-60">
            {changingPassword ? "Updating…" : "Update password"}
          </button>
        </form>
      </section>
    </div>
  );
}

function ToggleRow({
  title,
  hint,
  checked,
  onChange,
  disabled,
}: {
  title: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`mu-toggle-row text-sm ${disabled ? "opacity-50" : ""}`}>
      <span className="min-w-0">
        <span className="block font-medium text-ink">{title}</span>
        {hint && <span className="mt-0.5 block text-xs text-meetup-muted">{hint}</span>}
      </span>
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 shrink-0 accent-meetup-purple"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
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
    <button type="button" onClick={download} disabled={busy} className="mu-btn-ghost disabled:opacity-60">
      {busy ? "…" : label}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      <input
        className="mu-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
