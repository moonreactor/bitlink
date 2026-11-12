import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "menu-qr-para-restaurantes",
  slug: "cardapio-qr-para-restaurantes",
  category: "casos-de-uso",
  title: "Cardápio com QR code para restaurantes e bares: como montar de graça e atualizar sem reimprimir",
  seoTitle: "Cardápio QR para restaurantes: como montar de graça",
  description:
    "Como criar um cardápio com QR code para o seu restaurante, bar ou cafeteria: menu, reservas, delivery e WhatsApp em uma página, com um QR code que você pode editar.",
  published: "2026-11-11",
  keywords: ["cardápio qr code", "cardápio digital", "qr code para cardápio grátis", "menu qr restaurante", "qr code editável restaurante"],
  tldr:
    "Para um **cardápio com QR code** que não precise ser reimpresso: monte uma página com o **menu**, as **reservas**, o **delivery** e o **WhatsApp**, e gere um **QR code dinâmico** que aponte para essa página ou para um link curto. Quando os preços ou o prato do dia mudarem, você atualiza o destino e o QR code das mesas continua funcionando.",
  takeaways: [
    "O cardápio em uma página leve, não em um PDF pesado.",
    "Um QR code por local (mesa, balcão, vitrine) para medir.",
    "Some reservas, delivery, avaliações e Wi-Fi.",
    "QR code com alto contraste e um texto que diga o que ele faz.",
  ],
  cover: { src: "/landing/1504674900247-0877df9cc836-900x1100.webp", alt: "Prato com carne fatiada, legumes e pimenta visto de cima sobre uma mesa de madeira" },
  body: [
    { type: "h2", text: "O que a sua página de cardápio deve ter" },
    {
      type: "ul",
      items: [
        "**Cardápio** com fotos e preços: como coleção em grade ou um link para o seu menu.",
        "**Prato ou promoção do dia** no topo de tudo.",
        "**Reservas**: link para o seu sistema de reservas ou para o WhatsApp com mensagem pré-preenchida.",
        "**Delivery e retirada**: links para os seus apps de delivery ou para o seu próprio sistema de pedidos.",
        "**Localização e horários**: link para o Google Maps.",
        "**Avaliações**: link para deixar uma avaliação no Google.",
        "**Wi-Fi e redes**: Instagram e, se quiser, a senha do Wi-Fi na bio.",
      ],
    },
    { type: "h2", text: "Passo a passo" },
    {
      type: "steps",
      name: "Como montar um cardápio com QR code para um restaurante",
      items: [
        { title: "Crie a página", text: "Cadastre-se no [Bitlink](/register) com o nome do local, por exemplo `bitlink.click/cafemare`." },
        { title: "Cadastre o cardápio", text: "Use coleções em grade com foto e nome de cada seção (entradas, pratos principais, sobremesas, bebidas) ou aponte para o seu cardápio." },
        { title: "Adicione reservas e delivery", text: "WhatsApp, sistema de reservas e apps de delivery como botões." },
        { title: "Crie um link curto por local", text: "`/cafemare-mesa`, `/cafemare-balcao`, `/cafemare-vitrine`, todos apontando para a sua página." },
        { title: "Baixe os QR codes em SVG", text: "SVG para gráfica: não perde qualidade em adesivos, acrílicos ou vinis." },
        { title: "Imprima com um texto claro", text: "“Escaneie para ver o cardápio” ao lado do código." },
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Cardápio de almoço e de jantar",
      text: "Com um link curto editável, você pode enviar o mesmo QR code para o cardápio do almoço ou o do jantar trocando o destino, ou agendar links que aparecem só em certo horário.",
    },
    { type: "h2", text: "Design do QR code para as mesas" },
    {
      type: "table",
      head: ["Suporte", "Recomendação"],
      rows: [
        ["Adesivo na mesa", "Pelo menos 3 × 3 cm, plastificado para resistir à limpeza"],
        ["Acrílico ou porta-cardápio", "QR code grande, logo pequeno, texto com a ação"],
        ["Vitrine", "QR code grande na altura dos olhos para ver o cardápio quando o local está fechado"],
        ["Cupom ou embalagem", "QR code para avaliações ou para o seu Instagram, para fidelizar"],
      ],
    },
    { type: "h2", text: "O que medir" },
    {
      type: "p",
      text: "Cada escaneamento é um clique no link curto: você vê quantos escaneamentos houve por dia, de qual local e de que tipo de dispositivo. Se a vitrine traz muitos escaneamentos fora do horário, coloque um botão de pedido online bem no topo. Mais em [QR code editável](/pt/blog/codigo-qr-editavel).",
    },
    { type: "cta", title: "Seu cardápio QR, de graça", text: "Cardápio, reservas e delivery em uma página, com QR code editável." },
  ],
  faqs: [
    { q: "É melhor um PDF ou uma página para o cardápio QR?", a: "Uma página: carrega mais rápido no celular, é mais fácil de ler e pode ser atualizada sem gerar um arquivo novo." },
    { q: "Preciso reimprimir o QR code se os preços mudarem?", a: "Não, se o QR code apontar para um link curto ou para a sua página do Bitlink. Você atualiza o conteúdo e o QR code continua o mesmo." },
    { q: "Consigo saber quantas pessoas escaneiam o QR code?", a: "Sim. Cada escaneamento conta como clique no link curto, com data, país e dispositivo." },
    { q: "Tem algum custo?", a: "Não. A página, os links curtos e os QR codes são grátis no Bitlink." },
  ],
  related: ["codigo-qr-editavel", "novidade-links-curtos", "metricas-link-na-bio"],
};

export default article;
