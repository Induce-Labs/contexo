# Feature: Authentication (Neon Managed Better Auth)

## Purpose

Authenticate Contexo users with Neon Auth (Managed Better Auth), protect the dashboard, and verify JWTs on the FastAPI backend so ownership can be derived from verified claims only.

## Behaviour

- Email/password sign-up and sign-in on `/auth/sign-up` and `/auth/sign-in`
- Google sign-in via Neon’s shared Google provider (identity scopes only; not Drive)
- Dashboard routes (`/categories`, `/recents`, `/connections`) require a session; unauthenticated users redirect to `/auth/sign-in`
- Sign-out from the sidebar
- FastAPI `GET /api/v1/me` requires `Authorization: Bearer <JWT>` and upserts `profiles`

## Locations

- Web auth server/client: `apps/web/src/lib/auth/`
- Auth API proxy: `apps/web/src/app/api/auth/[...path]/route.ts`
- Route protection: `apps/web/src/proxy.ts` (Next.js 16)
- Auth UI: `apps/web/src/app/auth/`
- FastAPI JWT verify: `apps/api/app/core/auth.py`
- Me endpoint: `apps/api/app/api/routes/me.py`

## API endpoints

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| * | `/api/auth/*` (Next.js) | Cookie session | Neon Auth handler proxy |
| GET | `/api/v1/me` | Bearer JWT | Verified Neon Auth identity + profile upsert |

JWT verification uses EdDSA against `NEON_AUTH_JWKS_URL`, with `iss`/`aud` = origin of `NEON_AUTH_BASE_URL` (not the full auth path).

## Schema changes

Uses existing `profiles` table (`user_id` TEXT = Neon Auth user id as string). No new migrations in this feature.

## Configuration

| Variable | App | Notes |
|----------|-----|-------|
| `NEON_AUTH_BASE_URL` | web + api | From Neon Auth / `neon env pull` |
| `NEON_AUTH_COOKIE_SECRET` | web only | `openssl rand -base64 32`; never commit |
| `NEON_AUTH_JWKS_URL` | api (preferred) | From env pull; else derived from base URL |

Trusted domain for local: `http://localhost:3000` on the **development** branch. `allow_localhost` is enabled for Auth.

`neon.ts` already has `auth: true`.

## Dependencies introduced

- `@neon/auth` (web)
- `PyJWT`, `cryptography` (api)

## Security notes

- No secrets in `NEXT_PUBLIC_*` or extension bundles
- User id always from verified JWT `sub`/`id`, never from request body
- Google shared provider configured for identity only; Drive must use a separate connection flow later
- Production checklist (custom SMTP, disable localhost, custom Google OAuth client) not completed

## Known limitations

- Extension ↔ Contexo account linking not implemented yet (popup still API-health only)
- Production Auth hardening (todo “Managed Better Auth production readiness”) deferred
- Custom Google OAuth client (own GCP credentials) not required while using Neon shared Google; switch when you need production-owned OAuth branding/control
- Cross-user resource authz tests still belong with §4 + resource APIs

## Future improvements

- Extension token exchange / signed-in session
- Production trusted domains + disable localhost
- Optional email verification
- Promote Auth settings to `production` branch intentionally
