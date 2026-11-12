import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "como-poner-link-en-tiktok",
  slug: "como-colocar-link-no-tiktok",
  category: "guias",
  title: "Como colocar um link na bio do TikTok: requisitos e o que fazer se não aparecer",
  seoTitle: "Como colocar um link no TikTok: requisitos e alternativas",
  description:
    "Como adicionar um link na bio do TikTok, por que a opção às vezes não aparece e que alternativas usar enquanto isso para levar tráfego.",
  published: "2026-11-07",
  keywords: ["link no tiktok", "como colocar link no tiktok", "link na bio tiktok", "não aparece site tiktok", "tiktok 1000 seguidores link"],
  tldr:
    "No TikTok, o link é adicionado em **Editar perfil → Site**. Se a opção não aparecer, normalmente é porque a sua conta ainda não cumpre os requisitos (em contas pessoais, o TikTok costuma exigir um mínimo de seguidores; contas comerciais costumam ter a opção disponível). Quando você tiver acesso, coloque **um link na bio** com todos os seus destinos.",
  takeaways: [
    "Caminho: Perfil → Editar perfil → Site.",
    "Se não aparecer: confira seguidores, idade da conta e tipo de conta.",
    "Alternativas: link no Instagram/YouTube, mensagens diretas e QR code.",
    "Use um link curto com UTM para medir o tráfego do TikTok.",
  ],
  cover: { src: "/landing/1470225620780-dba8ba36b745-360x440.webp", alt: "Mãos de um DJ sobre uma controladora iluminada com luzes roxas" },
  body: [
    { type: "h2", text: "Como adicionar o link no TikTok" },
    {
      type: "steps",
      name: "Como adicionar um link na bio do TikTok",
      items: [
        { title: "Abra o seu perfil", text: "Toque no ícone de perfil no canto inferior direito." },
        { title: "Editar perfil", text: "Toque em “Editar perfil”." },
        { title: "Site", text: "Procure o campo “Site” e cole a sua URL, por exemplo `bitlink.click/seunome`." },
        { title: "Salve", text: "O link aparece clicável abaixo da sua descrição." },
      ],
    },
    { type: "h2", text: "Por que a opção “Site” não aparece" },
    {
      type: "p",
      text: "O TikTok não libera o link na bio para todas as contas. As condições mudam com o tempo e por país, mas os motivos mais comuns são:",
    },
    {
      type: "ul",
      items: [
        "**Poucos seguidores**: em contas pessoais, o TikTok historicamente exigiu cerca de 1.000 seguidores.",
        "**Tipo de conta**: as contas comerciais (Business) costumam ter o campo disponível antes.",
        "**Idade mínima**: a conta precisa pertencer a uma pessoa maior de idade.",
        "**Versão do app**: atualize o TikTok; às vezes o campo só aparece na versão mais recente.",
      ],
    },
    {
      type: "callout",
      tone: "note",
      text: "Confira os requisitos atuais na central de ajuda do TikTok: a plataforma os ajusta periodicamente.",
    },
    { type: "h2", text: "O que fazer enquanto você não tem o link" },
    {
      type: "ol",
      items: [
        "**Envie para outra rede**: o TikTok mostra os ícones do Instagram e do YouTube no seu perfil. Se o seu Instagram tem um link na bio, as pessoas chegam do mesmo jeito, em dois passos.",
        "**Mensagens diretas**: responda com o seu link a quem comenta “onde eu compro?”.",
        "**Um link fácil de lembrar**: fale-o no vídeo. `bitlink.click/seunome` é fácil de lembrar e de digitar.",
        "**QR code na tela**: mostre um QR code no fim do vídeo para quem assiste de outro dispositivo.",
      ],
    },
    { type: "h2", text: "O que colocar no seu link do TikTok" },
    {
      type: "p",
      text: "O público do TikTok chega pelo celular, com pouco tempo e muita curiosidade. Sua página deve carregar rápido e mostrar primeiro **o que você prometeu no vídeo**. Se no vídeo você falou de um produto, esse produto tem que ser o primeiro botão.",
    },
    {
      type: "table",
      head: ["Se o seu TikTok é de…", "Primeiro link sugerido"],
      rows: [
        ["Música", "Player do Spotify com a música mais recente"],
        ["Produtos", "Cartão do produto do vídeo com preço e botão de compra"],
        ["Receitas ou tutoriais", "A receita completa ou o tutorial longo no YouTube"],
        ["Serviços", "Agenda de horários ou WhatsApp"],
      ],
    },
    { type: "h2", text: "Como medir quanto tráfego o TikTok traz" },
    {
      type: "p",
      text: "Nas estatísticas do Bitlink você vê de qual rede vem cada visita. Se quiser mais detalhe por campanha, use um [link curto](/pt/blog/novidade-links-curtos) com `utm_source=tiktok` e um `utm_campaign` por vídeo ou série.",
    },
    { type: "cta", title: "Seu link na bio para o TikTok", text: "Rápido no celular, com embeds e estatísticas. Grátis." },
  ],
  faqs: [
    { q: "Quantos seguidores preciso para colocar um link no TikTok?", a: "Em contas pessoais, o TikTok historicamente exigiu cerca de 1.000 seguidores, embora o requisito possa variar. As contas comerciais costumam ter a opção habilitada antes." },
    { q: "Posso colocar links nos vídeos do TikTok?", a: "Em geral, eles não são clicáveis na descrição. Use o link do seu perfil ou as mensagens diretas." },
    { q: "Vale a pena mudar para conta comercial para ter o link?", a: "Pode ajudar, mas as contas comerciais têm restrições na música disponível. Avalie se compensa conforme o seu conteúdo." },
  ],
  related: ["como-colocar-varios-links-no-instagram", "o-que-e-link-na-bio", "link-na-bio-para-musicos"],
};

export default article;
