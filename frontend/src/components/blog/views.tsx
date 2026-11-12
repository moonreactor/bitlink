/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  articlePath,
  blogBase,
  CATEGORIES,
  categoryPath,
  getArticle,
  getArticles,
  getArticlesByCategory,
  getCategory,
  getCategoryBySlug,
  getRelated,
  getTranslations,
  LOCALE,
  rssPath,
  toc,
  UI,
  type Lang,
} from "@/lib/content";
import { articleLd, breadcrumbLd, JsonLd, ORG_ID, organizationLd } from "@/lib/jsonld";
import { defaultOgImages, siteUrl } from "@/lib/site";
import { ArticleCard, ArticleMeta, CategoryChip } from "./ArticleCard";
import { ArticleBody, InlineCta } from "./ArticleBody";
import { BlogHeader } from "./BlogHeader";
import { plain, RichText } from "./RichText";

const other = (lang: Lang): Lang => (lang === "en" ? "es" : "en");

/** hreflang map for a page that exists in both languages. */
function languages(en: string, es: string) {
  return { en, es, "x-default": en };
}

function rssTypes(lang: Lang) {
  return { "application/rss+xml": [{ url: rssPath(lang), title: UI[lang].blogName }] };
}

/* ───────────────────────────── Index ───────────────────────────── */

export function blogIndexMetadata(lang: Lang): Metadata {
  const t = UI[lang];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: blogBase(lang),
      languages: languages(blogBase("en"), blogBase("es")),
      types: rssTypes(lang),
    },
    openGraph: {
      title: t.metaTitle,
      description: t.metaDescription,
      url: blogBase(lang),
      type: "website",
      locale: LOCALE[lang].og,
      alternateLocale: LOCALE[other(lang)].og,
      siteName: "Bitlink",
      images: defaultOgImages(),
    },
    twitter: { card: "summary_large_image", title: t.metaTitle, description: t.metaDescription },
  };
}

export function BlogIndexView({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const articles = getArticles(lang);
  const [featured, ...rest] = articles;
  const WEB = siteUrl();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            organizationLd(),
            {
              "@type": "Blog",
              "@id": `${WEB}${blogBase(lang)}#blog`,
              url: `${WEB}${blogBase(lang)}`,
              name: t.blogName,
              description: t.metaDescription,
              inLanguage: lang,
              publisher: { "@id": ORG_ID },
              blogPost: articles.map((a) => ({
                "@type": a.category === "novedades" ? "NewsArticle" : "BlogPosting",
                headline: a.title,
                url: `${WEB}${articlePath(lang, a.slug)}`,
                datePublished: a.published,
              })),
            },
            breadcrumbLd([
              { name: "Bitlink", path: "/" },
              { name: t.blog, path: blogBase(lang) },
            ]),
          ],
        }}
      />
      <BlogHeader
        lang={lang}
        eyebrow={t.indexEyebrow}
        title={t.indexTitle}
        description={t.indexIntro}
        otherLangHref={blogBase(other(lang))}
      />
      <div className="mx-auto max-w-6xl px-5 pb-20 md:px-8 md:pb-28">
        {featured && <ArticleCard article={featured} featured />}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
        <div className="mx-auto mt-16 max-w-3xl">
          <InlineCta lang={lang} />
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────── Category ─────────────────────────── */

export function categoryParams(lang: Lang) {
  return CATEGORIES[lang].map((c) => ({ category: c.slug }));
}

export function categoryMetadata(lang: Lang, slug: string): Metadata {
  const cat = getCategoryBySlug(lang, slug);
  if (!cat) return {};
  const twin = getCategory(other(lang), cat.id);
  const title = `${cat.title} | ${UI[lang].blogName}`;
  const path = categoryPath(lang, cat.slug);
  const twinPath = twin ? categoryPath(other(lang), twin.slug) : undefined;
  return {
    title,
    description: cat.description,
    alternates: {
      canonical: path,
      ...(twinPath ? { languages: lang === "en" ? languages(path, twinPath) : languages(twinPath, path) } : {}),
    },
    openGraph: {
      title,
      description: cat.description,
      url: path,
      type: "website",
      locale: LOCALE[lang].og,
      siteName: "Bitlink",
      images: defaultOgImages(),
    },
  };
}

