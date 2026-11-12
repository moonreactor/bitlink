import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "link-en-bio-para-musicos",
  slug: "link-in-bio-for-musicians",
  category: "casos-de-uso",
  title: "Link in bio for musicians and bands: build a page that sells tickets and grows listeners",
  seoTitle: "Link in bio for musicians and bands: a practical guide",
  description:
    "What to put on a musician's or band's link in bio: Spotify player, YouTube, tickets, merch, press kit and newsletter. With a recommended structure.",
  published: "2026-11-10",
  keywords: ["link in bio for musicians", "band link in bio", "music smart link", "musician landing page", "spotify link in bio"],
  tldr:
    "A musician's link in bio has three jobs: **get people listening** (embedded Spotify or YouTube player), **sell** (tickets and merch) and **build community** (newsletter or WhatsApp list). Order the page for the moment you're in: release, tour or between cycles.",
  takeaways: [
    "On top: the current release or the next show.",
    "Embed Spotify and YouTube so people listen without leaving.",
    "Short links with UTMs to measure each flyer or Story.",
    "Password-protected press kit for press and promoters.",
  ],
  cover: { src: "/landing/1516280440614-37939bbacd81-600x300.webp", alt: "Microphone on a stand with warm stage light behind it" },
  body: [
    { type: "h2", text: "Recommended structure" },
    {
      type: "ol",
      items: [
        "**Current release**: embedded Spotify player or YouTube video.",
        "**Upcoming shows**: tickets, with the nearest date first.",
        "**Merch**: product cards with price and payment link.",
        "**Newsletter or community**: an email form to let fans know about shows in their city.",
        "**Platforms**: Spotify, Apple Music, YouTube, Bandcamp, SoundCloud.",
        "**Contact and press kit**: booking email and press kit (can be password-protected).",
        "**Tips**: “Support the music ☕” with Buy Me a Coffee, Ko-fi or PayPal.",
      ],
    },
    { type: "h2", text: "Order your page for the moment" },
    {
      type: "table",
      head: ["Moment", "First link", "Extra"],
      rows: [
        ["Before the release", "Pre-save or teaser", "Scheduled link so the track appears on release day"],
        ["Release week", "Player for the new track", "Music video and lyrics"],
        ["Tour", "Tickets for the next show", "One short link per city, with country rules"],
        ["Between cycles", "Newsletter", "Merch and back catalog"],
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "One link per city",
      text: "For a tour, create short links like `bitlink.click/tour-austin` and `bitlink.click/tour-denver`. Use them on each city's flyers and you'll know which promotion worked.",
    },
    { type: "h2", text: "Build it in 10 minutes" },
    {
      type: "steps",
      name: "How to build a link in bio for musicians",
      items: [
        { title: "Create your page", text: "Sign up at [Bitlink](/register) with your artist name." },
        { title: "Paste your latest release", text: "A Spotify or YouTube link turns into a player inside your page." },
        { title: "Add shows and merch", text: "Links to the ticketing site and product cards for shirts, vinyl or CDs." },
        { title: "Turn on the newsletter", text: "From Settings, enable the email form to build your list." },
        { title: "Pick the design", text: "Use the album cover as the background and the release's colors. You can add background music too." },
        { title: "Print the QR code", text: "For the merch table and flyers, with your photo in the center." },
      ],
    },
    { type: "h2", text: "What to measure" },
    {
      type: "ul",
      items: [
        "**Clicks on the player and platforms**: how well the release converts.",
        "**Countries of origin**: where your audience is, to plan shows.",
        "**Ticket clicks per short link**: which flyer or Story sells more.",
        "**New subscribers**: your own community, outside the algorithm.",
      ],
    },
    { type: "p", text: "More ideas in [link in bio analytics](/blog/link-in-bio-analytics)." },
    { type: "cta", title: "Your artist page, free", text: "Player, tickets, merch and newsletter in one link." },
  ],
  faqs: [
    { q: "Can I put a Spotify player on my link in bio?", a: "Yes. In Bitlink you paste a Spotify or YouTube link and it shows as a player inside your page." },
    { q: "How do I share the press kit only with press?", a: "Add the press kit link and protect it with a password; share the password only with the right people." },
    { q: "Can I sell merch without a store?", a: "Yes, with product cards that link to your payment link. See the guide to selling without an online store." },
  ],
  related: ["how-to-add-a-link-in-tiktok-bio", "sell-on-instagram-without-a-store", "editable-dynamic-qr-code"],
};

export default article;
