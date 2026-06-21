import { supabase } from '../lib/supabase.ts'
import type { UpdateProfileData } from '../types/profile.types.ts'

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function updateProfile(userId: string, data: UpdateProfileData) {
  const { data: result, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error

  if (data.name) {
    await supabase.auth.updateUser({
      data: { name: data.name },
    })
  }

  return result
}

export async function uploadAvatar(userId: string, file: File) {
  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)

  return data.publicUrl
}
