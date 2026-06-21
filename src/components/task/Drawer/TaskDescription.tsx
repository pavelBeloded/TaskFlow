import type { UpdateTaskData } from '../../../types/task.types.ts'
import type { Dispatch, SetStateAction } from 'react'

interface TaskDescriptionProps {
  isEditing: boolean
  description: string | null
  editedTask: UpdateTaskData
  setEditedTask: Dispatch<SetStateAction<UpdateTaskData>>
}

export function TaskDescription({
  isEditing,
  setEditedTask,
  editedTask,
  description,
}: TaskDescriptionProps) {
  return (
    <div className="px-1 py-4">
      <h4 className="text-text-muted mb-2 text-sm font-medium tracking-wide uppercase">
        Description
      </h4>
      {isEditing ? (
        <textarea
          autoFocus
          rows={4}
          className="border-border bg-sunken text-text w-full rounded-md border p-3 text-sm"
          value={editedTask.description ?? ''}
          onChange={(e) =>
            setEditedTask((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      ) : (
        <p className="text-text text-sm leading-relaxed">
          {description ?? (
            <span className="text-text-faint italic">No description</span>
          )}
        </p>
      )}
    </div>
  )
}
