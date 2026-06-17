import { useTaskDetail } from '../../hooks/useTaskDetail.ts'
import { useDeleteTask, useGetTask } from '../../hooks/useTasks.ts'
import { showToast } from '../../lib/toast.tsx'
import { Drawer } from 'vaul'
import { Loading } from '../shared/Loading.tsx'
import type { Task } from '../../types'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Calendar, Trash, X } from 'lucide-react'
import { Button } from '../shared/Button.tsx'

export function TaskDrawer({ boardId }: { boardId: string }) {
  const { taskId, closeTask } = useTaskDetail()
  const { data: task, isError, isLoading } = useGetTask(taskId)
  const deleteTask = useDeleteTask(boardId)

  if (isError) {
    showToast.error('Error getting task')
  }

  return (
    <Drawer.Root
      open={!!taskId}
      direction={'bottom'}
      onOpenChange={(open) => !open && closeTask()}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-surface fixed right-0 bottom-0 left-0 h-fit rounded-t-md p-4 outline-none">
          <Drawer.Title className="hidden">
            {task ? `${task.title} details` : 'Task details'}
          </Drawer.Title>
          <Drawer.Description className="hidden">
            Task Details
          </Drawer.Description>

          {isLoading || !task ? (
            <Loading />
          ) : (
            <TaskDrawerContent
              task={task}
              onDelete={() => {
                deleteTask.mutate(task.id)
                closeTask()
              }}
            />
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
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

function TaskDrawerContent({
  task,
  onDelete,
}: {
  task: Task
  onDelete: () => void
}) {
  const config = PRIORITY_CONFIG[task.priority?.toLowerCase() ?? ''] ?? FALLBACK

  return (
    <div>
      <div className="bg-sunken m-auto h-1.5 w-16 rounded-full"></div>
      <header className="flex items-center justify-between py-4">
        <p className="text-text-h text-lg font-medium">{task.title}</p>
        <Drawer.Close>
          <X size={20} className="text-text-muted font-medium" />
        </Drawer.Close>
      </header>
      <Separator className="bg-border my-1 h-px" />
      <div className="flex items-center gap-2 py-4">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.container}`}
        >
          <span className={`h-2 w-2 rounded-full ${config.dot}`} />
          {config.label}
        </div>
        {task.due_date && (
          <p>
            <Calendar size={16} className="text-text-muted" />
            {task.due_date}
          </p>
        )}
      </div>
      <Separator className="bg-border my-1 h-px" />
      <div className="py-4">
        <h4 className="text-text-muted text-md font-medium">Description</h4>
        <p>{!task.description ? 'There is nothing here' : task.description}</p>
      </div>
      <Separator className="bg-border my-1 h-px" />
      <footer className="py-4">
        <Button
          icon={<Trash size={16} />}
          text={'Delete'}
          variant="outline"
          className="text-priority-high"
          onClick={onDelete}
        />
      </footer>
    </div>
  )
}
