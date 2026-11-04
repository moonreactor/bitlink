/* eslint-disable @next/next/no-img-element */
import { animationClass } from "@/lib/linkAnimations";
import { SocialBrandIcon } from "@/lib/socialBrands";
import { buttonRadius } from "@/lib/themes";
import type { ExampleBlock, ExampleProfile } from "./examples";

type Theme = ExampleProfile["theme"];

function Verified() {
  return (
    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-white" aria-label="Verified">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Block({ block, theme, index }: { block: ExampleBlock; theme: Theme; index: number }) {
  const radius = buttonRadius(theme.style);
  const btn = { background: theme.button, color: theme.buttonText, borderRadius: radius };
  const delay = { animationDelay: `${120 + index * 90}ms` };

  switch (block.kind) {
    case "header":
      return <p className="landing-link-in px-1 pt-1 text-[10px] font-bold uppercase tracking-wide opacity-70" style={delay}>{block.title}</p>;

    case "link":
      return (
        <div className="landing-link-in" style={delay}>
          <div
            className={`flex items-center gap-2 px-1.5 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur ${animationClass(block.animation)}`}
            style={btn}
          >
            {block.thumb ? (
              <img src={block.thumb} alt="" className="h-7 w-7 shrink-0 rounded-[8px] object-cover" />
            ) : (
              <span className="h-7 w-7 shrink-0" />
            )}
            <span className="flex-1 truncate text-center">{block.title}</span>
            <span className="w-7 shrink-0" />
          </div>
        </div>
      );

    case "youtube":
      return (
        <div className="landing-link-in overflow-hidden shadow-sm" style={{ ...delay, borderRadius: Math.min(parseInt(radius), 14) }}>
          <div className="relative aspect-video">
            <img src={block.thumb} alt="" className="h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-7 w-10 items-center justify-center rounded-lg bg-[#ff0033] shadow">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff" aria-hidden><path d="M8 5v14l11-7z" /></svg>
              </span>
            </span>
            <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 text-[8px] font-semibold text-white">{block.duration}</span>
          </div>
          <p className="truncate px-2 py-1.5 text-[10px] font-semibold" style={{ background: theme.button, color: theme.buttonText }}>
            ▶ {block.title}
          </p>
        </div>
      );

    case "spotify":
      return (
        <div className="landing-link-in flex items-center gap-2 rounded-xl bg-[#3a2a4a] p-2 text-white shadow-sm" style={delay}>
          <img src={block.cover} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold">{block.title}</p>
            <p className="truncate text-[9px] opacity-70">{block.artist}</p>
            <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-white/25">
              <div className="landing-progress h-full rounded-full bg-white" />
            </div>
          </div>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-black">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
          </span>
        </div>
      );

    case "grid":
      return (
        <div className="landing-link-in space-y-1" style={delay}>
          <p className="px-1 text-[9px] font-bold uppercase tracking-wide opacity-70">{block.title}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {block.items.map((item) => (
              <div key={item.title} className="relative overflow-hidden shadow-sm" style={{ borderRadius: Math.min(parseInt(radius), 12) }}>
                <img src={item.thumb} alt="" className="aspect-square w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1 pt-3 text-[9px] font-semibold text-white">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case "product":
      return (
        <div className="landing-link-in flex items-center gap-2 p-1.5 shadow-sm" style={{ ...btn, ...delay }}>
          <img src={block.thumb} alt="" className="h-9 w-9 shrink-0 rounded-[8px] object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold leading-tight">{block.title}</p>
            <p className="truncate text-[9px] opacity-70">{block.description}</p>
          </div>
          <span className="shrink-0 rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-bold">{block.price}</span>
        </div>
      );

    case "tip":
      return (
        <div className="landing-link-in py-2 text-center text-[11px] font-bold shadow-sm" style={{ ...btn, ...delay }}>
          {block.label}
        </div>
      );

    case "email":
      return (
        <div className="landing-link-in space-y-1 p-2 shadow-sm" style={{ ...btn, ...delay }}>
          <p className="text-[10px] font-bold">{block.prompt}</p>
          <div className="flex gap-1">
            <span className="flex-1 rounded-md bg-black/5 px-1.5 py-1 text-[9px] opacity-60">you@email.com</span>
            <span className="rounded-md px-2 py-1 text-[9px] font-bold" style={{ background: theme.text, color: theme.bg }}>
              Join
            </span>
          </div>
        </div>
      );
  }
}

/** Faithful-ish miniature of a public Bitlink page, sized for a phone frame. */
export function ProfilePreview({ profile }: { profile: ExampleProfile }) {
  const { theme } = profile;
  return (
    <div
      className="relative flex h-full flex-col items-center overflow-hidden px-4 pb-6 pt-12"
      style={{ background: theme.bg, color: theme.text }}
    >
      {theme.bgImage && (
        <>
          <img src={theme.bgImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/80" />
        </>
      )}
      <div className="relative flex w-full flex-col items-center">
        <img
          src={profile.avatar}
          alt=""
          className="h-16 w-16 rounded-full object-cover ring-2 ring-white/50"
        />
        <p className="mt-2 flex items-center gap-1 text-sm font-bold tracking-tight">
          {profile.name}
          {profile.verified && <Verified />}
        </p>
        <p className="mt-0.5 max-w-[210px] text-center text-[10px] leading-snug opacity-80">{profile.bio}</p>
        <div className="mt-2 flex gap-2.5 opacity-90">
          {profile.socials.map((id) => (
            <SocialBrandIcon key={id} brandId={id} className="h-3.5 w-3.5" />
          ))}
        </div>
        <div className="mt-3.5 flex w-full flex-col gap-2">
          {profile.blocks.map((block, i) => (
            <Block key={`${profile.id}-${i}`} block={block} theme={theme} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PhoneFrame({
  children,
  url,
  className = "",
  screenClassName = "h-[520px]",
}: {
  children: React.ReactNode;
  url?: string;
  className?: string;
  screenClassName?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[2.4rem] border-[9px] border-[#111] bg-[#111] shadow-[0_30px_80px_-20px_rgba(20,10,60,0.45)] ${className}`}>
      <div className="absolute left-1/2 top-1.5 z-20 h-[18px] w-20 -translate-x-1/2 rounded-full bg-[#111]" />
      {url && (
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-[26px]">
          <span className="rounded-full bg-black/35 px-2 py-0.5 text-[8px] font-semibold text-white backdrop-blur">{url}</span>
        </div>
      )}
      <div className={`w-full ${screenClassName}`}>{children}</div>
    </div>
  );
}
