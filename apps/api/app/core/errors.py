"""Application-specific errors and HTTP error responses."""

from __future__ import annotations

from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import structlog

logger = structlog.get_logger(__name__)


class AppError(Exception):
    """Base application error with an explicit client-facing message."""

    def __init__(
        self,
        message: str,
        *,
        code: str = "app_error",
        status_code: int = 400,
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}


class NotFoundError(AppError):
    def __init__(self, message: str, *, details: dict[str, Any] | None = None) -> None:
        super().__init__(
            message,
            code="not_found",
            status_code=404,
            details=details,
        )


class UnauthorizedError(AppError):
    def __init__(self, message: str = "Authentication required") -> None:
        super().__init__(message, code="unauthorized", status_code=401)


class ForbiddenError(AppError):
    def __init__(self, message: str = "You do not have access to this resource") -> None:
        super().__init__(message, code="forbidden", status_code=403)


class ErrorBody(BaseModel):
    code: str
    message: str
    details: dict[str, Any] = {}


class ErrorResponse(BaseModel):
    error: ErrorBody


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def handle_app_error(_request: Request, exc: AppError) -> JSONResponse:
        logger.warning(
            "app_error",
            code=exc.code,
            status_code=exc.status_code,
            message=exc.message,
        )
        body = ErrorResponse(
            error=ErrorBody(code=exc.code, message=exc.message, details=exc.details)
        )
        return JSONResponse(status_code=exc.status_code, content=body.model_dump())

    @app.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
        logger.exception(
            "unhandled_exception",
            path=str(request.url.path),
            method=request.method,
            error_type=type(exc).__name__,
        )
        # Production clients get a generic message; details stay in server logs.
        body = ErrorResponse(
            error=ErrorBody(
                code="internal_error",
                message="An unexpected error occurred",
            )
        )
        return JSONResponse(status_code=500, content=body.model_dump())
