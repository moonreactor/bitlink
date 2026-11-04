from pydantic import BaseModel, Field, field_validator

from app.services.domain import normalize_domain, txt_lookup_names


class DomainSetRequest(BaseModel):
    domain: str = Field(min_length=3, max_length=255)

    @field_validator("domain")
    @classmethod
    def validate_domain(cls, v: str) -> str:
        return normalize_domain(v)


class DomainOut(BaseModel):
    custom_domain: str | None = None
    custom_domain_verified: bool = False
    custom_domain_verify_token: str | None = None
    txt_hostnames: list[str] = []
    cname_target: str | None = None


class DomainVerifyResponse(BaseModel):
    verified: bool
    message: str
    custom_domain: str | None = None
    custom_domain_verified: bool = False
    custom_domain_verify_token: str | None = None
    txt_hostnames: list[str] = []


def domain_payload(
    custom_domain: str | None,
    verified: bool,
    token: str | None,
    cname_target: str | None = None,
) -> DomainOut:
    return DomainOut(
        custom_domain=custom_domain,
        custom_domain_verified=verified,
        custom_domain_verify_token=token,
        txt_hostnames=txt_lookup_names(custom_domain) if custom_domain else [],
        cname_target=cname_target,
    )
