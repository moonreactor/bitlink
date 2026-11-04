"use client";

import Link from "next/link";
import { ClaimUsername } from "./ClaimUsername";
import { FaqAccordion } from "./FaqAccordion";
import { LandingNav } from "./LandingNav";
import { PhoneMockup } from "./PhoneMockup";
import { RotatingWord } from "./RotatingWord";

const CATEGORIES = [
  { label: "Creators", color: "#7050D1" },
  { label: "Brands", color: "#F64060" },
  { label: "Musicians", color: "#0EA5E9" },
  { label: "Podcasters", color: "#10B981" },
  { label: "Artists", color: "#F59E0B" },
  { label: "Founders", color: "#8B5CF6" },
];

const FEATURE_CARDS = [
  {
    title: "Unlimited links",
    body: "Reorder, feature, schedule, and thumbnail every link — no caps.",
    tone: "bg-meetup-lavender text-meetup-purple",
  },
  {
    title: "Themes & appearance",
    body: "Presets plus custom colors, fonts, and button styles that match your brand.",
    tone: "bg-[#FFF0F3] text-meetup-pink",
  },
  {
    title: "Analytics",
    body: "Views, clicks, devices, and referrers so you know what converts.",
    tone: "bg-[#E8F4FF] text-[#0EA5E9]",
  },
  {
    title: "QR + email capture",
    body: "Print your QR offline and grow a list from your page visitors.",
    tone: "bg-[#E8F8F0] text-[#059669]",
  },
  {
    title: "Locks & schedule",
    body: "Gate the page or a link, and time drops for launches.",
    tone: "bg-[#FFF7E8] text-[#D97706]",
  },
  {
    title: "Always-on CTA",
    body: "Every public page invites visitors to create their own Bitlink — built-in growth.",
    tone: "bg-mist text-ink",
  },
];

const SAMPLE_PROFILES = [
  { handle: "maya", label: "Creator", img: "MC", bg: "#F1F0FF" },
  { handle: "hbo-vibes", label: "Brand", img: "HB", bg: "#FFF0F3" },
  { handle: "funkbeats", label: "Musician", img: "FB", bg: "#E8F4FF" },
  { handle: "clipcity", label: "Sports", img: "CC", bg: "#E8F8F0" },
  { handle: "tonyride", label: "Athlete", img: "TR", bg: "#FFF7E8" },
  { handle: "nightowl", label: "Podcaster", img: "NO", bg: "#F3E8FF" },
];

