/* eslint-disable @next/next/no-img-element */
import { SHOWCASE } from "./examples";

/** Infinite strip of mixed-shape photo tiles; hover pauses it. */
export function CreatorMarquee() {
  const tiles = [...SHOWCASE, ...SHOWCASE];
  return (
    <div className="landing-marquee group relative overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-32" />
      <div className="landing-marquee-track flex w-max gap-4 group-hover:[animation-play-state:paused] md:gap-6">
        {tiles.map((tile, i) => (
          <figure key={`${tile.label}-${i}`} className="shrink-0" aria-hidden={i >= SHOWCASE.length}>
            <div className={`h-44 w-36 overflow-hidden md:h-60 md:w-48 ${tile.shape}`}>
              <img
                src={tile.img}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 hover:scale-110"
              />
            </div>
            <figcaption className="mt-2 text-center text-sm font-semibold text-meetup-muted">{tile.label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
