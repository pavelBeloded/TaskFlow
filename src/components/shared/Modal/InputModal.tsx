import { Input } from '../Input.tsx'
import { Button } from '../Button.tsx'
import { Modal } from './Modal.tsx'
import { Spinner } from '../Loading.tsx'

interface InputModalProps {
  isOpen: boolean
  setIsOpen: (arg: boolean) => void
  value: string
  setValue: (arg: string) => void
  title: string
  isPending: boolean
  handleSubmit: () => void
  description: string
  label: string
  actionName: string
  pendingName: string
}

export function InputModal({
  isOpen,
  setIsOpen,
  value,
  setValue,
  title,
  isPending,
  handleSubmit,
  description,
  label,
  actionName,
  pendingName,
}: InputModalProps) {
  return (
    <Modal
      description={description}
      open={isOpen}
      title={title}
      onOpenChange={setIsOpen}
    >
      <Input
        label={label}
        value={value}
        autoFocus
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !isPending && value.trim()) handleSubmit()
        }}
      />
      <div className="flex items-center justify-end gap-2.5">
        <Button
          text="Close"
          className="text-text"
          variant="outline"
          onClick={() => setIsOpen(false)}
        />
        <Button
          text={isPending ? pendingName : actionName}
          disabled={isPending || !value.trim()}
          onClick={handleSubmit}
          variant="default"
          icon={isPending && <Spinner size={16} />}
        />
      </div>
    </Modal>
  )
}
