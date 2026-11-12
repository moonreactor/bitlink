import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "que-es-un-link-en-bio",
  slug: "what-is-a-link-in-bio",
  category: "guias",
  title: "What is a link in bio and how to use it well: the complete 2026 guide",
  seoTitle: "What is a link in bio and how to use it (2026 guide)",
  description:
    "What a link in bio is, what it's for, what to put on it, how to order it and how to measure it. A practical guide with examples for Instagram, TikTok and YouTube.",
  published: "2026-11-06",
  keywords: ["what is a link in bio", "link in bio", "link in bio page", "bio link", "linktree", "link in bio meaning"],
  tldr:
    "A **link in bio** is a simple page with several links that you put in the single link slot on your profile (Instagram, TikTok, YouTube, X). Instead of choosing one destination, you share one link that leads to all of them: your shop, your socials, your latest video, your WhatsApp or a mailing list.",
  takeaways: [
    "It solves the “only one link” limit of many social networks.",
    "Ideally 3 to 7 visible links, with the most important at the top.",
    "Track clicks per link to see what works and reorder.",
    "With a short link and a QR code, the same link works offline too.",
  ],
  cover: { src: "/landing/1517841905240-472988babdf9-360x440.webp", alt: "Smiling woman in a denim jacket against a blue wall" },
  body: [
    { type: "h2", text: "Definition: what a link in bio is" },
    {
      type: "p",
      text: "A link in bio is a **mobile-first mini website** that gathers all your important links. The name comes from where it goes: the profile bio, which on many networks is the only place you can add a clickable link.",
    },
    {
      type: "p",
      text: "Tools like Bitlink, Linktree and others build that page for you: you pick a name (for example `bitlink.click/yourname`), add buttons and style it with your colors.",
    },
    { type: "h2", text: "What it's for" },
    {
      type: "ul",
      items: [
        "**Send traffic to several destinations** from a profile that only allows one.",
        "**Set priorities**: the most important thing on top, the rest below.",
        "**Change content without touching your bio**: update the page and the link stays the same.",
        "**Measure**: see how many people visit and what they click.",
        "**Sell and collect contacts**: products, tips, bookings or an email form.",
      ],
    },
    { type: "h2", text: "What to put on your link in bio" },
    {
      type: "p",
      text: "It depends on your goal, but almost every good link in bio mixes three kinds of links: **one for conversion** (buy, book, subscribe), **one for content** (latest video, release, article) and **one for contact** (WhatsApp, email).",
    },
    {
      type: "table",
      caption: "Ideas by profile type",
      head: ["Profile", "Recommended links"],
      rows: [
        ["Musician", "Latest release (Spotify embed), tickets, merch, YouTube, press contact"],
        ["Small business", "Catalog with prices, WhatsApp, shipping and payment info, reviews"],
        ["Content creator", "Latest video, brand collabs, newsletter, tips"],
        ["Restaurant", "Menu, bookings, delivery, Google Maps location, WhatsApp"],
        ["Coach / professional", "Booking calendar, services with prices, testimonials, LinkedIn"],
      ],
    },
    { type: "h2", text: "How to create a link in bio, step by step" },
    {
      type: "steps",
      name: "How to create a link in bio",
      items: [
        { title: "Pick the tool", text: "Choose one that doesn't cap your links and includes analytics. [Bitlink](/register) is free with no plans." },
        { title: "Claim your name", text: "Use the same handle as on your socials so it's easy to recognize." },
        { title: "Add your links", text: "Start with your main goal. Use action titles: “Get tickets”, “Book a session”." },
        { title: "Customize the design", text: "Profile photo, brand colors and a short bio that says what you do." },
        { title: "Paste it into your profiles", text: "Instagram, TikTok, YouTube, X, Threads, LinkedIn and your email signature." },
        { title: "Measure and adjust", text: "Check weekly which links get clicks and reorder." },
      ],
    },
    { type: "h2", text: "Best practices that increase clicks" },
    {
      type: "ol",
      items: [
        "**Less is more**: with more than 7 or 8 buttons people get lost. Group the rest into collections.",
        "**One highlight**: feature your main link or use a subtle animation so it's seen first.",
        "**Verb-first labels**: “Listen to the album” works better than “Spotify”.",
        "**Embedded content**: a Spotify or YouTube player keeps people on your page.",
        "**Schedule launches**: prepare the link and have it appear on the day and time of the drop.",
        "**Mention the link in your content**: “link in bio” at the end of a video or story still works.",
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Use a QR code too",
      text: "The same link in bio works in the physical world: print its QR code on your packaging, table or poster. See [how to create an editable QR code](/blog/editable-dynamic-qr-code).",
    },
    { type: "h2", text: "How to tell if your link in bio is working" },
    {
      type: "p",
      text: "The three basic metrics are page **views**, **clicks** per link and **CTR** (clicks ÷ views). It's also worth checking which network people come from and which country. We cover this in detail in [link in bio analytics](/blog/link-in-bio-analytics).",
    },
    { type: "cta" },
  ],
  faqs: [
    { q: "What does “link in bio” mean?", a: "It's the phrase used to say the link is in the profile bio. By extension, the page with several links that goes there is also called a link in bio." },
    { q: "How many links should I add?", a: "Between 3 and 7 visible links usually works best. If you have more, group them into collections or under headers." },
    { q: "Can a link in bio replace a website?", a: "For many creators and small businesses, yes: it shows products, contact info and content without maintaining a site. For large catalogs or blogs, combine it with a website." },
    { q: "Are there free link-in-bio tools with no limits?", a: "Yes. Bitlink offers unlimited links, analytics, QR codes and a custom domain with no paid plans." },
    { q: "Does a link in bio help SEO?", a: "Your link-in-bio page can be indexed by Google under your name. Fill in your profile's SEO title and description so it shows up well in results." },
  ],
  related: ["how-to-add-multiple-links-on-instagram", "link-in-bio-analytics", "free-linktree-alternatives"],
};

export default article;
