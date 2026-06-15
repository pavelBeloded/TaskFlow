import * as Select from '@radix-ui/react-select'
import { ChevronRight } from 'lucide-react'

interface CustomSelectProps<T extends string> {
  value: T
  setValue: (value: T) => void
  fields: Record<T, string>
}

export function CustomSelect<T extends string>({
  value,
  setValue,
  fields,
}: CustomSelectProps<T>) {
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger className="bg-sunken border-border text-md text-text flex w-full items-center justify-between rounded-lg p-2 font-medium">
        <Select.Value />
        <ChevronRight size={14} />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          side={'bottom'}
          className="bg-sunken border-border text-md text-text w-(--radix-select-trigger-width) rounded-t-sm rounded-b-lg p-2 font-medium"
        >
          <Select.Viewport>
            {Object.entries(fields).map(([key, label], index, array) => (
              <div key={key}>
                <Select.Item className="" value={key}>
                  <Select.ItemText>{label as string}</Select.ItemText>
                </Select.Item>
                {index < array.length - 1 && (
                  <Select.Separator className="my-1 h-px bg-black/10" />
                )}
              </div>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
