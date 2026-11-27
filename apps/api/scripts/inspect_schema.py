"""Inspect non-system tables on the configured DATABASE_URL. Prints names only."""

from __future__ import annotations

import os
import sys
from pathlib import Path

from dotenv import load_dotenv
import psycopg

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

url = os.environ.get("DATABASE_URL")
if not url:
    print("DATABASE_URL is missing", file=sys.stderr)
    sys.exit(1)

with psycopg.connect(url) as conn:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
            ORDER BY table_schema, table_name
            """
        )
        rows = cur.fetchall()
        print(f"tables={len(rows)}")
        for schema, name in rows:
            print(f"{schema}.{name}")
        cur.execute("SELECT current_database(), current_user, current_setting('server_version')")
        db, user, version = cur.fetchone()
        print(f"database={db} user={user} pg={version}")
