import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "novedad-dominio-propio-y-productos",
  slug: "custom-domains-products-tips",
  category: "novedades",
  title: "New: custom domains, products, tips and contact capture on your Bitlink",
  seoTitle: "New: custom domains and products on Bitlink",
  description:
    "Your link in bio can now live on your own domain and show products with external checkout, a tip button and an email or phone sign-up form.",
  published: "2026-11-05",
  keywords: ["link in bio custom domain", "sell from link in bio", "tip jar", "email capture", "bitlink news"],
  tldr:
    "You can now publish your Bitlink on **your own domain** (for example `links.yourbrand.com`), add **product cards** that send people to your checkout with no commission, a **tip button** and a form to **collect emails or phone numbers**. All included for free.",
  takeaways: [
    "Custom domain: verify with a TXT record and point a CNAME.",
    "Products with image, price and a link to Stripe, PayPal, Mercado Pago or Gumroad.",
    "Tip button linked to Buy Me a Coffee, PayPal, Ko-fi or similar.",
    "Email or phone subscribers you own — no algorithm in the way.",
  ],
  cover: { src: "/landing/1490481651871-ab68de25d43d-360x440.webp", alt: "Rack of shirts and blouses in a clothing store" },
  body: [
    { type: "h2", text: "Custom domain" },
    {
      type: "p",
      text: "Your page can live at an address on your brand, like `links.yourbrand.com`, instead of `bitlink.click/yourname`. It strengthens your brand and makes people more comfortable clicking.",
    },
    {
      type: "p",
      text: "There are two parts: **verify** you own the domain with a TXT record, and **point** the subdomain to Bitlink with a CNAME. The full walkthrough is in [how to connect a custom domain to your link in bio](/blog/connect-custom-domain-link-in-bio).",
    },
    {
      type: "callout",
      tone: "warn",
      title: "About the SSL certificate",
      text: "HTTPS for your custom domain is set up at your DNS or hosting provider (for example, with Cloudflare's proxy). Without HTTPS, browsers flag the page as not secure.",
    },
    { type: "h2", text: "Products without an online store" },
    {
      type: "p",
      text: "In the **Products** section you create cards with a photo, name, description, price and a purchase link. The link can be a Stripe Payment Link, PayPal, Mercado Pago, Gumroad, Lemon Squeezy or your WhatsApp. **Bitlink takes no commission** because payment happens outside the platform.",
    },
    {
      type: "ul",
      items: [
        "Great for courses, training programs, presets, merch, tickets and services.",
        "Cards show on your page alongside your other links.",
        "Every click is recorded in your analytics.",
      ],
    },
    { type: "p", text: "Building a full catalog? See [how to sell on Instagram without an online store](/blog/sell-on-instagram-without-a-store)." },
    { type: "h2", text: "Tip button" },
    {
      type: "p",
      text: "Turn on a tip button with any label you like (“Buy me a coffee ☕”) and connect it to your Buy Me a Coffee, Ko-fi, PayPal or Mercado Pago link. It's the simplest way for your community to support you.",
    },
    { type: "h2", text: "Email and phone capture" },
    {
      type: "p",
      text: "A form on your page where people leave their email (and optionally their phone number). It's your own list: if a social network changes its algorithm tomorrow, you can still tell your audience about a launch.",
    },
    { type: "h2", text: "How to turn it on" },
    {
      type: "steps",
      name: "How to enable products, tips and a custom domain in Bitlink",
      items: [
        { title: "Products", text: "Dashboard → Products → add a photo, title, price and payment link." },
        { title: "Tips", text: "Dashboard → Settings → enable the tip button and paste your payment link." },
        { title: "Contact capture", text: "Dashboard → Settings → enable the email form and, if you want, the phone field." },
        { title: "Custom domain", text: "Dashboard → Settings → Custom domain → enter your domain, add the TXT and CNAME records and verify." },
      ],
    },
    { type: "cta" },
  ],
  faqs: [
    { q: "Does Bitlink process payments for my products?", a: "No. Each product links to your own checkout; the money goes straight to your account and Bitlink takes no commission." },
    { q: "Does the custom domain cost anything?", a: "Not on Bitlink. You only pay your registrar for the domain, like any domain." },
    { q: "Can I use the emails I collect?", a: "Yes. Contacts are stored in your account so you can use them in your campaigns." },
  ],
  related: ["connect-custom-domain-link-in-bio", "sell-on-instagram-without-a-store", "introducing-bitlink"],
};

export default article;
