import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "como-poner-link-en-tiktok",
  slug: "how-to-add-a-link-in-tiktok-bio",
  category: "guias",
  title: "How to add a link to your TikTok bio: requirements and what to do if it's missing",
  seoTitle: "How to add a link in your TikTok bio: requirements",
  description:
    "How to add a link to your TikTok bio, why the option sometimes doesn't show up, and what to do in the meantime to drive traffic.",
  published: "2026-11-07",
  keywords: ["link in tiktok bio", "how to add link to tiktok", "tiktok website field missing", "tiktok 1000 followers link", "tiktok link in bio"],
  tldr:
    "On TikTok you add a link from **Edit profile → Website**. If the option isn't there, your account usually doesn't meet the requirements yet (personal accounts have typically needed a minimum follower count; business accounts tend to have it available). Once you have it, use **a link in bio** that holds all your destinations.",
  takeaways: [
    "Path: Profile → Edit profile → Website.",
    "Missing? Check followers, account age and account type.",
    "Alternatives: link via Instagram/YouTube, DMs and a QR code.",
    "Use a short link with UTMs to measure TikTok traffic.",
  ],
  cover: { src: "/landing/1470225620780-dba8ba36b745-360x440.webp", alt: "DJ's hands on a controller lit with purple light" },
  body: [
    { type: "h2", text: "How to add the link on TikTok" },
    {
      type: "steps",
      name: "How to add a link to your TikTok bio",
      items: [
        { title: "Open your profile", text: "Tap the profile icon at the bottom right." },
        { title: "Edit profile", text: "Tap “Edit profile”." },
        { title: "Website", text: "Find the “Website” field and paste your URL, for example `bitlink.click/yourname`." },
        { title: "Save", text: "The link appears as clickable below your bio." },
      ],
    },
    { type: "h2", text: "Why the “Website” option doesn't show up" },
    {
      type: "p",
      text: "TikTok doesn't enable bio links for every account. The conditions change over time and by country, but the most common reasons are:",
    },
    {
      type: "ul",
      items: [
        "**Not enough followers**: for personal accounts, TikTok has historically required around 1,000 followers.",
        "**Account type**: business accounts usually get the field earlier.",
        "**Minimum age**: the account must belong to an adult.",
        "**App version**: update TikTok; sometimes the field only appears in the latest version.",
      ],
    },
    {
      type: "callout",
      tone: "note",
      text: "Check the current requirements in TikTok's help center — the platform adjusts them regularly.",
    },
    { type: "h2", text: "What to do until you have the link" },
    {
      type: "ol",
      items: [
        "**Send people to another network**: TikTok shows Instagram and YouTube icons on your profile. If your Instagram has a link in bio, people get there in two steps.",
        "**Direct messages**: reply with your link to anyone who comments “where can I buy this?”.",
        "**An easy-to-remember link**: say it in the video. `bitlink.click/yourname` is easy to remember and type.",
        "**QR code on screen**: show a QR at the end of the video for people watching on another device.",
      ],
    },
    { type: "h2", text: "What to put behind your TikTok link" },
    {
      type: "p",
      text: "TikTok audiences arrive on their phones, short on time and full of curiosity. Your page should load fast and show **what you promised in the video** first. If the video was about a product, that product should be the first button.",
    },
    {
      type: "table",
      head: ["If your TikTok is about…", "Suggested first link"],
      rows: [
        ["Music", "Spotify player with your latest track"],
        ["Products", "Product card from the video with price and buy button"],
        ["Recipes or tutorials", "The full recipe or the long tutorial on YouTube"],
        ["Services", "Booking calendar or WhatsApp"],
      ],
    },
    { type: "h2", text: "How to measure the traffic TikTok sends you" },
    {
      type: "p",
      text: "Bitlink analytics show which network each visit comes from. For campaign-level detail, use a [short link](/blog/short-links-utm-device-country-routing) with `utm_source=tiktok` and a `utm_campaign` per video or series.",
    },
    { type: "cta", title: "Your link in bio for TikTok", text: "Fast on mobile, with embeds and analytics. Free." },
  ],
  faqs: [
    { q: "How many followers do I need to add a link on TikTok?", a: "For personal accounts TikTok has historically required around 1,000 followers, though the requirement can change. Business accounts usually get it earlier." },
    { q: "Can I add links inside TikTok videos?", a: "Generally captions aren't clickable. Use the link on your profile or direct messages." },
    { q: "Should I switch to a business account to get the link?", a: "It can help, but business accounts have a more limited music library. Decide based on your content." },
  ],
  related: ["how-to-add-multiple-links-on-instagram", "what-is-a-link-in-bio", "link-in-bio-for-musicians"],
};

export default article;
