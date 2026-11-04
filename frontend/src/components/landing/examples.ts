import type { SocialBrandId } from "@/lib/socialBrands";

/** Unsplash image helper — crops server-side so we never ship oversized photos. */
export function photo(id: string, w: number, h?: number) {
  const size = h ? `&h=${h}&fit=crop&crop=faces,center` : "";
  return `https://images.unsplash.com/photo-${id}?auto=format&q=70&w=${w}${size}`;
}

/** Blocks mirror real link types a Bitlink profile can render. */
export type ExampleBlock =
  | { kind: "link"; title: string; thumb?: string; animation?: string }
  | { kind: "header"; title: string }
  | { kind: "youtube"; title: string; thumb: string; duration: string }
  | { kind: "spotify"; title: string; artist: string; cover: string }
  | { kind: "grid"; title: string; items: { title: string; thumb: string }[] }
  | { kind: "product"; title: string; description: string; price: string; thumb: string }
  | { kind: "tip"; label: string }
  | { kind: "email"; prompt: string };

export type ExampleProfile = {
  id: string;
  name: string;
  handle: string;
  role: string;
  /** Short label for tabs */
  tag: string;
  bio: string;
  verified?: boolean;
  avatar: string;
  cover: string;
  /** Optional custom domain to show off that feature */
  domain?: string;
  socials: SocialBrandId[];
  theme: {
    bg: string;
    bgImage?: string;
    text: string;
    button: string;
    buttonText: string;
    style: "pill" | "rounded" | "square";
  };
  stat: string;
  blocks: ExampleBlock[];
};

