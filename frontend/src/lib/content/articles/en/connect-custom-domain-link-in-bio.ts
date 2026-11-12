import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "conectar-dominio-propio",
  slug: "connect-custom-domain-link-in-bio",
  category: "guias",
  title: "How to connect a custom domain to your link in bio (TXT record + CNAME)",
  seoTitle: "How to connect a custom domain to your link in bio",
  description:
    "Step-by-step guide to publishing your link in bio at links.yourbrand.com: TXT verification, CNAME, SSL and fixes for common problems.",
  published: "2026-11-09",
  keywords: ["link in bio custom domain", "connect domain", "cname record", "txt record", "link in bio on my domain"],
  tldr:
    "To use your own domain with Bitlink: 1) enter it in **Settings → Custom domain**; 2) add the verification **TXT record** at `_bitlink-challenge.yourdomain`; 3) create a **CNAME** from the subdomain to the host Bitlink shows you; 4) click **verify**. The HTTPS certificate is set up at your DNS or hosting provider.",
  takeaways: [
    "Use a subdomain: links.yourbrand.com or bio.yourbrand.com.",
    "TXT = prove the domain is yours. CNAME = point it to Bitlink.",
    "DNS changes can take anywhere from minutes to a few hours.",
    "Turn on HTTPS at your provider (for example, Cloudflare's proxy).",
  ],
  cover: { src: "/landing/1542038784456-1ea8e935640e-900x500.webp", alt: "Photographer holding a camera up in an autumn forest" },
  body: [
    { type: "h2", text: "Why use a custom domain" },
    {
      type: "ul",
      items: [
        "**Brand**: `links.yourbrand.com` looks more professional than a generic URL.",
        "**Trust**: people click more confidently when they recognize the domain.",
        "**Independence**: the domain is yours even if you switch tools in the future.",
      ],
    },
    { type: "h2", text: "Before you start" },
    {
      type: "ul",
      items: [
        "A registered domain (GoDaddy, Namecheap, Cloudflare, Squarespace, Hostinger, etc.).",
        "Access to the domain's DNS settings (where records are managed).",
        "A **subdomain** in mind: `links`, `bio` or `go` are the most common.",
      ],
    },
    {
      type: "callout",
      tone: "note",
      title: "Subdomain or root domain?",
      text: "We recommend a subdomain. Many providers don't allow a CNAME on the root domain (yourbrand.com), and that's usually where your website or email lives.",
    },
    { type: "h2", text: "Step by step" },
    {
      type: "steps",
      name: "How to connect a custom domain to Bitlink",
      items: [
        { title: "Add the domain in Bitlink", text: "Dashboard → Settings → Custom domain. Enter the full subdomain, for example `links.yourbrand.com`, and save." },
        { title: "Copy the verification token", text: "Bitlink shows a verification value and the host names where you can create the TXT record." },
        { title: "Create the TXT record", text: "At your DNS provider: type TXT, name `_bitlink-challenge.links` (or `_bitlink-challenge.links.yourbrand.com`, depending on the panel), value = the token." },
        { title: "Create the CNAME record", text: "Type CNAME, name `links`, value = the Bitlink host shown in Settings." },
        { title: "Set up HTTPS", text: "Enable the SSL certificate at your provider. In Cloudflare, for example, by turning on the proxy (orange cloud)." },
        { title: "Verify", text: "Go back to Settings and click verify. When the status changes to “Verified”, your page responds on your domain." },
      ],
    },
    { type: "h2", text: "Example DNS records" },
    {
      type: "table",
      caption: "The exact values appear in your Bitlink dashboard",
      head: ["Type", "Name / Host", "Value"],
      rows: [
        ["TXT", "_bitlink-challenge.links", "(your verification token)"],
        ["CNAME", "links", "(Bitlink host shown in Settings)"],
      ],
    },
    { type: "h2", text: "Common problems" },
    {
      type: "table",
      head: ["Symptom", "Likely cause", "Fix"],
      rows: [
        ["Won't verify", "DNS hasn't propagated yet", "Wait a few minutes (sometimes hours) and try again"],
        ["Won't verify", "The panel appended the domain twice to the name", "Use just `_bitlink-challenge.links` if the panel adds the domain automatically"],
        ["“Not secure” warning", "Missing SSL certificate", "Enable HTTPS at your DNS or hosting provider"],
        ["Opens a different site", "An older A or CNAME record exists for the same subdomain", "Delete the old record and keep only the CNAME to Bitlink"],
        ["Email stopped working", "The root domain was modified", "Use a subdomain and don't touch the MX records"],
      ],
    },
    {
      type: "callout",
      tone: "tip",
      text: "To check whether the TXT record is visible, use any public DNS lookup tool and query `_bitlink-challenge.yourdomain` with type TXT.",
    },
    { type: "cta", title: "Your brand in the address bar", text: "Custom domains included free on Bitlink." },
  ],
  faqs: [
    { q: "How long does it take for the custom domain to work?", a: "Usually minutes, but DNS propagation can take a few hours depending on the provider." },
    { q: "Can I use the root domain (yourbrand.com)?", a: "A subdomain like links.yourbrand.com is recommended, because many providers don't allow a CNAME on the root domain." },
    { q: "Does Bitlink sell domains?", a: "No. Buy the domain from any registrar and connect it for free." },
    { q: "Do my short links use my domain?", a: "The custom domain is for your profile page. Short links are created on bitlink.click." },
  ],
  related: ["custom-domains-products-tips", "what-is-a-link-in-bio", "editable-dynamic-qr-code"],
};

export default article;
