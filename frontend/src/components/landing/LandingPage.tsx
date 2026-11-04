"use client";

import Link from "next/link";
import { BitlinkLogo } from "@/components/BitlinkLogo";
import { ClaimUsername } from "./ClaimUsername";
import { FaqAccordion } from "./FaqAccordion";
import { LandingNav } from "./LandingNav";
import { PhoneMockup } from "./PhoneMockup";

const STEPS = [
  {
    n: "1",
    title: "Claim",
    visual: (
      <div className="flex h-full items-center justify-center rounded-2xl bg-white px-4 py-6 shadow-meetup">
        <p className="font-display text-lg font-bold text-ink">
          bitlink.app/<span className="text-meetup-purple">you</span>
        </p>
      </div>
    ),
  },
  {
    n: "2",
    title: "Add links",
    visual: (
      <div className="space-y-2 rounded-2xl bg-white p-4 shadow-meetup">
        {["Shop", "YouTube", "Book me"].map((t) => (
          <div
            key={t}
            className="rounded-full bg-meetup-lavender px-4 py-2.5 text-center text-sm font-bold text-meetup-purple"
          >
            {t}
          </div>
        ))}
      </div>
    ),
  },
  {
    n: "3",
    title: "Share",
    visual: (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white p-5 shadow-meetup">
        <div className="grid grid-cols-5 gap-1">
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
        <p className="text-xs font-semibold text-meetup-muted">QR · bio · stories</p>
      </div>
    ),
  },
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
        {/* Hero — one composition */}
        <section className="relative overflow-hidden bg-gradient-to-b from-meetup-lavender/70 via-white to-white px-5 pb-16 pt-10 md:px-8 md:pb-24 md:pt-14">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-8">
            <div className="landing-rise">
              <p className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl md:text-[3.5rem] md:leading-[1.05]">
                bitlink
              </p>
              <h1 className="mt-3 max-w-lg text-2xl font-semibold leading-snug text-ink/85 md:text-3xl">
                Link-in-bio + short links, free forever.
              </h1>
              <p className="mt-3 max-w-md text-base leading-relaxed text-meetup-muted">
                Unlimited shorts, products, and your own domain — no caps, no plans.
              </p>
              <div className="mt-7">
                <ClaimUsername buttonLabel="Claim free" />
              </div>
            </div>

            <div className="landing-rise-delayed relative mx-auto w-full max-w-[340px]">
              <div className="absolute -inset-3 rounded-[2rem] bg-meetup-purple/10 md:-inset-4" />
              <div className="relative">
                <PhoneMockup />
              </div>
            </div>
          </div>
        </section>

        {/* How it works — visual steps */}
        <section id="how" className="border-y border-meetup-border bg-meetup-bg px-5 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mu-section-title text-center">Three steps. Done.</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.n} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                      {step.n}
                    </span>
                    <p className="font-display text-lg font-bold">{step.title}</p>
                  </div>
                  <div className="min-h-[160px]">{step.visual}</div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link href="/register" className="mu-btn-primary px-8 py-3.5 text-base">
                Create my Bitlink
              </Link>
            </div>
          </div>
        </section>

        {/* Product — image tells the story */}
        <section id="product" className="px-5 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-6xl space-y-16">
            {/* Customize */}
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div className="order-2 md:order-1">
                <div className="relative overflow-hidden rounded-[1.75rem] bg-[#212121] p-6 shadow-meetup-lg md:p-8">
                  <div className="mx-auto max-w-[220px] space-y-3">
                    <div className="mx-auto h-14 w-14 rounded-full bg-meetup-lavender" />
                    <div className="h-3 w-24 mx-auto rounded-full bg-white/30" />
                    <div className="space-y-2 pt-2">
                      {["#D2E823", "#E9C0E9", "#FFFFFF"].map((c) => (
                        <div
                          key={c}
                          className="h-11 rounded-full"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {["#7050D1", "#F64060", "#0EA5E9", "#10B981"].map((c) => (
                      <span
                        key={c}
                        className="h-8 w-8 rounded-full ring-2 ring-white/40"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="mu-section-title">Make it yours</h2>
                <p className="mt-3 text-meetup-muted">Themes, colors, featured links.</p>
                <Link href="/register" className="mu-btn-secondary mt-6">
                  Start free
                </Link>
              </div>
            </div>

            {/* Short links */}
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div>
                <h2 className="mu-section-title">Short links that work</h2>
                <p className="mt-3 text-meetup-muted">
                  Custom back-halves, UTMs, device/geo rules, QR — no monthly cap.
                </p>
                <Link href="/register" className="mu-btn-primary mt-6">
                  Create shorts free
                </Link>
              </div>
              <div className="mu-card space-y-3 p-5 md:p-6">
                {[
                  { code: "bitlink.click/promo", clicks: "1.2k" },
                  { code: "bitlink.click/ig", clicks: "840" },
                  { code: "bitlink.click/qr", clicks: "312" },
                ].map((row) => (
                  <div
                    key={row.code}
                    className="flex items-center justify-between gap-3 rounded-xl bg-mist px-4 py-3"
                  >
                    <span className="truncate font-semibold text-meetup-purple">{row.code}</span>
                    <span className="text-xs font-bold tabular-nums text-meetup-muted">
                      {row.clicks}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics */}
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div>
                <h2 className="mu-section-title">See what clicks</h2>
                <p className="mt-3 text-meetup-muted">Views, sources, devices — live.</p>
                <Link href="/register" className="mu-btn-primary mt-6">
                  Open my page
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="mu-card p-5">
                  <p className="text-xs font-bold text-meetup-muted">Clicks</p>
                  <p className="mt-2 font-display text-4xl font-extrabold">2.3k</p>
                </div>
                <div className="mu-card bg-meetup-purple p-5 text-white">
                  <p className="text-xs font-bold text-white/70">Visits</p>
                  <p className="mt-2 font-display text-4xl font-extrabold">18k</p>
                </div>
                <div className="mu-card col-span-2 space-y-3 p-5">
                  {[
                    { label: "Instagram", pct: 52 },
                    { label: "TikTok", pct: 28 },
                    { label: "QR", pct: 20 },
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

            {/* Products / offers */}
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div className="order-2 space-y-3 md:order-1">
                {[
                  { title: "1:1 coaching", price: "$49", tone: "bg-meetup-lavender text-meetup-purple" },
                  { title: "Preset pack", price: "$12", tone: "bg-mist text-ink" },
                  { title: "Merch drop", price: "Shop", tone: "bg-black text-white" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-2xl border border-meetup-border bg-white p-3 shadow-meetup"
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${item.tone}`}>
                      {item.price}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">{item.title}</p>
                      <p className="text-xs text-meetup-muted">External checkout · MP, Stripe, Gumroad</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-meetup-purple">Buy →</span>
                  </div>
                ))}
              </div>
              <div className="order-1 md:order-2">
                <h2 className="mu-section-title">Sell from your page</h2>
                <p className="mt-3 text-meetup-muted">
                  Product cards with price and checkout link — no marketplace fees from us.
                </p>
                <Link href="/register" className="mu-btn-secondary mt-6">
                  Add a product
                </Link>
              </div>
            </div>

            {/* Custom domain */}
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div>
                <h2 className="mu-section-title">Your domain. Your page.</h2>
                <p className="mt-3 text-meetup-muted">
                  Verify with a TXT record, CNAME to Bitlink, go live on links.yourbrand.com.
                </p>
                <Link href="/register" className="mu-btn-primary mt-6">
                  Connect a domain
                </Link>
              </div>
              <div className="overflow-hidden rounded-[1.75rem] border border-meetup-border bg-meetup-bg p-5 shadow-meetup md:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-meetup-muted">
                  Browser
                </p>
                <div className="mt-3 flex items-center gap-2 rounded-full bg-white px-3 py-2.5 shadow-sm ring-1 ring-meetup-border">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                  <p className="truncate font-mono text-sm font-semibold text-ink">
                    links.yourbrand.com
                  </p>
                </div>
                <div className="mt-4 space-y-2 rounded-2xl bg-[#212121] p-4">
                  <div className="mx-auto h-10 w-10 rounded-full bg-meetup-lavender" />
                  <div className="mx-auto h-2.5 w-20 rounded-full bg-white/35" />
                  <div className="space-y-2 pt-2">
                    <div className="h-9 rounded-full bg-[#D2E823]" />
                    <div className="h-9 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social strip — visual only */}
        <section className="border-y border-meetup-border bg-meetup-bg px-5 py-12 md:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 md:gap-4">
            {["Instagram", "TikTok", "YouTube", "X", "Email", "QR"].map((p) => (
              <span
                key={p}
                className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink shadow-meetup"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="mt-5 text-center text-sm font-semibold text-meetup-muted">
            One URL. Everywhere you show up.
          </p>
        </section>

        {/* FAQ compact */}
        <section id="faq" className="px-5 py-14 md:px-8 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mu-section-title mb-8 text-center">FAQ</h2>
            <FaqAccordion />
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-black px-5 py-16 text-center md:px-8 md:py-20">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Claim your name.
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-white/65">No card. No plan. Just your link.</p>
          <div className="mx-auto mt-8 flex max-w-xl justify-center">
            <ClaimUsername variant="footer" buttonLabel="Get Bitlink free" />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#1a1a1a] px-5 py-10 text-white md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <BitlinkLogo onDark height={26} />
          <div className="flex flex-wrap gap-4 text-sm text-white/60">
            <Link href="/login" className="hover:text-white">
              Log in
            </Link>
            <Link href="/register" className="hover:text-white">
              Sign up
            </Link>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl text-xs text-white/35">
          © {new Date().getFullYear()} Bitlink
        </p>
      </footer>
    </div>
  );
}
