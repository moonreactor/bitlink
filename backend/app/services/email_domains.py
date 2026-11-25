"""Addresses that can never receive email: reserved test domains (RFC 2606 / RFC 6761) and
the usual placeholders people type when testing. Signing up with them is refused and we never
send to them (they only end up as failed sends and hurt the sender's reputation)."""

RESERVED_DOMAINS = frozenset(
    {
        "example.com",
        "example.net",
        "example.org",
        "example.edu",
        "localhost",
        "test.com",
        "test.test",
    }
)
RESERVED_SUFFIXES = (".example", ".test", ".invalid", ".localhost", ".local")


def email_domain(email: str) -> str:
    return email.rsplit("@", 1)[-1].strip().rstrip(".").lower()


def is_undeliverable(email: str) -> bool:
    domain = email_domain(email)
    if not domain or "." not in domain:
        return True
    if domain in RESERVED_DOMAINS or any(domain.endswith("." + d) for d in RESERVED_DOMAINS):
        return True
    return domain.endswith(RESERVED_SUFFIXES)
