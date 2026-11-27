"""Application settings loaded from environment variables."""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Server-side configuration. Secrets must never be exposed to clients."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Contexo API"
    environment: str = Field(default="development", alias="ENVIRONMENT")
    debug: bool = Field(default=False, alias="DEBUG")
    api_prefix: str = "/api/v1"

    # Comma-separated origins for the web app and extension local origins.
    cors_origins: str = Field(
        default="http://localhost:3000",
        alias="CORS_ORIGINS",
    )

    # Database and auth are required for protected features; optional at boot
    # so the health endpoint can run before Neon is provisioned.
    database_url: str | None = Field(default=None, alias="DATABASE_URL")
    neon_auth_base_url: str | None = Field(default=None, alias="NEON_AUTH_BASE_URL")
    neon_auth_jwks_url: str | None = Field(default=None, alias="NEON_AUTH_JWKS_URL")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
