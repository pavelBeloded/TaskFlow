import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useTaskEdit } from './useTaskEdit.ts'
import type { Task } from '../types'

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const task = {
  id: 'task-1',
  title: 'Initial title',
  description: 'desc',
  priority: 'high',
  due_date: '2026-01-01',
  assignee_id: 'user-1',
} as unknown as Task

describe('useTaskEdit', () => {
  it('starts not editing with editedTask derived from the task', () => {
    const { result } = renderHook(() => useTaskEdit(task, 'board-1'), {
      wrapper,
    })

    expect(result.current.isEditing).toBe(false)
    expect(result.current.editedTask).toEqual({
      title: 'Initial title',
      description: 'desc',
      priority: 'high',
      due_date: '2026-01-01',
      assignee_id: 'user-1',
    })
  })

  it('enters edit mode on startEdit', () => {
    const { result } = renderHook(() => useTaskEdit(task, 'board-1'), {
      wrapper,
    })

    act(() => result.current.startEdit())

    expect(result.current.isEditing).toBe(true)
  })

  it('resets edited fields and exits edit mode on cancelEdit', () => {
    const { result } = renderHook(() => useTaskEdit(task, 'board-1'), {
      wrapper,
    })

    act(() => result.current.startEdit())
    act(() =>
      result.current.setEditedTask((prev) => ({ ...prev, title: 'Changed' }))
    )
    expect(result.current.editedTask.title).toBe('Changed')

    act(() => result.current.cancelEdit())

    expect(result.current.isEditing).toBe(false)
    expect(result.current.editedTask.title).toBe('Initial title')
  })

  it('falls back to an empty description when the task has none', () => {
    const taskNoDesc = { ...task, description: null } as unknown as Task
    const { result } = renderHook(() => useTaskEdit(taskNoDesc, 'board-1'), {
      wrapper,
    })

    expect(result.current.editedTask.description).toBe('')
  })
})
