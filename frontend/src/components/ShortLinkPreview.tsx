import { BitlinkLogo } from "@/components/BitlinkLogo";
import { VerifiedMark } from "@/components/VerifiedBadge";
import { LANG_LABEL, type SiteLang } from "@/lib/i18n/site";
import { VERIFICATION_COPY, verificationType } from "@/lib/verification";

export type ShortLinkPreviewData = {
  code: string;
  url: string;
  host: string;
  title: string | null;
  created_at: string;
  owner: {
    username: string;
    display_name: string;
    avatar_url: string | null;
    is_verified: boolean;
    verification_type: string | null;
    verified_at: string | null;
  } | null;
};

const COPY: Record<
  SiteLang,
  {
    heading: string;
    sharedBy: string;
    anonymous: string;
    created: (date: string) => string;
    goesTo: string;
    continueTo: (host: string) => string;
    note: string;
  }
> = {
  en: {
    heading: "Link preview",
    sharedBy: "Shared by",
    anonymous: "Created without an account",
    created: (d) => `Created ${d}`,
    goesTo: "This link goes to",
    continueTo: (h) => `Continue to ${h}`,
    note: "Add a + to the end of any Bitlink short link to see where it goes before opening it.",
  },
  es: {
    heading: "Vista previa del enlace",
    sharedBy: "Compartido por",
    anonymous: "Creado sin cuenta",
    created: (d) => `Creado el ${d}`,
    goesTo: "Este enlace lleva a",
    continueTo: (h) => `Continuar a ${h}`,
    note: "Agregá un + al final de cualquier short link de Bitlink para ver a dónde lleva antes de abrirlo.",
  },
  pt: {
    heading: "Prévia do link",
    sharedBy: "Compartilhado por",
    anonymous: "Criado sem conta",
    created: (d) => `Criado em ${d}`,
    goesTo: "Este link leva para",
    continueTo: (h) => `Continuar para ${h}`,
    note: "Adicione um + ao final de qualquer link curto do Bitlink para ver para onde ele leva antes de abrir.",
  },
};

/** `bitlink.click/{code}+`: where a short link goes and who shared it, before opening it. */
export function ShortLinkPreview({ data, lang }: { data: ShortLinkPreviewData; lang: SiteLang }) {
  const t = COPY[lang];
  const v = VERIFICATION_COPY[lang];
  const owner = data.owner;
  const created = new Date(data.created_at).toLocaleDateString(LANG_LABEL[lang].html, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 text-slate-900">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <BitlinkLogo />
        </div>
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-lg font-bold">{t.heading}</h1>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.sharedBy}</p>
            {owner ? (
              <a href={`/${owner.username}`} className="mt-2 flex items-center gap-3 hover:opacity-80">
                {owner.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={owner.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-bold">
                    {owner.display_name.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="truncate">{owner.display_name}</span>
                    {owner.is_verified && <VerifiedMark type={owner.verification_type} lang={lang} size={16} />}
                  </span>
                  <span className="block text-xs text-slate-500">
                    @{owner.username}
                    {owner.is_verified && ` · ${v.verified} · ${v.types[verificationType(owner.verification_type)]}`}
                  </span>
                </span>
              </a>
            ) : (
              <p className="mt-2 text-sm text-slate-600">{t.anonymous}</p>
            )}
          </div>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.goesTo}</p>
            {data.title && <p className="mt-2 font-semibold">{data.title}</p>}
            <p className="mt-1 break-all text-sm text-slate-700">{data.url}</p>
            <p className="mt-2 text-xs text-slate-500">{t.created(created)}</p>
          </div>

          <a
            href={`/${data.code}`}
            rel="nofollow"
            className="mt-6 flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {t.continueTo(data.host || data.url)}
          </a>
        </section>
        <p className="mt-4 text-center text-xs text-slate-500">{t.note}</p>
      </div>
    </main>
  );
}
