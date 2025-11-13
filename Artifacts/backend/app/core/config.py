"""
Centralized application configuration using Pydantic's BaseSettings.

This module defines a `Settings` class that loads configuration values from
environment variables and a `.env` file. This approach keeps configuration
separate from code, following the 12-factor app methodology.

The `settings` object is a singleton instance of this class and should be
imported by other modules that need access to configuration values.
"""
import os
from typing import List, Union, Optional

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def get_aws_parameter(parameter_name: str, default: Optional[str] = None) -> Optional[str]:
    """
    Retrieve a parameter from AWS Systems Manager Parameter Store.
    Falls back to default value if AWS is not available or parameter doesn't exist.
    
    Args:
        parameter_name: Full parameter name (e.g., /staffalloc/prod/SECRET_KEY)
        default: Default value if parameter not found
        
    Returns:
        Parameter value or default
    """
    try:
        import boto3
        from botocore.exceptions import ClientError, NoCredentialsError
        
        ssm = boto3.client('ssm', region_name=os.getenv('AWS_REGION', 'us-east-1'))
        response = ssm.get_parameter(Name=parameter_name, WithDecryption=True)
        return response['Parameter']['Value']
    except (ImportError, ClientError, NoCredentialsError, Exception):
        # If boto3 not installed, AWS not configured, or parameter doesn't exist,
        # fall back to default value
        return default


class Settings(BaseSettings):
    """
    Application settings class.
    Values are loaded from environment variables or a .env file.
    In production, sensitive values can be loaded from AWS Parameter Store.
    """
    # --- Environment Configuration ---
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")  # development, production, staging
    USE_AWS_SECRETS: bool = os.getenv("USE_AWS_SECRETS", "false").lower() == "true"
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    
    # --- Core API Settings ---
    PROJECT_NAME: str = "StaffAlloc"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = """
    API for the StaffAlloc platform - AI-Powered Staffing Management.
    Manages projects, employees, allocations, and AI-driven features.
    """
    API_V1_STR: str = "/api/v1"

    # --- Database Configuration ---
    # The URL for the application's database. For the local prototype, this
    # defaults to a synchronous SQLite database file in the `data/` directory.
    # In production on EC2, this will point to /opt/staffalloc/data/staffalloc.db
    DATABASE_URL: str = "sqlite:///./data/staffalloc.db"
    
    # Derived path for database file (for directory creation)
    SQLITE_DB_PATH: str = "./data/staffalloc.db"

    # --- Security and JWT Settings ---
    # A secret key for signing JWTs.
    # IMPORTANT: This is a default value for development. In production, this
    # should be replaced with a strong, randomly generated secret and loaded
    # from a secure source (e.g., environment variable, secrets manager).
    # You can generate a new one with: `openssl rand -hex 32`
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7  # 7 days

    # --- CORS (Cross-Origin Resource Sharing) Settings ---
    # A list of origins that are allowed to make cross-origin requests.
    # The default includes the standard local development ports for React/Vite.
    # In production, this should include the CloudFront distribution URL
    BACKEND_CORS_ORIGINS: List[Union[AnyHttpUrl, str]] = [
        "http://localhost:5173",  # Default Vite/React dev server
        "http://localhost:3000",  # Common alternative for React
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    # --- Local Storage Paths ---
    # As per the architecture document, all data is stored locally.
    REPORTS_DIR: str = "./data/reports"
    VECTOR_STORE_DIR: str = "./data/vector_store"
    
    # Aliases for compatibility
    REPORTS_PATH: str = "./data/reports"
    VECTOR_STORE_PATH: str = "./data/vector_store"

    # --- AI and LLM Integration Settings ---
    # The base URL for the locally running Ollama server.
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    # Alias for API endpoint
    OLLAMA_API_URL: str = "http://localhost:11434"
    
    # The name of the sentence-transformer model to use for embeddings in the RAG pipeline.
    # 'all-MiniLM-L6-v2' is a good default: fast, effective, and runs locally.
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    # The name of the LLM model to use for chat and generation via Ollama.
    # 'phi3:mini' is a small, fast model suitable for real-time interaction.
    LLM_MODEL_NAME: str = "phi3:mini"
    
    # Anthropic Claude API configuration for RAG features
    # Set ANTHROPIC_API_KEY in .env file to enable Claude-powered AI features
    ANTHROPIC_API_KEY: Optional[str] = None
    CLAUDE_MODEL: str = "claude-haiku-4-5-20251001"  # Claude Haiku 4.5 (fast, cost-effective)

    @field_validator('SECRET_KEY', mode='before')
    @classmethod
    def load_secret_key(cls, v: str) -> str:
        """Load SECRET_KEY from AWS Parameter Store in production if enabled."""
        if os.getenv("USE_AWS_SECRETS", "false").lower() == "true":
            return get_aws_parameter("/staffalloc/prod/SECRET_KEY", default=v) or v
        return v
    
    @field_validator('BACKEND_CORS_ORIGINS', mode='before')
    @classmethod
    def load_cors_origins(cls, v: Union[List, str]) -> List[str]:
        """
        Load CORS origins from AWS Parameter Store or environment.
        Handles comma-separated strings or lists.
        """
        if os.getenv("USE_AWS_SECRETS", "false").lower() == "true":
            aws_origins = get_aws_parameter("/staffalloc/prod/CORS_ORIGINS")
            if aws_origins:
                # Parse comma-separated string
                origins = [origin.strip() for origin in aws_origins.split(",")]
                return origins
        
        # Handle environment variable or default value
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    # Pydantic settings configuration
    # This tells Pydantic to look for a .env file and treat variable names
    # as case-insensitive.
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="allow",
    )


def get_settings() -> Settings:
    """
    Factory function to create settings instance.
    This allows for easier testing and lazy loading of AWS parameters.
    """
    return Settings()


# Create a single, globally accessible instance of the Settings class.
# Other modules should import this `settings` object.
settings = get_settings()

