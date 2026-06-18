import { CustomSelect } from '../../shared/Select.tsx'
import { priorityOptions, type PriorityStyle } from '../../../utils/priority.ts'
import type { UpdateTaskData } from '../../../types/task.types.ts'
import { Calendar } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import '@daypicker/react/style.css'

interface TaskMetaProps {
  isEditing: boolean
  editedTask: UpdateTaskData
  setEditedTask: Dispatch<SetStateAction<UpdateTaskData>>
  config: PriorityStyle
  due_date: string | null
}

export function TaskMeta({
  isEditing,
  editedTask,
  setEditedTask,
  config,
  due_date,
}: TaskMetaProps) {
  return (
    <div className="flex items-center gap-2 py-4">
      {isEditing ? (
        <div className="flex items-center gap-2 sm:*:shrink-0">
          <CustomSelect
            textSize="sm"
            value={editedTask.priority!}
            setValue={(value) => {
              setEditedTask((prev) => ({ ...prev, priority: value }))
            }}
            fields={priorityOptions}
          />
          <input
            type="date"
            lang="en"
            value={editedTask.due_date ?? ''}
            onChange={(e) =>
              setEditedTask((prev) => ({
                ...prev,
                due_date: e.target.value || null,
              }))
            }
            className="bg-sunken border-border text-text rounded-md px-3 py-2 text-sm"
          />
        </div>
      ) : (
        <>
          <div
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.container}`}
          >
            <span className={`h-2 w-2 rounded-full ${config.dot}`} />
            {config.label}
          </div>
          {due_date && (
            <p className="text-text-muted flex items-center gap-1.5">
              <Calendar size={16} className="text-texta-muted" />
              {due_date}
            </p>
          )}
        </>
      )}
    </div>
  )
}
