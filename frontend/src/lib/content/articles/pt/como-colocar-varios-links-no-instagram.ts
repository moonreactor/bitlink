import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "como-poner-varios-links-en-instagram",
  slug: "como-colocar-varios-links-no-instagram",
  category: "guias",
  title: "Como colocar vários links no Instagram (bio, stories e Reels) passo a passo",
  seoTitle: "Como colocar vários links no Instagram passo a passo",
  description:
    "Formas de compartilhar mais de um link no Instagram: os links nativos do perfil, o sticker de link nos stories e uma página de link na bio. Passo a passo.",
  published: "2026-11-06",
  keywords: ["vários links no instagram", "como colocar links no instagram", "link na bio instagram", "sticker de link", "adicionar link instagram"],
  tldr:
    "O Instagram permite adicionar **até 5 links** no perfil, mas a bio mostra só o primeiro e os demais ficam escondidos atrás de um menu. A forma mais eficaz de compartilhar vários links é colocar **um único link na bio** (por exemplo, `bitlink.click/seunome`) que abra uma página com todos os seus destinos, e complementar com o **sticker de link** nos stories.",
  takeaways: [
    "Perfil: Editar perfil → Links → Adicionar link externo.",
    "Stories: sticker “Link”, disponível para todas as contas.",
    "Reels e posts: o texto não é clicável; diga “link na bio”.",
    "Uma página de link na bio organiza tudo e ainda dá estatísticas.",
  ],
  cover: { src: "/landing/1554080353-a576cf803bda-900x1100.webp", alt: "Fotógrafa tirando uma foto com a câmera na rua à noite" },
  body: [
    { type: "h2", text: "Onde dá para colocar links no Instagram" },
    {
      type: "table",
      head: ["Lugar", "Link clicável?", "Observações"],
      rows: [
        ["Bio do perfil", "Sim", "Até 5 links; na bio aparece o primeiro e “e mais X”"],
        ["Stories", "Sim", "Com o sticker “Link”; dura 24 h, a menos que você salve nos destaques"],
        ["Legenda de posts e Reels", "Não", "A URL escrita no texto não é clicável"],
        ["Mensagens diretas", "Sim", "Útil para respostas automáticas ou dúvidas"],
        ["Botões de ação (contas profissionais)", "Sim", "Reservar, pedir comida etc., com parceiros compatíveis"],
      ],
    },
    {
      type: "callout",
      tone: "note",
      text: "O Instagram muda suas funções com frequência, e elas podem variar por país ou tipo de conta. Confira o app se vir algo diferente.",
    },
    { type: "h2", text: "Opção 1: os links nativos do perfil" },
    {
      type: "p",
      text: "No app: **Editar perfil → Links → Adicionar link externo**. Você pode cadastrar vários, mas a bio mostra só o primeiro; para ver o resto é preciso tocar em “e mais X”. Muita gente não faz isso, então o segundo, o terceiro e o quarto links recebem poucos cliques. Além disso, o Instagram não informa de forma detalhada quantos cliques cada um recebeu.",
    },
    { type: "h2", text: "Opção 2: uma página de link na bio (a mais eficaz)" },
    {
      type: "p",
      text: "Você coloca **um único link** na bio e ele abre uma página com todos os seus botões, na ordem que quiser. É o que a maioria dos criadores e marcas faz. Se você não sabe bem o que é, leia [o que é link na bio](/pt/blog/o-que-e-link-na-bio).",
    },
    {
      type: "steps",
      name: "Como colocar vários links no Instagram com um link na bio",
      items: [
        { title: "Crie a sua página", text: "Cadastre-se de graça no [Bitlink](/register) e escolha o seu nome, de preferência o mesmo @ do Instagram." },
        { title: "Adicione seus links", text: "Loja, WhatsApp, último Reel, YouTube, newsletter. Coloque o mais importante no topo." },
        { title: "Copie o seu link", text: "Por exemplo, `bitlink.click/seunome`." },
        { title: "Cole no Instagram", text: "Editar perfil → Links → Adicionar link externo → cole a URL e dê um título como “Todos os meus links”." },
        { title: "Deixe-o em primeiro", text: "Se você tiver vários links nativos, garanta que o da sua página fique em primeiro, que é o que aparece na bio." },
      ],
    },
    { type: "h2", text: "Opção 3: o sticker de link nos stories" },
    {
      type: "p",
      text: "Em um story, toque no ícone de stickers e escolha **Link**. Cole a URL e personalize o texto do sticker. Para campanhas pontuais vale usar um **link curto com UTM** (`bitlink.click/drop-ig`) e assim medir quantos cliques vieram daquele story. Veja [o que são parâmetros UTM](/pt/blog/o-que-sao-parametros-utm).",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Salve nos destaques",
      text: "Um story com link salvo nos destaques (“Comprar”, “Agendar”) funciona como um segundo link permanente no seu perfil.",
    },
    { type: "h2", text: "Como conseguir mais cliques vindos do Instagram" },
    {
      type: "ul",
      items: [
        "**Chamada para ação na bio**: “👇 Ingressos e merch” acima do link.",
        "**Mencione o link** no Reel e na legenda: “link na bio”.",
        "**Reordene conforme o momento**: em um lançamento, o lançamento vai em primeiro.",
        "**Olhe as origens**: nas estatísticas do Bitlink você vê quantas pessoas chegam do Instagram em comparação com outras redes.",
      ],
    },
    { type: "cta", title: "Um link para toda a sua bio do Instagram", text: "Crie a sua página de graça e comece a medir o que é clicado." },
  ],
  faqs: [
    { q: "Quantos links dá para colocar na bio do Instagram?", a: "O Instagram permite cadastrar até 5 links no perfil, mas na bio só o primeiro aparece. Por isso vale a pena que esse primeiro seja uma página de link na bio." },
    { q: "Dá para colocar um link clicável em um Reel?", a: "Não na legenda. Use o link da bio, o sticker dos stories ou envie o link por mensagem direta." },
    { q: "Preciso de uma conta profissional para colocar links?", a: "Não. Qualquer conta pode adicionar links ao perfil e usar o sticker de link nos stories." },
    { q: "O Instagram penaliza links de link na bio?", a: "Não há evidência de que um link na bio reduza o alcance. É uma prática padrão entre criadores e marcas." },
  ],
  related: ["o-que-e-link-na-bio", "como-colocar-link-no-tiktok", "vender-no-instagram-sem-loja"],
};

export default article;
