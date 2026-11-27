"""Root API router. Feature routers are mounted here as they are implemented."""

from fastapi import APIRouter

from app.api.routes import health, me

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(me.router)
