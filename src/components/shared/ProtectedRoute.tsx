import { useAuth } from '../../providers/AuthProvider.tsx'
import { Outlet, useNavigate } from 'react-router'

export function ProtectedRoute() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
  }

  return <Outlet />
}
