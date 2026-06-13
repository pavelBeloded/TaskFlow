import { supabase } from '../lib/supabase.ts'
import type { CreateTaskData, UpdateTaskData } from '../types/task.types.ts'

export async function createTask({
  title,
  columnId,
  position,
  createdBy,
  priority = 'medium',
  description = null,
}: CreateTaskData) {
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
