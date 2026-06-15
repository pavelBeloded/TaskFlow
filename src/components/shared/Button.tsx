import type { ReactNode } from 'react'

type ButtonVariant = 'default' | 'ghost' | 'outline'
type Size = 'small' | 'medium' | 'large'

interface ButtonProps {
  disabled?: boolean | null
  className?: string
  text: string
  size?: Size
  variant?: ButtonVariant
  onClick?: () => void
  type?: 'submit' | 'button' | 'reset'
  icon?: ReactNode
}

const buttonVariants = {
  default:
    'bg-accent text-accent-text rounded-md  text-sm font-medium flex gap-2 items-center justify-center pointer cursor-pointer',
  ghost:
    'bg-transparent text-text text-accent-text rounded-md  text-sm font-medium gap-2 flex items-center hover:bg-sunken justify-center ',
  outline:
    'bg-surface hover:bg-sunken transition duration-200 border border-border-strong text-text text-accent-text rounded-md  text-sm font-medium gap-2 flex items-center hover:bg-sunken justify-center ',
}

const sizes = {
  small: 'py-1 px-2',
  medium: 'py-2.5 px-4',
  large: '',
}

export function Button({
  disabled,
  className,
  text,
  onClick,
  variant = 'default',
  type = 'submit',
  size = 'medium',
  icon,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || undefined}
      className={[
        buttonVariants[variant],
        sizes[size],
        className,
        disabled && 'opacity-50',
      ].join(' ')}
      onClick={onClick}
    >
      {icon && icon}
      {text}
    </button>
  )
}
