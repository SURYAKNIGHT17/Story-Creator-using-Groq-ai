from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


class Settings(BaseSettings):
    GROQ_API_KEY: str
    GROQ_MODEL: str = "llama-3.1-8b-instant"
    ALLOWED_ORIGINS: Union[List[str], str] = "*"
    APP_ENV: str = "dev"

    # Pydantic v2 config
    _backend_env = (Path(__file__).resolve().parents[1] / ".env").as_posix()
    model_config = SettingsConfigDict(env_file=(_backend_env, ".env"), case_sensitive=False)

    # Accept comma-separated strings in .env for ALLOWED_ORIGINS
    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def _split_csv(cls, v):
        # Accept JSON-like list, comma-separated string, or passthrough
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                # Let pydantic handle JSON list strings
                return v
            if "," in v:
                return [s.strip() for s in v.split(",") if s.strip()]
            return v
        return v

    @property
    def allowed_origins_list(self) -> List[str]:
        v = self.ALLOWED_ORIGINS
        if isinstance(v, str):
            return ["*"] if v == "*" else [v]
        return v


settings = Settings()
