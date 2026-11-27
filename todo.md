# Contexo --- V1 Phase 1 TODO

**Scope:** Tasks derived from the Phase 1 V1 product decisions discussed
so far, plus Neon database/MCP setup, Managed Better Auth, authorization, object storage, and database indexing/search tasks.\
**Status:** Planning checklist; tasks are unchecked until implementation
is completed.

## 1. Project foundation

-   [x] Set up the Contexo web application using Next.js, React, and TypeScript.
-   [x] Set up `apps/extension` as a separate React + TypeScript + Vite application using CRXJS.
-   [x] Set up the FastAPI backend using Python.
-   [x] Configure the Next.js frontend to call the FastAPI API.
-   [x] Set up Neon PostgreSQL after confirming project-region support (Auth → §3; Object Storage backend SDK still open below).
-   [x] Configure CRXJS to build the extension for Chrome Extension Manifest V3.
- [x] Enforce clear top-level separation between `apps/web` (Next.js), `apps/api` (FastAPI), and `apps/extension` (Vite + CRXJS, Manifest V3 extension).
- [x] Keep frontend UI/client code separate from backend business logic, data access, authorization, extraction, and sync logic.
- [x] Create a root `docs/` directory and establish documentation conventions before feature implementation.
- [x] Add a coding-agent instruction: whenever a feature is implemented or changed, update its feature documentation and any affected architecture/API/schema/setup docs.
- [x] Document each feature's behaviour, frontend/backend locations, API contracts, schema changes, setup/configuration, and limitations as applicable.
- [x] Add/update README setup instructions and links to the `docs/` documentation.
- [x] Treat documentation updates as part of feature completion and review.
-   [x] Keep V1 backend architecture as a modular monolith; avoid microservices.
-   [x] Configure environment variables and secrets for local, staging,
    and production environments.
-   [x] Establish basic error handling and logging.
-   [x] Define the initial data model for users, saved items, sources,
    categories, folders, folder-item relationships, uploaded assets, and
    connected accounts.
-   [x] Store each saved item once; represent its presence in multiple
    folders through relationships/references.

- [ ] Configure Neon Object Storage using private buckets by default and the S3-compatible SDK/interface.
- [x] Confirm the Neon project region supports Object Storage; provision buckets through `neon.ts`/CLI and verify backend environment credentials.
- [x] Keep object-storage credentials and upload/download authorization in the FastAPI backend; do not expose broad storage credentials to clients.

## 2. Neon database, schema, and MCP setup

- [x] Set up Neon MCP from the project root using the official `npx neon@latest init` workflow (for supported IDEs) and complete Neon authentication/authorization.
- [x] Alternatively, configure the managed Neon MCP endpoint `https://mcp.neon.tech/mcp` with OAuth or a supported API-key configuration; do not use deprecated SSE endpoints.
- [x] Verify Neon MCP tools inside this Cursor agent session (init wrote MCP config; CLI used for inspect/apply until MCP tools appear after reload/auth).
- [x] Inspect the target database, tables, columns, indexes, and schema before writing migrations (via Neon CLI + psycopg); review proposed SQL before execution.
- [x] Install/link the Neon CLI project and branch; prefer the pooled `DATABASE_URL` for application traffic.
- [x] Design and document the V1 schema before creating tables; identify primary keys, foreign keys, ownership fields, constraints, and deletion behavior.
- [x] Use a hybrid schema: typed columns for stable, frequently queried fields; JSONB for flexible/provider-specific metadata; relational tables for relationships.
- [x] Define the initial tables for users/profile data, saved items, categories, folders, item-folder relationships, uploaded assets, connected accounts, and sync selections/state as required by the approved Phase 1 scope.
- [x] Add user ownership and foreign-key constraints; avoid storing repeated or relational data as unvalidated JSON arrays.
- [x] Decide whether RLS is needed as defense-in-depth; do not assume it protects direct FastAPI queries unless the database role and trusted per-request user context enforce it.
- [x] Create version-controlled PostgreSQL SQL migrations under `db/migrations/`; keep migrations as the schema source of truth and do not rely on MCP chat history.
- [x] Add indexes based on actual query patterns: B-tree indexes for common filters/sorts/joins, GIN indexes for required JSONB queries, and GIN full-text index for search.
- [x] Keep searchable extracted content in a full-text-searchable representation (such as a `tsvector` column or maintained search field), rather than depending on JSONB metadata search.
- [x] Seed representative test data and validate retrieval/search with `EXPLAIN (ANALYZE, BUFFERS)` before tuning indexes.
- [ ] Test backend authorization and cross-user isolation for every relevant table and query path; test any RLS defense-in-depth separately if enabled.

