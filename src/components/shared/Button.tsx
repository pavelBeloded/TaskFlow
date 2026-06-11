interface ButtonProps {
  disabled: boolean | null
  className?: string
  text: string
  onClick?: () => void
  type?: 'submit' | 'button' | 'reset'
}

export function Button({
  disabled,
  className,
  text,
  onClick,
  type = 'submit',
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || undefined}
      className={[
        'bg-accent text-accent-text rounded-md py-2.5 text-sm',
        className,
      ].join(' ')}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
