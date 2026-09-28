import type { ReactNode } from "react";
import Dialog from "./Dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md"
}: ModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => { if (!open) onClose() }}
      title={title ?? ''}
      size={size}
    >
      {children}
    </Dialog>
  );
}
