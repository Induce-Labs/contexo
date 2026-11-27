# Contexo --- Version 1, Phase 1 Product Requirements Document

**Document status:** Phase 1 scope captured from product decisions\
**Product:** Contexo\
**Version:** V1\
**Phase:** Phase 1\
**Audience:** Product, design, and engineering

> This document captures only the decisions made during the Phase 1
> discussion. It is not the complete V1 PRD. Remaining V1 functionality
> will be discussed and documented separately after this document is
> created.

------------------------------------------------------------------------

## 1. Product overview

Contexo is a personal information collection space. Users can save
useful information from the web, organise it by content format and
folders, connect selected cloud/knowledge apps, and search across the
information available in their Contexo space.

Phase 1 focuses on the dashboard structure, saved-item organisation,
browser extension capture behaviour, search scope, and connected-app
behaviour discussed so far.

## 2. Product goals

-   Make saving information from the web quick and frictionless.
-   Automatically organise saved items by content format and recognised
    source.
-   Let users organise information into their own folders without
    duplicating saved items.
-   Provide a Recents view for quickly returning to recently saved
    items.
-   Provide a unified search across captured and synced content.
-   Allow users to selectively connect cloud and knowledge apps and sync
    chosen content into Contexo.

## 3. Dashboard information architecture

The dashboard has three main sections:

1.  **Categories**
2.  **Recents**
3.  **Connections**

The sidebar should contain these sections only.

### 3.1 Categories

-   Categories are predefined by Contexo and based on content format.
-   Users cannot create new top-level categories.
-   Category cards should show a category name, item count, and previews
    of items within the category.
-   The dashboard should not use a canvas or visual-library layout as
    its primary experience.
-   The Categories page should display category folders only; it does
    not include a Recent section.

Examples of discussed content-format categories: - Links - Images /
Screenshots - Texts - PDFs

The exact final list of predefined categories remains to be confirmed in
a later discussion.

### 3.2 Source sections within Links

Links should include automatically generated source-based sections, such
as: - LinkedIn - YouTube - X - Websites

The app detects a link's source and places it in the relevant section.

-   Unknown or unrecognised link sources go into **Others**.
-   Contexo should not create a new source section for every unknown
    website.
-   Source sections are system-generated; users do not need to create
    them manually.
-   Users may create their own folders alongside these source sections.

### 3.3 Recents

-   Recents is a separate dashboard section.
-   It shows recently saved items across categories.
-   Recents is a view of existing items, not a duplicate storage
    location.

### 3.4 Connections

-   Connections is a dashboard section for connected apps and their sync
    settings.
-   The first planned providers are:
    -   Google Drive
    -   Notion
    -   Dropbox
    -   OneDrive
-   Other providers may be considered later; they are not part of the
    currently selected initial list.

## 4. Saved-item organisation

### 4.1 Custom folders

-   Users can create custom folders and subfolders within the predefined
    categories.
-   Users can upload files into their folders.
-   Users can manually organise items and use drag-and-drop.
-   Users can add the same saved item to multiple folders.
-   A saved item is stored once; folders hold references to it rather
    than creating duplicate items.

### 4.2 Grid and List views

-   Users can switch between Grid view and List view inside categories.
-   Grid view uses visual cards with previews.
-   List view provides a compact, scannable presentation.
-   The selected view should remain consistent as users navigate between
    categories.

### 4.3 Opening saved items

-   Clicking a saved item opens its original source URL directly.
-   Phase 1 does not include an in-app preview/details panel for saved
    items.

## 5. Browser extension capture

### 5.1 Save webpage

When the user clicks Save in the browser extension:

1.  The item is saved immediately.
2.  Contexo detects the content type and source.
3.  The item is automatically placed in the relevant category and source
    section.
4.  The extension displays a minimal confirmation: **"Added to
    Contexo"**.
5.  The user can organise the item into custom folders later.

The save action should not be blocked by a folder picker.

### 5.2 Save selected text

-   Users can select/highlight text on a webpage and save the selected
    text separately.
-   The selected text is stored under the **Texts** category.
-   The source webpage is retained so the user can trace the text back
    to its origin.
-   The extension displays **"Added to Contexo"** after saving.

## 6. Search

### 6.1 Search coverage

Search should cover both metadata and the actual text/content of saved
items.

Searchable information includes: - Item titles - Source names and
websites - Extracted text from saved webpages - Text inside PDFs, where
extraction is supported - Saved text snippets - Content synced from
connected apps, where the provider permits access and indexing

### 6.2 Unified search

