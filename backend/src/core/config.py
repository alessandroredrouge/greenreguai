"""
Application configuration management including environment variables,
API keys, and other settings.
"""
from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Environment
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = ENV == "development"
    
    # API Configuration
    PORT: int = 8000
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "GreenReguAI"
    VERSION: str = "1.0.0"
    
    # CORS
    # In development, allow all. In production, will be set to actual domain
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # For local development
        # "https://greenreguai.com",  # Your production frontend domain
        "https://greenreguai.onrender.com",  # Your frontend on Render
        "https://greenreguai-api.onrender.com",  # Your backend on Render
        "https://greenreguai.com",  # Add your new domain
        "https://www.greenreguai.com"  # Add www version of your domain
    ] if ENV == "development" else [
        # "https://greenreguai.com",  # Your production frontend domain
        "https://greenreguai.onrender.com",  # Your frontend on Render
        "https://greenreguai-api.onrender.com",  # Your backend on Render
        "https://greenreguai.com",
        "https://www.greenreguai.com"
        # "https://*.greenreguai.com"
    ]
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_KEY: str
    
    # OpenAI
    OPENAI_API_KEY: str
    
    # Pinecone
    PINECONE_API_KEY: str
    PINECONE_ENVIRONMENT: str = "us-east-1-aws"
    PINECONE_INDEX_NAME: str
    
    # Background Tasks Configuration
    DOCUMENT_SYNC_INTERVAL: int = 30  # minutes
    
    # Security
    SECURITY_HEADERS: bool = ENV != "development"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100 if ENV == "development" else 60
    
    # Logging
    LOG_LEVEL: str = "DEBUG" if DEBUG else "INFO"
    
    # Supabase Storage
    STORAGE_BUCKET: str = "official_documents"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Validate settings
def validate_settings() -> None:
    """Validate that all required settings are set"""
    required_settings = [
        "SUPABASE_URL",
        "SUPABASE_KEY",
        "SUPABASE_SERVICE_KEY",
        "OPENAI_API_KEY",
        "PINECONE_API_KEY",
        "PINECONE_INDEX_NAME"
    ]
    
    missing_settings = [
        setting for setting in required_settings 
        if not getattr(settings, setting, None)
    ]
    
    if missing_settings:
        raise ValueError(
            f"Missing required environment variables: {', '.join(missing_settings)}"
        )

# Validate settings on import
validate_settings()