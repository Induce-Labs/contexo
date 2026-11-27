"""Auth-related API response schemas."""

from pydantic import BaseModel


class MeResponse(BaseModel):
    user_id: str
    email: str | None = None
    name: str | None = None
