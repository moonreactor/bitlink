import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "que-son-los-parametros-utm",
  slug: "what-are-utm-parameters",
  category: "guias",
  title: "What are UTM parameters and how to use them in your links (with examples)",
  seoTitle: "What are UTM parameters and how to use them",
  description:
    "A simple UTM guide: what utm_source, utm_medium and utm_campaign mean, how to build them, common mistakes and how to add them to a short link in seconds.",
  published: "2026-11-07",
  keywords: ["utm parameters", "what are utm codes", "utm_source", "utm_campaign", "utm google analytics", "links with utm"],
  tldr:
    "**UTM parameters** are tags added to the end of a URL (for example `?utm_source=instagram&utm_medium=social&utm_campaign=launch`) so tools like **Google Analytics** know where each visit came from. In practice the three you always need are **source**, **medium** and **campaign**.",
  takeaways: [
    "utm_source = who sends the visit (instagram, newsletter).",
    "utm_medium = the type of channel (social, email, qr, cpc).",
    "utm_campaign = the campaign (black-friday-2026).",
    "Always use lowercase and hyphens; document your convention.",
  ],
  cover: { src: "/landing/1517836357463-d25dfeac3438-400x225.webp", alt: "Person lifting a loaded barbell in a gym" },
  body: [
    { type: "h2", text: "What a UTM is" },
    {
      type: "p",
      text: "UTM stands for *Urchin Tracking Module*, from the tool Google acquired and turned into Google Analytics. Today it's a standard: almost every analytics platform reads these parameters. They don't change where the link goes; they only add information for measurement.",
    },
    { type: "h2", text: "The five UTM parameters" },
    {
      type: "table",
      head: ["Parameter", "What it indicates", "Example"],
      rows: [
        ["`utm_source`", "The specific traffic source", "instagram, tiktok, newsletter, google"],
        ["`utm_medium`", "The type of channel", "social, email, qr, cpc, referral"],
        ["`utm_campaign`", "The campaign or initiative", "album-launch, spring-sale-2026"],
        ["`utm_term`", "Keyword (mostly for search ads)", "running-shoes"],
        ["`utm_content`", "Content or creative variant", "story-1, blue-button, video-a"],
      ],
    },
    { type: "h2", text: "A real example" },
    {
      type: "p",
      text: "A fitness coach launches a 12-week program and promotes it on Instagram, in her newsletter and with a QR code at the gym. To see which channel sells more, she creates three links:",
    },
    {
      type: "ul",
      items: [
        "Instagram: `...?utm_source=instagram&utm_medium=social&utm_campaign=12-week-program`",
        "Newsletter: `...?utm_source=newsletter&utm_medium=email&utm_campaign=12-week-program`",
        "Gym QR code: `...?utm_source=gym&utm_medium=qr&utm_campaign=12-week-program`",
      ],
    },
    {
      type: "p",
      text: "In Google Analytics, filtering by the `12-week-program` campaign, she sees how many visits and purchases each source brought in.",
    },
    { type: "h2", text: "How to add UTMs without typing the URL by hand" },
    {
      type: "p",
      text: "URLs with UTMs are long and ugly to share. The fix is to pair them with a **short link**: the visible link is `bitlink.click/program`, and behind the scenes it redirects to the URL with all the parameters.",
    },
    {
      type: "steps",
      name: "How to create a short link with UTMs in Bitlink",
      items: [
        { title: "New short link", text: "In your dashboard, open Short links → New." },
        { title: "Destination", text: "Paste your sales page URL, without UTMs." },
        { title: "Fill in the UTMs", text: "Source, medium and campaign (plus term or content if you use them). Bitlink appends them for you." },
        { title: "One link per channel", text: "Repeat with a different back-half for each channel: `/program-ig`, `/program-email`, `/program-qr`." },
        { title: "Compare", text: "Check clicks in Bitlink and conversions in your analytics tool." },
      ],
    },
    { type: "h2", text: "Common UTM mistakes" },
    {
      type: "ol",
      items: [
        "**Mixing cases**: `Instagram` and `instagram` count as different sources. Use lowercase everywhere.",
        "**Using UTMs on internal links** within your own site: they break attribution of the original visit.",
        "**No naming convention**: keep a spreadsheet of the values your team uses.",
        "**Spaces and accents**: replace them with hyphens (`fathers-day`, not `Father's Day`).",
        "**Forgetting the medium**: without `utm_medium` many tools group traffic incorrectly.",
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "What about the link in bio?",
      text: "Your Bitlink page already records which network each visit comes from. UTMs are most useful on links that go from your page to your store or website.",
    },
    { type: "cta", title: "Short links with UTMs built in", text: "Fill in the fields and Bitlink builds the URL for you." },
  ],
  faqs: [
    { q: "Do UTMs affect SEO?", a: "They don't help or hurt rankings. Just avoid them on internal links within your own site and make sure your pages have a canonical URL." },
    { q: "Which UTMs are required?", a: "Technically none, but in practice always use utm_source, utm_medium and utm_campaign." },
    { q: "Where do I see UTM results?", a: "In your analytics tool — for example in Google Analytics 4 under the traffic acquisition reports." },
    { q: "Can I change the UTMs on a link I've already shared?", a: "With a Bitlink short link, yes: edit the UTMs and the shared link stays the same." },
  ],
  related: ["short-links-utm-device-country-routing", "link-in-bio-analytics", "free-url-shortener-no-limits"],
};

export default article;
