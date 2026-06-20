import { Button } from '../../shared/Button.tsx'
import { Spinner } from '../../shared/Loading.tsx'
import { Pencil, Trash } from 'lucide-react'

interface TaskDrawerFooterProps {
  isEditing: boolean
  isSaving: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  onDelete: () => void
  isOwner: boolean
}

export function TaskDrawerFooter({
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  isOwner,
  onDelete,
}: TaskDrawerFooterProps) {
  return (
    <footer className="flex items-center justify-end gap-2 py-4">
      {isEditing ? (
        <>
          <Button
            variant="outline"
            className="text-text"
            text="Cancel"
            disabled={isSaving}
            onClick={onCancel}
          />
          <Button
            text={isSaving ? 'Saving...' : 'Save'}
            variant="default"
            disabled={isSaving}
            icon={isSaving && <Spinner size={16} />}
            onClick={onSave}
          />
        </>
      ) : (
        <>
          <Button
            icon={<Pencil size={16} />}
            variant="outline"
            className="text-text"
            text="Edit"
            onClick={onEdit}
          />
          {isOwner && (
            <Button
              icon={<Trash size={16} />}
              text="Delete"
              variant="outline"
              className="text-priority-high"
              onClick={onDelete}
            />
          )}
        </>
      )}
    </footer>
  )
}
