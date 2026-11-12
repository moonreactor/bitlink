import type { Article } from "../../types";

const article: Article = {
  lang: "en",
  key: "como-poner-varios-links-en-instagram",
  slug: "how-to-add-multiple-links-on-instagram",
  category: "guias",
  title: "How to add multiple links on Instagram (bio, Stories and Reels), step by step",
  seoTitle: "How to add multiple links on Instagram, step by step",
  description:
    "Every way to share more than one link on Instagram: native profile links, the Stories link sticker and a link-in-bio page. Step by step.",
  published: "2026-11-06",
  keywords: ["multiple links on instagram", "how to add links on instagram", "instagram link in bio", "link sticker", "add link instagram"],
  tldr:
    "Instagram lets you add **up to 5 links** to your profile, but the bio only shows the first one and the rest hide behind a menu. The most effective way to share several links is a **single link in bio** (for example, `bitlink.click/yourname`) that opens a page with all your destinations, plus the **link sticker** in Stories.",
  takeaways: [
    "Profile: Edit profile → Links → Add external link.",
    "Stories: the “Link” sticker, available to all accounts.",
    "Reels and posts: captions aren't clickable; say “link in bio”.",
    "A link-in-bio page organizes everything and gives you analytics.",
  ],
  cover: { src: "/landing/1554080353-a576cf803bda-900x1100.webp", alt: "Photographer taking a picture with her camera on a city street at night" },
  body: [
    { type: "h2", text: "Where you can add links on Instagram" },
    {
      type: "table",
      head: ["Place", "Clickable link?", "Notes"],
      rows: [
        ["Profile bio", "Yes", "Up to 5 links; the bio shows the first one and “and X more”"],
        ["Stories", "Yes", "With the “Link” sticker; lasts 24 h unless saved to Highlights"],
        ["Post and Reel captions", "No", "URLs in captions aren't clickable"],
        ["Direct messages", "Yes", "Useful for auto-replies or questions"],
        ["Action buttons (professional accounts)", "Yes", "Book, order food, etc., with supported partners"],
      ],
    },
    {
      type: "callout",
      tone: "note",
      text: "Instagram changes features often and they can vary by country or account type. Check the app if you see something different.",
    },
    { type: "h2", text: "Option 1: native profile links" },
    {
      type: "p",
      text: "In the app: **Edit profile → Links → Add external link**. You can add several, but the bio only shows the first; to see the others people have to tap “and X more”. Many don't, so your second, third and fourth links get few clicks. Instagram also doesn't give you detailed click data per link.",
    },
    { type: "h2", text: "Option 2: a link-in-bio page (the most effective)" },
    {
      type: "p",
      text: "Put **one link** in your bio that opens a page with all your buttons, ordered however you like. It's what most creators and brands do. Not sure what that is? Read [what is a link in bio](/blog/what-is-a-link-in-bio).",
    },
    {
      type: "steps",
      name: "How to add multiple links on Instagram with a link in bio",
      items: [
        { title: "Create your page", text: "Sign up free at [Bitlink](/register) and pick your name, ideally your Instagram handle." },
        { title: "Add your links", text: "Shop, WhatsApp, latest Reel, YouTube, newsletter. Put the most important one at the top." },
        { title: "Copy your link", text: "For example, `bitlink.click/yourname`." },
        { title: "Paste it into Instagram", text: "Edit profile → Links → Add external link → paste the URL and add a title like “All my links”." },
        { title: "Keep it first", text: "If you have several native links, make sure your page is first — that's the one shown in the bio." },
      ],
    },
    { type: "h2", text: "Option 3: the link sticker in Stories" },
    {
      type: "p",
      text: "In a Story, tap the stickers icon and choose **Link**. Paste the URL and customize the sticker text. For campaigns, use a **short link with UTMs** (`bitlink.click/drop-ig`) so you can measure clicks from that Story. See [what UTM parameters are](/blog/what-are-utm-parameters).",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Save it to Highlights",
      text: "A Story with a link saved to Highlights (“Shop”, “Bookings”) works like a second permanent link on your profile.",
    },
    { type: "h2", text: "How to get more clicks from Instagram" },
    {
      type: "ul",
      items: [
        "**Call to action in the bio**: “👇 Tickets and merch” above the link.",
        "**Mention the link** in the Reel and in the caption: “link in bio”.",
        "**Reorder for the moment**: during a launch, the launch goes first.",
        "**Check sources**: Bitlink analytics show how many people arrive from Instagram versus other networks.",
      ],
    },
    { type: "cta", title: "One link for your whole Instagram bio", text: "Create your page for free and start measuring what gets clicked." },
  ],
  faqs: [
    { q: "How many links can I add to my Instagram bio?", a: "Instagram lets you add up to 5 links to your profile, but only the first is shown in the bio. That's why the first one should be a link-in-bio page." },
    { q: "Can I add a clickable link to a Reel?", a: "Not in the caption. Use your bio link, the Stories link sticker or send the link by direct message." },
    { q: "Do I need a professional account to add links?", a: "No. Any account can add profile links and use the link sticker in Stories." },
    { q: "Does Instagram penalize link-in-bio links?", a: "There's no evidence that a link-in-bio page reduces reach. It's standard practice among creators and brands." },
  ],
  related: ["what-is-a-link-in-bio", "how-to-add-a-link-in-tiktok-bio", "sell-on-instagram-without-a-store"],
};

export default article;
