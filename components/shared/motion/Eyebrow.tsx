import type { ReactNode } from 'react'
import clsx from 'clsx'

export default function Eyebrow({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <p className={clsx('eyebrow text-primary mb-3 flex items-center gap-2', className)}>
      <span aria-hidden="true">{'//'}</span>
      {children}
    </p>
  )
}
