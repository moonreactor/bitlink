import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "codigo-qr-editable",
  slug: "codigo-qr-editable",
  category: "guias",
  title: "Cómo crear un código QR editable (dinámico) gratis y cambiar el destino después de imprimirlo",
  seoTitle: "Cómo crear un código QR editable gratis",
  description:
    "Qué es un QR dinámico, en qué se diferencia de uno estático y cómo crear uno gratis con tus colores y logo para cambiar el link sin reimprimir.",
  published: "2026-11-08",
  keywords: ["código qr editable", "qr dinámico gratis", "cambiar link de un qr", "qr con logo", "generador de qr gratis", "qr para menú"],
  tldr:
    "Un **QR editable** (o dinámico) no apunta directo al destino final, sino a un **link corto** que vos controlás. Si cambia la promo, la carta o el formulario, editás el destino del link corto y **el QR impreso sigue funcionando**. En Bitlink cada link corto y cada perfil tiene su QR, con colores, logo y descarga en PNG o SVG.",
  takeaways: [
    "QR estático: el destino queda “grabado”; si cambia, hay que reimprimir.",
    "QR dinámico: apunta a un link corto editable y permite medir escaneos.",
    "Usá SVG para imprenta y PNG para redes o pantallas.",
    "Probá el QR impreso en varios celulares antes de una tirada grande.",
  ],
  cover: { src: "/landing/1441986300917-64674bd600d8-360x440.webp", alt: "Interior de una tienda de ropa con estantes, gorras y lámparas colgantes" },
  body: [
    { type: "h2", text: "QR estático vs. QR dinámico" },
    {
      type: "table",
      head: ["", "QR estático", "QR dinámico (editable)"],
      rows: [
        ["A dónde apunta", "Directo a la URL final", "A un link corto que redirige"],
        ["¿Se puede cambiar el destino?", "No, hay que generar e imprimir otro", "Sí, cuando quieras"],
        ["¿Mide escaneos?", "No", "Sí: clics, países, dispositivos"],
        ["Complejidad del código", "Más denso si la URL es larga", "Simple, porque la URL es corta"],
        ["Ideal para", "Datos que nunca cambian (Wi-Fi, vCard)", "Menús, afiches, packaging, eventos, campañas"],
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Cuidado con los generadores “gratis”",
      text: "Algunos generadores crean QR dinámicos gratis y después de un período de prueba los desactivan hasta que pagues. Si el QR ya está impreso, quedás atrapado. Elegí una herramienta sin vencimiento.",
    },
    { type: "h2", text: "Cómo crear un QR editable gratis" },
    {
      type: "steps",
      name: "Cómo crear un código QR editable con Bitlink",
      items: [
        { title: "Creá un link corto", text: "En [Bitlink](/register), Short links → New. Elegí un back-half claro, por ejemplo `bitlink.click/menu`." },
        { title: "Poné el destino", text: "La carta en PDF, tu Google Maps, un formulario o tu página de link en bio." },
        { title: "Abrí el QR", text: "Cada link corto tiene su código QR listo para descargar." },
        { title: "Personalizalo", text: "Para el QR de tu perfil podés elegir color de frente, color de fondo y mostrar tu avatar en el centro." },
        { title: "Descargá en el formato correcto", text: "SVG para imprenta (no pierde calidad al agrandarlo) o PNG para redes y pantallas." },
        { title: "Cambiá el destino cuando quieras", text: "Editá el link corto; el QR impreso no cambia." },
      ],
    },
    { type: "h2", text: "Buenas prácticas para que el QR se escanee bien" },
    {
      type: "ul",
      items: [
        "**Contraste alto**: frente oscuro sobre fondo claro. Evitá QR claros sobre fondo oscuro.",
        "**Tamaño mínimo**: como referencia, unos 2 × 2 cm para escanear de cerca y bastante más grande para afiches que se miran de lejos.",
        "**Margen blanco** alrededor del código (la “zona silenciosa”).",
        "**Un texto al lado**: “Escaneá para ver el menú” aumenta los escaneos porque la gente sabe qué va a pasar.",
        "**Logo pequeño**: si ponés un logo en el centro, que no tape demasiado del código.",
        "**Probalo** con iPhone y Android, con poca luz y desde distintas distancias.",
      ],
    },
    { type: "h2", text: "Ideas para usar un QR editable" },
    {
      type: "table",
      head: ["Dónde", "Destino sugerido"],
      rows: [
        ["Mesas de un restaurante", "Carta del día · ver [menú QR para restaurantes](/es/blog/menu-qr-para-restaurantes)"],
        ["Packaging de productos", "Instrucciones, garantía o recompra"],
        ["Merch table de un show", "Tu link en bio con tienda y newsletter"],
        ["Afiches y volantes", "Entradas o inscripción del evento"],
        ["Tarjetas personales", "Tu página de Bitlink con todos tus contactos"],
        ["Vidriera del local", "WhatsApp o catálogo cuando el local está cerrado"],
      ],
    },
    { type: "h2", text: "Cómo medir los escaneos" },
    {
      type: "p",
      text: "Cada escaneo cuenta como un clic en el link corto, con país y tipo de dispositivo. Si usás el mismo destino en varios lugares, creá **un link corto por ubicación** (`/menu-mesa`, `/menu-vidriera`) para saber cuál funciona mejor. También podés sumarle `utm_medium=qr` para verlo en Google Analytics: ver [parámetros UTM](/es/blog/que-son-los-parametros-utm).",
    },
    { type: "cta", title: "QR editables, gratis y sin vencimiento", text: "Cambiá el destino cuando quieras. Sin reimprimir." },
  ],
  faqs: [
    { q: "¿Se puede cambiar el link de un QR ya impreso?", a: "Solo si es un QR dinámico, es decir, si apunta a un link corto que podés editar. Un QR estático no se puede modificar." },
    { q: "¿Los QR de Bitlink vencen?", a: "No. Mientras el link corto esté activo, el QR funciona." },
    { q: "¿Qué formato uso para imprimir?", a: "SVG, porque es vectorial y no pierde calidad a ningún tamaño. PNG sirve para pantallas y redes." },
    { q: "¿Puedo poner mi logo en el QR?", a: "Sí, en el QR de tu perfil podés mostrar tu avatar en el centro y elegir los colores." },
  ],
  related: ["menu-qr-para-restaurantes", "novedad-links-cortos", "acortador-de-links-gratis-sin-limite"],
};

export default article;
