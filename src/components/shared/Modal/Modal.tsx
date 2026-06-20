import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface ModalProps {
  title?: string
  open?: boolean
  closable?: boolean
  description: string
  variant?: 'default' | 'confirm'
  icon?: ReactNode
  onOpenChange: (arg: boolean) => void
  children?: ReactNode
}

export function Modal({
  title,
  open,
  description,
  closable = true,
  variant = 'default',
  icon,
  onOpenChange,
  children,
}: ModalProps) {
  const isConfirm = variant === 'confirm'

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="bg-bg shadow-modal fixed top-1/3 left-1/2 flex w-full max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-5 rounded-lg p-6">
          {isConfirm ? (
            <>
              <div className="flex flex-col items-center gap-3 text-center">
                {icon}
                <Dialog.Title className="text-text-h text-xl">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="text-text-muted text-base">
                  {description}
                </Dialog.Description>
              </div>
              {children}
            </>
          ) : (
            <>
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
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
