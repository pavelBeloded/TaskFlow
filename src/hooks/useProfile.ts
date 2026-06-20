import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateProfile } from '../services/profiles.service.ts'
import { showToast } from '../lib/toast.tsx'
import type { UpdateProfileData } from '../types/profile.types.ts'

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string
      data: UpdateProfileData
    }) => updateProfile(userId, data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ['profile', id] })
      showToast.success(`Profile updated successfully.`)
    },
    onError: () => {
      showToast.error(`Profile updated failed`)
    },
  })
}
