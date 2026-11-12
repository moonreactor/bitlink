import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "vs-bitly",
  slug: "bitlink-vs-bitly",
  category: "comparativas",
  title: "Bitlink vs Bitly (2026): unlimited free short links vs a 5-links-a-month free plan",
  seoTitle: "Bitlink vs Bitly (2026): free plan and features compared",
  description:
    "Bitlink vs Bitly compared: Bitly's free plan allows 5 short links and 2 QR codes a month; Bitlink is unlimited and free, with UTMs, routing rules and analytics.",
  published: "2026-11-12",
  updated: "2026-11-12",
  keywords: ["bitlink vs bitly", "bitly alternative", "bitly free plan limits", "bitly pricing", "free url shortener unlimited", "bitly vs"],
  tldr:
    "On Bitly's pricing page, the **free plan allows 5 short links, 2 QR codes and 3 custom back-halves per month**, with no click history and no UTM builder; the UTM builder starts at **Core ($10/month, annual billing)**. **Bitlink** has no monthly limits, includes UTM fields, device and country routing, QR codes and click analytics for free, and adds a link-in-bio page.",
  takeaways: [
    "Bitly Free: 5 links, 2 QR codes and 3 custom back-halves per month; no click data history; no UTM builder.",
    "Bitly's paid tiers run $10, $29 and $199 per month (annual billing rates on its page).",
    "Bitlink: unlimited short links, UTMs, device and country rules, QR codes and analytics, all free.",
    "Bitly is built for large teams and enterprises; Bitlink is built for creators and small businesses.",
  ],
  cover: { src: "/landing/1460925895917-afdab827c52f-360x440.webp", alt: "Laptop showing an analytics dashboard with click charts" },
  body: [
    {
      type: "callout",
      tone: "note",
      title: "How we compared",
      text: "We're Bitlink, so this page leans toward what we do best. All Bitly numbers come from Bitly's own pricing page, checked on November 12, 2026 (prices shown are the annual-billing rates listed there). Plans change, so verify before you buy.",
    },
    { type: "h2", text: "The short version" },
    {
      type: "p",
      text: "Bitly is one of the best-known URL shorteners, and it's built around **monthly quotas**: each plan includes a fixed number of short links, QR codes and custom back-halves per month. If you run out mid-campaign, you wait or upgrade. Bitlink has **no quotas**: you create as many short links as you need.",
    },
    { type: "h2", text: "Bitly's plans, side by side" },
    {
      type: "table",
      caption: "Source: bitly.com/pages/pricing, checked 2026-11-12",
      head: ["", "Free", "Core", "Growth", "Premium"],
      rows: [
        ["Price", "$0 (shown “with ads”)", "$10/month (annual only)", "$29/month", "$199/month"],
        ["Short links per month", "5", "100", "500", "3,000"],
        ["QR codes per month", "2", "5", "10", "200"],
        ["Custom back-halves per month", "3", "100", "500", "3,000"],
        ["Click data history", "None", "30 days", "4 months", "1 year"],
        ["UTM builder", "No", "Yes", "Yes", "Yes"],
        ["Custom domain / branded links", "No", "No", "Yes", "Yes"],
      ],
    },
    {
      type: "p",
      text: "Bitly's page also lists dynamic routing by country, platform or device as unavailable on Free, Core and Growth, and city-level and device-type click data only on Premium.",
    },
    { type: "h2", text: "Bitlink next to Bitly" },
    {
      type: "table",
      head: ["Feature", "Bitlink (free)", "Bitly Free", "Bitly Core ($10/mo)"],
      rows: [
        ["Short links", "Unlimited", "5 / month", "100 / month"],
        ["QR codes", "Unlimited, PNG/SVG, colors, logo", "2 / month", "5 / month"],
        ["Custom back-halves", "Unlimited", "3 / month", "100 / month"],
        ["UTM fields", "Yes", "No", "Yes"],
        ["Mobile vs desktop destinations", "Yes", "No", "Not listed"],
        ["Per-country destinations", "Yes", "No", "Not listed"],
        ["Click analytics", "Clicks, countries, devices, daily chart + CSV", "No history", "30 days"],
        ["Link-in-bio page with products", "Yes, included", "Not a separate item", "Not a separate item"],
        ["Cost", "$0", "$0", "$10/month"],
      ],
    },
    { type: "h2", text: "Where Bitlink wins" },
    {
      type: "ul",
      items: [
        "**No quotas.** Launch a campaign with 50 short links and 50 QR codes in one afternoon, for free.",
        "**Routing rules are included.** Send mobile and desktop visitors to different places, or route by country, without upgrading. See [short links with routing rules](/blog/short-links-utm-device-country-routing).",
        "**Analytics aren't a premium add-on.** Every link shows clicks, countries and devices.",
        "**Editable QR codes with no monthly cap.** Print them freely: [how editable QR codes work](/blog/editable-dynamic-qr-code).",
        "**A link-in-bio page and an e-commerce-ready profile** in the same account.",
      ],
    },
    { type: "h2", text: "Where Bitly may fit better" },
    {
      type: "ul",
      items: [
        "**Branded short domains on your own domain.** Bitly lists branded links from its Growth tier. In Bitlink, short links live on bitlink.click (your custom domain applies to your profile page).",
        "**Enterprise needs**: large teams, custom contracts and advanced tracking.",
        "**Long click history on paid plans**, up to one year on Premium.",
      ],
    },
    { type: "h2", text: "Switching in a few steps" },
    {
      type: "steps",
      name: "How to move your short links from Bitly to Bitlink",
      items: [
        { title: "List your active links", text: "Export or note the Bitly links you still use and their destinations." },
        { title: "Create them in Bitlink", text: "In [Bitlink](/register), Short links → New. Pick a back-half, paste the destination, and add UTMs if you need them." },
        { title: "Don't break printed QR codes", text: "Links and QR codes you already printed keep pointing to Bitly. Create new ones in Bitlink for future prints." },
        { title: "Update where you share", text: "Use your new links in bios, emails and campaigns going forward." },
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Careful with existing QR codes",
      text: "Bitly links already in circulation are controlled by your Bitly account. Don't delete or downgrade it until you've replaced everything you rely on.",
    },
    { type: "cta", title: "Unlimited short links, free", text: "No monthly quota. UTMs, routing rules, QR codes and analytics included." },
  ],
  faqs: [
    { q: "What are the limits of Bitly's free plan?", a: "According to Bitly's pricing page, the free plan includes 5 short links, 2 QR codes and 3 custom back-halves per month, with no click data history and no UTM builder." },
    { q: "Is there a free Bitly alternative with no limits?", a: "Yes. Bitlink lets you create unlimited short links and QR codes, with UTMs, device and country rules and click analytics, free." },
    { q: "Does Bitlink offer branded short domains?", a: "Short links use bitlink.click. A custom domain is available for your profile page, not for short links." },
    { q: "Can I keep my existing Bitly QR codes working?", a: "Existing codes keep working as long as your Bitly account does. Create new ones in Bitlink for future campaigns." },
  ],
  related: ["free-url-shortener-no-limits", "bitly-free-alternatives", "what-are-utm-parameters"],
};

export default article;
