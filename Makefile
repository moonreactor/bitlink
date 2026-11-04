COMPOSE = docker compose

.PHONY: build up down logs migrate shell-api shell-db restart ps

build:
	$(COMPOSE) build

up:
	@test -f .env || cp .env.example .env
	$(COMPOSE) up -d
	@echo "Waiting for API to be healthy..."
	@until $(COMPOSE) exec -T api curl -sf http://localhost:8000/health >/dev/null 2>&1; do sleep 2; done
	$(COMPOSE) exec -T api alembic upgrade head
	@echo ""
	@echo "Bitlink is ready:"
	@echo "  Web:  http://localhost:3000"
	@echo "  API:  http://localhost:8000/docs"

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

migrate:
	$(COMPOSE) exec -T api alembic upgrade head

shell-api:
	$(COMPOSE) exec api bash

shell-db:
	$(COMPOSE) exec db psql -U $${POSTGRES_USER:-bitlink} -d $${POSTGRES_DB:-bitlink}

restart:
	$(COMPOSE) restart

ps:
	$(COMPOSE) ps
