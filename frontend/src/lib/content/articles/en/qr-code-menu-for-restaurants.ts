import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "menu-qr-para-restaurantes",
  slug: "qr-code-menu-for-restaurants",
  category: "casos-de-uso",
  title: "QR code menus for restaurants and bars: build one for free and update it without reprinting",
  seoTitle: "QR code menu for restaurants: how to build one free",
  description:
    "How to create a QR code menu for your restaurant, bar or café: menu, bookings, delivery and WhatsApp on one page, with a QR code you can edit.",
  published: "2026-11-11",
  keywords: ["qr code menu", "restaurant qr menu", "free qr code menu", "digital menu", "editable qr code restaurant"],
  tldr:
    "For a **QR code menu** you never have to reprint: build a page with your **menu**, **bookings**, **delivery** and **contact**, and generate a **dynamic QR code** pointing to that page or to a short link. When prices or the daily special change, update the destination and the QR code on the tables keeps working.",
  takeaways: [
    "Put the menu on a lightweight page, not a heavy PDF.",
    "One QR code per location (table, bar, window) to measure.",
    "Add bookings, delivery, reviews and Wi-Fi.",
    "High-contrast QR code with a label that says what it does.",
  ],
  cover: { src: "/landing/1504674900247-0877df9cc836-900x1100.webp", alt: "Plate with sliced beef, greens and chili seen from above on a wooden table" },
  body: [
    { type: "h2", text: "What your menu page should include" },
    {
      type: "ul",
      items: [
        "**Menu** with photos and prices: as a grid collection or a link to your menu.",
        "**Daily special or promo** at the very top.",
        "**Bookings**: link to your reservation system or WhatsApp with a pre-filled message.",
        "**Delivery and takeout**: links to your delivery apps or your own ordering.",
        "**Location and hours**: link to Google Maps.",
        "**Reviews**: a link to leave a Google review.",
        "**Wi-Fi and socials**: Instagram and, if you like, the Wi-Fi password in the bio.",
      ],
    },
    { type: "h2", text: "Step by step" },
    {
      type: "steps",
      name: "How to build a QR code menu for a restaurant",
      items: [
        { title: "Create the page", text: "Sign up at [Bitlink](/register) with your venue's name, for example `bitlink.click/cafemarea`." },
        { title: "Add the menu", text: "Use grid collections with a photo and name for each section (starters, mains, desserts, drinks) or link your menu." },
        { title: "Add bookings and delivery", text: "WhatsApp, your booking system and delivery apps as buttons." },
        { title: "Create a short link per location", text: "`/cafemarea-table`, `/cafemarea-bar`, `/cafemarea-window`, all pointing to your page." },
        { title: "Download the QR codes as SVG", text: "SVG for print: no quality loss on stickers, acrylic stands or vinyl." },
        { title: "Print with a clear label", text: "“Scan to see the menu” next to the code." },
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Lunch and dinner menus",
      text: "With an editable short link you can send the same QR code to the lunch or dinner menu by changing the destination, or schedule links that only appear at certain times.",
    },
    { type: "h2", text: "QR code design for tables" },
    {
      type: "table",
      head: ["Placement", "Recommendation"],
      rows: [
        ["Table sticker", "At least 3 × 3 cm (1.2 in), laminated so it survives cleaning"],
        ["Acrylic stand or menu holder", "Large QR, small logo, label with the action"],
        ["Shop window", "Large QR at eye level to see the menu when you're closed"],
        ["Receipt or packaging", "QR to reviews or your Instagram to bring people back"],
      ],
    },
    { type: "h2", text: "What to measure" },
    {
      type: "p",
      text: "Each scan is a click on the short link: you see scans per day, by location and by device type. If the window gets lots of scans after hours, put an online ordering button right at the top. More in [editable QR code](/blog/editable-dynamic-qr-code).",
    },
    { type: "cta", title: "Your QR code menu, free", text: "Menu, bookings and delivery on one page, with an editable QR code." },
  ],
  faqs: [
    { q: "Is a PDF or a page better for a QR code menu?", a: "A page: it loads faster on phones, reads better and you can update it without creating a new file." },
    { q: "Do I need to reprint the QR code if prices change?", a: "No, as long as the QR code points to a short link or your Bitlink page. Update the content and the QR stays the same." },
    { q: "Can I see how many people scan the QR code?", a: "Yes. Each scan counts as a click on the short link, with date, country and device." },
    { q: "Does it cost anything?", a: "No. The page, short links and QR codes are free on Bitlink." },
  ],
  related: ["editable-dynamic-qr-code", "short-links-utm-device-country-routing", "link-in-bio-analytics"],
};

export default article;
