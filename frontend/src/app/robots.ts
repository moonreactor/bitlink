import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const PRIVATE = ["/dashboard", "/admin", "/api/", "/forgot-password", "/reset-password"];

/**
 * AI assistants and answer engines are explicitly allowed: being quotable by
 * ChatGPT, Claude, Perplexity, Gemini & co. is the point of the blog (GEO).
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  const WEB = siteUrl();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${WEB}/sitemap.xml`,
    host: WEB,
  };
}
