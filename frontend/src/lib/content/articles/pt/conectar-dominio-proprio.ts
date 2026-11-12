import type { Article } from "../../types";

const article: Article = {
  lang: "pt",
  key: "conectar-dominio-propio",
  slug: "conectar-dominio-proprio",
  category: "guias",
  title: "Como conectar um domínio próprio ao seu link na bio (registro TXT + CNAME)",
  seoTitle: "Como conectar um domínio próprio ao seu link na bio",
  description:
    "Guia passo a passo para publicar o seu link na bio em links.suamarca.com: verificação com registro TXT, CNAME, SSL e solução dos problemas mais comuns.",
  published: "2026-11-09",
  keywords: ["domínio próprio link na bio", "conectar domínio", "registro cname", "registro txt", "link na bio com meu domínio"],
  tldr:
    "Para usar o seu domínio com o Bitlink: 1) cadastre o domínio em **Settings → Custom domain**; 2) adicione o **registro TXT** de verificação em `_bitlink-challenge.seudominio`; 3) crie um **CNAME** do subdomínio para o host indicado pelo Bitlink; 4) clique em **verificar**. O certificado HTTPS é configurado no seu provedor de DNS ou hospedagem.",
  takeaways: [
    "Use um subdomínio: links.suamarca.com ou bio.suamarca.com.",
    "TXT = provar que o domínio é seu. CNAME = apontá-lo para o Bitlink.",
    "As alterações de DNS podem levar de minutos a algumas horas.",
    "Ative o HTTPS no seu provedor (por exemplo, o proxy da Cloudflare).",
  ],
  cover: { src: "/landing/1542038784456-1ea8e935640e-900x500.webp", alt: "Fotógrafo segurando uma câmera no ar em uma floresta no outono" },
  body: [
    { type: "h2", text: "Por que usar um domínio próprio" },
    {
      type: "ul",
      items: [
        "**Marca**: `links.suamarca.com` parece mais profissional do que uma URL genérica.",
        "**Confiança**: as pessoas clicam com mais tranquilidade quando reconhecem o domínio.",
        "**Independência**: o domínio é seu, mesmo que você troque de ferramenta no futuro.",
      ],
    },
    { type: "h2", text: "Antes de começar" },
    {
      type: "ul",
      items: [
        "Ter um domínio comprado (Registro.br, GoDaddy, Namecheap, Hostinger, Locaweb etc.).",
        "Acesso ao painel de DNS do domínio (onde os registros são administrados).",
        "Escolher um **subdomínio**: `links`, `bio` ou `go` são os mais comuns.",
      ],
    },
    {
      type: "callout",
      tone: "note",
      title: "Subdomínio ou domínio raiz?",
      text: "Recomendamos um subdomínio. Muitos provedores não permitem CNAME no domínio raiz (suamarca.com) e, além disso, é ali que costumam ficar o seu site e o seu e-mail.",
    },
    { type: "h2", text: "Passo a passo" },
    {
      type: "steps",
      name: "Como conectar um domínio próprio ao Bitlink",
      items: [
        { title: "Cadastre o domínio no Bitlink", text: "Painel → Settings → Custom domain. Digite o subdomínio completo, por exemplo `links.suamarca.com`, e salve." },
        { title: "Copie o token de verificação", text: "O Bitlink mostra um valor de verificação e os nomes de host onde você pode criar o TXT." },
        { title: "Crie o registro TXT", text: "No seu provedor de DNS: tipo TXT, nome `_bitlink-challenge.links` (ou `_bitlink-challenge.links.suamarca.com`, conforme o painel), valor = o token." },
        { title: "Crie o registro CNAME", text: "Tipo CNAME, nome `links`, valor = o host do Bitlink que aparece em Settings." },
        { title: "Configure o HTTPS", text: "Ative o certificado SSL no seu provedor. Na Cloudflare, por exemplo, ativando o proxy (nuvem laranja)." },
        { title: "Verifique", text: "Volte a Settings e clique em verificar. Quando o status mudar para “Verified”, a sua página já responde no seu domínio." },
      ],
    },
    { type: "h2", text: "Exemplo de registros DNS" },
    {
      type: "table",
      caption: "Os valores exatos aparecem no seu painel do Bitlink",
      head: ["Tipo", "Nome / Host", "Valor"],
      rows: [
        ["TXT", "_bitlink-challenge.links", "(seu token de verificação)"],
        ["CNAME", "links", "(host do Bitlink indicado em Settings)"],
      ],
    },
    { type: "h2", text: "Problemas comuns" },
    {
      type: "table",
      head: ["Sintoma", "Causa provável", "Solução"],
      rows: [
        ["Não verifica", "O DNS ainda não propagou", "Espere alguns minutos (às vezes horas) e tente de novo"],
        ["Não verifica", "O painel acrescentou o domínio duas vezes ao nome", "Use apenas `_bitlink-challenge.links` se o painel completar o domínio sozinho"],
        ["“Site não seguro”", "Falta o certificado SSL", "Ative o HTTPS no seu provedor de DNS ou hospedagem"],
        ["Abre outro site", "Há um registro A ou CNAME anterior para o mesmo subdomínio", "Apague o registro antigo e deixe só o CNAME para o Bitlink"],
        ["O e-mail parou de funcionar", "O domínio raiz foi modificado", "Use um subdomínio e não mexa nos registros MX"],
      ],
    },
    {
      type: "callout",
      tone: "tip",
      text: "Para conferir se o TXT já está visível, você pode usar ferramentas públicas de consulta de DNS, buscando o nome `_bitlink-challenge.seudominio` e o tipo TXT.",
    },
    { type: "cta", title: "Sua marca na barra de endereço", text: "Domínio próprio incluído de graça no Bitlink." },
  ],
  faqs: [
    { q: "Quanto tempo leva para o domínio próprio funcionar?", a: "Normalmente minutos, mas a propagação do DNS pode levar algumas horas, dependendo do provedor." },
    { q: "Posso usar o domínio raiz (suamarca.com)?", a: "Recomendamos um subdomínio como links.suamarca.com, porque muitos provedores não permitem CNAME no domínio raiz." },
    { q: "O Bitlink me vende o domínio?", a: "Não. Você compra o domínio no registrador que preferir e o conecta de graça." },
    { q: "Os meus links curtos usam o meu domínio?", a: "O domínio próprio vale para a sua página de perfil. Os links curtos são criados em bitlink.click." },
  ],
  related: ["novidade-dominio-proprio-e-produtos", "o-que-e-link-na-bio", "codigo-qr-editavel"],
};

export default article;
