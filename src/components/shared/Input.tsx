import { type InputHTMLAttributes } from 'react'
import { type FieldError } from 'react-hook-form'
import { X } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
}

export function Input({ label, error, id, ...rest }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-1.25">
      <label htmlFor={id} className="text-text-h text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        className={
          error
            ? 'bg-coral-200 border-toast-error text-text rounded-md border-2 px-3 py-2 text-base'
            : 'bg-sunken text-text rounded-md px-3 py-2 text-base'
        }
        aria-invalid={error ? 'true' : 'false'}
        {...rest}
      />
      <p className="text-toast-error mt-1 flex items-center gap-1 text-sm">
        {error && <X size={14} />}
        {error?.message}
      </p>
    </div>
  )
}
