import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "novedad-links-cortos",
  slug: "short-links-utm-device-country-routing",
  category: "novedades",
  title: "New: short links on bitlink.click with UTMs, device rules and country routing",
  seoTitle: "Short links with UTMs, device rules and country routing",
  description:
    "Create unlimited short links on bitlink.click with your own back-half, UTMs, separate mobile/desktop and per-country destinations, QR codes and stats.",
  published: "2026-11-04",
  keywords: ["short links", "url shortener", "bitlink.click", "utm", "geo redirect", "device redirect"],
  tldr:
    "Bitlink now includes a built-in **URL shortener**: create links like `bitlink.click/promo`, add **UTMs**, set different destinations for **mobile and desktop** or by **country**, and change the destination anytime without reprinting the QR code. Unlimited and free.",
  takeaways: [
    "Custom back-half: bitlink.click/anything-you-want (2 to 40 characters).",
    "Ready-made UTM fields: source, medium, campaign, term and content.",
    "Rules: one destination for mobile, another for desktop, plus per-country destinations.",
    "Every short link has click stats and its own QR code.",
  ],
  cover: { src: "/landing/1460925895917-afdab827c52f-360x440.webp", alt: "Laptop showing an analytics dashboard with click charts" },
  body: [
    { type: "h2", text: "What changed" },
    {
      type: "p",
      text: "Besides your link-in-bio page, every Bitlink account now has a **Short links** section to create short links on the `bitlink.click` domain. Use them in a story, a video, an email, a poster or on packaging — and know exactly how many people clicked.",
    },
    { type: "h2", text: "The features, one by one" },
    { type: "h3", text: "1. Custom back-half" },
    {
      type: "p",
      text: "You choose the end of the link: `bitlink.click/tickets`, `bitlink.click/black-friday`, `bitlink.click/menu`. Lowercase letters, numbers, hyphens and underscores are allowed, from 2 to 40 characters. A readable link earns more trust than random characters.",
    },
    { type: "h3", text: "2. UTMs without formulas" },
    {
      type: "p",
      text: "Fill in `utm_source`, `utm_medium`, `utm_campaign`, `utm_term` and `utm_content` in the form and Bitlink appends them to the destination automatically, so Google Analytics (or any other tool) knows where each visit came from. New to UTMs? Read [what UTM parameters are](/blog/what-are-utm-parameters).",
    },
    { type: "h3", text: "3. Device rules" },
    {
      type: "p",
      text: "Set one destination for **phones and tablets** and another for **desktop**. For example: send mobile visitors to your mobile store or app, and desktop visitors to the full website.",
    },
    { type: "h3", text: "4. Country routing" },
    {
      type: "p",
      text: "Assign destinations based on the visitor's country: the US to your USD checkout, Mexico to the MXN store, Spain to the EUR version. If a country has no rule, the main destination is used.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Order of priority",
      text: "The device rule is checked first, then the country rule, and if neither applies, the main destination.",
    },
    { type: "h3", text: "5. Editable destination and QR code" },
    {
      type: "p",
      text: "The short link stays the same even when you change where it points. That makes it ideal for **printed QR codes**: if your promo changes tomorrow, edit the destination and the QR code on the poster keeps working. More in [how to create an editable QR code](/blog/editable-dynamic-qr-code).",
    },
    { type: "h2", text: "Examples" },
    {
      type: "table",
      head: ["Short link", "Rule", "Use"],
      rows: [
        ["bitlink.click/tour", "UTM source=instagram", "Measure how many tickets come from Instagram"],
        ["bitlink.click/app", "Mobile → app store · Desktop → website", "One link to download the app"],
        ["bitlink.click/offer", "US → USD checkout · MX → MXN", "Local pricing by country"],
        ["bitlink.click/menu", "Editable destination", "Table QR that always shows today's menu"],
      ],
    },
    { type: "h2", text: "How to create your first short link" },
    {
      type: "steps",
      name: "How to create a short link in Bitlink",
      items: [
        { title: "Open Short links", text: "In your dashboard, open Short links and tap “New”." },
        { title: "Paste the destination", text: "The long URL you want to send people to." },
        { title: "Pick the back-half", text: "A short, clear word, for example `summer-sale`." },
        { title: "Add UTMs and rules (optional)", text: "Fill in source, medium and campaign, and if you want, destinations by device or country." },
        { title: "Share and measure", text: "Copy the link or download the QR code. Clicks show up in the link's stats." },
      ],
    },
    { type: "cta", title: "Create unlimited short links", text: "No monthly caps, with UTMs, rules and QR codes included." },
  ],
  faqs: [
    { q: "How many short links can I create?", a: "As many as you need. There's no monthly limit on links or clicks." },
    { q: "Can I change the destination of a published short link?", a: "Yes. The link and its QR code stay the same; only where they redirect changes." },
    { q: "What if a code is already taken?", a: "Each back-half is unique on bitlink.click. If it's taken, try a variation with a hyphen or your brand name." },
    { q: "Do device rules tell iPhone apart from Android?", a: "Today the rules distinguish phone/tablet from desktop. To split app stores, use a landing page that detects the operating system." },
  ],
  related: ["free-url-shortener-no-limits", "what-are-utm-parameters", "editable-dynamic-qr-code"],
};

export default article;
