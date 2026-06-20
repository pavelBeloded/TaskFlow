import { Link, useNavigate, useParams } from 'react-router'
import { useState } from 'react'
import { ArrowLeft, Plus, UserPlus } from 'lucide-react'
import { DragDropProvider } from '@dnd-kit/react'

import { useBoard } from '../hooks/useBoards.ts'
import { useCreateColumn } from '../hooks/useColumns.ts'
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
import { Members } from '../components/shared/Members.tsx'
import { InviteModal } from '../components/shared/Modal/InviteModal.tsx'
import { useAuth } from '../providers/AuthProvider.tsx'

export function BoardPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const [inviteInputValue, setInviteInputValue] = useState('')

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const { user } = useAuth()
  const deleteMember = useDeleteMember()
  const { data: members } = useBoardMembers(id!)
  const createColumn = useCreateColumn()
  const { data, isLoading, isError } = useBoard(id!)
  const { tasksByColumn, dragHandlers } = useBoardDnd(id!, data)
  const inviteMember = useInviteMember(id!)
  const isOwner = members?.find((m) => m.user_id === user?.id)?.role === 'owner'

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
        <div className="flex w-full items-start gap-6 overflow-x-auto pb-4">
          {data.columns.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              boardId={id!}
              title={column.title}
              tasks={tasksByColumn[column.id] ?? []}
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
          deleteMember.mutate({ boardId: id!, userId })
        }}
      />

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

      <TaskDrawer members={members ?? []} boardId={id!} isOwner={isOwner} />
    </div>
  )
}
