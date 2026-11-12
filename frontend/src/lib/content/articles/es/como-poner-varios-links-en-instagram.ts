import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "como-poner-varios-links-en-instagram",
  slug: "como-poner-varios-links-en-instagram",
  category: "guias",
  title: "Cómo poner varios links en Instagram (bio, historias y Reels) paso a paso",
  seoTitle: "Cómo poner varios links en Instagram paso a paso",
  description:
    "Las formas de compartir más de un link en Instagram: los links nativos del perfil, el sticker de historias y una página de link en bio. Paso a paso.",
  published: "2026-11-06",
  keywords: ["varios links en instagram", "cómo poner links en instagram", "link en bio instagram", "sticker de link", "agregar link instagram"],
  tldr:
    "Instagram permite agregar **hasta 5 enlaces** en el perfil, pero la bio solo muestra el primero y los demás quedan escondidos detrás de un menú. La forma más efectiva de compartir varios links es poner **un único link en bio** (por ejemplo, `bitlink.click/tunombre`) que abra una página con todos tus destinos, y complementar con el **sticker de enlace** en historias.",
  takeaways: [
    "Perfil: Editar perfil → Enlaces → Agregar enlace externo.",
    "Historias: sticker “Enlace”, disponible para todas las cuentas.",
    "Reels y posts: el texto no es clickeable; decí “link en mi bio”.",
    "Una página de link en bio ordena todo y te da estadísticas.",
  ],
  cover: { src: "/landing/1554080353-a576cf803bda-900x1100.webp", alt: "Fotógrafa sacando una foto con su cámara en la calle de noche" },
  body: [
    { type: "h2", text: "Dónde se pueden poner links en Instagram" },
    {
      type: "table",
      head: ["Lugar", "¿Link clickeable?", "Notas"],
      rows: [
        ["Bio del perfil", "Sí", "Hasta 5 enlaces; en la bio se ve el primero y “y X más”"],
        ["Historias", "Sí", "Con el sticker “Enlace”; dura 24 h salvo que la guardes en destacadas"],
        ["Descripción de posts y Reels", "No", "El texto con URL no es clickeable"],
        ["Mensajes directos", "Sí", "Útil para respuestas automáticas o consultas"],
        ["Botones de acción (cuentas profesionales)", "Sí", "Reservar, pedir comida, etc., con socios compatibles"],
      ],
    },
    {
      type: "callout",
      tone: "note",
      text: "Instagram cambia sus funciones con frecuencia y pueden variar por país o tipo de cuenta. Revisá la app si ves algo distinto.",
    },
    { type: "h2", text: "Opción 1: los enlaces nativos del perfil" },
    {
      type: "p",
      text: "Desde la app: **Editar perfil → Enlaces → Agregar enlace externo**. Podés cargar varios, pero la bio muestra solo el primero; para ver el resto hay que tocar “y X más”. Mucha gente no lo hace, así que el segundo, tercer y cuarto link reciben pocos clics. Además, Instagram no te dice cuántos clics recibió cada uno de forma detallada.",
    },
    { type: "h2", text: "Opción 2: una página de link en bio (la más efectiva)" },
    {
      type: "p",
      text: "Ponés **un solo enlace** en la bio y ese enlace abre una página con todos tus botones, ordenados como quieras. Es lo que hacen la mayoría de los creadores y marcas. Si no sabés bien qué es, leé [qué es un link en bio](/es/blog/que-es-un-link-en-bio).",
    },
    {
      type: "steps",
      name: "Cómo poner varios links en Instagram con un link en bio",
      items: [
        { title: "Creá tu página", text: "Registrate gratis en [Bitlink](/register) y elegí tu nombre, idealmente el mismo @ de Instagram." },
        { title: "Agregá tus links", text: "Tienda, WhatsApp, último Reel, YouTube, newsletter. Poné arriba el más importante." },
        { title: "Copiá tu link", text: "Por ejemplo, `bitlink.click/tunombre`." },
        { title: "Pegalo en Instagram", text: "Editar perfil → Enlaces → Agregar enlace externo → pegá la URL y poné un título como “Todos mis links”." },
        { title: "Dejalo primero", text: "Si tenés varios enlaces nativos, asegurate de que el de tu página quede primero, que es el que se ve en la bio." },
      ],
    },
    { type: "h2", text: "Opción 3: el sticker de enlace en historias" },
    {
      type: "p",
      text: "En una historia tocá el ícono de stickers y elegí **Enlace**. Pegá la URL y personalizá el texto del sticker. Para campañas puntuales conviene usar un **link corto con UTM** (`bitlink.click/drop-ig`) y así medir cuántos clics vinieron de esa historia. Ver [qué son los parámetros UTM](/es/blog/que-son-los-parametros-utm).",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Guardala en destacadas",
      text: "Una historia con link guardada en destacadas (“Comprar”, “Turnos”) funciona como un segundo link permanente en tu perfil.",
    },
    { type: "h2", text: "Cómo conseguir más clics desde Instagram" },
    {
      type: "ul",
      items: [
        "**Llamado a la acción en la bio**: “👇 Entradas y merch” arriba del link.",
        "**Mencioná el link** en el Reel y en la descripción: “link en mi bio”.",
        "**Reordená según el momento**: en un lanzamiento, el lanzamiento va primero.",
        "**Mirá las fuentes**: en las estadísticas de Bitlink ves cuánta gente llega desde Instagram frente a otras redes.",
      ],
    },
    { type: "cta", title: "Un link para toda tu bio de Instagram", text: "Creá tu página gratis y empezá a medir qué se clickea." },
  ],
  faqs: [
    { q: "¿Cuántos links se pueden poner en la bio de Instagram?", a: "Instagram permite cargar hasta 5 enlaces en el perfil, pero en la bio solo se ve el primero. Por eso conviene que ese primero sea una página de link en bio." },
    { q: "¿Se puede poner un link clickeable en un Reel?", a: "No en el texto de la descripción. Usá el link de la bio, el sticker de historias o enviá el link por mensaje directo." },
    { q: "¿Necesito una cuenta profesional para poner links?", a: "No. Cualquier cuenta puede agregar enlaces al perfil y usar el sticker de enlace en historias." },
    { q: "¿Instagram penaliza los links de link en bio?", a: "No hay evidencia de que un link en bio reduzca el alcance. Es una práctica estándar entre creadores y marcas." },
  ],
  related: ["que-es-un-link-en-bio", "como-poner-link-en-tiktok", "vender-por-instagram-sin-tienda"],
};

export default article;
