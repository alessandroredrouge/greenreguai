"""
FastAPI application entry point. Configures the app, includes routers,
and sets up middleware and error handlers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.v1 import documents
from src.core.background_tasks import background_task_manager
import logging

app = FastAPI(title="GreenReguAI API")

# Configure logging
logging.basicConfig(level=logging.INFO)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(documents.router, prefix="/api/v1")

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

@app.get("/")
async def root():
    return {"message": "Welcome to GreenReguAI API"}