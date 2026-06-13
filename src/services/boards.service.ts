import { supabase } from '../lib/supabase.ts'

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

export async function createBoard(title: string) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    throw new Error('Not authorized')
  }
  console.log('user id:', user.id)
  console.log('inserting:', { title, owner_id: user.id })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  console.log('session:', session?.access_token ? 'exists' : 'null')
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

export async function createColumn(
  title: string,
  boardId: string,
  position: number
) {
  const { data, error } = await supabase
    .from('columns')
    .insert([{ title: title, board_id: boardId, position: position }])
    .select()

  if (error || data === null) {
    throw new Error('Error by creating column')
  }

  return data[0]
}

export async function deleteBoard(boardId: string) {
  const { error } = await supabase.from('boards').delete().eq('id', boardId)

  if (error) {
    throw error
  }
}
