import { useUpdateTask } from './useTasks.ts'
import type { Priority, UpdateTaskData } from '../types/task.types.ts'
import { useState } from 'react'
import type { Task } from '../types'

export function useTaskEdit(task: Task, boardId: string) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<UpdateTaskData>({
    title: task.title,
    description: task.description ?? '',
    priority: task.priority as Priority,
    due_date: task.due_date,
  })

  const updateTask = useUpdateTask(boardId)

  function saveTask(data: UpdateTaskData) {
    updateTask.mutate({ id: task.id, data: data })
  }

  return {
    isEditing,
    setIsEditing,
    editedTask,
    setEditedTask,
    saveTask,
  }
}
