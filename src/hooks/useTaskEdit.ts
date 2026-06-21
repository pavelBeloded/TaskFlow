import { useUpdateTask } from './useTasks.ts'
import type { Priority, UpdateTaskData } from '../types/task.types.ts'
import { useState } from 'react'
import type { Task } from '../types'

export function useTaskEdit(task: Task, boardId: string) {
  const [isEditing, setIsEditing] = useState(false)

  function toEditData(t: Task): UpdateTaskData {
    return {
      title: t.title,
      description: t.description ?? '',
      priority: t.priority as Priority,
      due_date: t.due_date,
      assignee_id: t.assignee_id,
    }
  }

  const [editedTask, setEditedTask] = useState<UpdateTaskData>(() =>
    toEditData(task)
  )

  const updateTask = useUpdateTask(boardId)

  function startEdit() {
    setEditedTask(toEditData(task))
    setIsEditing(true)
  }

  function cancelEdit() {
    setEditedTask(toEditData(task))
    setIsEditing(false)
  }

  function saveTask(data: UpdateTaskData) {
    updateTask.mutate(
      { id: task.id, data: data },
      { onSuccess: () => setIsEditing(false) }
    )
  }

  return {
    isEditing,
    isSaving: updateTask.isPending,
    editedTask,
    setEditedTask,
    startEdit,
    cancelEdit,
    saveTask,
  }
}
