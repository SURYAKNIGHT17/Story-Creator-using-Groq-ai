import { motion } from 'framer-motion'

export function LoadingBar({ progress }: { progress: number }) {
  const clamped = Math.max(0, Math.min(progress, 100))
  return (
    <div className="w-full h-2 bg-white/10 rounded overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-neon-blue to-neon-purple shadow-glow"
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ ease: 'easeOut', duration: 0.25 }}
      />
    </div>
  )
}
