import { useProfile, useUpdateProfile } from '../hooks/useProfile.ts'
import { useParams } from 'react-router'
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
  const { data } = useProfile(id!)
  const { user } = useAuth()

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
  const updateProfile = useUpdateProfile()

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !id) return

    try {
      const url = await uploadAvatar(id, file)
      updateProfile.mutate({ userId: id, data: { avatar_url: url } })
    } catch {
      showToast.error('Failed to upload avatar')
    }
  }

  const onSubmit = (formData: { name: string }) => {
    updateProfile.mutate({
      userId: id!,
      data: { name: formData.name },
    })
  }

  if (!data) {
    return null
  }

  return (
    <div className="h-full w-full p-5">
      <div className="bg-surface border-border m-auto flex w-full max-w-xl flex-col items-start gap-4 rounded-lg border p-5">
        <h1 className="text-text-h text-xl font-medium">Profile</h1>

        <div className="flex items-center gap-3">
          <label className="relative cursor-pointer">
            <Avatar size="3xl" name={data.name ?? 'U'} src={data.avatar_url} />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity hover:opacity-100">
              <p className="text-xs text-white">Change</p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
          <div className="text-text text-lg font-medium">
            <p>{data.name}</p>
            <p className="text-text-muted text-sm">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-stretch gap-3">
            <Input
              id={'name'}
              type={'text'}
              autoComplete={'name'}
              label={'Name'}
              error={errors.name}
              {...register('name')}
            />
            <div>
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
          </div>
          <Button
            disabled={isSubmitting}
            className="mt-5"
            text={'Save changes'}
          />
        </form>
      </div>
    </div>
  )
}
