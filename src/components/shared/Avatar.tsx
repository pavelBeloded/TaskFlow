// Avatar.tsx
import { getColorFromName } from '../../utils/avatar.ts'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | '3xl'

const sizes: Record<AvatarSize, string> = {
  sm: 'size-6 text-xs',
  md: 'size-8 text-sm',
  lg: 'size-10 text-base',
  xl: 'size-12 text-lg',
  '3xl': 'size-16 text-3xl',
}

export function Avatar({
  name,
  src,
  className,
  size = 'md',
}: {
  name: string
  src?: string | null
  className?: string
  size?: AvatarSize
}) {
  const base =
    'flex shrink-0 items-center justify-center rounded-full font-medium text-white overflow-hidden'

  const classes = [base, sizes[size], className].filter(Boolean).join(' ')

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={[classes, 'object-cover'].join(' ')}
      />
    )
  }

  return (
    <div className={classes} style={{ background: getColorFromName(name) }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}
