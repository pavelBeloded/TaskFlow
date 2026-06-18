import type { Task } from '../../../types'
import { getPriorityConfig } from '../../../utils/priority.ts'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { TaskMeta } from './TaskMeta.tsx'
import { TaskDescription } from './TaskDescription.tsx'
import { TaskDrawerFooter } from './TaskDrawerFooter.tsx'
import { useTaskEdit } from '../../../hooks/useTaskEdit.ts'
import { useDeleteTask } from '../../../hooks/useTasks.ts'
import { TaskDrawerTitle } from './TaskDrawerTitle.tsx'

export function TaskDrawerContent({
  task,
  boardId,
  close,
}: {
  task: Task
  boardId: string
  close: () => void
}) {
  const config = getPriorityConfig(task.priority)
  const deleteTask = useDeleteTask(boardId)

  const { editedTask, isEditing, saveTask, setIsEditing, setEditedTask } =
    useTaskEdit(task, boardId)

  const handleDelete = () => {
    deleteTask.mutate(task.id)
    close()
  }

  return (
    <div>
      <TaskDrawerTitle
        isEditing={isEditing}
        title={task.title}
        editedTask={editedTask}
        setEditedTask={setEditedTask}
      />
      <Separator className="bg-border my-1 h-px" />
      <TaskMeta
        editedTask={editedTask}
        setEditedTask={setEditedTask}
        due_date={task.due_date}
        isEditing={isEditing}
        config={config}
      />
      <Separator className="bg-border my-1 h-px" />
      <TaskDescription
        isEditing={isEditing}
        description={task.description}
        editedTask={editedTask}
        setEditedTask={setEditedTask}
      />
      <Separator className="bg-border my-1 h-px" />
      <TaskDrawerFooter
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onDelete={handleDelete}
        onSave={saveTask}
        editedTask={editedTask}
      />
    </div>
  )
}
