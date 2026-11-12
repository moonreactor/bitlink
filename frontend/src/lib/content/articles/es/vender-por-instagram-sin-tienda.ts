import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "vender-por-instagram-sin-tienda",
  slug: "vender-por-instagram-sin-tienda",
  category: "guias",
  title: "Cómo vender por Instagram sin tienda online: catálogo, link de pago y WhatsApp",
  seoTitle: "Cómo vender por Instagram sin tienda online",
  description:
    "Armá un catálogo en tu link en bio con precios y links de pago de Mercado Pago, Stripe o PayPal. Sin tienda, sin comisión y con estadísticas.",
  published: "2026-11-09",
  keywords: ["vender por instagram", "vender sin tienda online", "link de pago mercado pago", "catálogo en link en bio", "vender por whatsapp"],
  tldr:
    "Para vender por Instagram **sin tienda online** alcanza con tres cosas: un **catálogo simple** en tu link en bio (foto, nombre y precio), un **link de pago** por producto (Mercado Pago, Stripe, PayPal o Gumroad) y un canal de **consulta** como WhatsApp. En Bitlink lo armás con tarjetas de producto, sin comisión.",
  takeaways: [
    "Empezá con 3 a 6 productos, los más vendidos o el lanzamiento.",
    "Un link de pago por producto evita idas y vueltas por mensaje.",
    "Sumá WhatsApp para consultas y una sección de envíos.",
    "Medí qué producto recibe más clics y ajustá el orden.",
  ],
  cover: { src: "/landing/1490481651871-ab68de25d43d-360x440.webp", alt: "Ropa colgada en un perchero de madera" },
  body: [
    { type: "h2", text: "¿Hace falta una tienda online para vender?" },
    {
      type: "p",
      text: "No siempre. Si vendés pocos productos, servicios, cursos, entradas o encargos, una tienda completa puede ser demasiado: hay que mantener stock, plantillas, pasarela y, muchas veces, pagar una suscripción. Para empezar, un **catálogo en tu link en bio** con links de pago resuelve lo mismo con mucho menos trabajo.",
    },
    {
      type: "table",
      head: ["", "Tienda online", "Catálogo en link en bio"],
      rows: [
        ["Costo", "Suscripción mensual y/o comisión", "Gratis en Bitlink, 0% de comisión"],
        ["Tiempo de armado", "Días", "Minutos"],
        ["Stock y envíos automáticos", "Sí", "No (se gestionan por fuera)"],
        ["Ideal para", "Muchos productos y variantes", "Pocos productos, servicios, digitales, preventas"],
      ],
    },
    { type: "h2", text: "Paso a paso para armar tu catálogo" },
    {
      type: "steps",
      name: "Cómo vender por Instagram con un catálogo en tu link en bio",
      items: [
        { title: "Creá tus links de pago", text: "En Mercado Pago, Stripe, PayPal, Gumroad o Hotmart generá un link de pago por producto con su precio." },
        { title: "Creá tu página", text: "Registrate en [Bitlink](/register) y elegí tu nombre." },
        { title: "Agregá productos", text: "En Products, cargá foto, nombre, descripción corta, precio y el link de pago." },
        { title: "Sumá contacto y confianza", text: "Agregá WhatsApp, una sección de envíos y cambios, y reseñas o capturas de clientes." },
        { title: "Pegá el link en Instagram", text: "Editar perfil → Enlaces. Ver [cómo poner varios links en Instagram](/es/blog/como-poner-varios-links-en-instagram)." },
        { title: "Promocioná", text: "Mostrá el producto en Reels e historias con “link en mi bio” y el sticker de enlace." },
      ],
    },
    { type: "h2", text: "Cómo escribir tarjetas de producto que vendan" },
    {
      type: "ul",
      items: [
        "**Foto real y clara**, con fondo limpio. Es lo primero que se mira.",
        "**Nombre concreto**: “Programa de fuerza 12 semanas” mejor que “Plan pro”.",
        "**Precio visible**: esconderlo genera mensajes y abandonos.",
        "**Beneficio en una línea**: “Rutinas para entrenar en casa 3 veces por semana”.",
        "**Urgencia honesta**: cupos, preventa o fecha límite solo si son reales.",
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Precio por país",
      text: "Si vendés a varios países, usá un [link corto con reglas por país](/es/blog/novedad-links-cortos) para mandar a cada persona al checkout en su moneda.",
    },
    { type: "h2", text: "Más formas de monetizar tu página" },
    {
      type: "ul",
      items: [
        "**Propinas**: un botón hacia Cafecito, Mercado Pago o PayPal.",
        "**Lista de emails**: avisá de lanzamientos y preventas sin depender del algoritmo.",
        "**Links programados**: que el producto aparezca solo a la hora del lanzamiento.",
        "**Links con contraseña**: contenido o descuentos exclusivos para clientes.",
      ],
    },
    { type: "h2", text: "Cómo medir las ventas" },
    {
      type: "p",
      text: "En Bitlink ves cuántos clics recibe cada producto. Las ventas se ven en tu plataforma de pago. Si querés atribuir cada venta a un canal, agregá Google Analytics o Meta Pixel a tu página desde Settings y usá [UTMs](/es/blog/que-son-los-parametros-utm) en los links de pago.",
    },
    { type: "cta", title: "Vendé desde tu link en bio", text: "Tarjetas de producto con checkout propio. 0% de comisión." },
  ],
  faqs: [
    { q: "¿Bitlink cobra comisión por cada venta?", a: "No. El pago ocurre en tu plataforma (Mercado Pago, Stripe, PayPal, etc.) y el dinero va directo a tu cuenta." },
    { q: "¿Puedo vender productos digitales?", a: "Sí. Enlazá a Gumroad, Hotmart o a un link de pago y entregá el archivo desde esa plataforma." },
    { q: "¿Cuántos productos puedo cargar?", a: "No hay límite, pero para conversión conviene destacar pocos y agrupar el resto." },
    { q: "¿Puedo vender por WhatsApp desde el link en bio?", a: "Sí. Agregá un link de WhatsApp con un mensaje precargado, por ejemplo “Hola, quiero el producto X”." },
  ],
  related: ["novedad-dominio-propio-y-productos", "como-poner-varios-links-en-instagram", "metricas-link-en-bio"],
};

export default article;
