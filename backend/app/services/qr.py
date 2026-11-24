import io
from pathlib import Path
from urllib.parse import urlparse

import qrcode
from PIL import Image, ImageDraw
from qrcode.constants import ERROR_CORRECT_H
from qrcode.image.pil import PilImage
from qrcode.image.svg import SvgPathImage

from app.core.config import settings


def _public_path_url(path: str, *, base_url: str | None = None) -> str:
    base = (base_url or settings.PUBLIC_WEB_URL).rstrip("/")
    segment = path.lstrip("/")
    return f"{base}/{segment}"


def _load_logo(logo_url: str | None) -> Image.Image | None:
    if not logo_url:
        return None
    try:
        parsed = urlparse(logo_url)
        # Local media path: /media/{user_id}/{file}
        if parsed.path.startswith("/media/"):
            local = Path(settings.MEDIA_ROOT) / parsed.path[len("/media/") :]
            if local.is_file():
                return Image.open(local).convert("RGBA")
        # Absolute URL pointing at our media mount (any known API host)
        parsed_path = parsed.path or ""
        if "/media/" in parsed_path:
            rel = parsed_path.split("/media/", 1)[1]
            local = Path(settings.MEDIA_ROOT) / rel
            if local.is_file():
                return Image.open(local).convert("RGBA")
    except Exception:
        return None
    return None


def _draw_verified_badge(pad: Image.Image, color: str) -> None:
    """Verified check in the bottom-right corner of the logo pad (same look as the profile badge)."""
    w, h = pad.size
    size = max(14, w * 2 // 5)
    ring = max(2, size // 10)
    x0, y0 = w - size, h - size
    draw = ImageDraw.Draw(pad)
    draw.ellipse((x0, y0, w - 1, h - 1), fill=(255, 255, 255, 255))
    draw.ellipse((x0 + ring, y0 + ring, w - 1 - ring, h - 1 - ring), fill=color)
    # Check mark, in the same proportions as the "M20 6 9 17l-5-5" icon on the web.
    def pt(px: float, py: float) -> tuple[float, float]:
        inner = size - 2 * ring
        return (x0 + ring + inner * (0.2 + px * 0.6), y0 + ring + inner * (0.2 + py * 0.6))

    draw.line([pt(0.0, 0.5), pt(0.35, 0.85), pt(1.0, 0.15)], fill="white", width=max(2, size // 7), joint="curve")


def generate_profile_qr(
    username: str,
    *,
    fill_color: str = "#000000",
    back_color: str = "#ffffff",
    logo_url: str | None = None,
    fmt: str = "png",
    base_url: str | None = None,
    verified_color: str | None = None,
) -> bytes:
    url = _public_path_url(username, base_url=base_url)
    fmt = (fmt or "png").lower()
    if fmt not in {"png", "svg"}:
        fmt = "png"

    if fmt == "svg":
        qr = qrcode.QRCode(version=1, box_size=10, border=2, error_correction=ERROR_CORRECT_H)
        qr.add_data(url)
        qr.make(fit=True)
        img = qr.make_image(image_factory=SvgPathImage, fill_color=fill_color, back_color=back_color)
        buf = io.BytesIO()
        img.save(buf)
        return buf.getvalue()

    qr = qrcode.QRCode(version=1, box_size=12, border=2, error_correction=ERROR_CORRECT_H)
    qr.add_data(url)
    qr.make(fit=True)
    img: PilImage = qr.make_image(fill_color=fill_color or "black", back_color=back_color or "white")
    img = img.convert("RGB")

    logo = _load_logo(logo_url)
    if logo is not None:
        qr_w, qr_h = img.size
        logo_size = max(24, qr_w // 5)
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        # White pad behind logo for scannability
        pad = Image.new("RGBA", (logo_size + 12, logo_size + 12), (255, 255, 255, 255))
        pad.paste(logo, (6, 6), logo if logo.mode == "RGBA" else None)
        if verified_color:
            _draw_verified_badge(pad, verified_color)
        pos = ((qr_w - pad.size[0]) // 2, (qr_h - pad.size[1]) // 2)
        img = img.convert("RGBA")
        img.paste(pad, pos, pad)
        img = img.convert("RGB")

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
