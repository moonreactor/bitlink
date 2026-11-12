import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "novedad-dominio-propio-y-productos",
  slug: "novedad-dominio-propio-y-productos",
  category: "novedades",
  title: "Novedad: dominio propio, productos, propinas y captura de contactos en tu Bitlink",
  seoTitle: "Novedad: dominio propio y productos en Bitlink",
  description:
    "Tu link en bio ahora puede vivir en tu propio dominio y mostrar productos con checkout externo, botón de propinas y formulario de email o teléfono.",
  published: "2026-11-05",
  keywords: ["dominio propio link en bio", "vender en link en bio", "propinas", "captura de emails", "bitlink novedades"],
  tldr:
    "Ahora podés publicar tu Bitlink en **tu propio dominio** (por ejemplo `links.tumarca.com`), agregar **tarjetas de producto** que llevan a tu checkout sin comisión, un **botón de propinas** y un formulario para **capturar emails o teléfonos**. Todo incluido gratis.",
  takeaways: [
    "Dominio propio: verificás con un registro TXT y apuntás un CNAME.",
    "Productos con imagen, precio y link a Mercado Pago, Stripe, PayPal o Gumroad.",
    "Botón de propinas hacia Mercado Pago, PayPal, Cafecito u otro servicio.",
    "Suscriptores por email o teléfono, sin depender del algoritmo.",
  ],
  cover: { src: "/landing/1490481651871-ab68de25d43d-360x440.webp", alt: "Perchero con camisas y blusas de una tienda de ropa" },
  body: [
    { type: "h2", text: "Dominio propio" },
    {
      type: "p",
      text: "Tu página puede verse en una dirección de tu marca, como `links.tumarca.com`, en lugar de `bitlink.click/tunombre`. Sirve para reforzar la marca y para que la gente confíe más al hacer clic.",
    },
    {
      type: "p",
      text: "El proceso tiene dos partes: **verificar** que el dominio es tuyo con un registro TXT y **apuntar** el subdominio a Bitlink con un CNAME. Lo explicamos completo en la guía [cómo conectar un dominio propio a tu link en bio](/es/blog/conectar-dominio-propio).",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Sobre el certificado SSL",
      text: "El certificado HTTPS del dominio propio se configura en tu proveedor de DNS o hosting (por ejemplo, con el proxy de Cloudflare). Sin HTTPS, los navegadores marcan la página como no segura.",
    },
    { type: "h2", text: "Productos sin tienda online" },
    {
      type: "p",
      text: "Desde la sección **Products** creás tarjetas con foto, nombre, descripción, precio y un link de compra. El link puede ser un link de pago de Mercado Pago, un checkout de Stripe, PayPal, Gumroad, Hotmart o tu WhatsApp. **Bitlink no cobra comisión** porque el pago ocurre fuera de la plataforma.",
    },
    {
      type: "ul",
      items: [
        "Ideal para cursos, programas de entrenamiento, presets, merch, entradas y servicios.",
        "Las tarjetas se ven en tu página junto al resto de los links.",
        "Cada clic queda registrado en tus estadísticas.",
      ],
    },
    { type: "p", text: "Si querés armar un catálogo completo, mirá [cómo vender por Instagram sin tienda online](/es/blog/vender-por-instagram-sin-tienda)." },
    { type: "h2", text: "Botón de propinas" },
    {
      type: "p",
      text: "Activás un botón de propinas con el texto que quieras (“Invitame un café ☕”) y lo conectás a tu link de Cafecito, Mercado Pago, PayPal o Buy Me a Coffee. Es la forma más simple de que tu comunidad te apoye.",
    },
    { type: "h2", text: "Captura de emails y teléfonos" },
    {
      type: "p",
      text: "Un formulario en tu página para que la gente deje su email (y opcionalmente su teléfono). Es tu lista propia: si mañana cambia el algoritmo de una red social, igual podés avisarle a tu audiencia de un lanzamiento.",
    },
    { type: "h2", text: "Cómo activarlo" },
    {
      type: "steps",
      name: "Cómo activar productos, propinas y dominio en Bitlink",
      items: [
        { title: "Productos", text: "Panel → Products → agregá foto, título, precio y link de pago." },
        { title: "Propinas", text: "Panel → Settings → activá el botón de propinas y pegá tu link de pago." },
        { title: "Captura de contactos", text: "Panel → Settings → activá el formulario de email y, si querés, el de teléfono." },
        { title: "Dominio propio", text: "Panel → Settings → Custom domain → cargá tu dominio, agregá el TXT y el CNAME y verificá." },
      ],
    },
    { type: "cta" },
  ],
  faqs: [
    { q: "¿Bitlink procesa los pagos de mis productos?", a: "No. Cada producto enlaza a tu propio checkout; el dinero va directo a tu cuenta y Bitlink no cobra comisión." },
    { q: "¿El dominio propio tiene costo?", a: "En Bitlink no. Solo pagás el dominio a tu registrador, como cualquier dominio." },
    { q: "¿Puedo exportar los emails que capturo?", a: "Los contactos quedan guardados en tu cuenta para que puedas usarlos en tus campañas." },
  ],
  related: ["conectar-dominio-propio", "vender-por-instagram-sin-tienda", "lanzamiento-bitlink"],
};

export default article;
