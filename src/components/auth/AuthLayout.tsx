import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <div className="bg-bg flex min-h-screen w-full grow items-center justify-center px-8">
      <Outlet />
    </div>
  )
}
