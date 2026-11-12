import Link from "next/link";
import { blogBase, CATEGORIES, categoryPath, UI, type CategoryId, type Lang } from "@/lib/content";

export function BlogHeader({
  lang,
  eyebrow,
  title,
  description,
  active,
  otherLangHref,
}: {
  lang: Lang;
  eyebrow: string;
  title: string;
  description: string;
  active?: CategoryId;
  /** Same page in the other language, if it exists. */
  otherLangHref?: string;
}) {
  const t = UI[lang];
  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-12 md:px-8 md:pb-14 md:pt-20">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[460px] w-[460px] rounded-full bg-meetup-lavender blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold uppercase tracking-wider text-meetup-purple">{eyebrow}</p>
          {otherLangHref && (
            <Link href={otherLangHref} hrefLang={lang === "en" ? "es" : "en"} className="text-sm font-semibold text-meetup-muted hover:text-ink">
              {t.otherLang} →
            </Link>
          )}
        </div>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight md:text-6xl md:leading-[1.03]">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-meetup-muted">{description}</p>
        <nav aria-label={t.categoriesNav} className="mt-8 flex flex-wrap gap-2">
          <Link href={blogBase(lang)} className={`mu-chip ${!active ? "mu-chip-active" : ""}`} aria-current={!active ? "page" : undefined}>
            {t.all}
          </Link>
          {CATEGORIES[lang].map((c) => (
            <Link
              key={c.id}
              href={categoryPath(lang, c.slug)}
              className={`mu-chip ${active === c.id ? "mu-chip-active" : ""}`}
              aria-current={active === c.id ? "page" : undefined}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
