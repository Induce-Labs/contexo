"""Inspect neon_auth.user columns (types only)."""

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
            SELECT column_name, data_type, udt_name, is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'neon_auth' AND table_name = 'user'
            ORDER BY ordinal_position
            """
        )
        for row in cur.fetchall():
            print(f"{row[0]}|{row[1]}|{row[2]}|{row[3]}")
