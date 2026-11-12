import { LandingNav } from "@/components/landing/LandingNav";
import { SiteFooter } from "@/components/SiteFooter";
import { breadcrumbLd, faqLd, JsonLd, shortenerLd } from "@/lib/jsonld";
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
} as const;

export function ShortenerPage({ lang }: { lang: "en" | "es" }) {
  const t = TEXT[lang];
  const WEB = siteUrl();
  return (
    <div lang={lang} className="landing-root min-h-screen overflow-x-clip bg-white text-ink">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            shortenerLd(lang),
            faqLd([...t.faqs], `${WEB}${t.path}#faq`),
            breadcrumbLd([
              { name: "Bitlink", path: "/" },
              { name: t.h1, path: t.path },
            ]),
          ],
        }}
      />
      <LandingNav />
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
      <SiteFooter />
    </div>
  );
}
