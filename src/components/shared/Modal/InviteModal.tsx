import { Input } from '../Input.tsx'
import { Button } from '../Button.tsx'
import { Modal } from './Modal.tsx'
import { Spinner } from '../Loading.tsx'
import type { UseMutateFunction } from '@tanstack/react-query'
import { Separator } from '@radix-ui/react-dropdown-menu'
import type { BoardMembersWithProfile } from '../../../types/board.types.ts'
import { Avatar } from '../Avatar.tsx'
import { showToast } from '../../../lib/toast.tsx'
import { z } from 'zod'
import { X } from 'lucide-react'

interface InviteModalProps {
  isOpen: boolean
  setIsOpen: (arg: boolean) => void
  value: string
  setValue: (arg: string) => void
  title: string
  isPending: boolean
  handleSubmit: UseMutateFunction<
    {
      board_id: string
      id: string
      role: string
      user_id: string
    },
    Error,
    string,
    unknown
  >
  description: string
  label: string
  actionName: string
  pendingName: string
  members: BoardMembersWithProfile[]
  onDeleteMember: (userId: string) => void
  isOwner: boolean
}

export function InviteModal({
  isOpen,
  setIsOpen,
  value,
  setValue,
  title,
  isPending,
  handleSubmit,
  description,
  label,
  actionName,
  pendingName,
  members,
  isOwner,
  onDeleteMember,
}: InviteModalProps) {
  return (
    <Modal
      description={description}
      open={isOpen}
      title={title}
      onOpenChange={setIsOpen}
    >
      <div className="flex items-center gap-3">
        <Input
          label={label}
          value={value}
          autoFocus
          type="email"
          onChange={(e) => setValue(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isPending && value.trim())
              handleSubmit(value)
          }}
        />
        <Button
          text={isPending ? pendingName : actionName}
          disabled={isPending || !value.trim()}
          variant="default"
          onClick={() => {
            const result = z.email().safeParse(value)
            if (!result.success) {
              showToast.error('Invalid email address')
              return
            }
            handleSubmit(value)
          }}
          icon={isPending && <Spinner size={16} />}
        />
      </div>
      <Separator className="bg-border h-px" />
      <div>
        <p className="text-text-muted teext-sm mb-3">
          Board members ({members.length})
        </p>
        <div className="flex flex-col gap-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  size="lg"
                  name={member.profiles.name!}
                  src={member.profiles.avatar_url}
                />
                <div>
                  <p className="text-text font-medium">
                    {member.profiles.name}
                  </p>
                  <p className="text-text-muted text-sm">
                    {member.profiles.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {member.role === 'owner' ? (
                  <div className="bg-accent-bg text-accent flex h-6 items-center justify-center rounded-full px-3 text-xs">
                    Owner
                  </div>
                ) : (
                  <>
                    <div className="bg-sunken text-text-muted flex h-6 items-center justify-center rounded-full px-3 text-xs">
                      Member
                    </div>
                    {isOwner && (
                      <button
                        onClick={() => onDeleteMember(member.user_id)}
                        className="text-text-muted hover:text-priority-high transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
