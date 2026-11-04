"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { profileApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { THEME_PRESETS, buttonRadius } from "@/lib/themes";
import type { Profile, Theme } from "@/lib/types";

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

  if (!profile) return <p className="text-sm text-ink/50">Loading…</p>;

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Appearance</h1>
          <p className="mt-1 text-sm text-ink/55">Themes, colors, and button style.</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Object.keys(THEME_PRESETS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className={`rounded-xl border px-3 py-3 text-left text-sm capitalize ${
                theme.preset === key ? "border-accent bg-accent/10" : "border-ink/10 bg-white/70"
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

        <div className="space-y-3 rounded-2xl border border-ink/10 bg-white/70 p-4">
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
                onChange={(e) => setTheme({ ...theme, [key]: e.target.value, preset: "custom" })}
              />
            </label>
          ))}

          <label className="block text-sm">
            Button style
            <select
              className="mt-1 w-full rounded-xl border border-ink/10 px-3 py-2"
              value={theme.button_style}
              onChange={(e) => setTheme({ ...theme, button_style: e.target.value, preset: "custom" })}
            >
              <option value="rounded">Rounded</option>
              <option value="pill">Pill</option>
              <option value="square">Square</option>
            </select>
          </label>

          <label className="block text-sm">
            Background image URL
            <input
              className="mt-1 w-full rounded-xl border border-ink/10 px-3 py-2"
              value={theme.background_image || ""}
              onChange={(e) =>
                setTheme({
                  ...theme,
                  background_image: e.target.value || null,
                  preset: "custom",
                })
              }
              placeholder="https://…"
            />
          </label>

          <button
            type="button"
            onClick={() => save()}
            disabled={saving}
            className="w-full rounded-xl bg-ink py-2.5 text-sm font-semibold text-white disabled:opacity-60"
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
        <div className="mt-8 w-full max-w-xs space-y-3">
          {["Featured link", "Another link", "Socials"].map((t) => (
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
