import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createColumn,
  deleteColumn,
  updateColumn,
} from '../services/columns.service.ts'
import { showToast } from '../lib/toast.tsx'

export function useCreateColumn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      title,
      boardId,
      position,
    }: {
      title: string
      boardId: string
      position: number
    }) => createColumn(title, boardId, position),
    onSuccess: ({ title, board_id }) => {
      queryClient.invalidateQueries({ queryKey: ['board', board_id] })
      showToast.success(`Column ${title} created successfully.`)
    },

    onError: (error) => {
      showToast.error(error.message)
    },
  })
}

export function useDeleteColumn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; boardId: string }) => deleteColumn(id),

    onSuccess: (_, variables) => {
      const { boardId } = variables

      queryClient.invalidateQueries({ queryKey: ['board', boardId] })
      showToast.success(`Column deleted successfully.`)
    },

    onError: (error) => {
      showToast.error(error.message)
    },
  })
}

export function useUpdateColumn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      updateColumn(id, title),
    onSuccess: ({ title, board_id }) => {
      queryClient.invalidateQueries({ queryKey: ['board', board_id] })
      showToast.success(`Column renamed to ${title} successfully.`)
    },
  })
}
