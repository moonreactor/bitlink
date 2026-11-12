import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "como-poner-link-en-tiktok",
  slug: "como-poner-link-en-tiktok",
  category: "guias",
  title: "Cómo poner un link en la bio de TikTok: requisitos y qué hacer si no te aparece",
  seoTitle: "Cómo poner un link en TikTok: requisitos y alternativas",
  description:
    "Cómo agregar un link en la bio de TikTok, por qué a veces no aparece la opción y qué alternativas usar mientras tanto para llevar tráfico.",
  published: "2026-11-07",
  keywords: ["link en tiktok", "cómo poner link en tiktok", "link en bio tiktok", "no me aparece sitio web tiktok", "tiktok 1000 seguidores link"],
  tldr:
    "En TikTok el link se agrega desde **Editar perfil → Sitio web**. Si la opción no aparece, normalmente es porque tu cuenta todavía no cumple los requisitos (en cuentas personales, TikTok suele pedir un mínimo de seguidores; las cuentas de empresa suelen tenerlo disponible). Cuando lo tengas, poné **un link en bio** con todos tus destinos.",
  takeaways: [
    "Ruta: Perfil → Editar perfil → Sitio web.",
    "Si no aparece: revisá seguidores, edad de la cuenta y tipo de cuenta.",
    "Alternativas: link en Instagram/YouTube, mensajes directos y QR.",
    "Usá un link corto con UTM para medir el tráfico de TikTok.",
  ],
  cover: { src: "/landing/1470225620780-dba8ba36b745-360x440.webp", alt: "Manos de un DJ sobre una controladora iluminada con luces violetas" },
  body: [
    { type: "h2", text: "Cómo agregar el link en TikTok" },
    {
      type: "steps",
      name: "Cómo agregar un link en la bio de TikTok",
      items: [
        { title: "Abrí tu perfil", text: "Tocá el ícono de perfil abajo a la derecha." },
        { title: "Editar perfil", text: "Tocá “Editar perfil”." },
        { title: "Sitio web", text: "Buscá el campo “Sitio web” y pegá tu URL, por ejemplo `bitlink.click/tunombre`." },
        { title: "Guardá", text: "El link aparece clickeable debajo de tu descripción." },
      ],
    },
    { type: "h2", text: "Por qué no te aparece la opción “Sitio web”" },
    {
      type: "p",
      text: "TikTok no habilita el link en bio para todas las cuentas. Las condiciones cambian con el tiempo y por país, pero los motivos más comunes son:",
    },
    {
      type: "ul",
      items: [
        "**Pocos seguidores**: en cuentas personales, TikTok históricamente pidió alrededor de 1.000 seguidores.",
        "**Tipo de cuenta**: las cuentas de empresa (Business) suelen tener el campo disponible antes.",
        "**Edad mínima**: la cuenta tiene que pertenecer a una persona mayor de edad.",
        "**Versión de la app**: actualizá TikTok; a veces el campo aparece recién en la última versión.",
      ],
    },
    {
      type: "callout",
      tone: "note",
      text: "Verificá los requisitos actuales en el centro de ayuda de TikTok: la plataforma los ajusta periódicamente.",
    },
    { type: "h2", text: "Qué hacer mientras no tengas el link" },
    {
      type: "ol",
      items: [
        "**Mandá a otra red**: TikTok muestra los íconos de Instagram y YouTube en tu perfil. Si tu Instagram tiene un link en bio, la gente llega igual en dos pasos.",
        "**Mensajes directos**: respondé con tu link a quien comenta “¿dónde lo compro?”.",
        "**Un link fácil de recordar**: decilo en el video. `bitlink.click/tunombre` se recuerda y se escribe fácil.",
        "**QR en pantalla**: mostrá un QR al final del video para quien lo mira desde otro dispositivo.",
      ],
    },
    { type: "h2", text: "Qué poner en tu link de TikTok" },
    {
      type: "p",
      text: "El público de TikTok llega desde el celular, con poco tiempo y mucha curiosidad. Tu página debería cargar rápido y mostrar primero **lo que prometiste en el video**. Si en el video hablaste de un producto, ese producto tiene que ser el primer botón.",
    },
    {
      type: "table",
      head: ["Si tu TikTok es de…", "Primer link sugerido"],
      rows: [
        ["Música", "Reproductor de Spotify con el último tema"],
        ["Productos", "Tarjeta del producto del video con precio y botón de compra"],
        ["Recetas o tutoriales", "La receta completa o el tutorial largo en YouTube"],
        ["Servicios", "Agenda de turnos o WhatsApp"],
      ],
    },
    { type: "h2", text: "Cómo medir cuánto tráfico te trae TikTok" },
    {
      type: "p",
      text: "En las estadísticas de Bitlink ves de qué red llega cada visita. Si querés más detalle por campaña, usá un [link corto](/es/blog/novedad-links-cortos) con `utm_source=tiktok` y un `utm_campaign` por video o serie.",
    },
    { type: "cta", title: "Tu link en bio para TikTok", text: "Rápido en el celular, con embeds y estadísticas. Gratis." },
  ],
  faqs: [
    { q: "¿Cuántos seguidores necesito para poner un link en TikTok?", a: "En cuentas personales TikTok históricamente pidió alrededor de 1.000 seguidores, aunque el requisito puede variar. Las cuentas de empresa suelen tenerlo habilitado antes." },
    { q: "¿Puedo poner links en los videos de TikTok?", a: "En general no son clickeables en la descripción. Usá el link de tu perfil o los mensajes directos." },
    { q: "¿Conviene pasar a cuenta de empresa para tener el link?", a: "Puede servir, pero las cuentas de empresa tienen restricciones en la música disponible. Evaluá si te conviene según tu contenido." },
  ],
  related: ["como-poner-varios-links-en-instagram", "que-es-un-link-en-bio", "link-en-bio-para-musicos"],
};

export default article;
