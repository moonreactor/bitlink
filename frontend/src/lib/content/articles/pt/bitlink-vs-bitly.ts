import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "vs-bitly",
  slug: "bitlink-vs-bitly",
  category: "comparativas",
  title: "Bitlink vs Bitly (2026): links curtos grátis e ilimitados vs um plano grátis de 5 links por mês",
  seoTitle: "Bitlink vs Bitly (2026): plano grátis e funcionalidades",
  description:
    "Bitlink vs Bitly: o plano grátis do Bitly permite 5 links curtos e 2 QR codes por mês; o Bitlink é ilimitado e grátis, com UTMs, regras de redirecionamento e estatísticas.",
  published: "2026-11-12",
  updated: "2026-11-12",
  keywords: ["bitlink vs bitly", "alternativa ao bitly", "limites plano grátis bitly", "preços bitly", "encurtador de links grátis ilimitado", "bitly vs"],
  tldr:
    "Na página de preços do Bitly, o **plano grátis permite 5 links curtos, 2 QR codes e 3 back-halves personalizados por mês**, sem histórico de cliques e sem construtor de UTMs; o construtor de UTMs começa no **Core (US$ 10/mês, cobrança anual)**. O **Bitlink** não tem limites mensais e inclui de graça campos UTM, regras por dispositivo e país, QR code e estatísticas de cliques, além de uma página de link na bio.",
  takeaways: [
    "Bitly Free: 5 links, 2 QR codes e 3 back-halves por mês; sem histórico de cliques; sem construtor de UTMs.",
    "Os planos pagos do Bitly custam US$ 10, 29 e 199 por mês (tarifas de cobrança anual da página deles).",
    "Bitlink: links curtos ilimitados, UTMs, regras por dispositivo e país, QR code e estatísticas, tudo grátis.",
    "O Bitly mira equipes grandes e empresas; o Bitlink, criadores e pequenos negócios.",
  ],
  cover: { src: "/landing/1460925895917-afdab827c52f-360x440.webp", alt: "Notebook exibindo um painel de análise com gráficos de cliques" },
  body: [
    {
      type: "callout",
      tone: "note",
      title: "Como comparamos",
      text: "Nós somos o Bitlink, então esta página puxa para o que fazemos melhor. Todos os números do Bitly vêm da própria página de preços deles, consultada em 12 de novembro de 2026 (os preços são as tarifas de cobrança anual que constam ali). Os planos mudam: confira antes de comprar.",
    },
    { type: "h2", text: "A versão curta" },
    {
      type: "p",
      text: "O Bitly é um dos encurtadores mais conhecidos e é construído em torno de **cotas mensais**: cada plano inclui uma quantidade fixa de links curtos, QR codes e back-halves personalizados por mês. Se a cota acabar no meio de uma campanha, você espera ou paga. O Bitlink **não tem cotas**: você cria todos os links curtos de que precisar.",
    },
    { type: "h2", text: "Os planos do Bitly, lado a lado" },
    {
      type: "table",
      caption: "Fonte: bitly.com/pages/pricing, consultada em 2026-11-12",
      head: ["", "Free", "Core", "Growth", "Premium"],
      rows: [
        ["Preço", "US$ 0 (consta “com anúncios”)", "US$ 10/mês (só anual)", "US$ 29/mês", "US$ 199/mês"],
        ["Links curtos por mês", "5", "100", "500", "3.000"],
        ["QR codes por mês", "2", "5", "10", "200"],
        ["Back-halves personalizados por mês", "3", "100", "500", "3.000"],
        ["Histórico de dados de cliques", "Nenhum", "30 dias", "4 meses", "1 ano"],
        ["Construtor de UTMs", "Não", "Sim", "Sim", "Sim"],
        ["Domínio próprio / links de marca", "Não", "Não", "Sim", "Sim"],
      ],
    },
    {
      type: "p",
      text: "A página deles também lista o roteamento dinâmico por país, plataforma ou dispositivo como indisponível no Free, no Core e no Growth, e os dados de cliques por cidade e tipo de dispositivo apenas no Premium.",
    },
    { type: "h2", text: "O Bitlink ao lado do Bitly" },
    {
      type: "table",
      head: ["Funcionalidade", "Bitlink (grátis)", "Bitly Free", "Bitly Core (US$ 10/mês)"],
      rows: [
        ["Links curtos", "Ilimitados", "5 / mês", "100 / mês"],
        ["QR codes", "Ilimitados, PNG/SVG, cores, logo", "2 / mês", "5 / mês"],
        ["Back-halves personalizados", "Ilimitados", "3 / mês", "100 / mês"],
        ["Campos UTM", "Sim", "Não", "Sim"],
        ["Destinos celular vs computador", "Sim", "Não", "Não consta"],
        ["Destinos por país", "Sim", "Não", "Não consta"],
        ["Análise de cliques", "Cliques, países, dispositivos, gráfico diário + CSV", "Sem histórico", "30 dias"],
        ["Página de link na bio com produtos", "Sim, incluída", "Não é um item à parte", "Não é um item à parte"],
        ["Custo", "US$ 0", "US$ 0", "US$ 10/mês"],
      ],
    },
    { type: "h2", text: "Onde o Bitlink se sai melhor" },
    {
      type: "ul",
      items: [
        "**Sem cotas.** Lance uma campanha com 50 links curtos e 50 QR codes em uma tarde, de graça.",
        "**As regras de redirecionamento já vêm incluídas.** Envie quem entra pelo celular e pelo computador para lugares diferentes, ou direcione por país, sem trocar de plano. Veja [links curtos com regras](/pt/blog/novidade-links-curtos).",
        "**A análise de dados não é um extra pago.** Cada link mostra cliques, países e dispositivos.",
        "**QR codes editáveis sem limite mensal.** Imprima com tranquilidade: [como funcionam os QR codes editáveis](/pt/blog/codigo-qr-editavel).",
        "**Uma página de link na bio e um perfil pronto para vender** na mesma conta.",
      ],
    },
    { type: "h2", text: "Onde o Bitly pode compensar mais" },
    {
      type: "ul",
      items: [
        "**Domínios curtos de marca no seu próprio domínio.** O Bitly lista links de marca a partir do plano Growth. No Bitlink, os links curtos ficam em bitlink.click (o seu domínio próprio vale para a página de perfil).",
        "**Necessidades corporativas**: equipes grandes, contratos sob medida e acompanhamento avançado.",
        "**Histórico longo de cliques em planos pagos**, até um ano no Premium.",
      ],
    },
    { type: "h2", text: "Como migrar em poucos passos" },
    {
      type: "steps",
      name: "Como migrar os seus links curtos do Bitly para o Bitlink",
      items: [
        { title: "Liste os seus links ativos", text: "Anote ou exporte os links do Bitly que você ainda usa e os respectivos destinos." },
        { title: "Crie-os no Bitlink", text: "No [Bitlink](/register), Short links → New. Escolha um back-half, cole o destino e adicione UTMs se precisar." },
        { title: "Não quebre os QR codes impressos", text: "Os links e QR codes que você já imprimiu continuam apontando para o Bitly. Crie novos no Bitlink para as próximas impressões." },
        { title: "Atualize onde você compartilha", text: "Use os seus novos links em bios, e-mails e campanhas daqui para frente." },
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Cuidado com os QR codes existentes",
      text: "Os links do Bitly que já circulam dependem da sua conta do Bitly. Não a exclua nem faça downgrade de plano até ter substituído tudo o que você usa.",
    },
    { type: "cta", title: "Links curtos ilimitados, de graça", text: "Sem cota mensal. UTMs, regras de redirecionamento, QR code e estatísticas incluídos." },
  ],
  faqs: [
    { q: "Quais são os limites do plano grátis do Bitly?", a: "Segundo a página de preços do Bitly, o plano grátis inclui 5 links curtos, 2 QR codes e 3 back-halves personalizados por mês, sem histórico de cliques e sem construtor de UTMs." },
    { q: "Existe uma alternativa grátis ao Bitly sem limites?", a: "Sim. O Bitlink permite criar links curtos e QR codes ilimitados, com UTMs, regras por dispositivo e país e análise de cliques, de graça." },
    { q: "O Bitlink oferece domínios curtos de marca?", a: "Os links curtos usam bitlink.click. O domínio próprio está disponível para a sua página de perfil, não para os links curtos." },
    { q: "Os meus QR codes do Bitly vão continuar funcionando?", a: "Os códigos existentes continuam funcionando enquanto a sua conta do Bitly estiver ativa. Crie novos no Bitlink para as próximas campanhas." },
  ],
  related: ["encurtador-de-links-gratis-sem-limite", "alternativas-gratis-ao-bitly", "o-que-sao-parametros-utm"],
};

export default article;
