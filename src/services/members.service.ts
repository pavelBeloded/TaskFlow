import { supabase } from '../lib/supabase.ts'

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, avatar_url')
    .eq('email', email)
    .single()

  if (error) throw error
  return data
}

export async function addBoardMember(boardId: string, userId: string) {
  const { data, error } = await supabase
    .from('board_members')
    .insert([{ board_id: boardId, user_id: userId, role: 'member' }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteBoardMember(boardId: string, userId: string) {
  const { error } = await supabase
    .from('board_members')
    .delete()
    .eq('board_id', boardId)
    .eq('user_id', userId)

  if (error) throw error
}
