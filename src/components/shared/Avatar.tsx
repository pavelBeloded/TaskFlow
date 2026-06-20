// Avatar.tsx
import { getColorFromName } from '../../utils/avatar.ts'

export function Avatar({
  name,
  src,
  className,
}: {
  name: string
  src?: string | null
  className?: string
}) {
  const base =
    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white overflow-hidden'

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={[base, 'object-cover', className].filter(Boolean).join(' ')}
      />
    )
  }

  const color = getColorFromName(name)
  return (
    <div
      className={[base, className].filter(Boolean).join(' ')}
      style={{ background: color }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}
