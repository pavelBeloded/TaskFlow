import { Drawer } from 'vaul'
import { X } from 'lucide-react'
import type { UpdateTaskData } from '../../../types/task.types.ts'
import { type Dispatch, type SetStateAction } from 'react'

interface TaskDrawerTitleProps {
  isEditing: boolean
  title: string
  editedTask: UpdateTaskData
  setEditedTask: Dispatch<SetStateAction<UpdateTaskData>>
}

export function TaskDrawerTitle({
  title,
  setEditedTask,
  isEditing,
  editedTask,
}: TaskDrawerTitleProps) {
  return (
    <header className="flex items-start justify-between gap-3 py-4">
      {isEditing ? (
        <input
          className="bg-sunken text-text-h w-full rounded-md px-3 py-2 text-lg font-medium"
          value={editedTask.title ?? ''}
          onChange={(e) =>
            setEditedTask((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      ) : (
        <p className="text-text-h text-lg font-medium">{title}</p>
      )}
      <Drawer.Close className="text-text-muted hover:text-text mt-1 shrink-0">
        <X size={20} />
      </Drawer.Close>
    </header>
  )
}
