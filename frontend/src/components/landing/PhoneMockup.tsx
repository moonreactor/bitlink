"use client";

import { useEffect, useState } from "react";

const THEMES = [
  {
    id: "lavender",
    bg: "#F1F0FF",
    ink: "#212121",
    btn: "#7050D1",
    btnText: "#FFFFFF",
    name: "Maya Chen",
    handle: "mayachen",
    links: ["New drop", "Spotify", "Book me", "Shop"],
  },
  {
    id: "night",
    bg: "#212121",
    ink: "#F6F7F8",
    btn: "#F1F0FF",
    btnText: "#7050D1",
    name: "Jordan Lee",
    handle: "jordanlee",
    links: ["Latest video", "Merch", "Newsletter", "Tour dates"],
  },
  {
    id: "coral",
    bg: "#FFF0F3",
    ink: "#212121",
    btn: "#F64060",
    btnText: "#FFFFFF",
    name: "Avery Studio",
    handle: "averystudio",
    links: ["Portfolio", "Rates", "Instagram", "Contact"],
  },
  {
    id: "mint",
    bg: "#E8F8F0",
    ink: "#14532d",
    btn: "#14532d",
    btnText: "#E8F8F0",
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
    <div className="relative mx-auto w-full max-w-[300px]">
      <div className="landing-float absolute -left-4 top-8 z-10 hidden rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-meetup sm:block">
        +128 clicks today
      </div>
      <div className="landing-float-delayed absolute -right-3 bottom-20 z-10 hidden rounded-full bg-meetup-lavender px-3 py-1.5 text-xs font-semibold text-meetup-purple shadow-meetup sm:block">
        QR ready
      </div>

      <div className="relative overflow-hidden rounded-[2.25rem] border-[10px] border-ink bg-ink shadow-meetup-lg">
        <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-ink" />
        <div
          className="flex min-h-[440px] flex-col items-center px-5 pb-7 pt-9 transition-colors duration-700"
          style={{ background: theme.bg, color: theme.ink }}
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-extrabold transition-colors duration-700"
            style={{ background: theme.btn, color: theme.btnText }}
          >
            {theme.name
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </div>
          <p className="mt-3 text-lg font-bold tracking-tight">{theme.name}</p>
          <p className="text-sm opacity-70">@{theme.handle}</p>
          <p className="mt-2 max-w-[200px] text-center text-xs opacity-75">
            Creator · maker · one link for everything
          </p>

          <div className="mt-5 flex w-full flex-col gap-2">
            {theme.links.map((label, i) => (
              <div
                key={`${theme.id}-${label}`}
                className="landing-link-in rounded-full px-4 py-2.5 text-center text-sm font-semibold shadow-sm transition-colors duration-700"
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
              i === index ? "scale-125 bg-meetup-purple" : "bg-meetup-border hover:bg-meetup-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
