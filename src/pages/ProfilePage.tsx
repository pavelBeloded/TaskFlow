import { useProfile, useUpdateProfile } from '../hooks/useProfile.ts'
import { Navigate, useParams } from 'react-router'
import { Avatar } from '../components/shared/Avatar.tsx'
import { useAuth } from '../providers/AuthProvider.tsx'
import { Input } from '../components/shared/Input.tsx'
import { Button } from '../components/shared/Button.tsx'
import { useForm } from 'react-hook-form'
import { type ChangeEvent, useEffect } from 'react'
import { uploadAvatar } from '../services/profiles.service.ts'
import { showToast } from '../lib/toast.tsx'

export function ProfilePage() {
  const { id } = useParams()
  if (!id) return <Navigate to="/" replace />
  return <ProfileView userId={id} />
}

function ProfileView({ userId }: { userId: string }) {
  const { data } = useProfile(userId)
  const { user } = useAuth()
  const updateProfile = useUpdateProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (data?.name) reset({ name: data.name })
  }, [data, reset])

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadAvatar(userId, file)
      updateProfile.mutate({ userId, data: { avatar_url: url } })
    } catch {
      showToast.error('Failed to upload avatar')
    }
  }

  const onSubmit = (formData: { name: string }) => {
    updateProfile.mutate({ userId, data: { name: formData.name.trim() } })
  }

  if (!data) return null

  return (
    <div className="h-full w-full p-5">
      <div className="m-auto flex w-full max-w-xl flex-col gap-4">
        <div className="bg-surface border-border flex flex-col gap-5 rounded-lg border p-6">
          <h1 className="text-text-h text-xl font-medium">Profile</h1>

          <div className="flex items-center gap-4">
            <label className="relative cursor-pointer">
              <Avatar
                size="3xl"
                name={data.name ?? 'U'}
                src={data.avatar_url}
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <p className="text-xs font-medium text-white">Change</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
            <div className="flex flex-col gap-0.5">
              <p className="text-text-h text-lg font-medium">{data.name}</p>
              <p className="text-text-muted text-sm">{user?.email}</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <Input
              id="name"
              type="text"
              autoComplete="name"
              label="Full name"
              error={errors.name}
              {...register('name')}
            />
            <div className="flex flex-col gap-1">
              <Input
                label="Email"
                value={user?.email ?? ''}
                onChange={() => {}}
                disabled
              />
              <p className="text-text-muted text-xs">
                Email address cannot be changed
              </p>
            </div>
            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                text={isSubmitting ? 'Saving...' : 'Save changes'}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
