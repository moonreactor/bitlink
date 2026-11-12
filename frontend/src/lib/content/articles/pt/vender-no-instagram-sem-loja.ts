import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "vender-por-instagram-sin-tienda",
  slug: "vender-no-instagram-sem-loja",
  category: "guias",
  title: "Como vender no Instagram sem loja virtual: catálogo, link de pagamento e WhatsApp",
  seoTitle: "Como vender no Instagram sem loja virtual",
  description:
    "Monte um catálogo no seu link na bio com preços e links de pagamento do Mercado Pago, Stripe ou PayPal. Sem loja, sem comissão e com estatísticas.",
  published: "2026-11-09",
  keywords: ["vender no instagram", "vender sem loja virtual", "link de pagamento mercado pago", "catálogo no link na bio", "vender pelo whatsapp"],
  tldr:
    "Para vender no Instagram **sem loja virtual**, bastam três coisas: um **catálogo simples** no seu link na bio (foto, nome e preço), um **link de pagamento** por produto (Mercado Pago, Stripe, PayPal ou Gumroad) e um canal de **dúvidas** como o WhatsApp. No Bitlink você monta isso com cartões de produto, sem comissão.",
  takeaways: [
    "Comece com 3 a 6 produtos, os mais vendidos ou o lançamento.",
    "Um link de pagamento por produto evita idas e vindas por mensagem.",
    "Adicione o WhatsApp para dúvidas e uma seção de entregas.",
    "Meça qual produto recebe mais cliques e ajuste a ordem.",
  ],
  cover: { src: "/landing/1490481651871-ab68de25d43d-360x440.webp", alt: "Roupas penduradas em uma arara de madeira" },
  body: [
    { type: "h2", text: "É preciso ter uma loja virtual para vender?" },
    {
      type: "p",
      text: "Nem sempre. Se você vende poucos produtos, serviços, cursos, ingressos ou encomendas, uma loja completa pode ser demais: é preciso manter estoque, templates, gateway de pagamento e, muitas vezes, pagar uma assinatura. Para começar, um **catálogo no seu link na bio** com links de pagamento resolve a mesma coisa com muito menos trabalho.",
    },
    {
      type: "table",
      head: ["", "Loja virtual", "Catálogo no link na bio"],
      rows: [
        ["Custo", "Assinatura mensal e/ou comissão", "Grátis no Bitlink, 0% de comissão"],
        ["Tempo de montagem", "Dias", "Minutos"],
        ["Estoque e envios automáticos", "Sim", "Não (são geridos por fora)"],
        ["Ideal para", "Muitos produtos e variações", "Poucos produtos, serviços, digitais, pré-vendas"],
      ],
    },
    { type: "h2", text: "Passo a passo para montar o seu catálogo" },
    {
      type: "steps",
      name: "Como vender no Instagram com um catálogo no seu link na bio",
      items: [
        { title: "Crie os seus links de pagamento", text: "No Mercado Pago, Stripe, PayPal, Gumroad ou Hotmart, gere um link de pagamento por produto com o respectivo preço." },
        { title: "Crie a sua página", text: "Cadastre-se no [Bitlink](/register) e escolha o seu nome." },
        { title: "Adicione os produtos", text: "Em Products, cadastre foto, nome, descrição curta, preço e o link de pagamento." },
        { title: "Some contato e confiança", text: "Adicione o WhatsApp, uma seção de entregas e trocas, e avaliações ou prints de clientes." },
        { title: "Cole o link no Instagram", text: "Editar perfil → Links. Veja [como colocar vários links no Instagram](/pt/blog/como-colocar-varios-links-no-instagram)." },
        { title: "Divulgue", text: "Mostre o produto em Reels e stories com “link na bio” e o sticker de link." },
      ],
    },
    { type: "h2", text: "Como escrever cartões de produto que vendem" },
    {
      type: "ul",
      items: [
        "**Foto real e nítida**, com fundo limpo. É a primeira coisa que se olha.",
        "**Nome concreto**: “Programa de força de 12 semanas” é melhor do que “Plano pro”.",
        "**Preço visível**: escondê-lo gera mensagens e desistências.",
        "**Benefício em uma linha**: “Treinos para fazer em casa 3 vezes por semana”.",
        "**Urgência honesta**: vagas limitadas, pré-venda ou prazo final só se forem reais.",
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Preço por país",
      text: "Se você vende para vários países, use um [link curto com regras por país](/pt/blog/novidade-links-curtos) para enviar cada pessoa ao checkout na sua moeda.",
    },
    { type: "h2", text: "Outras formas de monetizar a sua página" },
    {
      type: "ul",
      items: [
        "**Gorjetas**: um botão para o Mercado Pago, o PayPal ou o Buy Me a Coffee.",
        "**Lista de e-mails**: avise sobre lançamentos e pré-vendas sem depender do algoritmo.",
        "**Links agendados**: faça o produto aparecer sozinho na hora do lançamento.",
        "**Links com senha**: conteúdo ou descontos exclusivos para clientes.",
      ],
    },
    { type: "h2", text: "Como medir as vendas" },
    {
      type: "p",
      text: "No Bitlink você vê quantos cliques cada produto recebe. As vendas aparecem na sua plataforma de pagamento. Se quiser atribuir cada venda a um canal, adicione o Google Analytics ou o Meta Pixel à sua página em Settings e use [UTMs](/pt/blog/o-que-sao-parametros-utm) nos links de pagamento.",
    },
    { type: "cta", title: "Venda a partir do seu link na bio", text: "Cartões de produto com checkout próprio. 0% de comissão." },
  ],
  faqs: [
    { q: "O Bitlink cobra comissão por cada venda?", a: "Não. O pagamento acontece na sua plataforma (Mercado Pago, Stripe, PayPal etc.) e o dinheiro vai direto para a sua conta." },
    { q: "Posso vender produtos digitais?", a: "Sim. Aponte para o Gumroad, o Hotmart ou um link de pagamento e entregue o arquivo a partir dessa plataforma." },
    { q: "Quantos produtos posso cadastrar?", a: "Não há limite, mas, para converter melhor, vale destacar poucos e agrupar o resto." },
    { q: "Posso vender pelo WhatsApp a partir do link na bio?", a: "Sim. Adicione um link do WhatsApp com uma mensagem pré-preenchida, por exemplo “Olá, quero o produto X”." },
  ],
  related: ["novidade-dominio-proprio-e-produtos", "como-colocar-varios-links-no-instagram", "metricas-link-na-bio"],
};

export default article;
