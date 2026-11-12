import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "link-en-bio-para-musicos",
  slug: "link-en-bio-para-musicos",
  category: "casos-de-uso",
  title: "Link en bio para músicos y bandas: cómo armar una página que venda entradas y sume oyentes",
  seoTitle: "Link en bio para músicos y bandas: guía práctica",
  description:
    "Qué poner en el link en bio de un músico o banda: reproductor de Spotify, YouTube, entradas, merch, presskit y newsletter. Con estructura recomendada.",
  published: "2026-11-10",
  keywords: ["link en bio para músicos", "link en bio banda", "smart link música", "página para músicos", "spotify link en bio"],
  tldr:
    "El link en bio de un músico tiene que hacer tres cosas: **hacer escuchar** (reproductor de Spotify o YouTube embebido), **vender** (entradas y merch) y **construir comunidad** (newsletter o lista de WhatsApp). Ordená la página según el momento: lanzamiento, gira o entre ciclos.",
  takeaways: [
    "Arriba: el lanzamiento o la fecha más próxima.",
    "Embebé Spotify y YouTube para que escuchen sin salir.",
    "Links cortos con UTM para medir cada flyer o historia.",
    "Presskit con contraseña para prensa y productores.",
  ],
  cover: { src: "/landing/1516280440614-37939bbacd81-600x300.webp", alt: "Micrófono sobre un pie en un escenario con luz cálida de fondo" },
  body: [
    { type: "h2", text: "Estructura recomendada" },
    {
      type: "ol",
      items: [
        "**Lanzamiento actual**: reproductor de Spotify o video de YouTube embebido.",
        "**Próximas fechas**: entradas, con el show más cercano primero.",
        "**Merch**: tarjetas de producto con precio y link de pago.",
        "**Newsletter o comunidad**: formulario de email para avisar de shows en tu ciudad.",
        "**Plataformas**: Spotify, Apple Music, YouTube, Bandcamp, SoundCloud.",
        "**Contacto y presskit**: mail de booking y presskit (puede ir con contraseña).",
        "**Propinas**: “Bancá la música ☕” con Cafecito, Mercado Pago o PayPal.",
      ],
    },
    { type: "h2", text: "Ordená la página según el momento" },
    {
      type: "table",
      head: ["Momento", "Primer link", "Extra"],
      rows: [
        ["Antes del lanzamiento", "Pre-save o teaser", "Link programado para que el tema aparezca el día del estreno"],
        ["Semana del lanzamiento", "Reproductor del nuevo tema", "Videoclip y letra"],
        ["Gira", "Entradas de la próxima fecha", "Link corto por ciudad con reglas por país"],
        ["Entre ciclos", "Newsletter", "Merch y catálogo"],
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Un link por ciudad",
      text: "Para una gira, creá links cortos como `bitlink.click/tour-cordoba` y `bitlink.click/tour-rosario`. Usalos en los flyers de cada ciudad y vas a saber qué promoción funcionó.",
    },
    { type: "h2", text: "Cómo armarla en 10 minutos" },
    {
      type: "steps",
      name: "Cómo armar un link en bio para músicos",
      items: [
        { title: "Creá tu página", text: "Registrate en [Bitlink](/register) con el nombre artístico." },
        { title: "Pegá tu último lanzamiento", text: "Un link de Spotify o YouTube se convierte en reproductor dentro de la página." },
        { title: "Agregá fechas y merch", text: "Links a la ticketera y tarjetas de producto para remeras, vinilos o discos." },
        { title: "Activá la newsletter", text: "Desde Settings, el formulario de email para armar tu lista." },
        { title: "Elegí el diseño", text: "Usá la portada del disco como fondo y los colores de la estética del lanzamiento. Podés sumar música de fondo." },
        { title: "Imprimí el QR", text: "Para la mesa de merch y los flyers, con tu foto en el centro." },
      ],
    },
    { type: "h2", text: "Qué medir" },
    {
      type: "ul",
      items: [
        "**Clics en el reproductor y en plataformas**: qué tan bien convierte el lanzamiento.",
        "**Países y ciudades de origen**: dónde tenés público para planear fechas.",
        "**Clics en entradas por link corto**: qué flyer o historia vende más.",
        "**Suscriptores nuevos**: tu comunidad propia, fuera del algoritmo.",
      ],
    },
    { type: "p", text: "Más ideas en [métricas de tu link en bio](/es/blog/metricas-link-en-bio)." },
    { type: "cta", title: "Tu página de artista, gratis", text: "Reproductor, entradas, merch y newsletter en un solo link." },
  ],
  faqs: [
    { q: "¿Puedo poner un reproductor de Spotify en mi link en bio?", a: "Sí. En Bitlink pegás el link de Spotify o YouTube y se muestra como reproductor dentro de tu página." },
    { q: "¿Cómo comparto el presskit solo con prensa?", a: "Agregá el link al presskit y protegelo con contraseña; compartí la clave solo con quien corresponda." },
    { q: "¿Puedo vender merch sin tienda?", a: "Sí, con tarjetas de producto que llevan a tu link de pago. Ver la guía para vender sin tienda online." },
  ],
  related: ["como-poner-link-en-tiktok", "vender-por-instagram-sin-tienda", "codigo-qr-editable"],
};

export default article;
