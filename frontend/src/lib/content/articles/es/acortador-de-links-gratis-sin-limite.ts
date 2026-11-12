import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "acortador-de-links-gratis-sin-limite",
  slug: "acortador-de-links-gratis-sin-limite",
  category: "comparativas",
  title: "Acortador de links gratis y sin límite: qué ofrecer, qué evitar y cómo elegir",
  seoTitle: "Acortador de links gratis sin límite: cómo elegir",
  description:
    "Qué es un acortador de links, qué funciones importan (back-half, UTMs, QR, reglas, estadísticas) y qué límites revisar antes de elegir uno gratis.",
  published: "2026-11-11",
  keywords: ["acortador de links gratis", "acortador de url", "acortar links", "alternativa a bitly", "link corto personalizado"],
  tldr:
    "Un **acortador de links** convierte una URL larga en una corta y medible (por ejemplo `bitlink.click/promo`). Para elegir uno gratis, revisá: **límite mensual** de links, si podés **personalizar** el final, **editar el destino**, agregar **UTMs**, generar **QR** y ver **estadísticas** sin pagar. Bitlink incluye todo eso sin topes.",
  takeaways: [
    "Back-half personalizado = más confianza y más clics.",
    "Destino editable = QR que no hay que reimprimir.",
    "Reglas por dispositivo y país = un link para todos.",
    "Revisá que el plan gratis no venza ni desactive links.",
  ],
  cover: { src: "/landing/1493225457124-a3eb161ffa5f-900x1100.webp", alt: "Hombre levantando la mano entre humo de colores" },
  body: [
    { type: "h2", text: "Qué es un acortador de links y para qué sirve" },
    {
      type: "p",
      text: "Un acortador toma una URL larga —con parámetros, rutas y códigos— y la reemplaza por una corta que **redirige** al destino. Sirve para compartir en lugares con poco espacio, para que el link se vea prolijo y, sobre todo, para **medir cuántas personas hicieron clic**.",
    },
    { type: "h2", text: "Las funciones que importan" },
    {
      type: "table",
      head: ["Función", "Para qué sirve", "En Bitlink"],
      rows: [
        ["Back-half personalizado", "`/entradas` en vez de `/x7Kp2`", "Sí, gratis"],
        ["Destino editable", "Cambiar a dónde lleva sin cambiar el link", "Sí"],
        ["UTMs", "Atribuir visitas en Google Analytics", "Sí, con formulario"],
        ["Reglas por dispositivo", "Móvil a un lugar, escritorio a otro", "Sí"],
        ["Reglas por país", "Precio o idioma local", "Sí"],
        ["Código QR", "Usar el link en impresos", "Sí, PNG y SVG"],
        ["Estadísticas", "Clics, países, dispositivos", "Sí"],
        ["Límite mensual", "Cuántos links o clics podés tener", "Sin límite"],
      ],
    },
    { type: "h2", text: "Qué evitar en un acortador gratis" },
    {
      type: "ul",
      items: [
        "**Topes mensuales bajos** de links nuevos que te obligan a pagar a mitad de campaña.",
        "**Links que vencen** o se desactivan si dejás de pagar: un riesgo enorme si el QR ya está impreso.",
        "**Páginas intermedias con publicidad** antes de llegar al destino.",
        "**Estadísticas limitadas** a pocos días en el plan gratis.",
        "**Dominios de acortadores con mala reputación**, que algunas plataformas o filtros de spam bloquean.",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      text: "Antes de imprimir un QR o lanzar una campaña grande, confirmá qué pasa con tus links si la herramienta cambia de plan o si dejás de usarla.",
    },
    { type: "h2", text: "Link en bio + acortador en una sola cuenta" },
    {
      type: "p",
      text: "La ventaja de Bitlink es que el acortador vive en la misma cuenta que tu [link en bio](/es/blog/que-es-un-link-en-bio). Usás la página para tus redes y los links cortos para campañas, impresos, mails y anuncios, con estadísticas en el mismo panel.",
    },
    { type: "h2", text: "Cómo nombrar tus links cortos" },
    {
      type: "ol",
      items: [
        "**Corto y pronunciable**: `/tour`, `/menu`, `/clase-gratis`.",
        "**Sin ambigüedad**: evitá mezclar `0` y `o`, o `l` y `1`.",
        "**Con guiones** para separar palabras: `/black-friday`.",
        "**Un link por canal** si querés comparar: `/tour-ig`, `/tour-mail`.",
        "**Nada de datos personales** en el link (emails, documentos, teléfonos).",
      ],
    },
    { type: "cta", title: "Acortador gratis, sin topes", text: "Links cortos con UTMs, reglas, QR y estadísticas." },
  ],
  faqs: [
    { q: "¿Hay acortadores de links gratis sin límite?", a: "Sí. Bitlink permite crear links cortos ilimitados con estadísticas, QR, UTMs y reglas, sin plan pago." },
    { q: "¿Los links cortos afectan el SEO?", a: "Los links cortos usan redirecciones; para enlaces dentro de tu propio sitio conviene usar la URL directa. Para redes, campañas y QR son ideales." },
    { q: "¿Puedo personalizar el link corto?", a: "Sí. En Bitlink elegís la parte final: bitlink.click/lo-que-quieras, si está disponible." },
    { q: "¿Qué pasa si borro un link corto?", a: "Deja de redirigir. Si está impreso en un QR, mejor editá el destino en lugar de borrarlo." },
  ],
  related: ["novedad-links-cortos", "bitlink-vs-bitly", "codigo-qr-editable"],
};

export default article;
