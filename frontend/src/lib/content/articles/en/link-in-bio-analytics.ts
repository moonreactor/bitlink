import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "metricas-link-en-bio",
  slug: "link-in-bio-analytics",
  category: "guias",
  title: "Link in bio analytics: what to measure and how to get more clicks",
  seoTitle: "Link in bio analytics: what to measure and improve",
  description:
    "Views, clicks, CTR, sources and countries: what each link-in-bio metric means, how to read it, and 8 concrete actions to increase clicks.",
  published: "2026-11-10",
  keywords: ["link in bio analytics", "link in bio stats", "ctr", "link analytics", "increase link in bio clicks"],
  tldr:
    "The key link-in-bio metrics are **views** (how many people open your page), **clicks** per link, **CTR** (clicks ÷ views), **sources** (which network they come from) and **countries**. With those five numbers you know which link to feature, which network brings you an audience and when to reorder your page.",
  takeaways: [
    "Page CTR = total clicks ÷ views.",
    "Compare links against each other, not against internet averages.",
    "Look at weekly trends, not single days.",
    "Export to CSV to cross-check with sales or campaigns.",
  ],
  cover: { src: "/landing/1460925895917-afdab827c52f-360x440.webp", alt: "Laptop with a metrics dashboard and charts" },
  body: [
    { type: "h2", text: "The 5 metrics that matter" },
    {
      type: "table",
      head: ["Metric", "What it measures", "What it tells you"],
      rows: [
        ["Views", "Times your page was opened", "Whether your content is driving people to the link"],
        ["Clicks per link", "Taps on each button", "What your audience cares about"],
        ["CTR", "Clicks ÷ views", "Whether the page convinces or people leave without tapping"],
        ["Sources", "Originating network or site", "Which platform brings you the most people"],
        ["Countries", "Approximate location", "Which currency to sell in, when to post, where to tour"],
      ],
    },
    { type: "h2", text: "How to calculate and read CTR" },
    {
      type: "p",
      text: "If your page had 1,000 views and your links got 450 clicks combined, your CTR is 45%. There's no “correct” number: it depends on your audience and goal. What matters is **comparing yourself to yourself**: if you reordered your links and CTR went up, the change worked.",
    },
    {
      type: "callout",
      tone: "note",
      text: "A low CTR with lots of views usually means what you promised in the video isn't at the top of your page, or there are too many buttons.",
    },
    { type: "h2", text: "Where to find your analytics in Bitlink" },
    {
      type: "ul",
      items: [
        "**Main dashboard**: views, clicks and a daily chart with date ranges.",
        "**Per link**: how many clicks each button received.",
        "**Sources and countries**: where people come from.",
        "**Short links**: clicks for each short link and its QR code.",
        "**CSV export**: to cross-check with sales or report to a brand.",
      ],
    },
    {
      type: "p",
      text: "If you need conversions (purchases, sign-ups), connect **Google Analytics** or **Meta Pixel** from Settings and use [UTMs](/blog/what-are-utm-parameters) on the links that go to your store.",
    },
    { type: "h2", text: "8 actions to get more clicks" },
    {
      type: "ol",
      items: [
        "**Put what you promised** in your latest content at the top.",
        "**Reduce the number of visible buttons**; group the rest into collections.",
        "**Use verb-first titles**: “Shop”, “Listen”, “Book”.",
        "**Feature one link** with an animation or a different style.",
        "**Use thumbnails**: an image next to the text improves recognition.",
        "**Embed** YouTube or Spotify so content is consumed right there.",
        "**Schedule links** for launches and remove them when the promo ends.",
        "**Mention the link** in your videos and in Stories with the link sticker.",
      ],
    },
    { type: "h2", text: "A 10-minute weekly routine" },
    {
      type: "steps",
      name: "Weekly routine to review your link-in-bio analytics",
      items: [
        { title: "Check the trend", text: "Compare views and clicks for the last 7 days against the previous week." },
        { title: "Spot winners and losers", text: "Which link went up? Which one hasn't had clicks in weeks?" },
        { title: "Review sources", text: "If a network is growing, post more there; if it's dropping, look at what changed." },
        { title: "Make one change", text: "Reorder, rename or remove a link. One change per week so you know what worked." },
        { title: "Write it down", text: "Log the change and the result. In a month you'll have your own playbook." },
      ],
    },
    { type: "cta", title: "Analytics included, free", text: "Views, clicks, sources, countries and CSV in every Bitlink account." },
  ],
  faqs: [
    { q: "What's a good CTR for a link in bio?", a: "It depends on your audience and goal. The most useful thing is to compare your own CTR before and after each change." },
    { q: "Do bot visits count?", a: "Tools filter some automated traffic, but no system is perfect. Look at trends more than exact numbers." },
    { q: "Can I use Google Analytics with my link in bio?", a: "Yes. In Bitlink you add your Google Analytics or Meta Pixel ID from Settings." },
    { q: "Can I export my analytics?", a: "Yes, as CSV, to analyze in a spreadsheet or share with a brand." },
  ],
  related: ["what-are-utm-parameters", "what-is-a-link-in-bio", "sell-on-instagram-without-a-store"],
};

export default article;
