import { plain } from "@/components/blog/RichText";
import { articlePath, blogBase, getArticles, getCategory, LOCALE, rssPath, UI, type Lang } from "@/lib/content";
import { siteUrl } from "@/lib/site";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function rssResponse(lang: Lang): Response {
  const WEB = siteUrl();
  const t = UI[lang];
  const articles = getArticles(lang);
  const items = articles
    .map((a) => {
      const url = `${WEB}${articlePath(lang, a.slug)}`;
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${a.published}T12:00:00Z`).toUTCString()}</pubDate>
      <category>${esc(getCategory(lang, a.category)?.name || "")}</category>
      <description>${esc(`${a.description} — ${plain(a.tldr)}`)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(t.blogName)}</title>
    <link>${WEB}${blogBase(lang)}</link>
    <atom:link href="${WEB}${rssPath(lang)}" rel="self" type="application/rss+xml" />
    <description>${esc(t.rssDescription)}</description>
    <language>${LOCALE[lang].hreflang}</language>
    <lastBuildDate>${new Date(`${articles[0]?.published || "2026-11-04"}T12:00:00Z`).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
