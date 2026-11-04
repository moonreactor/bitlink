"use client";

import Link from "next/link";
import { ClaimUsername } from "./ClaimUsername";
import { FaqAccordion } from "./FaqAccordion";
import { LandingNav } from "./LandingNav";
import { PhoneMockup } from "./PhoneMockup";
import { RotatingWord } from "./RotatingWord";

const SAMPLE_PROFILES = [
  { handle: "maya", label: "Creator", color: "#D2E823", ink: "#254F1A" },
  { handle: "hbo-vibes", label: "Brand", color: "#2665D6", ink: "#F3F3F1" },
  { handle: "funkbeats", label: "Musician", color: "#780016", ink: "#E9C0E9" },
  { handle: "clipcity", label: "Sports", color: "#E8EFD6", ink: "#1E2330" },
  { handle: "tonyride", label: "Athlete", color: "#E9C0E9", ink: "#1E2330" },
  { handle: "nightowl", label: "Podcaster", color: "#1E2330", ink: "#D2E823" },
];

const FEATURES = [
  {
    title: "Unlimited links",
    body: "Reorder, feature, schedule, and thumbnail every link — no caps.",
    bg: "#E9C0E9",
    ink: "#1E2330",
  },
  {
    title: "Themes & appearance",
    body: "Presets plus custom colors, fonts, and button styles that match your brand.",
    bg: "#2665D6",
    ink: "#F3F3F1",
  },
  {
    title: "Analytics",
    body: "Views, clicks, devices, and referrers so you know what converts.",
    bg: "#D2E823",
    ink: "#254F1A",
  },
  {
    title: "QR + email capture",
    body: "Print your QR offline and grow a list from your page visitors.",
    bg: "#780016",
    ink: "#E9C0E9",
  },
  {
    title: "Locks & schedule",
    body: "Gate the page or a link, and time drops for launches.",
    bg: "#E8EFD6",
    ink: "#1E2330",
  },
  {
    title: "Remove branding",
    body: "Ship a clean page that feels entirely yours.",
    bg: "#1E2330",
    ink: "#D2E823",
  },
];

