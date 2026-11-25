"""Copy and HTML for every email, in the profile's language (en / es / pt).

Each kind has a subject, a preheader (inbox preview), a heading, paragraphs and one CTA.
Values in ``{braces}`` come from the context passed to :func:`render`; they are HTML-escaped.
"""

from __future__ import annotations

import html
from dataclasses import dataclass

LANGUAGES = ("en", "es", "pt")
DEFAULT_LANGUAGE = "en"

# Kinds that respect the "tips & summaries" opt-out. The rest are about the account itself.
MARKETING_KINDS = frozenset({"complete_profile", "add_links", "verification_invite", "weekly_summary"})

COPY: dict[str, dict[str, dict]] = {
    "welcome": {
        "en": {
            "subject": "Welcome to Bitlink, {name} 👋",
            "preheader": "Your page is live. Here's how to make it shine.",
            "heading": "Your page is live!",
            "body": [
                "Hi {name}, welcome to Bitlink. Your page is already online at <b>{profile_url}</b>.",
                "Three quick things make it ready to share: add a photo, write a one-line bio and add your most important links.",
                "Then paste your link in your Instagram, TikTok or YouTube bio — and you're done.",
            ],
            "cta": "Set up my page",
        },
        "es": {
            "subject": "Bienvenido a Bitlink, {name} 👋",
            "preheader": "Tu página ya está online. Así la dejas lista.",
            "heading": "¡Tu página ya está online!",
            "body": [
                "Hola {name}, bienvenido a Bitlink. Tu página ya está en <b>{profile_url}</b>.",
                "Tres pasos rápidos la dejan lista para compartir: sube una foto, escribe una bio corta y agrega tus links más importantes.",
                "Después pega tu link en la bio de Instagram, TikTok o YouTube y listo.",
            ],
            "cta": "Configurar mi página",
        },
        "pt": {
            "subject": "Boas-vindas ao Bitlink, {name} 👋",
            "preheader": "Sua página já está no ar. Veja como deixá-la pronta.",
            "heading": "Sua página já está no ar!",
            "body": [
                "Oi {name}, boas-vindas ao Bitlink. Sua página já está em <b>{profile_url}</b>.",
                "Três passos rápidos deixam ela pronta para compartilhar: coloque uma foto, escreva uma bio curta e adicione seus links mais importantes.",
                "Depois cole seu link na bio do Instagram, TikTok ou YouTube e pronto.",
            ],
            "cta": "Configurar minha página",
        },
    },
    "password_reset": {
        "en": {
            "subject": "Reset your Bitlink password",
            "preheader": "This link is valid for 1 hour.",
            "heading": "Reset your password",
            "body": [
                "Someone (hopefully you) asked to reset the password of your Bitlink account.",
                "The button below is valid for 1 hour. If it wasn't you, ignore this email — your password stays the same.",
            ],
            "cta": "Choose a new password",
        },
        "es": {
            "subject": "Restablece tu contraseña de Bitlink",
            "preheader": "Este link es válido durante 1 hora.",
            "heading": "Restablece tu contraseña",
            "body": [
                "Alguien (esperamos que tú) pidió restablecer la contraseña de tu cuenta de Bitlink.",
                "El botón de abajo es válido durante 1 hora. Si no fuiste tú, ignora este email: tu contraseña no cambia.",
            ],
            "cta": "Elegir nueva contraseña",
        },
        "pt": {
            "subject": "Redefina sua senha do Bitlink",
            "preheader": "Este link vale por 1 hora.",
            "heading": "Redefina sua senha",
            "body": [
                "Alguém (esperamos que você) pediu para redefinir a senha da sua conta Bitlink.",
                "O botão abaixo vale por 1 hora. Se não foi você, ignore este email — sua senha continua a mesma.",
            ],
            "cta": "Escolher nova senha",
        },
    },
    "complete_profile": {
        "en": {
            "subject": "{name}, your page is almost ready",
            "preheader": "A couple of details and it's ready to share.",
            "heading": "Your page is almost ready",
            "body": [
                "Pages with a photo, a short bio and a few links get visited and clicked a lot more. Yours is still missing:",
                "{missing}",
                "Once it's complete you'll also be able to request the <b>verified badge</b> ✓.",
            ],
            "cta": "Finish my page",
            "missing": {"avatar": "A profile photo", "bio": "A short bio", "links": "Your first link"},
        },
        "es": {
            "subject": "{name}, tu página está casi lista",
            "preheader": "Un par de detalles y lista para compartir.",
            "heading": "Tu página está casi lista",
            "body": [
                "Las páginas con foto, una bio corta y algunos links reciben muchas más visitas y clics. A la tuya todavía le falta:",
                "{missing}",
                "Cuando esté completa también podrás pedir el <b>badge de verificado</b> ✓.",
            ],
            "cta": "Terminar mi página",
            "missing": {"avatar": "Una foto de perfil", "bio": "Una bio corta", "links": "Tu primer link"},
        },
        "pt": {
            "subject": "{name}, sua página está quase pronta",
            "preheader": "Alguns detalhes e ela fica pronta para compartilhar.",
            "heading": "Sua página está quase pronta",
            "body": [
                "Páginas com foto, uma bio curta e alguns links recebem muito mais visitas e cliques. Na sua ainda falta:",
                "{missing}",
                "Quando estiver completa você também poderá pedir o <b>selo de verificado</b> ✓.",
            ],
            "cta": "Terminar minha página",
            "missing": {"avatar": "Uma foto de perfil", "bio": "Uma bio curta", "links": "Seu primeiro link"},
        },
    },
    "add_links": {
        "en": {
            "subject": "Got more to share, {name}?",
            "preheader": "Ideas for your next link.",
            "heading": "Got more to share?",
            "body": [
                "Your page has {link_count} link(s). Every link is one more way for your audience to find you.",
                "Ideas: your latest video or post, a playlist, your shop or a product, a WhatsApp or email contact button, or an event.",
                "Tip: use <b>sections</b> to group them, and highlight the most important one.",
            ],
            "cta": "Add a link",
        },
        "es": {
            "subject": "¿Tienes algo más para compartir, {name}?",
            "preheader": "Ideas para tu próximo link.",
            "heading": "¿Algo más para compartir?",
            "body": [
                "Tu página tiene {link_count} link(s). Cada link es una forma más de que tu audiencia te encuentre.",
                "Ideas: tu último video o post, una playlist, tu tienda o un producto, un botón de contacto por WhatsApp o email, o un evento.",
                "Tip: usa <b>secciones</b> para agruparlos y destaca el más importante.",
            ],
            "cta": "Agregar un link",
        },
        "pt": {
            "subject": "Tem mais para compartilhar, {name}?",
            "preheader": "Ideias para o seu próximo link.",
            "heading": "Mais alguma coisa para compartilhar?",
            "body": [
                "Sua página tem {link_count} link(s). Cada link é mais um jeito de o seu público te encontrar.",
                "Ideias: seu último vídeo ou post, uma playlist, sua loja ou um produto, um botão de contato por WhatsApp ou email, ou um evento.",
                "Dica: use <b>seções</b> para agrupá-los e destaque o mais importante.",
            ],
            "cta": "Adicionar um link",
        },
    },
    "verification_invite": {
        "en": {
            "subject": "You can now request the verified badge ✓",
            "preheader": "Show visitors it's really you.",
            "heading": "Your page can be verified",
            "body": [
                "Good news, {name}: your page meets the requirements for the <b>verified badge</b>.",
                "The badge shows visitors your page is the real one, appears on your QR codes and protects your name: we block lookalike usernames and alert you if someone tries to impersonate you.",
                "Requesting it takes a minute — we review every request by hand.",
            ],
            "cta": "Request verification",
        },
        "es": {
            "subject": "Ya puedes pedir el badge de verificado ✓",
            "preheader": "Muestra a tus visitas que eres tú de verdad.",
            "heading": "Tu página puede ser verificada",
            "body": [
                "Buenas noticias, {name}: tu página cumple los requisitos para el <b>badge de verificado</b>.",
                "El badge muestra a tus visitas que tu página es la auténtica, aparece en tus códigos QR y protege tu nombre: bloqueamos usuarios parecidos y te avisamos si alguien intenta hacerse pasar por ti.",
                "Pedirlo lleva un minuto; revisamos cada solicitud a mano.",
            ],
            "cta": "Pedir verificación",
        },
        "pt": {
            "subject": "Você já pode pedir o selo de verificado ✓",
            "preheader": "Mostre aos visitantes que é você de verdade.",
            "heading": "Sua página pode ser verificada",
            "body": [
                "Boas notícias, {name}: sua página cumpre os requisitos do <b>selo de verificado</b>.",
                "O selo mostra aos visitantes que sua página é a verdadeira, aparece nos seus QR codes e protege seu nome: bloqueamos nomes de usuário parecidos e avisamos se alguém tentar se passar por você.",
                "Pedir leva um minuto — analisamos cada pedido manualmente.",
            ],
            "cta": "Pedir verificação",
        },
    },
    "verification_approved": {
        "en": {
            "subject": "You're verified ✓",
            "preheader": "Your badge is now live on your page.",
            "heading": "You're verified!",
            "body": [
                "Congratulations, {name}. Your page now shows the verified badge, and so do your QR codes.",
                "From now on we block usernames that look like yours and we'll let you know if someone tries to impersonate you.",
            ],
            "cta": "See my page",
        },
        "es": {
            "subject": "¡Ya estás verificado ✓!",
            "preheader": "Tu badge ya se ve en tu página.",
            "heading": "¡Ya estás verificado!",
            "body": [
                "Felicitaciones, {name}. Tu página ya muestra el badge de verificado, y también tus códigos QR.",
                "Desde ahora bloqueamos usuarios parecidos al tuyo y te avisaremos si alguien intenta hacerse pasar por ti.",
            ],
            "cta": "Ver mi página",
        },
        "pt": {
            "subject": "Você foi verificado ✓",
            "preheader": "Seu selo já aparece na sua página.",
            "heading": "Você foi verificado!",
            "body": [
                "Parabéns, {name}. Sua página já mostra o selo de verificado, e seus QR codes também.",
                "A partir de agora bloqueamos nomes de usuário parecidos com o seu e avisamos se alguém tentar se passar por você.",
            ],
            "cta": "Ver minha página",
        },
    },
    "verification_rejected": {
        "en": {
            "subject": "About your verification request",
            "preheader": "We couldn't approve it this time.",
            "heading": "We couldn't verify your page this time",
            "body": [
                "Hi {name}, we reviewed your request for the verified badge and couldn't approve it yet.",
                "{note}",
                "You can request it again in 14 days. Links to official profiles that mention your Bitlink page help a lot.",
            ],
            "cta": "Review requirements",
            "note_label": "Reviewer's note:",
        },
        "es": {
            "subject": "Sobre tu solicitud de verificación",
            "preheader": "Esta vez no pudimos aprobarla.",
            "heading": "Esta vez no pudimos verificar tu página",
            "body": [
                "Hola {name}, revisamos tu solicitud del badge de verificado y todavía no pudimos aprobarla.",
                "{note}",
                "Puedes volver a pedirlo en 14 días. Ayuda mucho agregar links a perfiles oficiales que mencionen tu página de Bitlink.",
            ],
            "cta": "Ver requisitos",
            "note_label": "Nota del revisor:",
        },
        "pt": {
            "subject": "Sobre seu pedido de verificação",
            "preheader": "Desta vez não conseguimos aprovar.",
            "heading": "Desta vez não conseguimos verificar sua página",
            "body": [
                "Oi {name}, analisamos seu pedido do selo de verificado e ainda não conseguimos aprovar.",
                "{note}",
                "Você pode pedir de novo em 14 dias. Ajuda muito incluir links de perfis oficiais que mencionem sua página do Bitlink.",
            ],
            "cta": "Ver requisitos",
            "note_label": "Nota do revisor:",
        },
    },
    "identity_alert": {
        "en": {
            "subject": "Someone may be impersonating you",
            "preheader": "{alert_count} new impersonation alert(s) on your account.",
            "heading": "Possible impersonation",
            "body": [
                "Hi {name}, we found {alert_count} new attempt(s) to use a name like yours on Bitlink (for example <b>{subject}</b>).",
                "We already blocked lookalike usernames. Check the details and report any page that copies you.",
            ],
            "cta": "Review alerts",
        },
        "es": {
            "subject": "Alguien podría estar haciéndose pasar por ti",
            "preheader": "{alert_count} alerta(s) nueva(s) de suplantación en tu cuenta.",
            "heading": "Posible suplantación",
            "body": [
                "Hola {name}, detectamos {alert_count} intento(s) nuevo(s) de usar un nombre parecido al tuyo en Bitlink (por ejemplo <b>{subject}</b>).",
                "Ya bloqueamos los usuarios parecidos. Revisa los detalles y denuncia cualquier página que te copie.",
            ],
            "cta": "Revisar alertas",
        },
        "pt": {
            "subject": "Alguém pode estar se passando por você",
            "preheader": "{alert_count} novo(s) alerta(s) de falsa identidade na sua conta.",
            "heading": "Possível falsa identidade",
            "body": [
                "Oi {name}, encontramos {alert_count} nova(s) tentativa(s) de usar um nome parecido com o seu no Bitlink (por exemplo <b>{subject}</b>).",
                "Já bloqueamos nomes de usuário parecidos. Veja os detalhes e denuncie qualquer página que copie você.",
            ],
            "cta": "Ver alertas",
        },
    },
    "weekly_summary": {
        "en": {
            "subject": "Your week on Bitlink: {views} visits",
            "preheader": "{views} visits and {clicks} clicks in the last 7 days.",
            "heading": "Your last 7 days",
            "body": [
                "Hi {name}, here's how your page did this week:",
                "{stats}",
                "{top_link}",
            ],
            "cta": "See analytics",
            "stats": {"views": "visits", "clicks": "link clicks"},
            "top_link": "Your most clicked link: <b>{title}</b>.",
        },
        "es": {
            "subject": "Tu semana en Bitlink: {views} visitas",
            "preheader": "{views} visitas y {clicks} clics en los últimos 7 días.",
            "heading": "Tus últimos 7 días",
            "body": [
                "Hola {name}, así le fue a tu página esta semana:",
                "{stats}",
                "{top_link}",
            ],
            "cta": "Ver estadísticas",
            "stats": {"views": "visitas", "clicks": "clics en links"},
            "top_link": "Tu link con más clics: <b>{title}</b>.",
        },
        "pt": {
            "subject": "Sua semana no Bitlink: {views} visitas",
            "preheader": "{views} visitas e {clicks} cliques nos últimos 7 dias.",
            "heading": "Seus últimos 7 dias",
            "body": [
                "Oi {name}, veja como foi sua página esta semana:",
                "{stats}",
                "{top_link}",
            ],
            "cta": "Ver estatísticas",
            "stats": {"views": "visitas", "clicks": "cliques em links"},
            "top_link": "Seu link mais clicado: <b>{title}</b>.",
        },
    },
}

