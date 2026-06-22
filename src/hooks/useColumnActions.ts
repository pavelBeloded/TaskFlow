import { useDeleteColumn, useUpdateColumn } from './useColumns.ts'

export function useColumnActions(columnId: string, boardId: string) {
  const updateColumn = useUpdateColumn()
  const deleteColumn = useDeleteColumn()

  function rename(title: string, onDone?: () => void) {
    const value = title.trim()
    if (!value) return
    updateColumn.mutate(
      { id: columnId, title: value },
      { onSuccess: () => onDone?.() }
    )
  }

  function remove(onDone?: () => void) {
    deleteColumn.mutate(
      { id: columnId, boardId },
      { onSuccess: () => onDone?.() }
    )
  }

  return {
    rename,
    remove,
    isRenaming: updateColumn.isPending,
    isDeleting: deleteColumn.isPending,
  }
}
