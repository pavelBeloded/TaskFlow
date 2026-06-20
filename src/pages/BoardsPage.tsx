import { Button } from '../components/shared/Button.tsx'
import { useBoards, useCreateBoard } from '../hooks/useBoards.ts'
import { useEffect, useState } from 'react'
import { showToast } from '../lib/toast.tsx'
import { Loading } from '../components/shared/Loading.tsx'
import { BoardCard } from '../components/board/BoardCard.tsx'
import { InputModal } from '../components/shared/Modal/InputModal.tsx'
import { useAuth } from '../providers/AuthProvider.tsx'

export function BoardsPage() {
  const { data, isPending, error } = useBoards()
  const createBoard = useCreateBoard()

  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const { user } = useAuth()
  useEffect(() => {
    if (error) {
      showToast.error(error.message)
    }
  }, [error])

  function handleClick() {
    createBoard.mutate(inputValue, {
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
              profiles={board.board_members.map((member) => member.profiles)}
              isOwner={board.owner_id === user?.id}
            />
          ))}
        </div>
      )}

      <InputModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        value={inputValue}
        setValue={setInputValue}
        title={'New board'}
        isPending={createBoard.isPending}
        handleSubmit={handleClick}
        description={'Create new board'}
        label={'Bord name'}
        actionName={'Create board'}
        pendingName={'Creating...'}
      />
    </div>
  )
}
