import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "acortador-de-links-gratis-sin-limite",
  slug: "free-url-shortener-no-limits",
  category: "comparativas",
  title: "Free URL shortener with no limits: what to look for, what to avoid and how to choose",
  seoTitle: "Free URL shortener with no limits: how to choose",
  description:
    "What a URL shortener is, which features matter (back-half, UTMs, QR codes, rules, analytics) and which limits to check before picking a free one.",
  published: "2026-11-11",
  keywords: ["free url shortener", "url shortener", "shorten links", "bitly alternative", "custom short link"],
  tldr:
    "A **URL shortener** turns a long URL into a short, trackable one (for example `bitlink.click/promo`). When choosing a free one, check the **monthly limit** on links, whether you can **customize** the ending, **edit the destination**, add **UTMs**, generate **QR codes** and see **analytics** without paying. Bitlink includes all of that with no caps.",
  takeaways: [
    "Custom back-half = more trust and more clicks.",
    "Editable destination = QR codes you never have to reprint.",
    "Device and country rules = one link for everyone.",
    "Make sure the free plan doesn't expire or disable links.",
  ],
  cover: { src: "/landing/1493225457124-a3eb161ffa5f-900x1100.webp", alt: "Man raising his hand through colored smoke" },
  body: [
    { type: "h2", text: "What a URL shortener is and what it's for" },
    {
      type: "p",
      text: "A shortener takes a long URL — with parameters, paths and codes — and replaces it with a short one that **redirects** to the destination. It's useful for sharing where space is tight, for keeping links tidy and, above all, for **measuring how many people clicked**.",
    },
    { type: "h2", text: "The features that matter" },
    {
      type: "table",
      head: ["Feature", "What it's for", "In Bitlink"],
      rows: [
        ["Custom back-half", "`/tickets` instead of `/x7Kp2`", "Yes, free"],
        ["Editable destination", "Change where it goes without changing the link", "Yes"],
        ["UTMs", "Attribute visits in Google Analytics", "Yes, via a form"],
        ["Device rules", "Mobile to one place, desktop to another", "Yes"],
        ["Country rules", "Local pricing or language", "Yes"],
        ["QR code", "Use the link in print", "Yes, PNG and SVG"],
        ["Analytics", "Clicks, countries, devices", "Yes"],
        ["Monthly limit", "How many links or clicks you can have", "No limit"],
      ],
    },
    { type: "h2", text: "What to avoid in a free shortener" },
    {
      type: "ul",
      items: [
        "**Low monthly caps** on new links that force you to pay mid-campaign.",
        "**Links that expire** or get disabled if you stop paying — a huge risk if the QR is already printed.",
        "**Interstitial pages with ads** before reaching the destination.",
        "**Analytics limited** to a few days on the free plan.",
        "**Shortener domains with a bad reputation** that some platforms or spam filters block.",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      text: "Before printing a QR code or launching a big campaign, confirm what happens to your links if the tool changes its plans or you stop using it.",
    },
    { type: "h2", text: "Link in bio + shortener in one account" },
    {
      type: "p",
      text: "Bitlink's advantage is that the shortener lives in the same account as your [link in bio](/blog/what-is-a-link-in-bio). Use the page for your socials and short links for campaigns, print, emails and ads, with analytics in the same dashboard.",
    },
    { type: "h2", text: "How to name your short links" },
    {
      type: "ol",
      items: [
        "**Short and pronounceable**: `/tour`, `/menu`, `/free-class`.",
        "**Unambiguous**: avoid mixing `0` and `o`, or `l` and `1`.",
        "**Hyphens** to separate words: `/black-friday`.",
        "**One link per channel** if you want to compare: `/tour-ig`, `/tour-email`.",
        "**No personal data** in the link (emails, ID numbers, phone numbers).",
      ],
    },
    { type: "cta", title: "A free shortener with no caps", text: "Short links with UTMs, rules, QR codes and analytics." },
  ],
  faqs: [
    { q: "Are there free URL shorteners with no limits?", a: "Yes. Bitlink lets you create unlimited short links with analytics, QR codes, UTMs and rules, with no paid plan." },
    { q: "Do short links affect SEO?", a: "Short links use redirects; for links within your own site, use the direct URL. For socials, campaigns and QR codes they're ideal." },
    { q: "Can I customize the short link?", a: "Yes. In Bitlink you choose the ending: bitlink.click/anything-you-want, if it's available." },
    { q: "What happens if I delete a short link?", a: "It stops redirecting. If it's printed on a QR code, edit the destination instead of deleting it." },
  ],
  related: ["short-links-utm-device-country-routing", "bitlink-vs-bitly", "editable-dynamic-qr-code"],
};

export default article;
