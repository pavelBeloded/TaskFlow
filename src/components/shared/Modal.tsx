import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface ModalProps {
  title?: string
  open?: boolean
  closable?: boolean
  description: string
  onOpenChange: (arg: boolean) => void
  children?: ReactNode
}

export function Modal({
  title,
  open,
  description,
  closable = true,
  onOpenChange,
  children,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="bg-bg shadow-modal fixed top-1/3 left-1/2 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-lg p-6">
          <Dialog.Description className="hidden">
            {description}
          </Dialog.Description>

          <div className="flex w-full items-center justify-between">
            <Dialog.Title>{title}</Dialog.Title>
            {closable && (
              <Dialog.Close>
                <X size={16} className="text-text-muted" />
              </Dialog.Close>
            )}
          </div>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
