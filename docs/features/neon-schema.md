# Feature: Neon database, schema, and MCP setup

## Purpose

Link the Contexo Neon project, define the Phase 1 hybrid schema, and apply versioned SQL migrations on a development branch.

## Behaviour / outcomes

- Neon project **Contexo** linked via `.neon` / `neon.ts`
- Development branch used for schema work (`development`)
- Public tables created for profiles, categories, saved items, folders, assets, connections, and sync
- Categories seeded: Links, Images/Screenshots, Texts, PDFs
- `GET /api/v1/ready` checks Postgres connectivity
- Representative EXPLAIN plans use expected indexes (recents, link source, FTS)

## Locations

- Config: `neon.ts`, `.neon`
- Migrations: `db/migrations/001_phase1_core_schema.sql`
- Schema doc: `docs/database-schema.md`
- API DB helper: `apps/api/app/core/db.py`
- Scripts: `apps/api/scripts/apply_migration.py`, `inspect_schema.py`, `seed_explain_sample.py`

## API endpoints

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/health` | Liveness (no DB required) |
| GET | `/api/v1/ready` | Requires `DATABASE_URL` + successful `SELECT 1` |

## Schema changes

See `docs/database-schema.md`. Applied migration version: `001_phase1_core_schema`.

## Configuration

| Variable | Where | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `apps/api/.env` | Pooled URL; prefer development branch for local work |
| `DATABASE_URL_UNPOOLED` | `apps/api/.env` | Migrations/admin when needed |
| `NEON_BRANCH` / `NEON_BRANCH_ID` | pulled via `neon env pull` | Identity check |

Pull example:

```bash
npx neon env pull --branch development --file apps/api/.env -e DATABASE_URL -e DATABASE_URL_UNPOOLED -e NEON_BRANCH -e NEON_BRANCH_ID -e NEON_AUTH_BASE_URL -e NEON_AUTH_JWKS_URL
```

Apply migration:

```bash
cd apps/api
.\.venv\Scripts\python.exe scripts\apply_migration.py db/migrations/001_phase1_core_schema.sql
```

## Dependencies introduced

- `psycopg[binary]` in `apps/api`

## Security notes

- Do not commit `.env` / `.env.local`
- Do not paste connection strings into chat
- `connected_account_secrets` is for server-only credential material
- FastAPI remains authoritative for authorization; RLS deferred
- Neon CLI may print connection URIs in the terminal — treat those logs as sensitive

## Known limitations

- Neon MCP tools are not available in this Cursor agent session yet (CLI used instead). Re-enable/authorize Neon MCP in Cursor if you want IDE MCP inspect tools.
- Schema is on `development` only; `production` not migrated in this step
- Authorization / cross-user tests are not part of this section

## Future improvements

- Promote migration to `production` after review
- Optional RLS with a restricted role
- Neon MCP verify in Cursor after reload/auth
