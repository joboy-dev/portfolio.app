import clsx from 'clsx'
import React from 'react'

export default function ProgressBar({ value, max = 100, width = '100px', className, color = 'bg-primary-strong' }: { value: number, max?: number, width?: string, className?: string, color?: string }) {
  return (
    <div
      className={clsx('h-1.5 rounded-full bg-muted overflow-hidden', className)}
      style={{ width }}
      role="progressbar"
      aria-valuenow={Math.min(value, max)}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={clsx('h-full rounded-full transition-[width] duration-(--dur-slow) ease-out', color)}
        style={{ width: `${value > max ? max : value}%` }}
      />
    </div>
  )
}
