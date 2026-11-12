import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "que-son-los-parametros-utm",
  slug: "que-son-los-parametros-utm",
  category: "guias",
  title: "Qué son los parámetros UTM y cómo usarlos en tus links (con ejemplos)",
  seoTitle: "Qué son los parámetros UTM y cómo usarlos",
  description:
    "Guía simple de UTMs: qué son utm_source, utm_medium y utm_campaign, cómo armarlos, errores comunes y cómo agregarlos a un link corto en segundos.",
  published: "2026-11-07",
  keywords: ["parámetros utm", "qué son los utm", "utm_source", "utm_campaign", "utm google analytics", "links con utm"],
  tldr:
    "Los **parámetros UTM** son etiquetas que se agregan al final de una URL (por ejemplo `?utm_source=instagram&utm_medium=social&utm_campaign=lanzamiento`) para que herramientas como **Google Analytics** sepan de dónde vino cada visita. Los tres obligatorios en la práctica son **source**, **medium** y **campaign**.",
  takeaways: [
    "utm_source = quién manda la visita (instagram, newsletter).",
    "utm_medium = el tipo de canal (social, email, qr, cpc).",
    "utm_campaign = la campaña (black-friday-2026).",
    "Usá siempre minúsculas y guiones; documentá la convención.",
  ],
  cover: { src: "/landing/1517836357463-d25dfeac3438-400x225.webp", alt: "Persona levantando una barra con discos en un gimnasio" },
  body: [
    { type: "h2", text: "Qué es un UTM" },
    {
      type: "p",
      text: "UTM viene de *Urchin Tracking Module*, la herramienta que Google compró y convirtió en Google Analytics. Hoy es un estándar: casi todas las plataformas de analítica leen estos parámetros. No cambian el destino del link; solo agregan información para medir.",
    },
    { type: "h2", text: "Los cinco parámetros UTM" },
    {
      type: "table",
      head: ["Parámetro", "Qué indica", "Ejemplo"],
      rows: [
        ["`utm_source`", "La fuente específica del tráfico", "instagram, tiktok, newsletter, google"],
        ["`utm_medium`", "El tipo de canal", "social, email, qr, cpc, referral"],
        ["`utm_campaign`", "La campaña o acción", "lanzamiento-marea, hot-sale-2026"],
        ["`utm_term`", "Palabra clave (sobre todo en anuncios de búsqueda)", "zapatillas-running"],
        ["`utm_content`", "Variante del contenido o creatividad", "historia-1, boton-azul, video-a"],
      ],
    },
    { type: "h2", text: "Ejemplo real" },
    {
      type: "p",
      text: "Una coach de fitness lanza un programa de 12 semanas y lo promociona en Instagram, en su newsletter y con un QR en el gimnasio. Para saber qué canal vende más, crea tres links:",
    },
    {
      type: "ul",
      items: [
        "Instagram: `...?utm_source=instagram&utm_medium=social&utm_campaign=programa-12-semanas`",
        "Newsletter: `...?utm_source=newsletter&utm_medium=email&utm_campaign=programa-12-semanas`",
        "QR en el gimnasio: `...?utm_source=gimnasio&utm_medium=qr&utm_campaign=programa-12-semanas`",
      ],
    },
    {
      type: "p",
      text: "En Google Analytics, filtrando por la campaña `programa-12-semanas`, ve cuántas visitas y compras trajo cada fuente.",
    },
    { type: "h2", text: "Cómo agregar UTMs sin escribir la URL a mano" },
    {
      type: "p",
      text: "Las URLs con UTM son largas y feas para compartir. La solución es combinarlas con un **link corto**: el link visible es `bitlink.click/programa`, y por detrás redirige a la URL con todos los parámetros.",
    },
    {
      type: "steps",
      name: "Cómo crear un link corto con UTMs en Bitlink",
      items: [
        { title: "Nuevo link corto", text: "En tu panel, abrí Short links → New." },
        { title: "Destino", text: "Pegá la URL de tu página de venta, sin UTMs." },
        { title: "Completá los UTMs", text: "Source, medium y campaign (y term o content si los usás). Bitlink los agrega solo." },
        { title: "Un link por canal", text: "Repetí con otro back-half para cada canal: `/programa-ig`, `/programa-mail`, `/programa-qr`." },
        { title: "Compará", text: "Mirá los clics en Bitlink y las conversiones en tu herramienta de analítica." },
      ],
    },
    { type: "h2", text: "Errores comunes con UTMs" },
    {
      type: "ol",
      items: [
        "**Mezclar mayúsculas**: `Instagram` e `instagram` cuentan como fuentes distintas. Usá todo en minúsculas.",
        "**Usar UTMs en links internos** de tu propio sitio: rompen la atribución de la visita original.",
        "**No tener convención**: anotá en una planilla qué valores usa tu equipo.",
        "**Espacios y acentos**: reemplazalos por guiones (`dia-del-padre`, no `día del padre`).",
        "**Olvidar el medium**: sin `utm_medium` muchas herramientas agrupan mal el tráfico.",
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "¿Y en el link en bio?",
      text: "Tu página de Bitlink ya registra de qué red llega cada visita. Los UTMs son más útiles en los links que salen de tu página hacia tu tienda o tu web.",
    },
    { type: "cta", title: "Links cortos con UTMs incluidos", text: "Completá los campos y Bitlink arma la URL por vos." },
  ],
  faqs: [
    { q: "¿Los UTMs afectan el SEO?", a: "No mejoran ni empeoran el posicionamiento. Solo evitá usarlos en enlaces internos de tu propio sitio y asegurate de que tus páginas tengan URL canónica." },
    { q: "¿Qué UTMs son obligatorios?", a: "Técnicamente ninguno, pero en la práctica usá siempre utm_source, utm_medium y utm_campaign." },
    { q: "¿Dónde veo los resultados de los UTMs?", a: "En tu herramienta de analítica, por ejemplo en Google Analytics 4 dentro de los informes de adquisición de tráfico." },
    { q: "¿Puedo cambiar los UTMs de un link ya compartido?", a: "Si usás un link corto de Bitlink, sí: editás los UTMs y el link compartido sigue siendo el mismo." },
  ],
  related: ["novedad-links-cortos", "metricas-link-en-bio", "acortador-de-links-gratis-sin-limite"],
};

export default article;