## 3. Authentication

- [x] Enable Neon Auth (Managed Better Auth) in the Neon Console under Settings → Better Auth and record the Auth URL from Project Info.
- [x] Configure `auth: true` in the Neon project `neon.ts` when using the CLI config/deploy workflow; deploy and verify auth status.
- [x] Install `@neon/auth` in `apps/web` and follow the official Next.js App Router Managed Better Auth quickstart.
- [x] Configure `NEON_AUTH_BASE_URL` and a generated `NEON_AUTH_COOKIE_SECRET` in local/server environment files; never commit secrets.
- [x] Implement the auth server instance, `/api/auth/[...path]` route, client SDK, and protected-route middleware/proxy according to the Neon guide.
- [x] Configure trusted domains for localhost development (`http://localhost:3000`); production app/extension origins still open.
- [x] Define and test how the Next.js auth session/JWT is passed to the separate FastAPI backend. If using bearer JWTs, verify signature and claims server-side using Neon’s documented verification mechanism before authorizing requests.
- [x] Confirm the Neon Auth user ID type and use it consistently in Contexo ownership columns (do not assume UUID).

-   [x] Require an authenticated user for the dashboard (extension save,
    uploads, search, and connection management APIs still to be built).
-   [ ] Connect the browser extension to the user's authenticated
    Contexo account.

### Managed Better Auth production readiness

- [ ] Configure production trusted domains, custom SMTP, application name, Google OAuth credentials/callbacks, review email verification, and disable localhost access in production.
- [ ] Confirm production callback URLs, HTTPS, and trusted origins match the deployed web app and supported extension auth flow.


### Google sign-in

- [x] Confirm the current Neon Managed Auth/Better Auth-supported method for enabling Google social sign-in; do not silently switch to self-hosted Better Auth if Managed Auth does not support the required configuration.
- [ ] Create/configure a Google OAuth 2.0 Web application client in Google Cloud Console (optional while using Neon **shared** Google provider for local/dev).
- [ ] Configure exact local and production authorized redirect/callback URIs for the actual Neon Auth callback endpoint; confirm the correct callback URI from Neon Auth before entering it in Google Cloud Console.
- [ ] Configure Google provider credentials in the supported Neon Auth provider settings. Keep the Google OAuth client secret in server-side/managed provider secret configuration only.
- [ ] Store the Google OAuth client ID as provider configuration (it is a public identifier, not a secret); never expose the Google OAuth client secret.
- [x] Enable the Google sign-in button/flow in the Next.js UI using the supported Neon Auth client method.
- [x] Request only `openid`, `email`, and `profile` for sign-in. Do not grant Google Drive access as part of login; Drive integration must use a separate explicit consent/authorization flow.
- [ ] Test new-user sign-up, returning-user sign-in, account linking behaviour, sign-out, denied consent, callback/redirect errors, and verified-email handling.
- [ ] Test Google sign-in in local development and production using their respective exact redirect URIs and trusted domains.


## 4. Authorization and data isolation

-   [ ] Define ownership rules for users and their saved items, folders,
    uploads, search results, and connected accounts.
-   [ ] Enforce server-side authorization on every API operation; do not
    rely only on hiding UI controls.
