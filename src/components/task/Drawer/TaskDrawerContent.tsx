import type { Task } from '../../../types'
import { getPriorityConfig } from '../../../utils/priority.ts'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { useState } from 'react'
import { TaskMeta } from './TaskMeta.tsx'
import { TaskDescription } from './TaskDescription.tsx'
import { TaskDrawerFooter } from './TaskDrawerFooter.tsx'
import { useTaskEdit } from '../../../hooks/useTaskEdit.ts'
import { useDeleteTask } from '../../../hooks/useTasks.ts'
import { TaskDrawerTitle } from './TaskDrawerTitle.tsx'
import { SubmitModal } from '../../shared/Modal/SubmitModal.tsx'
import type { BoardMembersWithProfile } from '../../../types/board.types.ts'
import { TaskComments } from '../Comments/TaskComments.tsx'

export function TaskDrawerContent({
  task,
  boardId,
  close,
  members,
  isMobile,
  isOwner,
}: {
  task: Task
  boardId: string
  close: () => void
  members: BoardMembersWithProfile[]
  isMobile: boolean
  isOwner: boolean
}) {
  const config = getPriorityConfig(task.priority)
  const deleteTask = useDeleteTask(boardId)
  const {
    editedTask,
    isEditing,
    isSaving,
    startEdit,
    cancelEdit,
    saveTask,
    setEditedTask,
  } = useTaskEdit(task, boardId)

  const [confirmOpen, setConfirmOpen] = useState(false)

  const confirmDelete = () => {
    deleteTask.mutate(task.id, {
      onSuccess: () => {
        setConfirmOpen(false)
        close()
      },
    })
  }

  return (
    <div
      className={[
        `flex flex-col overflow-y-auto`,
        isMobile ? 'max-h-[75dvh]' : 'max-h-full',
      ].join(' ')}
    >
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
      <TaskComments taskId={task.id} />
      <Separator className="bg-border h-px" />
      <TaskDrawerFooter
        isOwner={isOwner}
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={startEdit}
        onCancel={cancelEdit}
        onSave={() => saveTask(editedTask)}
        onDelete={() => setConfirmOpen(true)}
      />

      <SubmitModal
        isOpen={confirmOpen}
        setIsOpen={setConfirmOpen}
        variant="dangerous"
        title={`Delete "${task.title}"?`}
        description="This action cannot be undone. The task will be permanently removed."
        isPending={deleteTask.isPending}
        handleSubmit={confirmDelete}
      />
    </div>
  )
}
