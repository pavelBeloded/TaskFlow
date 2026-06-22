import { useCreateColumn } from './useColumns.ts'

export function useBoardActions(boardId: string) {
  const createColumn = useCreateColumn()

  function addColumn(title: string, position: number, onDone?: () => void) {
    const value = title.trim()
    if (!value) return
    createColumn.mutate(
      { title: value, boardId, position },
      { onSuccess: () => onDone?.() }
    )
  }

  return {
    addColumn,
    isAddingColumn: createColumn.isPending,
  }
}
