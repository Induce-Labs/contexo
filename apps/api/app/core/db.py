"""PostgreSQL connection helpers. Secrets never leave server-side config."""

from __future__ import annotations

from collections.abc import Iterator
from contextlib import contextmanager

import psycopg
from psycopg.rows import dict_row

from app.core.config import get_settings
from app.core.errors import AppError


class DatabaseNotConfiguredError(AppError):
    def __init__(self) -> None:
        super().__init__(
            "DATABASE_URL is not configured",
            code="database_not_configured",
            status_code=503,
        )


def get_database_url() -> str:
    url = get_settings().database_url
    if not url:
        raise DatabaseNotConfiguredError()
    return url


@contextmanager
def get_connection() -> Iterator[psycopg.Connection]:
    """Yield a connection. Caller owns commit/rollback for writes."""
    with psycopg.connect(get_database_url(), row_factory=dict_row) as conn:
        yield conn
