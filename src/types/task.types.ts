import type { Task } from './index.ts'

export type CreateTaskData = {
  title: string
  columnId: string
  position: number
  createdBy: string
  priority: 'low' | 'medium' | 'high'
  description: string | null
}

export type UpdateTaskData = {
  title?: string
  description?: string
  column_id?: string
  position?: number
  priority?: 'low' | 'medium' | 'high'
  due_date?: string | null
  assignee_id?: string | null
}

export type Priority = 'low' | 'medium' | 'high'

export interface ReorderColumn {
  columnId: string
  orderedTaskIds: string[]
}

export type TaskWithComments = Task & { comments: { count: number }[] }
export type TasksByColumn = Record<string, TaskWithComments[]>
