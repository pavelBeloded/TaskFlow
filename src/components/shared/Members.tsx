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
          key={profile.id}
          name={profile.name ?? 'Unknown'}
          src={profile.avatar_url}
          className="ring-surface -ml-1.5 ring-2 first:ml-0"
        />
      ))}
      {remaining > 0 && (
        <div className="bg-sunken ring-surface text-text-muted -ml-1.5 flex size-8 items-center justify-center rounded-full text-xs font-medium ring-2">
          +{remaining}
        </div>
      )}
    </div>
  )
}
