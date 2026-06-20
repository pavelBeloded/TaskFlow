import { Modal } from './Modal.tsx'
import { Input } from '../Input.tsx'
import { CustomSelect } from '../Select.tsx'
import { priorityOptions } from '../../../utils/priority.ts'
import { Button } from '../Button.tsx'
import { Spinner } from '../Loading.tsx'
import { useState } from 'react'
import { showToast } from '../../../lib/toast.tsx'
import type { Priority } from '../../../types/task.types.ts'
import { useCreateTask } from '../../../hooks/useTasks.ts'
import { useAuth } from '../../../providers/AuthProvider.tsx'

interface CreateTaskModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  columnTitle: string
  columnId: string
  boardId: string
  tasksCount: number
}

export function CreateTaskModal({
  isOpen,
  onOpenChange,
  columnTitle,
  columnId,
  tasksCount,
  boardId,
}: CreateTaskModalProps) {
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium')
  const [inputValue, setInputValue] = useState('')
  const createTask = useCreateTask(boardId)
  const { user } = useAuth()

  function handleCreate() {
    if (!user) {
      showToast.error('User not authorized')
      return
    }
    createTask.mutate(
      {
        title: inputValue,
        columnId: columnId,
        position: tasksCount,
        priority: selectedPriority,
        description: null,
        createdBy: user.id,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setInputValue('')
          setSelectedPriority('medium')
        },
      }
    )
  }

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) {
          setInputValue('')
          setSelectedPriority('medium')
        }
      }}
      description="Add new task"
      title="Add task"
    >
      <Input
        value={inputValue}
        autoFocus
        onChange={(e) => setInputValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !createTask.isPending && inputValue.trim())
            handleCreate()
        }}
        label="Task title"
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-text mb-2 font-medium">Column</p>
          <p className="bg-sunken border-border text-md text-text flex w-full items-center justify-between rounded-lg p-2 font-medium">
            {columnTitle}
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
          onClick={() => onOpenChange(false)}
          variant="outline"
          className="text-text"
          text="Cancel"
        />
        <Button
          onClick={handleCreate}
          text={createTask.isPending ? 'Adding...' : 'Add Task'}
          disabled={createTask.isPending || !inputValue.trim()}
          icon={createTask.isPending && <Spinner size={16} />}
        />
      </div>
    </Modal>
  )
}
