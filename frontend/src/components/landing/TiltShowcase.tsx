"use client";

import { useState } from "react";
import { LANDING } from "@/lib/i18n/landing-copy";
import type { SiteLang } from "@/lib/i18n/site";
import { EXAMPLES, getExamples, photo, type ExampleProfile } from "./examples";
import { useScrollProgress } from "./motion";
import { PhoneFrame, ProfilePreview } from "./ProfilePreview";

const BASE_THEME = EXAMPLES.find((e) => e.id === "photo")!.theme;
const DOMAIN = EXAMPLES.find((e) => e.id === "photo")!.domain!;

type VariantId = "paper" | "photo" | "midnight" | "blush";
const VARIANTS: { id: VariantId; swatch: string; theme: ExampleProfile["theme"] }[] = [
  { id: "paper", swatch: "#f3f1ec", theme: BASE_THEME },
  {
    id: "photo",
    swatch: `url(${photo("1542038784456-1ea8e935640e", 80, 80)}) center/cover`,
    theme: {
      bg: "#111",
      bgImage: photo("1542038784456-1ea8e935640e", 500, 900),
      text: "#ffffff",
      button: "rgba(255,255,255,0.16)",
      buttonText: "#ffffff",
      style: "pill",
    },
  },
  {
    id: "midnight",
    swatch: "#0f172a",
    theme: { bg: "#0f172a", text: "#f8fafc", button: "#ffffff", buttonText: "#0f172a", style: "rounded" },
  },
  {
    id: "blush",
    swatch: "#ffd6e0",
    theme: { bg: "#ffd6e0", text: "#5b1030", button: "#5b1030", buttonText: "#ffd6e0", style: "pill" },
  },
];

const CHIP_POS = ["left-0 top-[14%]", "right-0 top-[30%]", "left-[2%] bottom-[22%]", "right-[4%] bottom-[8%]"];

/** Phone straightens up as you scroll in; swatches re-theme the same page live. */
export function TiltShowcase({ lang = "en" }: { lang?: SiteLang }) {
  const t = LANDING[lang].design;
  const BASE = getExamples(lang).find((e) => e.id === "photo")!;
  const CHIPS = [...t.chips, DOMAIN].map((text, i) => ({ text, pos: CHIP_POS[i] }));
  const [ref, p] = useScrollProgress<HTMLDivElement>();
  const [variant, setVariant] = useState(VARIANTS[1]);
  const inv = 1 - p;

  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <div ref={ref} className="relative mx-auto w-full max-w-[420px] [perspective:1400px]">
        <div
          className="mx-auto w-[250px] will-change-transform"
          style={{
            transform: `rotateX(${inv * 22}deg) rotateY(${inv * -28}deg) rotateZ(${inv * 6}deg) scale(${0.86 + p * 0.14})`,
          }}
        >
          <PhoneFrame url={BASE.domain}>
            <ProfilePreview profile={{ ...BASE, theme: variant.theme }} />
          </PhoneFrame>
        </div>
        {CHIPS.map((chip, i) => (
          <span
            key={chip.text}
            className={`absolute ${chip.pos} hidden rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-meetup-lg transition-all duration-700 sm:inline-block`}
            style={{ opacity: p, transform: `translateY(${inv * 30}px)`, transitionDelay: `${i * 60}ms` }}
          >
            {chip.text}
          </span>
        ))}
      </div>

      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-meetup-purple">{t.eyebrow}</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-5xl">{t.title}</h2>
        <p className="mt-4 max-w-md text-lg text-meetup-muted">
          {t.body}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariant(v)}
              aria-pressed={variant.id === v.id}
              className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-sm font-semibold transition ${
                variant.id === v.id ? "border-ink bg-ink text-white" : "border-meetup-border bg-white text-ink hover:border-ink/40"
              }`}
            >
              <span className="h-7 w-7 rounded-full ring-1 ring-black/10" style={{ background: v.swatch }} />
              {t.variants[v.id]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
