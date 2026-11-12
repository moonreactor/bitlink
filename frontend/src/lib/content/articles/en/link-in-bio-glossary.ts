import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "glosario-link-en-bio",
  slug: "link-in-bio-glossary",
  category: "guias",
  title: "Link in bio and short link glossary: 24 terms explained simply",
  seoTitle: "Glossary: link in bio, short links, UTM, CTR and more",
  description:
    "Clear definitions of link in bio, back-half, CTR, UTM, dynamic QR code, CNAME, tracking pixel, redirect and other digital marketing terms.",
  published: "2026-11-12",
  keywords: ["digital marketing glossary", "what is a back-half", "what is ctr", "what is a dynamic qr code", "what is a cname", "link in bio glossary"],
  tldr:
    "This glossary covers the terms that come up most when you set up a link in bio or create short links: from **back-half** and **CTR** to **UTM**, **dynamic QR code**, **CNAME** and **tracking pixel**, each defined in one or two sentences.",
  takeaways: [
    "Short definitions, written for beginners.",
    "Each term links to a fuller guide when there is one.",
    "Sorted alphabetically.",
  ],
  cover: { src: "/landing/1517841905240-472988babdf9-360x440.webp", alt: "Smiling woman leaning against a blue wall" },
  body: [
    { type: "h2", text: "A – C" },
    {
      type: "ul",
      items: [
        "**Back-half**: the customizable end of a short link. In `bitlink.click/promo`, the back-half is `promo`.",
        "**Bio**: the profile text on a social network, usually where the only clickable link lives.",
        "**Call to action (CTA)**: text or a button that asks for a specific action: “Buy”, “Book”, “Subscribe”.",
        "**Checkout**: the page where a purchase payment is completed.",
        "**Click**: each time someone taps a link or button.",
        "**CNAME**: a DNS record that points a subdomain (like `links.yourbrand.com`) to another host. See [connect a custom domain](/blog/connect-custom-domain-link-in-bio).",
        "**Collection**: a group of links with images, in a list or grid, inside a link in bio.",
        "**CTR (click-through rate)**: the percentage of people who clicked out of those who saw something. CTR = clicks ÷ views × 100.",
        "**Custom domain**: a web address you own (yourbrand.com) that you can use for your link in bio.",
      ],
    },
    { type: "h2", text: "D – L" },
    {
      type: "ul",
      items: [
        "**DNS**: the system that translates domain names into server addresses.",
        "**Embed**: content from another platform (a YouTube video, a Spotify track) that plays inside your page.",
        "**Geo-routing (country redirect)**: sending each visitor to a different destination based on their country.",
        "**Link in bio**: a page with several links placed in the single link slot of a profile. See [what is a link in bio](/blog/what-is-a-link-in-bio).",
        "**Scheduled link**: a link that appears or disappears automatically at a set date and time.",
      ],
    },
    { type: "h2", text: "Q – S" },
    {
      type: "ul",
      items: [
        "**QR code, static**: a QR code that contains the final URL directly; it can't be edited.",
        "**QR code, dynamic (editable)**: a QR code that points to a short link, so the destination can change without reprinting. See [editable QR code](/blog/editable-dynamic-qr-code).",
        "**Redirect**: when a URL automatically sends the browser to another one. Shorteners use redirects.",
        "**SSL / HTTPS**: the certificate that encrypts the connection and shows the padlock in the browser.",
        "**Source (traffic source)**: the site or network a visit comes from (Instagram, TikTok, Google, direct).",
      ],
    },
    { type: "h2", text: "T – V" },
    {
      type: "ul",
      items: [
        "**Tracking pixel**: Google Analytics or Meta (Facebook/Instagram) code that records visits and conversions to measure results and build ad audiences.",
        "**TXT record**: a DNS text record used, among other things, to verify you own a domain.",
        "**URL shortener**: a tool that turns a long URL into a short one that redirects to the destination and records clicks. See [free URL shortener](/blog/free-url-shortener-no-limits).",
        "**UTM**: parameters added to a URL (`utm_source`, `utm_medium`, `utm_campaign`…) to identify where a visit came from. See [UTM parameters](/blog/what-are-utm-parameters).",
        "**View**: each time someone opens your link-in-bio page. Together with clicks, it lets you calculate CTR.",
      ],
    },
    { type: "cta" },
  ],
  faqs: [
    { q: "What is the back-half of a link?", a: "It's the end of a short link that you can customize, for example “promo” in bitlink.click/promo." },
    { q: "What's the difference between a static and a dynamic QR code?", a: "A static one has the final URL baked in and can't change; a dynamic one points to a short link whose destination you can edit, and it tracks scans." },
    { q: "What does CTR mean?", a: "Click-through rate: the percentage of people who clicked out of everyone who saw the link or page." },
  ],
  related: ["what-is-a-link-in-bio", "what-are-utm-parameters", "editable-dynamic-qr-code"],
};

export default article;