export const EXAMPLES: ExampleProfile[] = [
  {
    id: "music",
    name: "Lucía Ríos",
    handle: "luciarios",
    tag: "Music",
    role: "Singer-songwriter",
    bio: "New single “Marea” out now 🌊 Tour 2026",
    verified: true,
    avatar: photo("1529626455594-4ff0802cfb7e", 160, 160),
    cover: photo("1493225457124-a3eb161ffa5f", 900, 1100),
    socials: ["instagram", "tiktok", "spotify", "youtube"],
    theme: {
      bg: "#1b1030",
      bgImage: photo("1459749411175-04bf5292ceea", 500, 900),
      text: "#ffffff",
      button: "rgba(255,255,255,0.14)",
      buttonText: "#ffffff",
      style: "pill",
    },
    stat: "+2.4k plays this week",
    blocks: [
      { kind: "spotify", title: "Marea", artist: "Lucía Ríos", cover: photo("1511379938547-c1f69419868d", 120, 120) },
      { kind: "link", title: "Tour tickets — Buenos Aires", thumb: photo("1470225620780-dba8ba36b745", 80, 80), animation: "glow" },
      { kind: "product", title: "Signed vinyl", description: "Limited run · 200 copies", price: "$35", thumb: photo("1511671782779-c97d3d27a1d4", 120, 120) },
      { kind: "tip", label: "Buy me a coffee ☕" },
    ],
  },
  {
    id: "chef",
    name: "Tomás Herrera",
    handle: "cocinacontomas",
    tag: "Food",
    role: "Chef & recipe creator",
    bio: "Easy weeknight recipes · Private dinners in CDMX",
    avatar: photo("1556157382-97eda2d62296", 160, 160),
    cover: photo("1504674900247-0877df9cc836", 900, 1100),
    socials: ["instagram", "youtube", "tiktok", "whatsapp"],
    theme: {
      bg: "#fff4e6",
      text: "#3b1d0a",
      button: "#3b1d0a",
      buttonText: "#fff4e6",
      style: "rounded",
    },
    stat: "38 dinner bookings",
    blocks: [
      { kind: "youtube", title: "15-min chicken tinga", thumb: photo("1504674900247-0877df9cc836", 400, 225), duration: "12:48" },
      {
        kind: "grid",
        title: "Recipes",
        items: [
          { title: "Poke bowl", thumb: photo("1546069901-ba9599a7e63c", 200, 200) },
          { title: "Berry cake", thumb: photo("1565958011703-44f9829ba187", 200, 200) },
        ],
      },
      { kind: "product", title: "Weeknight cookbook", description: "PDF · 60 recipes", price: "$12", thumb: photo("1546069901-ba9599a7e63c", 120, 120) },
      { kind: "link", title: "Book a private dinner", animation: "pulse" },
    ],
  },
  {
    id: "photo",
    name: "Sofía Vidal",
    handle: "sofiavidal",
    tag: "Photography",
    role: "Travel photographer",
    bio: "Shooting light in faraway places 📷",
    verified: true,
    avatar: photo("1502920917128-1aa500764cbd", 160, 160),
    cover: photo("1502920917128-1aa500764cbd", 900, 1100),
    domain: "links.sofiavidal.com",
    socials: ["instagram", "behance", "pinterest", "mail"],
    theme: {
      bg: "#f3f1ec",
      text: "#1f1f1f",
      button: "#ffffff",
      buttonText: "#1f1f1f",
      style: "square",
    },
    stat: "312 new subscribers",
    blocks: [
      {
        kind: "grid",
        title: "Portfolio",
        items: [
          { title: "Iceland", thumb: photo("1542038784456-1ea8e935640e", 200, 200) },
          { title: "Studio", thumb: photo("1554080353-a576cf803bda", 200, 200) },
        ],
      },
      { kind: "product", title: "Lightroom presets", description: "12 film looks · instant download", price: "$15", thumb: photo("1554080353-a576cf803bda", 120, 120) },
      { kind: "link", title: "Book a session", thumb: photo("1542038784456-1ea8e935640e", 80, 80) },
      { kind: "email", prompt: "Monthly photo letter" },
    ],
  },
  {
    id: "fitness",
    name: "Valentina Cruz",
    handle: "valefit",
    tag: "Fitness",
    role: "Strength coach",
    bio: "Stronger in 20 min a day. Online coaching 🇨🇱",
    avatar: photo("1573496359142-b8d87734a5a2", 160, 160),
    cover: photo("1571019613454-1cb2f99b2d8b", 900, 1100),
    socials: ["instagram", "tiktok", "youtube", "whatsapp"],
    theme: {
      bg: "#0d2b1d",
      text: "#eafff3",
      button: "#c6f432",
      buttonText: "#0d2b1d",
      style: "pill",
    },
    stat: "$1,240 in sales",
    blocks: [
      { kind: "product", title: "12-week program", description: "Workouts + meal guide", price: "$39", thumb: photo("1517836357463-d25dfeac3438", 120, 120) },
      { kind: "link", title: "1:1 coaching — apply", animation: "bounce" },
      { kind: "youtube", title: "Full-body 20 min", thumb: photo("1517836357463-d25dfeac3438", 400, 225), duration: "21:05" },
      { kind: "link", title: "WhatsApp me", thumb: photo("1571019613454-1cb2f99b2d8b", 80, 80) },
    ],
  },
];

/** Smaller tiles for the scrolling showcase strip. */
export const SHOWCASE = [
  { label: "Musicians", img: photo("1493225457124-a3eb161ffa5f", 360, 440), shape: "rounded-full" },
  { label: "Chefs", img: photo("1504674900247-0877df9cc836", 360, 440), shape: "rounded-[2rem]" },
  { label: "Photographers", img: photo("1502920917128-1aa500764cbd", 360, 440), shape: "rounded-t-full rounded-b-[2rem]" },
  { label: "Coaches", img: photo("1571019613454-1cb2f99b2d8b", 360, 440), shape: "rounded-[2rem]" },
  { label: "Shops", img: photo("1441986300917-64674bd600d8", 360, 440), shape: "rounded-full" },
  { label: "DJs", img: photo("1516280440614-37939bbacd81", 360, 440), shape: "rounded-b-full rounded-t-[2rem]" },
  { label: "Podcasters", img: photo("1520813792240-56fc4a3765a7", 360, 440), shape: "rounded-[2rem]" },
  { label: "Fashion", img: photo("1490481651871-ab68de25d43d", 360, 440), shape: "rounded-full" },
  { label: "Creators", img: photo("1517841905240-472988babdf9", 360, 440), shape: "rounded-t-full rounded-b-[2rem]" },
  { label: "Studios", img: photo("1460925895917-afdab827c52f", 360, 440), shape: "rounded-[2rem]" },
];
