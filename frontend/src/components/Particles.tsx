import { useEffect, useRef } from 'react'
import { useTheme } from '../theme/ThemeProvider'

export function Particles() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const resizeRef = useRef(() => {})

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    type P = { x: number; y: number; vx: number; vy: number }
    const baseCount = Math.floor((w * h) / 16000)
    const dark = theme === 'dark'
    const COUNT = Math.min(120, Math.max(40, dark ? baseCount : Math.floor(baseCount * 0.6)))
    const particles: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    }))

    const gradient = ctx.createLinearGradient(0, 0, w, h)
    if (dark) {
      gradient.addColorStop(0, 'rgba(0,229,255,0.85)')
      gradient.addColorStop(1, 'rgba(154,92,255,0.85)')
    } else {
      gradient.addColorStop(0, 'rgba(14,165,233,0.75)')
      gradient.addColorStop(1, 'rgba(147,51,234,0.75)')
    }

    let raf = 0
    const loop = () => {
      ctx.clearRect(0, 0, w, h)
      // draw lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d2 = dx * dx + dy * dy
          if (d2 < 140 * 140) {
            const alpha = 1 - d2 / (140 * 140)
            const base = dark ? 0.10 : 0.06
            const color = dark ? '0,229,255' : '14,165,233'
            ctx.strokeStyle = `rgba(${color},${base * alpha})`
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
      }
      // draw points
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resizeRef.current = onResize
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 opacity-60"
    />
  )
}
