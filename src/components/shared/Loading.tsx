import { Loader2 } from 'lucide-react'
interface SpinnerProps {
  size?: number | string
}
export function Spinner({ size }: SpinnerProps) {
  return (
    <Loader2
      size={size}
      // Убираем h-8 w-8, чтобы пропс size от Lucide корректно работал
      className="text-text-muted animate-spin"
    />
  )
}

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Теперь размер можно передавать (по умолчанию Lucide ставит 24) */}
      <Spinner size={32} />
      <p className="text-text mt-3 text-sm font-medium">Загрузка данных...</p>
    </div>
  )
}
