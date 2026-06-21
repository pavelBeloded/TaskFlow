import * as Select from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'

interface CustomSelectProps<T extends string> {
  value: T
  setValue: (value: T) => void
  fields: Record<T, string>
  textSize?: 'sm' | 'md' | 'lg' | 'xl'
}

const textSizeMap = {
  sm: 'text-sm',
  md: 'text-md',
  lg: 'text-lg',
  xl: 'text-xl',
} as const

export function CustomSelect<T extends string>({
  value,
  setValue,
  fields,
  textSize = 'md',
}: CustomSelectProps<T>) {
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger
        className={`bg-sunken border-border text-text flex w-full items-center justify-between rounded-lg p-2 font-medium ${textSizeMap[textSize]}`}
      >
        <Select.Value />
        <ChevronDown size={14} className="text-text-muted" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          side="bottom"
          sideOffset={4}
          className={`bg-surface border-border shadow-dropdown text-text w-(--radix-select-trigger-width) rounded-md border p-1 font-medium ${textSizeMap[textSize]}`}
        >
          <Select.Viewport>
            {Object.entries(fields).map(([key, label]) => (
              <Select.Item
                key={key}
                value={key}
                className="data-highlighted:bg-sunken text-text flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 outline-none"
              >
                <Select.ItemText>{label as string}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={14} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
