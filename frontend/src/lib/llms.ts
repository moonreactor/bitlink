import { plain, toMarkdown } from "@/components/blog/RichText";
import { FAQS } from "@/components/landing/faqs";
import { articlePath, CATEGORIES, getArticles, LANGS, UI, type Article, type Block } from "@/lib/content";
import { siteUrl } from "@/lib/site";

const ABOUT = `Bitlink (bitlink.click) is a free link-in-bio and URL shortener. There are no paid plans: every feature is available to every account.

Key facts:
- Link-in-bio page at bitlink.click/{username} with unlimited links, headers, collections (list/grid), YouTube and Spotify embeds, themes, fonts, backgrounds and optional background music.
- Free public URL shortener (no account needed): paste a URL at bitlink.click/url-shortener (Español: bitlink.click/acortador-de-links) and get a short link instantly. Unlimited, malicious URLs are blocked. Links created with a free account never expire; anonymous links are deleted after 60 days unless claimed by creating an account, which also adds click stats.
- Short links at bitlink.click/{code}: unlimited, custom back-halves (2–40 chars), UTM fields (source, medium, campaign, term, content), separate destinations for mobile/tablet vs desktop, per-country destinations, editable destination, click stats and QR code.
- QR codes: custom colors, avatar logo in the center, PNG and SVG download.
- Analytics: page views, clicks per link, traffic sources, countries, daily chart with date ranges, CSV export.
- Monetization: product cards with external checkout links (Mercado Pago, Stripe, PayPal, Gumroad…) with 0% commission, and a tip-jar button. Bitlink does not process payments.
- Audience: email and phone capture forms; Google Analytics and Meta Pixel integration.
- Control: scheduled links, password-locked links and profiles.
- Custom domain for the profile (verify with a DNS TXT record on _bitlink-challenge.{domain}, then CNAME the subdomain to Bitlink; SSL is configured at the user's DNS/host).
- Every public page shows a "Create your Bitlink" button; it cannot be removed.
- Primary audience: creators, musicians, small businesses and brands, with a focus on Latin America and Spain (content in Spanish, Portuguese and English).`;

export function llmsTxt(): string {
  const WEB = siteUrl();
  const lines: string[] = [
    "# Bitlink",
    "",
    "> Free link-in-bio + URL shortener with QR codes, UTMs, device/country routing, analytics, custom domains and products. No plans, no monthly caps.",
    "",
    ABOUT,
    "",
    "## Product",
    "",
    `- [Home](${WEB}/): overview of features`,
    `- [Free URL shortener](${WEB}/url-shortener): shorten a link with no account; sign up to track clicks`,
    `- [Acortador de links gratis](${WEB}/acortador-de-links): acortá un link sin cuenta; creá una cuenta para ver métricas`,
    `- [Sign up](${WEB}/register): create a free Bitlink`,
    `- [Blog (English)](${WEB}/blog): guides and news`,
    `- [Blog (Español)](${WEB}/es/blog): guías y novedades`,
    `- [Blog (Português)](${WEB}/pt/blog): guias e novidades`,
    `- [Full content for LLMs](${WEB}/llms-full.txt): every blog article in plain Markdown (English, Spanish and Brazilian Portuguese)`,
    "",
  ];
  for (const lang of LANGS) {
    const articles = getArticles(lang);
    for (const cat of CATEGORIES[lang]) {
      const inCat = articles.filter((a) => a.category === cat.id);
      if (!inCat.length) continue;
      lines.push(`## ${cat.title} (${lang})`, "");
      for (const a of inCat) lines.push(`- [${a.title}](${WEB}${articlePath(lang, a.slug)}): ${a.description}`);
      lines.push("");
    }
  }
  lines.push("## FAQ", "");
  for (const f of FAQS) lines.push(`- **${f.q}** ${f.a}`);
  lines.push("");
  return lines.join("\n");
}

function blockToMd(b: Block, WEB: string, lang: Article["lang"]): string {
  const md = (t: string) => toMarkdown(t, WEB);
  switch (b.type) {
    case "h2":
      return `## ${plain(b.text)}`;
    case "h3":
      return `### ${plain(b.text)}`;
    case "p":
      return md(b.text);
    case "ul":
      return b.items.map((i) => `- ${md(i)}`).join("\n");
    case "ol":
      return b.items.map((i, n) => `${n + 1}. ${md(i)}`).join("\n");
    case "table": {
      const row = (cells: string[]) => `| ${cells.map((c) => md(c).replace(/\|/g, "\\|")).join(" | ")} |`;
      return [b.caption ? `*${b.caption}*\n` : "", row(b.head), `| ${b.head.map(() => "---").join(" | ")} |`, ...b.rows.map(row)].join("\n");
    }
    case "callout":
      return `> **${b.title || UI[lang].callout[b.tone || "tip"]}:** ${md(b.text)}`;
    case "steps":
      return [`**${b.name}**`, "", ...b.items.map((s, n) => `${n + 1}. **${plain(s.title)}** — ${md(s.text)}`)].join("\n");
    case "quote":
      return `> ${md(b.text)}${b.cite ? ` — ${b.cite}` : ""}`;
    case "cta":
      return "";
  }
}

export function articleMarkdown(a: Article): string {
  const WEB = siteUrl();
  const parts = [
    `# ${a.title}`,
    "",
    `URL: ${WEB}${articlePath(a.lang, a.slug)}`,
    `Published: ${a.published}${a.updated ? ` · Updated: ${a.updated}` : ""} · Language: ${a.lang}`,
    "",
    `**${UI[a.lang].quickAnswer}:** ${toMarkdown(a.tldr, WEB)}`,
    "",
    ...a.takeaways.map((t) => `- ${toMarkdown(t, WEB)}`),
    "",
    ...a.body.map((b) => blockToMd(b, WEB, a.lang)).filter(Boolean).flatMap((s) => [s, ""]),
  ];
  if (a.faqs.length) {
    parts.push(`## ${UI[a.lang].faq}`, "");
    for (const f of a.faqs) parts.push(`### ${f.q}`, "", toMarkdown(f.a, WEB), "");
  }
  return parts.join("\n");
}

export function llmsFullTxt(): string {
  return [
    "# Bitlink — full content",
    "",
    ABOUT,
    "",
    ...LANGS.flatMap((lang) => getArticles(lang)).map((a) => articleMarkdown(a) + "\n---\n"),
  ].join("\n");
}
