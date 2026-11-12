import Link from "next/link";
import { blogBase, getArticles, UI, type Lang } from "@/lib/content";
import { ArticleCard } from "./ArticleCard";

/** Server-rendered “From the blog” strip for the landing page (internal links for SEO). */
export function LatestPosts({ lang = "en" }: { lang?: Lang }) {
  const t = UI[lang];
  const posts = getArticles(lang)
    .filter((a) => a.category !== "novedades")
    .slice(0, 3);
  if (!posts.length) return null;
  return (
    <section lang={lang} aria-labelledby="from-the-blog" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-meetup-purple">{t.latestEyebrow}</p>
            <h2 id="from-the-blog" className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-5xl md:leading-[1.05]">
              {t.latestTitle}
            </h2>
          </div>
          <Link href={blogBase(lang)} className="mu-btn-ghost">
            {t.latestAll}
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