export function LandingPage() {
  return (
    <div className="landing-root min-h-screen overflow-x-hidden bg-[#F3F3F1] text-[#1E2330]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>

      <div className="bg-[#780016] px-4 py-2.5 text-center text-sm font-semibold text-white">
        Everything included — no plans, no paywalls.{" "}
        <Link href="/register" className="underline underline-offset-2 hover:text-[#D2E823]">
          Create your Bitlink free →
        </Link>
      </div>

      <LandingNav />

      <main id="main">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#D2E823] pb-14 pt-8 md:pb-20 md:pt-12">
          <div className="landing-blob absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#c5db1a]/60 blur-3xl" />
          <div className="landing-blob-delayed absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[#254F1A]/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:gap-8 md:px-8">
            <div className="landing-rise">
              <h1 className="font-display max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight text-[#254F1A] sm:text-5xl md:text-[3.35rem] lg:text-[3.75rem]">
                A link in bio built for you.
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-[#254F1A]/85 md:text-[1.05rem]">
                One link to share everything you create, curate, and sell — from Instagram, TikTok,
                YouTube, and everywhere else. Free forever on the core.
              </p>
              <div className="mt-6">
                <ClaimUsername />
              </div>
            </div>

            <div className="landing-rise-delayed relative">
              <div className="absolute inset-6 rounded-[2.5rem] bg-[#2665D6] md:inset-4" />
              <div className="relative px-4 py-4 md:px-8 md:py-6">
                <PhoneMockup />
              </div>
            </div>
          </div>
        </section>

        {/* Customize */}
        <section id="features" className="bg-[#2665D6] px-5 py-20 text-[#F3F3F1] md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <div className="relative order-2 md:order-1">
              <div className="landing-float relative mx-auto max-w-sm">
                <div className="rounded-[2rem] bg-[#780016] p-5 shadow-2xl">
                  <div className="rounded-2xl bg-[#D2E823] p-4 text-[#254F1A]">
                    <p className="text-xs font-bold uppercase tracking-wide opacity-70">Live preview</p>
                    <p className="mt-1 font-display text-2xl font-extrabold">Billie</p>
                    <div className="mt-4 space-y-2">
                      {["New single", "Tour tickets", "Merch"].map((t) => (
                        <div
                          key={t}
                          className="rounded-full bg-[#254F1A] px-4 py-2.5 text-center text-sm font-bold text-[#D2E823]"
                        >
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="landing-float-delayed absolute -bottom-6 -right-4 rounded-2xl bg-[#E9C0E9] px-4 py-3 text-sm font-bold text-[#1E2330] shadow-lg">
                  Theme: Sunset
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-[#D2E823] md:text-5xl">
                Create and customize your Bitlink in minutes
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/90 md:text-lg">
                Connect all your content in one bio link. Pick a theme, tune colors and button
                styles, feature what matters, and ship — or tweak anytime without breaking your URL.
              </p>
              <Link
                href="/register"
                className="mt-8 inline-flex rounded-full bg-[#D2E823] px-6 py-3.5 text-sm font-bold text-[#254F1A] transition hover:scale-[1.02] hover:bg-[#c5db1a]"
              >
                Get started for free
              </Link>
            </div>
          </div>
        </section>

        {/* Share */}
        <section id="share" className="bg-[#780016] px-5 py-20 text-white md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-[#E9C0E9] md:text-5xl">
                Share your Bitlink anywhere you like
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 md:text-lg">
                Drop your URL on every platform. Use your QR code to bring offline traffic — posters,
                stickers, events — straight back to your page.
              </p>
              <Link
                href="/register"
                className="mt-8 inline-flex rounded-full bg-[#D2E823] px-6 py-3.5 text-sm font-bold text-[#1E2330] transition hover:scale-[1.02]"
              >
                Get started for free
              </Link>
            </div>
            <div className="relative mx-auto grid max-w-md grid-cols-2 gap-3">
              <div className="landing-float rounded-[1.5rem] bg-[#D2E823] p-4 text-[#254F1A]">
                <p className="text-xs font-bold opacity-70">QR</p>
                <div className="mt-3 grid grid-cols-5 gap-1">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-[2px] ${
                        [0, 1, 2, 4, 5, 6, 8, 10, 12, 14, 16, 18, 19, 20, 22, 23, 24].includes(i)
                          ? "bg-[#254F1A]"
                          : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="landing-float-delayed rounded-[1.5rem] bg-[#E9C0E9] p-4 text-[#1E2330]">
                <p className="text-xs font-bold opacity-70">Handle</p>
                <p className="mt-6 font-display text-xl font-extrabold">/yourname</p>
                <p className="mt-1 text-xs opacity-70">Copy · Share · Embed</p>
              </div>
              <div className="col-span-2 rounded-[1.5rem] bg-white/10 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-[#E9C0E9]">Works on</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Instagram", "TikTok", "YouTube", "X", "Email", "Print"].map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics */}
        <section id="analytics" className="bg-[#E8EFD6] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <div className="relative">
              <div className="grid grid-cols-2 gap-3">
                <div className="landing-float rounded-[1.75rem] bg-[#E9C0E9] p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#1E2330]/60">Sales vibe</p>
                  <p className="mt-2 font-display text-3xl font-extrabold text-[#1E2330]">2.3k</p>
                  <p className="text-sm text-[#1E2330]/70">clicks this week</p>
                </div>
                <div className="landing-float-delayed rounded-[1.75rem] bg-[#2665D6] p-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-wide text-white/70">Visits</p>
                  <p className="mt-2 font-display text-3xl font-extrabold">18.4k</p>
                  <p className="text-sm text-white/80">unique views</p>
                </div>
                <div className="col-span-2 rounded-[1.75rem] bg-white p-5 shadow-sm">
                  <p className="text-sm font-bold text-[#1E2330]">Top sources</p>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: "Instagram", pct: 48 },
                      { label: "TikTok", pct: 31 },
                      { label: "Direct / QR", pct: 21 },
                    ].map((row) => (
                      <div key={row.label}>
                        <div className="mb-1 flex justify-between text-xs font-semibold text-[#1E2330]/70">
                          <span>{row.label}</span>
                          <span>{row.pct}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#E8EFD6]">
                          <div
                            className="h-full rounded-full bg-[#254F1A] transition-all duration-700"
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-[#1E2330] md:text-5xl">
                Analyze your audience and keep them engaged
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#1E2330]/75 md:text-lg">
                Track engagement over time, see what converts, and update your page on the fly —
                featured links, schedules, and locks included.
              </p>
              <Link
                href="/register"
                className="mt-8 inline-flex rounded-full bg-[#E9C0E9] px-6 py-3.5 text-sm font-bold text-[#1E2330] transition hover:scale-[1.02]"
              >
                Get started for free
              </Link>
            </div>
          </div>
        </section>

        {/* Social proof + rotating word */}
        <section className="bg-[#F3F3F1] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display mx-auto max-w-3xl text-center text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
              The link in bio built for{" "}
              <RotatingWord className="text-[#2665D6]" />
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-[#1E2330]/65">
              Free core features — themes, analytics, QR, locks, scheduling, email capture.
            </p>

            <div className="mt-12 flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {SAMPLE_PROFILES.map((p) => (
                <div
                  key={p.handle}
                  className="landing-float min-w-[160px] flex-1 rounded-[1.75rem] p-5 shadow-sm"
                  style={{ background: p.color, color: p.ink }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-extrabold"
                    style={{ background: p.ink, color: p.color }}
                  >
                    {p.handle.slice(0, 2).toUpperCase()}
                  </div>
                  <p className="mt-4 font-display text-lg font-extrabold">/{p.handle}</p>
                  <p className="text-sm opacity-75">{p.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bento features */}
        <section className="bg-[#F3F3F1] px-5 pb-20 md:px-8 md:pb-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display max-w-2xl text-3xl font-extrabold tracking-tight md:text-4xl">
              The fast, friendly, and powerful link in bio — every feature unlocked.
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <article
                  key={f.title}
                  className="group rounded-[1.75rem] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ background: f.bg, color: f.ink }}
                >
                  <h3 className="font-display text-xl font-extrabold">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed opacity-85">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-white px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-display mb-10 text-center text-3xl font-extrabold tracking-tight md:text-5xl">
              Questions? Answered
            </h2>
            <FaqAccordion />
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#780016] px-5 py-20 text-center md:px-8 md:py-28">
          <h2 className="font-display mx-auto max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-[#E9C0E9] md:text-5xl">
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

      <footer className="bg-[#1E2330] px-5 py-14 text-[#F3F3F1] md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
          <div>
            <p className="font-display text-2xl font-extrabold">
              Bitlink<span className="text-[#D2E823]">*</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-white/60">
              Your links, one page. Free forever on the core.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">Product</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-[#D2E823]">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#analytics" className="hover:text-[#D2E823]">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#D2E823]">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">Account</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/login" className="hover:text-[#D2E823]">
                    Log in
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-[#D2E823]">
                    Sign up free
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">Company</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <span className="text-white/50">Moonreactor</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} Bitlink. Built for creators who want one link that does it
          all.
        </div>
      </footer>
    </div>
  );
}
