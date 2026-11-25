import type { ReportReason } from "../types";
import type { SiteLang } from "./site";

export type ReportCopy = {
  action: string;
  title: string;
  intro: string;
  target: string;
  wholePage: string;
  shortCode: string;
  shortCodePlaceholder: string;
  reason: string;
  reasons: Record<ReportReason, string>;
  details: string;
  detailsPlaceholder: string;
  submit: string;
  sending: string;
  cancel: string;
  close: string;
  thanks: string;
  thanksText: string;
  notFound: string;
  tooMany: string;
  failed: string;
  pageTitle: string;
  pageIntro: string;
};

export const REPORT_REASONS: ReportReason[] = [
  "phishing",
  "malware",
  "scam",
  "spam",
  "adult",
  "illegal",
  "impersonation",
  "other",
];

export const REPORT_COPY: Record<SiteLang, ReportCopy> = {
  en: {
    action: "Report",
    title: "Report this page",
    intro: "Tell us if this page or one of its links is malicious, deceptive or abusive.",
    target: "What are you reporting?",
    wholePage: "The whole page",
    shortCode: "Short link or code",
    shortCodePlaceholder: "bitlink.click/abc123 or abc123",
    reason: "Reason",
    reasons: {
      phishing: "Phishing (steals logins or data)",
      malware: "Malware or harmful download",
      scam: "Scam or fraud",
      spam: "Spam",
      adult: "Adult or inappropriate content",
      illegal: "Illegal content",
      impersonation: "Pretends to be someone else",
      other: "Something else",
    },
    details: "Details (optional)",
    detailsPlaceholder: "Anything that helps us review it faster.",
    submit: "Send report",
    sending: "Sending…",
    cancel: "Cancel",
    close: "Close",
    thanks: "Thanks for the report",
    thanksText: "Our team will review it. Never enter passwords or payment data on a link you don't trust.",
    notFound: "We couldn't find that page or link.",
    tooMany: "Too many reports. Please try again later.",
    failed: "Something went wrong. Please try again.",
    pageTitle: "Report a link",
    pageIntro:
      "Found a Bitlink short link or page being used for phishing, malware, scams or spam? Report it and we'll review it.",
  },
  es: {
    action: "Denunciar",
    title: "Denunciar esta página",
    intro: "Avisanos si esta página o alguno de sus links es malicioso, engañoso o abusivo.",
    target: "¿Qué querés denunciar?",
    wholePage: "La página completa",
    shortCode: "Link corto o código",
    shortCodePlaceholder: "bitlink.click/abc123 o abc123",
    reason: "Motivo",
    reasons: {
      phishing: "Phishing (roba cuentas o datos)",
      malware: "Malware o descarga dañina",
      scam: "Estafa o fraude",
      spam: "Spam",
      adult: "Contenido para adultos o inapropiado",
      illegal: "Contenido ilegal",
      impersonation: "Se hace pasar por otra persona o marca",
      other: "Otro motivo",
    },
    details: "Detalles (opcional)",
    detailsPlaceholder: "Cualquier dato que nos ayude a revisarlo más rápido.",
    submit: "Enviar denuncia",
    sending: "Enviando…",
    cancel: "Cancelar",
    close: "Cerrar",
    thanks: "Gracias por avisarnos",
    thanksText: "Nuestro equipo la va a revisar. Nunca ingreses contraseñas ni datos de pago en un link en el que no confiás.",
    notFound: "No encontramos esa página o link.",
    tooMany: "Demasiadas denuncias. Probá de nuevo más tarde.",
    failed: "Algo salió mal. Probá de nuevo.",
    pageTitle: "Denunciar un link",
    pageIntro:
      "¿Encontraste un link corto o una página de Bitlink usada para phishing, malware, estafas o spam? Denunciala y la revisamos.",
  },
  pt: {
    action: "Denunciar",
    title: "Denunciar esta página",
    intro: "Avise se esta página ou algum dos links dela é malicioso, enganoso ou abusivo.",
    target: "O que você quer denunciar?",
    wholePage: "A página inteira",
    shortCode: "Link curto ou código",
    shortCodePlaceholder: "bitlink.click/abc123 ou abc123",
    reason: "Motivo",
    reasons: {
      phishing: "Phishing (rouba contas ou dados)",
      malware: "Malware ou download perigoso",
      scam: "Golpe ou fraude",
      spam: "Spam",
      adult: "Conteúdo adulto ou impróprio",
      illegal: "Conteúdo ilegal",
      impersonation: "Finge ser outra pessoa ou marca",
      other: "Outro motivo",
    },
    details: "Detalhes (opcional)",
    detailsPlaceholder: "Qualquer informação que nos ajude a revisar mais rápido.",
    submit: "Enviar denúncia",
    sending: "Enviando…",
    cancel: "Cancelar",
    close: "Fechar",
    thanks: "Obrigado por avisar",
    thanksText: "Nossa equipe vai analisar. Nunca digite senhas ou dados de pagamento em um link em que você não confia.",
    notFound: "Não encontramos essa página ou link.",
    tooMany: "Muitas denúncias. Tente novamente mais tarde.",
    failed: "Algo deu errado. Tente novamente.",
    pageTitle: "Denunciar um link",
    pageIntro:
      "Encontrou um link curto ou uma página do Bitlink usada para phishing, malware, golpes ou spam? Denuncie e vamos analisar.",
  },
};
