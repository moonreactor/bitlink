import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "lanzamiento-bitlink",
  slug: "lancamento-bitlink",
  category: "novedades",
  title: "Lançamos o Bitlink: link na bio e links curtos grátis, sem planos nem limites mensais",
  seoTitle: "Lançamos o Bitlink: link na bio e links curtos grátis",
  description:
    "O Bitlink já está no ar: uma página de link na bio e um encurtador de links com QR code, UTMs e estatísticas, tudo grátis e sem planos pagos.",
  published: "2026-11-04",
  keywords: ["bitlink", "link na bio grátis", "encurtador de links grátis", "alternativa ao linktree", "lançamento"],
  tldr:
    "O **Bitlink** é uma ferramenta gratuita que reúne duas coisas que normalmente são pagas separadamente: uma **página de link na bio** (bitlink.click/seunome) e um **encurtador de links** com QR codes, UTMs e estatísticas. Não há planos pagos nem limites mensais de links ou cliques.",
  takeaways: [
    "Links ilimitados na sua página e links curtos ilimitados.",
    "Estatísticas de visitas, cliques, origens e países, com exportação em CSV.",
    "Domínio próprio, produtos, gorjetas e captura de e-mails incluídos.",
    "Sem cartão e sem planos: todas as funcionalidades estão disponíveis para todo mundo.",
  ],
  cover: { src: "/landing/1459749411175-04bf5292ceea-900x600.webp", alt: "Público com as mãos para o alto diante de um palco iluminado" },
  body: [
    { type: "h2", text: "O que é o Bitlink" },
    {
      type: "p",
      text: "O Bitlink é uma **plataforma de link na bio e links curtos**. Com uma única conta você tem uma página pública em `bitlink.click/seunome`, onde coloca tudo o que compartilha — música, vídeos, produtos, reservas, redes sociais — e um encurtador para criar links como `bitlink.click/promo`, que você pode medir e editar quando quiser.",
    },
    {
      type: "p",
      text: "A ideia é simples: a maioria dos criadores, empreendedores e marcas pequenas acaba pagando por uma ferramenta de link na bio e outra para encurtar links, e mesmo assim esbarra em limites mensais. O Bitlink resolve as duas coisas no mesmo lugar, **de graça e sem planos**.",
    },
    { type: "h2", text: "O que está incluído desde o primeiro dia" },
    {
      type: "table",
      caption: "Funcionalidades disponíveis no lançamento",
      head: ["Funcionalidade", "O que faz", "Custo"],
      rows: [
        ["Página de link na bio", "Links ilimitados, títulos, coleções em lista ou grade, embeds do YouTube e do Spotify", "Grátis"],
        ["Links curtos", "Final personalizado (back-half), UTMs, regras por dispositivo e por país, destino editável", "Grátis"],
        ["QR codes", "Cores próprias, logo no centro, download em PNG ou SVG", "Grátis"],
        ["Estatísticas", "Visitas, cliques, origens, países, período personalizado e exportação em CSV", "Grátis"],
        ["Monetização", "Cartões de produto com checkout externo e botão de gorjetas", "Grátis, 0% de comissão"],
        ["Audiência", "Captura de e-mail e telefone, Google Analytics e Meta Pixel", "Grátis"],
        ["Controle", "Links agendados, links e perfis com senha", "Grátis"],
        ["Marca", "Temas, fontes, fundos e domínio próprio", "Grátis"],
      ],
    },
    { type: "h2", text: "Por que grátis e sem planos" },
    {
      type: "p",
      text: "Acreditamos que ter uma página própria e saber quais links funcionam não deveria depender de uma mensalidade. Por isso nenhuma funcionalidade fica bloqueada atrás de pagamento. Em troca, cada página pública exibe um botão discreto **“Create your Bitlink”** para que quem a visita também possa criar a sua: é assim que o Bitlink cresce.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Zero comissão nas vendas",
      text: "Os cartões de produto levam ao seu próprio checkout (Mercado Pago, Stripe, PayPal, Gumroad etc.). O Bitlink não processa pagamentos nem fica com porcentagem.",
    },
    { type: "h2", text: "Para quem é" },
    {
      type: "ul",
      items: [
        "**Músicos e artistas**: lançamentos, datas de shows, merch e um player do Spotify ou do YouTube na mesma página. Veja [como montar um link na bio para músicos](/pt/blog/link-na-bio-para-musicos).",
        "**Criadores de conteúdo**: um único link para Instagram, TikTok e YouTube, com estatísticas do que é mais clicado.",
        "**Empreendedores e lojas pequenas**: catálogo com preços e checkout, sem precisar montar uma loja virtual. Veja [como vender no Instagram sem loja virtual](/pt/blog/vender-no-instagram-sem-loja).",
        "**Restaurantes e comércios**: cardápio, reservas e WhatsApp em um QR code editável. Veja [cardápio QR para restaurantes](/pt/blog/cardapio-qr-para-restaurantes).",
        "**Marcas e agências**: links curtos com UTMs e domínio próprio para medir cada campanha.",
      ],
    },
    { type: "h2", text: "Como começar" },
    {
      type: "steps",
      name: "Como criar o seu Bitlink",
      items: [
        { title: "Reserve o seu nome", text: "Acesse [bitlink.click/register](/register) e escolha seu usuário. Sua página fica em bitlink.click/seunome." },
        { title: "Adicione o que você compartilha", text: "Inclua links, vídeos, músicas, produtos, um botão de gorjetas ou um formulário de e-mail." },
        { title: "Escolha um visual", text: "Experimente temas, fontes e fundos até ficar com a cara da sua marca." },
        { title: "Compartilhe em todo lugar", text: "Cole o link na bio do Instagram, do TikTok e do YouTube, ou imprima o QR code. Depois acompanhe as estatísticas." },
      ],
    },
    { type: "cta" },
  ],
  faqs: [
    { q: "O Bitlink é mesmo grátis?", a: "Sim. Todas as funcionalidades — links ilimitados, links curtos, QR code, estatísticas, domínio próprio e produtos — estão incluídas sem pagar nada. Não existem planos premium." },
    { q: "Preciso de cartão de crédito para me cadastrar?", a: "Não. Só um e-mail e uma senha." },
    { q: "O Bitlink cobra comissão sobre as vendas?", a: "Não. Os produtos levam ao seu próprio checkout e o Bitlink não participa do pagamento." },
    { q: "Posso remover o botão “Create your Bitlink”?", a: "Não. É a forma de o Bitlink se sustentar sem cobrar planos." },
  ],
  related: ["o-que-e-link-na-bio", "novidade-links-curtos", "alternativas-gratis-ao-linktree"],
};

export default article;
