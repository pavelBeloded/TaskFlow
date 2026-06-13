import { Button } from '../components/shared/Button.tsx'
import { useBoards, useCreateBoard } from '../hooks/useBoards.ts'
import { Modal } from '../components/shared/Modal.tsx'
import { useEffect, useState } from 'react'
import { Input } from '../components/shared/Input.tsx'
import { showToast } from '../lib/toast.tsx'
import { Loading, Spinner } from '../components/shared/Loading.tsx'
import { BoardCard } from '../components/board/BoardCard.tsx'

export function BoardsPage() {
  const { data, isPending, error } = useBoards()
  const createBoard = useCreateBoard()

  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (error) {
      showToast.error(error.message)
    }
  }, [error])

  function handleClick(boardName: string) {
    createBoard.mutate(boardName, {
      onSuccess: () => setIsOpen(false),
    })
  }

  if (isPending) {
    return <Loading />
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-5 md:px-10 md:py-8">
      <header className="mb-5 flex items-center justify-between md:mb-7">
        <h1 className="text-xl md:text-3xl">My boards</h1>
        <Button
          text="+ New board"
          onClick={() => {
            setIsOpen(true)
          }}
        />
      </header>
      {(data === undefined || data.length === 0) && (
        <div className="bg-surface border-border-strong flex h-50 w-full flex-col items-center justify-center gap-5 rounded-lg border border-dashed">
          <p className="text-text text-lg font-medium">No boards yet</p>
          <p className="text-text-muted text-sm">
            Create your first board to get started
          </p>

          <Button
            onClick={() => {
              setIsOpen(true)
            }}
            text="+ Create your first board"
          />
        </div>
      )}
      {data !== undefined && data.length > 0 && (
        <div className="grid grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((board) => (
            <BoardCard
              key={board.id}
              title={board.title}
              createdAt={board.created_at}
              id={board.id}
            />
          ))}
        </div>
      )}

      <Modal
        description="Create new board"
        open={isOpen}
        title="New board"
        onOpenChange={setIsOpen}
      >
        <Input
          label="Bord name"
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
        />
        <div className="gap flex items-center justify-end gap-2.5">
          <Button
            text={'Close'}
            variant={'outline'}
            onClick={() => {
              setIsOpen(false)
            }}
          />
          <Button
            text={createBoard.isPending ? 'Creating...' : 'Create board'}
            disabled={createBoard.isPending}
            onClick={() => handleClick(inputValue)}
            variant={'default'}
            icon={createBoard.isPending && <Spinner size={16} />}
          />
        </div>
      </Modal>
    </div>
  )
}
