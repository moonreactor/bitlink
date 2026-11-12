import { ImageResponse } from "next/og";
import { blogBase, getArticle, getCategory, UI, type Lang } from "@/lib/content";

export const OG_SIZE = { width: 1200, height: 630 };

export function renderArticleOg(lang: Lang, slug: string) {
  const article = getArticle(lang, slug);
  const title = article?.title || UI[lang].blogName;
  const category = article ? getCategory(lang, article.category)?.name : UI[lang].blog;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #7050D1 0%, #4b2fa8 60%, #2a175f 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.16)",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {category}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: title.length > 70 ? 58 : 68, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 1040 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 30 }}>
          <div style={{ display: "flex", fontWeight: 800, fontSize: 40 }}>bitlink</div>
          <div style={{ display: "flex", color: "#c6f432", fontWeight: 700 }}>bitlink.click{blogBase(lang)}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
