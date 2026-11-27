-- Contexo V1 Phase 1 core schema
-- Target: development branch first; do not modify neon_auth.*
-- Hybrid relational + JSONB; ownership via user_id TEXT (Neon Auth user id as text)

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Profiles (app-owned; keyed to Neon Auth user id string)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY,
    display_name TEXT,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Categories (system-defined content formats)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO categories (id, name, sort_order)
VALUES
    ('links', 'Links', 1),
    ('images', 'Images / Screenshots', 2),
    ('texts', 'Texts', 3),
    ('pdfs', 'PDFs', 4)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Saved items (canonical storage; folders hold references)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES categories (id),
    content_type TEXT NOT NULL
        CHECK (content_type IN ('link', 'image', 'text', 'pdf')),
    title TEXT,
    source_url TEXT,
    source_domain TEXT,
    source_section TEXT
        CHECK (
            source_section IS NULL
            OR source_section IN ('linkedin', 'youtube', 'x', 'websites', 'others')
        ),
    extracted_text TEXT,
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A')
        || setweight(to_tsvector('english', coalesce(extracted_text, '')), 'B')
    ) STORED,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- source_section is optional at insert time so save-first capture is not blocked;
-- the app should set linkedin/youtube/x/websites/others for Links items.

CREATE INDEX IF NOT EXISTS saved_items_user_created_at_idx
    ON saved_items (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS saved_items_user_category_created_at_idx
    ON saved_items (user_id, category_id, created_at DESC);

CREATE INDEX IF NOT EXISTS saved_items_user_category_source_section_idx
    ON saved_items (user_id, category_id, source_section);

CREATE INDEX IF NOT EXISTS saved_items_search_vector_gin_idx
    ON saved_items USING GIN (search_vector);

-- ---------------------------------------------------------------------------
-- Folders and multi-folder item references
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES categories (id),
    parent_folder_id UUID REFERENCES folders (id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT folders_name_not_blank CHECK (length(trim(name)) > 0)
);

CREATE INDEX IF NOT EXISTS folders_user_category_parent_idx
    ON folders (user_id, category_id, parent_folder_id);

CREATE TABLE IF NOT EXISTS folder_items (
    folder_id UUID NOT NULL REFERENCES folders (id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES saved_items (id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (folder_id, item_id)
);

CREATE INDEX IF NOT EXISTS folder_items_item_id_idx
    ON folder_items (item_id);

-- ---------------------------------------------------------------------------
-- Uploaded / captured binary assets (Neon Object Storage keys)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS uploaded_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    item_id UUID REFERENCES saved_items (id) ON DELETE SET NULL,
    storage_key TEXT NOT NULL,
    mime_type TEXT,
    byte_size BIGINT
        CHECK (byte_size IS NULL OR byte_size >= 0),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uploaded_assets_storage_key_not_blank CHECK (length(trim(storage_key)) > 0)
);

CREATE INDEX IF NOT EXISTS uploaded_assets_user_created_at_idx
    ON uploaded_assets (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS uploaded_assets_item_id_idx
    ON uploaded_assets (item_id);

-- ---------------------------------------------------------------------------
-- Connected apps + secrets + sync selection/state
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS connected_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    provider TEXT NOT NULL
        CHECK (provider IN ('google_drive', 'notion', 'dropbox', 'onedrive')),
    provider_account_id TEXT,
    status TEXT NOT NULL DEFAULT 'connected'
        CHECK (status IN ('connected', 'disconnected', 'error')),
    display_name TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    connected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    disconnected_at TIMESTAMPTZ,
    UNIQUE (user_id, provider, provider_account_id)
);

CREATE INDEX IF NOT EXISTS connected_accounts_user_provider_idx
    ON connected_accounts (user_id, provider);

CREATE TABLE IF NOT EXISTS connected_account_secrets (
    connected_account_id UUID PRIMARY KEY
        REFERENCES connected_accounts (id) ON DELETE CASCADE,
    encrypted_payload TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sync_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connected_account_id UUID NOT NULL
        REFERENCES connected_accounts (id) ON DELETE CASCADE,
    external_id TEXT NOT NULL,
    external_path TEXT,
    resource_type TEXT NOT NULL
        CHECK (resource_type IN ('folder', 'file')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (connected_account_id, external_id)
);

CREATE INDEX IF NOT EXISTS sync_selections_account_idx
    ON sync_selections (connected_account_id);

CREATE TABLE IF NOT EXISTS sync_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connected_account_id UUID NOT NULL
        REFERENCES connected_accounts (id) ON DELETE CASCADE,
    selection_id UUID REFERENCES sync_selections (id) ON DELETE SET NULL,
    external_id TEXT NOT NULL,
    item_id UUID REFERENCES saved_items (id) ON DELETE SET NULL,
    external_version TEXT,
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'deleted', 'error')),
    last_synced_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE (connected_account_id, external_id)
);

CREATE INDEX IF NOT EXISTS sync_states_account_status_idx
    ON sync_states (connected_account_id, status);

CREATE INDEX IF NOT EXISTS sync_states_item_id_idx
    ON sync_states (item_id);

-- Schema bookkeeping
CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO schema_migrations (version)
VALUES ('001_phase1_core_schema')
ON CONFLICT (version) DO NOTHING;

COMMIT;
