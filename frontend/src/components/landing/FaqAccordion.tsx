"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Is it free?",
    a: "Yes. Link-in-bio, short links, themes, analytics, QR, email/phone capture, scheduling, and locks — all included. No plans.",
  },
  {
    q: "Short links too?",
    a: "Yes. Unlimited shorts with custom back-halves, UTMs, editable destinations, click stats, and QR — unlike Bitly’s free cap.",
  },
  {
    q: "Do I need a website?",
    a: "No. Bitlink is your page. Put one URL on Instagram, TikTok, YouTube, or print a QR.",
  },
  {
    q: "Can I lock or schedule links?",
    a: "Yes. Password-lock the page or a link, and schedule when links appear.",
  },
  {
    q: "Can I hide the Bitlink CTA?",
    a: "No. Every public page shows “Create your Bitlink” so visitors can start their own.",
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
