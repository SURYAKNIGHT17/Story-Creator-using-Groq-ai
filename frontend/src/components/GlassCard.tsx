import { PropsWithChildren } from 'react'
import cx from 'classnames'

export function GlassCard({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cx('glass glow-border rounded-2xl p-6', className)}>
      {children}
    </div>
  )
}
