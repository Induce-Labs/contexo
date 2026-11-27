"""Neon Auth JWT verification for FastAPI.

Verifies EdDSA JWTs against NEON_AUTH_JWKS_URL / NEON_AUTH_BASE_URL origin.
Never trust client-supplied user IDs — derive identity from verified claims only.
"""

from __future__ import annotations

import base64
import time
from dataclasses import dataclass
from functools import lru_cache
from typing import Any
from urllib.parse import urlparse

import httpx
import jwt
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import get_settings
from app.core.errors import AppError, UnauthorizedError
from app.core.logging import get_logger

logger = get_logger(__name__)

_bearer = HTTPBearer(auto_error=False)
_JWKS_CACHE_TTL_SECONDS = 3600

_jwks_cache: dict[str, Any] | None = None
_jwks_cache_at: float = 0.0


@dataclass(frozen=True)
class AuthenticatedUser:
    """Identity derived from a verified Neon Auth JWT."""

    user_id: str
    email: str | None
    name: str | None
    claims: dict[str, Any]


class AuthMisconfiguredError(AppError):
    def __init__(self, message: str) -> None:
        super().__init__(message, code="auth_misconfigured", status_code=503)


@lru_cache
def _auth_origin() -> str:
    settings = get_settings()
    base = settings.neon_auth_base_url
    if not base:
        raise AuthMisconfiguredError("NEON_AUTH_BASE_URL is not configured")
    parsed = urlparse(base)
    if not parsed.scheme or not parsed.netloc:
        raise AuthMisconfiguredError("NEON_AUTH_BASE_URL is invalid")
    return f"{parsed.scheme}://{parsed.netloc}"


def _jwks_url() -> str:
    settings = get_settings()
    if settings.neon_auth_jwks_url:
        return settings.neon_auth_jwks_url
    base = settings.neon_auth_base_url
    if not base:
        raise AuthMisconfiguredError("NEON_AUTH_BASE_URL is not configured")
    return f"{base.rstrip('/')}/.well-known/jwks.json"


def _fetch_jwks() -> dict[str, Any]:
    global _jwks_cache, _jwks_cache_at
    now = time.time()
    if _jwks_cache is not None and (now - _jwks_cache_at) < _JWKS_CACHE_TTL_SECONDS:
        return _jwks_cache

    url = _jwks_url()
    try:
        response = httpx.get(url, timeout=10.0)
        response.raise_for_status()
    except httpx.HTTPError as exc:
        logger.warning("jwks_fetch_failed", error_type=type(exc).__name__)
        raise AuthMisconfiguredError("Unable to fetch Neon Auth JWKS") from exc

    payload = response.json()
    if not isinstance(payload, dict) or "keys" not in payload:
        raise AuthMisconfiguredError("Neon Auth JWKS response is invalid")

    _jwks_cache = payload
    _jwks_cache_at = now
    return payload


def _public_key_for_token(token: str) -> Ed25519PublicKey:
    header = jwt.get_unverified_header(token)
    kid = header.get("kid")
    if not kid:
        raise UnauthorizedError("Token header is missing kid")

    jwks = _fetch_jwks()
    for key in jwks.get("keys", []):
        if key.get("kid") != kid:
            continue
        if key.get("kty") != "OKP" or key.get("crv") != "Ed25519":
            continue
        x = key.get("x")
        if not isinstance(x, str):
            continue
        public_key_bytes = base64.urlsafe_b64decode(x + "==")
        return Ed25519PublicKey.from_public_bytes(public_key_bytes)

    # Key rotation: refresh once
    global _jwks_cache_at
    _jwks_cache_at = 0
    jwks = _fetch_jwks()
    for key in jwks.get("keys", []):
        if key.get("kid") == kid and key.get("kty") == "OKP":
            x = key.get("x")
            if isinstance(x, str):
                public_key_bytes = base64.urlsafe_b64decode(x + "==")
                return Ed25519PublicKey.from_public_bytes(public_key_bytes)

    raise UnauthorizedError("No matching JWKS signing key for token")


def verify_access_token(token: str) -> AuthenticatedUser:
    origin = _auth_origin()
    try:
        signing_key = _public_key_for_token(token)
        claims = jwt.decode(
            token,
            key=signing_key,
            algorithms=["EdDSA"],
            issuer=origin,
            audience=origin,
        )
    except UnauthorizedError:
        raise
    except AuthMisconfiguredError:
        raise
    except jwt.PyJWTError as exc:
        logger.info("jwt_verification_failed", error_type=type(exc).__name__)
        raise UnauthorizedError("Invalid or expired access token") from exc

    user_id = claims.get("sub") or claims.get("id")
    if not user_id:
        raise UnauthorizedError("Token is missing subject")

    return AuthenticatedUser(
        user_id=str(user_id),
        email=claims.get("email"),
        name=claims.get("name"),
        claims=claims,
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> AuthenticatedUser:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise UnauthorizedError("Authentication required")
    return verify_access_token(credentials.credentials)