-   [ ] Ensure a user can read, update, move, add to folders, or delete
    only resources they own or are explicitly permitted to access.
-   [ ] Ensure search results are restricted to the authenticated user's
    accessible content.
-   [ ] Ensure uploaded files and stored assets cannot be accessed by
    other users without permission.
-   [ ] Ensure connected-account credentials/tokens are protected and
    never exposed to the client unnecessarily.
-   [ ] Request only the provider permissions needed for selected
    content and sync operations.
-   [ ] Store the user's selected folders/files and enforce that sync is
    limited to those selections.
-   [ ] On disconnect, stop future syncs and preserve already-synced
    Contexo content.
-   [ ] Add authorization tests for cross-user access attempts
    (including guessing or changing resource IDs).
-   [ ] Add tests for unauthenticated access to protected endpoints.
-   [ ] Document the authorization model and any access-control
    assumptions.

### 4.1 Secrets, logging, and application security

- [ ] Inventory all secrets: Neon database URLs/passwords, Neon API/MCP keys, Neon Auth server/cookie secrets, Google OAuth client secret, object-storage credentials, connected-provider tokens, signing keys, and deployment credentials.
- [ ] Keep all secrets in server-side environment variables or the deployment platform's secret manager; never hardcode them or commit them to Git.
- [ ] Add safe `.env.example` placeholders only; ensure `.env`, `.env.local`, and other secret-bearing files are ignored by Git.
- [ ] Never use `NEXT_PUBLIC_` (or another client-exposure mechanism) for secrets. Keep secrets in server-only modules and prevent them from entering Next.js client bundles, extension bundles, static assets, or source maps.
- [ ] Ensure the Google OAuth client secret, Neon credentials, auth server/cookie secrets, object-storage keys, and provider access/refresh tokens are never sent to the browser.
- [ ] Keep the browser extension free of OAuth client secrets, database credentials, and broad storage/API keys; use the supported authenticated session flow and FastAPI for privileged operations.
- [ ] Do not log secrets, OAuth codes, access/refresh/ID tokens, cookies, session IDs, Authorization headers, database URLs, sensitive request bodies, or private saved content.
- [ ] Remove credential/token dumps and temporary debug statements from `console.log`, `console.error`, browser DevTools console, server logs, tracing, analytics, and crash reports.
- [ ] Implement structured server-side logging with request IDs and redaction; log only safe operational metadata.
- [ ] Return generic production errors to the client; do not expose stack traces, environment values, provider responses, or internal configuration in frontend errors.
- [ ] Disable production debug mode and verify that auth/OAuth callback failures cannot print sensitive values to browser or server consoles.
- [ ] Use secure `HttpOnly`, `Secure` (production), and appropriate `SameSite` session cookies; avoid storing sensitive tokens in `localStorage` or JavaScript-readable persistent storage.
- [ ] Enforce HTTPS, exact OAuth redirect URI allowlists, trusted origins, strict CORS allowlists, CSRF protection appropriate to cookie-based requests, and login/API rate limiting.
- [ ] Verify OAuth state, PKCE, nonce, issuer, audience, and token claims through the supported auth provider flow; do not implement a custom insecure token-validation shortcut.
- [ ] Use separate least-privilege credentials for development, staging, production, and MCP; do not paste production secrets into prompts, tickets, PRs, screenshots, or shared terminal output.
- [ ] Add secret scanning to Git/CI and review built frontend/extension assets to confirm no secrets are embedded.
- [ ] Document the secret inventory, environment-variable names (not values), rotation process, and incident response steps.
- [ ] If a secret is exposed in source, browser assets, logs, or console output, treat it as compromised: revoke/rotate it and review for misuse.

## 5. Dashboard

-   [x] Build the sidebar with **Categories**, **Recents**, and
    **Connections**.
-   [x] Build category cards showing category name, item count, and item
    previews.
-   [x] Keep top-level categories predefined; do not provide category
    creation.