-   Search should include items captured through the browser extension.
-   Search should include uploaded files.
-   Search should include content synced from Google Drive, Notion,
    Dropbox, and OneDrive.
-   Search results should identify the saved item so the user can open
    it.

Newly imported or updated content may take some time to become
searchable while it is being indexed.

## 7. Connected-app sync behaviour

### 7.1 Account connection and selection

-   Users connect an account through the provider's authorisation flow.
-   Users choose specific folders and/or files to sync.
-   Only the selected content should be synced into Contexo.
-   Users should be able to manage or disconnect a connection later.

### 7.2 Sync updates

For selected content: - New files/items should sync into Contexo. -
Edits to source files/items should update the synced content in
Contexo. - Deletions from the original source should be reflected in
Contexo when the provider makes the deletion detectable.

Exact provider capabilities and implementation details must be verified
during integration planning.

### 7.3 Disconnecting a provider

-   Disconnecting stops future syncing from that account.
-   Disconnecting does not delete content already synced into Contexo.
-   Previously synced content remains available for organisation and
    search.

### 7.4 Source deletion versus disconnect

-   Deleting a synced item from its original connected source should
    also delete its synced copy in Contexo, provided the deletion can be
    detected.
-   This behaviour is distinct from disconnecting the provider, which
    preserves previously synced content.

## 8. Phase 1 requirements summary

  -----------------------------------------------------------------------
  ID                                  Requirement
  ----------------------------------- -----------------------------------
  P1-DASH-01                          Dashboard sidebar contains
                                      Categories, Recents, and
                                      Connections.

  P1-CAT-01                           Categories are predefined
                                      content-format categories; users
                                      cannot create top-level categories.

  P1-CAT-02                           Category cards show name, item
                                      count, and item previews.

  P1-LINK-01                          Links are organised into automatic
                                      source sections.

  P1-LINK-02                          Unrecognised sources are placed in
                                      Others.

  P1-FOLDER-01                        Users can create folders and
                                      subfolders within categories.

  P1-FOLDER-02                        Users can upload files into folders
                                      and organise items manually,
                                      including drag-and-drop.

  P1-FOLDER-03                        One saved item can be referenced by
                                      multiple folders without
                                      duplicating the item.

  P1-VIEW-01                          Users can switch between Grid and
                                      List views.

  P1-ITEM-01                          Clicking an item opens its original
                                      source URL; no in-app details panel
                                      is included in this phase.

  P1-RECENT-01                        Recents shows recently saved items
                                      across categories without
                                      duplicating storage.

  P1-EXT-01                           Browser extension saves webpages
                                      immediately and automatically
                                      categorises them.

  P1-EXT-02                           Save confirmation displays "Added
                                      to Contexo".

  P1-EXT-03                           Users can save selected webpage
                                      text separately under Texts with
                                      its source retained.

  P1-SEARCH-01                        Search covers metadata and
                                      extracted content.

  P1-SEARCH-02                        Search includes captured, uploaded,
                                      and connected-app content where
                                      accessible.

  P1-CONN-01                          Initial planned providers are
                                      Google Drive, Notion, Dropbox, and
                                      OneDrive.

  P1-CONN-02                          Users select specific folders/files
                                      for syncing.

  P1-SYNC-01                          New and edited selected content
                                      syncs to Contexo.

  P1-SYNC-02                          Detectable source deletions are
                                      reflected in Contexo.

  P1-SYNC-03                          Disconnecting stops syncing but
                                      preserves previously synced
                                      content.
  -----------------------------------------------------------------------

## 9. Not yet specified

The following details were not decided in the Phase 1 discussion and
should be addressed in a later PRD phase rather than assumed here:

-   Exact final list of predefined content categories.
-   Detailed visual design and component specifications.
-   Exact folder actions and semantics for "move" versus "add to
    folder".
-   Search ranking, filters, and result presentation.
-   Supported capture formats beyond webpage and selected-text capture.
-   Exact authentication methods and detailed account-management flows.
-   Provider-specific API capabilities, sync frequency, conflict
    handling, and error states.
-   Whether folder/file selection can be changed after initial
    connection and how removals from a sync selection behave.
-   Detailed database schema and implementation-level API specifications.
-   Remaining V1 functionality not yet discussed.

## 10. Technical foundation and security decisions

The following technical choices have been selected for Contexo V1:

| Layer | Decision |
|---|---|
| Web frontend | Next.js with React and TypeScript |
| Backend/API | FastAPI with Python |
| Browser extension | React + TypeScript + Vite + CRXJS, Chrome Extension Manifest V3 |
| Database | Neon (PostgreSQL / Lakebase Postgres) |
| Authentication provider | Neon Auth (Managed Better Auth) |
| Authorization | FastAPI server-side authorization; RLS only where correctly configured and tested for the connection model |
| File storage | Neon Object Storage (S3-compatible; region availability must be confirmed) |
| V1 search | PostgreSQL full-text search |

### 10.1 Application architecture and codebase separation

- Keep the frontend and backend clearly separated in the repository and in their responsibilities.
- Use Next.js for the Contexo web dashboard, app routing, layouts, UI, and frontend state.
- Use FastAPI as the main backend/API for the web app and browser extension.
- Keep core product logic, data access, authorization, content extraction, integration logic, and sync logic in the FastAPI backend rather than duplicating them in frontend route handlers.
- Organise the backend as a modular monolith for V1; do not introduce microservices at this stage.
- Build the browser extension as a separate React + TypeScript application using Vite and CRXJS, targeting Chrome Extension Manifest V3.
- Use CRXJS as the Vite integration/build tooling for the extension; it does not replace Next.js or change the web dashboard stack.
- Keep the extension popup, content scripts, and background/service worker code inside `apps/extension`; the extension and web dashboard call the same FastAPI backend.
- Keep shared API schemas/contracts in a clearly defined shared location where useful; do not couple the frontend directly to backend implementation or database internals.

Suggested repository structure:

```text
contexo/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # FastAPI backend
│   └── extension/    # React + TypeScript + Vite + CRXJS extension (Manifest V3)
├── packages/
│   └── contracts/    # Shared API types/contracts, if needed
├── docs/             # Product, architecture, schema, and feature documentation
├── db/
│   └── migrations/  # Version-controlled PostgreSQL SQL migrations
└── README.md
```

Use Vite + CRXJS only for `apps/extension`; keep `apps/web` on Next.js and `apps/api` on FastAPI. The exact package manager/workspace tooling can be selected during implementation, but the separation of frontend, backend, extension, and documentation must be maintained.

### 10.2 Documentation maintenance

- Maintain a root `docs/` directory for project documentation.
- The coding agent must create or update documentation when implementing or changing a feature; documentation is part of the implementation, not an optional cleanup task.
- Document each implemented feature's purpose, user-facing behaviour, relevant frontend/backend components, API endpoints/contracts, data/schema changes, environment/configuration requirements, and important limitations where applicable.
- Keep architecture, database schema, API, setup/development, and feature documentation accurate as the code changes.
- Update the main README with setup instructions and links to relevant documentation.
- Do not claim a feature is fully implemented until its documentation has been updated and reviewed.

### 10.3 Authentication

- Use **Neon Auth (Managed Better Auth)** as the identity provider. Neon manages the Better Auth service and stores its auth data in the `neon_auth` schema on the Neon database branch.
- Use the official `@neon/auth` SDK for the Next.js App Router integration; do not install/configure a self-hosted Better Auth database adapter or run Better Auth migrations for Managed Auth.
- Enable Managed Auth in the Neon Console under **Settings → Better Auth** and obtain the Auth URL from **Project Info**.
- Support **Google sign-in** alongside the other enabled sign-in method(s). Configure Google as a social OAuth provider through the supported Neon Managed Auth/Better Auth configuration path; verify the exact provider configuration capability and callback URL against current Neon Auth documentation before implementation.
- Register the exact local and production OAuth callback/redirect URIs in Google Cloud Console. Keep the app's canonical auth base URL and trusted domains aligned with the deployed domains to prevent redirect mismatch or open-redirect issues.
- Request only the identity scopes required for sign-in (`openid`, `email`, `profile`). Google Drive access is a separate connected-app permission flow and must use separate, explicit consent/incremental authorization; Google sign-in alone must not grant Drive access.
- Treat the Google OAuth **client secret** as a server-side secret. A Google OAuth **client ID** is a public identifier and may be present in provider/client configuration where required, but it is not an authentication secret. Never expose the client secret.
- Keep authentication UI and browser session handling in the Next.js app. The browser extension must use a secure supported sign-in/session flow for the same Contexo account and must not contain OAuth client secrets or privileged credentials.
- Because the API is a separate FastAPI service, define and test the API authentication handoff before implementing protected endpoints. If using a Neon Auth JWT bearer token, verify its signature and claims server-side using Neon’s documented token-verification method; derive the user ID from the verified token/session, never from a client-supplied user ID.
- Handle sign-up, sign-in, sign-out, session expiry, and re-authentication.
- Configure trusted domains for local development and production. Before launch, follow Neon’s Managed Auth production checklist for custom SMTP, application name, OAuth credentials where applicable, email verification, and disabling localhost access.
- Managed Auth requires an eligible AWS-region Neon project and cannot be enabled when IP Allow or Private Networking is in use. Confirm these project constraints before provisioning.

