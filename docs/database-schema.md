# Contexo V1 Phase 1 — database schema

**Project:** Contexo (`restless-bonus-60434246`)  
**Region:** `aws-ap-southeast-1` (Singapore; Object Storage supported)  
**Dev branch:** `development` (`br-long-sun-bijxozpt`)  
**Migrations:** `db/migrations/` (source of truth)

## Purpose

Store each user’s saved items once, organise them via folders (references), support Recents/search, and track connected-app sync selections — without modifying Neon-managed `neon_auth` tables.

## Inspected baseline (before Contexo migrations)

Existing managed schema only:

- `neon_auth.user` (and related Managed Auth tables)
- `neon_auth.user.id` type on this project: **UUID** (not text). Application ownership columns store this id as **TEXT** (`user_id`) so we follow the PRD “string ownership key” rule while remaining compatible with UUID string forms.

## Design decisions

| Decision | Choice |
|----------|--------|
| Schema style | Hybrid: typed columns for filters/sorts/joins; `JSONB` for flexible metadata |
| Ownership | `user_id TEXT NOT NULL` on all user-owned tables; FastAPI enforces access |
| RLS | **Deferred** for Phase 1. FastAPI is the authoritative authorization layer. Revisit RLS only with a non-owner DB role + trusted per-request identity |
| Categories | Seeded system rows: `links`, `images`, `texts`, `pdfs` (provisional until product finalizes) |
| Item identity | One `saved_items` row; folders reference via `folder_items` |
| Full-text search | Generated `tsvector` on `saved_items` + GIN index |
| Provider tokens | Separate `connected_account_secrets` table (server-only access path) |
| Neon Auth tables | Never alter `neon_auth.*` |

## Tables

### `profiles`

App-owned profile keyed to Neon Auth user id.

- `user_id TEXT PRIMARY KEY`
- `display_name TEXT`
- `email TEXT`
- `created_at`, `updated_at TIMESTAMPTZ`

### `categories`

Predefined content-format categories (not user-created).

- `id TEXT PRIMARY KEY`
- `name TEXT NOT NULL`
- `sort_order INT NOT NULL`
- `created_at TIMESTAMPTZ`

### `saved_items`

Canonical saved content (extension captures, uploads, synced items).

- `id UUID PRIMARY KEY`
- `user_id TEXT NOT NULL`
- `category_id TEXT NOT NULL → categories(id)`
- `content_type TEXT NOT NULL` (`link` \| `image` \| `text` \| `pdf`)
- `title TEXT`
- `source_url TEXT`
- `source_domain TEXT`
- `source_section TEXT` (Links: `linkedin`, `youtube`, `x`, `websites`, `others`)
- `extracted_text TEXT` (search/index source material)
- `search_vector tsvector` generated from title + extracted_text
- `metadata JSONB NOT NULL DEFAULT '{}'`
- `created_at`, `updated_at TIMESTAMPTZ`

### `folders`

User folders/subfolders within a category.

- `id UUID PRIMARY KEY`
- `user_id TEXT NOT NULL`
- `category_id TEXT NOT NULL → categories(id)`
- `parent_folder_id UUID NULL → folders(id) ON DELETE CASCADE`
- `name TEXT NOT NULL`
- `created_at`, `updated_at TIMESTAMPTZ`

### `folder_items`

Many-to-many item references (no item duplication).

- `folder_id UUID → folders(id) ON DELETE CASCADE`
- `item_id UUID → saved_items(id) ON DELETE CASCADE`
- `added_at TIMESTAMPTZ`
- `PRIMARY KEY (folder_id, item_id)`

### `uploaded_assets`

Object-storage pointers for uploaded/captured binaries.

- `id UUID PRIMARY KEY`
- `user_id TEXT NOT NULL`
- `item_id UUID NULL → saved_items(id) ON DELETE SET NULL`
- `storage_key TEXT NOT NULL`
- `mime_type TEXT`
- `byte_size BIGINT`
- `metadata JSONB NOT NULL DEFAULT '{}'`
- `created_at TIMESTAMPTZ`

