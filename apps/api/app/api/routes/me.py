"""Current authenticated user endpoint."""

from fastapi import APIRouter, Depends

from app.core.auth import AuthenticatedUser, get_current_user
from app.core.db import get_connection
from app.schemas.auth import MeResponse

router = APIRouter(tags=["auth"])


@router.get("/me", response_model=MeResponse)
def get_me(user: AuthenticatedUser = Depends(get_current_user)) -> MeResponse:
    """Return the verified Neon Auth identity and upsert a local profile row."""
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO profiles (user_id, display_name, email)
                VALUES (%s, %s, %s)
                ON CONFLICT (user_id) DO UPDATE
                SET
                    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
                    email = COALESCE(EXCLUDED.email, profiles.email),
                    updated_at = now()
                """,
                (user.user_id, user.name, user.email),
            )
        conn.commit()

    return MeResponse(user_id=user.user_id, email=user.email, name=user.name)
