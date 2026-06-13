import { supabase } from '../lib/supabase.ts'

export async function createTask(
  title: string,
  columnId: string,
  position: number,
  createdBy: string,
  priority: 'low' | 'medium' | 'high' = 'medium',
  description: string | null = null
) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        title,
        column_id: columnId,
        created_by: createdBy,
        position,
        priority,
        description,
      },
    ])
    .select()
    .single()

  if (error || data === null) {
    throw new Error('Error by creating task')
  }

  return data
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}

type UpdateTaskData = {
  title?: string
  description?: string
  column_id?: string
  position?: number
  priority?: 'low' | 'medium' | 'high'
}

export async function updateTask(id: string, updateData: UpdateTaskData) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error || data === null) {
    throw new Error('Error by updating task')
  }

  return data
}
