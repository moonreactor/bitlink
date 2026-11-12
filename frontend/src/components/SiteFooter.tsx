import Link from "next/link";
import { BitlinkLogo } from "@/components/BitlinkLogo";
import { LANDING } from "@/lib/i18n/landing-copy";
import { homeAnchor, homePath, shortenerPath, type SiteLang } from "@/lib/i18n/site";

type Column = { title: string; links: { href: string; label: string }[] };

function columns(lang: SiteLang): Column[] {
  const f = LANDING[lang].footer;
  const product: Column = {
    title: f.product,
    links: [
      { href: homeAnchor(lang, "product"), label: f.linkInBio },
      { href: shortenerPath(lang), label: f.freeShortener },
      // Cross-language entry points keep the other shorteners discoverable for SEO.
      ...(lang === "en"
        ? [
            { href: shortenerPath("es"), label: "Acortador de links gratis" },
            { href: shortenerPath("pt"), label: "Encurtador de links grátis" },
          ]
        : lang === "es"
          ? [{ href: shortenerPath("pt"), label: "Encurtador de links grátis" }]
          : [{ href: shortenerPath("es"), label: "Acortador de links gratis" }]),
      { href: homeAnchor(lang, "how"), label: f.shortAndQr },
      { href: homeAnchor(lang, "faq"), label: f.faq },
      { href: "/register", label: f.signUp },
      { href: "/login", label: f.login },
    ],
  };

  if (lang === "pt") return [product];

  if (lang === "es") {
    return [
      product,
      {
        title: f.guides,
        links: [
          { href: "/es/blog/que-es-un-link-en-bio", label: "Qué es un link en bio" },
          { href: "/es/blog", label: "Todos los artículos" },
        ],
      },
      {
        title: f.blog,
        links: [
          { href: "/es/blog", label: "Blog de Bitlink" },
          { href: "/blog", label: "Blog in English" },
        ],
      },
    ];
  }

  return [
    product,
    {
      title: f.guides,
      links: [
        { href: "/blog/what-is-a-link-in-bio", label: "What is a link in bio" },
        { href: "/blog/how-to-add-multiple-links-on-instagram", label: "Multiple links on Instagram" },
        { href: "/blog/what-are-utm-parameters", label: "UTM parameters" },
        { href: "/blog/bitlink-vs-linktree", label: "Bitlink vs Linktree" },
        { href: "/blog/bitlink-vs-bitly", label: "Bitlink vs Bitly" },
      ],
    },
    {
      title: f.blog,
      links: [
        { href: "/blog", label: "All articles" },
        { href: "/blog/category/news", label: "News" },
        { href: "/blog/link-in-bio-glossary", label: "Glossary" },
        { href: "/es/blog", label: "Blog en español" },
        { href: "/es/blog/que-es-un-link-en-bio", label: "Qué es un link en bio" },
      ],
    },
  ];
}

export function SiteFooter({ lang = "en" }: { lang?: SiteLang }) {
  const f = LANDING[lang].footer;
  return (
    <footer className="bg-[#1a1a1a] px-5 py-12 text-white md:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <BitlinkLogo onDark height={26} href={homePath(lang)} />
          <p className="mt-4 max-w-xs text-sm text-white/55">{f.tagline}</p>
        </div>
        {columns(lang).map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-xs font-bold uppercase tracking-wider text-white/40">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm text-white/65 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-white/35">
        © {new Date().getFullYear()} Bitlink · {f.note}
      </p>
    </footer>
  );
}
