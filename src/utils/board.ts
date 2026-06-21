import type { ReorderColumn, TasksByColumn } from '../types/task.types.ts'

export function diffAffectedColumns(
  before: TasksByColumn,
  after: TasksByColumn
): ReorderColumn[] {
  const affected: ReorderColumn[] = []
  const columnIds = new Set([...Object.keys(before), ...Object.keys(after)])

  for (const columnId of columnIds) {
    const beforeIds = (before[columnId] ?? []).map((t) => t.id).join(',')
    const afterIds = (after[columnId] ?? []).map((t) => t.id).join(',')
    if (beforeIds !== afterIds) {
      affected.push({
        columnId,
        orderedTaskIds: (after[columnId] ?? []).map((t) => t.id),
      })
    }
  }
  return affected
}
