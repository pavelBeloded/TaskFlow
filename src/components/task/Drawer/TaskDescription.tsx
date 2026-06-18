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
    <>
      {isEditing ? (
        <div className="py-4">
          <h4 className="text-text-muted text-md font-medium">
            Edit description
          </h4>
          <p className="mt-1">
            <textarea
              autoFocus={true}
              className="border-border-strong bg-sunken w-full rounded-md border p-1"
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </p>
        </div>
      ) : (
        <div className="py-4">
          <h4 className="text-text-muted text-md font-medium">Description</h4>
          <p className="mt-1">
            {!description ? 'There is nothing here' : description}
          </p>
        </div>
      )}
    </>
  )
}
