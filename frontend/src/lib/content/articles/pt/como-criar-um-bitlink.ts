import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "crear-un-bitlink",
  slug: "como-criar-um-bitlink",
  category: "guias",
  title: "Como criar um bitlink grátis (criador de links curtos, sem conta)",
  seoTitle: "Criador de bitlinks: crie um link curto grátis",
  description:
    "Crie um bitlink (link curto) grátis com um clique: sem conta e sem limites. O que é um bitlink, como fazer e como ver os cliques.",
  published: "2026-11-14",
  keywords: ["criador de bitlinks", "criar um bitlink", "como fazer um bitlink", "gerador de links curtos", "criar link curto grátis"],
  tldr:
    "Um **bitlink** é um link curto que redireciona para uma URL mais longa. Para criar um grátis, abra o [encurtador do Bitlink](/encurtador-de-links), cole seu link e clique em **Encurtar**: não precisa de conta nem há limites. Crie uma conta grátis para ver cliques, editar o destino ou adicionar QR code. Atenção: o Bitlink (bitlink.click) é independente e não é afiliado ao Bitly, que também chama seus links de \"bitlinks\".",
  takeaways: [
    "Um bitlink é apenas um link curto; você cria em menos de 30 segundos.",
    "O criador do Bitlink é grátis, ilimitado e sem cadastro.",
    "Com conta grátis você tem estatísticas, final personalizado, UTMs e QR code.",
    "Bitlink (bitlink.click) não é o Bitly; o Bitly usa \"bitlink\" para seus links bit.ly.",
  ],
  cover: { src: "/landing/1460925895917-afdab827c52f-360x440.webp", alt: "Notebook com painel de métricas e gráficos" },
  body: [
    { type: "h2", text: "O que é um bitlink?" },
    {
      type: "p",
      text: "Um bitlink é uma URL encurtada que leva a um destino mais longo. O termo se popularizou porque o Bitly chama seus links curtos de \"bitlinks\". O **Bitlink** (bitlink.click) é um serviço independente que cria o mesmo tipo de link curto de graça.",
    },
    {
      type: "steps",
      name: "Como criar um bitlink",
      items: [
        { title: "Abra o criador", text: "Acesse o [criador de bitlinks grátis](/encurtador-de-links). Não precisa fazer login." },
        { title: "Cole sua URL longa", text: "Qualquer endereço `http` ou `https` funciona." },
        { title: "Clique em Encurtar", text: "Seu link curto, como `bitlink.click/k3x9p2q`, aparece na hora." },
        { title: "Copie e compartilhe", text: "Cole numa bio, mensagem ou e-mail, ou transforme em QR code." },
      ],
    },
    {
      type: "ul",
      items: [
        "Use um **final personalizado** descritivo, como `bitlink.click/promo-verao`.",
        "Adicione [parâmetros UTM](/pt/blog/o-que-sao-parametros-utm) para saber qual campanha gerou cada clique.",
        "Crie uma conta antes de imprimir um link para que ele nunca expire.",
      ],
    },
    {
      type: "cta",
      title: "Crie seu bitlink agora",
      text: "Grátis, ilimitado e sem cadastro.",
      href: "/encurtador-de-links",
      label: "Abrir o criador de bitlinks",
    },
  ],
  faqs: [
    { q: "O que é um criador de bitlinks?", a: "Uma ferramenta que transforma uma URL longa em um link curto. O do Bitlink é grátis, ilimitado e funciona sem conta." },
    { q: "Como crio um bitlink grátis?", a: "Abra bitlink.click/encurtador-de-links, cole sua URL e clique em Encurtar. Copie o link curto e compartilhe." },
    { q: "Bitlink é o mesmo que Bitly?", a: "Não. O Bitlink (bitlink.click) é um serviço independente. O Bitly usa a palavra \"bitlink\" para seus links bit.ly." },
    { q: "Posso ver os cliques do meu bitlink?", a: "Sim. Com uma conta grátis você vê cliques por dia, país, dispositivo e origem." },
  ],
  related: ["encurtar-link-sem-cadastro", "encurtador-de-links-gratis-sem-limite"],
};

export default article;
