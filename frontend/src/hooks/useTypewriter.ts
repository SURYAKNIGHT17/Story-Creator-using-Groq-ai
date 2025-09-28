import { useEffect, useMemo, useRef, useState } from 'react'

export function useTypewriter(text: string, speedMs = 18) {
  const [display, setDisplay] = useState('')
  const indexRef = useRef(0)
  const src = useMemo(() => text ?? '', [text])

  useEffect(() => {
    setDisplay('')
    indexRef.current = 0
    if (!src) return

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const delta = now - last
      if (delta >= speedMs) {
        const step = Math.max(1, Math.floor(delta / speedMs))
        indexRef.current = Math.min(src.length, indexRef.current + step)
        setDisplay(src.slice(0, indexRef.current))
        last = now
      }
      if (indexRef.current < src.length) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [src, speedMs])

  return display
}
