import type { SiteLang } from "./site";

const en = {
  meta: {
    title: "Bitlink — Link-in-bio + short links, free forever",
    description:
      "Unlimited link-in-bio and short links with analytics, QR, UTMs, embeds, and themes — free forever. No monthly caps.",
  },
  common: { skip: "Skip to main content", mainNav: "Main navigation", verified: "Verified", examplePages: "Example pages" },
  nav: {
    shorten: "Shorten a link",
    how: "How it works",
    product: "Product",
    faq: "FAQ",
    blog: "Blog",
    login: "Log in",
    cta: "Get your link",
    ctaShort: "Get link",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Menu",
    language: "Language",
  },
  claim: {
    placeholder: "yourname",
    aria: "Claim your Bitlink username",
    idle: "Claim your Bitlink username",
    checking: "Checking…",
    available: "Looking good — that name is free",
    taken: "Taken — try another",
    invalid: "Use 3+ letters, numbers or _",
    claimFree: "Claim free",
    getFree: "Get Bitlink free",
  },
  hero: {
    badge: "Free forever · no plans",
    line1: "One link for",
    words: ["musicians", "chefs", "creators", "coaches", "shops", "podcasters"],
    lead: "Your music, videos, products and bookings on one page — plus short links, QR codes and stats to see what actually gets clicked.",
    shortenPrompt: "Just need a short link?",
    shortenLink: "Shorten a URL free, no sign-up →",
    included: ["Unlimited links", "Short links + QR", "Products & tips", "Custom domain"],
  },
  shortener: {
    eyebrow: "Free URL shortener",
    title: "Shorten a link right now.",
    body: "No account needed, no limits, links never expire. Sign up free only if you want click stats.",
    more: "Learn more",
  },
  creators: {
    title: "Made for people who make things.",
    body: "The pages below are examples of what you can build in a few minutes.",
    showcase: ["Musicians", "Chefs", "Photographers", "Coaches", "Shops", "DJs", "Podcasters", "Fashion", "Creators", "Startups"],
  },
  product: {
    eyebrow: "Your page",
    title: "More than a list of links.",
    play: {
      title: "Play it right there",
      body: "Paste a YouTube or Spotify link — it turns into a player on your page. No app switching.",
      single: "Single",
      videoTitle: "Live in Buenos Aires — full set",
    },
    sell: {
      title: "Sell without a store",
      body: "Product cards with your price and checkout link. We take 0%.",
      items: ["12-week program", "1:1 coaching call"],
      gateways: "Mercado Pago · Stripe · PayPal · Gumroad",
    },
    collections: { title: "Collections in a grid", body: "Group links with photos — a portfolio, a menu, a lookbook." },
    tips: {
      title: "Tips & a mailing list",
      body: "Let fans support you and keep in touch — off the algorithm.",
      coffee: "Buy me a coffee ☕",
      emailPlaceholder: "you@email.com",
      join: "Join",
    },
    drops: {
      title: "Drops & private links",
      body: "Schedule a link to go live at launch time, or lock it with a password.",
      merch: "Merch drop",
      when: "Fri 18:00",
      presskit: "Presskit",
      locked: "🔒 Locked",
    },
  },
  design: {
    eyebrow: "Design",
    title: "Make it look like you.",
    body: "Upload your own background, pick fonts and button shapes, add motion to the links that matter — and serve it on your own domain.",
    variants: { paper: "Paper", photo: "Photo background", midnight: "Midnight", blush: "Blush" },
    chips: ["Background photo", "Pill · rounded · square", "Link animations ✨"],
  },
  share: {
    eyebrow: "Share",
    title: "Wherever your people find you.",
    body: "One URL for every bio and video description, and a QR code for the menu, the poster or the merch table.",
    steps: [
      { title: "Claim your name", body: "Pick bitlink.click/yourname — it takes seconds." },
      { title: "Add what you share", body: "Links, videos, songs, products, a tip jar, a sign-up form." },
      { title: "Put it everywhere", body: "Bio, video descriptions, a printed QR. Then watch the clicks." },
    ],
    cards: { qr: "Printed on the menu", youtube: "Video description", tiktok: "TikTok bio", instagram: "Instagram bio" },
    scan: "Scan for recipes & bookings",
  },
  shortLinks: {
    eyebrow: "Short links",
    title: "Short links, no monthly cap.",
    body: "Custom back-halves, UTM tags, send iPhone and Android users to different stores, route by country — and change the destination after you’ve printed the QR.",
    cta: "Create a short link",
    panel: "Short links",
    newBtn: "+ New",
    clicks: "clicks",
    rows: [
      { dest: "tickets.luciarios.com/tour", clicks: "4,812", rule: "utm_source=ig" },
      { dest: "iOS → App Store · Android → Play", clicks: "1,306", rule: "Device routing" },
      { dest: "valefit.cl/oferta", clicks: "967", rule: "Chile only" },
    ],
  },
  analytics: {
    eyebrow: "Analytics",
    title: "Know what gets clicked.",
    body: "Views, clicks, sources and countries for every link. Export to CSV anytime.",
    last14: "Clicks · last 14 days",
    total: "8,214",
    topSources: "Top sources",
    sources: ["Instagram", "TikTok", "QR code", "Direct"],
    countries: [
      { flag: "🇦🇷", name: "Argentina", n: "3.1k" },
      { flag: "🇲🇽", name: "Mexico", n: "2.4k" },
      { flag: "🇪🇸", name: "Spain", n: "1.2k" },
    ],
  },
  domain: {
    eyebrow: "Custom domain",
    title: "Your brand in the address bar.",
    body: "Add a TXT record to verify, point a CNAME to Bitlink, and your page lives at links.yourbrand.com.",
    portfolio: "Portfolio",
    book: "Book a session",
  },
  faqTitle: "Questions",
  faqs: [
    {
      q: "Is it free?",
      a: "Yes. Link-in-bio, short links, themes, analytics, QR, email/phone capture, scheduling, locks, products, and custom domains — all included. No plans.",
    },
    {
      q: "Can I shorten a link without an account?",
      a: "Yes. Use the free URL shortener on bitlink.click, paste any link and get a short URL instantly, no sign-up. Create a free account afterwards if you want click stats.",
    },
    {
      q: "Short links too?",
      a: "Yes. Unlimited shorts with custom back-halves, UTMs, device/geo rules, editable destinations, click stats, and QR — unlike Bitly’s free cap.",
    },
    {
      q: "Custom domain?",
      a: "Yes. Verify ownership with a DNS TXT record, CNAME to Bitlink, and serve your profile on links.yourbrand.com.",
    },
    {
      q: "Can I sell products?",
      a: "Yes. Add product cards with a price label and an external checkout URL (Mercado Pago, Stripe, Gumroad…). We don’t take a cut.",
    },
    {
      q: "Do I need a website?",
      a: "No. Bitlink is your page. Put one URL on Instagram, TikTok, YouTube, or print a QR.",
    },
    {
      q: "Can I lock or schedule links?",
      a: "Yes. Password-lock the page or a link, and schedule when links appear.",
    },
    {
      q: "Can I hide the Bitlink CTA?",
      a: "No. Every public page shows “Create your Bitlink” so visitors can start their own.",
    },
  ],
  finalCta: { title: "Claim your name.", body: "No card. No plan. Your page is live in minutes." },
  footer: {
    tagline: "Link in bio + short links, free forever. No plans, no monthly caps.",
    product: "Product",
    linkInBio: "Link in bio",
    freeShortener: "Free URL shortener",
    shortAndQr: "Short links & QR",
    faq: "FAQ",
    signUp: "Sign up free",
    login: "Log in",
    guides: "Guides",
    blog: "Blog",
    note: "Example pages and photos are for illustration.",
  },
};

