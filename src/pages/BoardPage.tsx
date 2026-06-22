import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Plus, UserPlus } from 'lucide-react'
import { DragDropProvider } from '@dnd-kit/react'

import { useBoard } from '../hooks/useBoards.ts'
import { showToast } from '../lib/toast.tsx'
import { Loading } from '../components/shared/Loading.tsx'
import { Column } from '../components/board/Column.tsx'
import { Button } from '../components/shared/Button.tsx'
import { InputModal } from '../components/shared/Modal/InputModal.tsx'
import { TaskDrawer } from '../components/task/Drawer/TaskDrawer.tsx'
import {
  useBoardMembers,
  useDeleteMember,
  useInviteMember,
} from '../hooks/useMembers.ts'
import { useBoardDnd } from '../hooks/useBoardDnd.ts'
import { useBoardActions } from '../hooks/useBoardActions.ts'
import { Members } from '../components/shared/Members.tsx'
import { InviteModal } from '../components/shared/Modal/InviteModal.tsx'
import { useAuth } from '../providers/AuthProvider.tsx'
import { useRealtime } from '../hooks/useRealtime.tsx'

export function BoardPage() {
  const { id } = useParams()
  if (!id) return <Navigate to="/" replace />
  return <BoardView boardId={id} />
}

function BoardView({ boardId }: { boardId: string }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const [inviteInputValue, setInviteInputValue] = useState('')
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  const { user } = useAuth()
  const deleteMember = useDeleteMember()
  const { data: members } = useBoardMembers(boardId)
  const { data, isLoading, isError } = useBoard(boardId)
  const { tasksByColumn, dragHandlers, isMoving } = useBoardDnd(boardId, data)
  const inviteMember = useInviteMember(boardId)
  const { addColumn, isAddingColumn } = useBoardActions(boardId)
  const isOwner = members?.find((m) => m.user_id === user?.id)?.role === 'owner'

  const memberMap = useMemo(
    () => new Map((members ?? []).map((m) => [m.user_id, m.profiles])),
    [members]
  )

  useRealtime(boardId)

  useEffect(() => {
    if (isError) {
      showToast.error('Error occurred during board loading')
      navigate('/')
    }
  }, [isError, navigate])

  function handleCreateColumn() {
    if (!data) return
    addColumn(inputValue, data.columns.length, () => {
      setIsOpen(false)
      setInputValue('')
    })
  }

  if (isLoading) return <Loading />
  if (isError) return null
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
      <header className="m-auto mb-5 flex w-full max-w-5xl items-center justify-between">
        <div className="flex items-center gap-5">
          <Link to="/" className="text-text flex items-center gap-1 text-lg">
            <ArrowLeft size={16} /> Back
          </Link>
          <h1 className="text-text-h text-xl">{data.title}</h1>
        </div>
        <div className="flex items-center gap-5">
          <Members
            profiles={
              members?.map((m) => m.profiles).filter((p) => p !== null) ?? []
            }
            show={4}
          />
          {isOwner && (
            <Button
              icon={<UserPlus size={16} />}
              text={'Invite'}
              onClick={() => {
                setIsInviteModalOpen(true)
              }}
            />
          )}
        </div>
      </header>

      <DragDropProvider {...dragHandlers}>
        <div
          className={`w-full overflow-x-auto pb-4 ${
            isMoving ? 'pointer-events-none opacity-70' : ''
          }`}
        >
          <div className="flex w-max min-w-full items-start gap-6 px-6">
            <div className="ml-auto" /> {/* распорка слева */}
            {data.columns.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                boardId={boardId}
                title={column.title}
                tasks={tasksByColumn[column.id] ?? []}
                memberMap={memberMap}
                isOwner={isOwner}
              />
            ))}
            <Button
              onClick={() => setIsOpen(true)}
              className="text-text w-72 shrink-0"
              icon={<Plus size={16} />}
              variant="outline"
              text="Add column"
            />
            <div className="mr-auto" /> {/* распорка справа */}
          </div>
        </div>
      </DragDropProvider>

      <InviteModal
        members={members ?? []}
        isOpen={isInviteModalOpen}
        setIsOpen={setIsInviteModalOpen}
        value={inviteInputValue}
        setValue={setInviteInputValue}
        title={'Invite to board'}
        isPending={inviteMember.isPending}
        handleSubmit={inviteMember.mutate}
        description={'Invite member to board'}
        label={''}
        actionName={'Invite'}
        pendingName={'Inviting...'}
        isOwner={isOwner}
        onDeleteMember={(userId) => {
          deleteMember.mutate({ boardId, userId })
        }}
      />

      <InputModal
        value={inputValue}
        setValue={setInputValue}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isPending={isAddingColumn}
        title="New column"
        description="Create new column"
        label="New column"
        actionName="Create column"
        pendingName="Creating..."
        handleSubmit={handleCreateColumn}
      />

      <TaskDrawer members={members ?? []} boardId={boardId} isOwner={isOwner} />
    </div>
  )
}
