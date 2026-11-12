import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "que-son-los-parametros-utm",
  slug: "o-que-sao-parametros-utm",
  category: "guias",
  title: "O que são parâmetros UTM e como usá-los nos seus links (com exemplos)",
  seoTitle: "O que são parâmetros UTM e como usá-los",
  description:
    "Guia simples de UTMs: o que são utm_source, utm_medium e utm_campaign, como montá-los, erros comuns e como adicioná-los a um link curto em segundos.",
  published: "2026-11-07",
  keywords: ["parâmetros utm", "o que são utm", "utm_source", "utm_campaign", "utm google analytics", "links com utm"],
  tldr:
    "Os **parâmetros UTM** são etiquetas adicionadas ao final de uma URL (por exemplo `?utm_source=instagram&utm_medium=social&utm_campaign=lancamento`) para que ferramentas como o **Google Analytics** saibam de onde veio cada visita. Os três obrigatórios na prática são **source**, **medium** e **campaign**.",
  takeaways: [
    "utm_source = quem envia a visita (instagram, newsletter).",
    "utm_medium = o tipo de canal (social, email, qr, cpc).",
    "utm_campaign = a campanha (black-friday-2026).",
    "Use sempre letras minúsculas e hífens; documente a convenção.",
  ],
  cover: { src: "/landing/1517836357463-d25dfeac3438-400x225.webp", alt: "Pessoa levantando uma barra com anilhas em uma academia" },
  body: [
    { type: "h2", text: "O que é um UTM" },
    {
      type: "p",
      text: "UTM vem de *Urchin Tracking Module*, a ferramenta que o Google comprou e transformou no Google Analytics. Hoje é um padrão: quase todas as plataformas de análise leem esses parâmetros. Eles não mudam o destino do link; apenas adicionam informação para medir.",
    },
    { type: "h2", text: "Os cinco parâmetros UTM" },
    {
      type: "table",
      head: ["Parâmetro", "O que indica", "Exemplo"],
      rows: [
        ["`utm_source`", "A fonte específica do tráfego", "instagram, tiktok, newsletter, google"],
        ["`utm_medium`", "O tipo de canal", "social, email, qr, cpc, referral"],
        ["`utm_campaign`", "A campanha ou ação", "lancamento-mare, black-friday-2026"],
        ["`utm_term`", "Palavra-chave (principalmente em anúncios de busca)", "tenis-de-corrida"],
        ["`utm_content`", "Variante do conteúdo ou criativo", "story-1, botao-azul, video-a"],
      ],
    },
    { type: "h2", text: "Exemplo real" },
    {
      type: "p",
      text: "Uma coach de fitness lança um programa de 12 semanas e o divulga no Instagram, na sua newsletter e com um QR code na academia. Para saber qual canal vende mais, ela cria três links:",
    },
    {
      type: "ul",
      items: [
        "Instagram: `...?utm_source=instagram&utm_medium=social&utm_campaign=programa-12-semanas`",
        "Newsletter: `...?utm_source=newsletter&utm_medium=email&utm_campaign=programa-12-semanas`",
        "QR code na academia: `...?utm_source=academia&utm_medium=qr&utm_campaign=programa-12-semanas`",
      ],
    },
    {
      type: "p",
      text: "No Google Analytics, filtrando pela campanha `programa-12-semanas`, ela vê quantas visitas e compras cada fonte trouxe.",
    },
    { type: "h2", text: "Como adicionar UTMs sem escrever a URL à mão" },
    {
      type: "p",
      text: "URLs com UTM são longas e feias para compartilhar. A solução é combiná-las com um **link curto**: o link visível é `bitlink.click/programa` e, por trás, ele redireciona para a URL com todos os parâmetros.",
    },
    {
      type: "steps",
      name: "Como criar um link curto com UTMs no Bitlink",
      items: [
        { title: "Novo link curto", text: "No seu painel, abra Short links → New." },
        { title: "Destino", text: "Cole a URL da sua página de vendas, sem UTMs." },
        { title: "Preencha os UTMs", text: "Source, medium e campaign (e term ou content, se usar). O Bitlink os adiciona sozinho." },
        { title: "Um link por canal", text: "Repita com outro final de link para cada canal: `/programa-ig`, `/programa-mail`, `/programa-qr`." },
        { title: "Compare", text: "Veja os cliques no Bitlink e as conversões na sua ferramenta de análise." },
      ],
    },
    { type: "h2", text: "Erros comuns com UTMs" },
    {
      type: "ol",
      items: [
        "**Misturar maiúsculas e minúsculas**: `Instagram` e `instagram` contam como fontes diferentes. Use tudo em minúsculas.",
        "**Usar UTMs em links internos** do seu próprio site: eles quebram a atribuição da visita original.",
        "**Não ter uma convenção**: anote em uma planilha quais valores a sua equipe usa.",
        "**Espaços e acentos**: troque-os por hífens (`dia-dos-pais`, não `dia dos pais`).",
        "**Esquecer o medium**: sem `utm_medium`, muitas ferramentas agrupam o tráfego de forma errada.",
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "E no link na bio?",
      text: "A sua página do Bitlink já registra de qual rede vem cada visita. Os UTMs são mais úteis nos links que saem da sua página para a sua loja ou o seu site.",
    },
    { type: "cta", title: "Links curtos com UTMs incluídos", text: "Preencha os campos e o Bitlink monta a URL para você." },
  ],
  faqs: [
    { q: "Os UTMs afetam o SEO?", a: "Eles não melhoram nem pioram o posicionamento. Só evite usá-los em links internos do seu próprio site e garanta que as suas páginas tenham URL canônica." },
    { q: "Quais UTMs são obrigatórios?", a: "Tecnicamente nenhum, mas, na prática, use sempre utm_source, utm_medium e utm_campaign." },
    { q: "Onde vejo os resultados dos UTMs?", a: "Na sua ferramenta de análise, por exemplo no Google Analytics 4, nos relatórios de aquisição de tráfego." },
    { q: "Posso mudar os UTMs de um link já compartilhado?", a: "Se você usa um link curto do Bitlink, sim: você edita os UTMs e o link compartilhado continua o mesmo." },
  ],
  related: ["novidade-links-curtos", "metricas-link-na-bio", "encurtador-de-links-gratis-sem-limite"],
};

export default article;
