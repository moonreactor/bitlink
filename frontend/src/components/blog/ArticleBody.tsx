import Link from "next/link";
import { headingId, UI, type Block, type Lang } from "@/lib/content";
import { RichText } from "./RichText";

const CALLOUT_STYLES = {
  tip: { box: "border-emerald-200 bg-emerald-50", label: "text-emerald-800", icon: "💡" },
  note: { box: "border-meetup-purple/20 bg-meetup-lavender", label: "text-meetup-purple", icon: "📌" },
  warn: { box: "border-amber-200 bg-amber-50", label: "text-amber-800", icon: "⚠️" },
} as const;

export function ArticleBody({ blocks, lang }: { blocks: Block[]; lang: Lang }) {
  return (
    <div className="space-y-6 text-[1.075rem] leading-[1.75] text-ink/85">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} lang={lang} />
      ))}
    </div>
  );
}

function BlockView({ block, lang }: { block: Block; lang: Lang }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={headingId(block)} className="scroll-mt-24 pt-6 font-display text-2xl font-extrabold tracking-tight text-ink md:text-[1.85rem]">
          <RichText text={block.text} />
        </h2>
      );
    case "h3":
      return (
        <h3 className="pt-2 font-display text-xl font-bold tracking-tight text-ink">
          <RichText text={block.text} />
        </h3>
      );
    case "p":
      return (
        <p>
          <RichText text={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul className="space-y-2 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-meetup-purple" aria-hidden />
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal space-y-2 pl-6 marker:font-bold marker:text-meetup-purple">
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              <RichText text={item} />
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
          <table className="w-full min-w-[520px] border-separate border-spacing-0 overflow-hidden rounded-2xl border border-meetup-border text-left text-[0.95rem]">
            {block.caption && <caption className="mb-2 text-left text-sm text-meetup-muted">{block.caption}</caption>}
            <thead>
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} scope="col" className="bg-mist px-4 py-3 font-bold text-ink">
                    <RichText text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row" className="border-t border-meetup-border px-4 py-3 align-top font-semibold text-ink">
                        <RichText text={cell} />
                      </th>
                    ) : (
                      <td key={c} className="border-t border-meetup-border px-4 py-3 align-top">
                        <RichText text={cell} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout": {
      const tone = block.tone || "tip";
      const s = CALLOUT_STYLES[tone];
      return (
        <aside className={`rounded-2xl border px-5 py-4 ${s.box}`}>
          <p className={`text-sm font-bold ${s.label}`}>
            <span aria-hidden>{s.icon} </span>
            {block.title || UI[lang].callout[tone]}
          </p>
          <p className="mt-1 text-[1rem] leading-relaxed text-ink/80">
            <RichText text={block.text} />
          </p>
        </aside>
      );
    }
    case "steps":
      return (
        <ol className="space-y-4" aria-label={block.name}>
          {block.items.map((step, i) => (
            <li key={i} id={`paso-${i + 1}`} className="flex scroll-mt-24 gap-4 rounded-2xl border border-meetup-border bg-white p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-bold text-ink">
                  <RichText text={step.title} />
                </p>
                <p className="mt-1 text-[1rem] leading-relaxed">
                  <RichText text={step.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-meetup-purple pl-5 font-display text-xl font-semibold leading-snug text-ink">
          <RichText text={block.text} />
          {block.cite && <footer className="mt-2 font-body text-sm font-normal text-meetup-muted">— {block.cite}</footer>}
        </blockquote>
      );
    case "cta":
      return <InlineCta lang={lang} title={block.title} text={block.text} href={block.href} label={block.label} />;
  }
}

export function InlineCta({
  lang,
  title = UI[lang].ctaTitle,
  text = UI[lang].ctaText,
  href = "/register",
  label = UI[lang].ctaLabel,
}: {
  lang: Lang;
  title?: string;
  text?: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="not-prose relative overflow-hidden rounded-[1.75rem] bg-meetup-purple px-6 py-7 text-white md:px-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <p className="relative font-display text-2xl font-extrabold tracking-tight">{title}</p>
      <p className="relative mt-1 text-white/80">{text}</p>
      <Link
        href={href}
        className="relative mt-5 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-meetup-lavender"
      >
        {label} →
      </Link>
    </div>
  );
}
