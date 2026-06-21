import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { type ReactNode } from 'react'
import { MoreVertical } from 'lucide-react'

export function MoreDropdwn({
  size = 16,
  children,
}: {
  size?: number
  children?: ReactNode
}) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button aria-label="More menu">
          <MoreVertical size={size} className="text-text-muted" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content
          align="end"
          sideOffset={4}
          className="bg-surface border-border shadow-dropdown min-w-44 rounded-lg border p-1"
        >
          {children}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  )
}
