import { Link, useNavigate, useParams } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { DragDropProvider } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'

import { useBoard } from '../hooks/useBoards.ts'
import { useCreateColumn } from '../hooks/useColumns.ts'
import { useMoveTask } from '../hooks/useTasks.ts'
import { showToast } from '../lib/toast.tsx'
import { Loading } from '../components/shared/Loading.tsx'
import { Column } from '../components/board/Column.tsx'
import { Button } from '../components/shared/Button.tsx'
import { InputModal } from '../components/shared/InputModal.tsx'
import type { Task } from '../types'
import type { ReorderColumn } from '../types/task.types.ts'
import { TaskDrawer } from '../components/task/Drawer/TaskDrawer.tsx'

type TasksByColumn = Record<string, Task[]>

export function BoardPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const createColumn = useCreateColumn()
  const moveTask = useMoveTask(id!)
  const { data, isLoading, isError } = useBoard(id!)

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

  function handleClick() {
    if (!id || !data) {
      showToast.error('Error creating column')
      return
    }
    createColumn.mutate(
      { title: inputValue, boardId: id, position: data.columns.length },
      {
        onSuccess: () => {
          setIsOpen(false)
          setInputValue('')
        },
      }
    )
  }

  if (isLoading) return <Loading />
  if (isError) {
    showToast.error('Error occurred during board loading')
    navigate('/')
    return null
  }
  if (!data) {
    return (
      <div className="p-4 md:p-6">
        <Link to="/" className="text-text flex items-center gap-1 text-lg">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="text-text-h text-center text-3xl">Board not found</h1>
      </div>
    )
  }

  return (
    <div className="p-6">
      <header className="mb-5 flex items-center justify-start gap-5">
        <Link to="/" className="text-text flex items-center gap-1 text-lg">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="text-text-h text-xl">{data.title}</h1>
      </header>

      <DragDropProvider
        onDragStart={() => {
          isDragging.current = true
          snapshot.current = structuredClone(tasksRef.current)
        }}
        onDragOver={(event) => {
          if (event.operation.source?.type === 'column') return
          setTasks((prev) => move(prev, event))
        }}
        onDragEnd={(event) => {
          isDragging.current = false

          if (event.canceled) {
            setTasks(() => snapshot.current)
            return
          }

          const before = snapshot.current
          const after = tasksRef.current

          const affected: ReorderColumn[] = []
          const columnIds = new Set([
            ...Object.keys(before),
            ...Object.keys(after),
          ])

          for (const columnId of columnIds) {
            const beforeIds = (before[columnId] ?? [])
              .map((t) => t.id)
              .join(',')
            const afterIds = (after[columnId] ?? []).map((t) => t.id).join(',')
            if (beforeIds !== afterIds) {
              affected.push({
                columnId,
                orderedTaskIds: (after[columnId] ?? []).map((t) => t.id),
              })
            }
          }

          if (affected.length === 0) return
          moveTask.mutate({ affected })
        }}
      >
        <div className="flex w-full items-start gap-6 overflow-x-auto pb-4">
          {data.columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              boardId={id!}
              title={column.title}
              tasks={tasksByColumn[column.id] ?? []}
            />
          ))}
          <Button
            onClick={() => setIsOpen(true)}
            className="text-text w-72 shrink-0"
            icon={<Plus size={16} />}
            variant="outline"
            text="Add column"
          />
        </div>
      </DragDropProvider>

      <InputModal
        value={inputValue}
        setValue={setInputValue}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isPending={createColumn.isPending}
        title="New column"
        description="Create new column"
        label="New column"
        actionName="Create column"
        pendingName="Creating..."
        handleSubmit={handleClick}
      />

      <TaskDrawer boardId={id!} />
    </div>
  )
}
