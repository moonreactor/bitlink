import io

import qrcode
from qrcode.image.pil import PilImage

from app.core.config import settings


def generate_profile_qr(username: str) -> bytes:
    url = f"{settings.PUBLIC_WEB_URL.rstrip('/')}/{username}"
    qr = qrcode.QRCode(version=1, box_size=10, border=2)
    qr.add_data(url)
    qr.make(fit=True)
    img: PilImage = qr.make_image(fill_color="black", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
