/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { articlePath, categoryPath, formatDate, getCategory, readingMinutes, UI, type Article, type Lang } from "@/lib/content";

export function CategoryChip({ lang, id, link = true }: { lang: Lang; id: Article["category"]; link?: boolean }) {
  const cat = getCategory(lang, id);
  if (!cat) return null;
  const cls =
    "inline-flex items-center rounded-full bg-meetup-lavender px-3 py-1 text-xs font-bold text-meetup-purple";
  return link ? (
    <Link href={categoryPath(lang, cat.slug)} className={`${cls} hover:bg-accentMuted`}>
      {cat.name}
    </Link>
  ) : (
    <span className={cls}>{cat.name}</span>
  );
}

export function ArticleMeta({ article }: { article: Article }) {
  return (
    <p className="text-sm text-meetup-muted">
      <time dateTime={article.published}>{formatDate(article.published, article.lang)}</time>
      <span aria-hidden> · </span>
      {readingMinutes(article)} {UI[article.lang].minRead}
    </p>
  );
}

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-meetup-border bg-white shadow-meetup transition hover:-translate-y-1 hover:shadow-meetup-lg ${
        featured ? "md:grid md:grid-cols-[1.15fr_1fr]" : ""
      }`}
    >
      <div className={`relative overflow-hidden bg-mist ${featured ? "aspect-[16/10] md:aspect-auto md:min-h-[340px]" : "aspect-[16/9]"}`}>
        <img
          src={article.cover.src}
          alt={article.cover.alt}
          loading={featured ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className={`flex flex-1 flex-col p-6 ${featured ? "md:p-10" : ""}`}>
        <div className="relative z-10">
          <CategoryChip lang={article.lang} id={article.category} />
        </div>
        <h3
          className={`mt-4 font-display font-bold tracking-tight text-ink ${
            featured ? "text-2xl md:text-4xl md:leading-tight" : "text-xl leading-snug"
          }`}
        >
          <Link href={articlePath(article.lang, article.slug)} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        <p className={`mt-3 text-meetup-muted ${featured ? "md:text-lg" : "line-clamp-3 text-sm"}`}>{article.description}</p>
        <div className="mt-auto pt-5">
          <ArticleMeta article={article} />
        </div>
      </div>
    </article>
  );
}
