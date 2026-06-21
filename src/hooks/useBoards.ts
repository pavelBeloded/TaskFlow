import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createBoard,
  deleteBoard,
  getBoard,
  getBoards,
} from '../services/boards.service.ts'
import { showToast } from '../lib/toast.tsx'

export function useBoards() {
  return useQuery({
    queryKey: ['boards'],
    queryFn: () => getBoards(),
    retry: 2,
  })
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: ['board', id],
    queryFn: () => getBoard(id),
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
