import { getColorFromName } from '../../utils/avatar.ts'

export function Avatar({ name }: { name: string }) {
  const color = getColorFromName(name)

  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white"
      style={{ background: color }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}
