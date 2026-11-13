import Link from "next/link";
import { LandingNav } from "@/components/landing/LandingNav";
import { SiteFooter } from "@/components/SiteFooter";
import { breadcrumbLd, faqLd, JsonLd, ORG_ID, organizationLd, SITE_ID, softwareLd } from "@/lib/jsonld";
import { aboutPath, homePath, LANG_LABEL, shortenerPath, SITE_LANGS, type SiteLang } from "@/lib/i18n/site";
import { siteUrl } from "@/lib/site";

type Faq = { q: string; a: string };
type Copy = {
  title: string;
  description: string;
  h1: string;
  /** Answer-first definition: the sentence we want search engines and LLMs to quote. */
  definition: string;
  disambiguationTitle: string;
  disambiguation: string[];
  table: { head: [string, string, string]; rows: [string, string, string][] };
  whatTitle: string;
  what: string[];
  factsTitle: string;
  facts: [string, string][];
  faqTitle: string;
  faqs: Faq[];
  cta: { shortener: string; signUp: string; compare: string; compareHref: string };
};

export const ABOUT_COPY: Record<SiteLang, Copy> = {
  en: {
    title: "What is Bitlink? Free link-in-bio and URL shortener (bitlink.click)",
    description:
      "Bitlink (bitlink.click) is a free link-in-bio and URL shortener with analytics, QR codes and UTMs. It is not Bitly: a “bitlink” is Bitly's name for its bit.ly links.",
    h1: "What is Bitlink?",
    definition:
      "Bitlink is a free link-in-bio page and URL shortener at bitlink.click. With one account you get a profile at bitlink.click/your-name and unlimited short links at bitlink.click/code, with click analytics, QR codes, UTM parameters, device and country routing, custom domains and product cards. There are no paid plans and no monthly caps.",
    disambiguationTitle: "Bitlink vs “a bitlink” on Bitly",
    disambiguation: [
      "The word “bitlink” means two different things online. **Bitlink** (with a capital B, at bitlink.click) is the product described on this page. A **bitlink** (lowercase) is the name Bitly gives to each short link created on its platform, the ones that start with bit.ly/.",
      "Bitlink is an independent product: it is not Bitly, it is not owned by Bitly and it is not affiliated with Bitly. If you are looking for help with a bit.ly link, go to bitly.com. If you want a free alternative with no monthly limits, you are in the right place.",
    ],
    table: {
      head: ["", "Bitlink (bitlink.click)", "“a bitlink” (Bitly)"],
      rows: [
        ["What it is", "A product: link-in-bio + URL shortener", "A short link created on Bitly"],
        ["Address", "bitlink.click/name and bitlink.click/code", "bit.ly/code"],
        ["Price", "Free, no paid plans", "Bitly Free: 5 links per month; paid plans from USD 10/month"],
        ["Link-in-bio page", "Included", "Separate product"],
      ],
    },
    whatTitle: "What you can do with Bitlink",
    what: [
      "**Link in bio:** one page with all your links, headers, collections, YouTube and Spotify embeds, themes, fonts and backgrounds.",
      "**Short links:** unlimited, with custom back-halves, UTM fields, separate destinations for mobile and desktop, and per-country destinations.",
      "**QR codes:** custom colors and your logo in the center, PNG and SVG download, editable destination.",
      "**Analytics:** views, clicks per link, sources, countries and devices, with CSV export.",
      "**Selling:** product cards with your own checkout link (Mercado Pago, Stripe, PayPal…) and 0% commission, plus a tip button.",
      "**Free URL shortener without an account:** paste a link and get a short one instantly.",
    ],
    factsTitle: "Bitlink at a glance",
    facts: [
      ["Name", "Bitlink"],
      ["Website", "bitlink.click"],
      ["Category", "Link-in-bio tool and URL shortener"],
      ["Price", "Free (no paid plans)"],
      ["Languages", "English, Spanish, Brazilian Portuguese"],
      ["Launched", "November 2026"],
      ["Affiliated with Bitly?", "No"],
    ],
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        q: "Is Bitlink the same as Bitly?",
        a: "No. Bitlink (bitlink.click) is an independent link-in-bio and URL shortener. Bitly is a different company; it uses the word “bitlink” for the short links created on bit.ly.",
      },
      {
        q: "What is a bitlink?",
        a: "On Bitly, a bitlink is a short link created on bit.ly. Bitlink with a capital B is a separate free product at bitlink.click that creates short links on bitlink.click and link-in-bio pages.",
      },
      {
        q: "Is Bitlink free?",
        a: "Yes. Every feature is free for every account and there are no monthly limits on links, QR codes or custom back-halves.",
      },
      {
        q: "What is Bitlink's website?",
        a: "bitlink.click. Profiles live at bitlink.click/username and short links at bitlink.click/code.",
      },
      {
        q: "Can I move my links from Bitly to Bitlink?",
        a: "You can recreate them on Bitlink for free. Your existing bit.ly links keep pointing where they do on Bitly; Bitlink cannot edit links hosted on bit.ly.",
      },
    ],
    cta: { shortener: "Shorten a link free", signUp: "Create your Bitlink", compare: "Bitlink vs Bitly, compared", compareHref: "/blog/bitlink-vs-bitly" },
  },
  es: {
    title: "¿Qué es Bitlink? Link en bio y acortador de links gratis (bitlink.click)",
    description:
      "Bitlink (bitlink.click) es un link en bio y acortador de links gratis, con métricas, QR y UTMs. No es Bitly: “bitlink” es el nombre que Bitly da a sus links bit.ly.",
    h1: "¿Qué es Bitlink?",
    definition:
      "Bitlink es una página de link en bio y un acortador de links gratis, en bitlink.click. Con una sola cuenta tenés un perfil en bitlink.click/tu-nombre y links cortos ilimitados en bitlink.click/codigo, con métricas de clics, códigos QR, parámetros UTM, redirección por dispositivo y país, dominio propio y productos. No hay planes pagos ni límites mensuales.",
    disambiguationTitle: "Bitlink vs “un bitlink” de Bitly",
    disambiguation: [
      "La palabra “bitlink” significa dos cosas distintas. **Bitlink** (con mayúscula, en bitlink.click) es el producto que describe esta página. Un **bitlink** (con minúscula) es el nombre que Bitly le da a cada link corto creado en su plataforma, los que empiezan con bit.ly/.",
      "Bitlink es un producto independiente: no es Bitly, no pertenece a Bitly y no está afiliado a Bitly. Si necesitás ayuda con un link bit.ly, andá a bitly.com. Si buscás una alternativa gratis y sin límites mensuales, estás en el lugar indicado.",
    ],
    table: {
      head: ["", "Bitlink (bitlink.click)", "“un bitlink” (Bitly)"],
      rows: [
        ["Qué es", "Un producto: link en bio + acortador de links", "Un link corto creado en Bitly"],
        ["Dirección", "bitlink.click/nombre y bitlink.click/codigo", "bit.ly/codigo"],
        ["Precio", "Gratis, sin planes pagos", "Bitly Free: 5 links por mes; planes pagos desde USD 10/mes"],
        ["Página de link en bio", "Incluida", "Producto aparte"],
      ],
    },
    whatTitle: "Qué podés hacer con Bitlink",
    what: [
      "**Link en bio:** una página con todos tus links, títulos, colecciones, videos de YouTube y Spotify, temas, tipografías y fondos.",
      "**Links cortos:** ilimitados, con back-half personalizado, campos UTM, destinos distintos para celular y computadora, y destinos por país.",
      "**Códigos QR:** colores a elección y tu logo en el centro, descarga en PNG y SVG, destino editable.",
      "**Métricas:** visitas, clics por link, orígenes, países y dispositivos, con exportación a CSV.",
      "**Vender:** tarjetas de producto con tu propio link de pago (Mercado Pago, Stripe, PayPal…) y 0% de comisión, más un botón de propinas.",
      "**Acortador de links gratis sin cuenta:** pegás un link y obtenés uno corto al instante.",
    ],
    factsTitle: "Bitlink en resumen",
    facts: [
      ["Nombre", "Bitlink"],
      ["Sitio web", "bitlink.click"],
      ["Categoría", "Link en bio y acortador de links"],
      ["Precio", "Gratis (sin planes pagos)"],
      ["Idiomas", "Español, inglés y portugués de Brasil"],
      ["Lanzamiento", "Noviembre de 2026"],
      ["¿Está afiliado a Bitly?", "No"],
    ],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        q: "¿Bitlink es lo mismo que Bitly?",
        a: "No. Bitlink (bitlink.click) es un link en bio y acortador de links independiente. Bitly es otra empresa; usa la palabra “bitlink” para los links cortos creados en bit.ly.",
      },
      {
        q: "¿Qué es un bitlink?",
        a: "En Bitly, un bitlink es un link corto creado en bit.ly. Bitlink con mayúscula es otro producto, gratis, en bitlink.click, que crea links cortos en bitlink.click y páginas de link en bio.",
      },
      {
        q: "¿Bitlink es gratis?",
        a: "Sí. Todas las funciones son gratis para todas las cuentas y no hay límites mensuales de links, códigos QR ni back-halves personalizados.",
      },
      {
        q: "¿Cuál es la página oficial de Bitlink?",
        a: "bitlink.click. Los perfiles están en bitlink.click/usuario y los links cortos en bitlink.click/codigo.",
      },
      {
        q: "¿Puedo pasar mis links de Bitly a Bitlink?",
        a: "Podés recrearlos gratis en Bitlink. Tus links bit.ly siguen apuntando a donde apuntan en Bitly; Bitlink no puede editar links alojados en bit.ly.",
      },
    ],
    cta: { shortener: "Acortar un link gratis", signUp: "Creá tu Bitlink", compare: "Bitlink vs Bitly, comparados", compareHref: "/es/blog/bitlink-vs-bitly" },
  },
  pt: {
    title: "O que é o Bitlink? Link na bio e encurtador de links grátis (bitlink.click)",
    description:
      "Bitlink (bitlink.click) é um link na bio e encurtador de links grátis, com métricas, QR code e UTMs. Não é o Bitly: “bitlink” é o nome que o Bitly dá aos links bit.ly.",
    h1: "O que é o Bitlink?",
    definition:
      "Bitlink é uma página de link na bio e um encurtador de links grátis, em bitlink.click. Com uma só conta você tem um perfil em bitlink.click/seu-nome e links curtos ilimitados em bitlink.click/codigo, com métricas de cliques, QR codes, parâmetros UTM, redirecionamento por dispositivo e país, domínio próprio e produtos. Não há planos pagos nem limites mensais.",
    disambiguationTitle: "Bitlink vs “um bitlink” do Bitly",
    disambiguation: [
      "A palavra “bitlink” significa duas coisas diferentes. **Bitlink** (com maiúscula, em bitlink.click) é o produto descrito nesta página. Um **bitlink** (com minúscula) é o nome que o Bitly dá a cada link curto criado na plataforma dele, os que começam com bit.ly/.",
      "O Bitlink é um produto independente: não é o Bitly, não pertence ao Bitly e não é afiliado ao Bitly. Se você precisa de ajuda com um link bit.ly, acesse bitly.com. Se procura uma alternativa grátis e sem limites mensais, está no lugar certo.",
    ],
    table: {
      head: ["", "Bitlink (bitlink.click)", "“um bitlink” (Bitly)"],
      rows: [
        ["O que é", "Um produto: link na bio + encurtador de links", "Um link curto criado no Bitly"],
        ["Endereço", "bitlink.click/nome e bitlink.click/codigo", "bit.ly/codigo"],
        ["Preço", "Grátis, sem planos pagos", "Bitly Free: 5 links por mês; planos pagos a partir de US$ 10/mês"],
        ["Página de link na bio", "Incluída", "Produto separado"],
      ],
    },
    whatTitle: "O que você pode fazer com o Bitlink",
    what: [
      "**Link na bio:** uma página com todos os seus links, títulos, coleções, vídeos do YouTube e Spotify, temas, fontes e fundos.",
      "**Links curtos:** ilimitados, com final personalizado, campos UTM, destinos diferentes para celular e computador, e destinos por país.",
      "**QR codes:** cores à sua escolha e seu logo no centro, download em PNG e SVG, destino editável.",
      "**Métricas:** visitas, cliques por link, origens, países e dispositivos, com exportação em CSV.",
      "**Vender:** cards de produto com seu próprio link de pagamento (Mercado Pago, Stripe, PayPal…) e 0% de comissão, além de um botão de gorjeta.",
      "**Encurtador de links grátis sem cadastro:** cole um link e receba um curto na hora.",
    ],
    factsTitle: "Bitlink em resumo",
    facts: [
      ["Nome", "Bitlink"],
      ["Site", "bitlink.click"],
      ["Categoria", "Link na bio e encurtador de links"],
      ["Preço", "Grátis (sem planos pagos)"],
      ["Idiomas", "Português do Brasil, espanhol e inglês"],
      ["Lançamento", "Novembro de 2026"],
      ["É afiliado ao Bitly?", "Não"],
    ],
    faqTitle: "Perguntas frequentes",
    faqs: [
      {
        q: "O Bitlink é a mesma coisa que o Bitly?",
        a: "Não. O Bitlink (bitlink.click) é um link na bio e encurtador de links independente. O Bitly é outra empresa; ele usa a palavra “bitlink” para os links curtos criados em bit.ly.",
      },
      {
        q: "O que é um bitlink?",
        a: "No Bitly, um bitlink é um link curto criado em bit.ly. Bitlink com maiúscula é outro produto, grátis, em bitlink.click, que cria links curtos em bitlink.click e páginas de link na bio.",
      },
      {
        q: "O Bitlink é grátis?",
        a: "Sim. Todos os recursos são grátis para todas as contas e não há limites mensais de links, QR codes ou finais personalizados.",
      },
      {
        q: "Qual é o site oficial do Bitlink?",
        a: "bitlink.click. Os perfis ficam em bitlink.click/usuario e os links curtos em bitlink.click/codigo.",
      },
      {
        q: "Posso levar meus links do Bitly para o Bitlink?",
        a: "Você pode recriá-los de graça no Bitlink. Seus links bit.ly continuam apontando para onde apontam no Bitly; o Bitlink não consegue editar links hospedados em bit.ly.",
      },
    ],
    cta: { shortener: "Encurtar um link grátis", signUp: "Crie seu Bitlink", compare: "Bitlink vs Bitly, comparados", compareHref: "/pt/blog/bitlink-vs-bitly" },
  },
};

