import { LandingNav } from "@/components/landing/LandingNav";
import { SiteFooter } from "@/components/SiteFooter";
import { breadcrumbLd, faqLd, JsonLd, shortenerLd } from "@/lib/jsonld";
import { LANG_LABEL, SITE_LANGS, shortenerPath, type SiteLang } from "@/lib/i18n/site";
import { siteUrl } from "@/lib/site";
import { PublicShortener } from "./PublicShortener";

const TEXT = {
  en: {
    path: "/url-shortener",
    h1: "Free URL shortener",
    lead: "Shorten any link in one click. No sign-up, no limits, no expiry. Create a free account if you want to track clicks, devices and countries.",
    points: [
      "Unlimited short links, free forever",
      "Links never expire",
      "Create an account to unlock click stats, UTMs, device/geo rules and QR codes",
    ],
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        q: "Is the Bitlink URL shortener free?",
        a: "Yes. You can shorten as many links as you want for free, with no account and no expiry date.",
      },
      {
        q: "Do I need an account to shorten a link?",
        a: "No. Paste your URL and you get a short link right away. An account is only needed if you want to see how many people clicked it.",
      },
      {
        q: "Can I track clicks on a short link?",
        a: "Yes. Create a free account and the links you shortened on this device are added to it, with the clicks recorded since day one. You see clicks, countries, devices and referrers.",
      },
      {
        q: "Do short links expire?",
        a: "No. Bitlink short links stay active until you disable or delete them from your account.",
      },
      {
        q: "Is it safe? Do you block malicious links?",
        a: "Destinations are checked against Google Safe Browsing and phishing or malware links are rejected.",
      },
    ],
  },
  es: {
    path: "/acortador-de-links",
    h1: "Acortador de links gratis",
    lead: "Acortá cualquier link con un clic. Sin registro, sin límites y sin vencimiento. Creá una cuenta gratis si querés ver clics, dispositivos y países.",
    points: [
      "Links cortos ilimitados, gratis para siempre",
      "Los links no vencen",
      "Con una cuenta tenés métricas de clics, UTMs, reglas por dispositivo/país y códigos QR",
    ],
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        q: "¿El acortador de links de Bitlink es gratis?",
        a: "Sí. Podés acortar todos los links que quieras gratis, sin cuenta y sin fecha de vencimiento.",
      },
      {
        q: "¿Necesito una cuenta para acortar un link?",
        a: "No. Pegás tu URL y obtenés el link corto al instante. La cuenta solo hace falta si querés ver cuántas personas hicieron clic.",
      },
      {
        q: "¿Puedo ver las métricas de un link corto?",
        a: "Sí. Creá una cuenta gratis y los links que acortaste en este dispositivo se suman a ella, con los clics registrados desde el primer día. Ves clics, países, dispositivos y origen del tráfico.",
      },
      {
        q: "¿Los links cortos vencen?",
        a: "No. Los links cortos de Bitlink siguen activos hasta que los desactives o borres desde tu cuenta.",
      },
      {
        q: "¿Es seguro? ¿Bloquean links maliciosos?",
        a: "Los destinos se revisan con Google Safe Browsing y se rechazan los links de phishing o malware.",
      },
    ],
  },
  pt: {
    path: "/encurtador-de-links",
    h1: "Encurtador de links grátis",
    lead: "Encurte qualquer link com um clique. Sem cadastro, sem limites e sem expiração. Crie uma conta grátis se quiser ver cliques, dispositivos e países.",
    points: [
      "Links curtos ilimitados, grátis para sempre",
      "Os links nunca expiram",
      "Com uma conta você tem estatísticas de cliques, UTMs, regras por dispositivo/país e QR codes",
    ],
    faqTitle: "Perguntas frequentes",
    faqs: [
      {
        q: "O encurtador de links do Bitlink é grátis?",
        a: "Sim. Você pode encurtar quantos links quiser de graça, sem conta e sem data de expiração.",
      },
      {
        q: "Preciso de uma conta para encurtar um link?",
        a: "Não. Cole sua URL e receba o link curto na hora. A conta só é necessária se você quiser ver quantas pessoas clicaram.",
      },
      {
        q: "Posso acompanhar os cliques de um link curto?",
        a: "Sim. Crie uma conta grátis e os links que você encurtou neste dispositivo são adicionados a ela, com os cliques registrados desde o primeiro dia. Você vê cliques, países, dispositivos e origem do tráfego.",
      },
      {
        q: "Os links curtos expiram?",
        a: "Não. Os links curtos do Bitlink continuam ativos até você desativá-los ou excluí-los na sua conta.",
      },
      {
        q: "É seguro? Vocês bloqueiam links maliciosos?",
        a: "Os destinos são verificados com o Google Safe Browsing e links de phishing ou malware são rejeitados.",
      },
    ],
  },
} as const;

export function ShortenerPage({ lang }: { lang: SiteLang }) {
  const t = TEXT[lang];
  const alternates = Object.fromEntries(SITE_LANGS.map((l) => [l, shortenerPath(l)])) as Record<SiteLang, string>;
  const WEB = siteUrl();
  return (
    <div lang={LANG_LABEL[lang].html} className="landing-root min-h-screen overflow-x-clip bg-white text-ink">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            shortenerLd(lang),
            faqLd([...t.faqs], `${WEB}${t.path}#faq`),
            breadcrumbLd([
              { name: "Bitlink", path: lang === "en" ? "/" : `/${lang}` },
              { name: t.h1, path: t.path },
            ]),
          ],
        }}
      />
      <LandingNav lang={lang} alternates={alternates} />
      <main id="main" className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">{t.h1}</h1>
          <p className="mt-4 max-w-xl text-lg text-meetup-muted">{t.lead}</p>
          <div id="acortador" className="mt-8 scroll-mt-24">
            <PublicShortener lang={lang} />
          </div>
          <ul className="mt-10 space-y-2 text-ink/80">
            {t.points.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="text-emerald-600">✓</span>
                {p}
              </li>
            ))}
          </ul>

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
        </div>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