export function LandingPage() {
  return (
    <div className="landing-root min-h-screen overflow-x-hidden bg-white text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-meetup"
      >
        Skip to main content
      </a>

      <LandingNav />

      <main id="main">
        {/* Promo banner — Meetup style */}
        <div className="bg-meetup-lavender px-5 py-3.5 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm font-semibold text-ink md:text-base">
              Create your own page and start sharing everything today!
            </p>
            <Link href="/register" className="mu-btn-primary shrink-0">
              Start now
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section className="border-b border-meetup-border bg-white px-5 pb-16 pt-12 md:px-8 md:pb-20 md:pt-16">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-10">
            <div className="landing-rise">
              <p className="mb-3 inline-flex rounded-full bg-meetup-lavender px-3 py-1 text-xs font-bold uppercase tracking-wide text-meetup-purple">
                Link in bio · free forever
              </p>
              <h1 className="font-display max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-[3.4rem]">
                Everything you are, in one simple link.
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-meetup-muted md:text-lg">
                Join creators using Bitlink for their link in bio. One URL for Instagram, TikTok,
                YouTube, and everywhere else — themes, analytics, QR, and locks included.
              </p>
              <div className="mt-7">
                <ClaimUsername />
              </div>
            </div>

            <div className="landing-rise-delayed relative flex justify-center">
              <div className="absolute inset-y-6 left-6 right-6 rounded-meetup-lg bg-meetup-lavender md:inset-4" />
              <div className="relative px-4 py-6">
                <PhoneMockup />
              </div>
            </div>
          </div>
        </section>

        {/* Category chips */}
        <section className="border-b border-meetup-border bg-white px-5 py-8 md:px-8">
          <div className="mx-auto flex max-w-6xl gap-5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((c) => (
              <div key={c.label} className="flex min-w-[88px] flex-col items-center gap-2">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold text-white"
                  style={{ background: c.color }}
                >
                  {c.label[0]}
                </span>
                <span className="whitespace-nowrap text-xs font-semibold text-meetup-muted">
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-meetup-bg px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="mu-section-title">Create and customize in minutes</h2>
                <p className="mt-3 max-w-xl text-meetup-muted">
                  Connect your content, pick a theme, and ship. Tweak anytime without breaking your
                  URL.
                </p>
              </div>
              <Link href="/register" className="mu-btn-secondary shrink-0">
                Get started for free
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURE_CARDS.map((f) => (
                <article
                  key={f.title}
                  className="mu-card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-meetup-lg"
                >
                  <div className={`px-5 py-8 ${f.tone}`}>
                    <p className="font-display text-xl font-bold">{f.title}</p>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm leading-relaxed text-meetup-muted">{f.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Share */}
        <section id="share" className="bg-white px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mu-section-title">Share your Bitlink anywhere</h2>
              <p className="mt-4 max-w-md text-meetup-muted md:text-lg">
                Drop your URL on every platform. Use your QR code to bring offline traffic — posters,
                stickers, events — straight back to your page.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Instagram", "TikTok", "YouTube", "X", "Email", "Print"].map((p) => (
                  <span key={p} className="mu-chip">
                    {p}
                  </span>
                ))}
              </div>
              <Link href="/register" className="mu-btn-primary mt-8">
                Get started for free
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="mu-card p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-meetup-muted">QR</p>
                <div className="mt-4 grid grid-cols-5 gap-1">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-[2px] ${
                        [0, 1, 2, 4, 5, 6, 8, 10, 12, 14, 16, 18, 19, 20, 22, 23, 24].includes(i)
                          ? "bg-ink"
                          : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="mu-card bg-meetup-lavender p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-meetup-purple">Handle</p>
                <p className="mt-6 font-display text-xl font-extrabold text-ink">/yourname</p>
                <p className="mt-1 text-xs text-meetup-muted">Copy · Share · Embed</p>
              </div>
              <div className="mu-card col-span-2 flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold text-ink">Works offline too</p>
                  <p className="text-sm text-meetup-muted">Print QR from your dashboard</p>
                </div>
                <span className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white">
                  Free
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics */}
        <section id="analytics" className="bg-meetup-bg px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="mu-card p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-meetup-muted">Clicks</p>
                <p className="mt-2 font-display text-3xl font-extrabold text-ink">2.3k</p>
                <p className="text-sm text-meetup-muted">this week</p>
              </div>
              <div className="mu-card bg-meetup-purple p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-wide text-white/70">Visits</p>
                <p className="mt-2 font-display text-3xl font-extrabold">18.4k</p>
                <p className="text-sm text-white/80">unique views</p>
              </div>
              <div className="mu-card col-span-2 p-5">
                <p className="text-sm font-bold text-ink">Top sources</p>
                <div className="mt-4 space-y-3">
                  {[
                    { label: "Instagram", pct: 48 },
                    { label: "TikTok", pct: 31 },
                    { label: "Direct / QR", pct: 21 },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="mb-1 flex justify-between text-xs font-semibold text-meetup-muted">
                        <span>{row.label}</span>
                        <span>{row.pct}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-mist">
                        <div
                          className="h-full rounded-full bg-meetup-purple"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h2 className="mu-section-title">Analyze your audience and keep them engaged</h2>
              <p className="mt-4 max-w-md text-meetup-muted md:text-lg">
                Track engagement over time, see what converts, and update your page on the fly —
                featured links, schedules, and locks included.
              </p>
              <Link href="/register" className="mu-btn-secondary mt-8">
                Get started for free
              </Link>
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="bg-white px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mu-section-title mx-auto max-w-3xl text-center">
              The link in bio built for{" "}
              <RotatingWord className="text-meetup-purple" />
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-meetup-muted">
              Free core features — themes, analytics, QR, locks, scheduling, email capture.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SAMPLE_PROFILES.map((p) => (
                <div key={p.handle} className="mu-card overflow-hidden transition hover:shadow-meetup-lg">
                  <div
                    className="flex h-36 items-end p-4"
                    style={{ background: p.bg }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-extrabold text-ink shadow-meetup">
                      {p.img}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-display text-lg font-bold">/{p.handle}</p>
                    <p className="text-sm text-meetup-muted">{p.label}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-meetup-muted">
                      <span className="text-meetup-pink">★</span> 4.9 · trending
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-meetup-border bg-white px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mu-section-title mb-10 text-center">Questions? Answered</h2>
            <FaqAccordion />
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-meetup-purple px-5 py-16 text-center md:px-8 md:py-24">
          <h2 className="font-display mx-auto max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
            Jumpstart your corner of the internet today
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/80">
            Claim your username and launch in minutes. No credit card.
          </p>
          <div className="mx-auto mt-8 flex justify-center">
            <ClaimUsername variant="footer" buttonLabel="Claim your Bitlink" />
          </div>
        </section>
      </main>

      <footer className="bg-[#2C2C2C] px-5 py-12 text-white md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <p className="flex items-center gap-2 font-display text-xl font-bold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-meetup-pink text-xs text-white">
                B
              </span>
              bitlink
            </p>
            <p className="mt-2 max-w-xs text-sm text-white/55">
              Your links, one page. Free forever on the core.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#analytics" className="hover:text-white">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">Account</p>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                <li>
                  <Link href="/login" className="hover:text-white">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white">
                    Sign up free
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">Company</p>
              <ul className="mt-3 space-y-2 text-sm text-white/55">
                <li>Moonreactor</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} Bitlink.
        </div>
      </footer>
    </div>
  );
}