export type LandingCopy = typeof en;

const es: LandingCopy = {
  meta: {
    title: "Bitlink — Link en bio + links cortos, gratis para siempre",
    description:
      "Link en bio y links cortos ilimitados con métricas, QR, UTMs, embeds y temas — gratis para siempre. Sin límites mensuales.",
  },
  common: { skip: "Saltar al contenido principal", mainNav: "Navegación principal", verified: "Verificado", examplePages: "Páginas de ejemplo" },
  nav: {
    shorten: "Acortar un link",
    how: "Cómo funciona",
    product: "Producto",
    faq: "Preguntas",
    blog: "Blog",
    login: "Iniciar sesión",
    cta: "Creá tu link",
    ctaShort: "Crear link",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    menu: "Menú",
    language: "Idioma",
  },
  claim: {
    placeholder: "tunombre",
    aria: "Reservá tu usuario de Bitlink",
    idle: "Reservá tu usuario de Bitlink",
    checking: "Revisando…",
    available: "Perfecto, ese nombre está libre",
    taken: "Ya está en uso, probá con otro",
    invalid: "Usá 3 o más letras, números o _",
    claimFree: "Reservar gratis",
    getFree: "Conseguí Bitlink gratis",
  },
  hero: {
    badge: "Gratis para siempre · sin planes",
    line1: "Un link para",
    words: ["músicos", "chefs", "creadores", "coaches", "tiendas", "podcasters"],
    lead: "Tu música, videos, productos y reservas en una sola página — más links cortos, códigos QR y métricas para ver qué se clickea de verdad.",
    shortenPrompt: "¿Solo necesitás un link corto?",
    shortenLink: "Acortá una URL gratis, sin registro →",
    included: ["Links ilimitados", "Links cortos + QR", "Productos y propinas", "Dominio propio"],
  },
  shortener: {
    eyebrow: "Acortador de links gratis",
    title: "Acortá un link ahora mismo.",
    body: "Sin cuenta, sin límites y los links no vencen. Registrate gratis solo si querés ver las métricas de clics.",
    more: "Más información",
  },
  creators: {
    title: "Hecho para quienes crean cosas.",
    body: "Las páginas de abajo son ejemplos de lo que podés armar en pocos minutos.",
    showcase: ["Músicos", "Chefs", "Fotógrafos", "Coaches", "Tiendas", "DJs", "Podcasters", "Moda", "Creadores", "Startups"],
  },
  product: {
    eyebrow: "Tu página",
    title: "Mucho más que una lista de links.",
    play: {
      title: "Reproducilo ahí mismo",
      body: "Pegá un link de YouTube o Spotify y se convierte en un reproductor en tu página. Sin cambiar de app.",
      single: "Sencillo",
      videoTitle: "En vivo en Buenos Aires — show completo",
    },
    sell: {
      title: "Vendé sin tienda",
      body: "Tarjetas de producto con tu precio y link de pago. No cobramos comisión.",
      items: ["Programa de 12 semanas", "Llamada de coaching 1:1"],
      gateways: "Mercado Pago · Stripe · PayPal · Gumroad",
    },
    collections: { title: "Colecciones en grilla", body: "Agrupá links con fotos: un portfolio, un menú, un lookbook." },
    tips: {
      title: "Propinas y lista de correo",
      body: "Dejá que tus fans te apoyen y mantené el contacto, sin depender del algoritmo.",
      coffee: "Invitame un café ☕",
      emailPlaceholder: "vos@email.com",
      join: "Sumarme",
    },
    drops: {
      title: "Lanzamientos y links privados",
      body: "Programá un link para que aparezca a la hora del lanzamiento, o protegelo con contraseña.",
      merch: "Lanzamiento de merch",
      when: "Vie 18:00",
      presskit: "Presskit",
      locked: "🔒 Bloqueado",
    },
  },
  design: {
    eyebrow: "Diseño",
    title: "Que se vea como vos.",
    body: "Subí tu propio fondo, elegí tipografías y formas de botón, sumá movimiento a los links que importan — y publicalo en tu propio dominio.",
    variants: { paper: "Papel", photo: "Fondo con foto", midnight: "Medianoche", blush: "Rosado" },
    chips: ["Foto de fondo", "Píldora · redondeado · cuadrado", "Animaciones en links ✨"],
  },
  share: {
    eyebrow: "Compartí",
    title: "Donde sea que te encuentre tu gente.",
    body: "Una sola URL para cada bio y descripción de video, y un código QR para el menú, el afiche o la mesa de merch.",
    steps: [
      { title: "Reservá tu nombre", body: "Elegí bitlink.click/tunombre — toma unos segundos." },
      { title: "Sumá lo que compartís", body: "Links, videos, canciones, productos, propinas, un formulario de suscripción." },
      { title: "Ponelo en todos lados", body: "Bio, descripciones de video, un QR impreso. Y mirá cómo suben los clics." },
    ],
    cards: { qr: "Impreso en el menú", youtube: "Descripción del video", tiktok: "Bio de TikTok", instagram: "Bio de Instagram" },
    scan: "Escaneá para ver recetas y reservar",
  },
  shortLinks: {
    eyebrow: "Links cortos",
    title: "Links cortos, sin límite mensual.",
    body: "Alias personalizados, etiquetas UTM, enviá a usuarios de iPhone y Android a tiendas distintas, redirigí por país — y cambiá el destino aunque ya hayas impreso el QR.",
    cta: "Crear un link corto",
    panel: "Links cortos",
    newBtn: "+ Nuevo",
    clicks: "clics",
    rows: [
      { dest: "tickets.luciarios.com/tour", clicks: "4.812", rule: "utm_source=ig" },
      { dest: "iOS → App Store · Android → Play", clicks: "1.306", rule: "Redirección por dispositivo" },
      { dest: "valefit.cl/oferta", clicks: "967", rule: "Solo Chile" },
    ],
  },
  analytics: {
    eyebrow: "Métricas",
    title: "Sabé qué se clickea.",
    body: "Visitas, clics, orígenes y países de cada link. Exportá a CSV cuando quieras.",
    last14: "Clics · últimos 14 días",
    total: "8.214",
    topSources: "Principales orígenes",
    sources: ["Instagram", "TikTok", "Código QR", "Directo"],
    countries: [
      { flag: "🇦🇷", name: "Argentina", n: "3,1 mil" },
      { flag: "🇲🇽", name: "México", n: "2,4 mil" },
      { flag: "🇪🇸", name: "España", n: "1,2 mil" },
    ],
  },
  domain: {
    eyebrow: "Dominio propio",
    title: "Tu marca en la barra de direcciones.",
    body: "Agregá un registro TXT para verificar, apuntá un CNAME a Bitlink y tu página vive en links.tumarca.com.",
    portfolio: "Portfolio",
    book: "Reservar una sesión",
  },
  faqTitle: "Preguntas frecuentes",
  faqs: [
    {
      q: "¿Es gratis?",
      a: "Sí. Link en bio, links cortos, temas, métricas, QR, captura de emails y teléfonos, programación, bloqueos, productos y dominios propios — todo incluido. Sin planes.",
    },
    {
      q: "¿Puedo acortar un link sin cuenta?",
      a: "Sí. Usá el acortador gratis de bitlink.click, pegá cualquier link y obtenés una URL corta al instante, sin registro. Después podés crear una cuenta gratis si querés ver las métricas de clics.",
    },
    {
      q: "¿También links cortos?",
      a: "Sí. Links cortos ilimitados con alias personalizados, UTMs, reglas por dispositivo y ubicación, destinos editables, métricas de clics y QR — a diferencia del límite gratuito de Bitly.",
    },
    {
      q: "¿Dominio propio?",
      a: "Sí. Verificás que sos el dueño con un registro DNS TXT, apuntás un CNAME a Bitlink y servís tu perfil en links.tumarca.com.",
    },
    {
      q: "¿Puedo vender productos?",
      a: "Sí. Agregá tarjetas de producto con un precio y una URL de pago externa (Mercado Pago, Stripe, Gumroad…). No nos quedamos con ninguna comisión.",
    },
    {
      q: "¿Necesito un sitio web?",
      a: "No. Bitlink es tu página. Poné una sola URL en Instagram, TikTok, YouTube, o imprimí un QR.",
    },
    {
      q: "¿Puedo bloquear o programar links?",
      a: "Sí. Protegé la página o un link con contraseña y programá cuándo aparecen los links.",
    },
    {
      q: "¿Puedo ocultar el botón de Bitlink?",
      a: "No. Cada página pública muestra “Creá tu Bitlink” para que los visitantes puedan empezar la suya.",
    },
  ],
  finalCta: { title: "Reservá tu nombre.", body: "Sin tarjeta. Sin planes. Tu página lista en minutos." },
  footer: {
    tagline: "Link en bio + links cortos, gratis para siempre. Sin planes ni límites mensuales.",
    product: "Producto",
    linkInBio: "Link en bio",
    freeShortener: "Acortador de links gratis",
    shortAndQr: "Links cortos y QR",
    faq: "Preguntas frecuentes",
    signUp: "Registrate gratis",
    login: "Iniciar sesión",
    guides: "Guías",
    blog: "Blog",
    note: "Las páginas y fotos de ejemplo son solo ilustrativas.",
  },
};

