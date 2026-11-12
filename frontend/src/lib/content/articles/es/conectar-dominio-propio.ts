import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "conectar-dominio-propio",
  slug: "conectar-dominio-propio",
  category: "guias",
  title: "Cómo conectar un dominio propio a tu link en bio (registro TXT + CNAME)",
  seoTitle: "Cómo conectar un dominio propio a tu link en bio",
  description:
    "Guía paso a paso para publicar tu link en bio en links.tumarca.com: verificación con registro TXT, CNAME, SSL y solución de problemas comunes.",
  published: "2026-11-09",
  keywords: ["dominio propio link en bio", "conectar dominio", "registro cname", "registro txt", "link en bio con mi dominio"],
  tldr:
    "Para usar tu dominio con Bitlink: 1) cargá el dominio en **Settings → Custom domain**; 2) agregá el **registro TXT** de verificación en `_bitlink-challenge.tudominio`; 3) creá un **CNAME** del subdominio hacia el host que te indica Bitlink; 4) tocá **verificar**. El certificado HTTPS se configura en tu proveedor de DNS o hosting.",
  takeaways: [
    "Usá un subdominio: links.tumarca.com o bio.tumarca.com.",
    "TXT = probar que el dominio es tuyo. CNAME = apuntarlo a Bitlink.",
    "Los cambios de DNS pueden tardar de minutos a algunas horas.",
    "Activá HTTPS en tu proveedor (por ejemplo, el proxy de Cloudflare).",
  ],
  cover: { src: "/landing/1542038784456-1ea8e935640e-900x500.webp", alt: "Fotógrafo sosteniendo una cámara en el aire en un bosque otoñal" },
  body: [
    { type: "h2", text: "Por qué usar un dominio propio" },
    {
      type: "ul",
      items: [
        "**Marca**: `links.tumarca.com` se ve más profesional que una URL genérica.",
        "**Confianza**: la gente hace clic más tranquila cuando reconoce el dominio.",
        "**Independencia**: el dominio es tuyo aunque cambies de herramienta en el futuro.",
      ],
    },
    { type: "h2", text: "Antes de empezar" },
    {
      type: "ul",
      items: [
        "Tener un dominio comprado (NIC Argentina, GoDaddy, Namecheap, Google/Squarespace Domains, Hostinger, etc.).",
        "Acceso al panel de DNS del dominio (donde se administran los registros).",
        "Elegir un **subdominio**: `links`, `bio` o `go` son los más comunes.",
      ],
    },
    {
      type: "callout",
      tone: "note",
      title: "¿Subdominio o dominio raíz?",
      text: "Recomendamos un subdominio. Muchos proveedores no permiten CNAME en el dominio raíz (tumarca.com) y además ahí suele estar tu web o tu correo.",
    },
    { type: "h2", text: "Paso a paso" },
    {
      type: "steps",
      name: "Cómo conectar un dominio propio a Bitlink",
      items: [
        { title: "Cargá el dominio en Bitlink", text: "Panel → Settings → Custom domain. Escribí el subdominio completo, por ejemplo `links.tumarca.com`, y guardá." },
        { title: "Copiá el token de verificación", text: "Bitlink te muestra un valor de verificación y los nombres de host donde podés crear el TXT." },
        { title: "Creá el registro TXT", text: "En tu proveedor de DNS: tipo TXT, nombre `_bitlink-challenge.links` (o `_bitlink-challenge.links.tumarca.com` según el panel), valor = el token." },
        { title: "Creá el registro CNAME", text: "Tipo CNAME, nombre `links`, valor = el host de Bitlink que aparece en Settings." },
        { title: "Configurá HTTPS", text: "Activá el certificado SSL en tu proveedor. En Cloudflare, por ejemplo, activando el proxy (nube naranja)." },
        { title: "Verificá", text: "Volvé a Settings y tocá verificar. Cuando el estado pase a “Verified”, tu página ya responde en tu dominio." },
      ],
    },
    { type: "h2", text: "Ejemplo de registros DNS" },
    {
      type: "table",
      caption: "Los valores exactos aparecen en tu panel de Bitlink",
      head: ["Tipo", "Nombre / Host", "Valor"],
      rows: [
        ["TXT", "_bitlink-challenge.links", "(tu token de verificación)"],
        ["CNAME", "links", "(host de Bitlink indicado en Settings)"],
      ],
    },
    { type: "h2", text: "Problemas comunes" },
    {
      type: "table",
      head: ["Síntoma", "Causa probable", "Solución"],
      rows: [
        ["No verifica", "El DNS todavía no se propagó", "Esperá unos minutos (a veces horas) y volvé a intentar"],
        ["No verifica", "El panel agregó el dominio dos veces al nombre", "Usá solo `_bitlink-challenge.links` si el panel completa el dominio solo"],
        ["“Sitio no seguro”", "Falta el certificado SSL", "Activá HTTPS en tu proveedor de DNS o hosting"],
        ["Abre otra web", "Hay un registro A o CNAME anterior para el mismo subdominio", "Borrá el registro viejo y dejá solo el CNAME a Bitlink"],
        ["El correo dejó de funcionar", "Se modificó el dominio raíz", "Usá un subdominio y no toques los registros MX"],
      ],
    },
    {
      type: "callout",
      tone: "tip",
      text: "Para chequear si el TXT ya es visible, podés usar herramientas públicas de consulta de DNS buscando el nombre `_bitlink-challenge.tudominio` y el tipo TXT.",
    },
    { type: "cta", title: "Tu marca en la barra de direcciones", text: "Dominio propio incluido gratis en Bitlink." },
  ],
  faqs: [
    { q: "¿Cuánto tarda en funcionar el dominio propio?", a: "Normalmente minutos, pero la propagación de DNS puede demorar algunas horas según el proveedor." },
    { q: "¿Puedo usar el dominio raíz (tumarca.com)?", a: "Se recomienda un subdominio como links.tumarca.com, porque muchos proveedores no permiten CNAME en el dominio raíz." },
    { q: "¿Bitlink me vende el dominio?", a: "No. Comprás el dominio en el registrador que prefieras y lo conectás gratis." },
    { q: "¿Mis links cortos usan mi dominio?", a: "El dominio propio sirve para tu página de perfil. Los links cortos se crean sobre bitlink.click." },
  ],
  related: ["novedad-dominio-propio-y-productos", "que-es-un-link-en-bio", "codigo-qr-editable"],
};

export default article;
