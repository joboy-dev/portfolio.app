import type { ReactNode } from 'react'
import clsx from 'clsx'

export default function TerminalCard({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={clsx('rounded-lg border border-border overflow-hidden bg-background', className)}>
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-secondary/50">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        </div>
        <span className="font-mono text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="p-6 max-sm:p-4">{children}</div>
    </div>
  )
}
