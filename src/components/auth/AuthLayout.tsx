import { Outlet } from 'react-router'
import { ThemeToggleButton } from '../shared/ThemeToggleButton.tsx'

export function AuthLayout() {
  return (
    <div className="bg-bg flex min-h-dvh w-full grow items-center justify-center px-8">
      <ThemeToggleButton className="absolute top-4 right-4" size={24} />
      <Outlet />
    </div>
  )
}
