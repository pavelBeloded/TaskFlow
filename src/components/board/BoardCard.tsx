import { Trash } from 'lucide-react'
import { parseMonthDay } from '../../utils/date.ts'
import { Button } from '../shared/Button.tsx'
import { useNavigate } from 'react-router'
import { Members } from '../shared/Members.tsx'
import type { Profile } from '../../types'
import { MoreDropdwn } from '../shared/MoreDropdown.tsx'
import { Item } from '@radix-ui/react-dropdown-menu'
import { useDeleteBoard } from '../../hooks/useBoards.ts'

interface BoardCardProps {
  title: string
  createdAt: string | null
  id: string
  profiles: Profile[]
}

export function BoardCard({ title, createdAt, id, profiles }: BoardCardProps) {
  const navigate = useNavigate()
  const deleteBoard = useDeleteBoard()

  function handleDelete() {
    deleteBoard.mutate(id)
  }

  return (
    <div className="bg-surface border-border-strong border-t-accent-border flex w-full max-w-md flex-col items-start gap-4 rounded-lg border-2 border-t-4 p-5">
      <header className="flex w-full items-center justify-between">
        <h3 className="text-text text-md">{title}</h3>
        <MoreDropdwn size={16}>
          <Item
            className={`data-highlighted:bg-sunken text-priority-high flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none`}
            onSelect={handleDelete}
          >
            <Trash size={14} />
            Delete
          </Item>
        </MoreDropdwn>
      </header>
      <div className="flex w-full items-center justify-between">
        <Members profiles={profiles} show={3} />
        <p className="text-text-muted text-sm">
          Created {parseMonthDay(createdAt)}
        </p>
      </div>
      <Button
        onClick={() => {
          navigate(`/board/${id}`)
        }}
        text="Open board"
        variant="outline"
        className="w-full"
      />
    </div>
  )
}
