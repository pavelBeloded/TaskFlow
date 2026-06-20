import { supabase } from '../lib/supabase.ts'

export async function getComments(taskId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(*)')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })

  if (error) throw error

  return data
}

export async function createComment(
  taskId: string,
  content: string,
  userId: string
) {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ task_id: taskId, content: content, user_id: userId }])
    .select()
    .single()

  if (error) throw error

  return data
}

export async function deleteComment(id: string) {
  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) throw error
}
