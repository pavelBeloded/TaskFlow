import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { ProtectedRoute } from './ProtectedRoute.tsx'

const mockUseAuth = vi.fn()
vi.mock('../../providers/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}))

function renderProtected() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<div>Protected content</div>} />
        </Route>
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('shows a loading state while auth is resolving', () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: true })
    renderProtected()

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('redirects to /login when there is no user', () => {
    mockUseAuth.mockReturnValue({ user: null, isLoading: false })
    renderProtected()

    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('renders the protected outlet when authenticated', () => {
    mockUseAuth.mockReturnValue({ user: { id: 'u1' }, isLoading: false })
    renderProtected()

    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })
})
