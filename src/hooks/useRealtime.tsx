import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { supabase } from '../lib/supabase.ts'

export function useRealtime(boardId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel(`board-${boardId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => queryClient.invalidateQueries({ queryKey: ['board', boardId] })
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'columns',
          filter: `board_id=eq.${boardId}`,
        },
        () => queryClient.invalidateQueries({ queryKey: ['board', boardId] })
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['board', boardId] })
          queryClient.invalidateQueries({ queryKey: ['comments'] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'board_members',
          filter: `board_id=eq.${boardId}`,
        },
        () =>
          queryClient.invalidateQueries({
            queryKey: ['board_members', boardId],
          })
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [boardId, queryClient])
}
