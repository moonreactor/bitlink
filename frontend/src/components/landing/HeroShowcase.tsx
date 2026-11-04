"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { EXAMPLES } from "./examples";
import { PhoneFrame, ProfilePreview } from "./ProfilePreview";

const INTERVAL = 5000;

/** Hero: real-life photo card + the phone page that person would build, cross-fading together. */
export function HeroShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = EXAMPLES[index];

  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % EXAMPLES.length), INTERVAL);
    return () => window.clearTimeout(id);
  }, [index, paused]);

  return (
    <div
      className="relative mx-auto w-full max-w-[520px] pt-6 sm:pt-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative ml-auto aspect-[4/5] w-[80%] overflow-hidden sm:w-[78%] rounded-[2.5rem] bg-meetup-lavender shadow-meetup-lg">
        {EXAMPLES.map((ex, i) => (
          <img
            key={ex.id}
            src={ex.cover}
            alt={`${ex.name}, ${ex.role.toLowerCase()}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === index ? "landing-kenburns opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div key={active.id} className="landing-link-in absolute bottom-5 right-5 hidden text-right text-white sm:block">
          <p className="font-display text-lg font-bold leading-tight">{active.name}</p>
          <p className="text-sm text-white/80">{active.role}</p>
        </div>
      </div>

      <div className="absolute -bottom-3 left-0 w-[44%] min-w-[190px] max-w-[228px] origin-bottom-left -rotate-[4deg] scale-[0.8] sm:scale-100 transition-transform duration-500 hover:rotate-0">
        <PhoneFrame url={active.domain ?? `bitlink.app/${active.handle}`} screenClassName="h-[440px]">
          <div key={active.id} className="landing-screen-in h-full">
            <ProfilePreview profile={active} />
          </div>
        </PhoneFrame>
      </div>

      <div
        key={`stat-${active.id}`}
        className="landing-pop absolute right-[6%] top-[8%] flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-ink shadow-meetup-lg"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        {active.stat}
      </div>

      <div className="mt-12 flex justify-end gap-1.5 pr-1" role="tablist" aria-label="Example pages">
        {EXAMPLES.map((ex, i) => (
          <button
            key={ex.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              i === index ? "bg-ink text-white" : "bg-white text-meetup-muted ring-1 ring-meetup-border hover:text-ink"
            }`}
          >
            {ex.tag}
          </button>
        ))}
      </div>
    </div>
  );
}
