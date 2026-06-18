import { Button } from '../../shared/Button.tsx'
import type { UpdateTaskData } from '../../../types/task.types.ts'
import { Pencil, Trash } from 'lucide-react'

interface TaskDrawerFooter {
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  onDelete: () => void
  onSave: (editedTask: UpdateTaskData) => void
  editedTask: UpdateTaskData
}

export function TaskDrawerFooter({
  isEditing,
  setIsEditing,
  editedTask,
  onSave,
  onDelete,
}: TaskDrawerFooter) {
  return (
    <footer className="flex items-center justify-end gap-2 py-4">
      {isEditing ? (
        <>
          <Button
            variant="outline"
            className="text-text"
            text="Cancel"
            onClick={() => {
              setIsEditing(false)
            }}
          />
          <Button
            text={'Save'}
            variant="default"
            onClick={() => {
              onSave(editedTask)
              setIsEditing(false)
            }}
          />
        </>
      ) : (
        <>
          <Button
            icon={<Pencil size={16} />}
            variant="outline"
            className="text-text"
            text="Edit"
            onClick={() => {
              setIsEditing(true)
            }}
          />
          <Button
            icon={<Trash size={16} />}
            text={'Delete'}
            variant="outline"
            className="text-priority-high"
            onClick={onDelete}
          />
        </>
      )}
    </footer>
  )
}
