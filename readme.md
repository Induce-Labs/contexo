# Contexo

Personal information collection space — Phase 1 of V1.

Capture useful information from the web, organise it by content format and folders, connect selected cloud apps, and search across your Contexo space.

## Monorepo

```text
apps/web          Next.js dashboard (Categories, Recents, Connections)
apps/api          FastAPI modular monolith
apps/extension    Chrome Manifest V3 extension (Vite + CRXJS)
packages/contracts Shared API types
db/migrations     PostgreSQL SQL migrations
docs/             Architecture, setup, and feature documentation
```

## Quick start

See [docs/setup.md](docs/setup.md) for full instructions.

```bash
# JS workspaces
npm install

# API
cd apps/api
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\uvicorn.exe app.main:app --reload --port 8000

# Web (new terminal, repo root)
npm run dev:web

# Extension (new terminal, repo root)
npm run dev:extension
```

## Product docs

- [Phase 1 PRD](contexo_v1_phase1_prd.md)
- [Design](design.md)
- [TODO](todo.md)
- [Architecture](docs/architecture.md)

## Status

Foundation, Neon **development** schema, and Auth (email/password + Google shared provider, dashboard protection, FastAPI JWT `/me`) are in place. Extension account linking, production Auth hardening, and later product APIs wait for an explicit go-ahead.
