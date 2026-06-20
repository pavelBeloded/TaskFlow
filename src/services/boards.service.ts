import { supabase } from '../lib/supabase.ts'
import { createColumn } from './columns.service.ts'

export async function getBoards(query: string | undefined) {
  let supabaseQuery = supabase
    .from('boards')
    .select('*, board_members(user_id, profiles (id, name, avatar_url))')

  if (query && query.trim() !== '') {
    supabaseQuery = supabaseQuery.ilike('title', `%${query}%`)
  }

  const { data: boards, error } = await supabaseQuery

  if (error) {
    throw error
  }

  return boards ?? []
}

export async function getBoard(id: string) {
  const { data, error } = await supabase
    .from('boards')
    .select('*, columns (*, tasks (*, comments(count)))')
    .eq('id', id)
    .order('position', { referencedTable: 'columns', ascending: true })
    .order('position', { referencedTable: 'columns.tasks', ascending: true })
    .single()
  if (error) throw error
  return data
}

export async function createBoard(title: string) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    throw new Error('Not authorized')
  }

  const { data, error } = await supabase
    .from('boards')
    .insert([{ title: title, owner_id: user.id }])
    .select()

  if (error || data === null) {
    throw new Error('Error by creating board')
  }

  await Promise.all([
    createColumn('To Do', data[0].id, 0),
    createColumn('In Progress', data[0].id, 1),
    createColumn('Done', data[0].id, 2),
  ])

  return data[0]
}

export async function deleteBoard(boardId: string) {
  const { error } = await supabase.from('boards').delete().eq('id', boardId)

  if (error) {
    throw error
  }
}

export async function getBoardMembersProfiles(boardId: string) {
  const { data, error } = await supabase
    .from('board_members')
    .select('*, profiles (id, name, avatar_url)')
    .eq('board_id', boardId)
  if (error) {
    throw error
  }
  return data
}
