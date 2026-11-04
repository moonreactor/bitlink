"use client";

import { useEffect, useState } from "react";
import { LinkVisual } from "@/components/LinkVisual";
import { useToast } from "@/components/Toast";
import { profileApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { THEME_PRESETS, buttonRadius, resolveSocialIconColor } from "@/lib/themes";
import type { Profile, SocialIconStyle, Theme } from "@/lib/types";
import { brandColor, type SocialBrandId } from "@/lib/socialBrands";

const SOCIAL_PREVIEW: { platform: SocialBrandId; url: string }[] = [
  { platform: "instagram", url: "https://instagram.com" },
  { platform: "tiktok", url: "https://tiktok.com" },
  { platform: "youtube", url: "https://youtube.com" },
  { platform: "twitter", url: "https://x.com" },
  { platform: "github", url: "https://github.com" },
];

const SOCIAL_COLOR_SWATCHES = ["#ffffff", "#f8fafc", "#000000", "#171717", "#a3a3a3", "#fbbf24"];

export default function AppearancePage() {
  const { success, error: toastError } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [theme, setTheme] = useState<Theme>(THEME_PRESETS.midnight);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    profileApi.get(token).then((p) => {
      setProfile(p);
      setTheme({ ...THEME_PRESETS.midnight, ...p.theme_json });
    });
  }, []);

  async function save(next?: Theme) {
    const token = getAccessToken();
    if (!token) return;
    const t = next || theme;
    setSaving(true);
    try {
      const updated = await profileApi.update(token, { theme_json: t });
      setProfile(updated);
      setTheme({ ...THEME_PRESETS.midnight, ...updated.theme_json });
      success("Appearance saved");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to save appearance");
    } finally {
      setSaving(false);
    }
  }

  function applyPreset(key: string) {
    const t = THEME_PRESETS[key];
    setTheme(t);
    save(t);
  }

  function patchTheme(partial: Partial<Theme>) {
    setTheme({ ...theme, ...partial, preset: "custom" });
  }

  function setSocialStyle(style: SocialIconStyle) {
    patchTheme({
      social_icon_style: style,
      social_icon_color:
        style === "mono" && !theme.social_icon_color
          ? theme.text_color
          : theme.social_icon_color || theme.text_color,
    });
  }

  if (!profile) return <p className="text-sm text-meetup-muted">Loading…</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">Appearance</h1>
          <p className="mt-1 text-sm text-meetup-muted">Themes, colors, and button style.</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Object.keys(THEME_PRESETS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className={`rounded-xl border px-3 py-3 text-left text-sm capitalize ${
                theme.preset === key ? "border-meetup-purple bg-meetup-lavender" : "border-meetup-border bg-white hover:border-meetup-purple/40"
              }`}
            >
              <span
                className="mb-2 block h-8 rounded-lg"
                style={{ background: THEME_PRESETS[key].background_color }}
              />
              {key}
            </button>
          ))}
        </div>

        <div className="space-y-3 mu-card p-4 md:p-5">
          {(
            [
              ["background_color", "Background"],
              ["button_color", "Button"],
              ["button_text_color", "Button text"],
              ["text_color", "Text"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between gap-3 text-sm">
              <span>{label}</span>
              <input
                type="color"
                value={theme[key]}
                onChange={(e) => patchTheme({ [key]: e.target.value })}
              />
            </label>
          ))}

          <label className="block text-sm">
            Button style
            <select
              className="mt-1 w-full rounded-xl border border-meetup-border px-3 py-2"
              value={theme.button_style}
              onChange={(e) => patchTheme({ button_style: e.target.value })}
            >
              <option value="rounded">Rounded</option>
              <option value="pill">Pill</option>
              <option value="square">Square</option>
            </select>
          </label>

          <label className="block text-sm">
            Background image URL
            <input
              className="mt-1 w-full rounded-xl border border-meetup-border px-3 py-2"
              value={theme.background_image || ""}
              onChange={(e) =>
                patchTheme({
                  background_image: e.target.value || null,
                })
              }
              placeholder="https://…"
            />
          </label>

          <div className="border-t border-meetup-border pt-3">
            <p className="text-sm font-medium">Social icons</p>
            <p className="mt-0.5 text-xs text-meetup-muted">
              Brand colors can disappear on dark backgrounds — pick a solid color when needed.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {(
                [
                  ["brand", "Brand colors"],
                  ["mono", "Custom color"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSocialStyle(value)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm ${
                    theme.social_icon_style === value
                      ? "border-meetup-purple bg-meetup-lavender"
                      : "border-meetup-border bg-white hover:border-meetup-purple/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {theme.social_icon_style === "mono" && (
              <div className="mt-3 space-y-2">
                <label className="flex items-center justify-between gap-3 text-sm">
                  <span>Icon color</span>
                  <input
                    type="color"
                    value={theme.social_icon_color || theme.text_color}
                    onChange={(e) => patchTheme({ social_icon_color: e.target.value })}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-meetup-border px-2.5 py-1 text-xs hover:border-meetup-purple/40"
                    onClick={() => patchTheme({ social_icon_color: theme.text_color })}
                  >
                    Match text
                  </button>
                  {SOCIAL_COLOR_SWATCHES.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      title={hex}
                      aria-label={`Use ${hex}`}
                      onClick={() => patchTheme({ social_icon_color: hex })}
                      className={`h-7 w-7 rounded-full border ${
                        theme.social_icon_color?.toLowerCase() === hex
                          ? "ring-2 ring-meetup-purple ring-offset-1"
                          : "border-meetup-border"
                      }`}
                      style={{ background: hex }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => save()}
            disabled={saving}
            className="mu-btn-primary w-full py-2.5 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save appearance"}
          </button>
        </div>
      </div>

      <div
        className="flex min-h-[520px] flex-col items-center rounded-3xl p-8"
        style={{
          backgroundColor: theme.background_color,
          backgroundImage: theme.background_image ? `url(${theme.background_image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: theme.text_color,
        }}
      >
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
          {profile.display_name.slice(0, 1)}
        </div>
        <p className="font-display text-xl font-bold">{profile.display_name}</p>
        <p className="mt-1 max-w-xs text-center text-sm opacity-80">{profile.bio || "Your bio here"}</p>

        <div className="mt-4 flex flex-wrap justify-center gap-2.5">
          {SOCIAL_PREVIEW.map((s) => {
            const fill = resolveSocialIconColor(theme, brandColor(s.platform));
            return (
              <LinkVisual
                key={s.platform}
                url={s.url}
                platform={s.platform}
                size="sm"
                chrome="plain"
                iconColor={theme.social_icon_style === "brand" ? "brand" : fill}
              />
            );
          })}
        </div>

        <div className="mt-8 w-full max-w-xs space-y-3">
          {["Featured link", "Another link"].map((t) => (
            <div
              key={t}
              className="px-4 py-3 text-center text-sm font-semibold"
              style={{
                background: theme.button_color,
                color: theme.button_text_color,
                borderRadius: buttonRadius(theme.button_style),
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
