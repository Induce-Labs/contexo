"""Apply a versioned SQL migration file using DATABASE_URL. Never prints the URL."""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
import psycopg

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parents[1]
load_dotenv(ROOT / ".env", override=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "migration",
        type=Path,
        help="Path to SQL migration relative to repo root or absolute",
    )
    args = parser.parse_args()

    migration_path = args.migration
    if not migration_path.is_absolute():
        migration_path = REPO / migration_path
    if not migration_path.is_file():
        print(f"Migration not found: {migration_path}", file=sys.stderr)
        sys.exit(1)

    url = os.environ.get("DATABASE_URL")
    if not url:
        print("DATABASE_URL is missing", file=sys.stderr)
        sys.exit(1)

    sql = migration_path.read_text(encoding="utf-8")
    version = migration_path.stem

    with psycopg.connect(url, autocommit=True) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'schema_migrations'
                """
            )
            has_bookkeeping = cur.fetchone() is not None
            if has_bookkeeping:
                cur.execute(
                    "SELECT 1 FROM schema_migrations WHERE version = %s",
                    (version,),
                )
                if cur.fetchone() is not None:
                    print(f"already_applied={version}")
                    return

            cur.execute(sql)

            cur.execute(
                """
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                ORDER BY table_name
                """
            )
            tables = [row[0] for row in cur.fetchall()]
            print(f"applied={version}")
            print("public_tables=" + ",".join(tables))
            print(f"neon_branch_env={os.environ.get('NEON_BRANCH', 'unknown')}")


if __name__ == "__main__":
    main()
