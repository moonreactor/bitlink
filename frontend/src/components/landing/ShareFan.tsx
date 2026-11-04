"use client";

/* eslint-disable @next/next/no-img-element */
import { SocialBrandIcon, type SocialBrandId } from "@/lib/socialBrands";
import { EXAMPLES } from "./examples";
import { useInView } from "./motion";

const chef = EXAMPLES.find((e) => e.id === "chef")!;
const url = `bitlink.click/${chef.handle}`;

const CARDS: { id: string; label: string; bg: string; fg: string; icon?: SocialBrandId }[] = [
  { id: "qr", label: "Printed on the menu", bg: "#fff4e6", fg: "#3b1d0a" },
  { id: "youtube", label: "Video description", bg: "#ff0033", fg: "#fff", icon: "youtube" },
  { id: "tiktok", label: "TikTok bio", bg: "#111", fg: "#fff", icon: "tiktok" },
  { id: "instagram", label: "Instagram bio", bg: "linear-gradient(135deg,#7b2ff7,#f107a3 55%,#ffb347)", fg: "#fff", icon: "instagram" },
];

function QrGlyph() {
  // Deterministic pseudo-QR pattern — decorative only.
  const cells = Array.from({ length: 81 }, (_, i) => ((i * 37) % 7 < 3 || i % 10 === 0 ? 1 : 0));
  const finder = (r: number, c: number) => (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
  return (
    <div className="grid w-24 grid-cols-9 gap-[2px] rounded-lg bg-white p-2">
      {cells.map((on, i) => {
        const r = Math.floor(i / 9);
        const c = i % 9;
        return <span key={i} className={`aspect-square rounded-[1px] ${finder(r, c) || on ? "bg-[#3b1d0a]" : ""}`} />;
      })}
    </div>
  );
}

/** Cards fan out once visible — one link, every place your audience is. */
export function ShareFan() {
  const [ref, open] = useInView<HTMLDivElement>(0.35);
  const mid = (CARDS.length - 1) / 2;
  // Spread as far as the container allows (card is 170px wide).
  const width = ref.current?.offsetWidth ?? 360;
  const spread = Math.max(40, Math.min(105, (width - 190) / (CARDS.length - 1)));

  return (
    <div ref={ref} className="relative mx-auto h-[300px] w-full max-w-[520px]">
      {CARDS.map((card, i) => {
        const offset = i - mid;
        const transform = open
          ? `translateX(${offset * spread}px) translateY(${Math.abs(offset) * 14}px) rotate(${offset * 8}deg)`
          : `translateX(0) translateY(0) rotate(${offset * 2}deg)`;
        return (
          <div
            key={card.id}
            className="absolute left-1/2 top-4 -ml-[85px] flex h-[230px] w-[170px] flex-col justify-between rounded-[1.6rem] p-4 shadow-meetup-lg transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ background: card.bg, color: card.fg, transform, transitionDelay: `${i * 70}ms`, zIndex: i }}
          >
            <div className="flex items-center justify-between">
              {card.icon ? <SocialBrandIcon brandId={card.icon} className="h-5 w-5" /> : <span className="text-lg">🍽️</span>}
              <span className="text-[10px] font-bold uppercase tracking-wide opacity-75">{card.label}</span>
            </div>
            {card.id === "qr" ? (
              <div className="flex flex-col items-center gap-2">
                <QrGlyph />
                <p className="text-[10px] font-bold">Scan for recipes & bookings</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <img src={chef.avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-white/40" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold">{chef.handle}</p>
                  <p className="truncate text-[10px] opacity-80">{chef.role}</p>
                </div>
              </div>
            )}
            <p className="truncate rounded-full bg-white/90 px-2.5 py-1 text-center text-[11px] font-bold text-[#7050D1]">
              🔗 {url}
            </p>
          </div>
        );
      })}
    </div>
  );
}
