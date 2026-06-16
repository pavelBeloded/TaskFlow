import type { Task } from '../../types'
import { MoreDropdwn } from '../shared/MoreDropdown.tsx'
import { Item, Separator } from '@radix-ui/react-dropdown-menu'
import { Pencil, Plus, Trash } from 'lucide-react'
import { useDeleteColumn, useUpdateColumn } from '../../hooks/useColumns.ts'
import { Modal } from '../shared/Modal.tsx'
import { useState } from 'react'
import { Button } from '../shared/Button.tsx'
import { Input } from '../shared/Input.tsx'
import { CustomSelect } from '../shared/Select.tsx'
import { useCreateTask } from '../../hooks/useTasks.ts'
import type { Priority } from '../../types/task.types.ts'
import { showToast } from '../../lib/toast.tsx'
import { useAuth } from '../../providers/AuthProvider.tsx'
import { InputModal } from '../shared/InputModal.tsx'
import { TaskCard } from '../task/TaskCard.tsx'
import { CollisionPriority } from '@dnd-kit/abstract'
import { useDroppable } from '@dnd-kit/react'

interface ColumnProps {
  tasks: Task[]
  title: string
  id: string
  boardId: string
}

const priorityOptions = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export function Column({ title, tasks, id, boardId }: ColumnProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium')
  const [inputValue, setInputValue] = useState('')

  const [inputModalIsOpen, setInputModalIsOpen] = useState(false)
  const [inputModalValue, setInputModalValue] = useState('')

  const createTask = useCreateTask(boardId)
  const deleteColumn = useDeleteColumn()
  const updateColumn = useUpdateColumn()

  const { ref, isDropTarget } = useDroppable({
    id: id,
    type: 'column',
    accept: 'task',
    collisionPriority: CollisionPriority.Low,
    data: {
      type: 'column',
      columnId: id,
    },
  })

  const { user } = useAuth()

  function handleDelete() {
    deleteColumn.mutate({ id, boardId })
  }

  function handleCreate() {
    if (!user) {
      showToast.error('User not authorized')
      return
    }
    createTask.mutate(
      {
        title: inputValue,
        columnId: id,
        position: tasks.length,
        priority: selectedPriority,
        description: null,
        createdBy: user.id,
      },
      {
        onSuccess: () => {
          setIsOpen(false)
          setInputValue('')
        },
      }
    )
  }

  function handleUpdate() {
    updateColumn.mutate(
      { title: inputModalValue, id: id },
      {
        onSuccess: () => {
          setInputModalIsOpen(false)
          setInputModalValue('')
        },
      }
    )
  }

  return (
    <div className="border-border bg-bg w-72 shrink-0 rounded-lg border p-4">
      <header className="flex items-center justify-between">
        <div className="text-text text-md flex items-center gap-2 font-medium">
          {title}{' '}
          <span className="bg-sunken text-text-muted flex w-5 items-center justify-center rounded-full">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            text=""
            icon={<Plus size={16} />}
            variant="ghost"
            onClick={() => {
              setIsOpen(true)
            }}
          />
          <MoreDropdwn size={16}>
            <Item
              className={`data-highlighted:bg-sunken text-text flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none`}
              onSelect={() => {
                setInputModalIsOpen(true)
              }}
            >
              <Pencil size={14} />
              Rename
            </Item>
            <Separator className="bg-border my-1 h-px" />

            <Item
              className={`data-highlighted:bg-sunken text-priority-high flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none`}
              onSelect={handleDelete}
            >
              <Trash size={14} />
              Delete
            </Item>
          </MoreDropdwn>
        </div>
      </header>

      <main
        ref={ref}
        className={`mt-2 flex min-h-5 flex-1 flex-col gap-2 rounded-md transition-colors ${
          isDropTarget ? 'bg-sunken/50' : ''
        }`}
      >
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            id={task.id}
            columnId={id}
            index={index}
            title={task.title}
            priority={task.priority}
            deadline={task.due_date}
            assigneeId={task.assignee_id}
          />
        ))}
      </main>

      <footer className="mt-3 w-full">
        <Button
          onClick={() => {
            setIsOpen(true)
          }}
          className="w-full"
          icon={<Plus size={16} />}
          variant={'outline'}
          text={'Add task'}
        />
      </footer>

      <InputModal
        isOpen={inputModalIsOpen}
        setIsOpen={setInputModalIsOpen}
        value={inputModalValue}
        setValue={setInputModalValue}
        title={'Rename column'}
        isPending={updateColumn.isPending}
        handleSubmit={handleUpdate}
        description={'Rename column'}
        label={'New name'}
        actionName={'Rename'}
        pendingName={'Renaming...'}
      />

      <Modal
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) setInputValue('')
        }}
        description="Add new task"
        title="Add task"
      >
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.currentTarget.value)
          }}
          label={'Task title'}
        />
        <div className="grid grid-cols-2 gap-12">
          <div>
            <p className="text-text mb-2 font-medium">Column</p>
            <p className="bg-sunken border-border text-md text-text flex w-full items-center justify-between rounded-lg p-2 font-medium">
              {title}
            </p>
          </div>
          <div>
            <p className="text-text mb-2 font-medium">Priority</p>
            <CustomSelect
              value={selectedPriority}
              setValue={setSelectedPriority}
              fields={priorityOptions}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            onClick={() => {
              setIsOpen(false)
            }}
            variant={'outline'}
            text="Cancel"
          />
          <Button onClick={handleCreate} text="Add Task" />
        </div>
      </Modal>
    </div>
  )
}
