import pytest

from .conftest import register

PROFILE = "/api/v1/me/profile"


@pytest.mark.parametrize(
    ("sent", "stored"),
    [("es", "es"), ("pt", "pt"), ("en", "en"), ("ES", "es"), ("es-AR", "es"), ("pt-BR", "pt")],
)
def test_register_stores_the_signup_language(client, sent, stored):
    headers = register(client, "alice", language=sent)
    assert client.get(PROFILE, headers=headers).json()["language"] == stored


@pytest.mark.parametrize("sent", [None, "", "fr", "zz", "  "])
def test_register_ignores_unsupported_language(client, sent):
    body = {} if sent is None else {"language": sent}
    headers = register(client, "alice", **body)
    assert client.get(PROFILE, headers=headers).json()["language"] is None


def test_register_without_language_still_works(client):
    headers = register(client, "alice")
    assert client.get(PROFILE, headers=headers).status_code == 200


def test_update_language(client):
    headers = register(client, "alice")
    res = client.patch(PROFILE, json={"language": "pt"}, headers=headers)
    assert res.status_code == 200
    assert res.json()["language"] == "pt"
    assert client.get("/api/v1/public/alice").json()["language"] == "pt"


def test_update_language_rejects_unknown_values(client):
    headers = register(client, "alice", language="es")
    res = client.patch(PROFILE, json={"language": "fr"}, headers=headers)
    assert res.status_code == 422
    assert client.get(PROFILE, headers=headers).json()["language"] == "es"


def test_clear_language_goes_back_to_automatic(client):
    headers = register(client, "alice", language="es")
    res = client.patch(PROFILE, json={"clear_language": True}, headers=headers)
    assert res.status_code == 200
    assert res.json()["language"] is None


def test_other_updates_do_not_touch_language(client):
    headers = register(client, "alice", language="es")
    client.patch(PROFILE, json={"bio": "hola"}, headers=headers)
    assert client.get(PROFILE, headers=headers).json()["language"] == "es"


def test_update_requires_auth(client):
    assert client.patch(PROFILE, json={"language": "es"}).status_code == 401