FOOTER = {
    "en": {
        "marketing": "You get these tips because you have a Bitlink account.",
        "unsubscribe": "Unsubscribe from tips & summaries",
        "service": "This is a service email about your Bitlink account.",
    },
    "es": {
        "marketing": "Recibes estos consejos porque tienes una cuenta de Bitlink.",
        "unsubscribe": "Darme de baja de consejos y resúmenes",
        "service": "Este es un email de servicio sobre tu cuenta de Bitlink.",
    },
    "pt": {
        "marketing": "Você recebe estas dicas porque tem uma conta no Bitlink.",
        "unsubscribe": "Cancelar dicas e resumos",
        "service": "Este é um email de serviço sobre sua conta do Bitlink.",
    },
}

EMAIL_KINDS = tuple(COPY)


@dataclass
class RenderedEmail:
    subject: str
    html: str
    text: str


def pick_language(language: str | None) -> str:
    lang = (language or "").strip().lower()[:2]
    return lang if lang in LANGUAGES else DEFAULT_LANGUAGE


def _fill(template: str, ctx: dict[str, str]) -> str:
    """Format with escaped values; unknown placeholders stay empty instead of raising."""

    class _Safe(dict):
        def __missing__(self, key: str) -> str:
            return ""

    return template.format_map(_Safe({k: html.escape(str(v)) for k, v in ctx.items()}))


