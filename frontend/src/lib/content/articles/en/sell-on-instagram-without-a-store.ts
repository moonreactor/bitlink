import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "vender-por-instagram-sin-tienda",
  slug: "sell-on-instagram-without-a-store",
  category: "guias",
  title: "How to sell on Instagram without an online store: catalog, payment links and WhatsApp",
  seoTitle: "How to sell on Instagram without an online store",
  description:
    "Build a catalog in your link in bio with prices and payment links from Stripe, PayPal or Mercado Pago. No store, no commission, with analytics.",
  published: "2026-11-09",
  keywords: ["sell on instagram", "sell without an online store", "stripe payment link", "link in bio catalog", "sell on whatsapp"],
  tldr:
    "To sell on Instagram **without an online store**, you need three things: a **simple catalog** in your link in bio (photo, name and price), a **payment link** per product (Stripe, PayPal, Mercado Pago or Gumroad) and a **contact** channel like WhatsApp or DMs. In Bitlink you build it with product cards, commission-free.",
  takeaways: [
    "Start with 3 to 6 products: your bestsellers or the new launch.",
    "One payment link per product avoids back-and-forth in DMs.",
    "Add WhatsApp for questions and a shipping section.",
    "Track which product gets the most clicks and adjust the order.",
  ],
  cover: { src: "/landing/1490481651871-ab68de25d43d-360x440.webp", alt: "Clothes hanging on a wooden rack" },
  body: [
    { type: "h2", text: "Do you need an online store to sell?" },
    {
      type: "p",
      text: "Not always. If you sell a handful of products, services, courses, tickets or made-to-order items, a full store can be overkill: inventory, templates, payment gateways and often a monthly subscription. To start, a **catalog in your link in bio** with payment links does the same job with much less work.",
    },
    {
      type: "table",
      head: ["", "Online store", "Link-in-bio catalog"],
      rows: [
        ["Cost", "Monthly subscription and/or commission", "Free on Bitlink, 0% commission"],
        ["Setup time", "Days", "Minutes"],
        ["Automatic inventory and shipping", "Yes", "No (handled separately)"],
        ["Best for", "Many products and variants", "Few products, services, digital goods, pre-orders"],
      ],
    },
    { type: "h2", text: "Step by step: build your catalog" },
    {
      type: "steps",
      name: "How to sell on Instagram with a link-in-bio catalog",
      items: [
        { title: "Create your payment links", text: "In Stripe, PayPal, Mercado Pago, Gumroad or Lemon Squeezy, create one payment link per product with its price." },
        { title: "Create your page", text: "Sign up at [Bitlink](/register) and pick your name." },
        { title: "Add products", text: "In Products, upload a photo, name, short description, price and the payment link." },
        { title: "Add contact and trust", text: "Add WhatsApp, a shipping and returns section, and reviews or customer screenshots." },
        { title: "Paste the link on Instagram", text: "Edit profile → Links. See [how to add multiple links on Instagram](/blog/how-to-add-multiple-links-on-instagram)." },
        { title: "Promote", text: "Show the product in Reels and Stories with “link in bio” and the link sticker." },
      ],
    },
    { type: "h2", text: "How to write product cards that sell" },
    {
      type: "ul",
      items: [
        "**A real, clear photo** with a clean background. It's the first thing people look at.",
        "**A specific name**: “12-week strength program” beats “Pro plan”.",
        "**Visible price**: hiding it creates DMs and drop-offs.",
        "**One-line benefit**: “Home workouts, 3 times a week”.",
        "**Honest urgency**: limited spots, pre-order or deadline only if they're real.",
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Pricing by country",
      text: "If you sell to several countries, use a [short link with country routing](/blog/short-links-utm-device-country-routing) to send each person to the checkout in their currency.",
    },
    { type: "h2", text: "More ways to monetize your page" },
    {
      type: "ul",
      items: [
        "**Tips**: a button to Buy Me a Coffee, Ko-fi or PayPal.",
        "**Email list**: announce launches and pre-sales without depending on the algorithm.",
        "**Scheduled links**: have the product appear right at launch time.",
        "**Password-protected links**: exclusive content or discounts for customers.",
      ],
    },
    { type: "h2", text: "How to measure sales" },
    {
      type: "p",
      text: "Bitlink shows how many clicks each product gets. Sales show up in your payment platform. To attribute each sale to a channel, add Google Analytics or Meta Pixel to your page from Settings and use [UTMs](/blog/what-are-utm-parameters) on your payment links.",
    },
    { type: "cta", title: "Sell from your link in bio", text: "Product cards with your own checkout. 0% commission." },
  ],
  faqs: [
    { q: "Does Bitlink take a commission on each sale?", a: "No. Payment happens on your platform (Stripe, PayPal, Mercado Pago, etc.) and the money goes straight to your account." },
    { q: "Can I sell digital products?", a: "Yes. Link to Gumroad, Lemon Squeezy or a payment link and deliver the file from that platform." },
    { q: "How many products can I add?", a: "There's no limit, but for conversion it's better to feature a few and group the rest." },
    { q: "Can I sell through WhatsApp from my link in bio?", a: "Yes. Add a WhatsApp link with a pre-filled message, for example “Hi, I'd like product X”." },
  ],
  related: ["custom-domains-products-tips", "how-to-add-multiple-links-on-instagram", "link-in-bio-analytics"],
};

export default article;
