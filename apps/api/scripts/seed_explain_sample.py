"""Insert tiny representative rows and run EXPLAIN for core query shapes."""

from __future__ import annotations

import os
import sys
from pathlib import Path

from dotenv import load_dotenv
import psycopg

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")

SAMPLE_USER = "schema-seed-user"


def main() -> None:
    url = os.environ.get("DATABASE_URL")
    if not url:
        print("DATABASE_URL is missing", file=sys.stderr)
        sys.exit(1)

    with psycopg.connect(url) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO profiles (user_id, display_name, email)
                VALUES (%s, 'Schema Seed', 'seed@example.invalid')
                ON CONFLICT (user_id) DO NOTHING
                """,
                (SAMPLE_USER,),
            )
            cur.execute(
                """
                INSERT INTO saved_items (
                    user_id, category_id, content_type, title, source_url,
                    source_domain, source_section, extracted_text
                )
                VALUES
                    (%s, 'links', 'link', 'Example YouTube', 'https://youtube.com/watch?v=1',
                     'youtube.com', 'youtube', 'sample transcript text'),
                    (%s, 'texts', 'text', 'Quote', 'https://example.com/article',
                     'example.com', NULL, 'selected text body for search')
                ON CONFLICT DO NOTHING
                RETURNING id
                """,
                (SAMPLE_USER, SAMPLE_USER),
            )
            # ON CONFLICT DO NOTHING without constraint may not skip; use delete+insert for idempotency
            conn.rollback()

            cur.execute("DELETE FROM folder_items WHERE folder_id IN (SELECT id FROM folders WHERE user_id = %s)", (SAMPLE_USER,))
            cur.execute("DELETE FROM folders WHERE user_id = %s", (SAMPLE_USER,))
            cur.execute("DELETE FROM saved_items WHERE user_id = %s", (SAMPLE_USER,))
            cur.execute("DELETE FROM profiles WHERE user_id = %s", (SAMPLE_USER,))

            cur.execute(
                """
                INSERT INTO profiles (user_id, display_name, email)
                VALUES (%s, 'Schema Seed', 'seed@example.invalid')
                """,
                (SAMPLE_USER,),
            )
            cur.execute(
                """
                INSERT INTO saved_items (
                    user_id, category_id, content_type, title, source_url,
                    source_domain, source_section, extracted_text
                )
                VALUES
                    (%s, 'links', 'link', 'Example YouTube', 'https://youtube.com/watch?v=1',
                     'youtube.com', 'youtube', 'sample transcript text'),
                    (%s, 'texts', 'text', 'Quote', 'https://example.com/article',
                     'example.com', NULL, 'selected text body for search')
                RETURNING id
                """,
                (SAMPLE_USER, SAMPLE_USER),
            )
            item_ids = [row[0] for row in cur.fetchall()]
            cur.execute(
                """
                INSERT INTO folders (user_id, category_id, name)
                VALUES (%s, 'links', 'Reading list')
                RETURNING id
                """,
                (SAMPLE_USER,),
            )
            folder_id = cur.fetchone()[0]
            cur.execute(
                "INSERT INTO folder_items (folder_id, item_id) VALUES (%s, %s)",
                (folder_id, item_ids[0]),
            )

            plans = []
            cur.execute(
                """
                EXPLAIN (ANALYZE, BUFFERS)
                SELECT id, title, created_at
                FROM saved_items
                WHERE user_id = %s
                ORDER BY created_at DESC
                LIMIT 20
                """,
                (SAMPLE_USER,),
            )
            plans.append(("recents", "\n".join(r[0] for r in cur.fetchall())))

            cur.execute(
                """
                EXPLAIN (ANALYZE, BUFFERS)
                SELECT id, title
                FROM saved_items
                WHERE user_id = %s AND category_id = 'links' AND source_section = 'youtube'
                """,
                (SAMPLE_USER,),
            )
            plans.append(("link_source", "\n".join(r[0] for r in cur.fetchall())))

            cur.execute(
                """
                EXPLAIN (ANALYZE, BUFFERS)
                SELECT id, title
                FROM saved_items
                WHERE user_id = %s
                  AND search_vector @@ plainto_tsquery('english', 'transcript')
                """,
                (SAMPLE_USER,),
            )
            plans.append(("fts", "\n".join(r[0] for r in cur.fetchall())))

            conn.commit()

            for name, plan in plans:
                uses_index = "Index" in plan or "Bitmap" in plan
                print(f"explain={name} indexish={uses_index}")


if __name__ == "__main__":
    main()
