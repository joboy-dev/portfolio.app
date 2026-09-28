/**
 * Shared framer-motion timing tokens. Mirrors the CSS custom properties in
 * app/globals.css (--ease-*, --dur-*) so JS-driven and CSS-driven motion
 * stay in sync. Import these instead of hand-typing cubic-beziers.
 */

export const ease = {
  out: [0.23, 1, 0.32, 1],
  inOut: [0.77, 0, 0.175, 1],
  drawer: [0.32, 0.72, 0, 1],
} as const

export const dur = {
  press: 0.14,
  fast: 0.18,
  base: 0.24,
  slow: 0.42,
} as const

export const spring = {
  snappy: { type: 'spring', duration: 0.35, bounce: 0.1 },
  soft: { type: 'spring', duration: 0.5, bounce: 0.15 },
} as const

/** Shared viewport config for scroll-triggered reveals. */
export const revealViewport = { once: true, amount: 0.2, margin: '-80px' } as const

/** Presets for overlay UI (modals, popovers, menus). Centered origin. */
export const overlayVariants = {
  initial: { opacity: 0, transform: 'scale(0.96) translateY(8px)' },
  animate: { opacity: 1, transform: 'scale(1) translateY(0px)' },
  exit: { opacity: 0, transform: 'scale(0.97) translateY(4px)' },
}

/** Presets for trigger-anchored popovers/menus/dropdowns (top-right origin by default). */
export function popoverVariants(origin: string = 'top right') {
  return {
    initial: { opacity: 0, transform: 'scale(0.97)', transformOrigin: origin },
    animate: { opacity: 1, transform: 'scale(1)', transformOrigin: origin },
    exit: { opacity: 0, transform: 'scale(0.97)', transformOrigin: origin },
  }
}

/** Presets for right-side sheets/drawers. */
export const sheetVariantsRight = {
  initial: { transform: 'translateX(100%)' },
  animate: { transform: 'translateX(0%)' },
  exit: { transform: 'translateX(100%)' },
}

/** Presets for left-side sheets/drawers (eg. the mobile admin sidebar). */
export const sheetVariantsLeft = {
  initial: { transform: 'translateX(-100%)' },
  animate: { transform: 'translateX(0%)' },
  exit: { transform: 'translateX(-100%)' },
}

/** Presets for bottom sheets (mobile modals, mobile nav). */
export const sheetVariantsBottom = {
  initial: { transform: 'translateY(100%)' },
  animate: { transform: 'translateY(0%)' },
  exit: { transform: 'translateY(100%)' },
}

/** Fade + rise, used by Reveal/RevealGroup. Uses the transform string (not
 * the x/y shorthand) so it stays hardware-accelerated under load. */
export const fadeUpVariants = {
  hidden: { opacity: 0, transform: 'translateY(16px)' },
  show: { opacity: 1, transform: 'translateY(0px)' },
}

export function staggerContainer(stagger: number = 0.06, delayChildren: number = 0) {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  }
}
