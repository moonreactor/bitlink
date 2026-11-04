"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Is Bitlink really free forever?",
    a: "Yes. Auth, unlimited links, themes, analytics, QR codes, email capture, scheduling, and locks are all included — no plans or paywalls on the core.",
  },
  {
    q: "Do I need a website to use Bitlink?",
    a: "No. Bitlink is your page. Share one URL on Instagram, TikTok, YouTube, email signatures, or print a QR for offline traffic.",
  },
  {
    q: "Can I schedule links and lock content?",
    a: "Yes. Schedule drops for a future window, feature important links, password-lock the whole page or individual links, and capture emails from visitors.",
  },
  {
    q: "How do analytics work?",
    a: "Track page views and link clicks with device and referrer context so you know what actually converts — then reorder or restyle on the fly.",
  },
  {
    q: "Can I hide the Bitlink CTA on my page?",
    a: "No. Every public page shows a “Create your Bitlink” call to action so visitors can start their own page. It can’t be turned off.",
  },
  {
    q: "Is my Bitlink safe to put on every social profile?",
    a: "Your public page only exposes what you publish. Use profile or link locks when you need gated content.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto w-full max-w-3xl divide-y divide-meetup-border">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="text-lg font-bold text-ink md:text-xl">{item.q}</span>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                  isOpen ? "bg-meetup-purple text-white" : "bg-mist text-ink"
                }`}
                aria-hidden
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-12 text-base leading-relaxed text-meetup-muted">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
