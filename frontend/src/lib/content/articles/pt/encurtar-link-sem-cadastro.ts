import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "acortar-link-sin-registro",
  slug: "encurtar-link-sem-cadastro",
  category: "guias",
  title: "Como encurtar um link sem se cadastrar (grátis e em 30 segundos)",
  seoTitle: "Encurtar um link sem cadastro: grátis e sem conta",
  description:
    "Encurte qualquer URL de graça e sem conta: como funciona, o que saber sobre links anônimos e quando vale criar uma conta para guardá-los e medi-los.",
  published: "2026-11-12",
  keywords: ["encurtar link sem cadastro", "encurtador de links sem conta", "encurtar url grátis sem cadastro", "encurtador de url anônimo"],
  tldr:
    "Você pode **encurtar um link sem conta** com o [encurtador grátis do Bitlink](/encurtador-de-links): cole a URL, escolha continuar de forma anônima e copie o link curto. Os links anônimos funcionam na hora e **ficam guardados por 60 dias**. Se você criar uma conta grátis, seus links **não expiram** e você vê quantas pessoas clicaram em cada um.",
  takeaways: [
    "Sem cadastro, sem cartão e sem limite de links encurtados.",
    "Os links anônimos são excluídos após 60 dias; os de uma conta grátis, não.",
    "Se você criar uma conta depois, os links feitos nesse dispositivo são somados a ela, com os cliques.",
    "Links para sites de phishing ou malware são rejeitados.",
  ],
  cover: { src: "/landing/1460925895917-afdab827c52f-360x440.webp", alt: "Notebook com um painel de métricas e gráficos" },
  body: [
    { type: "h2", text: "Será que precisa mesmo de uma conta para encurtar um link?" },
    {
      type: "p",
      text: "Não. A maioria das pessoas só precisa de uma URL mais curta para colar em uma mensagem, em uma bio ou em um panfleto impresso. Exigir cadastro para isso é atrito. No Bitlink você cola a URL longa, clica em **Encurtar** e obtém na hora um link como `bitlink.click/k3x9p2q`.",
    },
    {
      type: "steps",
      name: "Como encurtar um link sem se cadastrar",
      items: [
        { title: "Abra o encurtador", text: "Acesse o [encurtador de links grátis](/encurtador-de-links); não é preciso fazer login." },
        { title: "Cole a sua URL longa", text: "Serve qualquer link `http` ou `https`. Se você esquecer o `https://`, ele é adicionado sozinho." },
        { title: "Clique em Encurtar", text: "Perguntamos se você quer acompanhar as métricas com uma conta grátis ou continuar de forma anônima. Qualquer uma das duas está ótima." },
        { title: "Copie e compartilhe", text: "Use o botão de copiar e cole o link curto onde quiser: bios, mensagens, e-mails ou um QR code." },
      ],
    },
    { type: "h2", text: "O que você precisa saber sobre links anônimos" },
    {
      type: "ul",
      items: [
        "**Ficam guardados por 60 dias.** Depois disso, os links anônimos que ninguém reivindicou são excluídos, para que a web não se encha de links mortos sem dono.",
        "**Não podem ser editados.** Não há conta associada, então o destino não pode ser alterado depois.",
        "**Os cliques são contados mesmo assim.** A contagem começa no primeiro clique; só que você não a vê até reivindicar o link.",
        "**Há um limite de uso justo.** Uma quantidade limitada de links por hora e por rede, para conter spam. Com uma conta grátis você não precisa se preocupar com isso.",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      text: "Não use um link anônimo para algo que você vai imprimir ou de que precisará por meses. Crie primeiro uma conta grátis para que ele nunca expire.",
    },
    { type: "h2", text: "Anônimo x conta grátis" },
    {
      type: "table",
      head: ["", "Anônimo", "Conta grátis"],
      rows: [
        ["Custo", "Grátis", "Grátis"],
        ["Exige cadastro", "Não", "Sim (e-mail)"],
        ["Quanto dura", "60 dias", "Sem validade"],
        ["Ver quantas pessoas clicaram", "Não", "Sim"],
        ["Final personalizado, UTMs, regras por dispositivo e país", "Não", "Sim"],
        ["Editar o destino depois", "Não", "Sim"],
        ["QR code", "Não", "Sim"],
      ],
    },
    { type: "h2", text: "Mudou de ideia? Reivindique os seus links depois" },
    {
      type: "p",
      text: "Se você criou um link de forma anônima e depois se cadastrar pelo mesmo navegador, o Bitlink soma esses links à sua conta nova automaticamente, incluindo os cliques que eles já receberam. Você não precisa fazer mais nada.",
    },
    { type: "h2", text: "É seguro?" },
    {
      type: "p",
      text: "Cada destino é verificado com o Google Safe Browsing e links de phishing ou malware são rejeitados. Encurtar um link não esconde para onde ele leva: qualquer pessoa pode ver o destino do mesmo jeito.",
    },
    {
      type: "cta",
      title: "Encurte um link agora",
      text: "Grátis e sem cadastro. Crie uma conta só se quiser medir ou guardar o link.",
      href: "/encurtador-de-links",
      label: "Abrir o encurtador",
    },
  ],
  faqs: [
    { q: "Posso encurtar um link sem criar uma conta?", a: "Sim. Cole a URL no encurtador grátis do Bitlink e copie o resultado. Ele não pede e-mail nem senha." },
    { q: "Quanto tempo duram os links curtos anônimos?", a: "60 dias. Depois disso, os links anônimos que ninguém reivindicou são excluídos. Os links de uma conta grátis não expiram." },
    { q: "Consigo ver quantas pessoas clicaram em um link anônimo?", a: "Não até você criar uma conta. Cadastre-se pelo mesmo navegador e o link, com os cliques que já tem, é somado à sua conta." },
    { q: "Existe um limite de links que posso encurtar?", a: "Não há limite mensal. Há apenas um pequeno limite por hora e por rede para evitar spam; com uma conta grátis ele não afeta você." },
  ],
  related: ["acortador-de-links-gratis-sin-limite", "que-son-los-parametros-utm", "codigo-qr-editable"],
};

export default article;