### 10.4 Authorization and data isolation

- Enforce authorization in FastAPI for every protected API operation. The backend is the authoritative access-control layer for Contexo resources.
- Define ownership rules for users and their saved items, folders, folder-item relationships, uploaded assets, search results, and connected accounts.
- Derive the authenticated user identity from the validated Neon Auth session/token. Do not trust user IDs, ownership fields, or resource access claims supplied in request bodies.
- Ensure a user can read, update, move, add to folders, or delete only resources they own or are explicitly permitted to access.
- Ensure search results and uploaded assets are restricted to the authenticated user's accessible content.
- PostgreSQL RLS may be used as defense-in-depth only after choosing a connection role and a trusted per-request identity propagation strategy that actually enforces policies. A direct FastAPI connection using an owner/privileged role can bypass RLS; do not treat RLS as active protection without tests.
- Do not enable Neon Data API solely to make Neon Auth work. Use it only if Contexo deliberately adopts the PostgREST-compatible API; the V1 architecture uses FastAPI.
- Keep Neon database credentials, Neon Auth server secrets, object-storage credentials, and connected-provider OAuth tokens server-side. Never bundle privileged credentials in the web app or extension.
- Request only the provider permissions needed for selected content and sync operations.

### 10.5 Storage and search

- Use **Neon Object Storage** for uploaded and captured assets, using its S3-compatible interface and private buckets by default.
- Confirm the Neon project is in a region supported by Object Storage before relying on it. Current documented regions include AWS US East (Ohio), AWS US East (N. Virginia), AWS Europe (Frankfurt), and AWS Asia Pacific (Singapore); availability may expand.
- Provision buckets and environment credentials through the Neon CLI/config (`neon.ts`) workflow where appropriate. Keep object-storage credentials on the server and use short-scope credentials where applicable.
- Use PostgreSQL full-text search for V1 metadata and extracted-content search.
- Semantic/vector search is not part of this Phase 1 decision; it may be considered in a later phase if required.

### 10.5.1 Neon project, CLI, and MCP workflow

- Create or link the intended Neon project and development branch. Prefer the pooled `DATABASE_URL` for application traffic.
- Set up Neon MCP from the project root using the official Neon setup, preferably `npx neon@latest init` for supported IDEs (including Cursor, VS Code, and Claude Code). Authenticate and authorize the MCP connection.
- Alternatively, configure the managed Neon MCP endpoint `https://mcp.neon.tech/mcp` using OAuth or an API key supported by the MCP client. Do not use the deprecated HTTP+SSE endpoints.
- Scope the MCP connection to the intended Neon project and relevant tool categories where possible. Start with read-only access for inspection; authorize write access only when needed and review schema/data-changing actions before execution.
- Use Neon MCP to inspect the target project/branch, databases, tables, columns, indexes, and current schema before writing migrations. Confirm project and branch identity in every migration-related task.
- Treat Neon MCP as a development/IDE tool, not a production application runtime. Keep version-controlled SQL migrations in `db/migrations/` as the source of truth; review and test generated SQL before applying it.
- Refresh/restart the MCP client after configuration and verify that the Neon tools are connected to the intended project/branch.

### 10.5.2 Neon Auth and Object Storage provisioning

- Enable Managed Better Auth in Neon Console and configure `auth: true` in the Neon project config (`neon.ts`) where using the config/deploy workflow; deploy once through the documented Neon CLI workflow.
- Install `@neon/auth` in `apps/web` and implement the official Next.js App Router integration (server auth instance, auth API route, client, and protected-route middleware/proxy).
- Store `NEON_AUTH_BASE_URL` and a generated `NEON_AUTH_COOKIE_SECRET` in local/server environment configuration; do not commit secrets.
- Configure local and production trusted domains and verify auth lifecycle flows.
- If using Neon Object Storage, declare private buckets in `neon.ts`, deploy them, and verify the generated S3-compatible endpoint/credentials are available to the backend.
- Do not manually modify Neon-managed `neon_auth` tables or run Better Auth schema migrations against Managed Auth.

### 10.6 Secrets, credentials, and logging security

