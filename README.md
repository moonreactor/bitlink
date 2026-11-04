# Bitlink

Link-in-bio MVP inspired by Linktree. All core features are free — no plans or billing.

## Stack

- **FastAPI** — API (`:8000`)
- **Next.js** — web app (`:3000`)
- **PostgreSQL** — database
- **Docker Compose** — local orchestration

## Quick start (local)

```bash
make build
make up
```

- Web: http://localhost:3000
- API docs: http://localhost:8000/docs

## Production (Railway)

Project **bitlink** on Railway with services:

| Service | Role | URL |
|---------|------|-----|
| `web` | Next.js | https://web-production-0b39d.up.railway.app |
| `bitlink` | FastAPI | https://bitlink-production.up.railway.app |
| `Postgres` | PostgreSQL | private network only |

API docs: https://bitlink-production.up.railway.app/docs

## Make targets

| Target | Description |
|--------|-------------|
| `make build` | Build Docker images |
| `make up` | Start stack + run migrations |
| `make down` | Stop containers |
| `make logs` | Follow logs |
| `make migrate` | Run Alembic migrations |
| `make shell-api` | Shell into API container |
| `make shell-db` | `psql` into Postgres |

## Superuser admin

Panel at `/admin` (superusers only): platform metrics, users, links.

Promote a user from the DB:

```bash
make shell-db
# then:
UPDATE users SET is_superuser = true WHERE email = 'you@example.com';
```

## Features (v1)

- Auth (register / login)
- Public profile at `/{username}`
- Unlimited links with reorder, featured, scheduling, thumbnails
- Themes & appearance
- Analytics (views, clicks, device, referrer)
- QR code, email capture, profile/link locks
- Always-visible “Create your Bitlink” CTA on public pages
- Superuser admin area (`/admin`)
