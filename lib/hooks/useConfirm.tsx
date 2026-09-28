'use client'

import { useCallback, useRef, useState } from 'react'
import ConfirmationModal from '@/components/shared/modal/ConfirmationModal'
import { toaster } from '@/lib/utils/toaster'

interface ConfirmOptions {
  title?: string
  content?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  /** The action to run when the user confirms. The dialog shows a loading
   *  state while this is in flight and closes only once it resolves. If it
   *  throws (e.g. `dispatch(x).unwrap()` rejecting), the dialog stays open
   *  and a toast reports the failure. */
  onConfirm: () => Promise<unknown> | unknown
}

/**
 * Promise-free confirm-before-destructive-action helper.
 *
 * const { confirm, ConfirmDialog } = useConfirm()
 * ...
 * onSelect: () => confirm({
 *   title: 'Delete skill',
 *   content: `Delete "${skill.name}"? This can't be undone.`,
 *   confirmLabel: 'Delete',
 *   onConfirm: () => dispatch(deleteSkill({ id: skill.id })).unwrap(),
 * })
 * ...
 * {ConfirmDialog}
 */
export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts)
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    if (isLoading) return
    setIsOpen(false)
  }, [isLoading])

  const handleConfirm = useCallback(async () => {
    if (!options) return
    setIsLoading(true)
    try {
      await options.onConfirm()
      setIsOpen(false)
    } catch {
      toaster.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [options])

  const ConfirmDialog = (
    <ConfirmationModal
      isOpen={isOpen}
      isLoading={isLoading}
      title={options?.title}
      content={options?.content}
      confirmLabel={options?.confirmLabel}
      cancelLabel={options?.cancelLabel}
      danger={options?.danger ?? true}
      onConfirm={handleConfirm}
      onClose={handleClose}
    />
  )

  return { confirm, ConfirmDialog }
}
