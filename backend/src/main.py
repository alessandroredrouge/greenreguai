"""
FastAPI application entry point. Configures the app, includes routers,
and sets up middleware and error handlers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.v1 import documents

app = FastAPI(title="GreenReguAI API")

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

@app.get("/")
async def root():
    return {"message": "Welcome to GreenReguAI API"}