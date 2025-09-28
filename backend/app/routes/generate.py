from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from fastapi.concurrency import run_in_threadpool
from groq import Groq
from ..config import settings

router = APIRouter()

class GenerateRequest(BaseModel):
    topic: str = Field(..., description="Blog topic or prompt")
    style: Optional[str] = Field(None, description="Voice or tone, e.g., 'conversational' or 'technical'")
    words: Optional[int] = Field(800, description="Approximate word count")
    outline: Optional[bool] = Field(False, description="Return outline + body")

class GenerateResponse(BaseModel):
    content: str
    model: str

def _call_groq_sync(prompt: str, model: str | None = None) -> str:
    if not model:
        model = settings.GROQ_MODEL
    client = Groq(api_key=settings.GROQ_API_KEY)
    resp = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=model,
        temperature=0.7,
    )
    return resp.choices[0].message.content or ""

@router.post("/generate-blog", response_model=GenerateResponse)
async def generate_blog(body: GenerateRequest):
    prompt_parts = [
        f"Write a high-quality blog post about: {body.topic}.",
        f"Target length: ~{body.words} words." if body.words else None,
        f"Style: {body.style}." if body.style else None,
        "Include an outline first, then the full article." if body.outline else None,
        "Use headings (H2/H3), short paragraphs, and bullet points where helpful.",
        "Add an engaging introduction and a concise conclusion.",
    ]
    prompt = " \n".join(p for p in prompt_parts if p)

    try:
        model = settings.GROQ_MODEL
        content = await run_in_threadpool(_call_groq_sync, prompt, model)
        return GenerateResponse(content=content, model=model)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Groq error: {e}")
