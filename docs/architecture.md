# Contexo architecture overview

**Scope:** Phase 1 of V1  
**Status:** Foundation scaffolded

## Purpose

Contexo is a personal information collection space. Users capture content from the web, organise it by content format and folders, connect selected cloud apps, and search across their space.

## Boundaries

| Area | Location | Responsibility |
|------|----------|----------------|
| Web dashboard | `apps/web` | Next.js App Router UI, layouts, client state, Neon Auth browser session |
| API | `apps/api` | FastAPI modular monolith: authz, data access, extraction, sync, storage |
| Browser extension | `apps/extension` | Manifest V3 capture UI (Vite + CRXJS); calls FastAPI only |
| Shared contracts | `packages/contracts` | Shared response/request types (no backend internals) |
| Schema | `db/migrations` | Version-controlled PostgreSQL SQL migrations |
| Docs | `docs/` | Architecture, setup, schema, API, and feature docs |

Product logic must not be duplicated in Next.js route handlers or the extension. The FastAPI backend is the authoritative layer for authorization and business rules.

## Request flow (current foundation)

1. Browser / extension → FastAPI (`/api/v1/...`)
2. Web app uses `NEXT_PUBLIC_API_BASE_URL` (public base URL only)
3. Health check: `GET /api/v1/health`

Authentication: Next.js holds the Neon Auth cookie session; FastAPI verifies short-lived EdDSA JWTs (`Authorization: Bearer`) via JWKS. Identity for ownership is always `sub`/`id` from verified claims.

## Stack decisions

- Frontend: Next.js + React + TypeScript
- Backend: FastAPI + Python
- Extension: React + TypeScript + Vite + CRXJS (Chrome MV3)
- Database: Neon PostgreSQL (to be provisioned)
- Auth: Neon Auth / Managed Better Auth (to be provisioned)
- Storage: Neon Object Storage (region must be confirmed)
- Search: PostgreSQL full-text search (later in Phase 1)

## Dashboard IA

Sidebar sections only: **Categories**, **Recents**, **Connections**. See `design.md` and the Phase 1 PRD.

## Known limitations

- Phase 1 core schema is applied on the Neon `development` branch
- Capture, folders, search, and provider sync APIs are not implemented yet
- Extension is not yet linked to the signed-in Contexo account
- RLS deferred; FastAPI must enforce ownership on every protected operation

## Future improvements

- JWT/session verification middleware on FastAPI
- Item/folder/search/connection routers and services
- Content extraction and FTS indexing pipeline
