"""Structured logging configuration. Never log secrets or private user content."""

from __future__ import annotations

import logging
import sys
from typing import Any

import structlog


SENSITIVE_KEYS = frozenset(
    {
        "password",
        "secret",
        "token",
        "access_token",
        "refresh_token",
        "id_token",
        "authorization",
        "cookie",
        "database_url",
        "api_key",
        "client_secret",
    }
)


def _redact_value(key: str, value: Any) -> Any:
    if key.lower() in SENSITIVE_KEYS:
        return "[REDACTED]"
    return value


def _redact_event_dict(
    _logger: Any,
    _method_name: str,
    event_dict: dict[str, Any],
) -> dict[str, Any]:
    return {key: _redact_value(key, value) for key, value in event_dict.items()}


def configure_logging(*, debug: bool) -> None:
    level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(format="%(message)s", stream=sys.stdout, level=level)

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            _redact_event_dict,
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(level),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )


def get_logger(name: str) -> Any:
    return structlog.get_logger(name)
