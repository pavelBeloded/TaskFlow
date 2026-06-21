import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider.tsx'

export function ThemeToggleButton({
  className,
  size,
}: {
  className?: string
  size?: number | string
}) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme} className={className}>
      {theme === 'light' ? <Moon size={size} /> : <Sun size={size} />}
    </button>
  )
}
