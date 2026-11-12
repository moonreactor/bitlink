import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "como-ver-clics-link-corto",
  slug: "como-ver-cuantos-clics-tiene-un-link-corto",
  category: "guias",
  title: "Cómo ver cuántos clics tiene un link corto",
  seoTitle: "Cómo ver los clics de un link corto (gratis)",
  description:
    "Medí cuánta gente hace clic en tus links cortos: creá una cuenta gratis en Bitlink, reclamá los links que hiciste sin cuenta y mirá el conteo de clics de cada uno.",
  published: "2026-11-12",
  keywords: ["ver clics de un link corto", "cuántos clics tiene mi link", "métricas de link corto", "contador de clics de links gratis"],
  tldr:
    "Para **ver cuántos clics tiene un link corto**, creá el link en una cuenta gratis de Bitlink (o reclamá uno anónimo registrándote desde el mismo navegador) y abrí **Short links** en tu panel: cada link muestra su **cantidad de clics** y el botón **Stats** abre los clics por día, país, dispositivo y origen. Los clics se cuentan desde la primera visita, incluso antes de tener cuenta.",
  takeaways: [
    "Cada clic en un link corto de Bitlink se cuenta, estés logueado o no.",
    "Los links anónimos pasan a ser tuyos al registrarte desde el mismo navegador, con sus clics.",
    "Usá un link corto distinto por canal para saber cuál funciona.",
    "Sumá UTMs si además querés ver el tráfico en Google Analytics.",
  ],
  cover: { src: "/landing/1460925895917-afdab827c52f-360x440.webp", alt: "Notebook mostrando un panel de métricas con datos de clics" },
  body: [
    { type: "h2", text: "Qué te dice un contador de clics" },
    {
      type: "p",
      text: "Un link corto funciona como un contador: cada vez que alguien lo abre, Bitlink registra la visita y después lo manda al destino. El número que ves es la cantidad de veces que se abrió el link, y sirve para saber si un posteo, un mail o un QR impreso realmente trae gente.",
    },
    {
      type: "steps",
      name: "Cómo medir los clics de un link corto",
      items: [
        { title: "Creá el link con una cuenta", text: "Registrate gratis y creá el link desde **Short links**, o acortalo primero en el [acortador gratis](/acortador-de-links) y elegí crear una cuenta." },
        { title: "O reclamá uno que hiciste sin cuenta", text: "Registrate o iniciá sesión desde el mismo navegador: los links anónimos que creaste ahí se suman a tu cuenta solos, junto con sus clics." },
        { title: "Abrí Short links", text: "En el panel, cada link muestra el total de clics al lado de la URL corta." },
        { title: "Tocá Stats", text: "Mirá un gráfico diario de los últimos 7, 30 o 90 días, más los principales países, dispositivos y fuentes de tráfico." },
        { title: "Compartilo y volvé a mirar", text: "Publicalo, mandalo por mail o imprimí su QR y mirá cómo crece el número." },
      ],
    },
    { type: "h2", text: "Respuestas más claras con un link por canal" },
    {
      type: "p",
      text: "Un solo link compartido en todos lados te da apenas un total. Si querés saber si funciona mejor Instagram o el mail, hacé un link corto por cada lugar: `/promo-ig`, `/promo-mail`, `/promo-qr`. Todos llevan a la misma página, pero cada uno tiene su propio contador.",
    },
    {
      type: "table",
      head: ["Link", "Dónde lo compartís", "Qué aprendés"],
      rows: [
        ["`/gira-ig`", "Bio de Instagram", "Cuánto tráfico manda Instagram"],
        ["`/gira-mail`", "Newsletter", "Si tus suscriptores hacen clic"],
        ["`/gira-qr`", "Afiche impreso", "Si alguien escanea el QR"],
      ],
    },
    { type: "h2", text: "Conteo de clics vs. Google Analytics" },
    {
      type: "p",
      text: "El link corto cuenta **aperturas**; Google Analytics cuenta lo que pasa **dentro de tu sitio**. Se complementan. Sumá [parámetros UTM](/es/blog/que-son-los-parametros-utm) al link corto y el mismo clic aparece en Analytics etiquetado con su origen y campaña.",
    },
    {
      type: "callout",
      tone: "note",
      text: "Los números pueden incluir a personas que abren el link más de una vez y algunas visitas automáticas. Usalo para comparar links y ver tendencias, más que como cifra exacta de personas únicas.",
    },
    { type: "h2", text: "No pierdas tus datos: los links anónimos vencen" },
    {
      type: "p",
      text: "Los links anónimos se eliminan a los 60 días si nadie los reclama, y sus clics se van con ellos. Si te importan los números, creá primero una cuenta gratis. Los links de una cuenta no vencen.",
    },
    {
      type: "cta",
      title: "Medí tus links gratis",
      text: "Creá una cuenta gratis y mirá cuánta gente hace clic en cada link corto.",
      href: "/register",
      label: "Crear mi cuenta",
    },
  ],
  faqs: [
    { q: "¿Cómo veo cuántos clics tiene mi link corto?", a: "Creá el link en una cuenta gratis de Bitlink, o reclamá uno anónimo registrándote desde el mismo navegador, y abrí Short links en el panel: cada link muestra sus clics y Stats agrega el desglose por día, país, dispositivo y origen." },
    { q: "¿Qué puedo ver de las personas que hacen clic?", a: "Solo datos agregados: clics por día, país, tipo de dispositivo (móvil, escritorio, tablet) y de dónde vino el clic. Sin nombres ni datos personales." },
    { q: "¿Se cuentan los clics antes de crear la cuenta?", a: "Sí. Los clics en links anónimos se registran desde la primera visita y se suman a tu cuenta cuando reclamás el link." },
    { q: "¿Puedo medir un link que ya compartí?", a: "Solo si es un link corto de Bitlink. La URL de destino por sí sola no se puede contar; creá un link corto y usá ese de ahora en más." },
    { q: "¿Medir es gratis?", a: "Sí. Bitlink no tiene planes pagos: el conteo de clics y su desglose vienen con cualquier cuenta gratis." },
  ],
  related: ["acortar-un-link-sin-registrarse", "metricas-link-en-bio", "que-son-los-parametros-utm"],
};

export default article;
