import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { DragDropProvider } from '@dnd-kit/react'
import type { ReactNode } from 'react'
import { Column } from './Column.tsx'
import { AuthProvider } from '../../providers/AuthProvider.tsx'
import type { MemberMap } from '../../types/board.types.ts'
import type { TaskWithComments } from '../../types/task.types.ts'

vi.mock('../../lib/supabase.ts', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}))

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <MemoryRouter>
          <DragDropProvider>{children}</DragDropProvider>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

function task(id: string, title: string): TaskWithComments {
  return {
    id,
    title,
    priority: 'medium',
    due_date: null,
    assignee_id: null,
    comments: [{ count: 0 }],
  } as unknown as TaskWithComments
}

function renderColumn(isOwner: boolean) {
  return render(
    <Column
      id="col-1"
      boardId="board-1"
      title="To do"
      tasks={[task('t1', 'First task'), task('t2', 'Second task')]}
      memberMap={new Map() as MemberMap}
      isOwner={isOwner}
    />,
    { wrapper }
  )
}

describe('Column', () => {
  it('renders the title and its tasks', async () => {
    renderColumn(false)

    // findBy flushes the async session check in AuthProvider.
    expect(await screen.findByText('To do')).toBeInTheDocument()
    expect(screen.getByText('First task')).toBeInTheDocument()
    expect(screen.getByText('Second task')).toBeInTheDocument()
    expect(screen.getByText('Add task')).toBeInTheDocument()
  })

  it('shows the owner menu trigger only for owners', async () => {
    const { unmount } = renderColumn(false)
    await screen.findByText('To do')
    expect(screen.queryByLabelText('More menu')).not.toBeInTheDocument()
    unmount()

    renderColumn(true)
    expect(await screen.findByLabelText('More menu')).toBeInTheDocument()
  })
})
