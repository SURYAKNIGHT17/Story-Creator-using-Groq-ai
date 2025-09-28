# Story Creator using Groq AI

A full‑stack app that generates long‑form blog posts and outlines using Groq models. The UI is a modern, theme‑able React/Vite frontend; the API is a FastAPI backend that talks to Groq.

- Frontend: `frontend/` (Vite + React + Tailwind + Framer Motion)
- Backend: `backend/` (FastAPI + uvicorn)

## Features
- Light/Dark theme with custom SVG toggle
- Particle background and glassmorphism panels
- Typewriter preview and Markdown rendering (headings, bold, lists)
- Groq model selection via env
- CORS configured for all localhost dev ports

## Project structure
```
OpenAi blog web/
├─ backend/
│  ├─ app/
│  │  ├─ main.py                 # FastAPI app + CORS + routes
│  │  ├─ routes/generate.py      # /generate-blog endpoint
│  │  ├─ config.py               # Pydantic Settings (env loader)
│  ├─ requirements.txt
│  ├─ .env.example
│  └─ README.md
├─ frontend/
│  ├─ src/
│  │  ├─ pages/Landing.tsx       # Main page
│  │  ├─ lib/api.ts              # Axios client
│  │  ├─ components/*            # UI components
│  │  └─ theme/ThemeProvider.tsx # Dark/Light provider
│  ├─ public/favicon.svg
│  ├─ .env.example
│  └─ README.md
├─ .gitignore
└─ README.md (this file)
```

## Prerequisites
- Node 18+
- Python 3.10+
- A Groq API key: https://console.groq.com/keys

## Local development

### 1) Backend
```
cd backend
python -m venv venv
# PowerShell
..\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env   # set GROQ_API_KEY and optional GROQ_MODEL
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Verify:
- http://127.0.0.1:8000/
- http://127.0.0.1:8000/health
- http://127.0.0.1:8000/docs

### 2) Frontend
```
cd frontend
copy .env.example .env   # set VITE_API_URL=http://127.0.0.1:8000
npm install
npm run dev
```
Open http://localhost:5173 and generate a post.

## Environment variables

Backend `backend/.env`:
```
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.1-8b-instant   # optional; defaults appropriately
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173  # optional
```
Notes:
- CORS also accepts any `http://localhost:<port>` and `http://127.0.0.1:<port>` via `allow_origin_regex` in `app/main.py`.

Frontend `frontend/.env`:
```
VITE_API_URL=http://127.0.0.1:8000
```

## How it works
- The frontend calls `POST /generate-blog` with `{ topic, style, words, outline }`.
- The backend route (`app/routes/generate.py`) initializes a Groq client with `GROQ_API_KEY` and sends a prompt to the configured model.
- The response content and the model name return to the frontend. The UI shows progress and renders the text as Markdown.

## Customization
- UI theme/colors: `frontend/src/index.css` and Tailwind tokens in `frontend/tailwind.config.js`.
- Toggle and particles: `frontend/src/components/SwordToggle.tsx`, `frontend/src/components/Particles.tsx`.
- Button and cards: `frontend/src/components/NeonButton.tsx`, `frontend/src/components/GlassCard.tsx`.
- Prompting/model: `backend/app/routes/generate.py`, `backend/app/config.py` (change system prompt or model).
- CORS/Ports: `backend/app/main.py` (adjust `allow_origins` or `allow_origin_regex`).

## Deployment

### Backend (Render)
1. Push your code to GitHub (see Git section below).
2. Render → New Web Service → select repo.
3. Settings:
   - Root directory: repo root
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
   - Environment:
     - `GROQ_API_KEY=...`
     - `GROQ_MODEL=llama-3.1-8b-instant` (optional)
4. After deploy, note your URL, e.g., `https://your-api.onrender.com`.
5. Verify `/health`.

### Frontend (Netlify)
1. New site from Git → pick the repo.
2. Base directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment variables:
   - `VITE_API_URL=https://your-api.onrender.com`
6. Deploy and test the site URL.

## Troubleshooting
- CORS error: ensure backend is restarted with `allow_origin_regex` and your frontend domain is allowed.
- 401/403 from Groq: check `GROQ_API_KEY` on the backend host.
- Frontend can’t call backend: verify `VITE_API_URL` and redeploy the frontend.

## Git: push this project
From project root:
```
git init
git branch -M main
git add .
git commit -m "Initial commit: Story Creator using Groq AI"
# create the repo on GitHub first: SURYAKNIGHT17/Story-Creator-using-Groq-ai
git remote add origin https://github.com/SURYAKNIGHT17/Story-Creator-using-Groq-ai.git
git push -u origin main
```

> Never commit `.env` files. This repo has a `.gitignore` that excludes them.
