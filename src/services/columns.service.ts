import { supabase } from '../lib/supabase.ts'

export async function createColumn(
  title: string,
  boardId: string,
  position: number
) {
  const { data, error } = await supabase
    .from('columns')
    .insert([{ title: title, board_id: boardId, position: position }])
    .select()
    .single()

  if (error || data === null) {
    throw new Error('Error by creating column')
  }

  return data
}

export async function deleteColumn(id: string) {
  const { error } = await supabase.from('columns').delete().eq('id', id)
  if (error) throw error
}

export async function updateColumn(id: string, title: string) {
  const { data, error } = await supabase
    .from('columns')
    .update({ title: title })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error

  return data
}