def _bullets(items: list[str]) -> str:
    rows = "".join(
        f'<li style="margin:0 0 6px">{html.escape(item)}</li>' for item in items
    )
    return f'<ul style="margin:0;padding-left:20px">{rows}</ul>'


def _stats_block(views: int, clicks: int, labels: dict[str, str]) -> str:
    cell = (
        '<td style="padding:14px 18px;background:#f4f1ff;border-radius:12px;text-align:center">'
        '<div style="font-size:26px;font-weight:700;color:#1e1b4b">{n}</div>'
        '<div style="font-size:13px;color:#6b7280">{label}</div></td>'
    )
    return (
        '<table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:separate;border-spacing:8px 0"><tr>'
        + cell.format(n=views, label=html.escape(labels["views"]))
        + cell.format(n=clicks, label=html.escape(labels["clicks"]))
        + "</tr></table>"
    )


def _strip_tags(value: str) -> str:
    import re

    text = re.sub(r"<li[^>]*>", "- ", value)
    text = re.sub(r"</li>|</tr>|<br\s*/?>", "\n", text)
    text = re.sub(r"<[^>]+>", "", text)
    return html.unescape(re.sub(r"\n{2,}", "\n", text)).strip()


def render(
    kind: str,
    language: str | None,
    ctx: dict,
    *,
    cta_url: str,
    unsubscribe_url: str | None = None,
) -> RenderedEmail:
    """Build subject + HTML + plain text for ``kind`` in ``language`` (falls back to English)."""
    lang = pick_language(language)
    copy = COPY[kind][lang]
    plain_ctx = {k: v for k, v in ctx.items() if isinstance(v, (str, int, float))}

    paragraphs: list[str] = []
    for raw in copy["body"]:
        if raw == "{missing}":
            items = [copy["missing"][m] for m in ctx.get("missing", []) if m in copy["missing"]]
            if items:
                paragraphs.append(_bullets(items))
        elif raw == "{note}":
            if ctx.get("note"):
                paragraphs.append(
                    f'<b>{html.escape(copy["note_label"])}</b> {html.escape(str(ctx["note"]))}'
                )
        elif raw == "{stats}":
            paragraphs.append(_stats_block(int(ctx.get("views", 0)), int(ctx.get("clicks", 0)), copy["stats"]))
        elif raw == "{top_link}":
            if ctx.get("top_link"):
                paragraphs.append(_fill(copy["top_link"], {"title": ctx["top_link"]}))
        else:
            paragraphs.append(_fill(raw, plain_ctx))

    subject = _fill(copy["subject"], plain_ctx)
    subject = html.unescape(subject)
    preheader = _fill(copy["preheader"], plain_ctx)
    heading = _fill(copy["heading"], plain_ctx)
    footer = FOOTER[lang]
    marketing = kind in MARKETING_KINDS and unsubscribe_url
    footer_html = (
        f'{html.escape(footer["marketing"])} <a href="{html.escape(unsubscribe_url)}" style="color:#6b7280">{html.escape(footer["unsubscribe"])}</a>'
        if marketing
        else html.escape(footer["service"])
    )
    cta_label = html.escape(copy["cta"])
    safe_cta = html.escape(cta_url, quote=True)
    body_html = "".join(
        f'<div style="margin:0 0 16px;font-size:16px;line-height:1.55;color:#374151">{p}</div>'
        for p in paragraphs
    )

    page = f"""<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><title>{html.escape(subject)}</title></head>
<body style="margin:0;padding:0;background:#f6f5fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">{preheader}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f5fb"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px">
<tr><td style="padding:0 4px 18px;font-size:22px;font-weight:800;color:#5b21b6;letter-spacing:-0.5px">bitlink</td></tr>
<tr><td style="background:#ffffff;border-radius:18px;padding:32px 28px;border:1px solid #ece9f7">
<h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;color:#111827">{heading}</h1>
{body_html}
<table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:8px"><tr><td style="border-radius:999px;background:#6d28d9">
<a href="{safe_cta}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px">{cta_label}</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:18px 8px;font-size:12px;line-height:1.5;color:#9ca3af;text-align:center">{footer_html}</td></tr>
</table></td></tr></table></body></html>"""

    text_parts = [_strip_tags(heading), ""] + [_strip_tags(p) for p in paragraphs]
    text_parts += ["", f"{copy['cta']}: {cta_url}", "", footer["service"] if not marketing else footer["marketing"]]
    if marketing:
        text_parts.append(f"{footer['unsubscribe']}: {unsubscribe_url}")
    return RenderedEmail(subject=subject, html=page, text="\n".join(text_parts))
