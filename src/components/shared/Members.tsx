import type { Profile } from '../../types'
import { Avatar } from './Avatar.tsx'

export function Members({
  profiles,
  show,
}: {
  profiles: Profile[]
  show: number
}) {
  const visible = profiles.slice(0, show)
  const remaining = profiles.length - show
  return (
    <div className="flex items-center">
      {visible.map((profile) => (
        <Avatar
          className="ml-2 first:ml-0"
          key={profile.id}
          name={profile.name ?? 'Unknown'}
          src={profile.avatar_url}
        />
      ))}
      {remaining > 0 && (
        <div className="border-surface bg-sunken text-text-muted -ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium">
          +{remaining}
        </div>
      )}
    </div>
  )
}
