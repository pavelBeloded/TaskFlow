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
}
