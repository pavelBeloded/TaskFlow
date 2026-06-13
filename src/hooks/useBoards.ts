import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createBoard,
  deleteBoard,
  getBoards,
} from '../services/boards.service.ts'
import { showToast } from '../lib/toast.tsx'

export function useBoards(searchQuery?: string) {
  return useQuery({
    queryKey: ['boards', searchQuery],
    queryFn: () => getBoards(searchQuery),
    retry: 2,
  })
}

export function useCreateBoard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (title: string) => createBoard(title),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      showToast.success(`New board created successfully.`)
    },

    onError: (error) => {
      showToast.error(error.message)
    },
  })
}

export function useDeleteBoard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBoard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] })
      showToast.success(`Board deleted successfully.`)
    },
    onError: (error) => {
      showToast.error(error.message)
    },
  })
}
