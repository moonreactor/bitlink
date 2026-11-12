import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "lanzamiento-bitlink",
  slug: "lanzamiento-bitlink",
  category: "novedades",
  title: "Lanzamos Bitlink: link en bio y links cortos gratis, sin planes ni límites mensuales",
  seoTitle: "Lanzamos Bitlink: link en bio y links cortos gratis",
  description:
    "Bitlink ya está disponible: una página de link en bio y un acortador de links con QR, UTMs y estadísticas, todo gratis y sin planes pagos.",
  published: "2026-11-04",
  keywords: ["bitlink", "link en bio gratis", "acortador de links gratis", "alternativa a linktree", "lanzamiento"],
  tldr:
    "**Bitlink** es una herramienta gratuita que junta dos cosas que normalmente se pagan por separado: una **página de link en bio** (bitlink.click/tunombre) y un **acortador de links** con códigos QR, UTMs y estadísticas. No tiene planes pagos ni topes mensuales de links o clics.",
  takeaways: [
    "Links ilimitados en tu página y links cortos ilimitados.",
    "Estadísticas de visitas, clics, fuentes y países, con exportación a CSV.",
    "Dominio propio, productos, propinas y captura de emails incluidos.",
    "Sin tarjeta y sin planes: todas las funciones están disponibles para todos.",
  ],
  cover: { src: "/landing/1459749411175-04bf5292ceea-900x600.webp", alt: "Público con las manos en alto frente a un escenario iluminado" },
  body: [
    { type: "h2", text: "Qué es Bitlink" },
    {
      type: "p",
      text: "Bitlink es una **plataforma de link en bio y links cortos**. Con una sola cuenta tenés una página pública en `bitlink.click/tunombre` donde ponés todo lo que compartís —música, videos, productos, reservas, redes— y un acortador para crear links como `bitlink.click/promo` que podés medir y editar cuando quieras.",
    },
    {
      type: "p",
      text: "La idea es simple: la mayoría de los creadores, emprendedores y marcas chicas terminan pagando una herramienta para el link en bio y otra para acortar links, y aun así chocan con límites mensuales. Bitlink resuelve las dos cosas en un mismo lugar, **gratis y sin planes**.",
    },
    { type: "h2", text: "Qué incluye desde el primer día" },
    {
      type: "table",
      caption: "Funciones disponibles en el lanzamiento",
      head: ["Función", "Qué hace", "Costo"],
      rows: [
        ["Página de link en bio", "Links ilimitados, encabezados, colecciones en lista o grilla, embeds de YouTube y Spotify", "Gratis"],
        ["Links cortos", "Back-half personalizado, UTMs, reglas por dispositivo y por país, destino editable", "Gratis"],
        ["Códigos QR", "Colores propios, logo en el centro, descarga en PNG o SVG", "Gratis"],
        ["Estadísticas", "Visitas, clics, fuentes, países, rango de fechas y exportación CSV", "Gratis"],
        ["Monetización", "Tarjetas de producto con checkout externo y botón de propinas", "Gratis, 0% de comisión"],
        ["Audiencia", "Captura de email y teléfono, Google Analytics y Meta Pixel", "Gratis"],
        ["Control", "Links programados, links y perfiles con contraseña", "Gratis"],
        ["Marca", "Temas, tipografías, fondos y dominio propio", "Gratis"],
      ],
    },
    { type: "h2", text: "Por qué gratis y sin planes" },
    {
      type: "p",
      text: "Creemos que tener una página propia y saber qué links funcionan no debería depender de un plan mensual. Por eso no hay funciones bloqueadas detrás de un pago. A cambio, cada página pública muestra un botón discreto de **“Create your Bitlink”** para que quien la visite también pueda armar la suya: así crece Bitlink.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Cero comisión en ventas",
      text: "Las tarjetas de producto llevan a tu propio checkout (Mercado Pago, Stripe, PayPal, Gumroad, etc.). Bitlink no procesa pagos ni se queda con un porcentaje.",
    },
    { type: "h2", text: "Para quién es" },
    {
      type: "ul",
      items: [
        "**Músicos y artistas**: lanzamientos, fechas de shows, merch y un reproductor de Spotify o YouTube en la misma página. Mirá [cómo armar un link en bio para músicos](/es/blog/link-en-bio-para-musicos).",
        "**Creadores de contenido**: un solo link para Instagram, TikTok y YouTube, con estadísticas de qué se clickea.",
        "**Emprendedores y tiendas chicas**: catálogo con precios y checkout, sin montar una tienda online. Ver [cómo vender por Instagram sin tienda](/es/blog/vender-por-instagram-sin-tienda).",
        "**Restaurantes y comercios**: menú, reservas y WhatsApp en un QR editable. Ver [menú QR para restaurantes](/es/blog/menu-qr-para-restaurantes).",
        "**Marcas y agencias**: links cortos con UTMs y dominio propio para medir cada campaña.",
      ],
    },
    { type: "h2", text: "Cómo empezar" },
    {
      type: "steps",
      name: "Cómo crear tu Bitlink",
      items: [
        { title: "Reservá tu nombre", text: "Entrá a [bitlink.click/register](/register) y elegí tu usuario. Tu página queda en bitlink.click/tunombre." },
        { title: "Agregá lo que compartís", text: "Sumá links, videos, canciones, productos, un botón de propinas o un formulario de email." },
        { title: "Elegí un diseño", text: "Probá temas, tipografías y fondos hasta que se vea como tu marca." },
        { title: "Compartilo en todos lados", text: "Pegá el link en tu bio de Instagram, TikTok y YouTube, o imprimí el QR. Después mirá las estadísticas." },
      ],
    },
    { type: "cta" },
  ],
  faqs: [
    { q: "¿Bitlink es realmente gratis?", a: "Sí. Todas las funciones —links ilimitados, links cortos, QR, estadísticas, dominio propio y productos— están incluidas sin pagar. No hay planes premium." },
    { q: "¿Necesito tarjeta de crédito para registrarme?", a: "No. Solo un email y una contraseña." },
    { q: "¿Bitlink cobra comisión por las ventas?", a: "No. Los productos enlazan a tu propio checkout y Bitlink no interviene en el pago." },
    { q: "¿Puedo sacar el botón “Create your Bitlink”?", a: "No. Es la forma en la que Bitlink se sostiene sin cobrar planes." },
  ],
  related: ["que-es-un-link-en-bio", "novedad-links-cortos", "alternativas-gratis-a-linktree"],
};

export default article;
