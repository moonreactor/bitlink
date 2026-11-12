import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "lanzamiento-bitlink",
  slug: "introducing-bitlink",
  category: "novedades",
  title: "Introducing Bitlink: a free link in bio and URL shortener with no plans or monthly caps",
  seoTitle: "Introducing Bitlink: free link in bio + short links",
  description:
    "Bitlink is live: a link-in-bio page and a URL shortener with QR codes, UTMs and analytics — all free, with no paid plans.",
  published: "2026-11-04",
  keywords: ["bitlink", "free link in bio", "free url shortener", "linktree alternative", "launch"],
  tldr:
    "**Bitlink** is a free tool that combines two things you usually pay for separately: a **link-in-bio page** (bitlink.click/yourname) and a **URL shortener** with QR codes, UTMs and analytics. There are no paid plans and no monthly caps on links or clicks.",
  takeaways: [
    "Unlimited links on your page and unlimited short links.",
    "Analytics for views, clicks, sources and countries, with CSV export.",
    "Custom domain, products, tips and email capture included.",
    "No card and no plans: every feature is available to everyone.",
  ],
  cover: { src: "/landing/1459749411175-04bf5292ceea-900x600.webp", alt: "Crowd with raised hands in front of a lit concert stage" },
  body: [
    { type: "h2", text: "What Bitlink is" },
    {
      type: "p",
      text: "Bitlink is a **link-in-bio and short link platform**. One account gives you a public page at `bitlink.click/yourname` for everything you share — music, videos, products, bookings, socials — and a shortener to create links like `bitlink.click/promo` that you can track and edit whenever you want.",
    },
    {
      type: "p",
      text: "The idea is simple: most creators, small businesses and brands end up paying for one tool for their link in bio and another to shorten links, and still hit monthly limits. Bitlink does both in one place, **free and with no plans**.",
    },
    { type: "h2", text: "What's included from day one" },
    {
      type: "table",
      caption: "Features available at launch",
      head: ["Feature", "What it does", "Cost"],
      rows: [
        ["Link-in-bio page", "Unlimited links, headers, list or grid collections, YouTube and Spotify embeds", "Free"],
        ["Short links", "Custom back-half, UTMs, device and country rules, editable destination", "Free"],
        ["QR codes", "Custom colors, logo in the center, PNG or SVG download", "Free"],
        ["Analytics", "Views, clicks, sources, countries, date ranges and CSV export", "Free"],
        ["Monetization", "Product cards with external checkout and a tip button", "Free, 0% commission"],
        ["Audience", "Email and phone capture, Google Analytics and Meta Pixel", "Free"],
        ["Control", "Scheduled links, password-protected links and profiles", "Free"],
        ["Branding", "Themes, fonts, backgrounds and custom domain", "Free"],
      ],
    },
    { type: "h2", text: "Why free, with no plans" },
    {
      type: "p",
      text: "We think having your own page and knowing which links work shouldn't depend on a monthly plan, so no feature is locked behind a paywall. In return, every public page shows a small **“Create your Bitlink”** button so visitors can build their own. That's how Bitlink grows.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Zero commission on sales",
      text: "Product cards link to your own checkout (Stripe, PayPal, Mercado Pago, Gumroad, etc.). Bitlink doesn't process payments or take a cut.",
    },
    { type: "h2", text: "Who it's for" },
    {
      type: "ul",
      items: [
        "**Musicians and artists**: releases, show dates, merch and a Spotify or YouTube player on the same page. See [link in bio for musicians](/blog/link-in-bio-for-musicians).",
        "**Content creators**: one link for Instagram, TikTok and YouTube, with stats on what gets clicked.",
        "**Small businesses**: a catalog with prices and checkout, without building an online store. See [how to sell on Instagram without a store](/blog/sell-on-instagram-without-a-store).",
        "**Restaurants and shops**: menu, bookings and WhatsApp behind an editable QR code. See [QR code menus for restaurants](/blog/qr-code-menu-for-restaurants).",
        "**Brands and agencies**: short links with UTMs and a custom domain to measure every campaign.",
      ],
    },
    { type: "h2", text: "How to get started" },
    {
      type: "steps",
      name: "How to create your Bitlink",
      items: [
        { title: "Claim your name", text: "Go to [bitlink.click/register](/register) and pick your username. Your page lives at bitlink.click/yourname." },
        { title: "Add what you share", text: "Links, videos, songs, products, a tip button or an email sign-up form." },
        { title: "Pick a look", text: "Try themes, fonts and backgrounds until it looks like your brand." },
        { title: "Share it everywhere", text: "Paste the link in your Instagram, TikTok and YouTube bio, or print the QR code. Then check your analytics." },
      ],
    },
    { type: "cta" },
  ],
  faqs: [
    { q: "Is Bitlink really free?", a: "Yes. Every feature — unlimited links, short links, QR codes, analytics, custom domain and products — is included at no cost. There are no premium plans." },
    { q: "Do I need a credit card to sign up?", a: "No. Just an email and a password." },
    { q: "Does Bitlink take a commission on sales?", a: "No. Products link to your own checkout and Bitlink is not involved in the payment." },
    { q: "Can I remove the “Create your Bitlink” button?", a: "No. It's how Bitlink sustains itself without charging for plans." },
  ],
  related: ["what-is-a-link-in-bio", "short-links-utm-device-country-routing", "free-linktree-alternatives"],
};

export default article;
