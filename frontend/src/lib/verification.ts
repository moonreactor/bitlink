import { LANG_LABEL, type SiteLang } from "@/lib/i18n/site";

/** Kind of verified account. Drives the badge color and the schema.org type (Person vs Organization). */
export type VerificationType = "creator" | "public_figure" | "brand" | "organization";

export const VERIFICATION_TYPES: VerificationType[] = ["creator", "public_figure", "brand", "organization"];

/** Badge colors; kept in sync with backend/app/services/verification.py (used on QR codes). */
export const BADGE_COLOR: Record<VerificationType, string> = {
  creator: "#0ea5e9",
  public_figure: "#8b5cf6",
  brand: "#f59e0b",
  organization: "#64748b",
};

export function verificationType(value: string | null | undefined): VerificationType {
  return VERIFICATION_TYPES.includes(value as VerificationType) ? (value as VerificationType) : "creator";
}

/** Brands and organizations are companies, not people (schema.org Organization). */
export function isOrganization(value: string | null | undefined): boolean {
  const type = verificationType(value);
  return type === "brand" || type === "organization";
}

type VerificationCopy = {
  verified: string;
  types: Record<VerificationType, string>;
  title: (type: string) => string;
  explanation: string;
  since: (date: string) => string;
  domain: (domain: string) => string;
  close: string;
};

export const VERIFICATION_COPY: Record<SiteLang, VerificationCopy> = {
  en: {
    verified: "Verified",
    types: {
      creator: "Creator",
      public_figure: "Public figure",
      brand: "Brand",
      organization: "Organization",
    },
    title: (type) => `Verified account · ${type}`,
    explanation: "The Bitlink team reviewed this account and confirmed it belongs to who it says it does.",
    since: (date) => `Verified since ${date}`,
    domain: (domain) => `Owns the domain ${domain}`,
    close: "Close",
  },
  es: {
    verified: "Verificado",
    types: {
      creator: "Creador",
      public_figure: "Figura pública",
      brand: "Marca",
      organization: "Organización",
    },
    title: (type) => `Cuenta verificada · ${type}`,
    explanation: "El equipo de Bitlink revisó esta cuenta y confirmó que pertenece a quien dice ser.",
    since: (date) => `Verificada desde ${date}`,
    domain: (domain) => `Es dueña del dominio ${domain}`,
    close: "Cerrar",
  },
  pt: {
    verified: "Verificado",
    types: {
      creator: "Criador",
      public_figure: "Figura pública",
      brand: "Marca",
      organization: "Organização",
    },
    title: (type) => `Conta verificada · ${type}`,
    explanation: "A equipe do Bitlink revisou esta conta e confirmou que ela pertence a quem diz ser.",
    since: (date) => `Verificada desde ${date}`,
    domain: (domain) => `Dona do domínio ${domain}`,
    close: "Fechar",
  },
};

export function verifiedSince(iso: string | null | undefined, lang: SiteLang): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(LANG_LABEL[lang].html, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
