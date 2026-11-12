import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "link-en-bio-para-musicos",
  slug: "link-na-bio-para-musicos",
  category: "casos-de-uso",
  title: "Link na bio para músicos e bandas: como montar uma página que vende ingressos e conquista ouvintes",
  seoTitle: "Link na bio para músicos e bandas: guia prático",
  description:
    "O que colocar no link na bio de um músico ou banda: player do Spotify, YouTube, ingressos, merch, press kit e newsletter. Com estrutura recomendada.",
  published: "2026-11-10",
  keywords: ["link na bio para músicos", "link na bio banda", "smart link música", "página para músicos", "spotify link na bio"],
  tldr:
    "O link na bio de um músico precisa fazer três coisas: **fazer ouvir** (player do Spotify ou do YouTube incorporado), **vender** (ingressos e merch) e **construir comunidade** (newsletter ou lista do WhatsApp). Organize a página conforme o momento: lançamento, turnê ou entre ciclos.",
  takeaways: [
    "No topo: o lançamento ou a data mais próxima.",
    "Incorpore Spotify e YouTube para que ouçam sem sair da página.",
    "Links curtos com UTM para medir cada flyer ou story.",
    "Press kit com senha para imprensa e produtores.",
  ],
  cover: { src: "/landing/1516280440614-37939bbacd81-600x300.webp", alt: "Microfone em um pedestal em um palco com luz quente ao fundo" },
  body: [
    { type: "h2", text: "Estrutura recomendada" },
    {
      type: "ol",
      items: [
        "**Lançamento atual**: player do Spotify ou vídeo do YouTube incorporado.",
        "**Próximas datas**: ingressos, com o show mais próximo primeiro.",
        "**Merch**: cartões de produto com preço e link de pagamento.",
        "**Newsletter ou comunidade**: formulário de e-mail para avisar sobre shows na sua cidade.",
        "**Plataformas**: Spotify, Apple Music, YouTube, Bandcamp, SoundCloud.",
        "**Contato e press kit**: e-mail de booking e press kit (pode ficar com senha).",
        "**Gorjetas**: “Apoie a música ☕” com Mercado Pago ou PayPal.",
      ],
    },
    { type: "h2", text: "Organize a página conforme o momento" },
    {
      type: "table",
      head: ["Momento", "Primeiro link", "Extra"],
      rows: [
        ["Antes do lançamento", "Pre-save ou teaser", "Link agendado para a música aparecer no dia da estreia"],
        ["Semana do lançamento", "Player da música nova", "Videoclipe e letra"],
        ["Turnê", "Ingressos da próxima data", "Link curto por cidade com regras por país"],
        ["Entre ciclos", "Newsletter", "Merch e catálogo"],
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Um link por cidade",
      text: "Para uma turnê, crie links curtos como `bitlink.click/turne-sp` e `bitlink.click/turne-curitiba`. Use-os nos flyers de cada cidade e você vai saber qual divulgação funcionou.",
    },
    { type: "h2", text: "Como montar em 10 minutos" },
    {
      type: "steps",
      name: "Como montar um link na bio para músicos",
      items: [
        { title: "Crie a sua página", text: "Cadastre-se no [Bitlink](/register) com o seu nome artístico." },
        { title: "Cole o seu último lançamento", text: "Um link do Spotify ou do YouTube vira um player dentro da página." },
        { title: "Adicione datas e merch", text: "Links para a bilheteria e cartões de produto para camisetas, vinis ou discos." },
        { title: "Ative a newsletter", text: "Em Settings, ative o formulário de e-mail para montar a sua lista." },
        { title: "Escolha o visual", text: "Use a capa do disco como fundo e as cores da estética do lançamento. Você pode incluir música de fundo." },
        { title: "Imprima o QR code", text: "Para a mesa de merch e para os flyers, com a sua foto no centro." },
      ],
    },
    { type: "h2", text: "O que medir" },
    {
      type: "ul",
      items: [
        "**Cliques no player e nas plataformas**: quão bem o lançamento converte.",
        "**Países e cidades de origem**: onde você tem público, para planejar datas.",
        "**Cliques em ingressos por link curto**: qual flyer ou story vende mais.",
        "**Novos inscritos**: a sua comunidade própria, fora do algoritmo.",
      ],
    },
    { type: "p", text: "Mais ideias em [métricas do seu link na bio](/pt/blog/metricas-link-na-bio)." },
    { type: "cta", title: "Sua página de artista, de graça", text: "Player, ingressos, merch e newsletter em um único link." },
  ],
  faqs: [
    { q: "Posso colocar um player do Spotify no meu link na bio?", a: "Sim. No Bitlink você cola o link do Spotify ou do YouTube e ele é exibido como player dentro da sua página." },
    { q: "Como compartilho o press kit só com a imprensa?", a: "Adicione o link do press kit e proteja-o com senha; compartilhe a senha apenas com quem for necessário." },
    { q: "Posso vender merch sem loja?", a: "Sim, com cartões de produto que levam ao seu link de pagamento. Veja o guia para vender sem loja virtual." },
  ],
  related: ["como-colocar-link-no-tiktok", "vender-no-instagram-sem-loja", "codigo-qr-editavel"],
};

export default article;
