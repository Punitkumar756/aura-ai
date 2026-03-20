from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Configuration for Aura AI Agent System"""
    
    # GitLab
    gitlab_url: str = "https://gitlab.com"
    gitlab_token: str
    gitlab_webhook_secret: str
    
    # LLM
    openai_api_key: str
    openai_model: str = "gpt-4"
    
    # Agent Config
    agent_confidence_threshold: float = 0.7
    auto_fix_enabled: bool = True
    auto_merge_enabled: bool = False
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Database
    database_url: str = "sqlite:///./aura_ai.db"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
