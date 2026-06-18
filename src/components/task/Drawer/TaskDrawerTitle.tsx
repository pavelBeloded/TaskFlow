import { Drawer } from 'vaul'
import { X } from 'lucide-react'
import type { UpdateTaskData } from '../../../types/task.types.ts'
import { type Dispatch, type SetStateAction } from 'react'
import { Input } from '../../shared/Input.tsx'

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
    <header className="flex items-center justify-between py-4">
      {isEditing ? (
        <Input
          label="Edit title"
          value={editedTask.title}
          onChange={(e) =>
            setEditedTask((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      ) : (
        <p className="text-text-h text-lg font-medium">{title}</p>
      )}
      <Drawer.Close>
        <X size={20} className="text-text-muted font-medium" />
      </Drawer.Close>
    </header>
  )
}