### `connected_accounts`

OAuth-connected providers (Drive, Notion, Dropbox, OneDrive).

- `id UUID PRIMARY KEY`
- `user_id TEXT NOT NULL`
- `provider TEXT NOT NULL`
- `provider_account_id TEXT`
- `status TEXT NOT NULL` (`connected` \| `disconnected` \| `error`)
- `display_name TEXT`
- `metadata JSONB NOT NULL DEFAULT '{}'`
- `connected_at`, `updated_at`, `disconnected_at TIMESTAMPTZ`
- Unique `(user_id, provider, provider_account_id)`

### `connected_account_secrets`

Server-only credential storage for connected accounts.

- `connected_account_id UUID PRIMARY KEY → connected_accounts(id) ON DELETE CASCADE`
- `encrypted_payload TEXT NOT NULL` (app-level encryption later; never return via API)
- `updated_at TIMESTAMPTZ`

### `sync_selections`

User-chosen folders/files to sync.

- `id UUID PRIMARY KEY`
- `connected_account_id UUID → connected_accounts(id) ON DELETE CASCADE`
- `external_id TEXT NOT NULL`
- `external_path TEXT`
- `resource_type TEXT NOT NULL` (`folder` \| `file`)
- `metadata JSONB NOT NULL DEFAULT '{}'`
- `created_at TIMESTAMPTZ`
- Unique `(connected_account_id, external_id)`

### `sync_states`

Maps external provider objects to Contexo items; supports update/delete sync.

- `id UUID PRIMARY KEY`
- `connected_account_id UUID → connected_accounts(id) ON DELETE CASCADE`
- `selection_id UUID NULL → sync_selections(id) ON DELETE SET NULL`
- `external_id TEXT NOT NULL`
- `item_id UUID NULL → saved_items(id) ON DELETE SET NULL`
- `external_version TEXT`
- `status TEXT NOT NULL`
- `last_synced_at TIMESTAMPTZ`
- `metadata JSONB NOT NULL DEFAULT '{}'`
- Unique `(connected_account_id, external_id)`

## Indexes (Phase 1 query patterns)

- Recents: `(user_id, created_at DESC)` on `saved_items`
- Category browse: `(user_id, category_id, created_at DESC)` on `saved_items`
- Link source sections: `(user_id, category_id, source_section)` on `saved_items`
- Search: GIN on `saved_items.search_vector`
- Folders: `(user_id, category_id, parent_folder_id)` on `folders`
- Folder membership by item: `(item_id)` on `folder_items`
- Connections: `(user_id, provider)` on `connected_accounts`

No blanket JSONB GIN indexes until a concrete containment query needs them.

## Deletion behaviour

| Event | Behaviour |
|-------|-----------|
| Delete saved item | Cascades `folder_items`; `uploaded_assets.item_id` / `sync_states.item_id` set null |
| Delete folder | Cascades child folders and `folder_items` (items remain) |
| Disconnect provider | Account `status=disconnected`; sync stops; previously synced `saved_items` remain |
| Detectable source deletion | Sync job deletes/marks corresponding `saved_items` when detectable (app logic) |

## Applying migrations

1. Prefer the `development` branch for local work.
2. Apply SQL files in `db/migrations/` in order.
3. Do not use MCP chat history as schema source of truth.
4. Promote to `production` only after review.

## Known limitations

- Neon MCP tools are not yet visible in this Cursor agent session; CLI + `psycopg` used for inspect/apply.
- Cross-user authorization tests belong with FastAPI (todo §4), not this migration alone.
- Seed data for EXPLAIN analysis can be added after first capture APIs exist.

## Future improvements

- Optional RLS with a restricted DB role
- App-level encryption helpers for `connected_account_secrets`
- Finalize category list when product confirms
