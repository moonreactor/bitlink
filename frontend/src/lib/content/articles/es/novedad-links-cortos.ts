import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "novedad-links-cortos",
  slug: "novedad-links-cortos",
  category: "novedades",
  title: "Novedad: links cortos en bitlink.click con UTMs, reglas por dispositivo y por país",
  seoTitle: "Links cortos con UTMs, reglas por dispositivo y país",
  description:
    "Ya podés crear links cortos ilimitados en bitlink.click con back-half propio, UTMs, destino distinto para móvil o escritorio y por país, QR y estadísticas.",
  published: "2026-11-04",
  keywords: ["links cortos", "acortador de links", "bitlink.click", "utm", "redirección por país", "redirección por dispositivo"],
  tldr:
    "Bitlink suma un **acortador de links** integrado: creás links como `bitlink.click/promo`, les agregás **UTMs**, definís un destino distinto para **móvil y escritorio** o por **país**, y cambiás el destino cuando quieras sin volver a imprimir el QR. Es ilimitado y gratis.",
  takeaways: [
    "Back-half personalizado: bitlink.click/lo-que-quieras (2 a 40 caracteres).",
    "Campos UTM listos: source, medium, campaign, term y content.",
    "Reglas: un destino para móvil, otro para escritorio, y destinos por país.",
    "Cada link corto tiene estadísticas de clics y su propio QR.",
  ],
  cover: { src: "/landing/1460925895917-afdab827c52f-360x440.webp", alt: "Laptop mostrando un panel de analítica con gráficos de clics" },
  body: [
    { type: "h2", text: "Qué cambió" },
    {
      type: "p",
      text: "Además de tu página de link en bio, ahora cada cuenta de Bitlink tiene una sección **Short links** para crear links cortos sobre el dominio `bitlink.click`. Sirven para compartir en una historia, un video, un mail, un afiche o un packaging, y saber exactamente cuántas personas hicieron clic.",
    },
    { type: "h2", text: "Las funciones, una por una" },
    { type: "h3", text: "1. Back-half personalizado" },
    {
      type: "p",
      text: "Elegís la parte final del link: `bitlink.click/entradas`, `bitlink.click/black-friday`, `bitlink.click/menu`. Se aceptan letras minúsculas, números, guiones y guiones bajos, de 2 a 40 caracteres. Un link legible genera más confianza que uno con letras al azar.",
    },
    { type: "h3", text: "2. UTMs sin fórmulas" },
    {
      type: "p",
      text: "Completás `utm_source`, `utm_medium`, `utm_campaign`, `utm_term` y `utm_content` en el formulario y Bitlink los agrega al destino automáticamente. Así Google Analytics (u otra herramienta) sabe de dónde vino cada visita. Si es la primera vez que los usás, leé [qué son los parámetros UTM](/es/blog/que-son-los-parametros-utm).",
    },
    { type: "h3", text: "3. Reglas por dispositivo" },
    {
      type: "p",
      text: "Podés definir un destino para **móviles y tablets** y otro para **escritorio**. Ejemplo: en el celular mandás a la versión mobile de tu tienda o a la app, y en la computadora a la web completa.",
    },
    { type: "h3", text: "4. Reglas por país" },
    {
      type: "p",
      text: "Asignás destinos según el país de quien hace clic: Argentina a tu checkout en pesos, México a la tienda en MXN, el resto del mundo a la versión en dólares. Si el país no tiene regla, se usa el destino principal.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Orden de prioridad",
      text: "Primero se evalúa la regla por dispositivo, después la de país y, si ninguna aplica, el destino principal.",
    },
    { type: "h3", text: "5. Destino editable y QR" },
    {
      type: "p",
      text: "El link corto no cambia aunque cambies el destino. Eso lo vuelve ideal para **códigos QR impresos**: si mañana cambia tu promo, editás el destino y el QR del afiche sigue funcionando. Más detalle en [cómo crear un código QR editable](/es/blog/codigo-qr-editable).",
    },
    { type: "h2", text: "Ejemplos de uso" },
    {
      type: "table",
      head: ["Link corto", "Regla", "Para qué"],
      rows: [
        ["bitlink.click/tour", "UTM source=instagram", "Medir cuántas entradas vienen de Instagram"],
        ["bitlink.click/app", "Móvil → tienda de apps · Escritorio → web", "Un solo link para descargar la app"],
        ["bitlink.click/oferta", "AR → checkout en ARS · MX → MXN", "Precio local según el país"],
        ["bitlink.click/menu", "Destino editable", "QR en las mesas que siempre muestra la carta del día"],
      ],
    },
    { type: "h2", text: "Cómo crear tu primer link corto" },
    {
      type: "steps",
      name: "Cómo crear un link corto en Bitlink",
      items: [
        { title: "Entrá a Short links", text: "Desde tu panel, abrí la sección Short links y tocá “New”." },
        { title: "Pegá el destino", text: "La URL larga a la que querés mandar a la gente." },
        { title: "Elegí el back-half", text: "Una palabra corta y clara, por ejemplo `promo-verano`." },
        { title: "Sumá UTMs y reglas (opcional)", text: "Completá source, medium y campaign, y si querés, destinos por dispositivo o país." },
        { title: "Compartí y medí", text: "Copiá el link o descargá el QR. Los clics aparecen en las estadísticas del link." },
      ],
    },
    { type: "cta", title: "Creá links cortos ilimitados", text: "Sin topes mensuales, con UTMs, reglas y QR incluidos." },
  ],
  faqs: [
    { q: "¿Cuántos links cortos puedo crear?", a: "Todos los que necesites. No hay límite mensual de links ni de clics." },
    { q: "¿Puedo cambiar el destino de un link corto ya publicado?", a: "Sí. El link y su QR siguen iguales; solo cambia a dónde redirigen." },
    { q: "¿Qué pasa si un código ya está tomado?", a: "Cada back-half es único en bitlink.click. Si está ocupado, probá una variante con guion o con el nombre de tu marca." },
    { q: "¿Las reglas por dispositivo distinguen iPhone de Android?", a: "Hoy las reglas distinguen móvil/tablet de escritorio. Para separar tiendas de apps, usá una página de destino que detecte el sistema operativo." },
  ],
  related: ["acortador-de-links-gratis-sin-limite", "que-son-los-parametros-utm", "codigo-qr-editable"],
};

export default article;
