import { Calendar } from 'lucide-react'

interface TaskCardProps {
  title: string
  priority: string | null
  deadline: string | null
  id: string
  assigneeId: string | null
}

const PRIORITY_CONFIG: Record<
  string,
  { label: string; container: string; dot: string; border: string }
> = {
  high: {
    label: 'High',
    container: 'bg-priority-high/10 text-priority-high',
    dot: 'bg-priority-high',
    border: 'border-l-priority-high',
  },
  medium: {
    label: 'Medium',
    container: 'bg-priority-medium/10 text-priority-medium', // Предполагаемые ваши кастомные цвета
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

export function TaskCard({
  title,
  priority,
  deadline,
  assigneeId,
}: TaskCardProps) {
  const normalizedPriority = priority?.toLowerCase() || ''
  const currentPriority = PRIORITY_CONFIG[normalizedPriority]

  const assignee = assigneeId

  return (
    <div
      className={`bg-surface border-border flex flex-col items-start gap-2 rounded-md border border-l-3 p-3 ${currentPriority.border}`}
    >
      <p className="text-text-h text-md font-medium">{title}</p>
      <div className="itemd-center flex justify-between">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${currentPriority.container}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${currentPriority.dot}`}
          ></span>
          {currentPriority.label}
        </div>
        <p>
          {deadline && <Calendar size={16} className="text-text-muted" />}
          {deadline}
        </p>
      </div>
      <div>
        <p className="text-text text-sm">{assignee ? 'Soon' : 'No assignee'}</p>
      </div>
    </div>
  )
}
