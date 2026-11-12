import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "como-ver-clics-link-corto",
  slug: "how-to-track-clicks-on-a-short-link",
  category: "guias",
  title: "How to see how many clicks a short link gets",
  seoTitle: "How to track clicks on a short link (free)",
  description:
    "Track how many people click your short links: create a free Bitlink account, claim links you made anonymously and read the click count per link.",
  published: "2026-11-12",
  keywords: ["track clicks short link", "how many clicks does my link have", "short link analytics", "link click counter free"],
  tldr:
    "To **see how many clicks a short link gets**, create it in a free Bitlink account (or claim an anonymous one by signing up from the same browser) and open **Short links** in your dashboard: each link shows its **click count**, and the **Stats** button opens clicks per day, countries, devices and sources. Clicks are counted from the first visit, even before you had an account.",
  takeaways: [
    "Every click on a Bitlink short link is counted, signed in or not.",
    "Anonymous links become yours when you sign up from the same browser, clicks included.",
    "Use a different short link per channel to learn which one works.",
    "Add UTMs if you also want to see the traffic in Google Analytics.",
  ],
  cover: { src: "/landing/1460925895917-afdab827c52f-360x440.webp", alt: "Laptop showing an analytics dashboard with click data" },
  body: [
    { type: "h2", text: "What a click counter tells you" },
    {
      type: "p",
      text: "A short link works as a counter: every time someone opens it, Bitlink records the visit and then sends them to the destination. The number you see is how many times the link was opened — useful to know whether a post, an email or a printed QR code is actually bringing people in.",
    },
    {
      type: "steps",
      name: "How to track the clicks of a short link",
      items: [
        { title: "Create the link with an account", text: "Sign up free and create it from **Short links**, or shorten it first on the [free shortener](/url-shortener) and choose to create an account." },
        { title: "Or claim one you made anonymously", text: "Sign up or log in from the same browser: the anonymous links you created there are added to your account automatically, along with their clicks." },
        { title: "Open Short links", text: "In the dashboard each link shows its total clicks next to the short URL." },
        { title: "Press Stats", text: "See a daily chart for the last 7, 30 or 90 days, plus the top countries, devices and traffic sources." },
        { title: "Share it and check back", text: "Post it, email it or print its QR code and watch the number grow." },
      ],
    },
    { type: "h2", text: "Get better answers with one link per channel" },
    {
      type: "p",
      text: "A single link shared everywhere only tells you a total. If you want to know whether Instagram or email works better, make one short link per place: `/promo-ig`, `/promo-email`, `/promo-qr`. They all go to the same page, but each has its own counter.",
    },
    {
      type: "table",
      head: ["Link", "Where you share it", "What you learn"],
      rows: [
        ["`/tour-ig`", "Instagram bio", "How much traffic Instagram sends"],
        ["`/tour-mail`", "Newsletter", "Whether your subscribers click"],
        ["`/tour-qr`", "Printed poster", "Whether anyone scans the QR"],
      ],
    },
    { type: "h2", text: "Click counts vs. Google Analytics" },
    {
      type: "p",
      text: "The short link counts **opens**; Google Analytics counts what happens **on your site**. They complement each other. Add [UTM parameters](/blog/what-are-utm-parameters) to the short link and the same click shows up in Analytics tagged with its source and campaign.",
    },
    {
      type: "callout",
      tone: "note",
      text: "Counts can include people who open the link more than once, and some automated visits. Use them to compare links and spot trends rather than as an exact number of unique people.",
    },
    { type: "h2", text: "Don't lose your data: anonymous links expire" },
    {
      type: "p",
      text: "Anonymous links are deleted after 60 days if nobody claims them, and their clicks go with them. If you care about the numbers, create a free account first. Links on an account never expire.",
    },
    {
      type: "cta",
      title: "Track your links for free",
      text: "Create a free account and see how many people click each short link.",
      href: "/register",
      label: "Create my account",
    },
  ],
  faqs: [
    { q: "How can I see how many clicks my short link has?", a: "Create it in a free Bitlink account, or claim an anonymous link by signing up from the same browser, then open Short links in the dashboard: each link shows its clicks, and Stats adds the breakdown by day, country, device and source." },
    { q: "What can I see about the people who click?", a: "Aggregated data only: clicks per day, country, device type (mobile, desktop, tablet) and where the click came from. No names or personal details." },
    { q: "Are clicks counted before I create an account?", a: "Yes. Clicks on anonymous links are recorded from the first visit and added to your account when you claim the link." },
    { q: "Can I track a link I already shared?", a: "Only if it's a Bitlink short link. The destination URL itself can't be counted; create a short link and use that from now on." },
    { q: "Is tracking free?", a: "Yes. Bitlink has no paid plans: click counts and their breakdown are included with every free account." },
  ],
  related: ["shorten-a-link-without-signing-up", "link-in-bio-analytics", "what-are-utm-parameters"],
};

export default article;
