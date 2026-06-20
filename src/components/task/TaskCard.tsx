import { Calendar, MessageSquare } from 'lucide-react'
import { useSortable } from '@dnd-kit/react/sortable'
import { useTaskDetail } from '../../hooks/useTaskDetail.ts'
import { getPriorityConfig } from '../../utils/priority.ts'
import { useBoardMemberMap } from '../../hooks/useBoards.ts'
import { Avatar } from '../shared/Avatar.tsx'

interface TaskCardProps {
  title: string
  priority: string | null
  deadline: string | null
  id: string
  index: number
  columnId: string
  boardId: string
  assigneeId: string | null
  commentsCount: number
}
export function TaskCard({
  title,
  priority,
  deadline,
  id,
  index,
  columnId,
  boardId,
  assigneeId,
  commentsCount,
}: TaskCardProps) {
  const config = getPriorityConfig(priority)
  const { openTask } = useTaskDetail()
  const { data: memberMap } = useBoardMemberMap(boardId)
  const assignee = assigneeId ? memberMap?.get(assigneeId) : null

  const { ref, isDragging } = useSortable({
    id,
    index,
    type: 'task',
    accept: 'task',
    group: columnId,
  })

  return (
    <div
      onClick={() => {
        openTask(id)
        ;(document.activeElement as HTMLElement)?.blur()
      }}
      ref={ref}
      data-dragging={isDragging}
      className={`bg-surface border-border flex flex-col items-start gap-3 rounded-md border border-l-3 p-3 ${config.border} ${isDragging ? 'opacity-40' : ''}`}
    >
      <p className="text-text-h text-md font-medium">{title}</p>
      <div className="flex w-full items-center justify-between">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.container}`}
        >
          <span className={`h-2 w-2 rounded-full ${config.dot}`} />
          {config.label}
        </div>
        {deadline && (
          <p className="text-text-muted flex items-center gap-1 text-xs font-medium">
            <Calendar size={14} />
            {deadline}
          </p>
        )}
      </div>
      <div className="flex w-full items-center justify-between">
        {assignee && (
          <Avatar
            name={assignee.name ?? 'U'}
            src={assignee.avatar_url}
            className="h-6 w-6 text-xs"
          />
        )}

        <div className="text-text-muted text-md flex items-center gap-2">
          <MessageSquare size={16} />
          <span>{commentsCount}</span>
        </div>
      </div>
    </div>
  )
}
