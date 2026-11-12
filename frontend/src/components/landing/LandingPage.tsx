"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { ClaimUsername } from "./ClaimUsername";
import { CreatorMarquee } from "./CreatorMarquee";
import { EXAMPLES, photo } from "./examples";
import { FaqAccordion } from "./FaqAccordion";
import { HeroShowcase } from "./HeroShowcase";
import { LandingNav } from "./LandingNav";
import { Reveal } from "./motion";
import { RotatingWord } from "./RotatingWord";
import { ShareFan } from "./ShareFan";
import { PublicShortener } from "@/components/shortener/PublicShortener";
import { TiltShowcase } from "./TiltShowcase";

const music = EXAMPLES.find((e) => e.id === "music")!;
const fitness = EXAMPLES.find((e) => e.id === "fitness")!;
const photographer = EXAMPLES.find((e) => e.id === "photo")!;

const INCLUDED = ["Unlimited links", "Short links + QR", "Products & tips", "Custom domain"];

const SHORT_LINKS = [
  { code: "marea-tickets", dest: "tickets.luciarios.com/tour", clicks: "4,812", rule: "utm_source=ig" },
  { code: "app", dest: "iOS → App Store · Android → Play", clicks: "1,306", rule: "Device routing" },
  { code: "promo-cl", dest: "valefit.cl/oferta", clicks: "967", rule: "Chile only" },
];

const DAILY = [32, 41, 38, 55, 49, 62, 58, 71, 66, 84, 79, 92, 88, 104];

const SOURCES = [
  { label: "Instagram", pct: 46 },
  { label: "TikTok", pct: 27 },
  { label: "QR code", pct: 15 },
  { label: "Direct", pct: 12 },
];

const COUNTRIES = [
  { flag: "🇦🇷", name: "Argentina", n: "3.1k" },
  { flag: "🇲🇽", name: "Mexico", n: "2.4k" },
  { flag: "🇪🇸", name: "Spain", n: "1.2k" },
];

const STEPS = [
  { n: "1", title: "Claim your name", body: "Pick bitlink.click/yourname — it takes seconds." },
  { n: "2", title: "Add what you share", body: "Links, videos, songs, products, a tip jar, a sign-up form." },
  { n: "3", title: "Put it everywhere", body: "Bio, video descriptions, a printed QR. Then watch the clicks." },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-bold uppercase tracking-wider text-meetup-purple">{children}</p>;
}

function BigTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`mt-2 font-display text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.05] ${className}`}>
      {children}
    </h2>
  );
}

