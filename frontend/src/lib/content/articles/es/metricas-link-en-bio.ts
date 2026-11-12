import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "metricas-link-en-bio",
  slug: "metricas-link-en-bio",
  category: "guias",
  title: "Métricas de tu link en bio: qué medir y cómo conseguir más clics",
  seoTitle: "Métricas del link en bio: qué medir y cómo mejorar",
  description:
    "Visitas, clics, CTR, fuentes y países: qué significa cada métrica de tu link en bio, cómo interpretarlas y 8 acciones concretas para mejorar los clics.",
  published: "2026-11-10",
  keywords: ["métricas link en bio", "estadísticas link en bio", "ctr", "analítica de links", "aumentar clics link en bio"],
  tldr:
    "Las métricas clave de un link en bio son **visitas** (cuánta gente abre tu página), **clics** por link, **CTR** (clics ÷ visitas), **fuentes** (de qué red llegan) y **países**. Con esos cinco datos sabés qué link destacar, qué red te trae público y cuándo reordenar la página.",
  takeaways: [
    "CTR de la página = clics totales ÷ visitas.",
    "Compará links entre sí, no contra promedios de internet.",
    "Mirá tendencias semanales, no días sueltos.",
    "Exportá a CSV para cruzar con ventas o campañas.",
  ],
  cover: { src: "/landing/1460925895917-afdab827c52f-360x440.webp", alt: "Laptop con un panel de métricas y gráficos" },
  body: [
    { type: "h2", text: "Las 5 métricas que importan" },
    {
      type: "table",
      head: ["Métrica", "Qué mide", "Qué te dice"],
      rows: [
        ["Visitas", "Veces que se abrió tu página", "Si tu contenido está llevando gente al link"],
        ["Clics por link", "Toques en cada botón", "Qué le interesa a tu público"],
        ["CTR", "Clics ÷ visitas", "Si la página convence o la gente se va sin tocar nada"],
        ["Fuentes", "Red o sitio de origen", "Qué plataforma te trae más público"],
        ["Países", "Ubicación aproximada", "En qué moneda vender, en qué horario publicar, a dónde llevar una gira"],
      ],
    },
    { type: "h2", text: "Cómo calcular e interpretar el CTR" },
    {
      type: "p",
      text: "Si tu página tuvo 1.000 visitas y los links sumaron 450 clics, el CTR es 45%. No hay un número “correcto”: depende del público y del objetivo. Lo útil es **compararte con vos mismo**: si cambiaste el orden de los links y el CTR subió, el cambio funcionó.",
    },
    {
      type: "callout",
      tone: "note",
      text: "Un CTR bajo con muchas visitas suele significar que lo que prometiste en el video no está arriba en tu página, o que hay demasiados botones.",
    },
    { type: "h2", text: "Dónde ver tus estadísticas en Bitlink" },
    {
      type: "ul",
      items: [
        "**Panel principal**: visitas, clics y gráfico diario con rango de fechas.",
        "**Por link**: cuántos clics recibió cada botón.",
        "**Fuentes y países**: de dónde llega la gente.",
        "**Links cortos**: clics de cada link corto y de su QR.",
        "**Exportación CSV**: para cruzar con ventas o reportar a una marca.",
      ],
    },
    {
      type: "p",
      text: "Si necesitás conversiones (compras, registros), conectá **Google Analytics** o **Meta Pixel** desde Settings y usá [UTMs](/es/blog/que-son-los-parametros-utm) en los links que salen hacia tu tienda.",
    },
    { type: "h2", text: "8 acciones para conseguir más clics" },
    {
      type: "ol",
      items: [
        "**Poné arriba lo que prometiste** en tu último contenido.",
        "**Reducí la cantidad de botones** visibles; agrupá el resto en colecciones.",
        "**Escribí títulos con verbo**: “Comprá”, “Escuchá”, “Reservá”.",
        "**Destacá un link** con una animación o un estilo diferente.",
        "**Usá miniaturas**: una imagen junto al texto mejora el reconocimiento.",
        "**Embebé** YouTube o Spotify para que el contenido se consuma ahí mismo.",
        "**Programá links** para lanzamientos y retiralos cuando termina la promo.",
        "**Mencioná el link** en tus videos y en las historias con el sticker.",
      ],
    },
    { type: "h2", text: "Una rutina semanal de 10 minutos" },
    {
      type: "steps",
      name: "Rutina semanal para revisar las métricas del link en bio",
      items: [
        { title: "Mirá la tendencia", text: "Compará visitas y clics de los últimos 7 días contra la semana anterior." },
        { title: "Detectá ganadores y perdedores", text: "¿Qué link subió? ¿Cuál no recibe clics hace semanas?" },
        { title: "Revisá fuentes", text: "Si una red crece, publicá más ahí; si cae, revisá qué cambió." },
        { title: "Hacé un solo cambio", text: "Reordená, renombrá o sacá un link. Un cambio por semana para saber qué funcionó." },
        { title: "Anotá", text: "Registrá el cambio y el resultado. En un mes vas a tener tu propio manual." },
      ],
    },
    { type: "cta", title: "Estadísticas incluidas, gratis", text: "Visitas, clics, fuentes, países y CSV en cada cuenta de Bitlink." },
  ],
  faqs: [
    { q: "¿Qué es un buen CTR para un link en bio?", a: "Depende del público y del objetivo. Lo más útil es comparar tu propio CTR antes y después de cada cambio." },
    { q: "¿Las visitas de bots cuentan?", a: "Las herramientas filtran parte del tráfico automatizado, pero ningún sistema es perfecto. Mirá tendencias más que números exactos." },
    { q: "¿Puedo usar Google Analytics con mi link en bio?", a: "Sí. En Bitlink cargás tu ID de Google Analytics o de Meta Pixel desde Settings." },
    { q: "¿Puedo exportar mis estadísticas?", a: "Sí, en CSV, para analizarlas en una planilla o compartirlas con una marca." },
  ],
  related: ["que-son-los-parametros-utm", "que-es-un-link-en-bio", "vender-por-instagram-sin-tienda"],
};

export default article;
