import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "como-ver-clics-link-corto",
  slug: "como-ver-quantos-cliques-tem-um-link-curto",
  category: "guias",
  title: "Como ver quantos cliques tem um link curto",
  seoTitle: "Como ver os cliques de um link curto (grátis)",
  description:
    "Meça quantas pessoas clicam nos seus links curtos: crie uma conta grátis no Bitlink, reivindique os links que você fez sem conta e veja a contagem de cliques de cada um.",
  published: "2026-11-12",
  keywords: ["ver cliques de um link curto", "quantos cliques tem meu link", "métricas de link curto", "contador de cliques de links grátis"],
  tldr:
    "Para **ver quantos cliques tem um link curto**, crie o link em uma conta grátis do Bitlink (ou reivindique um anônimo cadastrando-se pelo mesmo navegador) e abra **Short links** no seu painel: cada link mostra a sua **quantidade de cliques**. Os cliques são contados desde a primeira visita, mesmo antes de você ter conta.",
  takeaways: [
    "Cada clique em um link curto do Bitlink é contado, esteja você logado ou não.",
    "Os links anônimos passam a ser seus ao se cadastrar pelo mesmo navegador, com os cliques.",
    "Use um link curto diferente por canal para saber qual funciona.",
    "Adicione UTMs se quiser ver também o tráfego no Google Analytics.",
  ],
  cover: { src: "/landing/1460925895917-afdab827c52f-360x440.webp", alt: "Notebook exibindo um painel de métricas com dados de cliques" },
  body: [
    { type: "h2", text: "O que um contador de cliques diz" },
    {
      type: "p",
      text: "Um link curto funciona como um contador: cada vez que alguém o abre, o Bitlink registra a visita e depois o envia ao destino. O número que você vê é a quantidade de vezes que o link foi aberto e serve para saber se um post, um e-mail ou um QR code impresso realmente traz gente.",
    },
    {
      type: "steps",
      name: "Como medir os cliques de um link curto",
      items: [
        { title: "Crie o link com uma conta", text: "Cadastre-se de graça e crie o link em **Short links**, ou encurte-o primeiro no [encurtador grátis](/encurtador-de-links) e escolha criar uma conta." },
        { title: "Ou reivindique um que você fez sem conta", text: "Cadastre-se ou faça login pelo mesmo navegador: os links anônimos que você criou ali são somados à sua conta sozinhos, junto com os cliques." },
        { title: "Abra Short links", text: "No painel, cada link mostra o total de cliques ao lado da URL curta." },
        { title: "Compartilhe e volte a olhar", text: "Publique, envie por e-mail ou imprima o QR code e veja o número crescer." },
      ],
    },
    { type: "h2", text: "Respostas mais claras com um link por canal" },
    {
      type: "p",
      text: "Um único link compartilhado em todo lugar dá apenas um total. Se você quer saber se funciona melhor o Instagram ou o e-mail, faça um link curto para cada lugar: `/promo-ig`, `/promo-mail`, `/promo-qr`. Todos levam à mesma página, mas cada um tem o seu próprio contador.",
    },
    {
      type: "table",
      head: ["Link", "Onde você compartilha", "O que você aprende"],
      rows: [
        ["`/turne-ig`", "Bio do Instagram", "Quanto tráfego o Instagram envia"],
        ["`/turne-mail`", "Newsletter", "Se os seus inscritos clicam"],
        ["`/turne-qr`", "Cartaz impresso", "Se alguém escaneia o QR code"],
      ],
    },
    { type: "h2", text: "Contagem de cliques x Google Analytics" },
    {
      type: "p",
      text: "O link curto conta **aberturas**; o Google Analytics conta o que acontece **dentro do seu site**. Eles se complementam. Adicione [parâmetros UTM](/pt/blog/o-que-sao-parametros-utm) ao link curto e o mesmo clique aparece no Analytics etiquetado com a sua origem e campanha.",
    },
    {
      type: "callout",
      tone: "note",
      text: "A contagem pode incluir pessoas que abrem o link mais de uma vez e algumas visitas automáticas. Use-a para comparar links e ver tendências, mais do que como um número exato de pessoas únicas.",
    },
    { type: "h2", text: "Não perca os seus dados: os links anônimos expiram" },
    {
      type: "p",
      text: "Os links anônimos são excluídos após 60 dias se ninguém os reivindicar, e os cliques vão embora com eles. Se os números importam para você, crie primeiro uma conta grátis. Os links de uma conta não expiram.",
    },
    {
      type: "cta",
      title: "Meça os seus links de graça",
      text: "Crie uma conta grátis e veja quantas pessoas clicam em cada link curto.",
      href: "/register",
      label: "Criar minha conta",
    },
  ],
  faqs: [
    { q: "Como vejo quantos cliques o meu link curto tem?", a: "Crie o link em uma conta grátis do Bitlink, ou reivindique um anônimo cadastrando-se pelo mesmo navegador, e abra Short links no painel para ver a quantidade de cliques de cada um." },
    { q: "Os cliques são contados antes de eu criar a conta?", a: "Sim. Os cliques em links anônimos são registrados desde a primeira visita e somados à sua conta quando você reivindica o link." },
    { q: "Posso medir um link que já compartilhei?", a: "Só se for um link curto do Bitlink. A URL de destino sozinha não pode ser contada; crie um link curto e use esse daqui em diante." },
    { q: "Medir é grátis?", a: "Sim. O Bitlink não tem planos pagos: a contagem de cliques vem com qualquer conta grátis." },
  ],
  related: ["encurtar-link-sem-cadastro", "metricas-link-na-bio", "o-que-sao-parametros-utm"],
};

export default article;
