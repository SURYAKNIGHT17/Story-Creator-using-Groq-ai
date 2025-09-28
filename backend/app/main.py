from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routes.generate import router as generate_router

app = FastAPI(title="AI Blog Generator", version="0.1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1):\d{4,5}$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(generate_router, prefix="", tags=["generation"])

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {
        "message": "AI Blog Generator API",
        "endpoints": ["/health", "/generate-blog"],
        "docs": "/docs",
    }
