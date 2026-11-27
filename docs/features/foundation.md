# Feature: Phase 1 foundation scaffold

## Purpose

Establish the monorepo boundaries and runnable skeletons for the web dashboard, FastAPI API, and Chrome extension so Phase 1 product features can land on a stable base.

## Behaviour

- Web dashboard shows Categories (default), Recents, and Connections with empty-state UI matching Phase 1 IA
- Category cards show name, item count, and preview area; Links detail shows source section placeholders
- Grid/List toggle preference is stored in `localStorage` for category navigation consistency
- API exposes `GET /api/v1/health`
- Extension popup can reach the API health endpoint; full save capture is not yet wired

## Locations

- Frontend: `apps/web`
- Backend: `apps/api`
- Extension: `apps/extension`
- Contracts: `packages/contracts`
- Migrations: `db/migrations` (placeholder)

## API endpoints

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/api/v1/health` | None | Liveness for local wiring |

### Response

```json
{
  "status": "ok",
  "service": "Contexo API",
  "environment": "development"
}
```

Errors use `{ "error": { "code", "message", "details" } }`.

## Schema changes

None yet.

## Configuration

| Variable | App | Notes |
|----------|-----|-------|
| `CORS_ORIGINS` | API | Comma-separated browser origins |
| `ENVIRONMENT` / `DEBUG` | API | Logging and OpenAPI docs |
| `NEXT_PUBLIC_API_BASE_URL` | Web | Public API base URL only |

## Dependencies introduced

- Web: Next.js 16, React 19, Tailwind 4
- API: FastAPI, Uvicorn, Pydantic Settings, structlog, httpx
- Extension: Vite 6, `@crxjs/vite-plugin`, React 19

## Security notes

- No secrets committed; `.env*` ignored except `*.example`
- Extension has minimal permissions (`activeTab`, `storage`) and localhost API host permission only
- CORS allowlist is explicit; credentials allowed for future cookie/session handoff
- Structured logs redact common sensitive keys

## Known limitations

- Neon Auth, database, object storage, and authorization middleware are not wired
- Capture, folders, search, and provider OAuth are not implemented
- Connection **Connect** buttons are disabled until provider work starts

## Future improvements

- Neon provisioning + schema migrations
- Auth handoff and protected routes
- Item capture and organisation APIs feeding the dashboard
