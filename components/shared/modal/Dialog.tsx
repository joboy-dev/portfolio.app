'use client'

import * as RadixDialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import clsx from 'clsx'
import { dur, ease, overlayVariants } from '@/lib/motion'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showClose?: boolean
  /** Disable Escape / outside-click dismissal, e.g. while a mutation is in flight. */
  closeDisabled?: boolean
  /** Render title/description visually hidden (still read by screen readers,
   *  still satisfies Radix's aria-labelledby requirement) so the caller can
   *  supply its own header UI (icon, steps, a differently-styled close). */
  hideHeader?: boolean
  /** Remove the default body padding, e.g. when the child owns its own layout. */
  noPadding?: boolean
}

const sizeMap = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-3xl', xl: 'max-w-5xl' }

/**
 * Accessible centered dialog: focus trap, Escape to close, focus return to
 * trigger, and body scroll lock all come from Radix. Motion is layered on
 * top with framer-motion so enter/exit both animate (exit faster than
 * enter), instead of the old `if (!isOpen) return null` teleport.
 */
export default function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
  closeDisabled = false,
  hideHeader = false,
  noPadding = false,
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-(--z-overlay) bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: dur.base, ease: ease.out }}
              />
            </RadixDialog.Overlay>

            <div className="fixed inset-0 z-(--z-modal) flex items-center justify-center p-4">
              <RadixDialog.Content
                asChild
                forceMount
                onEscapeKeyDown={(e) => { if (closeDisabled) e.preventDefault() }}
                onPointerDownOutside={(e) => { if (closeDisabled) e.preventDefault() }}
                onInteractOutside={(e) => { if (closeDisabled) e.preventDefault() }}
              >
                <motion.div
                  className={clsx(
                    'relative w-full bg-card text-card-foreground rounded-lg shadow-lg border border-border flex flex-col overflow-hidden max-h-[85vh]',
                    sizeMap[size]
                  )}
                  initial={overlayVariants.initial}
                  animate={overlayVariants.animate}
                  exit={overlayVariants.exit}
                  transition={{ duration: dur.base, ease: ease.out }}
                >
                  {hideHeader ? (
                    <>
                      <RadixDialog.Title className="sr-only">{title}</RadixDialog.Title>
                      {description && <RadixDialog.Description className="sr-only">{description}</RadixDialog.Description>}
                    </>
                  ) : (
                    <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border shrink-0">
                      <div>
                        <RadixDialog.Title className="text-lg font-semibold text-foreground">{title}</RadixDialog.Title>
                        {description && (
                          <RadixDialog.Description className="text-sm text-muted-foreground mt-0.5">
                            {description}
                          </RadixDialog.Description>
                        )}
                      </div>
                      {showClose && (
                        <RadixDialog.Close asChild>
                          <button
                            type="button"
                            aria-label="Close"
                            className="shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-(--dur-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </RadixDialog.Close>
                      )}
                    </div>
                  )}

                  <div className={clsx('overflow-y-auto', !noPadding && 'px-5 py-4')}>{children}</div>
                </motion.div>
              </RadixDialog.Content>
            </div>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  )
}
