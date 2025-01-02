"""
FastAPI application entry point. Configures the app, includes routers,
and sets up middleware and error handlers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from src.core.config import settings
from src.api.v1 import documents, chat
from src.core.background_tasks import background_task_manager
from src.middleware.rate_limiter import rate_limiter
from fastapi import Request
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="GreenReguAI API",
    description="API for GreenReguAI platform",
    version="1.0.0",
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://greenreguai.onrender.com",
        "https://greenreguai-api.onrender.com",
        "https://greenreguai.com",
        "https://www.greenreguai.com"
    ] if settings.ENV == "development" else [
        "https://greenreguai.onrender.com",
        "https://greenreguai-api.onrender.com",
        "https://greenreguai.com",
        "https://www.greenreguai.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    expose_headers=["Content-Range", "Range"]
)

# Compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Rate limit middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    await rate_limiter.check_rate_limit(request)
    response = await call_next(request)
    return response

# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": str(type(exc).__name__)},
    )

# Include routers
app.include_router(documents.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    """Start background tasks when application starts"""
    background_task_manager.start()
    logging.info("Application started, background tasks initialized")

@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown background tasks when application stops"""
    background_task_manager.shutdown()
    logging.info("Application shutting down, background tasks stopped")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)