const pt: LandingCopy = {
  meta: {
    title: "Bitlink — Link na bio + links curtos, grátis para sempre",
    description:
      "Link na bio e links curtos ilimitados com estatísticas, QR code, UTMs, embeds e temas — grátis para sempre. Sem limites mensais.",
  },
  common: { skip: "Pular para o conteúdo principal", mainNav: "Navegação principal", verified: "Verificado", examplePages: "Páginas de exemplo" },
  nav: {
    shorten: "Encurtar um link",
    how: "Como funciona",
    product: "Produto",
    faq: "Perguntas",
    blog: "Blog",
    login: "Entrar",
    cta: "Crie seu link",
    ctaShort: "Criar link",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    menu: "Menu",
    language: "Idioma",
  },
  claim: {
    placeholder: "seunome",
    aria: "Reserve seu usuário no Bitlink",
    idle: "Reserve seu usuário no Bitlink",
    checking: "Verificando…",
    available: "Boa escolha — esse nome está livre",
    taken: "Já está em uso — tente outro",
    invalid: "Use 3 ou mais letras, números ou _",
    claimFree: "Reservar grátis",
    getFree: "Crie seu Bitlink grátis",
  },
  hero: {
    badge: "Grátis para sempre · sem planos",
    line1: "Um link para",
    words: ["músicos", "chefs", "criadores", "coaches", "lojas", "podcasters"],
    lead: "Sua música, vídeos, produtos e agendamentos em uma só página — além de links curtos, QR codes e estatísticas para ver o que realmente recebe cliques.",
    shortenPrompt: "Só precisa de um link curto?",
    shortenLink: "Encurte uma URL grátis, sem cadastro →",
    included: ["Links ilimitados", "Links curtos + QR", "Produtos e gorjetas", "Domínio próprio"],
  },
  shortener: {
    eyebrow: "Encurtador de links grátis",
    title: "Encurte um link agora mesmo.",
    body: "Sem conta, sem limites e os links nunca expiram. Cadastre-se grátis só se quiser ver as estatísticas de cliques.",
    more: "Saiba mais",
  },
  creators: {
    title: "Feito para quem cria coisas.",
    body: "As páginas abaixo são exemplos do que você pode montar em poucos minutos.",
    showcase: ["Músicos", "Chefs", "Fotógrafos", "Coaches", "Lojas", "DJs", "Podcasters", "Moda", "Criadores", "Startups"],
  },
  product: {
    eyebrow: "Sua página",
    title: "Muito mais que uma lista de links.",
    play: {
      title: "Toque ali mesmo",
      body: "Cole um link do YouTube ou do Spotify e ele vira um player na sua página. Sem trocar de app.",
      single: "Single",
      videoTitle: "Ao vivo em Buenos Aires — show completo",
    },
    sell: {
      title: "Venda sem loja",
      body: "Cartões de produto com seu preço e link de pagamento. Não cobramos comissão.",
      items: ["Programa de 12 semanas", "Sessão de coaching 1:1"],
      gateways: "Mercado Pago · Stripe · PayPal · Hotmart",
    },
    collections: { title: "Coleções em grade", body: "Agrupe links com fotos: um portfólio, um cardápio, um lookbook." },
    tips: {
      title: "Gorjetas e lista de e-mails",
      body: "Deixe seus fãs apoiarem você e mantenha o contato, longe do algoritmo.",
      coffee: "Me pague um café ☕",
      emailPlaceholder: "voce@email.com",
      join: "Entrar",
    },
    drops: {
      title: "Lançamentos e links privados",
      body: "Agende um link para entrar no ar na hora do lançamento, ou proteja com senha.",
      merch: "Lançamento de merch",
      when: "Sex 18:00",
      presskit: "Press kit",
      locked: "🔒 Bloqueado",
    },
  },
  design: {
    eyebrow: "Design",
    title: "Deixe com a sua cara.",
    body: "Envie seu próprio fundo, escolha fontes e formatos de botão, adicione movimento aos links que importam — e publique no seu próprio domínio.",
    variants: { paper: "Papel", photo: "Fundo com foto", midnight: "Meia-noite", blush: "Rosado" },
    chips: ["Foto de fundo", "Pílula · arredondado · quadrado", "Animações nos links ✨"],
  },
  share: {
    eyebrow: "Compartilhe",
    title: "Onde seu público estiver.",
    body: "Uma única URL para cada bio e descrição de vídeo, e um QR code para o cardápio, o cartaz ou a mesa de merch.",
    steps: [
      { title: "Reserve seu nome", body: "Escolha bitlink.click/seunome — leva poucos segundos." },
      { title: "Adicione o que você compartilha", body: "Links, vídeos, músicas, produtos, gorjetas, um formulário de inscrição." },
      { title: "Coloque em todo lugar", body: "Bio, descrições de vídeo, um QR impresso. Depois é só acompanhar os cliques." },
    ],
    cards: { qr: "Impresso no cardápio", youtube: "Descrição do vídeo", tiktok: "Bio do TikTok", instagram: "Bio do Instagram" },
    scan: "Escaneie para ver receitas e reservar",
  },
  shortLinks: {
    eyebrow: "Links curtos",
    title: "Links curtos, sem limite mensal.",
    body: "Apelidos personalizados, tags UTM, envie usuários de iPhone e Android para lojas diferentes, redirecione por país — e mude o destino mesmo depois de imprimir o QR.",
    cta: "Criar um link curto",
    panel: "Links curtos",
    newBtn: "+ Novo",
    clicks: "cliques",
    rows: [
      { dest: "tickets.luciarios.com/tour", clicks: "4.812", rule: "utm_source=ig" },
      { dest: "iOS → App Store · Android → Play", clicks: "1.306", rule: "Redirecionamento por dispositivo" },
      { dest: "valefit.cl/oferta", clicks: "967", rule: "Somente Chile" },
    ],
  },
  analytics: {
    eyebrow: "Estatísticas",
    title: "Saiba o que recebe cliques.",
    body: "Visualizações, cliques, origens e países de cada link. Exporte para CSV quando quiser.",
    last14: "Cliques · últimos 14 dias",
    total: "8.214",
    topSources: "Principais origens",
    sources: ["Instagram", "TikTok", "QR code", "Direto"],
    countries: [
      { flag: "🇧🇷", name: "Brasil", n: "3,1 mil" },
      { flag: "🇦🇷", name: "Argentina", n: "2,4 mil" },
      { flag: "🇵🇹", name: "Portugal", n: "1,2 mil" },
    ],
  },
  domain: {
    eyebrow: "Domínio próprio",
    title: "Sua marca na barra de endereço.",
    body: "Adicione um registro TXT para verificar, aponte um CNAME para o Bitlink e sua página fica em links.suamarca.com.",
    portfolio: "Portfólio",
    book: "Agendar uma sessão",
  },
  faqTitle: "Perguntas frequentes",
  faqs: [
    {
      q: "É grátis?",
      a: "Sim. Link na bio, links curtos, temas, estatísticas, QR code, captura de e-mail e telefone, agendamento, bloqueios, produtos e domínios próprios — tudo incluído. Sem planos.",
    },
    {
      q: "Posso encurtar um link sem criar conta?",
      a: "Sim. Use o encurtador grátis do bitlink.click, cole qualquer link e receba uma URL curta na hora, sem cadastro. Depois, se quiser ver as estatísticas de cliques, é só criar uma conta grátis.",
    },
    {
      q: "Também tem links curtos?",
      a: "Sim. Links curtos ilimitados com apelidos personalizados, UTMs, regras por dispositivo e localização, destinos editáveis, estatísticas de cliques e QR code — diferente do limite gratuito do Bitly.",
    },
    {
      q: "Posso usar meu domínio?",
      a: "Sim. Você verifica a propriedade com um registro DNS TXT, aponta um CNAME para o Bitlink e publica seu perfil em links.suamarca.com.",
    },
    {
      q: "Posso vender produtos?",
      a: "Sim. Adicione cartões de produto com um preço e uma URL de pagamento externa (Mercado Pago, Stripe, Hotmart…). Não ficamos com nenhuma comissão.",
    },
    {
      q: "Preciso de um site?",
      a: "Não. O Bitlink é a sua página. Coloque uma única URL no Instagram, TikTok, YouTube ou imprima um QR code.",
    },
    {
      q: "Posso bloquear ou agendar links?",
      a: "Sim. Proteja a página ou um link com senha e agende quando os links aparecem.",
    },
    {
      q: "Posso esconder o botão do Bitlink?",
      a: "Não. Toda página pública mostra “Crie seu Bitlink” para que os visitantes possam começar a sua.",
    },
  ],
  finalCta: { title: "Reserve seu nome.", body: "Sem cartão. Sem planos. Sua página no ar em minutos." },
  footer: {
    tagline: "Link na bio + links curtos, grátis para sempre. Sem planos, sem limites mensais.",
    product: "Produto",
    linkInBio: "Link na bio",
    freeShortener: "Encurtador de links grátis",
    shortAndQr: "Links curtos e QR code",
    faq: "Perguntas frequentes",
    signUp: "Cadastre-se grátis",
    login: "Entrar",
    guides: "Guias",
    blog: "Blog",
    note: "As páginas e fotos de exemplo são apenas ilustrativas.",
  },
};

