import { motion } from 'framer-motion'
import { useTheme } from '../theme/ThemeProvider'

// L/R Mode-inspired circular icon that adapts to theme
export function SwordToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  // Colors inspired by the provided graphic: maroon in light, neon in dark
  const circleFill = isDark ? '#0b0b12' : '#7a0f19'
  const textColor = isDark ? '#e5e7eb' : '#fff'
  const slashColor = isDark ? '#00e5ff' : '#e5e7eb'

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="group relative rounded-full p-1.5 bg-white/0 hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
      title={isDark ? 'Switch to Light' : 'Switch to Dark'}
    >
      <motion.svg
        width="30" height="30" viewBox="0 0 30 30" role="img" aria-hidden="true"
        initial={false}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <circle cx="15" cy="15" r="12" fill={circleFill} />
        {/* L */}
        <text x="9.2" y="18" fontFamily="serif" fontSize="10" fill={textColor} textAnchor="middle">L</text>
        {/* R */}
        <text x="20.5" y="18" fontFamily="serif" fontSize="10" fill={textColor} textAnchor="middle">R</text>
        {/* Slash */}
        <path d="M12 20 L18 10" stroke={slashColor} strokeWidth="2" strokeLinecap="round"/>
      </motion.svg>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
