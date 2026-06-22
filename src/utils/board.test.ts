import { describe, expect, it } from 'vitest'
import { diffAffectedColumns } from './board.ts'
import type { TasksByColumn, TaskWithComments } from '../types/task.types.ts'

function task(id: string): TaskWithComments {
  return { id } as unknown as TaskWithComments
}

function board(shape: Record<string, string[]>): TasksByColumn {
  return Object.fromEntries(
    Object.entries(shape).map(([col, ids]) => [col, ids.map(task)])
  )
}

describe('diffAffectedColumns', () => {
  it('returns no affected columns when nothing changed', () => {
    const before = board({ a: ['1', '2'], b: ['3'] })
    const after = board({ a: ['1', '2'], b: ['3'] })

    expect(diffAffectedColumns(before, after)).toEqual([])
  })

  it('detects reordering within a single column', () => {
    const before = board({ a: ['1', '2', '3'] })
    const after = board({ a: ['3', '1', '2'] })

    expect(diffAffectedColumns(before, after)).toEqual([
      { columnId: 'a', orderedTaskIds: ['3', '1', '2'] },
    ])
  })

  it('reports both source and target columns when a task moves between them', () => {
    const before = board({ a: ['1', '2'], b: ['3'] })
    const after = board({ a: ['1'], b: ['3', '2'] })

    const result = diffAffectedColumns(before, after)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ columnId: 'a', orderedTaskIds: ['1'] })
    expect(result).toContainEqual({ columnId: 'b', orderedTaskIds: ['3', '2'] })
  })

  it('treats an emptied column as affected with an empty list', () => {
    const before = board({ a: ['1'], b: [] })
    const after = board({ a: [], b: ['1'] })

    const result = diffAffectedColumns(before, after)

    expect(result).toContainEqual({ columnId: 'a', orderedTaskIds: [] })
    expect(result).toContainEqual({ columnId: 'b', orderedTaskIds: ['1'] })
  })
})
