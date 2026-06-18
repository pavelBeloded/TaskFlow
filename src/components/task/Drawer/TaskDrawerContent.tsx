import type { Task } from '../../../types'
import { getPriorityConfig } from '../../../utils/priority.ts'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { TaskMeta } from './TaskMeta.tsx'
import { TaskDescription } from './TaskDescription.tsx'
import { TaskDrawerFooter } from './TaskDrawerFooter.tsx'
import { useTaskEdit } from '../../../hooks/useTaskEdit.ts'
import { useDeleteTask } from '../../../hooks/useTasks.ts'
import { TaskDrawerTitle } from './TaskDrawerTitle.tsx'
import type { BoardMembersWithProfile } from '../../../types/board.types.ts'

export function TaskDrawerContent({
  task,
  boardId,
  close,
  members,
}: {
  task: Task
  boardId: string
  close: () => void
  members: BoardMembersWithProfile[]
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
    <div className="flex max-h-[85vh] flex-col overflow-y-auto">
      <TaskDrawerTitle
        isEditing={isEditing}
        title={task.title}
        editedTask={editedTask}
        setEditedTask={setEditedTask}
      />
      <Separator className="bg-border h-px" />
      <TaskMeta
        members={members}
        editedTask={editedTask}
        setEditedTask={setEditedTask}
        due_date={task.due_date}
        assigneeId={task.assignee_id}
        isEditing={isEditing}
        config={config}
      />
      <Separator className="bg-border h-px" />
      <TaskDescription
        isEditing={isEditing}
        description={task.description}
        editedTask={editedTask}
        setEditedTask={setEditedTask}
      />
      <Separator className="bg-border h-px" />
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
