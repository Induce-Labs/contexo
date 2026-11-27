# Contexo documentation

| Doc | Description |
|-----|-------------|
| [architecture.md](./architecture.md) | Frontend / API / extension boundaries and request flow |
| [setup.md](./setup.md) | Local development setup |
| [database-schema.md](./database-schema.md) | Phase 1 schema, indexes, deletion behaviour |
| [features/foundation.md](./features/foundation.md) | Foundation scaffold feature notes |
| [features/neon-schema.md](./features/neon-schema.md) | Neon project link, migrations, DB readiness |
| [features/authentication.md](./features/authentication.md) | Neon Auth, dashboard protection, FastAPI JWT |

Product sources of truth outside `docs/`:

- `contexo_v1_phase1_prd.md` — Phase 1 requirements
- `design.md` — Dashboard UI guidance
- `todo.md` — Implementation checklist

## Documentation convention

Whenever a feature is implemented or changed:

1. Add or update a feature doc under `docs/features/`
2. Update architecture, setup, schema, or API docs if they are affected
3. Link new docs from this index and the root README when relevant
4. Do not mark the feature complete until documentation is updated