export function LandingPage({ latestPosts }: { latestPosts?: React.ReactNode }) {
  return (
    <div className="landing-root min-h-screen overflow-x-clip bg-white text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-meetup"
      >
        Skip to main content
      </a>

      <LandingNav />

      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden px-5 pb-20 pt-10 md:px-8 md:pb-28 md:pt-16">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-meetup-lavender blur-3xl" />
          <div className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 rounded-full bg-[#FFE3EA] blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1fr_1fr] md:gap-10">
            <div className="landing-rise">
              <span className="inline-flex items-center gap-2 rounded-full bg-meetup-lavender px-3 py-1 text-xs font-bold text-meetup-purple">
                <span className="h-1.5 w-1.5 rounded-full bg-meetup-purple" /> Free forever · no plans
              </span>
              <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-tight sm:text-[3.4rem] lg:text-[3.9rem]">
                <span className="whitespace-nowrap">One link for</span>
                <br />
                <RotatingWord className="text-meetup-purple" />
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-meetup-muted">
                Your music, videos, products and bookings on one page — plus short links, QR codes and stats to see
                what actually gets clicked.
              </p>
              <div className="mt-8 max-w-lg">
                <ClaimUsername buttonLabel="Claim free" />
              </div>
              <p className="mt-4 text-sm text-meetup-muted">
                Just need a short link?{" "}
                <a href="#acortador" className="font-semibold text-meetup-purple hover:underline">
                  Shorten a URL free, no sign-up →
                </a>
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink/75">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-600" aria-hidden>
                      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="landing-rise-delayed">
              <HeroShowcase />
            </div>
          </div>
        </section>

        {/* Public shortener */}
        <section id="acortador" className="scroll-mt-20 px-5 pb-20 md:px-8 md:pb-28">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Free URL shortener</Eyebrow>
            <BigTitle>Shorten a link right now.</BigTitle>
            <p className="mt-3 text-meetup-muted">
              No account needed, no limits, links never expire. Sign up free only if you want click stats.{" "}
              <Link href="/url-shortener" className="font-semibold text-meetup-purple hover:underline">
                Learn more
              </Link>
            </p>
            <div className="mt-8 flex justify-center text-left">
              <PublicShortener lang="en" source="landing" />
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="pb-20 md:pb-28">
          <Reveal className="mx-auto mb-10 max-w-3xl px-5 text-center">
            <BigTitle>Made for people who make things.</BigTitle>
            <p className="mt-3 text-meetup-muted">The pages below are examples of what you can build in a few minutes.</p>
          </Reveal>
          <CreatorMarquee />
        </section>

        {/* Bento — what a page can hold */}
        <section id="product" className="bg-meetup-bg px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <Eyebrow>Your page</Eyebrow>
              <BigTitle>More than a list of links.</BigTitle>
            </Reveal>

            <div className="mt-12 grid gap-4 md:grid-cols-6 md:gap-5">
              {/* Embeds */}
              <Reveal className="md:col-span-4">
                <div className="group relative h-full overflow-hidden rounded-[2rem] bg-[#1b1030] p-6 text-white md:p-8">
                  <img
                    src={photo("1459749411175-04bf5292ceea", 900, 600)}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1b1030] via-[#1b1030]/80 to-transparent" />
                  <div className="relative grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="font-display text-2xl font-bold">Play it right there</h3>
                      <p className="mt-2 max-w-xs text-sm text-white/75">
                        Paste a YouTube or Spotify link — it turns into a player on your page. No app switching.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-md">
                        <img src={photo("1511379938547-c1f69419868d", 120, 120)} alt="" className="h-14 w-14 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold">Marea</p>
                          <p className="text-xs text-white/70">{music.name} · Single</p>
                          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/20">
                            <div className="landing-progress h-full rounded-full bg-[#1ed760]" />
                          </div>
                        </div>
                      </div>
                      <div className="relative overflow-hidden rounded-2xl">
                        <img src={photo("1516280440614-37939bbacd81", 600, 300)} alt="" className="aspect-[2/1] w-full object-cover" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-10 w-14 items-center justify-center rounded-xl bg-[#ff0033] shadow-lg transition group-hover:scale-110">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                          </span>
                        </span>
                        <span className="absolute bottom-2 left-3 text-sm font-bold drop-shadow">Live in Buenos Aires — full set</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Products */}
              <Reveal className="md:col-span-2" delay={80}>
                <div className="flex h-full flex-col rounded-[2rem] bg-[#c6f432] p-6 text-[#0d2b1d] md:p-7">
                  <h3 className="font-display text-2xl font-bold">Sell without a store</h3>
                  <p className="mt-2 text-sm text-[#0d2b1d]/75">Product cards with your price and checkout link. We take 0%.</p>
                  <div className="mt-auto space-y-2 pt-6">
                    {[
                      { t: "12-week program", p: "$39", img: photo("1517836357463-d25dfeac3438", 120, 120) },
                      { t: "1:1 coaching call", p: "$25", img: fitness.avatar },
                    ].map((item) => (
                      <div key={item.t} className="flex items-center gap-3 rounded-2xl bg-white p-2 shadow-sm transition hover:-translate-y-0.5">
                        <img src={item.img} alt="" className="h-11 w-11 rounded-xl object-cover" />
                        <p className="flex-1 text-sm font-bold">{item.t}</p>
                        <span className="rounded-full bg-[#0d2b1d] px-2.5 py-1 text-xs font-bold text-[#c6f432]">{item.p}</span>
                      </div>
                    ))}
                    <p className="pt-1 text-xs font-semibold text-[#0d2b1d]/70">Mercado Pago · Stripe · PayPal · Gumroad</p>
                  </div>
                </div>
              </Reveal>

              {/* Collections */}
              <Reveal className="md:col-span-2">
                <div className="h-full rounded-[2rem] bg-white p-6 shadow-meetup md:p-7">
                  <h3 className="font-display text-xl font-bold">Collections in a grid</h3>
                  <p className="mt-1 text-sm text-meetup-muted">Group links with photos — a portfolio, a menu, a lookbook.</p>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {["1542038784456-1ea8e935640e", "1554080353-a576cf803bda", "1490481651871-ab68de25d43d", "1546069901-ba9599a7e63c", "1441986300917-64674bd600d8", "1565958011703-44f9829ba187"].map((id) => (
                      <div key={id} className="overflow-hidden rounded-xl">
                        <img src={photo(id, 200, 200)} alt="" loading="lazy" className="aspect-square w-full object-cover transition duration-500 hover:scale-110" />
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Tips + email */}
              <Reveal className="md:col-span-2" delay={80}>
                <div className="flex h-full flex-col rounded-[2rem] bg-[#FFE3EA] p-6 md:p-7">
                  <h3 className="font-display text-xl font-bold">Tips & a mailing list</h3>
                  <p className="mt-1 text-sm text-ink/70">Let fans support you and keep in touch — off the algorithm.</p>
                  <div className="mt-auto space-y-2 pt-5">
                    <div className="rounded-full bg-[#F64060] py-2.5 text-center text-sm font-bold text-white">Buy me a coffee ☕</div>
                    <div className="flex gap-2 rounded-2xl bg-white p-2">
                      <span className="flex-1 px-2 py-1.5 text-sm text-meetup-muted">you@email.com</span>
                      <span className="rounded-xl bg-ink px-3 py-1.5 text-sm font-bold text-white">Join</span>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Schedule + lock */}
              <Reveal className="md:col-span-2" delay={160}>
                <div className="flex h-full flex-col rounded-[2rem] bg-ink p-6 text-white md:p-7">
                  <h3 className="font-display text-xl font-bold">Drops & private links</h3>
                  <p className="mt-1 text-sm text-white/65">Schedule a link to go live at launch time, or lock it with a password.</p>
                  <div className="mt-auto space-y-2 pt-5 text-sm font-semibold">
                    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                      <span>Merch drop</span>
                      <span className="rounded-full bg-meetup-purple px-2.5 py-0.5 text-xs">Fri 18:00</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                      <span>Presskit</span>
                      <span className="text-xs text-white/60">🔒 Locked</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Design */}
        <section className="overflow-hidden px-5 py-20 md:px-8 md:py-32">
          <div className="mx-auto max-w-6xl">
            <TiltShowcase />
          </div>
        </section>

        {/* Share + short links */}
        <section id="how" className="bg-[#F1F0FF] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <Reveal>
              <Eyebrow>Share</Eyebrow>
              <BigTitle>Wherever your people find you.</BigTitle>
              <p className="mt-4 max-w-md text-lg text-meetup-muted">
                One URL for every bio and video description, and a QR code for the menu, the poster or the merch table.
              </p>
              <ol className="mt-8 space-y-4">
                {STEPS.map((step) => (
                  <li key={step.n} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                      {step.n}
                    </span>
                    <div>
                      <p className="font-bold">{step.title}</p>
                      <p className="text-sm text-meetup-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
            <ShareFan />
          </div>
        </section>

        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <Reveal className="order-2 md:order-1">
              <div className="overflow-hidden rounded-[2rem] border border-meetup-border bg-white shadow-meetup-lg">
                <div className="flex items-center justify-between border-b border-meetup-border px-5 py-4">
                  <p className="font-bold">Short links</p>
                  <span className="rounded-full bg-meetup-lavender px-3 py-1 text-xs font-bold text-meetup-purple">+ New</span>
                </div>
                <ul className="divide-y divide-meetup-border">
                  {SHORT_LINKS.map((row) => (
                    <li key={row.code} className="flex items-center gap-4 px-5 py-4 transition hover:bg-mist">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-meetup-purple">bitlink.click/{row.code}</p>
                        <p className="truncate text-xs text-meetup-muted">→ {row.dest}</p>
                        <span className="mt-1.5 inline-block rounded-md bg-mist px-2 py-0.5 font-mono text-[11px] text-ink/70">{row.rule}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-bold tabular-nums">{row.clicks}</p>
                        <p className="text-[11px] text-meetup-muted">clicks</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal className="order-1 md:order-2">
              <Eyebrow>Short links</Eyebrow>
              <BigTitle>Short links, no monthly cap.</BigTitle>
              <p className="mt-4 max-w-md text-lg text-meetup-muted">
                Custom back-halves, UTM tags, send iPhone and Android users to different stores, route by country —
                and change the destination after you’ve printed the QR.
              </p>
              <Link href="/register" className="mu-btn-primary mt-7 px-6 py-3">
                Create a short link
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Analytics */}
        <section className="bg-ink px-5 py-20 text-white md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wider text-[#c6f432]">Analytics</p>
              <BigTitle>Know what gets clicked.</BigTitle>
              <p className="mt-4 text-lg text-white/65">Views, clicks, sources and countries for every link. Export to CSV anytime.</p>
            </Reveal>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <Reveal className="md:col-span-2">
                <div className="h-full rounded-[2rem] bg-white/[0.06] p-6 ring-1 ring-white/10">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-white/60">Clicks · last 14 days</p>
                      <p className="mt-1 font-display text-4xl font-extrabold tabular-nums">8,214</p>
                    </div>
                    <span className="rounded-full bg-[#c6f432]/15 px-3 py-1 text-sm font-bold text-[#c6f432]">▲ 34%</span>
                  </div>
                  <div className="mt-6 flex h-40 items-end gap-1.5">
                    {DAILY.map((v, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-meetup-purple to-[#a48cff] transition-all hover:from-[#c6f432] hover:to-[#c6f432]"
                        style={{ height: `${(v / 104) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div className="h-full space-y-5 rounded-[2rem] bg-white/[0.06] p-6 ring-1 ring-white/10">
                  <div className="space-y-3">
                    <p className="text-sm text-white/60">Top sources</p>
                    {SOURCES.map((row) => (
                      <div key={row.label}>
                        <div className="mb-1 flex justify-between text-sm font-semibold">
                          <span>{row.label}</span>
                          <span className="tabular-nums text-white/60">{row.pct}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-[#c6f432]" style={{ width: `${row.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    {COUNTRIES.map((c) => (
                      <div key={c.name} className="flex items-center justify-between text-sm">
                        <span>
                          {c.flag} {c.name}
                        </span>
                        <span className="tabular-nums text-white/60">{c.n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Custom domain */}
        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <Reveal>
              <Eyebrow>Custom domain</Eyebrow>
              <BigTitle>Your brand in the address bar.</BigTitle>
              <p className="mt-4 max-w-md text-lg text-meetup-muted">
                Add a TXT record to verify, point a CNAME to Bitlink, and your page lives at links.yourbrand.com.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <div className="overflow-hidden rounded-[2rem] border border-meetup-border bg-white shadow-meetup-lg">
                <div className="flex items-center gap-2 border-b border-meetup-border bg-mist px-4 py-3">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <div className="ml-3 flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-meetup-border">
                    <span aria-hidden>🔒</span>
                    <span className="font-semibold">{photographer.domain}</span>
                  </div>
                </div>
                <div className="relative h-64 overflow-hidden">
                  <img src={photo("1542038784456-1ea8e935640e", 900, 500)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="relative flex h-full flex-col items-center justify-center text-white">
                    <img src={photographer.avatar} alt="" className="h-16 w-16 rounded-full object-cover ring-2 ring-white/60" />
                    <p className="mt-2 font-bold">{photographer.name}</p>
                    <div className="mt-3 w-56 space-y-2">
                      <div className="rounded-full bg-white/20 py-2 text-center text-sm font-semibold backdrop-blur">Portfolio</div>
                      <div className="rounded-full bg-white/20 py-2 text-center text-sm font-semibold backdrop-blur">Book a session</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {latestPosts}

        {/* FAQ */}
        <section id="faq" className="bg-meetup-bg px-5 py-20 md:px-8 md:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center font-display text-3xl font-extrabold tracking-tight md:text-4xl">Questions</h2>
            <FaqAccordion />
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-meetup-purple px-5 py-20 text-center md:px-8 md:py-28">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between opacity-30 md:opacity-60">
            {[music, fitness].map((ex, i) => (
              <img
                key={ex.id}
                src={ex.cover}
                alt=""
                className={`hidden h-72 w-56 object-cover sm:block ${i === 0 ? "-ml-10 -rotate-6 rounded-t-full rounded-b-[2rem]" : "-mr-10 rotate-6 rounded-[2rem]"}`}
              />
            ))}
          </div>
          <div className="relative">
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-white md:text-6xl">Claim your name.</h2>
            <p className="mx-auto mt-3 max-w-sm text-white/75">No card. No plan. Your page is live in minutes.</p>
            <div className="mx-auto mt-8 flex max-w-xl justify-center">
              <ClaimUsername variant="footer" buttonLabel="Get Bitlink free" />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