export function CategoryView({ lang, slug }: { lang: Lang; slug: string }) {
  const t = UI[lang];
  const cat = getCategoryBySlug(lang, slug);
  if (!cat) notFound();
  const articles = getArticlesByCategory(lang, cat.id);
  const twin = getCategory(other(lang), cat.id);
  const WEB = siteUrl();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              url: `${WEB}${categoryPath(lang, cat.slug)}`,
              name: cat.title,
              description: cat.description,
              inLanguage: lang,
              mainEntity: {
                "@type": "ItemList",
                itemListElement: articles.map((a, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `${WEB}${articlePath(lang, a.slug)}`,
                  name: a.title,
                })),
              },
            },
            breadcrumbLd([
              { name: "Bitlink", path: "/" },
              { name: t.blog, path: blogBase(lang) },
              { name: cat.name, path: categoryPath(lang, cat.slug) },
            ]),
          ],
        }}
      />
      <BlogHeader
        lang={lang}
        eyebrow={t.categoryEyebrow}
        title={cat.title}
        description={cat.description}
        active={cat.id}
        otherLangHref={twin ? categoryPath(other(lang), twin.slug) : undefined}
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-20 sm:grid-cols-2 md:px-8 md:pb-28 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────── Article ─────────────────────────── */

export function articleParams(lang: Lang) {
  return getArticles(lang).map((a) => ({ slug: a.slug }));
}

export function articleMetadata(lang: Lang, slug: string): Metadata {
  const article = getArticle(lang, slug);
  if (!article) return {};
  const title = article.seoTitle || article.title;
  const path = articlePath(lang, article.slug);
  const twin = getTranslations(article)[0];
  const twinPath = twin ? articlePath(twin.lang, twin.slug) : undefined;
  const section = getCategory(lang, article.category)?.name;
  return {
    title,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: UI[lang].author, url: "/" }],
    category: section,
    alternates: {
      canonical: path,
      ...(twinPath ? { languages: lang === "en" ? languages(path, twinPath) : languages(twinPath, path) } : {}),
      types: rssTypes(lang),
    },
    openGraph: {
      type: "article",
      url: path,
      title,
      description: article.description,
      siteName: "Bitlink",
      locale: LOCALE[lang].og,
      ...(twin ? { alternateLocale: LOCALE[twin.lang].og } : {}),
      publishedTime: article.published,
      modifiedTime: article.updated || article.published,
      section,
      tags: article.keywords,
    },
    twitter: { card: "summary_large_image", title, description: article.description },
  };
}

