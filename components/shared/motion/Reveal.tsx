'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { dur, ease, fadeUpVariants, revealViewport, staggerContainer } from '@/lib/motion'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

/**
 * Fade + rise on scroll-into-view. Animates the `transform` string (not the
 * `y` shorthand) so it stays hardware-accelerated. Under reduced motion it
 * still fades (opacity only, no movement) rather than doing nothing.
 */
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? { opacity: 0 } : fadeUpVariants.hidden}
      whileInView={shouldReduceMotion ? { opacity: 1 } : fadeUpVariants.show}
      viewport={revealViewport}
      transition={{ duration: shouldReduceMotion ? 0.2 : dur.slow, delay, ease: ease.out }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Parent for a group of RevealItem children that should cascade in with a
 * short stagger, instead of each item hand-rolling `index * delay`.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.06,
}: {
  children: ReactNode
  className?: string
  stagger?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={revealViewport}
      variants={staggerContainer(stagger)}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={
        shouldReduceMotion
          ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
          : fadeUpVariants
      }
      transition={{ duration: shouldReduceMotion ? 0.2 : dur.slow, ease: ease.out }}
    >
      {children}
    </motion.div>
  )
}
