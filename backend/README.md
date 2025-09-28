# AI Blog Generator Backend (FastAPI)

## Quick start

1) Create `.env` from example:
```
cp .env.example .env  # Windows: copy .env.example .env
```
Set `GROQ_API_KEY`.

2) Install deps and run:
```
python -m venv venv
# Windows PowerShell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

3) Test:
- GET http://localhost:8000/health
- POST http://localhost:8000/generate-blog
  ```json
  {"topic":"Python for beginners","style":"conversational","words":600}
  ```

## Notes
- Uses Groq model `llama3-8b-8192`.
- CORS allows Vite dev server at port 5173 by default.
