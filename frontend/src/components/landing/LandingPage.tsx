"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { LANDING } from "@/lib/i18n/landing-copy";
import { LANG_LABEL, shortenerPath, type SiteLang } from "@/lib/i18n/site";
import { ClaimUsername } from "./ClaimUsername";
import { CreatorMarquee } from "./CreatorMarquee";
import { getExamples, photo } from "./examples";
import { FaqAccordion } from "./FaqAccordion";
import { HeroShowcase } from "./HeroShowcase";
import { LandingNav } from "./LandingNav";
import { Reveal } from "./motion";
import { RotatingWord } from "./RotatingWord";
import { ShareFan } from "./ShareFan";
import { PublicShortener } from "@/components/shortener/PublicShortener";
import { TiltShowcase } from "./TiltShowcase";

const SHORT_CODES = ["marea-tickets", "app", "promo-cl"];

const DAILY = [32, 41, 38, 55, 49, 62, 58, 71, 66, 84, 79, 92, 88, 104];

const SOURCE_PCT = [46, 27, 15, 12];

const GRID_IDS = [
  "1542038784456-1ea8e935640e",
  "1554080353-a576cf803bda",
  "1490481651871-ab68de25d43d",
  "1546069901-ba9599a7e63c",
  "1441986300917-64674bd600d8",
  "1565958011703-44f9829ba187",
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

export function LandingPage({ latestPosts, lang = "en" }: { latestPosts?: React.ReactNode; lang?: SiteLang }) {
  const t = LANDING[lang];
  const examples = getExamples(lang);
  const music = examples.find((e) => e.id === "music")!;
  const fitness = examples.find((e) => e.id === "fitness")!;
  const photographer = examples.find((e) => e.id === "photo")!;

  return (
    <div lang={LANG_LABEL[lang].html} className="landing-root min-h-screen overflow-x-clip bg-white text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-meetup"
      >
        {t.common.skip}
      </a>

      <LandingNav lang={lang} />

      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden px-5 pb-20 pt-10 md:px-8 md:pb-28 md:pt-16">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-meetup-lavender blur-3xl" />
          <div className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 rounded-full bg-[#FFE3EA] blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-[1fr_1fr] md:gap-10">
            <div className="landing-rise">
              <span className="inline-flex items-center gap-2 rounded-full bg-meetup-lavender px-3 py-1 text-xs font-bold text-meetup-purple">
                <span className="h-1.5 w-1.5 rounded-full bg-meetup-purple" /> {t.hero.badge}
              </span>
              <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.02] tracking-tight sm:text-[3.4rem] lg:text-[3.9rem]">
                <span className="whitespace-nowrap">{t.hero.line1}</span>
                <br />
                <RotatingWord words={t.hero.words} className="text-meetup-purple" />
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-meetup-muted">
                {t.hero.lead}
              </p>
              <div className="mt-8 max-w-lg">
                <ClaimUsername lang={lang} buttonLabel={t.claim.claimFree} />
              </div>
              <p className="mt-4 text-sm text-meetup-muted">
                {t.hero.shortenPrompt}{" "}
                <a href="#acortador" className="font-semibold text-meetup-purple hover:underline">
                  {t.hero.shortenLink}
                </a>
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink/75">
                {t.hero.included.map((item) => (
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
              <HeroShowcase lang={lang} />
            </div>
          </div>
        </section>

        {/* Public shortener */}
        <section id="acortador" className="scroll-mt-20 px-5 pb-20 md:px-8 md:pb-28">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{t.shortener.eyebrow}</Eyebrow>
            <BigTitle>{t.shortener.title}</BigTitle>
            <p className="mt-3 text-meetup-muted">
              {t.shortener.body}{" "}
              <Link href={shortenerPath(lang)} className="font-semibold text-meetup-purple hover:underline">
                {t.shortener.more}
              </Link>
            </p>
            <div className="mt-8 flex justify-center text-left">
              <PublicShortener lang={lang} source="landing" />
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="pb-20 md:pb-28">
          <Reveal className="mx-auto mb-10 max-w-3xl px-5 text-center">
            <BigTitle>{t.creators.title}</BigTitle>
            <p className="mt-3 text-meetup-muted">{t.creators.body}</p>
          </Reveal>
          <CreatorMarquee labels={t.creators.showcase} />
        </section>

        {/* Bento — what a page can hold */}
        <section id="product" className="bg-meetup-bg px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <Eyebrow>{t.product.eyebrow}</Eyebrow>
              <BigTitle>{t.product.title}</BigTitle>
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
                      <h3 className="font-display text-2xl font-bold">{t.product.play.title}</h3>
                      <p className="mt-2 max-w-xs text-sm text-white/75">
                        {t.product.play.body}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-md">
                        <img src={photo("1511379938547-c1f69419868d", 120, 120)} alt="" className="h-14 w-14 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold">Marea</p>
                          <p className="text-xs text-white/70">{music.name} · {t.product.play.single}</p>
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
                        <span className="absolute bottom-2 left-3 text-sm font-bold drop-shadow">{t.product.play.videoTitle}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Products */}
              <Reveal className="md:col-span-2" delay={80}>
                <div className="flex h-full flex-col rounded-[2rem] bg-[#c6f432] p-6 text-[#0d2b1d] md:p-7">
                  <h3 className="font-display text-2xl font-bold">{t.product.sell.title}</h3>
                  <p className="mt-2 text-sm text-[#0d2b1d]/75">{t.product.sell.body}</p>
                  <div className="mt-auto space-y-2 pt-6">
                    {[
                      { t: t.product.sell.items[0], p: "$39", img: photo("1517836357463-d25dfeac3438", 120, 120) },
                      { t: t.product.sell.items[1], p: "$25", img: fitness.avatar },
                    ].map((item) => (
                      <div key={item.t} className="flex items-center gap-3 rounded-2xl bg-white p-2 shadow-sm transition hover:-translate-y-0.5">
                        <img src={item.img} alt="" className="h-11 w-11 rounded-xl object-cover" />
                        <p className="flex-1 text-sm font-bold">{item.t}</p>
                        <span className="rounded-full bg-[#0d2b1d] px-2.5 py-1 text-xs font-bold text-[#c6f432]">{item.p}</span>
                      </div>
                    ))}
                    <p className="pt-1 text-xs font-semibold text-[#0d2b1d]/70">{t.product.sell.gateways}</p>
                  </div>
                </div>
              </Reveal>

              {/* Collections */}
              <Reveal className="md:col-span-2">
                <div className="h-full rounded-[2rem] bg-white p-6 shadow-meetup md:p-7">
                  <h3 className="font-display text-xl font-bold">{t.product.collections.title}</h3>
                  <p className="mt-1 text-sm text-meetup-muted">{t.product.collections.body}</p>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {GRID_IDS.map((id) => (
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
                  <h3 className="font-display text-xl font-bold">{t.product.tips.title}</h3>
                  <p className="mt-1 text-sm text-ink/70">{t.product.tips.body}</p>
                  <div className="mt-auto space-y-2 pt-5">
                    <div className="rounded-full bg-[#F64060] py-2.5 text-center text-sm font-bold text-white">{t.product.tips.coffee}</div>
                    <div className="flex gap-2 rounded-2xl bg-white p-2">
                      <span className="flex-1 px-2 py-1.5 text-sm text-meetup-muted">{t.product.tips.emailPlaceholder}</span>
                      <span className="rounded-xl bg-ink px-3 py-1.5 text-sm font-bold text-white">{t.product.tips.join}</span>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Schedule + lock */}
              <Reveal className="md:col-span-2" delay={160}>
                <div className="flex h-full flex-col rounded-[2rem] bg-ink p-6 text-white md:p-7">
                  <h3 className="font-display text-xl font-bold">{t.product.drops.title}</h3>
                  <p className="mt-1 text-sm text-white/65">{t.product.drops.body}</p>
                  <div className="mt-auto space-y-2 pt-5 text-sm font-semibold">
                    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                      <span>{t.product.drops.merch}</span>
                      <span className="rounded-full bg-meetup-purple px-2.5 py-0.5 text-xs">{t.product.drops.when}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                      <span>{t.product.drops.presskit}</span>
                      <span className="text-xs text-white/60">{t.product.drops.locked}</span>
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
            <TiltShowcase lang={lang} />
          </div>
        </section>

        {/* Share + short links */}
        <section id="how" className="bg-[#F1F0FF] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <Reveal>
              <Eyebrow>{t.share.eyebrow}</Eyebrow>
              <BigTitle>{t.share.title}</BigTitle>
              <p className="mt-4 max-w-md text-lg text-meetup-muted">
                {t.share.body}
              </p>
              <ol className="mt-8 space-y-4">
                {t.share.steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold">{step.title}</p>
                      <p className="text-sm text-meetup-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
            <ShareFan lang={lang} />
          </div>
        </section>

        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <Reveal className="order-2 md:order-1">
              <div className="overflow-hidden rounded-[2rem] border border-meetup-border bg-white shadow-meetup-lg">
                <div className="flex items-center justify-between border-b border-meetup-border px-5 py-4">
                  <p className="font-bold">{t.shortLinks.panel}</p>
                  <span className="rounded-full bg-meetup-lavender px-3 py-1 text-xs font-bold text-meetup-purple">{t.shortLinks.newBtn}</span>
                </div>
                <ul className="divide-y divide-meetup-border">
                  {t.shortLinks.rows.map((row, i) => (
                    <li key={SHORT_CODES[i]} className="flex items-center gap-4 px-5 py-4 transition hover:bg-mist">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-meetup-purple">bitlink.click/{SHORT_CODES[i]}</p>
                        <p className="truncate text-xs text-meetup-muted">→ {row.dest}</p>
                        <span className="mt-1.5 inline-block rounded-md bg-mist px-2 py-0.5 font-mono text-[11px] text-ink/70">{row.rule}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-bold tabular-nums">{row.clicks}</p>
                        <p className="text-[11px] text-meetup-muted">{t.shortLinks.clicks}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal className="order-1 md:order-2">
              <Eyebrow>{t.shortLinks.eyebrow}</Eyebrow>
              <BigTitle>{t.shortLinks.title}</BigTitle>
              <p className="mt-4 max-w-md text-lg text-meetup-muted">
                {t.shortLinks.body}
              </p>
              <Link href="/register" className="mu-btn-primary mt-7 px-6 py-3">
                {t.shortLinks.cta}
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Analytics */}
        <section className="bg-ink px-5 py-20 text-white md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wider text-[#c6f432]">{t.analytics.eyebrow}</p>
              <BigTitle>{t.analytics.title}</BigTitle>
              <p className="mt-4 text-lg text-white/65">{t.analytics.body}</p>
            </Reveal>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <Reveal className="md:col-span-2">
                <div className="h-full rounded-[2rem] bg-white/[0.06] p-6 ring-1 ring-white/10">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-white/60">{t.analytics.last14}</p>
                      <p className="mt-1 font-display text-4xl font-extrabold tabular-nums">{t.analytics.total}</p>
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
                    <p className="text-sm text-white/60">{t.analytics.topSources}</p>
                    {t.analytics.sources.map((label, i) => (
                      <div key={label}>
                        <div className="mb-1 flex justify-between text-sm font-semibold">
                          <span>{label}</span>
                          <span className="tabular-nums text-white/60">{SOURCE_PCT[i]}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-[#c6f432]" style={{ width: `${SOURCE_PCT[i]}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 border-t border-white/10 pt-4">
                    {t.analytics.countries.map((c) => (
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
              <Eyebrow>{t.domain.eyebrow}</Eyebrow>
              <BigTitle>{t.domain.title}</BigTitle>
              <p className="mt-4 max-w-md text-lg text-meetup-muted">
                {t.domain.body}
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
                      <div className="rounded-full bg-white/20 py-2 text-center text-sm font-semibold backdrop-blur">{t.domain.portfolio}</div>
                      <div className="rounded-full bg-white/20 py-2 text-center text-sm font-semibold backdrop-blur">{t.domain.book}</div>
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
            <h2 className="mb-8 text-center font-display text-3xl font-extrabold tracking-tight md:text-4xl">{t.faqTitle}</h2>
            <FaqAccordion faqs={t.faqs} />
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
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-white md:text-6xl">{t.finalCta.title}</h2>
            <p className="mx-auto mt-3 max-w-sm text-white/75">{t.finalCta.body}</p>
            <div className="mx-auto mt-8 flex max-w-xl justify-center">
              <ClaimUsername lang={lang} variant="footer" buttonLabel={t.claim.getFree} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
