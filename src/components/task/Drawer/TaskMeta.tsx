import { CustomSelect } from '../../shared/Select.tsx'
import { priorityOptions, type PriorityStyle } from '../../../utils/priority.ts'
import type { UpdateTaskData } from '../../../types/task.types.ts'
import { Calendar } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import type { BoardMembersWithProfile } from '../../../types/board.types.ts'
import { Avatar } from '../../shared/Avatar.tsx'
import { formatDate } from '../../../utils/date.ts'

interface TaskMetaProps {
  isEditing: boolean
  editedTask: UpdateTaskData
  setEditedTask: Dispatch<SetStateAction<UpdateTaskData>>
  config: PriorityStyle
  due_date: string | null
  assigneeId: string | null
  members: BoardMembersWithProfile[]
}

export function TaskMeta({
  isEditing,
  editedTask,
  setEditedTask,
  config,
  due_date,
  assigneeId,
  members,
}: TaskMetaProps) {
  const memberOptions = Object.fromEntries(
    (members ?? []).map((m) => [m.user_id, m.profiles?.name ?? m.user_id])
  )

  const assignee = members.find((m) => m.user_id === assigneeId)

  if (isEditing) {
    return (
      <div className="flex flex-wrap items-center gap-2 py-4">
        <CustomSelect
          textSize="sm"
          value={editedTask.priority!}
          setValue={(value) =>
            setEditedTask((prev) => ({ ...prev, priority: value }))
          }
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
        <CustomSelect
          value={editedTask.assignee_id ?? ''}
          setValue={(value) =>
            setEditedTask((prev) => ({
              ...prev,
              assignee_id: value || null,
            }))
          }
          fields={memberOptions}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3 py-4">
      <div
        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.container}`}
      >
        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
        {config.label}
      </div>

      {due_date && (
        <div className="text-text-muted flex items-center gap-1.5 text-sm">
          <Calendar size={14} />
          {formatDate(due_date)}
        </div>
      )}

      {assignee && (
        <div className="flex items-center gap-1.5">
          <Avatar name={assignee.profiles?.name ?? 'U'} />
          <span className="text-text-muted text-sm">
            {assignee.profiles?.name}
          </span>
        </div>
      )}
    </div>
  )
}
