import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createComment,
  deleteComment,
  getComments,
} from '../services/comments.service.ts'
import { showToast } from '../lib/toast.tsx'

export function useComments(taskId: string) {
  return useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => getComments(taskId),
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      content,
      userId,
    }: {
      taskId: string
      content: string
      userId: string
    }) => createComment(taskId, content, userId),

    onSuccess: ({ task_id }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', task_id] })
    },

    onError: () => {
      showToast.error('Failed to create comment')
    },
  })
}

export function useDeleteComment(taskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] })
    },
  })
}
