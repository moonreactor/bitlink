import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "glosario-link-en-bio",
  slug: "glossario-link-na-bio",
  category: "guias",
  title: "Glossário de link na bio e links curtos: 24 termos explicados de forma simples",
  seoTitle: "Glossário: link na bio, links curtos, UTM, CTR e mais",
  description:
    "Definições claras de link na bio, back-half, CTR, UTM, QR code dinâmico, CNAME, pixel, redirecionamento 302 e outros termos de marketing digital.",
  published: "2026-11-12",
  keywords: ["glossário marketing digital", "o que é back-half", "o que é ctr", "o que é qr code dinâmico", "o que é cname", "glossário link na bio"],
  tldr:
    "Este glossário reúne os termos que mais aparecem quando você monta um link na bio ou cria links curtos: de **back-half** e **CTR** a **UTM**, **QR code dinâmico**, **CNAME** e **pixel de rastreamento**, cada um definido em uma ou duas frases.",
  takeaways: [
    "Definições curtas, pensadas para iniciantes.",
    "Cada termo remete a um guia quando existe um mais completo.",
    "Em ordem alfabética.",
  ],
  cover: { src: "/landing/1517841905240-472988babdf9-360x440.webp", alt: "Mulher sorrindo encostada em uma parede azul" },
  body: [
    { type: "h2", text: "A – C" },
    {
      type: "ul",
      items: [
        "**Back-half**: a parte final personalizável de um link curto. Em `bitlink.click/promo`, o back-half é `promo`.",
        "**Bio (biografia)**: o texto do perfil em uma rede social, onde costuma ficar o único link clicável.",
        "**Call to action (CTA)**: texto ou botão que convida a fazer algo concreto: “Compre”, “Reserve”, “Inscreva-se”.",
        "**Checkout**: a página onde se conclui o pagamento de uma compra.",
        "**Clique**: cada vez que alguém toca em um link ou botão.",
        "**CNAME**: registro DNS que faz um subdomínio (como `links.suamarca.com`) apontar para outro host. Veja [conectar domínio próprio](/pt/blog/conectar-dominio-proprio).",
        "**Coleção**: grupo de links com imagens, em lista ou grade, dentro de um link na bio.",
        "**CTR (click-through rate)**: porcentagem de pessoas que clicam em relação às que viram algo. CTR = cliques ÷ visitas × 100.",
      ],
    },
    { type: "h2", text: "D – L" },
    {
      type: "ul",
      items: [
        "**DNS**: o sistema que traduz nomes de domínio em endereços de servidores.",
        "**Domínio próprio**: um endereço web seu (suamarca.com) que você pode usar para o seu link na bio.",
        "**Embed (incorporação)**: conteúdo de outra plataforma (um vídeo do YouTube, uma música do Spotify) que é reproduzido dentro da sua página.",
        "**Encurtador de links**: ferramenta que transforma uma URL longa em uma curta que redireciona para o destino e registra os cliques. Veja [encurtador de links grátis](/pt/blog/encurtador-de-links-gratis-sem-limite).",
        "**Fonte de tráfego (origem)**: o site ou rede de onde vem uma visita (Instagram, TikTok, Google, direto).",
        "**Geo-routing (redirecionamento por país)**: enviar cada visitante a um destino diferente conforme o seu país.",
        "**Link agendado**: link que aparece ou desaparece automaticamente em uma data e hora.",
        "**Link na bio**: página com vários links colocada no único espaço para links de um perfil. Veja [o que é link na bio](/pt/blog/o-que-e-link-na-bio).",
      ],
    },
    { type: "h2", text: "P – Q" },
    {
      type: "ul",
      items: [
        "**Pixel de rastreamento**: código do Google Analytics ou da Meta (Facebook/Instagram) que registra visitas e conversões para medir e criar públicos de anúncios.",
        "**QR code estático**: QR code que contém diretamente a URL final; não pode ser editado.",
        "**QR code dinâmico (editável)**: QR code que aponta para um link curto, de modo que o destino pode ser trocado sem reimprimir. Veja [QR code editável](/pt/blog/codigo-qr-editavel).",
      ],
    },
    { type: "h2", text: "R – V" },
    {
      type: "ul",
      items: [
        "**Redirecionamento**: quando uma URL envia automaticamente o navegador para outra. Os encurtadores usam redirecionamentos.",
        "**Registro TXT**: registro DNS de texto usado, entre outras coisas, para verificar que um domínio pertence a você.",
        "**SSL / HTTPS**: o certificado que criptografa a conexão e mostra o cadeado no navegador.",
        "**UTM**: parâmetros adicionados a uma URL (`utm_source`, `utm_medium`, `utm_campaign`…) para identificar de onde veio uma visita. Veja [parâmetros UTM](/pt/blog/o-que-sao-parametros-utm).",
        "**Visita**: cada vez que alguém abre a sua página de link na bio. Junto com os cliques, permite calcular o CTR.",
      ],
    },
    { type: "cta" },
  ],
  faqs: [
    { q: "O que é o back-half de um link?", a: "É a parte final de um link curto que você pode personalizar, por exemplo “promo” em bitlink.click/promo." },
    { q: "Qual é a diferença entre um QR code estático e um dinâmico?", a: "O estático traz a URL final gravada e não pode ser alterado; o dinâmico aponta para um link curto cujo destino você pode editar e que ainda mede os escaneamentos." },
    { q: "O que significa CTR?", a: "Click-through rate: a porcentagem de pessoas que clicaram em relação ao total que viu o link ou a página." },
  ],
  related: ["o-que-e-link-na-bio", "o-que-sao-parametros-utm", "codigo-qr-editavel"],
};

export default article;
