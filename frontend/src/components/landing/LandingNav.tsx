"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BitlinkLogo } from "@/components/BitlinkLogo";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#product", label: "Product" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
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
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-shadow ${
        scrolled ? "border-meetup-border shadow-meetup" : "border-meetup-border/60"
      }`}
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8"
        aria-label="Main navigation"
      >
        <BitlinkLogo height={30} priority />

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-semibold text-meetup-muted transition hover:bg-mist hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-ink transition hover:bg-mist"
          >
            Log in
          </Link>
          <Link href="/register" className="mu-btn-primary">
            Get your link
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link href="/register" className="mu-btn-primary px-4 py-2 text-xs">
            Get link
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-mist"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-3.5 w-4">
              <span
                className={`absolute left-0 top-0 h-0.5 w-full bg-ink transition ${
                  open ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-full bg-ink transition ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-3 h-0.5 w-full bg-ink transition ${
                  open ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-40 bg-ink/30 md:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute inset-x-3 top-[4.5rem] rounded-meetup-lg bg-white p-5 shadow-meetup-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-semibold text-ink hover:bg-mist"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-meetup-border pt-4">
              <Link href="/login" className="rounded-full px-4 py-3 text-center text-sm font-semibold">
                Log in
              </Link>
              <Link href="/register" className="mu-btn-primary w-full">
                Get your link
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
