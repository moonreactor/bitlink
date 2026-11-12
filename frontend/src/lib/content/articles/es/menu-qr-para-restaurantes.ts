import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "menu-qr-para-restaurantes",
  slug: "menu-qr-para-restaurantes",
  category: "casos-de-uso",
  title: "Menú QR para restaurantes y bares: cómo armarlo gratis y actualizarlo sin reimprimir",
  seoTitle: "Menú QR para restaurantes: cómo armarlo gratis",
  description:
    "Cómo crear un menú con QR para tu restaurante, bar o cafetería: carta, reservas, delivery y WhatsApp en una página, con un QR que podés editar.",
  published: "2026-11-11",
  keywords: ["menú qr", "carta qr restaurante", "qr para menú gratis", "menú digital", "qr editable restaurante"],
  tldr:
    "Para un **menú QR** que no haya que reimprimir: armá una página con la **carta**, **reservas**, **delivery** y **WhatsApp**, y generá un **QR dinámico** que apunte a esa página o a un link corto. Cuando cambien los precios o el plato del día, actualizás el destino y el QR de las mesas sigue funcionando.",
  takeaways: [
    "La carta en una página liviana, no en un PDF pesado.",
    "Un QR por ubicación (mesa, barra, vidriera) para medir.",
    "Sumá reservas, delivery, reseñas y Wi-Fi.",
    "QR con alto contraste y un texto que diga qué hace.",
  ],
  cover: { src: "/landing/1504674900247-0877df9cc836-900x1100.webp", alt: "Plato con carne en fetas, verduras y ají visto desde arriba sobre una mesa de madera" },
  body: [
    { type: "h2", text: "Qué debería tener tu página de menú" },
    {
      type: "ul",
      items: [
        "**Carta** con fotos y precios: como colección en grilla o un link a tu carta.",
        "**Plato o promo del día** arriba de todo.",
        "**Reservas**: link a tu sistema de reservas o a WhatsApp con mensaje precargado.",
        "**Delivery y take away**: links a tus apps de delivery o a tu propio pedido.",
        "**Ubicación y horarios**: link a Google Maps.",
        "**Reseñas**: link para dejar una reseña en Google.",
        "**Wi-Fi y redes**: Instagram y, si querés, la clave del Wi-Fi en la bio.",
      ],
    },
    { type: "h2", text: "Paso a paso" },
    {
      type: "steps",
      name: "Cómo armar un menú QR para un restaurante",
      items: [
        { title: "Creá la página", text: "Registrate en [Bitlink](/register) con el nombre del local, por ejemplo `bitlink.click/cafemarea`." },
        { title: "Cargá la carta", text: "Usá colecciones en grilla con foto y nombre de cada sección (entradas, principales, postres, bebidas) o enlazá tu carta." },
        { title: "Agregá reservas y delivery", text: "WhatsApp, sistema de reservas y apps de delivery como botones." },
        { title: "Creá un link corto por ubicación", text: "`/cafemarea-mesa`, `/cafemarea-barra`, `/cafemarea-vidriera`, todos apuntando a tu página." },
        { title: "Descargá los QR en SVG", text: "SVG para imprenta: no pierde calidad en stickers, acrílicos o vinilos." },
        { title: "Imprimí con un texto claro", text: "“Escaneá para ver la carta” junto al código." },
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Menú de almuerzo y de noche",
      text: "Con un link corto editable podés mandar el mismo QR a la carta de mediodía o a la de noche cambiando el destino, o programar links que aparezcan solo en cierto horario.",
    },
    { type: "h2", text: "Diseño del QR para mesas" },
    {
      type: "table",
      head: ["Soporte", "Recomendación"],
      rows: [
        ["Sticker en la mesa", "Al menos 3 × 3 cm, laminado para que resista la limpieza"],
        ["Acrílico o portamenú", "QR grande, logo pequeño, texto con la acción"],
        ["Vidriera", "QR grande a la altura de los ojos para ver la carta cuando está cerrado"],
        ["Ticket o packaging", "QR a reseñas o a tu Instagram para fidelizar"],
      ],
    },
    { type: "h2", text: "Qué medir" },
    {
      type: "p",
      text: "Cada escaneo es un clic en el link corto: ves cuántos escaneos hubo por día, desde qué ubicación y desde qué tipo de dispositivo. Si la vidriera trae muchos escaneos fuera de horario, sumá un botón de pedido online bien arriba. Más en [código QR editable](/es/blog/codigo-qr-editable).",
    },
    { type: "cta", title: "Tu menú QR, gratis", text: "Carta, reservas y delivery en una página, con QR editable." },
  ],
  faqs: [
    { q: "¿Es mejor un PDF o una página para el menú QR?", a: "Una página: carga más rápido en el celular, se lee mejor y la podés actualizar sin generar un archivo nuevo." },
    { q: "¿Tengo que reimprimir el QR si cambian los precios?", a: "No, si el QR apunta a un link corto o a tu página de Bitlink. Actualizás el contenido y el QR sigue igual." },
    { q: "¿Puedo saber cuántas personas escanean el QR?", a: "Sí. Cada escaneo cuenta como clic en el link corto, con fecha, país y dispositivo." },
    { q: "¿Cuesta algo?", a: "No. La página, los links cortos y los QR son gratis en Bitlink." },
  ],
  related: ["codigo-qr-editable", "novedad-links-cortos", "metricas-link-en-bio"],
};

export default article;
