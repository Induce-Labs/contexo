"""Health and readiness endpoints."""

from fastapi import APIRouter

from app.core.config import get_settings
from app.core.db import DatabaseNotConfiguredError, get_connection
from app.schemas.health import HealthResponse, ReadyResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        environment=settings.environment,
    )


@router.get("/ready", response_model=ReadyResponse)
def get_ready() -> ReadyResponse:
    """Readiness: verifies DATABASE_URL is set and Postgres accepts connections."""
    from app.core.errors import AppError

    settings = get_settings()
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1 AS ok")
                row = cur.fetchone()
                if not row or row["ok"] != 1:
                    raise AppError(
                        "Database readiness query did not return 1",
                        code="database_not_ready",
                        status_code=503,
                    )
    except DatabaseNotConfiguredError:
        raise
    except AppError:
        raise
    except Exception as exc:
        raise AppError(
            f"Database connection failed: {type(exc).__name__}",
            code="database_connection_failed",
            status_code=503,
        ) from exc

    return ReadyResponse(
        status="ready",
        service=settings.app_name,
        environment=settings.environment,
        database=True,
    )
