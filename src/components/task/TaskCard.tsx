import { Calendar } from 'lucide-react'
import { useSortable } from '@dnd-kit/react/sortable'
import { useTaskDetail } from '../../hooks/useTaskDetail.ts'

interface TaskCardProps {
  title: string
  priority: string | null
  deadline: string | null
  id: string
  assigneeId: string | null
  index: number
  columnId: string
}

type PriorityStyle = {
  label: string
  container: string
  dot: string
  border: string
}

const PRIORITY_CONFIG: Record<string, PriorityStyle> = {
  high: {
    label: 'High',
    container: 'bg-priority-high/10 text-priority-high',
    dot: 'bg-priority-high',
    border: 'border-l-priority-high',
  },
  medium: {
    label: 'Medium',
    container: 'bg-priority-medium/10 text-priority-medium',
    dot: 'bg-priority-medium',
    border: 'border-l-priority-medium',
  },
  low: {
    label: 'Low',
    container: 'bg-priority-low/10 text-priority-low',
    dot: 'bg-priority-low',
    border: 'border-l-priority-low',
  },
}

const FALLBACK: PriorityStyle = {
  label: '—',
  container: 'bg-sunken text-text-muted',
  dot: 'bg-text-muted',
  border: 'border-l-border',
}

export function TaskCard({
  title,
  priority,
  deadline,
  assigneeId,
  id,
  index,
  columnId,
}: TaskCardProps) {
  const config = PRIORITY_CONFIG[priority?.toLowerCase() ?? ''] ?? FALLBACK

  const { openTask } = useTaskDetail()

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
      }}
      ref={ref}
      data-dragging={isDragging}
      className={`bg-surface border-border flex flex-col items-start gap-2 rounded-md border border-l-3 p-3 ${config.border} ${isDragging ? 'opacity-40' : ''}`}
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
          <p className="text-text-muted flex items-center gap-1 text-xs">
            <Calendar size={14} />
            {deadline}
          </p>
        )}
      </div>
      <p className="text-text text-sm">{assigneeId ? 'Soon' : 'No assignee'}</p>
    </div>
  )
}
