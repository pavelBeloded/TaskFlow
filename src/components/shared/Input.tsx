import { type InputHTMLAttributes } from 'react'
import { type FieldError } from 'react-hook-form'
import { X } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
}

export function Input({ label, error, id, ...rest }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label htmlFor={id} className="text-text text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        className={[
          'text-text w-full rounded-md border px-3 py-2 text-sm transition-colors outline-none',
          'disabled:text-text-muted disabled:cursor-not-allowed disabled:opacity-60',
          error
            ? 'border-toast-error bg-coral-50 border-2'
            : 'border-border bg-surface focus:border-accent-border',
        ].join(' ')}
        aria-invalid={error ? 'true' : 'false'}
        {...rest}
      />
      {error && (
        <p className="text-toast-error flex items-center gap-1 text-xs">
          <X size={12} />
          {error.message}
        </p>
      )}
    </div>
  )
}