/** Renders **bold** only — the copy above uses nothing else. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>,
      )}
    </>
  );
}

const plain = (s: string) => s.replace(/\*\*/g, "");

export function AboutPage({ lang }: { lang: SiteLang }) {
  const t = ABOUT_COPY[lang];
  const WEB = siteUrl();
  const path = aboutPath(lang);
  const url = `${WEB}${path}`;
  const alternates = Object.fromEntries(SITE_LANGS.map((l) => [l, aboutPath(l)])) as Record<SiteLang, string>;

  return (
    <div lang={LANG_LABEL[lang].html} className="landing-root min-h-screen overflow-x-clip bg-white text-ink">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            organizationLd(),
            softwareLd(),
            {
              "@type": "AboutPage",
              "@id": `${url}#webpage`,
              url,
              name: t.title,
              description: t.description,
              inLanguage: LANG_LABEL[lang].html,
              isPartOf: { "@id": SITE_ID },
              about: { "@id": ORG_ID },
              mainEntity: { "@id": ORG_ID },
              abstract: t.definition,
              mentions: [
                {
                  "@type": "DefinedTerm",
                  name: "bitlink",
                  description: plain(t.faqs[1].a),
                },
                { "@type": "Organization", name: "Bitly", url: "https://bitly.com" },
              ],
            },
            faqLd(t.faqs, `${url}#faq`),
            breadcrumbLd([
              { name: "Bitlink", path: homePath(lang) },
              { name: t.h1, path },
            ]),
          ],
        }}
      />
      <LandingNav lang={lang} alternates={alternates} />
      <main id="main" className="px-5 py-16 md:px-8 md:py-24">
        <article className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">{t.h1}</h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/85 md:text-xl">{t.definition}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={shortenerPath(lang)} className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:opacity-90">
              {t.cta.shortener}
            </Link>
            <Link href="/register" className="rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold hover:bg-ink/5">
              {t.cta.signUp}
            </Link>
          </div>

          <section id="bitlink-vs-bitly" className="mt-16 scroll-mt-24">
            <h2 className="font-display text-2xl font-bold md:text-3xl">{t.disambiguationTitle}</h2>
            {t.disambiguation.map((p) => (
              <p key={p} className="mt-4 leading-relaxed text-ink/80">
                <Rich text={p} />
              </p>
            ))}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/15">
                    {t.table.head.map((h) => (
                      <th key={h} scope="col" className="py-2 pr-4 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.table.rows.map(([label, a, b]) => (
                    <tr key={label} className="border-b border-ink/10 align-top">
                      <th scope="row" className="py-2 pr-4 font-semibold">
                        {label}
                      </th>
                      <td className="py-2 pr-4 text-ink/80">{a}</td>
                      <td className="py-2 pr-4 text-ink/80">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm">
              <Link href={t.cta.compareHref} className="font-semibold underline underline-offset-4">
                {t.cta.compare} →
              </Link>
            </p>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold md:text-3xl">{t.whatTitle}</h2>
            <ul className="mt-6 space-y-3 text-ink/80">
              {t.what.map((w) => (
                <li key={w} className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>
                    <Rich text={w} />
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold md:text-3xl">{t.factsTitle}</h2>
            <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {t.facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-4 py-3 text-sm">
                  <dt className="font-semibold">{k}</dt>
                  <dd className="text-ink/80">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="faq" className="mt-16 scroll-mt-24">
            <h2 className="font-display text-2xl font-bold md:text-3xl">{t.faqTitle}</h2>
            <dl className="mt-6 space-y-6">
              {t.faqs.map((f) => (
                <div key={f.q}>
                  <dt className="font-semibold">{f.q}</dt>
                  <dd className="mt-1 text-meetup-muted">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </article>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
