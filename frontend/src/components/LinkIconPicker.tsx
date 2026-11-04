"use client";

import { LINK_ICON_PRESETS } from "@/lib/linkIcons";

type Props = {
  value: string | null;
  onChange: (icon: string | null) => void;
};

export function LinkIconPicker({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-ink/70">Icon</span>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[11px] font-medium text-ink/45 hover:text-ink"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 bg-ink/[0.03] text-xl">
          {value || "—"}
        </div>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => {
            const next = e.target.value.trim();
            onChange(next || null);
          }}
          placeholder="Paste an emoji…"
          maxLength={8}
          className="flex-1 rounded-xl border border-ink/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>

      <div className="grid max-h-36 grid-cols-6 gap-1.5 overflow-y-auto rounded-xl border border-ink/10 bg-white/80 p-2 sm:grid-cols-8">
        {LINK_ICON_PRESETS.map((preset) => {
          const active = value === preset.emoji;
          return (
            <button
              key={preset.id}
              type="button"
              title={preset.label}
              onClick={() => onChange(preset.emoji)}
              className={`flex h-9 items-center justify-center rounded-lg text-lg transition ${
                active ? "bg-accent/15 ring-2 ring-accent/40" : "hover:bg-ink/5"
              }`}
            >
              <span aria-hidden>{preset.emoji}</span>
              <span className="sr-only">{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
