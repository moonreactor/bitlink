import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "alternativas-gratis-a-linktree",
  slug: "free-linktree-alternatives",
  category: "comparativas",
  title: "Free Linktree alternatives in 2026: what to check before you choose",
  seoTitle: "Free Linktree alternatives in 2026",
  description:
    "A checklist for choosing a free Linktree alternative: limits, analytics, custom domain, selling, QR codes and short links. With a Bitlink comparison.",
  published: "2026-11-12",
  keywords: ["linktree alternatives", "free linktree alternative", "linktree free", "best link in bio", "linktree vs bitlink"],
  tldr:
    "Before choosing a Linktree alternative, check **which features sit behind a paid plan**: detailed analytics, custom domain, removing limits, email capture and commissions on sales. **Bitlink** is an alternative that includes all of that for free and adds a **URL shortener** with QR codes and UTMs in the same account.",
  takeaways: [
    "Look at the real free plan: what's locked and what's capped.",
    "Analytics by source and country are often paid features elsewhere.",
    "Check whether they take a commission on your sales.",
    "A built-in shortener saves you paying for a second tool.",
  ],
  cover: { src: "/landing/1571019613454-1cb2f99b2d8b-900x1100.webp", alt: "Woman doing crunches on a mat next to a window" },
  body: [
    { type: "h2", text: "Why look for a Linktree alternative" },
    {
      type: "p",
      text: "Linktree popularized the link in bio and is still a well-known option. But many people look for alternatives because they need features that various tools put in paid plans — richer analytics, a custom domain, more customization or commission-free selling — or because they're also paying for a separate link shortener.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Prices and plans change",
      text: "We don't list other tools' prices because they change often. Use the checklist below and verify on each tool's official site before deciding.",
    },
    { type: "h2", text: "Checklist: 10 questions before you choose" },
    {
      type: "ol",
      items: [
        "How many links can I add for free?",
        "Do the **analytics** show clicks per link, sources and countries, or only views?",
        "Can I choose how many days of history to see and **export** the data?",
        "Can I use my **custom domain** without paying?",
        "Can I **sell** products? Do they take a **commission** per sale?",
        "Can I **collect emails** or phone numbers?",
        "Does it support **embeds** from YouTube and Spotify?",
        "Can I **schedule** links or protect them with a **password**?",
        "Does it include **short links** and editable **QR codes**?",
        "Can I connect **Google Analytics** or **Meta Pixel**?",
      ],
    },
    { type: "h2", text: "How Bitlink answers that checklist" },
    {
      type: "table",
      head: ["Question", "Bitlink"],
      rows: [
        ["Links on the page", "Unlimited"],
        ["Analytics", "Views, clicks per link, sources, countries, daily chart"],
        ["History and export", "Date ranges and CSV export"],
        ["Custom domain", "Included, free"],
        ["Products", "Cards with external checkout, 0% commission"],
        ["Contact capture", "Email and phone"],
        ["Embeds", "YouTube and Spotify"],
        ["Scheduling / password", "Yes, on links and on the profile"],
        ["Short links and QR codes", "Unlimited, with UTMs, device and country rules, PNG/SVG QR codes"],
        ["Pixels", "Google Analytics and Meta Pixel"],
        ["Paid plans", "None"],
      ],
    },
    { type: "h2", text: "What Bitlink doesn't do (yet)" },
    {
      type: "ul",
      items: [
        "It doesn't process payments: sales are charged on your own platform (Stripe, PayPal, etc.).",
        "You can't hide the “Create your Bitlink” button on public pages.",
        "Short links use the bitlink.click domain (the custom domain applies to your profile).",
      ],
    },
    {
      type: "p",
      text: "We'd rather be upfront: if you need a full store with inventory and shipping, an e-commerce platform will serve you better. If you need a fast, good-looking, measurable page for your socials, Bitlink has you covered.",
    },
    { type: "h2", text: "How to migrate from another tool" },
    {
      type: "steps",
      name: "How to migrate your link in bio to Bitlink",
      items: [
        { title: "List your current links", text: "Copy titles and URLs from your current page into a note." },
        { title: "Create your account", text: "Sign up at [Bitlink](/register) with the same username if it's available." },
        { title: "Add the links", text: "Paste each URL; Bitlink pulls the title and thumbnail automatically when it can." },
        { title: "Adjust the design", text: "Choose a theme, font and background." },
        { title: "Update your socials", text: "Replace the link on Instagram, TikTok, YouTube and in your QR codes." },
      ],
    },
    { type: "cta", title: "Try Bitlink for free", text: "Migrate in minutes. No card, no plans." },
  ],
  faqs: [
    { q: "What's the best free Linktree alternative?", a: "It depends on what you need. If you want unlimited links, analytics, a custom domain, commission-free selling and short links without paying, Bitlink covers all of that on its free tier." },
    { q: "Can I use the same username I have on Linktree?", a: "Yes, if it's available on Bitlink. Usernames are unique within each platform." },
    { q: "Will I lose followers if I change my link in bio?", a: "No. Only the link on your profile changes; your followers stay the same. Also update QR codes and email signatures." },
    { q: "Does Bitlink have an app?", a: "Bitlink works in the browser, on phone and desktop, with nothing to install." },
  ],
  related: ["free-url-shortener-no-limits", "bitlink-vs-linktree", "what-is-a-link-in-bio"],
};

export default article;
