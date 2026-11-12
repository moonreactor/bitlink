import type { Article } from "../../types";

const article: Article = {
  lang: "es",
  key: "glosario-link-en-bio",
  slug: "glosario-link-en-bio",
  category: "guias",
  title: "Glosario del link en bio y los links cortos: 24 términos explicados simple",
  seoTitle: "Glosario: link en bio, links cortos, UTM, CTR y más",
  description:
    "Definiciones claras de link en bio, back-half, CTR, UTM, QR dinámico, CNAME, píxel, redirección 302 y otros términos de marketing digital.",
  published: "2026-11-12",
  keywords: ["glosario marketing digital", "qué es back-half", "qué es ctr", "qué es un qr dinámico", "qué es un cname", "glosario link en bio"],
  tldr:
    "Este glosario reúne los términos que más aparecen cuando armás un link en bio o creás links cortos: desde **back-half** y **CTR** hasta **UTM**, **QR dinámico**, **CNAME** y **píxel de seguimiento**, cada uno definido en una o dos oraciones.",
  takeaways: [
    "Definiciones cortas, pensadas para principiantes.",
    "Cada término enlaza a una guía cuando hay una más completa.",
    "Ordenado alfabéticamente.",
  ],
  cover: { src: "/landing/1517841905240-472988babdf9-360x440.webp", alt: "Mujer sonriendo apoyada en una pared azul" },
  body: [
    { type: "h2", text: "A – C" },
    {
      type: "ul",
      items: [
        "**Acortador de links**: herramienta que convierte una URL larga en una corta que redirige al destino y registra los clics. Ver [acortador de links gratis](/es/blog/acortador-de-links-gratis-sin-limite).",
        "**Back-half**: la parte final personalizable de un link corto. En `bitlink.click/promo`, el back-half es `promo`.",
        "**Bio (biografía)**: el texto del perfil en una red social, donde suele estar el único link clickeable.",
        "**Call to action (CTA)**: texto o botón que invita a hacer algo concreto: “Comprá”, “Reservá”, “Suscribite”.",
        "**Checkout**: la página donde se completa el pago de una compra.",
        "**Clic**: cada vez que alguien toca un link o botón.",
        "**CNAME**: registro DNS que hace que un subdominio (como `links.tumarca.com`) apunte a otro host. Ver [conectar dominio propio](/es/blog/conectar-dominio-propio).",
        "**Colección**: grupo de links con imágenes, en lista o grilla, dentro de un link en bio.",
        "**CTR (click-through rate)**: porcentaje de personas que hacen clic sobre las que vieron algo. CTR = clics ÷ visitas × 100.",
      ],
    },
    { type: "h2", text: "D – L" },
    {
      type: "ul",
      items: [
        "**DNS**: el sistema que traduce nombres de dominio en direcciones de servidores.",
        "**Dominio propio**: una dirección web tuya (tumarca.com) que podés usar para tu link en bio.",
        "**Embed**: contenido de otra plataforma (un video de YouTube, una canción de Spotify) que se reproduce dentro de tu página.",
        "**Fuente de tráfico**: el sitio o red desde donde llega una visita (Instagram, TikTok, Google, directo).",
        "**Geo-routing (redirección por país)**: enviar a cada visitante a un destino distinto según su país.",
        "**Link en bio**: página con varios enlaces que se coloca en el único espacio para links de un perfil. Ver [qué es un link en bio](/es/blog/que-es-un-link-en-bio).",
        "**Link programado**: enlace que aparece o desaparece automáticamente en una fecha y hora.",
      ],
    },
    { type: "h2", text: "P – Q" },
    {
      type: "ul",
      items: [
        "**Píxel de seguimiento**: código de Google Analytics o Meta (Facebook/Instagram) que registra visitas y conversiones para medir y crear audiencias de anuncios.",
        "**QR estático**: código QR que contiene directamente la URL final; no se puede editar.",
        "**QR dinámico (editable)**: código QR que apunta a un link corto, por lo que el destino se puede cambiar sin reimprimir. Ver [QR editable](/es/blog/codigo-qr-editable).",
      ],
    },
    { type: "h2", text: "R – V" },
    {
      type: "ul",
      items: [
        "**Redirección**: cuando una URL envía automáticamente al navegador a otra. Los acortadores usan redirecciones.",
        "**Registro TXT**: registro DNS de texto que se usa, entre otras cosas, para verificar que un dominio te pertenece.",
        "**SSL / HTTPS**: el certificado que cifra la conexión y muestra el candado en el navegador.",
        "**UTM**: parámetros que se agregan a una URL (`utm_source`, `utm_medium`, `utm_campaign`…) para identificar de dónde vino una visita. Ver [parámetros UTM](/es/blog/que-son-los-parametros-utm).",
        "**Visita**: cada vez que alguien abre tu página de link en bio. Junto con los clics, permite calcular el CTR.",
      ],
    },
    { type: "cta" },
  ],
  faqs: [
    { q: "¿Qué es el back-half de un link?", a: "Es la parte final de un link corto que podés personalizar, por ejemplo “promo” en bitlink.click/promo." },
    { q: "¿Qué diferencia hay entre un QR estático y uno dinámico?", a: "El estático lleva la URL final grabada y no se puede cambiar; el dinámico apunta a un link corto cuyo destino podés editar y además mide escaneos." },
    { q: "¿Qué significa CTR?", a: "Click-through rate: el porcentaje de personas que hicieron clic sobre el total que vio el link o la página." },
  ],
  related: ["que-es-un-link-en-bio", "que-son-los-parametros-utm", "codigo-qr-editable"],
};

export default article;
