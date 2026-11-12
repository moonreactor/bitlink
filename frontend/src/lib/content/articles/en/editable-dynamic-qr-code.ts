import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "codigo-qr-editable",
  slug: "editable-dynamic-qr-code",
  category: "guias",
  title: "How to create an editable (dynamic) QR code for free and change the destination after printing",
  seoTitle: "How to create an editable QR code for free",
  description:
    "What a dynamic QR code is, how it differs from a static one, and how to create one for free with your colors and logo so you can change the link without reprinting.",
  published: "2026-11-08",
  keywords: ["editable qr code", "free dynamic qr code", "change qr code link", "qr code with logo", "free qr code generator", "qr code menu"],
  tldr:
    "An **editable** (or dynamic) **QR code** doesn't point straight to the final destination — it points to a **short link** you control. If the promo, menu or form changes, you edit the short link's destination and **the printed QR code keeps working**. In Bitlink every short link and every profile has its own QR code, with colors, a logo and PNG or SVG download.",
  takeaways: [
    "Static QR: the destination is “baked in”; if it changes, you reprint.",
    "Dynamic QR: points to an editable short link and tracks scans.",
    "Use SVG for print and PNG for social or screens.",
    "Test the printed QR on several phones before a large print run.",
  ],
  cover: { src: "/landing/1441986300917-64674bd600d8-360x440.webp", alt: "Inside a clothing store with shelves, caps and pendant lamps" },
  body: [
    { type: "h2", text: "Static vs. dynamic QR codes" },
    {
      type: "table",
      head: ["", "Static QR", "Dynamic (editable) QR"],
      rows: [
        ["Where it points", "Straight to the final URL", "To a short link that redirects"],
        ["Can you change the destination?", "No, you have to generate and print a new one", "Yes, anytime"],
        ["Tracks scans?", "No", "Yes: clicks, countries, devices"],
        ["Code complexity", "Denser if the URL is long", "Simple, because the URL is short"],
        ["Best for", "Data that never changes (Wi-Fi, vCard)", "Menus, posters, packaging, events, campaigns"],
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Watch out for “free” generators",
      text: "Some generators create free dynamic QR codes and then deactivate them after a trial until you pay. If the QR is already printed, you're stuck. Pick a tool with no expiry.",
    },
    { type: "h2", text: "How to create an editable QR code for free" },
    {
      type: "steps",
      name: "How to create an editable QR code with Bitlink",
      items: [
        { title: "Create a short link", text: "In [Bitlink](/register), Short links → New. Pick a clear back-half, for example `bitlink.click/menu`." },
        { title: "Set the destination", text: "A PDF menu, your Google Maps listing, a form or your link-in-bio page." },
        { title: "Open the QR code", text: "Every short link has a QR code ready to download." },
        { title: "Customize it", text: "For your profile QR you can choose the foreground and background colors and show your avatar in the center." },
        { title: "Download the right format", text: "SVG for print (it never loses quality when enlarged) or PNG for social and screens." },
        { title: "Change the destination anytime", text: "Edit the short link; the printed QR code doesn't change." },
      ],
    },
    { type: "h2", text: "Best practices for reliable scanning" },
    {
      type: "ul",
      items: [
        "**High contrast**: dark foreground on a light background. Avoid light codes on dark backgrounds.",
        "**Minimum size**: as a rule of thumb, around 2 × 2 cm (0.8 in) for close-up scanning, and much larger for posters seen from a distance.",
        "**White margin** around the code (the “quiet zone”).",
        "**A label next to it**: “Scan to see the menu” increases scans because people know what will happen.",
        "**Small logo**: if you put a logo in the center, don't let it cover too much of the code.",
        "**Test it** with iPhone and Android, in low light and from different distances.",
      ],
    },
    { type: "h2", text: "Ideas for using an editable QR code" },
    {
      type: "table",
      head: ["Where", "Suggested destination"],
      rows: [
        ["Restaurant tables", "Today's menu · see [QR code menus for restaurants](/blog/qr-code-menu-for-restaurants)"],
        ["Product packaging", "Instructions, warranty or reorder"],
        ["Merch table at a show", "Your link in bio with store and newsletter"],
        ["Posters and flyers", "Event tickets or registration"],
        ["Business cards", "Your Bitlink page with all your contacts"],
        ["Shop window", "WhatsApp or catalog when the shop is closed"],
      ],
    },
    { type: "h2", text: "How to measure scans" },
    {
      type: "p",
      text: "Each scan counts as a click on the short link, with country and device type. If you use the same destination in several places, create **one short link per location** (`/menu-table`, `/menu-window`) to see which performs better. You can also add `utm_medium=qr` to see it in Google Analytics: see [UTM parameters](/blog/what-are-utm-parameters).",
    },
    { type: "cta", title: "Editable QR codes, free and with no expiry", text: "Change the destination anytime. No reprinting." },
  ],
  faqs: [
    { q: "Can I change the link of a QR code that's already printed?", a: "Only if it's a dynamic QR code — that is, if it points to a short link you can edit. A static QR code can't be changed." },
    { q: "Do Bitlink QR codes expire?", a: "No. As long as the short link is active, the QR code works." },
    { q: "Which format should I use for printing?", a: "SVG, because it's vector-based and keeps its quality at any size. PNG works for screens and social." },
    { q: "Can I add my logo to the QR code?", a: "Yes. Your profile QR code can show your avatar in the center, and you can pick the colors." },
  ],
  related: ["qr-code-menu-for-restaurants", "short-links-utm-device-country-routing", "free-url-shortener-no-limits"],
};

export default article;
