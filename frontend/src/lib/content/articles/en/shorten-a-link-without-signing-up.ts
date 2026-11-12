import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "acortar-link-sin-registro",
  slug: "shorten-a-link-without-signing-up",
  category: "guias",
  title: "How to shorten a link without signing up (free, in 30 seconds)",
  seoTitle: "Shorten a link without signing up: free, no account",
  description:
    "Shorten any URL for free with no account: how it works, what to know about anonymous links, and when it's worth creating an account to keep and track them.",
  published: "2026-11-12",
  keywords: ["shorten a link without signing up", "free url shortener no account", "shorten url no registration", "anonymous link shortener"],
  tldr:
    "You can **shorten a link without an account** on [Bitlink's free URL shortener](/url-shortener): paste the URL, choose to stay anonymous and copy the short link. Anonymous links work right away and are **kept for 60 days**. If you create a free account, your links **never expire** and you can see how many people clicked each one.",
  takeaways: [
    "No sign-up, no card and no limit on how many links you shorten.",
    "Anonymous links are deleted after 60 days; links on a free account are not.",
    "Create an account later and the links you made on that device are added to it, with their clicks.",
    "Links to phishing or malware sites are rejected.",
  ],
  cover: { src: "/landing/1460925895917-afdab827c52f-360x440.webp", alt: "Laptop with a metrics dashboard and charts" },
  body: [
    { type: "h2", text: "Do you really need an account to shorten a link?" },
    {
      type: "p",
      text: "No. Most people only need a shorter URL to paste in a message, a bio or a printed flyer. Forcing a sign-up for that is friction. With Bitlink you paste the long URL, press **Shorten** and get a link like `bitlink.click/k3x9p2q` immediately.",
    },
    {
      type: "steps",
      name: "How to shorten a link without signing up",
      items: [
        { title: "Open the shortener", text: "Go to the [free URL shortener](/url-shortener) — no login needed." },
        { title: "Paste your long URL", text: "Any `http` or `https` link works. If you forget the `https://`, it's added for you." },
        { title: "Press Shorten", text: "You'll be asked if you want to track the link with a free account or stay anonymous. Both are fine." },
        { title: "Copy and share", text: "Use the copy button and paste the short link anywhere: social bios, messages, emails or a QR code." },
      ],
    },
    { type: "h2", text: "What to know about anonymous links" },
    {
      type: "ul",
      items: [
        "**They're kept for 60 days.** After that, unclaimed anonymous links are deleted so the web doesn't fill up with dead links nobody owns.",
        "**You can't edit them.** There's no account attached, so the destination can't be changed later.",
        "**Clicks are still counted.** The count starts from the first click; you just can't see it until you claim the link.",
        "**There's a fair-use limit.** A small number of links per hour per network, to keep spam out. A free account removes that worry.",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      text: "Don't use an anonymous link for something you'll print or rely on for months. Create a free account first so it never expires.",
    },
    { type: "h2", text: "Anonymous vs. free account" },
    {
      type: "table",
      head: ["", "Anonymous", "Free account"],
      rows: [
        ["Cost", "Free", "Free"],
        ["Needs sign-up", "No", "Yes (email)"],
        ["How long it lasts", "60 days", "No expiry"],
        ["See how many clicked", "No", "Yes"],
        ["Custom ending, UTMs, device and country rules", "No", "Yes"],
        ["Edit the destination later", "No", "Yes"],
        ["QR code", "No", "Yes"],
      ],
    },
    { type: "h2", text: "Changed your mind? Claim your links later" },
    {
      type: "p",
      text: "If you created a link anonymously and later sign up from the same browser, Bitlink adds those links to your new account automatically — including the clicks they already received. You don't have to do anything else.",
    },
    { type: "h2", text: "Is it safe?" },
    {
      type: "p",
      text: "Every destination is checked against Google Safe Browsing and links to phishing or malware are rejected. Shortening a link doesn't hide where it goes: anyone can still see the destination.",
    },
    {
      type: "cta",
      title: "Shorten a link now",
      text: "Free, no sign-up. Add an account only if you want to track or keep it.",
      href: "/url-shortener",
      label: "Open the shortener",
    },
  ],
  faqs: [
    { q: "Can I shorten a link without creating an account?", a: "Yes. Paste the URL in Bitlink's free shortener and copy the result. No email or password is required." },
    { q: "How long do anonymous short links last?", a: "60 days. After that, unclaimed anonymous links are deleted. Links on a free account don't expire." },
    { q: "Can I see how many people clicked an anonymous link?", a: "Not until you create an account. Sign up from the same browser and the link, with the clicks it already has, is added to your account." },
    { q: "Is there a limit on how many links I can shorten?", a: "There's no monthly cap. There's only a small hourly limit per network to prevent spam; a free account lifts that worry." },
  ],
  related: ["free-url-shortener-no-limits", "what-are-utm-parameters", "editable-dynamic-qr-code"],
};

export default article;
