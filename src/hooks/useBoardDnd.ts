import { useBoard } from './useBoards.ts'
import { useMoveTask } from './useTasks.ts'
import { diffAffectedColumns } from '../utils/board.ts'
import type { TasksByColumn } from '../types/task.types.ts'
import { useEffect, useRef, useState, type ComponentProps } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'

type BoardData = NonNullable<ReturnType<typeof useBoard>['data']>
type DndProps = ComponentProps<typeof DragDropProvider>
type DragOverEvent = Parameters<NonNullable<DndProps['onDragOver']>>[0]
type DragEndEvent = Parameters<NonNullable<DndProps['onDragEnd']>>[0]
export function useBoardDnd(boardId: string, data: BoardData | undefined) {
  const moveTask = useMoveTask(boardId)

  const [tasksByColumn, setTasksByColumn] = useState<TasksByColumn>({})
  const isDragging = useRef(false)
  const snapshot = useRef<TasksByColumn>({})
  const tasksRef = useRef<TasksByColumn>({})

  useEffect(() => {
    if (data && !isDragging.current) {
      const next: TasksByColumn = {}
      for (const col of data.columns) {
        next[col.id] = [...col.tasks].sort((a, b) => a.position - b.position)
      }
      setTasksByColumn(next)
      tasksRef.current = next
    }
  }, [data])

  function setTasks(updater: (prev: TasksByColumn) => TasksByColumn) {
    setTasksByColumn((prev) => {
      const next = updater(prev)
      tasksRef.current = next
      return next
    })
  }

  const dragHandlers = {
    onDragStart: () => {
      isDragging.current = true
      snapshot.current = structuredClone(tasksRef.current)
    },
    onDragOver: (event: DragOverEvent) => {
      if (event.operation.source?.type === 'column') return
      setTasks((prev) => move(prev, event))
    },
    onDragEnd: (event: DragEndEvent) => {
      isDragging.current = false
      if (event.canceled) {
        setTasks(() => snapshot.current)
        return
      }
      const affected = diffAffectedColumns(snapshot.current, tasksRef.current)
      if (affected.length === 0) return
      const rollback = snapshot.current
      moveTask.mutate({ affected }, { onError: () => setTasks(() => rollback) })
    },
  }

  return { tasksByColumn, dragHandlers, isMoving: moveTask.isPending }
}
