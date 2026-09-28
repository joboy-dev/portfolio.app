import Dialog from './Dialog'
import Button from '../button/Button';

interface ModalProps {
  title?: string
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  content?: string;
  isLoading: boolean;
  confirmLabel?: string
  cancelLabel?: string
  /** Most confirmations here guard a destructive action (delete, detach). */
  danger?: boolean
}

export default function ConfirmationModal({
  title,
  isOpen,
  isLoading,
  onConfirm,
  content,
  onClose,
  confirmLabel = 'Proceed',
  cancelLabel = 'Cancel',
  danger = true,
}: ModalProps ) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => { if (!open && !isLoading) onClose() }}
      title={title ?? 'Are you sure?'}
      size='sm'
      closeDisabled={isLoading}
    >
      <p className='text-base text-muted-foreground mb-6'>{content}</p>
      <div className='flex items-center justify-end gap-3'>
        <Button
          size='sm'
          variant='outlineSecondary'
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>

         <Button
          size='sm'
          variant={danger ? 'danger' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  )
}