- Treat all database connection strings, Neon API/MCP keys, Neon Auth server secrets, cookie/session secrets, Google OAuth client secrets, object-storage access keys, connected-provider access/refresh tokens, signing keys, and private credentials as secrets.
- Keep secrets exclusively in server-side environment configuration or a deployment secret manager. Do not hardcode them in source code, commit them to Git, place them in documentation, or include real values in `.env.example`.
- Use server-only environment variable names and server-only modules for secrets. Never prefix a secret with `NEXT_PUBLIC_` or otherwise expose it through Next.js client bundles, client components, browser extension bundles, static assets, source maps, or frontend configuration.
- Only the Google OAuth client ID and other explicitly public configuration may be sent to the browser. The Google OAuth client secret must remain server-side/within the managed auth provider's secure configuration.
- Do not print or expose secrets, OAuth authorization codes, access/refresh/ID tokens, cookies, session IDs, authorization headers, database URLs, request bodies containing credentials, or private user content in `console.log`, `console.error`, browser DevTools console, server logs, tracing, analytics, crash reports, or error messages.
- Use structured logging with request IDs and safe operational metadata. Redact sensitive fields before logging; ensure exception handlers and debug mode cannot dump environment variables, request headers, token payloads, SQL connection strings, or full provider responses.
- In production, return generic error messages to clients; keep stack traces and detailed diagnostics in access-controlled server logs after redaction. Disable debug mode and remove temporary auth/OAuth logging before release.
- Store browser sessions in secure, `HttpOnly`, `SameSite` cookies where supported by the managed auth integration; use `Secure` in production and avoid persisting sensitive tokens in `localStorage` or other JavaScript-readable storage.
- Enforce HTTPS in production, exact OAuth redirect URI allowlists, trusted origins, strict CORS allowlists, CSRF protections appropriate to cookie-based requests, OAuth state/PKCE/nonce validation as supported by the provider flow, and login/API rate limiting.
- Apply least privilege to Neon, MCP, deployment, and storage credentials. Use separate development/staging/production credentials; rotate/revoke any credential suspected of exposure. Never place production secrets in an agent prompt, issue, PR, screenshot, or shared terminal output.
- Add `.env*` ignore rules while allowing safe example templates. Add secret scanning to Git/CI and review build output to confirm no secret is embedded in client assets.
- If a secret is accidentally logged, committed, or exposed to the browser, treat it as compromised: revoke/rotate it, remove the exposure where possible, and review logs/access for misuse.

### 10.7 Database schema and JSONB approach

Use a **hybrid relational + JSONB schema** rather than either extreme of placing every attribute in separate columns or putting the entire record into one JSONB field.

- Use the Neon Auth user ID as the application ownership key and preserve its documented string type; do not assume it is a UUID. Keep application profile data in a Contexo-owned table keyed to that ID rather than modifying the managed `neon_auth` schema.

- Keep stable, frequently filtered/sorted/joined fields in typed PostgreSQL columns (for example: `id`, `user_id`, `title`, `source_url`, `source_domain`, `content_type`, and timestamps).
- Use `JSONB` for flexible or source/provider-specific metadata and optional attributes whose shape varies by item type or integration.
- Keep relationships such as item-to-folder membership and connected-account ownership in relational tables with foreign keys and appropriate constraints.
- Do not use JSONB as a substitute for relational tables or put every field into a single opaque JSON document.
- Index only fields and query patterns that the product actually uses; avoid adding indexes indiscriminately.

### 10.8 Retrieval and search guidance

- Use B-tree indexes for common equality/range filters, sorting, and joins on typed columns.
- Use GIN indexes on JSONB only for JSONB containment/key queries that are actually needed. Consider `jsonb_path_ops` for containment-focused queries and `jsonb_ops` when key-existence operators are required; choose based on the query patterns.
- Use PostgreSQL full-text search with a `tsvector` search representation and a GIN index for searching titles and extracted text. Do not rely on generic JSONB queries as the primary full-text search implementation.
- Use `EXPLAIN (ANALYZE, BUFFERS)` with representative data to validate query plans and performance before adding more indexes.

### 10.9 Official Neon implementation references

- Neon MCP setup: https://neon.com/docs/ai/neon-mcp-server
- Neon Managed Better Auth Next.js quickstart: https://neon.com/docs/auth/quick-start/nextjs-api-only
- Neon Auth production checklist: https://neon.com/docs/auth/production-checklist
- Better Auth Google provider setup: https://better-auth.com/docs/authentication/google
- Neon Object Storage quickstart: https://neon.com/docs/storage/get-started

## 11. Phase boundary

This document represents **Phase 1 of V1 only**. It records the decisions made so far and does not attempt to define the remaining phases of V1. The next product discussion will establish the additional requirements, which can then be added in a subsequent PRD update.
