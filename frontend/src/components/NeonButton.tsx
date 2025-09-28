import { motion } from 'framer-motion'
import { ButtonHTMLAttributes } from 'react'
import cx from 'classnames'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag'> & {
  variant?: 'blue' | 'purple'
}

export function NeonButton({ className, children, variant = 'blue', ...rest }: Props) {
  const glow = variant === 'blue' ? 'shadow-glow' : 'shadow-glowPurple'
  const bg = variant === 'blue' ? 'from-neon-blue to-neon-purple' : 'from-neon-purple to-neon-blue'
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={cx(
        'relative rounded-lg px-5 py-2 font-semibold',
        'bg-gradient-to-r text-white',
        bg,
        glow,
        'transition-transform duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400 dark:focus-visible:ring-neon-blue focus-visible:ring-offset-transparent',
        className,
      )}
      {...(rest as any)}
    >
      <span className="drop-shadow-[0_2px_8px_RGBA(0,0,0,0.35)]">{children}</span>
    </motion.button>
  )
}
