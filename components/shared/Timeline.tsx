import type { ReactNode } from 'react'
import clsx from 'clsx'

export function Timeline({ children }: { children: ReactNode }) {
  return <div className="flex flex-col">{children}</div>
}

export function TimelineItem({
  children,
  isLast = false,
  className,
}: {
  children: ReactNode
  isLast?: boolean
  className?: string
}) {
  return (
    <div className={clsx('relative flex gap-6', !isLast && 'pb-10', className)}>
      <div className="flex flex-col items-center shrink-0 pt-1.5">
        <span className="h-3 w-3 rounded-full bg-primary ring-4 ring-primary/15 shrink-0" />
        {!isLast && <span className="w-px flex-1 bg-border mt-2" />}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}
