import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addBoardMember,
  deleteBoardMember,
  getUserByEmail,
} from '../services/members.service.ts'
import { showToast } from '../lib/toast.tsx'
import { getBoardMembersProfiles } from '../services/boards.service.ts'
import type { BoardMembers } from '../types/board.types.ts'

export function useInviteMember(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (email: string) => {
      const user = await getUserByEmail(email)
      return addBoardMember(boardId, user.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board_members', boardId] })
      showToast.success('User invited successfully.')
    },
    onError: () => {
      showToast.error('User not found or already a member.')
    },
  })
}

export function useDeleteMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ boardId, userId }: { boardId: string; userId: string }) =>
      deleteBoardMember(boardId, userId),
    onSuccess: (_, { boardId }) => {
      showToast.success('User deleted successfully.')
      queryClient.invalidateQueries({ queryKey: ['board_members', boardId] })
    },
    onError: () => {
      showToast.error('Failed to delete user.')
    },
  })
}

export function useBoardMembers<TData = BoardMembers>(
  boardId: string,
  options?: { select?: (data: BoardMembers) => TData }
) {
  return useQuery({
    queryKey: ['board_members', boardId],
    queryFn: () => getBoardMembersProfiles(boardId),
    select: options?.select,
  })
}