-   [x] Build Recents as a view of existing items, not a separate copy.
-   [x] Build the Connections page and connection status/settings views.

## 6. Categories, sources, and folders

-   [ ] Implement the predefined content-format categories selected for
    V1.
-   [ ] Automatically classify saved items by content format.
-   [ ] For Links, create system-generated source sections
    (e.g. LinkedIn, YouTube, X, Websites).
-   [ ] Place unrecognised link sources in **Others**.
-   [ ] Do not create a new source section for every unknown website.
-   [ ] Allow users to create custom folders and subfolders within
    categories.
-   [ ] Allow users to upload files into folders.
-   [ ] Implement manual organisation and drag-and-drop.
-   [ ] Allow one item to be referenced in multiple folders without
    duplicating the item.
-   [x] Implement Grid and List views.
-   [x] Keep the selected view consistent while navigating categories.

## 7. Browser extension capture

- [x] Scaffold the extension with Vite, React, TypeScript, and CRXJS.
- [x] Configure the Manifest V3 manifest and CRXJS development/build workflow.
- [x] Implement the extension popup UI in `apps/extension`.
- [ ] Implement the required content script and background/service worker responsibilities, keeping permissions minimal.
- [x] Configure the extension to call the shared FastAPI backend rather than duplicating product logic.
- [x] Verify local development, production build, and loading the built extension in Chrome.

-   [ ] Implement webpage capture/save.
-   [ ] Save immediately when the user clicks Save; do not block on a
    folder picker.
-   [ ] Detect the content type and source.
-   [ ] Automatically place the item in the relevant category/source
    section.
-   [ ] Show the minimal success message **"Added to Contexo"**.
-   [ ] Implement saving selected/highlighted webpage text separately.
-   [ ] Store selected text under **Texts**.
-   [ ] Retain the source webpage URL for selected text.
-   [ ] Show **"Added to Contexo"** after selected-text capture.
-   [ ] Handle duplicate saves and save failures with clear feedback.

## 8. Item behaviour

-   [ ] Clicking a saved item opens its original source URL.
-   [ ] Do not build an in-app item preview/details panel in this phase.
-   [ ] Ensure saved item links open safely and consistently.

## 9. Search and indexing

-   [ ] Implement search across item titles.
-   [ ] Implement search across source names and websites.
-   [ ] Extract and index text from saved webpages where available.
-   [ ] Extract and index PDF text where supported.
-   [ ] Index saved text snippets.
-   [ ] Include uploaded files in search where text extraction is
    supported.
-   [ ] Include synced content from connected providers where access and
    indexing are supported.
-   [ ] Restrict all search results to the user's authorised content.
-   [ ] Re-index content when it is updated.
-   [ ] Handle indexing delay and failures without losing the saved
    item.

## 10. Connected apps and sync

Initial providers planned: - \[ \] Google Drive - \[ \] Notion - \[ \]
Dropbox - \[ \] OneDrive

For each provider: - \[ \] Implement account connection and provider
authorisation. - \[ \] Let the user choose specific folders and/or files
to sync. - \[ \] Sync only the selected content. - \[ \] Import new
items from selected locations. - \[ \] Update synced content when the
source item changes. - \[ \] Reflect source deletions in Contexo when
deletion can be detected. - \[ \] Ensure provider sync actions respect
the user's selected scope and authorisation. - \[ \] Show connection and
sync status. - \[ \] Allow the user to disconnect the provider. - \[ \]
On disconnect, stop future syncing but keep previously synced content
available. - \[ \] Handle provider errors, expired authorisation, rate
limits, and retryable sync failures.

## 11. Documentation

