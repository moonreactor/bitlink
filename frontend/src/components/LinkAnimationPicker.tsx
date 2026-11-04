"use client";

import { LINK_ANIMATIONS, animationClass, type LinkAnimationId } from "@/lib/linkAnimations";

type Props = {
  value: string;
  onChange: (animation: LinkAnimationId) => void;
};

export function LinkAnimationPicker({ value, onChange }: Props) {
  const current = (value || "none") as LinkAnimationId;

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-ink/70">Animation</span>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {LINK_ANIMATIONS.map((preset) => {
          const active = current === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange(preset.id)}
              className={`rounded-xl border px-2.5 py-2 text-left transition ${
                active ? "border-accent bg-accent/10" : "border-ink/10 bg-white/80 hover:bg-ink/[0.03]"
              }`}
            >
              <div
                className={`mb-2 flex h-9 items-center justify-center rounded-lg bg-ink/[0.04] text-xs font-semibold ${animationClass(preset.id)}`}
              >
                Preview
              </div>
              <p className="text-xs font-semibold text-ink">{preset.label}</p>
              <p className="text-[10px] text-ink/45">{preset.description}</p>
              <p
                className={`mt-1 text-[9px] font-bold uppercase tracking-wide ${
                  preset.vibe === "wild"
                    ? "text-warn"
                    : preset.vibe === "fun"
                      ? "text-accent"
                      : "text-ink/35"
                }`}
              >
                {preset.vibe}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