export const LANDING: Record<SiteLang, LandingCopy> = { en, es, pt };

/* ------------------------------------------------------------------ */
/* Example profiles shown in the phone mockups (text overlays by id).  */
/* ------------------------------------------------------------------ */

export type BlockText = {
  title?: string;
  description?: string;
  artist?: string;
  prompt?: string;
  label?: string;
  cta?: string;
  placeholder?: string;
  itemTitles?: string[];
};

export type ExampleText = { tag: string; role: string; bio: string; stat: string; blocks: BlockText[] };

export const EXAMPLES_TEXT: Record<Exclude<SiteLang, "en">, Record<string, ExampleText>> = {
  es: {
    music: {
      tag: "Música",
      role: "Cantautora",
      bio: "Mi nuevo sencillo “Marea” ya salió 🌊 Gira 2026",
      stat: "+2,4 mil reproducciones esta semana",
      blocks: [
        {},
        { title: "Entradas de la gira — Buenos Aires" },
        { title: "EP Sesiones acústicas", description: "Descarga digital · 5 temas" },
        { label: "Invitame un café ☕" },
      ],
    },
    chef: {
      tag: "Comida",
      role: "Chef y creador de recetas",
      bio: "Recetas fáciles para la semana · Cenas privadas en CDMX",
      stat: "38 reservas de cenas",
      blocks: [
        { title: "Tinga de pollo en 15 min" },
        { title: "Recetas", itemTitles: ["Poke bowl", "Pastel de frutos rojos"] },
        { title: "Recetario de entre semana", description: "PDF · 60 recetas" },
        { title: "Reservá una cena privada" },
      ],
    },
    photo: {
      tag: "Fotografía",
      role: "Fotógrafa de viajes",
      bio: "Cazando luz en lugares lejanos 📷",
      stat: "312 nuevos suscriptores",
      blocks: [
        { title: "Portfolio", itemTitles: ["Bosque", "Equipo"] },
        { title: "Presets de Lightroom", description: "12 looks de película · descarga inmediata" },
        { title: "Reservá una sesión" },
        { prompt: "Carta mensual de fotos", cta: "Sumarme", placeholder: "vos@email.com" },
      ],
    },
    fitness: {
      tag: "Fitness",
      role: "Entrenadora de fuerza",
      bio: "Más fuerte en 20 min al día. Coaching online 🇨🇱",
      stat: "US$ 1.240 en ventas",
      blocks: [
        { title: "Programa de 12 semanas", description: "Entrenamientos + guía de comidas" },
        { title: "Coaching 1:1 — postulate" },
        { title: "Cuerpo completo en 20 min" },
        { title: "Escribime por WhatsApp" },
      ],
    },
  },
  pt: {
    music: {
      tag: "Música",
      role: "Cantora e compositora",
      bio: "Meu novo single “Marea” já saiu 🌊 Turnê 2026",
      stat: "+2,4 mil plays esta semana",
      blocks: [
        {},
        { title: "Ingressos da turnê — Buenos Aires" },
        { title: "EP Sessões acústicas", description: "Download digital · 5 faixas" },
        { label: "Me pague um café ☕" },
      ],
    },
    chef: {
      tag: "Culinária",
      role: "Chef e criador de receitas",
      bio: "Receitas fáceis para o dia a dia · Jantares privados na Cidade do México",
      stat: "38 reservas de jantar",
      blocks: [
        { title: "Tinga de frango em 15 min" },
        { title: "Receitas", itemTitles: ["Poke bowl", "Bolo de frutas vermelhas"] },
        { title: "Livro de receitas do dia a dia", description: "PDF · 60 receitas" },
        { title: "Reserve um jantar privado" },
      ],
    },
    photo: {
      tag: "Fotografia",
      role: "Fotógrafa de viagem",
      bio: "Caçando luz em lugares distantes 📷",
      stat: "312 novos inscritos",
      blocks: [
        { title: "Portfólio", itemTitles: ["Floresta", "Equipamento"] },
        { title: "Presets de Lightroom", description: "12 looks de filme · download imediato" },
        { title: "Agende uma sessão" },
        { prompt: "Carta mensal de fotos", cta: "Entrar", placeholder: "voce@email.com" },
      ],
    },
    fitness: {
      tag: "Fitness",
      role: "Treinadora de força",
      bio: "Mais forte em 20 min por dia. Coaching online 🇨🇱",
      stat: "US$ 1.240 em vendas",
      blocks: [
        { title: "Programa de 12 semanas", description: "Treinos + guia alimentar" },
        { title: "Coaching 1:1 — inscreva-se" },
        { title: "Corpo inteiro em 20 min" },
        { title: "Me chame no WhatsApp" },
      ],
    },
  },
};
