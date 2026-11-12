import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "novedad-links-cortos",
  slug: "novidade-links-curtos",
  category: "novedades",
  title: "Novidade: links curtos no bitlink.click com UTMs e regras por dispositivo e por país",
  seoTitle: "Links curtos com UTMs e regras por dispositivo e país",
  description:
    "Agora você pode criar links curtos ilimitados no bitlink.click com final personalizado, UTMs, destino diferente para celular ou computador e por país, QR code e estatísticas.",
  published: "2026-11-04",
  keywords: ["links curtos", "encurtador de links", "bitlink.click", "utm", "redirecionamento por país", "redirecionamento por dispositivo"],
  tldr:
    "O Bitlink ganhou um **encurtador de links** integrado: você cria links como `bitlink.click/promo`, adiciona **UTMs**, define um destino diferente para **celular e computador** ou por **país**, e troca o destino quando quiser sem precisar reimprimir o QR code. É ilimitado e grátis.",
  takeaways: [
    "Final personalizado: bitlink.click/o-que-quiser (de 2 a 40 caracteres).",
    "Campos UTM prontos: source, medium, campaign, term e content.",
    "Regras: um destino para celular, outro para computador e destinos por país.",
    "Cada link curto tem estatísticas de cliques e seu próprio QR code.",
  ],
  cover: { src: "/landing/1460925895917-afdab827c52f-360x440.webp", alt: "Notebook exibindo um painel de análise com gráficos de cliques" },
  body: [
    { type: "h2", text: "O que mudou" },
    {
      type: "p",
      text: "Além da sua página de link na bio, agora toda conta do Bitlink tem uma seção **Short links** para criar links curtos no domínio `bitlink.click`. Eles servem para compartilhar em um story, em um vídeo, em um e-mail, em um cartaz ou em uma embalagem, e saber exatamente quantas pessoas clicaram.",
    },
    { type: "h2", text: "As funcionalidades, uma por uma" },
    { type: "h3", text: "1. Final personalizado (back-half)" },
    {
      type: "p",
      text: "Você escolhe a parte final do link: `bitlink.click/ingressos`, `bitlink.click/black-friday`, `bitlink.click/cardapio`. São aceitas letras minúsculas, números, hífens e underscores, de 2 a 40 caracteres. Um link legível passa mais confiança do que um com letras aleatórias.",
    },
    { type: "h3", text: "2. UTMs sem fórmulas" },
    {
      type: "p",
      text: "Você preenche `utm_source`, `utm_medium`, `utm_campaign`, `utm_term` e `utm_content` no formulário e o Bitlink os adiciona ao destino automaticamente. Assim o Google Analytics (ou outra ferramenta) sabe de onde veio cada visita. Se for a primeira vez que usa, leia [o que são parâmetros UTM](/pt/blog/o-que-sao-parametros-utm).",
    },
    { type: "h3", text: "3. Regras por dispositivo" },
    {
      type: "p",
      text: "Você pode definir um destino para **celulares e tablets** e outro para **computadores**. Exemplo: no celular você leva para a versão mobile da sua loja ou para o app, e no computador para o site completo.",
    },
    { type: "h3", text: "4. Regras por país" },
    {
      type: "p",
      text: "Você atribui destinos de acordo com o país de quem clica: o Brasil vai para o seu checkout em reais, Portugal para a loja em euros e o resto do mundo para a versão em dólares. Se o país não tiver regra, é usado o destino principal.",
    },
    {
      type: "callout",
      tone: "note",
      title: "Ordem de prioridade",
      text: "Primeiro é avaliada a regra por dispositivo, depois a de país e, se nenhuma se aplicar, o destino principal.",
    },
    { type: "h3", text: "5. Destino editável e QR code" },
    {
      type: "p",
      text: "O link curto não muda, mesmo que você troque o destino. Isso o torna ideal para **QR codes impressos**: se amanhã a sua promoção mudar, você edita o destino e o QR code do cartaz continua funcionando. Mais detalhes em [como criar um QR code editável](/pt/blog/codigo-qr-editavel).",
    },
    { type: "h2", text: "Exemplos de uso" },
    {
      type: "table",
      head: ["Link curto", "Regra", "Para quê"],
      rows: [
        ["bitlink.click/turne", "UTM source=instagram", "Medir quantos ingressos vêm do Instagram"],
        ["bitlink.click/app", "Celular → loja de apps · Computador → site", "Um único link para baixar o app"],
        ["bitlink.click/oferta", "BR → checkout em BRL · PT → EUR", "Preço local conforme o país"],
        ["bitlink.click/cardapio", "Destino editável", "QR code nas mesas que sempre mostra o cardápio do dia"],
      ],
    },
    { type: "h2", text: "Como criar o seu primeiro link curto" },
    {
      type: "steps",
      name: "Como criar um link curto no Bitlink",
      items: [
        { title: "Acesse Short links", text: "No seu painel, abra a seção Short links e clique em “New”." },
        { title: "Cole o destino", text: "A URL longa para a qual você quer levar as pessoas." },
        { title: "Escolha o final do link", text: "Uma palavra curta e clara, por exemplo `promo-verao`." },
        { title: "Adicione UTMs e regras (opcional)", text: "Preencha source, medium e campaign e, se quiser, destinos por dispositivo ou país." },
        { title: "Compartilhe e meça", text: "Copie o link ou baixe o QR code. Os cliques aparecem nas estatísticas do link." },
      ],
    },
    { type: "cta", title: "Crie links curtos ilimitados", text: "Sem limites mensais, com UTMs, regras e QR code incluídos." },
  ],
  faqs: [
    { q: "Quantos links curtos posso criar?", a: "Quantos precisar. Não há limite mensal de links nem de cliques." },
    { q: "Posso mudar o destino de um link curto já publicado?", a: "Sim. O link e o QR code continuam iguais; só muda para onde eles redirecionam." },
    { q: "O que acontece se um código já estiver em uso?", a: "Cada final de link é único no bitlink.click. Se estiver ocupado, tente uma variação com hífen ou com o nome da sua marca." },
    { q: "As regras por dispositivo diferenciam iPhone de Android?", a: "Hoje as regras diferenciam celular/tablet de computador. Para separar as lojas de apps, use uma página de destino que detecte o sistema operacional." },
  ],
  related: ["encurtador-de-links-gratis-sem-limite", "o-que-sao-parametros-utm", "codigo-qr-editavel"],
};

export default article;
