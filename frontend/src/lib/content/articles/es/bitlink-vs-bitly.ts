import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "vs-bitly",
  slug: "bitlink-vs-bitly",
  category: "comparativas",
  title: "Bitlink vs Bitly (2026): links cortos gratis e ilimitados vs un plan gratis de 5 links por mes",
  seoTitle: "Bitlink vs Bitly (2026): plan gratis y funciones",
  description:
    "Bitlink vs Bitly: el plan gratis de Bitly permite 5 links cortos y 2 QR por mes; Bitlink es ilimitado y gratis, con UTMs, reglas de redirección y estadísticas.",
  published: "2026-11-12",
  updated: "2026-11-12",
  keywords: ["bitlink vs bitly", "alternativa a bitly", "límites plan gratis bitly", "precios bitly", "acortador de links gratis ilimitado", "bitly vs"],
  tldr:
    "En la página de precios de Bitly, el **plan gratis permite 5 links cortos, 2 códigos QR y 3 back-halves personalizados por mes**, sin historial de clics y sin constructor de UTMs; el constructor de UTMs arranca en **Core (USD 10/mes, facturación anual)**. **Bitlink** no tiene límites mensuales e incluye gratis campos UTM, reglas por dispositivo y país, QR y estadísticas de clics, además de una página de link en bio.",
  takeaways: [
    "Bitly Free: 5 links, 2 QR y 3 back-halves por mes; sin historial de clics; sin constructor de UTMs.",
    "Los planes pagos de Bitly van de USD 10, 29 y 199 por mes (tarifas de facturación anual de su página).",
    "Bitlink: links cortos ilimitados, UTMs, reglas por dispositivo y país, QR y estadísticas, todo gratis.",
    "Bitly apunta a equipos grandes y empresas; Bitlink, a creadores y negocios chicos.",
  ],
  cover: { src: "/landing/1460925895917-afdab827c52f-360x440.webp", alt: "Laptop mostrando un panel de analítica con gráficos de clics" },
  body: [
    {
      type: "callout",
      tone: "note",
      title: "Cómo lo comparamos",
      text: "Somos Bitlink, así que esta página se inclina hacia lo que mejor hacemos. Todas las cifras de Bitly salen de su propia página de precios, consultada el 12 de noviembre de 2026 (los precios son las tarifas de facturación anual que figuran ahí). Los planes cambian: verificá antes de comprar.",
    },
    { type: "h2", text: "La versión corta" },
    {
      type: "p",
      text: "Bitly es uno de los acortadores más conocidos y está construido alrededor de **cupos mensuales**: cada plan incluye una cantidad fija de links cortos, códigos QR y back-halves personalizados por mes. Si te quedás sin cupo en plena campaña, esperás o pagás. Bitlink **no tiene cupos**: creás todos los links cortos que necesites.",
    },
    { type: "h2", text: "Los planes de Bitly, lado a lado" },
    {
      type: "table",
      caption: "Fuente: bitly.com/pages/pricing, consultada el 2026-11-12",
      head: ["", "Free", "Core", "Growth", "Premium"],
      rows: [
        ["Precio", "USD 0 (figura “con anuncios”)", "USD 10/mes (solo anual)", "USD 29/mes", "USD 199/mes"],
        ["Links cortos por mes", "5", "100", "500", "3.000"],
        ["Códigos QR por mes", "2", "5", "10", "200"],
        ["Back-halves personalizados por mes", "3", "100", "500", "3.000"],
        ["Historial de datos de clics", "Ninguno", "30 días", "4 meses", "1 año"],
        ["Constructor de UTMs", "No", "Sí", "Sí", "Sí"],
        ["Dominio propio / links de marca", "No", "No", "Sí", "Sí"],
      ],
    },
    {
      type: "p",
      text: "Su página también lista el enrutamiento dinámico por país, plataforma o dispositivo como no disponible en Free, Core y Growth, y los datos de clics por ciudad y tipo de dispositivo solo en Premium.",
    },
    { type: "h2", text: "Bitlink al lado de Bitly" },
    {
      type: "table",
      head: ["Función", "Bitlink (gratis)", "Bitly Free", "Bitly Core (USD 10/mes)"],
      rows: [
        ["Links cortos", "Ilimitados", "5 / mes", "100 / mes"],
        ["Códigos QR", "Ilimitados, PNG/SVG, colores, logo", "2 / mes", "5 / mes"],
        ["Back-halves personalizados", "Ilimitados", "3 / mes", "100 / mes"],
        ["Campos UTM", "Sí", "No", "Sí"],
        ["Destinos móvil vs escritorio", "Sí", "No", "No figura"],
        ["Destinos por país", "Sí", "No", "No figura"],
        ["Analítica de clics", "Clics, países, dispositivos, gráfico diario + CSV", "Sin historial", "30 días"],
        ["Página de link en bio con productos", "Sí, incluida", "No es un ítem aparte", "No es un ítem aparte"],
        ["Costo", "USD 0", "USD 0", "USD 10/mes"],
      ],
    },
    { type: "h2", text: "Dónde gana Bitlink" },
    {
      type: "ul",
      items: [
        "**Sin cupos.** Lanzá una campaña con 50 links cortos y 50 QR en una tarde, gratis.",
        "**Las reglas de redirección vienen incluidas.** Mandá a quien entra desde el celular y desde la compu a lugares distintos, o enrutá por país, sin mejorar de plan. Mirá [links cortos con reglas](/es/blog/novedad-links-cortos).",
        "**La analítica no es un extra pago.** Cada link muestra clics, países y dispositivos.",
        "**QR editables sin tope mensual.** Imprimí tranquilo: [cómo funcionan los QR editables](/es/blog/codigo-qr-editable).",
        "**Una página de link en bio y un perfil listo para vender** en la misma cuenta.",
      ],
    },
    { type: "h2", text: "Dónde puede convenir más Bitly" },
    {
      type: "ul",
      items: [
        "**Dominios cortos de marca en tu propio dominio.** Bitly lista links de marca desde su plan Growth. En Bitlink, los links cortos viven en bitlink.click (tu dominio propio aplica a la página de perfil).",
        "**Necesidades de empresa**: equipos grandes, contratos a medida y seguimiento avanzado.",
        "**Historial largo de clics en planes pagos**, hasta un año en Premium.",
      ],
    },
    { type: "h2", text: "Cómo pasarte en pocos pasos" },
    {
      type: "steps",
      name: "Cómo pasar tus links cortos de Bitly a Bitlink",
      items: [
        { title: "Listá tus links activos", text: "Anotá o exportá los links de Bitly que seguís usando y sus destinos." },
        { title: "Crealos en Bitlink", text: "En [Bitlink](/register), Short links → New. Elegí un back-half, pegá el destino y sumá UTMs si los necesitás." },
        { title: "No rompas los QR impresos", text: "Los links y QR que ya imprimiste siguen apuntando a Bitly. Creá nuevos en Bitlink para las próximas impresiones." },
        { title: "Actualizá dónde compartís", text: "Usá tus links nuevos en bios, mails y campañas de ahora en adelante." },
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Cuidado con los QR existentes",
      text: "Los links de Bitly que ya circulan dependen de tu cuenta de Bitly. No la borres ni la bajes de plan hasta haber reemplazado todo lo que usás.",
    },
    { type: "cta", title: "Links cortos ilimitados, gratis", text: "Sin cupo mensual. UTMs, reglas de redirección, QR y estadísticas incluidos." },
  ],
  faqs: [
    { q: "¿Cuáles son los límites del plan gratis de Bitly?", a: "Según la página de precios de Bitly, el plan gratis incluye 5 links cortos, 2 códigos QR y 3 back-halves personalizados por mes, sin historial de clics y sin constructor de UTMs." },
    { q: "¿Hay una alternativa gratis a Bitly sin límites?", a: "Sí. Bitlink permite crear links cortos y QR ilimitados, con UTMs, reglas por dispositivo y país y analítica de clics, gratis." },
    { q: "¿Bitlink ofrece dominios cortos de marca?", a: "Los links cortos usan bitlink.click. El dominio propio está disponible para tu página de perfil, no para los links cortos." },
    { q: "¿Mis QR de Bitly seguirán funcionando?", a: "Los códigos existentes siguen funcionando mientras tu cuenta de Bitly esté activa. Creá nuevos en Bitlink para próximas campañas." },
  ],
  related: ["acortador-de-links-gratis-sin-limite", "alternativas-gratis-a-bitly", "que-son-los-parametros-utm"],
};

export default article;
