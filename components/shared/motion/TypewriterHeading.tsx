'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import clsx from 'clsx'

export function TypedLine({ children, delay, className }: { children: ReactNode, delay: number, className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <span className={className}>{children}</span>
  }

  return (
    <motion.span
      className={clsx('inline-block overflow-hidden whitespace-nowrap', className)}
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      transition={{ duration: 0.55, delay, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.span>
  )
}

export function TypingCursor({ delay }: { delay: number }) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return null
  }

  return (
    <motion.span
      className="inline-block w-[3px] md:w-[5px] h-[0.8em] bg-primary ml-2 align-middle"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0] }}
      transition={{ duration: 2.4, delay, ease: 'linear' }}
    />
  )
}