export function ArticleView({ lang, slug }: { lang: Lang; slug: string }) {
  const article = getArticle(lang, slug);
  if (!article) notFound();
  const t = UI[lang];

  const headings = toc(article);
  const related = getRelated(article);
  const category = getCategory(lang, article.category);
  const twin = getTranslations(article)[0];

  return (
    <>
      <JsonLd data={articleLd(article)} />

      <article className="px-5 pb-16 pt-8 md:px-8 md:pt-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="Breadcrumb" className="text-sm text-meetup-muted">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="hover:text-ink">
                    Bitlink
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href={blogBase(lang)} className="hover:text-ink">
                    {t.blog}
                  </Link>
                </li>
                {category && (
                  <>
                    <li aria-hidden>/</li>
                    <li>
                      <Link href={categoryPath(lang, category.slug)} className="hover:text-ink">
                        {category.name}
                      </Link>
                    </li>
                  </>
                )}
              </ol>
            </nav>
            {twin && (
              <Link
                href={articlePath(twin.lang, twin.slug)}
                hrefLang={twin.lang}
                className="text-sm font-semibold text-meetup-muted hover:text-ink"
              >
                {t.otherLang} →
              </Link>
            )}
          </div>

          <header className="mt-6 max-w-3xl">
            <CategoryChip lang={lang} id={article.category} />
            <h1 className="mt-4 font-display text-[1.8rem] font-extrabold leading-[1.08] tracking-tight md:text-[2.8rem]">
              {article.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-meetup-muted md:text-xl">{article.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink">
                <img src="/bitlink-mark.png" alt="" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold">{t.author}</p>
                <ArticleMeta article={article} />
              </div>
              {article.updated && article.updated !== article.published && (
                <p className="text-sm text-meetup-muted">
                  · {t.updated} <time dateTime={article.updated}>{article.updated}</time>
                </p>
              )}
            </div>
          </header>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="min-w-0 max-w-3xl">
              {/* Answer-first block: the snippet search engines and AI assistants tend to quote. */}
              <section aria-labelledby="quick-answer" className="rounded-[1.5rem] border border-meetup-purple/15 bg-meetup-lavender/60 p-6">
                <h2 id="quick-answer" className="text-sm font-bold uppercase tracking-wider text-meetup-purple">
                  {t.quickAnswer}
                </h2>
                <p className="mt-2 text-[1.1rem] leading-relaxed text-ink">
                  <RichText text={article.tldr} />
                </p>
                <ul className="mt-4 space-y-1.5 text-[0.98rem] text-ink/80">
                  {article.takeaways.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-600" aria-hidden>
                        ✓
                      </span>
                      <span>
                        <RichText text={item} />
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {headings.length > 2 && (
                <nav aria-label={t.inThisArticle} className="mt-8 rounded-[1.5rem] border border-meetup-border p-6 lg:hidden">
                  <p className="text-sm font-bold">{t.inThisArticle}</p>
                  <ol className="mt-3 space-y-1.5 text-sm">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`} className="text-meetup-muted hover:text-meetup-purple">
                          {plain(h.text)}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <div className="mt-8">
                <ArticleBody blocks={article.body} lang={lang} />
              </div>

              {article.faqs.length > 0 && (
                <section aria-labelledby="faq" className="mt-14">
                  <h2 id="faq" className="scroll-mt-24 font-display text-2xl font-extrabold tracking-tight md:text-[1.85rem]">
                    {t.faq}
                  </h2>
                  <div className="mt-5 divide-y divide-meetup-border rounded-[1.5rem] border border-meetup-border">
                    {article.faqs.map((f, i) => (
                      <details key={i} className="group px-5 py-4 open:bg-mist/60" open={i === 0}>
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink">
                          <h3 className="text-[1.05rem]">{f.q}</h3>
                          <span className="text-xl text-meetup-purple transition group-open:rotate-45" aria-hidden>
                            +
                          </span>
                        </summary>
                        <p className="mt-2 leading-relaxed text-ink/80">
                          <RichText text={f.a} />
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-14">
                <InlineCta lang={lang} />
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {headings.length > 2 && (
                  <nav aria-label={t.inThisArticle} className="rounded-[1.5rem] border border-meetup-border p-5">
                    <p className="text-sm font-bold">{t.inThisArticle}</p>
                    <ol className="mt-3 space-y-2 text-sm">
                      {headings.map((h) => (
                        <li key={h.id}>
                          <a href={`#${h.id}`} className="block leading-snug text-meetup-muted hover:text-meetup-purple">
                            {plain(h.text)}
                          </a>
                        </li>
                      ))}
                      {article.faqs.length > 0 && (
                        <li>
                          <a href="#faq" className="block leading-snug text-meetup-muted hover:text-meetup-purple">
                            {t.faq}
                          </a>
                        </li>
                      )}
                    </ol>
                  </nav>
                )}
                <div className="rounded-[1.5rem] bg-ink p-5 text-white">
                  <p className="font-display text-lg font-bold leading-tight">{t.sideCtaTitle}</p>
                  <p className="mt-1 text-sm text-white/65">{t.sideCtaText}</p>
                  <Link href="/register" className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-ink hover:bg-meetup-lavender">
                    {t.ctaLabel}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related" className="bg-meetup-bg px-5 py-16 md:px-8 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 id="related" className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
              {t.keepReading}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
