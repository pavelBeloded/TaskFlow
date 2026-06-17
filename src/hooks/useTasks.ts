import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTask,
  deleteTask,
  getTask,
  persistTaskMove,
  updateTask,
} from '../services/tasks.service.ts'
import type {
  CreateTaskData,
  ReorderColumn,
  UpdateTaskData,
} from '../types/task.types.ts'
import { showToast } from '../lib/toast.tsx'

export function useCreateTask(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTaskData) => createTask(data),
    onSuccess: ({ title }) => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] })
      showToast.success(`Task "${title}" created successfully.`)
    },
    onError: (error) => {
      showToast.error(error.message)
    },
  })
}

export function useDeleteTask(boardId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] })
      showToast.success(`Task deleted.`)
    },
    onError: (error) => {
      showToast.error(error.message)
    },
  })
}

export function useUpdateTask(boardId: string, silent: boolean = false) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      updateTask(id, data),
    onSuccess: ({ title }) => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] })
      if (!silent) {
        showToast.success(`Task ${title} updated successfully.`)
      }
    },
    onError: (error) => {
      showToast.error(error.message)
    },
  })
}

export function useMoveTask(boardId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ affected }: { affected: ReorderColumn[] }) =>
      persistTaskMove(affected),
    onError: () => showToast.error('Failed to move task'),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['board', boardId] }),
  })
}

export function useGetTask(id: string | null | undefined) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => getTask(id!),
    enabled: !!id,
  })
}
