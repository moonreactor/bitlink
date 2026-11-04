"use client";

import { useEffect, useState } from "react";

const THEMES = [
  {
    id: "lime",
    bg: "#D2E823",
    ink: "#254F1A",
    btn: "#254F1A",
    btnText: "#D2E823",
    name: "Maya Chen",
    handle: "mayachen",
    links: ["New drop", "Spotify", "Book me", "Shop"],
  },
  {
    id: "blue",
    bg: "#2665D6",
    ink: "#F3F3F1",
    btn: "#F3F3F1",
    btnText: "#2665D6",
    name: "Jordan Lee",
    handle: "jordanlee",
    links: ["Latest video", "Merch", "Newsletter", "Tour dates"],
  },
  {
    id: "currant",
    bg: "#780016",
    ink: "#E9C0E9",
    btn: "#E9C0E9",
    btnText: "#780016",
    name: "Avery Studio",
    handle: "averystudio",
    links: ["Portfolio", "Rates", "Instagram", "Contact"],
  },
  {
    id: "forest",
    bg: "#14532d",
    ink: "#dcfce7",
    btn: "#dcfce7",
    btnText: "#14532d",
    name: "Noah Parks",
    handle: "noahparks",
    links: ["Podcast", "Tips jar", "Calendar", "YouTube"],
  },
] as const;

export function PhoneMockup() {
  const [index, setIndex] = useState(0);
  const theme = THEMES[index];

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % THEMES.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <div
        className="landing-float absolute -left-6 top-10 z-10 hidden rounded-2xl px-3 py-2 text-xs font-semibold shadow-lg sm:block"
        style={{ background: "#E9C0E9", color: "#1E2330" }}
      >
        +128 clicks today
      </div>
      <div
        className="landing-float-delayed absolute -right-4 bottom-24 z-10 hidden rounded-2xl px-3 py-2 text-xs font-semibold shadow-lg sm:block"
        style={{ background: "#D2E823", color: "#254F1A" }}
      >
        QR ready
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] border-[10px] border-[#1E2330] bg-[#1E2330] shadow-2xl shadow-black/30">
        <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-[#1E2330]" />
        <div
          className="flex min-h-[460px] flex-col items-center px-5 pb-7 pt-9 transition-colors duration-700"
          style={{ background: theme.bg, color: theme.ink }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-extrabold transition-colors duration-700"
            style={{ background: theme.btn, color: theme.btnText }}
          >
            {theme.name
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </div>
          <p className="mt-3 text-lg font-extrabold tracking-tight">{theme.name}</p>
          <p className="text-sm opacity-70">@{theme.handle}</p>
          <p className="mt-2 max-w-[200px] text-center text-xs opacity-80">
            Creator · maker · one link for everything
          </p>

          <div className="mt-6 flex w-full flex-col gap-2.5">
            {theme.links.map((label, i) => (
              <div
                key={`${theme.id}-${label}`}
                className="landing-link-in rounded-full px-4 py-3 text-center text-sm font-bold shadow-sm transition-colors duration-700"
                style={{
                  background: theme.btn,
                  color: theme.btnText,
                  animationDelay: `${i * 80}ms`,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {THEMES.map((t, i) => (
          <button
            key={t.id}
            type="button"
            aria-label={`Preview ${t.id} theme`}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === index ? "scale-125 bg-[#1E2330]" : "bg-[#1E2330]/25 hover:bg-[#1E2330]/45"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
