"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#share", label: "Share" },
  { href: "#analytics", label: "Analytics" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 md:px-5 ${
          scrolled
            ? "bg-white/95 shadow-lg shadow-black/10 backdrop-blur-md"
            : "bg-white shadow-md shadow-black/5"
        }`}
        aria-label="Main navigation"
      >
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-[#1E2330]">
          Bitlink<span className="text-[#2665D6]">*</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-semibold text-[#1E2330]/80 transition hover:bg-[#F3F3F1] hover:text-[#1E2330]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#1E2330] transition hover:bg-[#F3F3F1]"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#1E2330] px-4 py-2.5 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-black"
          >
            Sign up free
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F3F1] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-3.5 w-4">
            <span
              className={`absolute left-0 top-0 h-0.5 w-full bg-[#1E2330] transition ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-full bg-[#1E2330] transition ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-full bg-[#1E2330] transition ${
                open ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-40 bg-[#1E2330]/40 md:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute inset-x-3 top-[4.5rem] rounded-[1.75rem] bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-semibold text-[#1E2330] hover:bg-[#F3F3F1]"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-[#1E2330]/10 pt-4">
              <Link
                href="/login"
                className="rounded-full px-4 py-3 text-center text-sm font-semibold text-[#1E2330]"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#1E2330] px-4 py-3 text-center text-sm font-bold text-white"
              >
                Sign up free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
