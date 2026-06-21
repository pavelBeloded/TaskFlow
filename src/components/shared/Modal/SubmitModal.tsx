import { Button } from '../Button.tsx'
import { Modal } from './Modal.tsx'
import { Spinner } from '../Loading.tsx'
import { Trash, Pencil } from 'lucide-react'

type SubmitModalVariant = 'dangerous' | 'info'

interface SubmitModalProps {
  isOpen: boolean
  setIsOpen: (arg: boolean) => void
  title: string
  description: string
  isPending: boolean
  handleSubmit: () => void
  variant?: SubmitModalVariant
  confirmText?: string
}

const variantConfig = {
  dangerous: {
    Icon: Trash,
    iconClass: 'bg-coral-400/12 text-coral-400',
    confirmClass: 'bg-coral-400 text-white hover:bg-coral-600',
    confirmText: 'Delete',
  },
  info: {
    Icon: Pencil,
    iconClass: 'bg-accent-bg text-accent',
    confirmClass: '',
    confirmText: 'Save',
  },
} as const

export function SubmitModal({
  isOpen,
  setIsOpen,
  title,
  description,
  isPending,
  handleSubmit,
  variant = 'dangerous',
  confirmText,
}: SubmitModalProps) {
  const {
    Icon,
    iconClass,
    confirmClass,
    confirmText: defaultText,
  } = variantConfig[variant]

  return (
    <Modal
      variant="confirm"
      closable={false}
      description={description}
      open={isOpen}
      title={title}
      onOpenChange={setIsOpen}
      icon={
        <div
          className={`flex size-11 items-center justify-center rounded-md ${iconClass}`}
        >
          <Icon size={20} />
        </div>
      }
    >
      <div className="flex items-center gap-2.5">
        <Button
          text="Cancel"
          className="text-text flex-1"
          variant="outline"
          onClick={() => setIsOpen(false)}
        />
        <Button
          text={confirmText ?? defaultText}
          className={`flex-1 ${confirmClass}`}
          disabled={isPending}
          onClick={handleSubmit}
          variant="default"
          icon={isPending && <Spinner size={16} />}
        />
      </div>
    </Modal>
  )
}
