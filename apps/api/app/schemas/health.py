"""Health check response schema."""

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    service: str
    environment: str


class ReadyResponse(BaseModel):
    status: str
    service: str
    environment: str
    database: bool
