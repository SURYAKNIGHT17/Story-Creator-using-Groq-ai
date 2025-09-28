# Frontend (Vite + React + TypeScript + Tailwind + Framer Motion)

## Setup (Windows PowerShell)

```powershell
# From the project root
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install framer-motion axios classnames
```

## Configure Tailwind
- Add to `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00e5ff',
          purple: '#9a5cff'
        }
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 229, 255, 0.4)',
      },
    },
  },
  plugins: [],
}
```

- Replace `src/index.css` with Tailwind base:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}
body {
  @apply bg-black text-white;
}
```

## Dev server
```powershell
npm run dev
```

## Theme guidelines (Solo Leveling: ARISE-inspired)
- Dark UI with neon blue/purple accents.
- Glassmorphism cards: semi-transparent backgrounds, backdrop blur, subtle glows.
- Particle background layer.
- Smooth loading bars and typewriter effect when generating content.
- Gradient borders and hover neon glows for interactive elements.

## Environment
- Point the frontend to the backend API at `http://localhost:8000` during development.