- [x] Create and maintain a root `docs/` directory.
- [x] Add an architecture overview documenting the frontend/backend/extension boundaries and request/data flow.
- [x] Add local development and environment setup documentation.
- [x] Add database schema documentation alongside `db/migrations/`.
- [ ] Add API documentation or a maintained API contract reference for the FastAPI backend.
- [x] Add feature documentation for each implemented feature.
- [x] Update relevant docs whenever behaviour, endpoints, schema, configuration, or architecture changes.
- [x] Ensure the coding agent includes documentation updates in the same implementation task/PR as the feature.
- [x] Review documentation for accuracy before marking a feature complete.

### Security release checks

- [ ] Inspect browser DevTools Network/Console and server logs during Google sign-in and protected API calls; confirm no secrets, tokens, auth codes, cookies, or database URLs are exposed.
- [ ] Inspect production Next.js and extension build output/source maps for secret leakage.
- [ ] Test that client-side requests cannot choose another user's ID or access another user's resources.
- [ ] Test expired/invalid sessions, OAuth callback errors, CSRF protections, CORS restrictions, and rate limits.
- [ ] Run secret scanning and dependency/security checks before release; rotate any credentials exposed during development.

## 13. Testing and release readiness

-   [ ] Test sign-up, sign-in, sign-out, and session expiry.
-   [ ] Test authorization and cross-user data isolation.
-   [ ] Test webpage save and selected-text save.
-   [ ] Test automatic categorisation and source detection.
-   [ ] Test unknown sources routing to Others.
-   [ ] Test folder creation, subfolders, uploads, drag-and-drop, and
    multi-folder references.
-   [ ] Test Grid/List switching and Recents.
-   [ ] Test search across metadata and extracted content.
-   [ ] Test connected-app selection, sync updates, deletion, and
    disconnect behaviour.
-   [ ] Test that disconnecting does not delete synced content.
-   [ ] Test that detected source deletion follows the agreed deletion
    behaviour.
-   [ ] Review privacy, permissions, and secure storage of credentials.
-   [ ] Verify all Phase 1 requirements against the PRD before marking
    Phase 1 complete.

## 14. Decisions to confirm during implementation

-   [ ] Confirm the exact final list of predefined categories.
-   [ ] Confirm precise semantics for **Move** versus **Add to folder**.
-   [ ] Confirm provider-specific capabilities and limitations for
    selecting folders/files and detecting changes/deletions.
-   [ ] Confirm which provider integrations can realistically be
    completed within the V1 schedule.
-   [ ] Confirm any account roles beyond individual user ownership, if
    needed.

## 15. Database, authentication, and authorization foundation

- [ ] Use **Neon PostgreSQL (Lakebase Postgres)** as the Contexo V1 database.
- [ ] Use **Neon Auth (Managed Better Auth)** as the authentication provider.
- [ ] Use **Neon Object Storage** for uploaded and captured assets, after confirming project-region availability.
- [ ] Use **PostgreSQL full-text search** for V1 search.
- [ ] Define user ownership fields and relationships using Neon Auth's documented user ID type (do not assume UUID).
- [ ] Enforce FastAPI server-side authorization on every protected resource/API operation.
- [ ] Use RLS only as additional protection after defining a valid connection-role and per-request identity strategy; test that privileged connections cannot bypass the intended policies.
- [ ] Keep Neon database, auth, Google OAuth client secret, and object-storage credentials server-side only; never include them in the web app bundle, browser extension bundle, or client-visible configuration.
- [ ] Store connected-provider OAuth credentials/tokens securely on the server and redact them from logs and error reporting.
- [ ] Test FastAPI authorization and cross-user access attempts; test RLS policies separately only if RLS is enabled.
- [ ] Document the ownership and access-control model.

## Neon documentation references

- Neon MCP server/setup: https://neon.com/docs/ai/neon-mcp-server
- Neon Managed Better Auth Next.js quickstart: https://neon.com/docs/auth/quick-start/nextjs-api-only
- Neon Auth production checklist: https://neon.com/docs/auth/production-checklist
- Neon Object Storage quickstart: https://neon.com/docs/storage/get-started

- Better Auth Google provider setup: https://better-auth.com/docs/authentication/google
