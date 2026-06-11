import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react'
import { toast } from 'sonner'

type ToastType = 'success' | 'error' | 'info' | 'warning'

const config = {
  success: {
    icon: CheckCircle,
    borderColor: 'var(--toast-success-border)',
    iconBg: '#e1f5ee',
    iconColor: 'var(--toast-success-border)',
  },
  error: {
    icon: XCircle,
    borderColor: 'var(--toast-error-border)',
    iconBg: '#faece7',
    iconColor: 'var(--toast-error-border)',
  },
  info: {
    icon: Info,
    borderColor: 'var(--toast-info-border)',
    iconBg: '#eeedfe',
    iconColor: 'var(--toast-info-border)',
  },
  warning: {
    icon: AlertTriangle,
    borderColor: 'var(--toast-warning-border)',
    iconBg: '#faeeda',
    iconColor: 'var(--toast-warning-border)',
  },
}

interface CustomToastProps {
  id: string | number
  type: ToastType
  message: string
}

export function CustomToast({ id, type, message }: CustomToastProps) {
  const { icon: Icon, borderColor, iconBg, iconColor } = config[type]

  return (
    <div
      className="bg-surface border-border flex w-80 items-start gap-3 rounded-lg border p-3 shadow-lg"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
        style={{ background: iconBg }}
      >
        <Icon size={16} style={{ color: iconColor }} />
      </div>
      <p className="text-text flex-1 text-sm">{message}</p>
      <button
        onClick={() => toast.dismiss(id)}
        className="text-text-faint hover:text-text shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  )
}
