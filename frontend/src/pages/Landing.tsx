import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Particles } from '../components/Particles'
import { GlassCard } from '../components/GlassCard'
import { NeonButton } from '../components/NeonButton'
import { LoadingBar } from '../components/LoadingBar'
import { useTypewriter } from '../hooks/useTypewriter'
import { generateBlog } from '../lib/api'
import { SwordToggle } from '../components/SwordToggle'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function Landing() {
  const [topic, setTopic] = useState('Solo Leveling-inspired AI content strategies')
  const [style, setStyle] = useState('dynamic, hero-journey, conversational')
  const [words, setWords] = useState(700)
  const [outline, setOutline] = useState(true)

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [rawContent, setRawContent] = useState('')
  const [model, setModel] = useState('')
  const [error, setError] = useState<string | null>(null)

  const typed = useTypewriter(rawContent, 10)

  // Simulated progress while waiting for API
  useEffect(() => {
    if (!loading) return
    setProgress(3)
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000
      // progress curve: fast first, slower later, cap at 92%
      const p = Math.min(92, 65 * (1 - Math.exp(-elapsed / 1.4)) + elapsed * 3)
      setProgress(p)
      if (loading) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [loading])

  const canGenerate = useMemo(() => topic.trim().length >= 3 && !loading, [topic, loading])

  async function onGenerate() {
    if (!canGenerate) return
    setLoading(true)
    setError(null)
    setModel('')
    setRawContent('')
    try {
      const res = await generateBlog({ topic, style, words, outline })
      setModel(res.model)
      setRawContent(res.content)
      setProgress(100)
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Failed to generate content')
      setProgress(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Particles />

      <div className="absolute inset-0" aria-hidden>
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.35), transparent 60%)' }} />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, rgba(154,92,255,0.35), transparent 60%)' }} />
      </div>

      {/* Top bar with sword toggle */}
      <div className="relative mx-auto max-w-6xl px-4 pt-4 flex items-center justify-end">
        <SwordToggle />
      </div>

      <main className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:py-14">
        <header className="flex flex-col items-center text-center gap-4">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight neon-gradient neon-title"
          >
            AI Blog Generator
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-white/80 max-w-2xl"
          >
            Solo Leveling: ARISE-inspired interface. Neon glows, glassmorphism, particles, and a real-time typing effect.
          </motion.p>
          <div className="text-xs text-slate-500 dark:text-white/50">Model: {model || '—'}</div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="flex flex-col gap-4 animated-border hover:shadow-glow transition-shadow">
            <label className="text-sm text-slate-700 dark:text-white/70">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-neon-blue bg-white/60 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40"
              placeholder="Enter a blog topic"
            />

            <label className="text-sm text-slate-700 dark:text-white/70">Style</label>
            <input
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-neon-purple bg-white/60 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40"
              placeholder="e.g., technical, conversational, storytelling"
            />

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm text-white/70">Words: {words}</label>
                <input
                  type="range"
                  min={300}
                  max={1500}
                  step={50}
                  value={words}
                  onChange={(e) => setWords(parseInt(e.target.value, 10))}
                  className="w-full"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-white/70 select-none">
                <input type="checkbox" checked={outline} onChange={(e) => setOutline(e.target.checked)} />
                Outline
              </label>
            </div>

            {error && (
              <div className="rounded-md border border-red-500/30 bg-red-500/10 dark:border-red-500/40 p-3 text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <NeonButton onClick={onGenerate} disabled={!canGenerate}>
                {loading ? 'Generating…' : 'Generate Blog'}
              </NeonButton>
              {loading && <div className="text-xs text-white/60">Calling Groq…</div>}
            </div>

            <LoadingBar progress={progress} />
            <div className="text-xs text-slate-500 dark:text-white/50">Backend: {import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}</div>
          </GlassCard>

          <GlassCard className="min-h-[320px] animated-border hover:shadow-glowPurple transition-shadow">
            <div className="mb-3 text-sm text-slate-700 dark:text-white/70">Output</div>
            <article className="prose dark:prose-invert max-w-none">
              {typed ? (
                <div className="leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{typed}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-slate-500 dark:text-white/40">Your generated blog will appear here with a typewriter effect…</div>
              )}
            </article>
          </GlassCard>
        </section>

        <footer className="mt-4 flex items-center justify-center gap-3 text-white/50 text-xs">
          <span>Built with React + Vite + Tailwind + Framer Motion</span>
          <span>•</span>
          <a className="text-neon-blue hover:underline" href="#">Docs</a>
        </footer>
      </main>
    </div>
  )
}
