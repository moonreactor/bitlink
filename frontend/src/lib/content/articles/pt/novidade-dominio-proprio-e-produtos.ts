import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "novedad-dominio-propio-y-productos",
  slug: "novidade-dominio-proprio-e-produtos",
  category: "novedades",
  title: "Novidade: domínio próprio, produtos, gorjetas e captura de contatos no seu Bitlink",
  seoTitle: "Novidade: domínio próprio e produtos no Bitlink",
  description:
    "Seu link na bio agora pode viver no seu próprio domínio e exibir produtos com checkout externo, botão de gorjetas e formulário de e-mail ou telefone.",
  published: "2026-11-05",
  keywords: ["domínio próprio link na bio", "vender no link na bio", "gorjetas", "captura de e-mails", "novidades bitlink"],
  tldr:
    "Agora você pode publicar o seu Bitlink no **seu próprio domínio** (por exemplo `links.suamarca.com`), adicionar **cartões de produto** que levam ao seu checkout sem comissão, um **botão de gorjetas** e um formulário para **capturar e-mails ou telefones**. Tudo incluído, de graça.",
  takeaways: [
    "Domínio próprio: você verifica com um registro TXT e aponta um CNAME.",
    "Produtos com imagem, preço e link para Mercado Pago, Stripe, PayPal ou Gumroad.",
    "Botão de gorjetas para Mercado Pago, PayPal, Buy Me a Coffee ou outro serviço.",
    "Inscritos por e-mail ou telefone, sem depender do algoritmo.",
  ],
  cover: { src: "/landing/1490481651871-ab68de25d43d-360x440.webp", alt: "Arara com camisas e blusas de uma loja de roupas" },
  body: [
    { type: "h2", text: "Domínio próprio" },
    {
      type: "p",
      text: "Sua página pode aparecer em um endereço da sua marca, como `links.suamarca.com`, em vez de `bitlink.click/seunome`. Isso reforça a marca e faz as pessoas confiarem mais ao clicar.",
    },
    {
      type: "p",
      text: "O processo tem duas partes: **verificar** que o domínio é seu com um registro TXT e **apontar** o subdomínio para o Bitlink com um CNAME. Explicamos tudo no guia [como conectar um domínio próprio ao seu link na bio](/pt/blog/conectar-dominio-proprio).",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Sobre o certificado SSL",
      text: "O certificado HTTPS do domínio próprio é configurado no seu provedor de DNS ou hospedagem (por exemplo, com o proxy da Cloudflare). Sem HTTPS, os navegadores marcam a página como não segura.",
    },
    { type: "h2", text: "Produtos sem loja virtual" },
    {
      type: "p",
      text: "Na seção **Products** você cria cartões com foto, nome, descrição, preço e um link de compra. O link pode ser um link de pagamento do Mercado Pago, um checkout do Stripe, PayPal, Gumroad, Hotmart ou o seu WhatsApp. **O Bitlink não cobra comissão**, porque o pagamento acontece fora da plataforma.",
    },
    {
      type: "ul",
      items: [
        "Ideal para cursos, treinos, presets, merch, ingressos e serviços.",
        "Os cartões aparecem na sua página junto com os demais links.",
        "Cada clique fica registrado nas suas estatísticas.",
      ],
    },
    { type: "p", text: "Se quiser montar um catálogo completo, veja [como vender no Instagram sem loja virtual](/pt/blog/vender-no-instagram-sem-loja)." },
    { type: "h2", text: "Botão de gorjetas" },
    {
      type: "p",
      text: "Você ativa um botão de gorjetas com o texto que quiser (“Me pague um café ☕”) e o conecta ao seu link do Mercado Pago, PayPal ou Buy Me a Coffee. É a forma mais simples de a sua comunidade apoiar você.",
    },
    { type: "h2", text: "Captura de e-mails e telefones" },
    {
      type: "p",
      text: "Um formulário na sua página para que as pessoas deixem o e-mail (e, opcionalmente, o telefone). É a sua lista própria: se amanhã o algoritmo de uma rede social mudar, você ainda consegue avisar a sua audiência sobre um lançamento.",
    },
    { type: "h2", text: "Como ativar" },
    {
      type: "steps",
      name: "Como ativar produtos, gorjetas e domínio no Bitlink",
      items: [
        { title: "Produtos", text: "Painel → Products → adicione foto, título, preço e link de pagamento." },
        { title: "Gorjetas", text: "Painel → Settings → ative o botão de gorjetas e cole o seu link de pagamento." },
        { title: "Captura de contatos", text: "Painel → Settings → ative o formulário de e-mail e, se quiser, o de telefone." },
        { title: "Domínio próprio", text: "Painel → Settings → Custom domain → informe o seu domínio, adicione o TXT e o CNAME e verifique." },
      ],
    },
    { type: "cta" },
  ],
  faqs: [
    { q: "O Bitlink processa os pagamentos dos meus produtos?", a: "Não. Cada produto leva ao seu próprio checkout; o dinheiro vai direto para a sua conta e o Bitlink não cobra comissão." },
    { q: "O domínio próprio tem custo?", a: "No Bitlink, não. Você só paga o domínio ao seu registrador, como qualquer outro domínio." },
    { q: "Posso exportar os e-mails que capturo?", a: "Os contatos ficam salvos na sua conta para que você possa usá-los nas suas campanhas." },
  ],
  related: ["conectar-dominio-proprio", "vender-no-instagram-sem-loja", "lancamento-bitlink"],
};

export default article;
