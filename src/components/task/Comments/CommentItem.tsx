import { Avatar } from '../../shared/Avatar.tsx'
import { parseMonthDay } from '../../../utils/date.ts'
import { SubmitModal } from '../../shared/Modal/SubmitModal.tsx'
import { useState } from 'react'
import type { UseMutationResult } from '@tanstack/react-query'
import { Trash } from 'lucide-react'

interface CommentItemProps {
  content: string
  avatarSrc: string | null
  author: string | null
  createdAt: string | null
  deletable: boolean
  onDelete: UseMutationResult<void, Error, string, unknown>
  id: string
}

export function CommentItem({
  content,
  author,
  avatarSrc,
  createdAt,
  deletable,
  onDelete,
  id,
}: CommentItemProps) {
  const date = parseMonthDay(createdAt)
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = () => {
    onDelete.mutate(id, { onSuccess: () => setIsOpen(false) })
  }

  return (
    <div className="flex items-start gap-2">
      <Avatar name={author ?? 'U'} src={avatarSrc} />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <header className="flex items-center gap-2">
          <p className="text-text text-sm font-medium">{author}</p>
          <p className="text-text-faint text-xs">{date}</p>
          {deletable && (
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Delete comment"
              className="text-text-faint hover:text-priority-high ml-auto shrink-0 transition"
            >
              <Trash size={14} />
            </button>
          )}
        </header>
        <p className="text-text wrap-break-words text-sm leading-relaxed">
          {content}
        </p>
      </div>

      {deletable && (
        <SubmitModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          variant="dangerous"
          title="Delete comment?"
          description="This action cannot be undone. The comment will be permanently removed."
          isPending={onDelete.isPending}
          handleSubmit={handleDelete}
        />
      )}
    </div>
  )
}
