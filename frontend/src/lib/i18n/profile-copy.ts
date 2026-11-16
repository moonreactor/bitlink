import type { SiteLang } from "./site";

export type ProfileCopy = {
  locked: string;
  password: string;
  unlock: string;
  cancel: string;
  open: string;
  enterCode: string;
  unlockLink: (title: string) => string;
  invalidPassword: string;
  invalidCode: string;
  subscribe: string;
  getUpdates: string;
  join: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  addEmailOrPhone: string;
  thanks: string;
  failed: string;
  close: string;
  share: string;
  copied: string;
  verified: string;
  tipDefault: string;
  madeWith: string;
  createCta: string;
  aboutTitle: string;
  aboutText: (name: string, joined: string) => string;
  aboutSocials: string;
  aboutLinks: string;
  discoverTitle: string;
  avatarAlt: (name: string) => string;
  lockedAria: string;
};

export const PROFILE_COPY: Record<SiteLang, ProfileCopy> = {
  en: {
    locked: "This page is locked",
    password: "Password",
    unlock: "Unlock",
    cancel: "Cancel",
    open: "Open",
    enterCode: "Enter code",
    unlockLink: (t) => `Unlock “${t}”`,
    invalidPassword: "Invalid password",
    invalidCode: "Invalid code",
    subscribe: "Subscribe",
    getUpdates: "Get updates",
    join: "Join",
    emailPlaceholder: "you@email.com",
    phonePlaceholder: "+1 555 123 4567",
    addEmailOrPhone: "Add an email or phone number.",
    thanks: "Thanks for subscribing!",
    failed: "Something went wrong",
    close: "Close",
    share: "Share",
    copied: "Link copied",
    verified: "Verified",
    tipDefault: "Tip me",
    madeWith: "Made with Bitlink",
    createCta: "Create your Bitlink — free",
    aboutTitle: "About this account",
    aboutText: (n, j) => `${n} has been on Bitlink since ${j}.`,
    aboutSocials: "Social profiles",
    aboutLinks: "Links on this page",
    discoverTitle: "Discover more",
    avatarAlt: (n) => `${n} — profile photo`,
    lockedAria: "Locked link",
  },
  es: {
    locked: "Esta página está bloqueada",
    password: "Contraseña",
    unlock: "Desbloquear",
    cancel: "Cancelar",
    open: "Abrir",
    enterCode: "Ingresá el código",
    unlockLink: (t) => `Desbloquear “${t}”`,
    invalidPassword: "Contraseña incorrecta",
    invalidCode: "Código incorrecto",
    subscribe: "Suscribirme",
    getUpdates: "Recibir novedades",
    join: "Unirme",
    emailPlaceholder: "vos@email.com",
    phonePlaceholder: "+54 9 11 1234 5678",
    addEmailOrPhone: "Ingresá un email o un teléfono.",
    thanks: "¡Gracias por suscribirte!",
    failed: "Algo salió mal",
    close: "Cerrar",
    share: "Compartir",
    copied: "Link copiado",
    verified: "Verificado",
    tipDefault: "Invitame un café",
    madeWith: "Hecho con Bitlink",
    createCta: "Creá tu Bitlink — gratis",
    aboutTitle: "Sobre esta cuenta",
    aboutText: (n, j) => `${n} está en Bitlink desde ${j}.`,
    aboutSocials: "Redes sociales",
    aboutLinks: "Links de esta página",
    discoverTitle: "Descubrí más",
    avatarAlt: (n) => `${n} — foto de perfil`,
    lockedAria: "Link bloqueado",
  },
  pt: {
    locked: "Esta página está bloqueada",
    password: "Senha",
    unlock: "Desbloquear",
    cancel: "Cancelar",
    open: "Abrir",
    enterCode: "Digite o código",
    unlockLink: (t) => `Desbloquear “${t}”`,
    invalidPassword: "Senha incorreta",
    invalidCode: "Código incorreto",
    subscribe: "Inscrever-se",
    getUpdates: "Receber novidades",
    join: "Entrar",
    emailPlaceholder: "voce@email.com",
    phonePlaceholder: "+55 11 91234 5678",
    addEmailOrPhone: "Informe um e-mail ou telefone.",
    thanks: "Obrigado por se inscrever!",
    failed: "Algo deu errado",
    close: "Fechar",
    share: "Compartilhar",
    copied: "Link copiado",
    verified: "Verificado",
    tipDefault: "Me pague um café",
    madeWith: "Feito com Bitlink",
    createCta: "Crie seu Bitlink — grátis",
    aboutTitle: "Sobre esta conta",
    aboutText: (n, j) => `${n} está no Bitlink desde ${j}.`,
    aboutSocials: "Redes sociais",
    aboutLinks: "Links desta página",
    discoverTitle: "Descubra mais",
    avatarAlt: (n) => `${n} — foto de perfil`,
    lockedAria: "Link bloqueado",
  },
};
