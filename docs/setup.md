# Local development setup

## Prerequisites

- Node.js 20+
- npm 10+
- Python 3.11+
- Chrome (for loading the extension)

## Repository layout

```text
contexo/
├── apps/web          # Next.js dashboard
├── apps/api          # FastAPI backend
├── apps/extension    # Chrome extension (Vite + CRXJS)
├── packages/contracts
├── db/migrations
└── docs/
```

## 1. Install JavaScript workspaces

From the repository root:

```bash
npm install
```

## 2. API virtualenv and dependencies

```bash
cd apps/api
python -m venv .venv
.\.venv\Scripts\activate          # Windows
# source .venv/bin/activate       # macOS/Linux
pip install -r requirements.txt
copy .env.example .env            # Windows
# cp .env.example .env            # macOS/Linux
```

Start the API:

```bash
cd apps/api
.\.venv\Scripts\uvicorn.exe app.main:app --reload --port 8000
```

Health check: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

## 3. Web dashboard

```bash
copy apps\web\.env.example apps\web\.env.local
npm run dev:web
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/categories`).

## 4. Browser extension

```bash
npm run dev:extension
```

In Chrome: `chrome://extensions` → enable Developer mode → **Load unpacked** → select `apps/extension/dist` (CRXJS writes the extension build there during `vite` / `vite build`).

## Environment variables

See root `.env.example` and per-app `.env.example` files. Never commit real secrets. Do not prefix secrets with `NEXT_PUBLIC_`.

## Neon

Project is linked via `.neon` / `neon.ts` (region `aws-ap-southeast-1`).

1. Prefer the **`development`** branch for local schema work.
2. Pull env (writes Neon vars only; does not print secrets to stdout beyond CLI status):

```bash
npx neon env pull --branch development --file apps/api/.env -e DATABASE_URL -e DATABASE_URL_UNPOOLED -e NEON_BRANCH -e NEON_BRANCH_ID -e NEON_AUTH_BASE_URL -e NEON_AUTH_JWKS_URL
```

3. Apply migrations from `apps/api`:

```bash
.\.venv\Scripts\python.exe scripts\apply_migration.py db/migrations/001_phase1_core_schema.sql
```

4. Readiness: `GET http://localhost:8000/api/v1/ready`

Schema details: [database-schema.md](./database-schema.md).

If Neon CLI auth expires: `npx neon login`.

## Auth (web)

Ensure `apps/web/.env.local` has:

- `NEON_AUTH_BASE_URL` (from `neon env pull` / development branch)
- `NEON_AUTH_COOKIE_SECRET` (generate with `openssl rand -base64 32` or Node crypto; never commit)

Then:

```bash
npm run dev:web
```

Open `/auth/sign-up` or `/auth/sign-in`. Protected pages redirect to sign-in when logged out.

Authenticated API calls to FastAPI need `Authorization: Bearer <session.token>` from `authClient.getSession()` (see JWT plugin docs). `GET /api/v1/me` exercises this.

## Documentation rule

When implementing or changing a feature, update the relevant docs in the same change (`docs/`, README links, schema/API notes). Documentation is part of feature completion.
